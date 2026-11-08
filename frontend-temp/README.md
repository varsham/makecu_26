# frontend-temp (temporary)

A placeholder web page. **This folder is meant to be deleted** once the real frontend is in `../frontend/`.

Right now it has:

- a **Dispense** button at the top (a placeholder for now: it only shows a message and doesn't talk to the device)
- a repeat-range slider (1 to 8 weeks) with a calendar preview that shows that many weeks
- a **Schedule** tab with an "Add a medicine" form: name, days of the week, optional times per day, optional time of day (a set time or Manual), and optional pill count
- a **My Pills** tab listing the saved medicines. Click one to open its summary: name, pills left, days, times per day, and time of day.

It is **not connected to Firebase or the device**, and saved medicines are kept in memory only, so they are lost when the page reloads.

The data contract (Firebase paths and rules) lives in [`../docs/firebase-contract.md`](../docs/firebase-contract.md), not here, so deleting this folder doesn't remove it.

The earlier version of this page, which sent stepper and servo targets to the device, is in git history:

```
git show 6bddf69:frontend-temp/index.html
```

## Files

- `index.html`: the whole page (HTML, CSS, JS). No build step and no external dependencies.
- `firebase.json`, `.firebaserc`: Firebase Hosting config for deploying this folder.

## Run it locally

```
cd frontend-temp
python3 -m http.server
```

Open http://localhost:8000.

## Deploy

```
cd frontend-temp
firebase deploy --only hosting
```

This publishes to https://sprout-makecu26.web.app. The real frontend would deploy to the same address, so only deploy from one folder at a time, or you'll overwrite each other's version.
