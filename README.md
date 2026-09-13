# Recover — Stealth Phone Recovery System

This folder is a working scaffold of everything from Phases 1–6 of the build
roadmap. Phases 2 and 7–8 happen on your phone/in Settings, not in code.

```
stealth-recovery/
├── locate.html          ← opened silently on the LOST phone by the Routine
├── firebase-config.js   ← shared config, fill in once, used by both pages
├── firestore.rules      ← who can read/write location + photo data
├── storage.rules        ← who can read/write captured photos
├── firebase.json         ← tells the Firebase CLI what to deploy
└── dashboard/
    └── index.html        ← the console YOU log into to see the live trail
```

## Phase 1 — Create the Firebase project

1. Go to https://console.firebase.google.com → **Add project** → free **Spark** plan.
2. In the project, enable:
   - **Build → Firestore Database** → Create database (production mode, any region close to you).
   - **Build → Storage** → Get started (production mode).
   - **Build → Authentication → Sign-in method** → enable **Email/Password** AND **Anonymous**.
     (Anonymous = the lost phone signing in silently. Email/Password = you, on the dashboard.)
   - **Build → Authentication → Users** → add yourself as a user (your email + a strong password) — this is the only account that can read the dashboard.
3. **Project settings → General → Your apps → Web app (</>)** → register an app → copy the `firebaseConfig` object.
4. Paste those values into `firebase-config.js` in this folder, replacing the `REPLACE_ME` placeholders.

## Phase 3 & 4 — Already built, plus lockdown

`locate.html` already:
- Signs in anonymously (silent, no prompt of its own)
- Calls `watchPosition()` and writes a point to Firestore every ~10 seconds
- Grabs one front-camera frame and uploads it to Storage
- Auto-stops after `REPORTING_DURATION_MINUTES` (set in `firebase-config.js`, default 25)

`firestore.rules` / `storage.rules` already lock things down so:
- The lost phone (anonymous account) can only **create**, never read, edit, or delete
- Only your real logged-in account can **read** the location trail and photos

**Before deploying**, do the one-time manual permission grant from the context doc:
after Phase 6 (below) gives you the live URL, open it once on your own phone
in a normal browser tab and accept the location + camera prompts. After that,
future silent opens via the Routine won't show a prompt.

## Phase 5 — Dashboard

`dashboard/index.html` is a self-contained login-gated console:
- Email/password sign-in (your one account from Phase 1, step 2)
- A live map (Leaflet + OpenStreetMap, no API key needed) with the trail drawn as it updates
- A "last report" readout with time-since-last-fix and raw coordinates
- A session picker (in case you trigger it more than once — each trigger gets its own `sessionId`)
- A live photo feed of captures

## Phase 6 — Deploy

From this folder:

```bash
npm install -g firebase-tools      # one-time
firebase login
firebase init                       # choose "Use an existing project", pick the one from Phase 1
                                     # when asked, point Firestore/Storage rules at the existing .rules files
firebase deploy
```

This publishes to `https://<your-project-id>.web.app`. You'll get two live URLs to note down:

- `https://<your-project-id>.web.app/locate.html` → put this in the Routine's "Open Link" action (Phase 2)
- `https://<your-project-id>.web.app/dashboard/` → bookmark this for yourself, log in with your Phase 1 email/password

## Phase 2 (on your phone) — Reconfigure the Routine

In Samsung Modes & Routines:
- Trigger: **Notification received** → app: Messages/WhatsApp → containing: your keyword → any sender
- Actions: remove Ringtone/Vibrate/Torch/Play Music. Keep Location ON, Mobile Data ON, Power Saving ON, extend Screen Timeout.
- Add action: **Open Link** → paste the `locate.html` URL from above.

⚠️ Open decision from the context doc: confirm "Open Link" still exists as a Routine action in your current One UI version before relying on this — some One UI releases have moved or renamed it.

## Phase 7 — Fallback layers (Settings only, no code)

- Samsung Find My Mobile → enable **SIM-change alert**
- Google Find Hub → enable **Find offline devices → With network everywhere**
- Lock Bluetooth/Location toggles behind a PIN so a thief can't disable them from the quick panel

## Phase 8 — End-to-end test

Borrow a friend's phone, WhatsApp/SMS your keyword to your own number, and confirm:
1. Your phone's Routine fires silently (no sound, no visible change beyond the camera-in-use dot)
2. Points start appearing on the dashboard map within ~10–20 seconds
3. A photo appears in the feed
4. Test once on WiFi and once on mobile data, and once with the screen locked

## Notes on the two remaining open decisions

- **Reporting duration** is set via `REPORTING_DURATION_MINUTES` in `firebase-config.js` — change and redeploy anytime.
- **Dashboard login requirement**: already implemented as required (email/password), matching the doc's recommendation.
