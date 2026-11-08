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

1. Install the `ESP32Servo`, `Stepper` and `ArduinoJson` (version 7 or newer) libraries (Arduino IDE Library Manager).
2. Copy `firmware/servo_control/secrets.example.h` to `secrets.h` and fill in your WiFi, database URL and ntfy topic. `secrets.h` is git-ignored, so don't commit it.
3. Upload `servo_control.ino` to the ESP32.

**The machine dispenses on its own.** Once the app has saved a schedule, the ESP32 gets the time from the internet (Eastern time) and dispenses each dose at its scheduled time, without the app being open. A dose is given from its time until 5 minutes after it. If the machine misses that window (off, offline, or a jam), the dose is **skipped** and you get a phone notification. It is never dispensed late. See [`docs/firebase-contract.md`](docs/firebase-contract.md) for the details. The scheduling rules are in `firmware/servo_control/schedule_logic.h`, which has no Arduino code so it can be tested on a computer.

## Frontend

The app is `frontend/ui_kits/sprout-app/index.html`. Keep the folder layout intact, because the page loads files from `../../` (`styles.css`, `_ds_bundle.js`, `assets/`).

Run it locally (it needs a web server, not a double-click):

```
cd frontend
python3 -m http.server
```

Then open http://localhost:8000. It starts in **demo mode**, which simulates the device and never moves the real machine.

To control the real machine, open the app with `?live=1` on the end of the address, for example `http://localhost:8000/ui_kits/sprout-app/index.html?live=1`. Then **Dispense** really rotates the stepper, opens the door and waits for the ultrasonic sensor to see the pill. The app shows a message if the pill gets stuck. Without `?live=1` it stays in demo mode, so the deployed site can't move the machine by accident.

In live mode the app **starts with no medicines** (it never loads the demo ones), loads the saved list from Firebase, and saves every change you make. Each save also updates the schedule the machine follows. Add your real medicines in My Pills, and the machine will dispense them at their times. The Today screen uses the real date and time, and shows a dose as taken once the machine has dispensed it.

Deploy to Firebase Hosting from `frontend/`:

```
cd frontend
firebase deploy --only hosting
```

`frontend/index.html` just redirects the site root to the app.

### Known gaps between the app and the firmware

- The machine has **3 compartments**, and the app allows at most **3 medicines** (one per compartment). The limit is `COMPARTMENT_COUNT` in `frontend/ui_kits/sprout-app/data.js`, and the firmware's matching number is `NUM_COMPARTMENTS`. The demo starts with all 3 filled, so the add button is disabled. The app has **no way to remove a medicine yet**. In demo mode a reload brings the demo list back. In live mode the saved list is permanent: to free a compartment you have to delete that medicine from `/pills` and `/schedule` in the Firebase console.
- `PILL_DIST_CM` in the firmware is **200 cm**, so the ultrasonic check counts almost anything as "a pill dropped". Set it to match the chute before trusting a dispense result. This matters more now that the machine dispenses by itself.
- "Pills left" in the app is counted down by the app (only when the device says a pill really dropped), not by the device. Doses the machine dispenses on its own are **not** counted yet.
- The app shows "Up next" as the first dose time not yet dispensed, so a skipped (missed) dose stays there until you dispense it by hand or the day ends.
- The raw **move** command still exists for testing, but the app no longer has a screen for it.

The earlier plain test page that followed the contract is in git history: `git show 6bddf69:frontend-temp/index.html`.
