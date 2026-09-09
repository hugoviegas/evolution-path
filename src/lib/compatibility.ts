import { getQuizQuestion, QuizOption } from "@/config/inviteQuizOptions";
import { IntentionId, PRIVATE_ANSWER_ID, QuizAnswers, QuizTopic } from "@/types/invite";

export type MatchLevel = "match" | "partial" | "neutral" | "mismatch";

export interface CategoryResult {
  topic: QuizTopic;
  guestAnswer?: string;
  hugoAnswer?: string;
  level: MatchLevel;
}

export type CompatibilitySummaryBucket = "great" | "good" | "curious" | "mystery";

export interface CompatibilityResult {
  categories: CategoryResult[];
  /** 0-100 aggregate score. */
  score: number;
  summaryBucket: CompatibilitySummaryBucket;
}

const findOption = (topic: QuizTopic, optionId?: string): QuizOption | undefined => {
  if (!optionId) return undefined;
  return getQuizQuestion(topic).options.find((option) => option.id === optionId);
};

const scoreForLevel: Record<MatchLevel, number> = {
  match: 1,
  partial: 0.5,
  mismatch: 0,
  neutral: 0,
};

const levelForOptions = (guest?: QuizOption, hugo?: QuizOption): MatchLevel => {
  if (!guest || !hugo) return "neutral";
  if (guest.id === hugo.id) return "match";
  if (guest.flexible || hugo.flexible) return "partial";
  if (guest.group && hugo.group && guest.group === hugo.group) return "partial";
  return "mismatch";
};

/**
 * Compares a guest's quiz answers against Hugo's baseline, topic by topic.
 * Pure and side-effect free so it can run identically on the client in
 * Sprint 1 and later be reused server-side once Firestore is wired in.
 */
export const compareQuizAnswers = (
  guestAnswers: QuizAnswers,
  baselineAnswers: QuizAnswers,
): CategoryResult[] => {
  const topics = Object.keys(baselineAnswers) as QuizTopic[];

  return topics.map((topic) => {
    const guestAnswerId = guestAnswers[topic];
    const hugoAnswerId = baselineAnswers[topic];

    const isGuestPrivate = !guestAnswerId || guestAnswerId === PRIVATE_ANSWER_ID;
    const isHugoPrivate = !hugoAnswerId || hugoAnswerId === PRIVATE_ANSWER_ID;

    const level: MatchLevel =
      isGuestPrivate || isHugoPrivate
        ? "neutral"
        : levelForOptions(findOption(topic, guestAnswerId), findOption(topic, hugoAnswerId));

    return {
      topic,
      guestAnswer: guestAnswerId,
      hugoAnswer: hugoAnswerId,
      level,
    };
  });
};

const bucketForScore = (score: number, ratedCount: number): CompatibilitySummaryBucket => {
  if (ratedCount === 0) return "mystery";
  if (score >= 75) return "great";
  if (score >= 45) return "good";
  return "curious";
};

/**
 * Aggregates per-topic quiz results plus the shared-intention bonus into a
 * single 0-100 compatibility score and a playful summary bucket. Neutral
 * categories (either side chose "I'd rather tell you in person") are
 * excluded from the denominator so staying private never drags the score down.
 */
export const computeCompatibility = (
  guestAnswers: QuizAnswers,
  baselineAnswers: QuizAnswers,
  guestIntention?: IntentionId | null,
  baselineIntention?: IntentionId,
): CompatibilityResult => {
  const categories = compareQuizAnswers(guestAnswers, baselineAnswers);
  const ratedCategories = categories.filter((category) => category.level !== "neutral");

  const intentionShared =
    !!guestIntention && !!baselineIntention && guestIntention === baselineIntention;

  const points =
    ratedCategories.reduce((sum, category) => sum + scoreForLevel[category.level], 0) +
    (intentionShared ? 1 : 0);
  const denominator = ratedCategories.length + (guestIntention ? 1 : 0);

  const score = denominator === 0 ? 50 : Math.round((points / denominator) * 100);

  return {
    categories,
    score,
    summaryBucket: bucketForScore(score, denominator),
  };
};
