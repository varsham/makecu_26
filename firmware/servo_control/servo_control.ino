// ESP32 + Firebase Realtime Database servo control.
//
// How it works:
//   - The web app writes a new number (a timestamp) to /device/trigger.
//   - This sketch polls that value. When it changes, the servo moves.
//   - The sketch reports "moving" / "ready" to /device/status so the app can show it.
//
// Libraries to install (Library Manager): ESP32Servo
// Board: ESP32 Dev Module

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>
#include "secrets.h"   // WIFI_SSID, WIFI_PASS, DB_URL

const int SERVO_PIN = 18;            // change to the GPIO your servo signal wire is on
const int REST_ANGLE = 0;
const int ACTIVE_ANGLE = 90;
const unsigned long POLL_MS = 700;   // how often to check Firebase

Servo servo;
WiFiClientSecure secureClient;
HTTPClient http;

String lastTrigger = "";
bool primed = false;                 // true once we've read the initial value
unsigned long lastPoll = 0;

String dbUrl(const char* path) {
  return String(DB_URL) + path + ".json";
}

bool dbGet(const char* path, String &out) {
  http.begin(secureClient, dbUrl(path));
  int code = http.GET();
  if (code == 200) out = http.getString();
  http.end();
  return code == 200;
}

void dbPut(const char* path, const String &jsonBody) {
  http.begin(secureClient, dbUrl(path));
  http.addHeader("Content-Type", "application/json");
  http.PUT(jsonBody);
  http.end();
}

void moveServo() {
  Serial.println("Moving servo");
  dbPut("/device/status", "\"moving\"");
  servo.write(ACTIVE_ANGLE);
  delay(800);
  servo.write(REST_ANGLE);
  delay(800);
  dbPut("/device/status", "\"ready\"");
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

void setup() {
  Serial.begin(115200);

  servo.setPeriodHertz(50);
  servo.attach(SERVO_PIN, 500, 2400);
  servo.write(REST_ANGLE);

  connectWiFi();

  // NOTE: setInsecure() skips certificate checking. Fine for a demo,
  // but pin the certificate before using this for anything real.
  secureClient.setInsecure();
  http.setReuse(true);               // keep the TLS connection open between polls

  dbPut("/device/status", "\"ready\"");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost, reconnecting");
    WiFi.reconnect();
    delay(2000);
    return;
  }

  if (millis() - lastPoll < POLL_MS) return;
  lastPoll = millis();

  String trigger;
  if (!dbGet("/device/trigger", trigger)) {
    Serial.println("Firebase read failed");
    return;
  }

  if (!primed) {
    // First read after boot: remember it, but don't move the servo.
    lastTrigger = trigger;
    primed = true;
    return;
  }

  if (trigger != lastTrigger) {
    lastTrigger = trigger;
    moveServo();
  }
}
