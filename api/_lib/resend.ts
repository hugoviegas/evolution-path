import { Resend } from "resend";

// Server-only. RESEND_API_KEY must never be prefixed with VITE_ or read
// anywhere under src/ — that would ship it to the browser.
const apiKey = process.env.RESEND_API_KEY;

export const isResendConfigured = Boolean(apiKey);

let client: Resend | null = null;

/** Returns the Resend client, or null when RESEND_API_KEY isn't set. */
export function getResendClient(): Resend | null {
  if (!isResendConfigured) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}
