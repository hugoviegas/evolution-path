import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { CreateEmailOptions, Resend } from "resend";
import { z } from "zod";
import { getAdminDb } from "./_lib/firebaseAdmin";
import { getResendClient } from "./_lib/resend";
import { buildGuestEmail, buildHugoEmail } from "./_lib/emailTemplates";
import { alreadySent, isDuplicateSubmission } from "./_lib/emailGuards";
import { InviteDocument } from "../src/types/invite";

const bodySchema = z.object({ inviteId: z.string().min(1) });

const HUGO_EMAIL = process.env.INVITE_NOTIFY_EMAIL;
const FROM_EMAIL = process.env.INVITE_FROM_EMAIL ?? "invite@hugoviegas.dev";

async function sendWithRetry(resend: Resend, payload: CreateEmailOptions, retries = 1): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await resend.emails.send(payload);
      if (result.error) throw new Error(result.error.message);
      return;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

/**
 * POST { inviteId }. Fetches the invite via Firebase Admin, sends the Hugo
 * notification (and the guest confirmation, when an email was provided)
 * through Resend, and records emailStatus/emailSentAt on the invite doc.
 * Always resolves 200 — a delivery failure must never surface as a broken
 * flow to a guest who already saw her confirmation screen; failures are
 * logged server-side and recorded on the document for Hugo to review.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ status: "method_not_allowed" });
    return;
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ status: "invalid_body" });
    return;
  }

  const db = getAdminDb();
  if (!db) {
    console.warn("[send-invite-email] Firebase Admin not configured — skipping");
    res.status(200).json({ status: "skipped_not_configured" });
    return;
  }

  const { inviteId } = parsed.data;
  const ref = db.collection("invites").doc(inviteId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    res.status(404).json({ status: "invite_not_found" });
    return;
  }

  const invite = { id: snapshot.id, ...snapshot.data() } as InviteDocument;

  if (alreadySent(invite)) {
    res.status(200).json({ status: "already_sent" });
    return;
  }

  if (invite.identity?.instagram) {
    const candidates = await db
      .collection("invites")
      .where("identity.instagram", "==", invite.identity.instagram)
      .where("status", "==", "submitted")
      .get();
    const others = candidates.docs
      .filter((doc) => doc.id !== invite.id)
      .map((doc) => ({ id: doc.id, ...(doc.data() as InviteDocument) }));

    if (isDuplicateSubmission(invite, others)) {
      await ref.update({ emailStatus: "skipped_duplicate" });
      res.status(200).json({ status: "skipped_duplicate" });
      return;
    }
  }

  const resend = getResendClient();
  if (!resend || !HUGO_EMAIL) {
    console.warn("[send-invite-email] Resend not configured — skipping");
    res.status(200).json({ status: "skipped_not_configured" });
    return;
  }

  await ref.update({ emailStatus: "pending" });
  const language = invite.language ?? "PT";

  try {
    const hugoEmail = buildHugoEmail(invite, language);
    await sendWithRetry(resend, {
      from: FROM_EMAIL,
      to: HUGO_EMAIL,
      subject: hugoEmail.subject,
      html: hugoEmail.html,
      text: hugoEmail.text,
    });

    if (invite.identity?.email) {
      const guestEmail = buildGuestEmail(invite, language);
      await sendWithRetry(resend, {
        from: FROM_EMAIL,
        to: invite.identity.email,
        subject: guestEmail.subject,
        html: guestEmail.html,
        text: guestEmail.text,
      });
    }

    await ref.update({ emailStatus: "sent", emailSentAt: new Date().toISOString() });
    res.status(200).json({ status: "sent" });
  } catch (error) {
    console.error("[send-invite-email] failed to send", error);
    await ref.update({ emailStatus: "failed" }).catch(() => undefined);
    res.status(200).json({ status: "failed" });
  }
}
