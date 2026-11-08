# makecu_26

Pill-dispenser prototype: an ESP32 drives a stepper motor and a servo, controlled from a web app through Firebase.

## Layout

| Folder | What it is | Who works on it |
|---|---|---|
| `firmware/servo_control/` | ESP32 sketch (Arduino IDE, board: ESP32 Dev Module) | firmware / backend |
| `frontend/` | The Sprout app: the design system plus a click-through app in `ui_kits/sprout-app/`, extracted from `sprout_design_system.zip` | frontend |
| `docs/` | Shared documents, including the data contract | both |
| `sprout_design_system.zip` | The design system as delivered (kept as the original source for `frontend/`) | frontend |

The two sides only communicate through Firebase. The paths and rules are documented in [`docs/firebase-contract.md`](docs/firebase-contract.md). Please keep that contract in sync if either side changes.

## Firmware setup

1. Install the `ESP32Servo` and `Stepper` libraries (Arduino IDE Library Manager).
2. Copy `firmware/servo_control/secrets.example.h` to `secrets.h` and fill in your WiFi, database URL and ntfy topic. `secrets.h` is git-ignored, so don't commit it.
3. Upload `servo_control.ino` to the ESP32.

## Frontend

The app is `frontend/ui_kits/sprout-app/index.html`. Keep the folder layout intact, because the page loads files from `../../` (`styles.css`, `_ds_bundle.js`, `assets/`).

Run it locally (it needs a web server, not a double-click):

```
cd frontend
python3 -m http.server
```

Then open http://localhost:8000. It starts in **demo mode**, which simulates the device and never moves the real machine. To talk to the real device, call `SproutDevice.connect(firebaseConfig)` (see `frontend/ui_kits/sprout-app/sproutDevice.js`) with the Firebase web config from the Firebase console.

Deploy to Firebase Hosting from `frontend/`:

```
cd frontend
firebase deploy --only hosting
```

`frontend/index.html` just redirects the site root to the app.

### Known gaps between the app and the firmware

- The app's adapter assumes **8 compartments** evenly spaced and a servo drop angle of **90°**. The firmware has **3 compartments** (positions 170, 510, 850) and a door that opens at 170° and closes at 10°.
- The firmware can write the status `"jam"`. The adapter only understands `"ready"` and `"moving"`, so it would wait forever after a jam.
- The app can't trigger `pillRelease()` yet; it only sends "move the stepper and servo here".
- Nothing counts pills down on the device, so "pills left" in the app is not updated by real dispenses.

The earlier plain test page that followed the contract is in git history: `git show 6bddf69:frontend-temp/index.html`.
