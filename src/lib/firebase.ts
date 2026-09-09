import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

// Single source of truth for Firebase initialization. Only firebase/app and
// firebase/firestore are imported here, so nothing else pulls in the rest of
// the Firebase SDK (auth, storage, analytics) unless a future sprint needs it.
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * True once the minimum config needed to talk to Firestore (apiKey +
 * projectId) is present. False in any environment that hasn't set the
 * VITE_FIREBASE_* env vars yet (local dev without a project, CI, this repo
 * before the vars are added to Vercel) — callers must treat that as a valid,
 * non-fatal state rather than a crash.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let firestoreInstance: Firestore | null = null;

/**
 * Lazily initializes Firebase (guarded with getApps/getApp so hot reload and
 * repeated calls never double-initialize) and returns the Firestore
 * instance. Returns null when Firebase isn't configured — every caller must
 * handle that case instead of assuming Firestore is always reachable.
 */
export function getDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  if (firestoreInstance) return firestoreInstance;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestoreInstance = getFirestore(app);
  return firestoreInstance;
}
