import { isFirebaseConfigured } from "@/lib/firebase";
import { InviteDocument } from "@/types/invite";

/**
 * Triggers the `/api/send-invite-email` serverless function, which sends
 * the Hugo notification (and the guest confirmation, if she gave an email)
 * via Resend. Best-effort and silent on failure by design: the guest
 * already saw her confirmation screen by the time this runs, and a delivery
 * problem must never make the flow look broken to her — Resend/Firestore
 * errors are handled and logged server-side (see api/send-invite-email.ts).
 */
export async function notifyHugoOfInvite(invite: InviteDocument): Promise<void> {
  if (!isFirebaseConfigured) return; // nothing was persisted for the API to read

  try {
    await fetch("/api/send-invite-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId: invite.id }),
    });
  } catch (e) {
    console.error("Error triggering invite email:", e);
  }
}
