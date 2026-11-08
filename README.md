# makecu_26

Pill-dispenser prototype: an ESP32 drives a stepper motor and a servo, controlled from a web app through Firebase.

## Layout

| Folder | What it is | Who works on it |
|---|---|---|
| `firmware/servo_control/` | ESP32 sketch (Arduino IDE, board: ESP32 Dev Module) | firmware / backend |
| `frontend/` | The real web app (create this folder when you push; it is reserved for the frontend owner) | frontend |
| `frontend-temp/` | Temporary placeholder app used for testing the firmware. **Delete it** once `frontend/` is ready. | firmware owner |
| `docs/` | Shared documents, including the data contract | both |

The two sides only communicate through Firebase. The paths and rules are documented in [`docs/firebase-contract.md`](docs/firebase-contract.md). Please keep that contract in sync if either side changes.

## Firmware setup

1. Install the `ESP32Servo` and `Stepper` libraries (Arduino IDE Library Manager).
2. Copy `firmware/servo_control/secrets.example.h` to `secrets.h` and fill in your WiFi, database URL and ntfy topic. `secrets.h` is git-ignored, so don't commit it.
3. Upload `servo_control.ino` to the ESP32.

## Frontend setup

Put your app in `frontend/`. Read [`docs/firebase-contract.md`](docs/firebase-contract.md) first. A working example page that follows it (stepper and servo inputs, a send button, and the status line) is in git history: `git show 6bddf69:frontend-temp/index.html`.
