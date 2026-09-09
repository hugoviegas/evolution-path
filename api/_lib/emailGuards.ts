import { IdentityInfo } from "../../src/types/invite";

export const DEFAULT_DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

interface EmailStatusLike {
  emailStatus?: string;
}

interface SubmissionLike {
  id: string;
  identity?: IdentityInfo;
  submittedAt?: string;
}

/** True once an invite's emails have already gone out — never send twice for the same doc. */
export function alreadySent(invite: EmailStatusLike): boolean {
  return invite.emailStatus === "sent";
}

const normalizedHandle = (identity?: IdentityInfo): string | null => {
  const handle = identity?.instagram?.trim().toLowerCase();
  return handle ? handle : null;
};

/**
 * True when another submission with the same Instagram handle landed within
 * `windowMs` of this one. A simple, dependency-free abuse guard against the
 * public /invite route being resubmitted repeatedly (accidentally or by a
 * script) — not a replacement for real rate limiting, just enough to avoid
 * spamming Hugo's inbox for the common case.
 */
export function isDuplicateSubmission(
  current: SubmissionLike,
  others: SubmissionLike[],
  windowMs: number = DEFAULT_DUPLICATE_WINDOW_MS,
): boolean {
  const handle = normalizedHandle(current.identity);
  if (!handle || !current.submittedAt) return false;

  const currentTime = new Date(current.submittedAt).getTime();

  return others.some((other) => {
    if (other.id === current.id) return false;
    if (normalizedHandle(other.identity) !== handle) return false;
    if (!other.submittedAt) return false;
    return Math.abs(currentTime - new Date(other.submittedAt).getTime()) <= windowMs;
  });
}
