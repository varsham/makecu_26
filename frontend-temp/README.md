# frontend-temp (temporary)

A quick placeholder web app so the firmware could be tested end to end. **This folder is meant to be deleted** once the real frontend is in `../frontend/`.

The data contract (Firebase paths and rules) lives in [`../docs/firebase-contract.md`](../docs/firebase-contract.md), not here, so deleting this folder doesn't remove it.

## Files

- `index.html`: the whole app (HTML, CSS, JS). Loads the Firebase SDK from a CDN, so there is no build step.
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
