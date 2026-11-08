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
// Libraries to install (Library Manager): ESP32Servo, ArduinoJson (version 7 or newer)
// Board: ESP32 Dev Module

#include <WiFi.h>              // connects the ESP32 to WiFi
#include <WiFiClientSecure.h>  // lets the ESP32 make HTTPS (encrypted) connections
#include <HTTPClient.h>        // makes HTTP requests (GET, PUT) for us
#include <Stepper.h>           // stepper control
#include <ESP32Servo.h>        // servo control that works on the ESP32
#include <ArduinoJson.h>       // reads the schedule from Firebase (needs version 7 or newer)
#include <time.h>              // the clock, set from the internet
#include "secrets.h"           // your private settings: WIFI_SSID, WIFI_PASS, DB_URL, NTFY_TOPIC
#include "schedule_logic.h"    // the scheduling rules (kept in their own file so they can be tested)

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

// ---------- Scheduled dispensing ----------
// The app saves each medicine's schedule in Firebase (/schedule/c1, /c2, /c3). The board reads it,
// and at each scheduled time dispenses every pill due then, one after another.
const char* TIME_ZONE = "EST5EDT,M3.2.0,M11.1.0";   // Eastern time, with daylight saving
const int DOSE_WINDOW_MIN = 5;                       // a dose is given up to this many minutes after its time; later than that it is skipped
const unsigned long SCHEDULE_REFRESH_MS = 20000;     // how often to re-read the schedule from Firebase

ScheduleEntry sched[NUM_COMPARTMENTS];   // one per compartment (ScheduleEntry is defined in schedule_logic.h)
bool scheduleLoaded = false;
unsigned long lastScheduleFetch = 0;
String handledSlots[16];   // slots (date + time) already dealt with since the board started
int handledNext = 0;

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
  s.write(10);
  for (int i = 10; i < 170; i += 8) {
    s.write(i);
  }
}

// TODO: closing the door by changing the servo motor position
void closeDoor() {
  state = 4;                               // OPENING_DOOR: stays 4 until the pill is seen (or a jam is flagged)
  Serial.println("Starting process to open door...");
  int sPos = s.read();
  // check if door is already open
  s.write(170);
  for (int i = 170; i > 10; i -= 8) {
    s.write(i);
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

// Shifting to a specific compartment. `c` is the compartment number, 1-indexed.
// quiet = true skips the phone notification (used when several pills are dispensed in a row).
void toCompartment(int c, bool quiet) {
  rToPos(compartments[c - 1]);
  if (state == 1 || state == 2) return;    // a jam was reported, so we didn't actually arrive
  if (!quiet) notify("To compartment", "Rotated to specified compartment.", "arrow_forward");  // ...while this ~1 s request runs
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

// Rotates to compartment `c` (1 to NUM_COMPARTMENTS) and releases one pill, then sets the status.
// Returns true if the pill was seen dropping.
//   report = true  writes /device/result for the app, which is waiting for the answer to its request.
//   quiet  = true  skips the per-pill phone notifications (used for scheduled doses, which send one summary).
bool dispenseFromCompartment(int c, bool report, bool quiet) {
  if (c < 1 || c > NUM_COMPARTMENTS) {
    Serial.printf("Dispense ignored: compartment %d doesn't exist (1 to %d)\n", c, NUM_COMPARTMENTS);
    if (report) writeResult(c, false);
    return false;
  }

  state = 0;                               // clear any earlier jam before starting
  Serial.printf("Dispense requested: compartment %d\n", c);
  dbPut("/device/status", "\"moving\"");

  toCompartment(c, quiet);                 // rotate (state becomes 1 if the rotation jams)
  bool released = false;
  if (state != 1 && state != 2) released = pillRelease();   // only open the door if we arrived

  if (report) writeResult(c, released);    // before "ready", so the app can match it up
  if (released) {
    dbPut("/device/status", "\"ready\"");
    if (!quiet) {
      char msg[64];
      snprintf(msg, sizeof(msg), "Pill released from compartment %d.", c);
      notify("Pill dispensed", msg, "pill");
    }
  }
  // If it wasn't released, the jam code has already set the status to "jam" and notified you.
  Serial.printf("Dispense result: compartment %d, dispensed = %s\n", c, released ? "yes" : "no");
  return released;
}

// ---------- Scheduled dispensing ----------

// Reads /schedule from Firebase into sched[]. Returns false if the read failed (the old copy is kept).
bool fetchSchedule() {
  String raw;
  if (!dbGet("/schedule", raw)) return false;
  JsonDocument doc;
  if (raw != "null") {                     // "null" means nothing is scheduled at all
    DeserializationError err = deserializeJson(doc, raw);
    if (err) {
      Serial.printf("Schedule: couldn't read it (%s)\n", err.c_str());
      return false;
    }
  }
  for (int c = 1; c <= NUM_COMPARTMENTS; c++) {
    ScheduleEntry &e = sched[c - 1];
    e.used = false;
    JsonObject o = doc[String("c") + c].as<JsonObject>();
    if (o.isNull()) continue;
    e.used = true;
    e.manual = o["manual"] | false;
    e.days = o["days"] | 0;
    strlcpy(e.times, o["times"] | "", sizeof(e.times));
    strlcpy(e.pausedUntil, o["pausedUntil"] | "", sizeof(e.pausedUntil));
  }
  return true;
}

// Should compartment c's medicine be dispensed today? It must be scheduled, not "manual",
// switched on for today's weekday, and not on a break.
bool dueToday(int c, const char* today, int appDay) {
  return entryDueToday(sched[c - 1], today, appDay);
}

// Does compartment c's medicine have a dose at hhmm ("08:00")?
bool hasTime(int c, const char* hhmm) {
  return entryHasTime(sched[c - 1], hhmm);
}

bool slotHandled(const String &key) {
  for (int i = 0; i < 16; i++) if (handledSlots[i] == key) return true;
  return false;
}

void rememberSlot(const String &key) {
  handledSlots[handledNext] = key;
  handledNext = (handledNext + 1) % 16;
}

// Deals with one scheduled time. onTime = true means it is due now; false means it is too late and is skipped.
// The outcome is recorded in Firebase at /device/done/<date>/<HHMM> so that a restart, or the app's
// own "Dispense now" button, never dispenses the same dose twice.
void handleSlot(const char* today, const char* hhmm, bool onTime, int appDay) {
  char key[5] = { hhmm[0], hhmm[1], hhmm[3], hhmm[4], '\0' };          // "08:00" -> "0800"
  String path = String("/device/done/") + today + "/" + key;

  String existing;
  if (dbGet(path.c_str(), existing) && existing != "null") {
    Serial.printf("Schedule: %s was already handled (%s)\n", hhmm, existing.c_str());
    return;
  }

  char msg[96];
  if (!onTime) {
    dbPut(path.c_str(), "\"missed\"");
    snprintf(msg, sizeof(msg), "The %s dose was too late, so it was skipped. Nothing was dispensed.", hhmm);
    notify("Missed dose", msg, "warning");
    Serial.printf("Schedule: %s is too late, skipped\n", hhmm);
    return;
  }

  int list[NUM_COMPARTMENTS];              // the compartments with a pill due at this time, in order
  int total = 0;
  for (int c = 1; c <= NUM_COMPARTMENTS; c++) {
    if (dueToday(c, today, appDay) && hasTime(c, hhmm)) list[total++] = c;
  }
  if (total == 0) return;

  dbPut(path.c_str(), "\"dispensing\"");   // claim it first, so a restart half way through can't dispense it again
  Serial.printf("Schedule: %s is due, dispensing %d pill(s)\n", hhmm, total);
  snprintf(msg, sizeof(msg), "Dispensing your %s pills (%d).", hhmm, total);
  notify("Dose time", msg, "alarm_clock");

  int given = 0;
  for (int i = 0; i < total; i++) {
    if (!dispenseFromCompartment(list[i], false, true)) break;   // stop at the first pill that doesn't drop
    given++;
  }

  if (given == total) {
    dbPut(path.c_str(), "\"ok\"");
    snprintf(msg, sizeof(msg), "All %d pills for %s were dispensed.", total, hhmm);
    notify("Dose complete", msg, "white_check_mark");
  } else {
    dbPut(path.c_str(), "\"jam\"");
    snprintf(msg, sizeof(msg), "Only %d of %d pills for %s were dispensed. Please check Sprout.", given, total, hhmm);
    notify("Dose incomplete", msg, "rotating_light");
  }
}

// Called on every pass of loop(). Refreshes the schedule now and then, and handles any dose that has come due.
void checkSchedule() {
  if (time(nullptr) < 1700000000) return;  // the clock isn't set yet (the time from the internet hasn't arrived)

  if (!scheduleLoaded || millis() - lastScheduleFetch >= SCHEDULE_REFRESH_MS) {
    lastScheduleFetch = millis();
    if (fetchSchedule()) scheduleLoaded = true;
  }
  if (!scheduleLoaded) return;

  struct tm t;
  if (!getLocalTime(&t, 0)) return;
  char today[11];
  strftime(today, sizeof(today), "%Y-%m-%d", &t);
  int nowMin = t.tm_hour * 60 + t.tm_min;
  int appDay = appWeekday(t.tm_wday);

  // Every distinct time today that has a pill due, earliest first.
  const int MAX_SLOTS = 30;
  char slotText[MAX_SLOTS][6];
  int slotMin[MAX_SLOTS];
  int nSlots = gatherSlots(sched, NUM_COMPARTMENTS, today, appDay, slotText, slotMin, MAX_SLOTS);

  for (int j = 0; j < nSlots; j++) {
    SlotTiming timing = slotTiming(nowMin, slotMin[j], DOSE_WINDOW_MIN);
    if (timing == SLOT_NOT_YET) break;     // sorted, so every later time is not yet either
    String key = String(today) + " " + slotText[j];
    if (slotHandled(key)) continue;
    rememberSlot(key);
    handleSlot(today, slotText[j], timing == SLOT_DUE, appDay);
    return;                                // one time per pass; the next pass picks up any others
  }
}

// Turns a WiFi status number into words, to help find out why a connection is failing.
const char* wifiStatusName(wl_status_t s) {
  switch (s) {
    case WL_NO_SSID_AVAIL:   return "network not found (hotspot off, wrong name, or it is 5 GHz only)";
    case WL_CONNECT_FAILED:  return "connect failed (usually a wrong password)";
    case WL_CONNECTION_LOST: return "connection lost";
    case WL_DISCONNECTED:    return "disconnected / still trying";
    case WL_IDLE_STATUS:     return "idle";
    case WL_SCAN_COMPLETED:  return "scan completed";
    case WL_CONNECTED:       return "connected";
    default:                 return "unknown";
  }
}

// Connects to your WiFi network and waits until it succeeds.
// The ESP32 only supports 2.4 GHz networks.
void connectWiFi() {
  WiFi.mode(WIFI_STA);                     // station mode: act as a WiFi client
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.printf("Connecting to WiFi \"%s\"", WIFI_SSID);   // the network name only, never the password
  unsigned long lastReport = 0;
  while (WiFi.status() != WL_CONNECTED) {  // print a dot every half second until connected
    delay(500);
    Serial.print(".");
    if (millis() - lastReport >= 3000) {   // every 3 seconds, say why it hasn't connected yet
      lastReport = millis();
      wl_status_t st = WiFi.status();
      Serial.printf("\n[WiFi status %d: %s]", (int)st, wifiStatusName(st));
    }
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
  s.attach(sPin, 544, 2400);               // pulse range in microseconds (the standard servo default)
  sToPos(10);                              // start at 10 degrees, the closed-door position (see closeDoor)

  connectWiFi();

  configTzTime(TIME_ZONE, "pool.ntp.org", "time.nist.gov");   // get the time from the internet, in Eastern time

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
    Serial.printf("WiFi lost (status %d: %s), reconnecting\n", (int)WiFi.status(), wifiStatusName(WiFi.status()));
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
      dispenseFromCompartment(compartment, true, false);
    } else if (dbGetInt("/device/stepperTarget", rTarget) && dbGetInt("/device/servoAngle", sTarget)) {
      moveMotors(rTarget, sTarget);
    } else {
      Serial.println("Couldn't read a command (dispenseCompartment, or stepperTarget + servoAngle) - ignoring this trigger");
    }
    return;                                // let the next pass look at the schedule, after this command is finished
  }

  // 6. No command from the app: see whether a scheduled dose has come due.
  checkSchedule();
}