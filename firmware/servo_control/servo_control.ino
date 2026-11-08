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

// positions to represent various compartments
// 0 to 1022 (stepper motor position)
int compartments[3] = {170, 510, 850};

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
  int dir = 1;
  if (rPos > pos) dir *= -1;
  while (rPos != pos) {
    rStep(dir);
  }
}

// TODO:
// Jam mechanism: void fixJam()

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
  if (duration == 0) return false;         // no echo, so nothing detected

  // sound travels about 0.0343 cm per microsecond, and the wave goes out AND back,
  // so the one-way distance is half of (time * speed)
  float distance = duration * 0.0343 / 2;
  Serial.printf("Ultrasonic: %.1f cm\n", distance);

  return distance <= dist;
}

// COMBINED FUNCTIONS

// TODO: opening the door by changing the servo motor position
void openDoor() {
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
  int sPos = s.read();
  if (sPos < 50) {
    Serial.println("Door already closed.");
  } else {
    sToPos(10);
    Serial.println("Door closed.");
  }
}

// TODO: pill release mechanism function
void pillRelease() {
  openDoor();
  closeDoor();

  // check if the pill was successfully released using the ultrasonic sensor


  Serial.println();
}

// TODO: shifting to a specific compartment
void toCompartment(int c) {
  // parameter: which compartment number, 1-indexed
  rToPos(compartments[c - 1]);
  notify("To compartment", "Rotated to specified compartment.", "arrow_forward");  // ...while this ~1 s request runs
  Serial.printf("Rotated to compartment %d\n", c);
}

// Moves both motors to the requested targets, then reports where they ended up.
void moveMotors(int rTarget, int sTarget) {
  // Keep the requests inside what the hardware can do.
  sTarget = constrain(sTarget, 0, 180);
  rTarget = constrain(rTarget, 0, 1022);
  rTarget -= rTarget % 2;                  // odd positions can't be reached, so round down to even

  Serial.printf("Moving: stepper %d -> %d, servo %d -> %d\n", rPos, rTarget, sPos, sTarget);
  dbPut("/device/status", "\"moving\"");

  sToPos(sTarget);                         // servo starts moving right away...
  notify("Motors started", "The motors are moving.", "arrow_forward");  // ...while this ~1 s request runs
  rToPos(rTarget);                         // blocks until the stepper has arrived

  Serial.printf("Final positions -> stepper: %d, servo: %d degrees\n", rPos, sPos);

  dbPut("/device/status", "\"ready\"");
  char msg[64];
  snprintf(msg, sizeof(msg), "Stepper at %d, servo at %d deg.", rPos, sPos);
  notify("Motors stopped", msg, "white_check_mark");
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

  // 5. If the value is different from last time, the app was tapped:
  //    remember the new value, read the two targets, and move both motors.
  if (trigger != lastTrigger) {
    lastTrigger = trigger;
    int rTarget, sTarget;
    if (dbGetInt("/device/stepperTarget", rTarget) && dbGetInt("/device/servoAngle", sTarget)) {
      moveMotors(rTarget, sTarget);
    } else {
      Serial.println("Couldn't read stepperTarget/servoAngle - ignoring this trigger");
    }
  }
}
