import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { InviteDocument, InviteProfileConfig, ProfileAnswersDocument } from "@/types/invite";

const INVITES_COLLECTION = "invites";
const PROFILE_ANSWERS_COLLECTION = "profileAnswers";
const HUGO_PROFILE_DOC_ID = "hugo";

/** Thrown by write helpers when Firestore isn't configured (no env vars set). */
export class FirestoreUnavailableError extends Error {
  constructor() {
    super("Firestore is not configured in this environment");
    this.name = "FirestoreUnavailableError";
  }
}

const requireDb = () => {
  const db = getDb();
  if (!db) throw new FirestoreUnavailableError();
  return db;
};

/**
 * Merge-writes a partial invite (draft or final submission) to
 * `invites/{inviteId}`. Safe to call repeatedly with different partial
 * fields as the guest progresses through the wizard — each call only
 * touches the fields it's given.
 */
export async function saveInvite(
  inviteId: string,
  data: Partial<InviteDocument>,
): Promise<void> {
  const db = requireDb();
  await setDoc(
    doc(db, INVITES_COLLECTION, inviteId),
    { ...(data as DocumentData), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * Reads Hugo's editable profile from `profileAnswers/hugo`. Returns null
 * (not an error) when Firestore isn't configured or the document doesn't
 * exist yet — callers fall back to the local seed/default in that case.
 */
export async function fetchProfileAnswers(): Promise<InviteProfileConfig | null> {
  const db = getDb();
  if (!db) return null;

  const snapshot = await getDoc(doc(db, PROFILE_ANSWERS_COLLECTION, HUGO_PROFILE_DOC_ID));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as ProfileAnswersDocument;
  const { bio, baselineAnswers, baselineIntention, defaultDateTypes } = data;
  return { bio, baselineAnswers, baselineIntention, defaultDateTypes };
}

/** Overwrites `profileAnswers/hugo` with Hugo's current profile edits. */
export async function saveProfileAnswers(profile: InviteProfileConfig): Promise<void> {
  const db = requireDb();
  await setDoc(doc(db, PROFILE_ANSWERS_COLLECTION, HUGO_PROFILE_DOC_ID), {
    ...(profile as DocumentData),
    id: HUGO_PROFILE_DOC_ID,
    updatedAt: serverTimestamp(),
  });
}
