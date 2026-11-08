# frontend-temp (temporary)

A placeholder web page. **This folder is meant to be deleted** once the real frontend is in `../frontend/`.

Right now it only has a repeat-range slider (1 to 8 weeks) and a calendar preview that shows that many weeks. It is **not connected to Firebase or the device**.

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
