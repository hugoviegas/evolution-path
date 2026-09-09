// Data contracts for the /invite flow.
// Sprint 1 defines these shapes only — no live Firestore/Resend calls happen here.
// Sprint 2 will persist InviteDocument/QuizAnswersDocument/AvailabilityDocument to
// Firestore collections named after them (invites, quizAnswers, availability,
// profileAnswers). Sprint 3 will use InviteDocument + ProfileAnswersDocument to
// compose the Resend notification email to Hugo.

export type LanguageCode = "EN" | "PT";

export type QuizTopic =
  | "hobbies"
  | "lifestyle"
  | "pets"
  | "kids"
  | "gym"
  | "travel"
  | "whereToLive"
  | "extraHabits";

/** Sentinel option id used whenever the guest picks "I'd rather tell you in person". */
export const PRIVATE_ANSWER_ID = "private_in_person";

export type QuizAnswers = Partial<Record<QuizTopic, string>>;

export type IntentionId =
  | "getToKnow"
  | "bigPlans"
  | "funDate"
  | "straightToPoint"
  | "youDecide"
  | "noIntention";

export type DateTypeId =
  | "hiking"
  | "dinner"
  | "pub"
  | "party"
  | "games"
  | "climbing"
  | "adventure"
  | "cinema"
  | "netflix"
  | "gameNight"
  | "youDecide"
  | "other";

export interface IdentityInfo {
  name: string;
  instagram: string;
  email?: string;
  phone?: string;
}

export type WhoDecides = "guest" | "hugo";

export type AvailabilityPeriod = "morning" | "afternoon" | "evening";

export interface AvailabilitySlot {
  /** Chip id, e.g. "mon" | "tue" | ... | "weekend". */
  day: string;
  period: AvailabilityPeriod;
}

export interface AvailabilityInfo {
  whoDecides: WhoDecides;
  slots: AvailabilitySlot[];
  note?: string;
}

export interface DateTypeSelection {
  primary: DateTypeId | null;
  secondary?: DateTypeId;
  otherText?: string;
}

/**
 * Bilingual freeform text. Unlike the rest of the UI copy (which lives in
 * config/translations.ts as static app chrome), bio content is data Hugo
 * edits at runtime via /invite/profile, so it is stored as an EN/PT pair
 * directly rather than as a translation key.
 */
export interface BilingualText {
  EN: string;
  PT: string;
}

export interface HugoBioContent {
  role: BilingualText;
  city: BilingualText;
  techStack: string[];
  vibe: BilingualText;
  /** Static sample photo paths for Sprint 1 (real IG fetch is a later sprint). */
  photos: string[];
}

/** Hugo's editable baseline used by the compatibility engine and by /invite/profile. */
export interface InviteProfileConfig {
  bio: HugoBioContent;
  baselineAnswers: QuizAnswers;
  baselineIntention: IntentionId;
  defaultDateTypes: DateTypeSelection;
}

export interface InviteFormState {
  identity: IdentityInfo;
  intention: IntentionId | null;
  quizAnswers: QuizAnswers;
  dateType: DateTypeSelection;
  availability: AvailabilityInfo;
}

// ---------------------------------------------------------------------------
// Firestore collection contracts (Sprint 2 target schema, documented ahead of
// wiring). Field names double as the Firestore document field names.
// ---------------------------------------------------------------------------

/** Collection: `invites/{inviteId}` */
export interface InviteDocument {
  id: string;
  identity: IdentityInfo;
  intention: IntentionId;
  dateType: DateTypeSelection;
  compatibilityScore: number;
  language: LanguageCode;
  createdAt: string; // ISO timestamp
  status: "submitted" | "contacted" | "archived";
}

/** Collection: `quizAnswers/{inviteId}` */
export interface QuizAnswersDocument {
  inviteId: string;
  answers: QuizAnswers;
  createdAt: string;
}

/** Collection: `availability/{inviteId}` */
export interface AvailabilityDocument extends AvailabilityInfo {
  inviteId: string;
  createdAt: string;
}

/** Collection: `profileAnswers/hugo` — singleton doc holding Hugo's editable baseline. */
export interface ProfileAnswersDocument extends InviteProfileConfig {
  id: "hugo";
  updatedAt: string;
}
