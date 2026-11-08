# Firebase data contract

The firmware and the frontend only talk to each other through the Firebase Realtime Database. There is no direct connection to the ESP32. This file is the agreement between the two sides.

Database URL: `https://sprout-makecu26-default-rtdb.firebaseio.com`

| Path | Written by | Value | Meaning |
|---|---|---|---|
| `/device/stepperTarget` | app | whole number, **even**, 0 to 1022 | Target stepper position (1024 = one full turn) |
| `/device/servoAngle` | app | whole number, 0 to 180 | Target servo angle in degrees |
| `/device/trigger` | app | `Date.now()` (a number) | A **new value means "go"**. The device ignores everything until this changes. |
| `/device/status` | device | `"ready"`, `"moving"` or `"jam"` | Show it in the app; disable the send button while `"moving"`. `"jam"` means the device gave up on a move; it clears on the next successful move. |

## Rules to keep working

1. **Write the three app values in one `update()` call.** The device reads the two targets as soon as it sees a new `trigger`, so they must already be there.
2. `trigger` must be a different value on every send (a timestamp is fine).
3. The device only reaches even stepper positions. Odd values are rounded down.
4. The app only reads `status`. Never write it.

If either side wants to change any of this (new fields, different ranges, new status values), tell the other person first. The ESP32 code or the frontend has to change with it.

## Notes

- The `firebaseConfig` in a web page is a public web config, and it is meant to be there. What protects the data is the database rules, which are currently in **test mode (open to anyone)**. Fine for a demo, but add authentication and rules before real use.
- The device sends its own push notifications through ntfy.sh. The frontend doesn't need to do anything for those.
- A working example page that follows this contract (stepper and servo inputs, a send button, and the status line) is in git history: `git show 6bddf69:frontend-temp/index.html`.
