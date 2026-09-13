// ============================================================
// FIREBASE CONFIG — fill this in after Phase 1 (Firebase Console setup)
// Firebase Console → Project Settings → General → "Your apps" → Web app → Config
// This file is loaded by BOTH locate.html and dashboard/index.html
// ============================================================
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

// How long (in minutes) locate.html should keep reporting position after
// a single trigger before it automatically stops. Open decision #2 from
// the context doc — 25 minutes is a reasonable default, tune as you like.
const REPORTING_DURATION_MINUTES = 25;

// How often (in seconds) to write a fresh GPS point while active.
const LOCATION_WRITE_INTERVAL_SECONDS = 10;
