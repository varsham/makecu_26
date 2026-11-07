# Frontend

A single-page web app that lets a user pick a stepper position and a servo angle and send them to the device. It talks to the device only through the Firebase Realtime Database. There is no direct connection to the ESP32.

Everything you need is in this folder. You don't need to touch `../firmware/`.

## Files

- `index.html`: the whole app (HTML, CSS, JS). Loads the Firebase SDK from a CDN, so there is no build step.
- `firebase.json`, `.firebaserc`: Firebase Hosting config, so you can deploy from this folder.

## Run it locally

```
cd frontend
python3 -m http.server
```

Open http://localhost:8000. The page talks to the real Firebase database, so a connected device will actually move.

## Deploy

```
cd frontend
firebase login          # first time only
firebase deploy --only hosting
```

Live URL: https://sprout-makecu26.web.app

## The data contract (please don't change this without telling the firmware owner)

The device and this app communicate through these paths in the Realtime Database:

| Path | Written by | Value | Meaning |
|---|---|---|---|
| `/device/stepperTarget` | app | whole number, **even**, 0 to 1022 | Target stepper position (1024 = one full turn) |
| `/device/servoAngle` | app | whole number, 0 to 180 | Target servo angle in degrees |
| `/device/trigger` | app | `Date.now()` (a number) | A **new value means "go"**. The device ignores everything until this changes. |
| `/device/status` | device | `"ready"` or `"moving"` | Shown in the app; the button is disabled while `"moving"` |

Rules to keep working:

1. **Write the three app values in one `update()` call**, as `index.html` does. The device reads the two targets as soon as it sees a new `trigger`, so they must already be there.
2. `trigger` must be a different value on every send (a timestamp is fine).
3. The device only reaches even stepper positions. Odd values are rounded down.
4. The app only reads `status`. Never write it.

If you want to change any of this (new fields, different ranges, new status values), message the firmware owner first. The ESP32 code has to change with it.

## Notes

- The `firebaseConfig` in `index.html` is a public web config, and it is meant to be in the page. What protects the data is the database rules, which are currently in **test mode (open to anyone)**. Fine for a demo, but add authentication and rules before real use.
- The device sends its own push notifications through ntfy.sh. The frontend doesn't need to do anything for those.
