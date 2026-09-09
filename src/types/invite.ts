// Data contracts for the /invite flow.
// Sprint 2 wires these to Firestore (see src/lib/inviteRepository.ts): every
// guest submission — identity, intention, quiz answers, date type,
// availability, compatibility score — lives as one document per invite in
// the `invites` collection (quiz answers and availability are embedded
// fields, not separate collections, since they're always read/written
// together with the rest of the invite). Hugo's editable baseline lives as
// the single `profileAnswers/hugo` document. Sprint 3 will use InviteDocument
// + ProfileAnswersDocument to compose the Resend notification email to Hugo.

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
// Firestore collections (Sprint 2 live schema). Field names double as the
// Firestore document field names.
// ---------------------------------------------------------------------------

export type InviteStatus = "draft" | "submitted" | "contacted" | "archived";

/**
 * Sprint 3: set by the `/api/send-invite-email` serverless function, never
 * by the client. "skipped_duplicate" means the abuse guard found another
 * submission with the same Instagram handle within the dedupe window and
 * intentionally didn't send anything.
 */
export type EmailStatus = "pending" | "sent" | "failed" | "skipped_duplicate";

/**
 * Collection: `invites/{inviteId}`. One document per guest, created as a
 * "draft" as soon as she finishes the identity step and merge-updated on
 * every later step so partial progress isn't lost; flipped to "submitted"
 * on the final confirmation. Every field except `id`/`status`/timestamps is
 * optional so a partial draft is a valid document.
 */
export interface InviteDocument {
  id: string;
  identity?: IdentityInfo;
  intention?: IntentionId;
  quizAnswers?: QuizAnswers;
  dateType?: DateTypeSelection;
  availability?: AvailabilityInfo;
  compatibilityScore?: number;
  language: LanguageCode;
  status: InviteStatus;
  createdAt: string; // ISO timestamp (or Firestore server timestamp on write)
  updatedAt: string;
  submittedAt?: string;
  emailStatus?: EmailStatus;
  emailSentAt?: string;
}

/** Collection: `profileAnswers/hugo` — singleton doc holding Hugo's editable baseline. */
export interface ProfileAnswersDocument extends InviteProfileConfig {
  id: "hugo";
  updatedAt: string;
}
