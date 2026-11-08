// ESP32 + Firebase Realtime Database stepper + servo control.
//
// Big picture:
//   - The web app writes three values to Firebase in one update:
//       /device/stepperTarget  (stepper position, 0-1022)
//       /device/servoAngle     (servo angle, 0-180)
//       /device/trigger        (a new timestamp = "go")
//   - This sketch checks /device/trigger over and over ("polling").
//   - When it changes, it reads the two targets and moves both motors.
//   - It writes "moving" / "ready" to /device/status so the app can show it,
//     and prints the final positions to the Serial Monitor.
//
// Libraries to install (Library Manager): ESP32Servo
// Board: ESP32 Dev Module

#include <WiFi.h>              // connects the ESP32 to WiFi
#include <WiFiClientSecure.h>  // lets the ESP32 make HTTPS (encrypted) connections
#include <HTTPClient.h>        // makes HTTP requests (GET, PUT) for us
#include <Stepper.h>           // stepper control
#include <ESP32Servo.h>        // servo control that works on the ESP32
#include "secrets.h"           // your private settings: WIFI_SSID, WIFI_PASS, DB_URL, NTFY_TOPIC

const unsigned long POLL_MS = 700;   // how often to check Firebase (milliseconds)

// state: contains the current state of the machine
// 0 - REST: nothing happening
// 1 - ROTATION_JAM: machine is jammed at the rotation step
// 2 - DOOR_JAM: machine is jammed at the door opening step
// 3 - CHOOSING_PILL: machine is rotating to choose a pill
// 4 - OPENING_DOOR: machine is opening the door to let the pill through
int state = 0; // set it initially to REST

// Time limits for jam detection (milliseconds). Measure your real timings and adjust.
const unsigned long ROTATION_TIMEOUT_MS = 12000;  // a full-range stepper move takes ~6 s, so allow 2x
const unsigned long DOOR_TIMEOUT_MS = 3000;       // how long to wait for the pill to be seen after the door opens
const unsigned long FIX_TIMEOUT_MS = 5000;        // how long fixJam() keeps retrying before giving up
const int PILL_DIST_CM = 200;                     // "pill detected" distance for the ultrasonic sensor (cm); adjust to your chute

// Declared here because rToPos() and waitForPill() use it before it is defined below.
bool checkForJam(int state, unsigned long start);

// positions to represent various compartments
// 0 to 1022 (stepper motor position)
int compartments[3] = {170, 510, 850};
const int NUM_COMPARTMENTS = sizeof(compartments) / sizeof(compartments[0]);   // 3

// Stepper motor settings
const int r1 = 25;
const int r2 = 32;
const int r3 = 33;
const int r4 = 26;

// Servo motor settings
const int sPin = 13;

// Ultrasonic sensor settings
const int trigPin = 12;
const int echoPin = 14;

// ---------- Global objects and state ----------
Stepper r(512, r1, r2, r3, r4);
int rPos = 0;                        // current stepper position (0-1023); 0 = where it was at power-on
int rTargetPos = 0;                  // where the last rotation was supposed to end up
Servo s;
int sPos = 0;                        // current servo angle in degrees
WiFiClientSecure secureClient;       // the encrypted connection used for all requests
HTTPClient http;                     // the helper that sends the requests

String lastTrigger = "";             // the most recent trigger value we've seen
bool primed = false;                 // becomes true after the first read following boot
unsigned long lastPoll = 0;          // time (millis) of the last Firebase check

// Builds a full Firebase REST URL.
// Example: dbUrl("/device/trigger") -> "<DB_URL>/device/trigger.json"
// Firebase's REST API needs ".json" on the end of the path.
String dbUrl(const char* path) {
  return String(DB_URL) + path + ".json";
}

// Reads the value at a database path. Returns true on success and puts the
// result in `out`. For a number, out is something like "1731234567890".
// If nothing is stored there yet, Firebase returns the text "null".
bool dbGet(const char* path, String &out) {
  http.begin(secureClient, dbUrl(path));   // set up the request
  int code = http.GET();                   // send it; code 200 means success
  if (code == 200) out = http.getString(); // grab the response body
  http.end();                              // finish this request
  return code == 200;
}

// Like dbGet, but for a whole number. Returns false if the read failed
// or nothing is stored there yet.
bool dbGetInt(const char* path, int &out) {
  String raw;
  if (!dbGet(path, raw) || raw == "null") return false;
  out = raw.toInt();
  return true;
}

// Writes a value to a database path. `jsonBody` must be valid JSON, so a
// string needs its own quotes, e.g. "\"ready\"". PUT replaces whatever was there.
void dbPut(const char* path, const String &jsonBody) {
  http.begin(secureClient, dbUrl(path));
  http.addHeader("Content-Type", "application/json");
  http.PUT(jsonBody);
  http.end();
}

// Sends a push notification to your phone through ntfy.sh.
// Anyone subscribed to NTFY_TOPIC in the ntfy app receives it.
// A fresh connection is used each time (ntfy is a different server than
// Firebase, so we can't reuse the Firebase connection). Keep title/message plain ASCII.
void notify(const char* title, const char* message, const char* tag) {
  WiFiClientSecure client;
  client.setInsecure();                    // demo only, same caveat as above
  HTTPClient n;
  n.setTimeout(5000);                      // give up after 5 s so a failure can't hang the motors
  n.begin(client, String("https://ntfy.sh/") + NTFY_TOPIC);
  n.addHeader("Title", title);             // bold heading of the notification
  n.addHeader("Tags", tag);                // ntfy turns tag names into emoji icons
  int code = n.POST(message);              // the message text is the request body
  Serial.printf("ntfy \"%s\" -> HTTP %d\n", title, code);   // 200 means it was sent
  n.end();
}

// STEPPER MOTOR FUNCTIONS
// Moves one notch: 2 steps forward (dir = 1) or backward (dir = -1).
void rStep(int dir) {
  r.step(2 * dir);
  rPos += (2 * dir);
  rPos %= 1024;
}

// must be accurate; determines rotation so the holes for the pills to fall out align
// `pos` must be an even number from 0 to 1022 (the stepper moves 2 steps at a time).
void rToPos(int pos) {
  rTargetPos = pos;                        // remember the goal so fixJam() knows what "right spot" means
  int dir = 1;
  if (rPos > pos) dir *= -1;
  state = 3;                               // CHOOSING_PILL: the machine is rotating
  unsigned long start = millis();          // when this rotation began
  while (rPos != pos) {
    // stop if the rotation is taking far too long (this sets state to 1 = ROTATION_JAM)
    if (checkForJam(3, start)) return;
    rStep(dir);
  }
  state = 0;                               // arrived with no jam: back to REST
}

// Detect a jam by timing.
// `state` is the activity in progress (3 = CHOOSING_PILL, 4 = OPENING_DOOR) and
// `start` is the millis() value from when that activity began.
// Returns true if it has run longer than its time limit. In that case it also
// records the jam in the global state (1 = ROTATION_JAM, 2 = DOOR_JAM), and
// reports it to the app and your phone.
//
// Note: this catches "took too long". It cannot see a stepper that skips steps,
// because step() takes the same time whether the motor turns or not.
bool checkForJam(int state, unsigned long start) {
  unsigned long elapsed = millis() - start;   // stays correct even when millis() wraps around

  int jam = 0;
  if (state == 3 && elapsed > ROTATION_TIMEOUT_MS) jam = 1;      // rotation too slow
  else if (state == 4 && elapsed > DOOR_TIMEOUT_MS) jam = 2;     // pill never seen after door opened
  if (jam == 0) return false;

  ::state = jam;                              // "::state" is the global; the parameter above hides it
  Serial.printf("JAM detected (state %d) after %lu ms\n", jam, elapsed);
  dbPut("/device/status", "\"jam\"");
  notify("Jam detected",
         jam == 1 ? "The rotation is jammed." : "The pill did not drop after the door opened.",
         "warning");
  return true;
}

// Is the machine in the right spot for the last rotation?
// LIMITATION: rPos is a counter that rStep() updates every time it is told to move,
// whether or not the motor really turned. So this only tells us the code finished
// counting, not where the hardware physically is. To make it a real check, replace the
// comparison below with a reading from a position sensor (home switch, hall sensor, encoder).
bool atRightPosition() {
  return rPos == rTargetPos;
}

// Tries to clear a jam by retrying until it works or FIX_TIMEOUT_MS (5 s) passes.
// `state` is the jam to fix (1 = ROTATION_JAM, 2 = DOOR_JAM).
// Returns true if the jam was cleared, false if we gave up.
bool fixJam(int state) {
  if (state == 1) {
    // a state of 1 indicates a rotation jam: the machine never reached the right spot.
    // Keep nudging it toward the target, and stop as soon as it is in the right spot.
    unsigned long start = millis();
    int attempts = 0;
    while (millis() - start < FIX_TIMEOUT_MS) {
      if (atRightPosition()) {
        ::state = 0;                       // "::state" is the global; the parameter hides it
        Serial.printf("Rotation jam cleared after %d notches (%lu ms)\n", attempts, millis() - start);
        dbPut("/device/status", "\"ready\"");
        notify("Jam cleared", "The machine reached the right position.", "white_check_mark");
        return true;
      }
      attempts++;
      rStep(rPos < rTargetPos ? 1 : -1);   // one more notch toward the target
    }
    Serial.printf("fixJam gave up after %d notches (%lu ms); position %d, wanted %d\n",
                  attempts, millis() - start, rPos, rTargetPos);
    notify("Jam NOT cleared", "The machine could not reach the right position in 5 seconds.", "rotating_light");
    return false;
  }

  if (state == 2) {
    // a state of 2 indicates a door jam: the pill didn't drop.
    // Shake the door back and forth, checking the sensor after every shake.
    unsigned long start = millis();
    int attempts = 0;
    while (millis() - start < FIX_TIMEOUT_MS) {
      attempts++;
      sToPos(140); delay(150);             // small shake: nudge the door a little...
      sToPos(170); delay(150);             // ...and back to fully open
      if (checkPillReleased(PILL_DIST_CM)) {
        ::state = 0;                       // "::state" is the global; the parameter hides it
        Serial.printf("Jam cleared after %d attempts (%lu ms)\n", attempts, millis() - start);
        dbPut("/device/status", "\"ready\"");
        notify("Jam cleared", "The pill dropped.", "white_check_mark");
        return true;
      }
    }
    Serial.printf("fixJam gave up after %d attempts (%lu ms)\n", attempts, millis() - start);
    notify("Jam NOT cleared", "Could not clear the jam in 5 seconds. Please check the machine.", "rotating_light");
  }
  return false;
}

// SERVO MOTOR FUNCTIONS
// will open and close the door (doesn't need to be super accurate)
void sToPos(int pos) {
  s.write(pos);
  sPos = pos;
}

// ULTRASONIC SENSOR FUNCTIONS
// Returns true if something is detected within `dist` centimeters in front of the sensor.
// Returns false if nothing is that close (or if no echo comes back at all).
bool checkPillReleased(int dist) {
  Serial.println("Checking if pill was released properly...");
  // clear the trig pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // send a 10 microsecond pulse; the sensor then sends out an ultrasonic burst
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // read the echoPin: how long (in microseconds) until the sound wave came back.
  // The 25000 us timeout (about 429 cm) stops pulseIn from waiting a full second
  // when nothing reflects the sound; it returns 0 in that case.
  long duration = pulseIn(echoPin, HIGH, 25000);
  if (duration == 0) {
    Serial.println("Error calculating distance.");
    return false;         // no echo, so nothing detected
  }

  // sound travels about 0.0343 cm per microsecond, and the wave goes out AND back,
  // so the one-way distance is half of (time * speed)
  float distance = duration * 0.0343 / 2;
  Serial.printf("Calculated Distance: %.1f cm\n", distance);

  if (distance <= dist) Serial.println("Confirmed pill release.");
  return distance <= dist;
}

// COMBINED FUNCTIONS

// TODO: opening the door by changing the servo motor position
void openDoor() {
  state = 4;                               // OPENING_DOOR: stays 4 until the pill is seen (or a jam is flagged)
  Serial.println("Starting process to open door...");
  int sPos = s.read();
  // check if door is already open
  if (sPos > 130) {
    Serial.println("Door already open.");
  } else {
    sToPos(170);
    Serial.println("Door opened.");
  }
}

// TODO: closing the door by changing the servo motor position
void closeDoor() {
  Serial.println("Starting process to close door...");
  int sPos = s.read();
  if (sPos < 50) {
    Serial.println("Door already closed.");
  } else {
    sToPos(10);
    Serial.println("Door closed.");
  }
}

// Keeps checking the ultrasonic sensor until it sees the pill.
// Returns true if the pill was seen, or false if DOOR_TIMEOUT_MS passed first (a door jam).
bool waitForPill(int dist) {
  Serial.println("Waiting for pill...");
  unsigned long start = millis();          // when we started waiting
  while (!checkPillReleased(dist)) {
    if (checkForJam(4, start)) return false;   // 4 = OPENING_DOOR; waited too long
    delay(50);                                 // pause between sensor readings
  }
  return true;
}

// Pill release mechanism: opens the door, waits for the ultrasonic sensor to see the
// pill (trying to clear a jam if it doesn't), then closes the door.
// Returns true if the pill was seen, false if it never dropped.
bool pillRelease() {
  Serial.println("Starting process to release pill...");
  openDoor();

  // keep the door open until the ultrasonic sensor sees the pill (or time runs out)
  bool released = waitForPill(PILL_DIST_CM);
  if (!released) released = fixJam(state);   // state is 2 (door jam) here; the door is still open so it can be shaken

  closeDoor();
  if (released) {
    state = 0;                             // pill dropped: back to REST
    Serial.println("Pill successfully dispensed.");
  } else {
    // state stays 2 (DOOR_JAM) so the problem remains visible
    Serial.println("Error with dispensing pill.");
  }
  return released;
}

// TODO: shifting to a specific compartment
void toCompartment(int c) {
  // parameter: which compartment number, 1-indexed
  rToPos(compartments[c - 1]);
  if (state == 1 || state == 2) return;    // a jam was reported, so we didn't actually arrive
  notify("To compartment", "Rotated to specified compartment.", "arrow_forward");  // ...while this ~1 s request runs
  Serial.printf("Rotated to compartment %d\n", c);
}

// Moves both motors to the requested targets, then reports where they ended up.
void moveMotors(int rTarget, int sTarget) {
  // Keep the requests inside what the hardware can do.
  sTarget = constrain(sTarget, 0, 180);
  rTarget = constrain(rTarget, 0, 1022);
  rTarget -= rTarget % 2;                  // odd positions can't be reached, so round down to even

  state = 0;                               // clear any earlier jam before starting a new move
  Serial.printf("Moving: stepper %d -> %d, servo %d -> %d\n", rPos, rTarget, sPos, sTarget);
  dbPut("/device/status", "\"moving\"");

  sToPos(sTarget);                         // servo starts moving right away...
  notify("Motors started", "The motors are moving.", "arrow_forward");  // ...while this ~1 s request runs
  rToPos(rTarget);                         // blocks until the stepper has arrived
  if (state == 1 || state == 2) return;    // a jam was reported; don't overwrite "jam" with "ready"

  Serial.printf("Final positions -> stepper: %d, servo: %d degrees\n", rPos, sPos);

  dbPut("/device/status", "\"ready\"");
  char msg[64];
  snprintf(msg, sizeof(msg), "Stepper at %d, servo at %d deg.", rPos, sPos);
  notify("Motors stopped", msg, "white_check_mark");
}

// Tells the app how a dispense turned out. The app matches it to its request by the
// trigger value, so write it BEFORE the status goes back to "ready".
void writeResult(int c, bool dispensed) {
  String body = String("{\"trigger\":") + lastTrigger + ",\"compartment\":" + c +
                ",\"dispensed\":" + (dispensed ? "true" : "false") + "}";
  dbPut("/device/result", body);
}

// Rotates to compartment `c` (1 to NUM_COMPARTMENTS) and releases one pill, then
// reports the result and status to the app.
void dispenseFromCompartment(int c) {
  if (c < 1 || c > NUM_COMPARTMENTS) {
    Serial.printf("Dispense ignored: compartment %d doesn't exist (1 to %d)\n", c, NUM_COMPARTMENTS);
    writeResult(c, false);
    return;
  }

  state = 0;                               // clear any earlier jam before starting
  Serial.printf("Dispense requested: compartment %d\n", c);
  dbPut("/device/status", "\"moving\"");

  toCompartment(c);                        // rotate (state becomes 1 if the rotation jams)
  bool released = false;
  if (state != 1 && state != 2) released = pillRelease();   // only open the door if we arrived

  writeResult(c, released);                // before "ready", so the app can match it up
  if (released) {
    dbPut("/device/status", "\"ready\"");
    char msg[64];
    snprintf(msg, sizeof(msg), "Pill released from compartment %d.", c);
    notify("Pill dispensed", msg, "pill");
  }
  // If it wasn't released, the jam code has already set the status to "jam" and notified you.
  Serial.printf("Dispense result: compartment %d, dispensed = %s\n", c, released ? "yes" : "no");
}

// Connects to your WiFi network and waits until it succeeds.
// The ESP32 only supports 2.4 GHz networks.
void connectWiFi() {
  WiFi.mode(WIFI_STA);                     // station mode: act as a WiFi client
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {  // print a dot every half second until connected
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

// Runs once when the board powers on or resets.
void setup() {
  Serial.begin(115200);                    // open the Serial Monitor connection

  // set up ultrasonic sensor
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // set up the stepper motor
  pinMode(r1, OUTPUT);
  pinMode(r2, OUTPUT);
  pinMode(r3, OUTPUT);
  pinMode(r4, OUTPUT);
  r.setSpeed(20);

  // set up the servo motor
  s.setPeriodHertz(50);                    // standard hobby servos expect a 50 Hz signal
  s.attach(sPin, 500, 2400);               // pulse range in microseconds
  sToPos(0);                               // start at 0 degrees

  connectWiFi();

  // NOTE: setInsecure() skips certificate checking. Fine for a demo,
  // but pin the certificate before using this for anything real.
  secureClient.setInsecure();
  http.setReuse(true);                     // keep the connection open between polls (faster)

  dbPut("/device/dispenseCompartment", "null");   // forget any dispense command left over from before a reset
  dbPut("/device/status", "\"ready\"");    // tell the app we're online
  Serial.printf("Start positions -> stepper: %d, servo: %d degrees\n", rPos, sPos);
}

// Runs over and over, forever, after setup().
void loop() {
  // clear the ultrasonic sensor trig pin


  // 1. If WiFi dropped, try to reconnect and skip this pass.
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost, reconnecting");
    WiFi.reconnect();
    delay(2000);
    return;
  }

  // 2. Only check Firebase every POLL_MS milliseconds. (We use millis()
  //    instead of delay() so the loop never gets stuck waiting.)
  if (millis() - lastPoll < POLL_MS) return;
  lastPoll = millis();

  // 3. Read the current trigger value from Firebase.
  String trigger;
  if (!dbGet("/device/trigger", trigger)) {
    Serial.println("Firebase read failed");
    return;
  }

  // 4. First successful read after boot: just remember the value. Without
  //    this, the motors would move at every restart because an old trigger
  //    is still stored in the database.
  if (!primed) {
    lastTrigger = trigger;
    primed = true;
    return;
  }

  // 5. If the value is different from last time, the app sent a command.
  //    A dispense command (dispenseCompartment) rotates to that compartment and releases a pill.
  //    Otherwise it is a plain move: read the two targets and move both motors.
  if (trigger != lastTrigger) {
    lastTrigger = trigger;
    int compartment, rTarget, sTarget;
    if (dbGetInt("/device/dispenseCompartment", compartment)) {
      dbPut("/device/dispenseCompartment", "null");   // consume the command so it can't run twice
      dispenseFromCompartment(compartment);
    } else if (dbGetInt("/device/stepperTarget", rTarget) && dbGetInt("/device/servoAngle", sTarget)) {
      moveMotors(rTarget, sTarget);
    } else {
      Serial.println("Couldn't read a command (dispenseCompartment, or stepperTarget + servoAngle) - ignoring this trigger");
    }
  }
}