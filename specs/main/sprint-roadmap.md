# Invite Experience — Sprint Roadmap

Tracks the multi-sprint plan for the `/invite` feature (Hugo's dating-invite
flow) so the work doesn't get lost between sessions. Detailed spec for the
sprint currently in progress lives at
`specs/004-invite-sprint-1/spec.md`.

## Sprint 1 — Invite UX, quiz, profile edit (front-end only)

**Status**: Delivered.

- `/invite` route: hero, identity & socials, intentions, quiz wizard, "Conheça
  seu futuro algo…" bio section, date-type picker, you-vs-Hugo compatibility,
  availability & who-decides, summary & confirmation.
- `/invite/profile` (Hugo-only, not linked publicly): edit bio text, baseline
  quiz answers, and default date-type suggestions.
- Firestore data model (`invites`, `quizAnswers`, `availability`,
  `profileAnswers`) and Firebase/Resend env var contract defined in
  `specs/004-invite-sprint-1/spec.md`, but nothing is wired to a live backend
  yet — all state is local (React state + localStorage).
- Compatibility scoring implemented as a pure, unit-tested function
  (`src/lib/compatibility.ts`).

## Sprint 2 — Firebase project + Firestore persistence

**Status**: Delivered. Detailed spec:
[`specs/005-invite-sprint-2-firebase/spec.md`](../005-invite-sprint-2-firebase/spec.md).

- Reused Hugo's existing Firebase project (`assistente-virtual-e4322`) with
  Firestore already enabled; connectivity confirmed live during this sprint.
- `src/lib/firebase.ts` + `src/lib/inviteRepository.ts`: typed Firestore
  client and helpers, gated by `isFirebaseConfigured` so the app never
  crashes when the env vars aren't set.
- `/invite`'s wizard now merge-writes a draft to `invites/{inviteId}` on
  every step and a final `status: "submitted"` write on confirmation
  (quiz answers and availability are embedded fields on that one document,
  not separate collections — see the spec for why that superseded the
  Sprint 1 sketch).
- `/invite/profile` now reads/writes `profileAnswers/hugo` via Firestore,
  with the Sprint 1 localStorage behavior kept as a cache/offline fallback.
- `firestore.rules` + `firebase.json` added, with documented (and
  intentionally temporary, pending Firebase Auth) open-write rules.
- Env vars documented in `.env.sample`; no secrets committed to the repo.

## Sprint 3 — Resend integration, end-to-end flow, polish

**Status**: Delivered. Detailed spec:
[`specs/006-invite-sprint-3-resend.md`](../006-invite-sprint-3-resend/spec.md).

- New Vercel serverless function `api/send-invite-email.ts`: reads the
  invite via Firebase Admin, sends Hugo a summary email and (when provided)
  a guest confirmation email via Resend, in the invite's stored language.
- `api/_lib/emailTemplates.ts`: pure EN/PT template builders reusing the
  same copy/labels already defined for the `/invite` UI
  (`config/translations.ts`, `inviteIntentions.ts`, `inviteDateTypes.ts`).
- `api/_lib/emailGuards.ts`: idempotency (`emailStatus === "sent"` never
  resends) and a same-Instagram-handle duplicate-submission guard, both
  pure and unit-tested.
- One retry on transient send failures; on genuine failure the invite is
  marked `emailStatus: "failed"` and logged server-side, but the guest still
  sees her normal confirmation screen — a delivery problem never looks like
  a broken flow to her.
- `src/lib/notifyHugo.ts` (stubbed in Sprint 2) now fires the real
  `fetch("/api/send-invite-email")` call — no change needed at the
  `InviteWizardContext.submit()` call site.
- `vercel.json` updated so its SPA rewrite no longer swallows `/api/*`
  requests.
- Manual, not automated: Resend account/domain verification (SPF/DKIM DNS
  records) and generating the Firebase Admin service account key — both
  documented as steps for Hugo in `.env.sample` and the spec.

## Sprint 4 — Styling & design-system polish

**Status**: Not started.

- Fix the currently-bugged styles across the site (tracked informally by
  Hugo; not yet itemized in a spec).
- Unify the design system referenced by `tailwind.config.ts` (theme,
  darkMode, animations, container behavior) across older and newer pages,
  `/invite` included.
- Refine animations/transitions once the underlying styling issues are
  fixed, rather than layering more animation on top of bugged CSS.
