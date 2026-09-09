import { InviteDocument } from "@/types/invite";

/**
 * Stub for the Resend email notification (Sprint 3). Sprint 2 persists the
 * invite to Firestore and calls this so the call site doesn't need to
 * change later — right now it only logs, no email is sent and no network
 * call is made.
 */
export async function notifyHugoOfInvite(invite: InviteDocument): Promise<void> {
  console.info("[notifyHugoOfInvite] stub — Resend wiring lands in Sprint 3", invite.id);
}
