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

**Status**: Not started. `src/lib/notifyHugo.ts` is stubbed and already
called from the submit path, ready for this sprint to fill in.

- On successful invite submission, trigger a Resend email to Hugo summarizing
  the guest's answers and compatibility score.
- Add guest-facing confirmation email (optional, only if an email address was
  provided).
- Error handling for failed sends (retry affordance, friendly error copy in
  EN/PT) — Firestore write error handling already shipped in Sprint 2.
- Logging/observability for submission failures.
- Final pass on tests (unit + integration) and UX polish based on Sprint 1/2
  feedback.

## Sprint 4 — Styling & design-system polish

**Status**: Not started.

- Fix the currently-bugged styles across the site (tracked informally by
  Hugo; not yet itemized in a spec).
- Unify the design system referenced by `tailwind.config.ts` (theme,
  darkMode, animations, container behavior) across older and newer pages,
  `/invite` included.
- Refine animations/transitions once the underlying styling issues are
  fixed, rather than layering more animation on top of bugged CSS.
