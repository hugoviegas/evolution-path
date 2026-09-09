# Invite Experience — Sprint 3: Resend Email Integration

**Feature Branch**: `claude/vigilant-allen-rp3lnr`
**Created**: 2026-09-09
**Status**: Delivered
**Related**: [`specs/main/sprint-roadmap.md`](../main/sprint-roadmap.md) ·
Sprint 2 spec: [`specs/005-invite-sprint-2-firebase/spec.md`](../005-invite-sprint-2-firebase/spec.md)

## Purpose

Replace the Sprint 2 `notifyHugoOfInvite` stub with real email delivery:
when a guest confirms the `/invite` summary screen, Hugo gets a notification
email summarizing her answers, and she gets a short confirmation email (if
she gave one). Closes the loop the roadmap describes — nothing in Sprint 1/2
UX changes beyond this.

## Architecture

The app is a client-side Vite SPA with no server of its own, so the Resend
API key can't be called from the browser. The chosen shape:

```
Guest confirms  →  client writes invite to Firestore (Sprint 2, unchanged)
                →  client POSTs { inviteId } to /api/send-invite-email
                →  serverless function re-reads the invite via Firebase
                   Admin, sends emails via Resend, records emailStatus
```

- **`api/send-invite-email.ts`** — a Vercel Node serverless function (picked
  up automatically because it lives under `api/`; no extra Vercel config
  needed beyond the `vercel.json` rewrite fix below). Receives `{ inviteId
  }`, does everything server-side.
- **`api/_lib/firebaseAdmin.ts`** — Firebase Admin SDK init, service-account
  based, `getApps`/`getApp` guarded like the Sprint 2 client module.
  Bypasses `firestore.rules` entirely (that's expected — Admin SDK always
  does), which is why the abuse guard lives in the function, not the rules.
- **`api/_lib/resend.ts`** — thin Resend client wrapper, same
  configured/not-configured gating pattern as the rest of the codebase.
- **`api/_lib/emailTemplates.ts`** — pure functions building the Hugo and
  guest email bodies (subject/html/text) for a given `InviteDocument` +
  `LanguageCode`. Reuses `getTranslation` from `config/translations.ts` and
  the `labelKey`s already defined in `inviteIntentions.ts`/
  `inviteDateTypes.ts` — the email says the exact same things the `/invite`
  UI says, in the exact same words, instead of a second copy of the copy.
- **`api/_lib/emailGuards.ts`** — pure idempotency (`alreadySent`) and
  duplicate-submission (`isDuplicateSubmission`) checks, unit-tested without
  touching Firestore or Resend.

All four `api/_lib` files import from `src/` using relative paths
(`../../src/...`), not the `@/` alias — Vercel's function bundler isn't
guaranteed to honor `tsconfig.json` path mappings the same way Vite does, so
relative imports are the safer choice for code that has to survive a
different bundler at deploy time. `tsconfig.api.json` (referenced from the
root `tsconfig.json`) type-checks the `api/` directory on its own, since it
isn't part of `tsconfig.app.json`'s `src`-only `include`.

**`vercel.json`** changed from `{ "source": "/(.*)" }` to `{ "source":
"/((?!api/).*)" }` in its SPA rewrite — the old catch-all would have
rewritten every request to `/api/send-invite-email` into `/index.html`
before it ever reached the function.

## Email templates

Two languages × two recipients, built from the same data (no separate
"email copy" authored from scratch — see `email.hugo.*`/`email.guest.*` in
`config/translations.ts`):

- **Hugo's email** — subject includes the guest's name; body lists name +
  Instagram, intention, date type (primary/secondary/"other" text),
  compatibility score, who decides, availability, and her optional note.
  Missing fields are simply omitted (a guest can submit before finishing
  every step, per Sprint 2's draft model, though the wizard normally
  prevents that). CTA: reply to the email or message her on Instagram.
- **Guest's email** — only sent if she gave an email address. Short,
  warm, matches the invite's tone: confirms her answers arrived and that
  Hugo will reach out.

Both are plain inline-styled HTML (email clients don't support Tailwind or
external stylesheets, so this is a deliberate exception to the app's
"Tailwind only" rule — it doesn't apply to email markup) plus a plain-text
fallback.

## Trigger flow

`InviteWizardContext.submit()` (unchanged from Sprint 2) already calls
`notifyHugoOfInvite(invite)` after the Firestore write succeeds. Sprint 3
only changed what that function does:

```ts
// src/lib/notifyHugo.ts
export async function notifyHugoOfInvite(invite: InviteDocument) {
  if (!isFirebaseConfigured) return;
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
```

No new client-facing status text was needed: the existing
`invite.summary.confirmedBody` copy ("Hugo will reach out...") already
holds true whether or not the email actually sent, so the guest's
confirmation screen doesn't change. This was a deliberate choice to honor
"the guest's flow must never look broken" — she never sees an email-specific
success or failure state.

## Idempotency & duplicate-submission guard

- **Idempotency**: the function reads the invite doc first; if
  `emailStatus === "sent"`, it returns `{ status: "already_sent" }`
  immediately without touching Resend. Covers retried client calls,
  double-clicks, etc.
- **Duplicate submission**: before sending, the function queries
  `invites` for other `status: "submitted"` docs with the exact same
  `identity.instagram` value, then runs `isDuplicateSubmission` (pure,
  case/whitespace-insensitive) against a 5-minute window. A match sets
  `emailStatus: "skipped_duplicate"` and sends nothing. This is
  intentionally "basic" per the sprint's own framing — it's a same-handle,
  same-Firestore-query check, not real rate limiting (no IP tracking, no App
  Check). The Firestore `where` clause itself does an exact string match
  (Firestore can't query case-insensitively without a normalized field), so
  a handle typed with different casing across two submissions could still
  slip through; noted as a known gap rather than silently ignored.

## Error handling

- A Resend send is retried once (`sendWithRetry`, `api/send-invite-email.ts`)
  before giving up — covers a single transient network/API blip.
- Any failure after the retry (Resend error, thrown exception) is
  `console.error`'d server-side, the invite is marked `emailStatus:
  "failed"`, and the function still responds **200** — a 500 here would be
  meaningless to the client (it doesn't render the response) and a non-2xx
  status turns into log noise without changing guest-facing behavior. Hugo
  can find `emailStatus: "failed"` docs from the Firebase console to follow
  up manually.
- Firebase Admin or Resend not configured (env vars missing) →
  `{ status: "skipped_not_configured" }`, also 200 — same "never break the
  guest" principle as the Firestore layer in Sprint 2.

## Manual setup required from Hugo (not automated here)

1. **Resend domain verification**: create a Resend account, add a sending
   domain (e.g. `mail.hugoviegas.dev`), add the SPF/DKIM DNS records Resend
   provides at the domain registrar, wait for "Verified". No DNS changes
   were made by this sprint — see `.env.sample` for the exact steps.
2. **Resend API key**: create one in the Resend dashboard once the domain
   is verified (sending will fail/bounce before then); set `RESEND_API_KEY`,
   `INVITE_NOTIFY_EMAIL`, and `INVITE_FROM_EMAIL` in Vercel.
3. **Firebase Admin service account**: Firebase console → Project settings
   → Service accounts → "Generate new private key"; set
   `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`,
   `FIREBASE_ADMIN_PRIVATE_KEY` (keep the `\n` sequences literal) in Vercel.

Until all of the above are set, the function degrades to
`skipped_not_configured` and the rest of the `/invite` flow is unaffected —
this was true in local testing during this sprint (no live Resend send was
attempted; all Resend/Admin interactions in tests are mocked).

## Tests

- `api/_lib/__tests__/emailGuards.test.ts` — `alreadySent` and
  `isDuplicateSubmission` (window edges, case/whitespace normalization,
  self-exclusion), fully pure.
- `api/_lib/__tests__/emailTemplates.test.ts` — EN and PT template
  selection for both recipients, including that optional fields are
  omitted when absent.
- `api/__tests__/send-invite-email.test.ts` — the handler itself, with
  `api/_lib/firebaseAdmin` and `api/_lib/resend` mocked (no real Firestore
  or Resend calls): method/body validation, not-configured skip, happy
  path (both emails sent, `emailStatus` updated), guest email skipped when
  no address given, idempotency, duplicate-submission skip, and
  retry-then-fail.

## Edge Cases

- Guest never gave an email → only Hugo's email sends; `identity.email`
  check gates the guest email entirely.
- Invite doc doesn't exist for the given id (bad/stale `inviteId`) → 404,
  no email attempted.
- Firestore write from Sprint 2 succeeded but the guest's browser is
  offline right after → the `fetch` to `/api/send-invite-email` itself
  fails; caught and logged client-side, no guest-facing error — the invite
  stays `emailStatus: undefined` in Firestore until something (a future
  retry mechanism, or Hugo manually) triggers the function again for that id.
- Same guest resubmits the whole flow within minutes (double form
  submission, browser back-button) → second invite doc gets
  `emailStatus: "skipped_duplicate"`.

## Priority

P0 (this sprint): serverless function, email templates, idempotency +
duplicate guard, error handling, tests, spec.

P1 (deferred): a background retry/sweep job for invites stuck without
`emailStatus` (currently only retried within the same request), real rate
limiting (App Check / IP-based) beyond the same-handle guard, and the
styling/design-system work reserved for Sprint 4.
