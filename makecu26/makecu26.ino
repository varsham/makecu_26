#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA); // ESP32's station mode
  // board acts like a WiFi client (like a laptop/phone joining a router)
  WiFi.disconnect();

  delay(100);

  int n = WiFi.scanNetworks();
  Serial.printf("%d networks found\n", n);

  for (int i = 0; i < n; i++) {
    Serial.printf("%s   (%d dBm)\n", WiFi.SSID(i).c_str(), WiFi.RSSI(i));
  }
}

void loop() {}
