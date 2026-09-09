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

**Status**: Not started.

- Create the Firebase project and enable Firestore.
- Wire `/invite`'s submit step to write `InviteDocument` +
  `QuizAnswersDocument` + `AvailabilityDocument` to Firestore instead of only
  holding them in memory.
- Wire `/invite/profile` to read/write `ProfileAnswersDocument`
  (`profileAnswers/hugo`) instead of localStorage, with the current
  localStorage behavior kept as an offline fallback.
- Add the required env vars (see "Firebase & Resend configuration contract"
  in the Sprint 1 spec) via Vercel project settings — no secrets committed to
  the repo.
- Add basic Firestore security rules (guests can create invite documents but
  not read others' submissions; only Hugo's authenticated session can read
  the collections or write `profileAnswers/hugo`).

## Sprint 3 — Resend integration, end-to-end flow, polish

**Status**: Not started.

- On successful invite submission, trigger a Resend email to Hugo summarizing
  the guest's answers and compatibility score.
- Add guest-facing confirmation email (optional, only if an email address was
  provided).
- Error handling for failed writes/sends (retry affordance, friendly error
  copy in EN/PT).
- Logging/observability for submission failures.
- Final pass on tests (unit + integration) and UX polish based on Sprint 1/2
  feedback.
