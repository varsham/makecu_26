# Firebase data contract

The firmware and the frontend only talk to each other through the Firebase Realtime Database. There is no direct connection to the ESP32. This file is the agreement between the two sides.

Database URL: `https://sprout-makecu26-default-rtdb.firebaseio.com`

| Path | Written by | Value | Meaning |
|---|---|---|---|
| `/device/dispenseCompartment` | app | whole number, 1 to 3 | **Dispense command.** Rotate to this compartment and release one pill. The device deletes it once it has read it. |
| `/device/stepperTarget` | app | whole number, **even**, 0 to 1022 | Move command: target stepper position (1024 = one full turn) |
| `/device/servoAngle` | app | whole number, 0 to 180 | Move command: target servo angle in degrees |
| `/device/trigger` | app | `Date.now()` (a number) | A **new value means "go"**. The device ignores everything until this changes. |
| `/device/status` | device | `"ready"`, `"moving"` or `"jam"` | Show it in the app; disable the send button while `"moving"`. `"jam"` means the device gave up on a move or a dispense; it clears on the next successful one. |
| `/device/result` | device | `{ "trigger": <number>, "compartment": <number>, "dispensed": true or false }` | The outcome of a **dispense** command. `trigger` echoes the trigger it answers, so the app can match it to its request. `dispensed` is true only if the ultrasonic sensor saw the pill drop. |

## Two kinds of command

Every command is a new `trigger`. The device then looks at what else was written:

1. **Dispense** (what the Sprout app uses): write `dispenseCompartment` and `trigger` in one `update()`.
   The device rotates to that compartment, releases a pill, writes `result`, then sets `status` to `ready` (or `jam` if the pill never dropped).
2. **Move** (low-level, for testing): write `stepperTarget`, `servoAngle` and `trigger` in one `update()`.
   The device moves both motors there and sets `status` to `ready`. It does not write `result`.

If `dispenseCompartment` is present when the trigger changes, the dispense command wins.

## Rules to keep working

1. **Write all the values of one command, plus `trigger`, in one `update()` call.** The device reads the other values as soon as it sees a new `trigger`, so they must already be there.
2. `trigger` must be a different value on every send (a timestamp is fine).
3. For a dispense, **wait for `result` with your `trigger`**, not just for `status` to become `ready`. A dispense that failed shows `dispensed: false`, and `status` stays `"jam"`.
4. The device only reaches even stepper positions. Odd values are rounded down.
5. The app only reads `status` and `result`. Never write them.

If either side wants to change any of this (new fields, different ranges, new status values), tell the other person first. The ESP32 code or the frontend has to change with it.

## Notes

- The `firebaseConfig` in a web page is a public web config, and it is meant to be there. What protects the data is the database rules, which are currently in **test mode (open to anyone)**. Fine for a demo, but add authentication and rules before real use.
- The device sends its own push notifications through ntfy.sh. The frontend doesn't need to do anything for those.
- A working example page for the **move** command (stepper and servo inputs, a send button, and the status line) is in git history: `git show 6bddf69:frontend-temp/index.html`. The dispense command is implemented in `frontend/ui_kits/sprout-app/sproutDevice.js`.
