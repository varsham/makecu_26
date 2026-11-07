# makecu_26

Pill-dispenser prototype: an ESP32 drives a stepper motor and a servo, controlled from a web app through Firebase.

## Layout

| Folder | What it is | Who works on it |
|---|---|---|
| `firmware/servo_control/` | ESP32 sketch (Arduino IDE, board: ESP32 Dev Module) | firmware / backend |
| `frontend/` | Web app and Firebase Hosting config | frontend |

The two sides only communicate through Firebase. The data paths and rules are documented in [`frontend/README.md`](frontend/README.md). Please keep that contract in sync if either side changes.

## Firmware setup

1. Install the `ESP32Servo` and `Stepper` libraries (Arduino IDE Library Manager).
2. Copy `firmware/servo_control/secrets.example.h` to `secrets.h` and fill in your WiFi, database URL and ntfy topic. `secrets.h` is git-ignored, so don't commit it.
3. Upload `servo_control.ino` to the ESP32.

## Frontend setup

See [`frontend/README.md`](frontend/README.md).
