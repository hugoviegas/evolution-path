import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

// Server-only Firebase Admin init. Never import this from src/ — the
// service account private key must never reach the client bundle.
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
// Vercel env vars store the key with literal "\n" sequences; Firebase Admin
// needs real newlines.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let app: App | null = null;
let db: Firestore | null = null;

/** Returns the Admin Firestore instance, or null when the service account env vars aren't set. */
export function getAdminDb(): Firestore | null {
  if (!isFirebaseAdminConfigured) return null;
  if (db) return db;

  app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  db = getFirestore(app);
  return db;
}
