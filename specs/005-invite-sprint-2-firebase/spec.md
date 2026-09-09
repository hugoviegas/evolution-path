# Invite Experience — Sprint 2: Firebase & Firestore Persistence

**Feature Branch**: `claude/vigilant-allen-rp3lnr`
**Created**: 2026-09-09
**Status**: Delivered
**Related**: [`specs/main/sprint-roadmap.md`](../main/sprint-roadmap.md) ·
Sprint 1 spec: [`specs/004-invite-sprint-1/spec.md`](../004-invite-sprint-1/spec.md)

## Purpose

Wire the `/invite` flow and `/invite/profile` page — both fully built in
Sprint 1 against in-memory/localStorage state — to real Firestore
persistence, without touching Resend (Sprint 3) or the styling issues
tracked for Sprint 4. The flow must keep working even before Firebase is
configured: missing env vars degrade to the Sprint 1 local-only behavior
rather than crashing.

## Firebase project

Hugo is reusing an existing Firebase project (`assistente-virtual-e4322`)
rather than creating a dedicated one — the invite feature's data lives
alongside whatever else that project already hosts, in its own Firestore
collections (`invites`, `profileAnswers`), so it doesn't collide with
existing data. If a dedicated project is preferred later, only the env vars
below need to change — nothing in the app hardcodes the project id.

Steps taken / to take in the Firebase console for a project used this way:

1. **Firestore** — Native mode enabled (already the case for this project;
   confirmed by a live `permission-denied` response rather than a
   "database not found" error when the app queried it before rules were
   set).
2. **Web app registration** — Project settings → General → "Your apps" →
   add/reuse a Web app to get the six config values (`apiKey`,
   `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`,
   `appId`).
3. **API key restriction** (recommended, not yet done) — Google Cloud
   console → APIs & Services → Credentials → restrict the Web API key to
   the specific Firebase/Firestore APIs and to the site's domains
   (`hugoviegas.dev`, the Vercel preview domain pattern, `localhost` for
   dev). This is a defense-in-depth step; Firestore security rules are what
   actually gate data access (Firebase web API keys are not secrets in the
   traditional sense — see Firebase's own docs on this).
4. **Security rules** — deployed from `firestore.rules` in this repo (see
   below), via `firebase deploy --only firestore:rules` or pasted into the
   console's Rules tab.

No separate dev/staging Firestore database was set up in Sprint 2 — same
project for now, kept simple. If Hugo wants isolation later, the standard
path is a second Firebase project (e.g. `-dev` suffix) with its own env vars
wired to Vercel's Preview environment instead of Production.

## Firestore structure

Two collections, matching `src/types/invite.ts`:

- **`invites/{inviteId}`** — one document per guest session. `inviteId` is a
  `crypto.randomUUID()` generated client-side the moment the wizard mounts,
  reused for every write for that session. Quiz answers and availability are
  **embedded fields on this document**, not separate collections/subcollections
  — they're always read and written together with the rest of the invite, so
  a single document avoids extra round-trips and keeps a guest's data atomic.
  - `status: "draft" | "submitted" | "contacted" | "archived"` — `"draft"`
    from the identity step onward (merge-updated on every later step so
    partial progress is never lost), `"submitted"` on final confirmation.
    `"contacted"`/`"archived"` are reserved for Hugo's own follow-up
    workflow, not written by the app yet.
  - All content fields (`identity`, `intention`, `quizAnswers`, `dateType`,
    `availability`, `compatibilityScore`) are optional, since a draft may
    only have some of them.
- **`profileAnswers/hugo`** — singleton document (fixed id `"hugo"`) holding
  `InviteProfileConfig`: `bio` (EN/PT pairs), `baselineAnswers`,
  `baselineIntention`, `defaultDateTypes`.

This supersedes the Sprint 1 spec's sketch of separate `quizAnswers` and
`availability` collections — consolidating to one document per invite turned
out simpler to write to incrementally and doesn't need a join to read back.

## Security rules

See `firestore.rules` (repo root) and `firebase.json`. Summary:

| Path | Read | Write |
|---|---|---|
| `invites/{inviteId}` | Denied (no client can read/list submissions) | `create`/`update` open |
| `profileAnswers/{docId}` | Open (guests need it to render `/invite`) | Open |
| everything else | Denied | Denied |

There is no Firebase Auth yet, so both open-write rules are a deliberate,
documented interim tradeoff:

- `invites` writes are open because guests are anonymous; the mitigation is
  that `inviteId` is an unguessable random UUID and there's no read/list
  access, so nobody can enumerate or view other guests' submissions.
- `profileAnswers` writes are open because `/invite/profile` has no auth
  gate of its own yet — it's protected only by not being linked from
  anywhere public.

Both are marked with `TODO` comments in `firestore.rules` for tightening
once Firebase Auth is introduced (restrict `profileAnswers` writes to
Hugo's uid; consider moving `invites` writes behind a Cloud Function with
rate limiting once the page gets real traffic).

## Environment variables

Documented in `.env.sample`, read via `import.meta.env` in
`src/lib/firebase.ts`:

| Variable | Required for |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firestore init (checked by `isFirebaseConfigured`) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firestore init |
| `VITE_FIREBASE_PROJECT_ID` | Firestore init (checked by `isFirebaseConfigured`) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Reserved for future Storage use (IG photos) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Part of the standard Firebase Web config |
| `VITE_FIREBASE_APP_ID` | Firestore init |

Add these in Vercel: Project Settings → Environment Variables, scoped to
Production (and Preview if a separate dev project is ever introduced). None
are committed to the repo; a real project's values were used locally in
this session only via a git-ignored `.env`, never `.env.sample`.

`isFirebaseConfigured` (in `src/lib/firebase.ts`) is true once `apiKey` and
`projectId` are both present — that's the only gate the app checks before
attempting any Firestore call.

## Firebase client module

`src/lib/firebase.ts` — the single place Firebase is initialized:

- Uses the `getApps()`/`getApp()` guard so hot reload or repeated imports
  never double-initialize the app.
- Exports `isFirebaseConfigured` (sync, safe to check anywhere) and
  `getDb()` (lazily creates and caches the `Firestore` instance, returns
  `null` when unconfigured).
- Only imports `firebase/app` and `firebase/firestore` — no `firebase/auth`,
  `firebase/storage`, or `firebase/analytics`, so the bundle only grows by
  what's actually used.

`src/lib/inviteRepository.ts` builds on it with typed helpers
(`saveInvite`, `fetchProfileAnswers`, `saveProfileAnswers`) and a
`FirestoreUnavailableError` thrown by the write helpers when `getDb()`
returns `null` — every call site distinguishes "not configured yet"
(expected, silent) from a real Firestore failure (unexpected, surfaced).

## Integration points

- **`InviteWizardContext`** (`src/features/invite/InviteWizardContext.tsx`):
  generates one `inviteId` per session; every existing setter
  (`setIdentity`, `setIntention`, `setQuizAnswer`, `setDateType`,
  `setAvailability`) now also fires a best-effort, non-blocking
  `saveInvite` merge write after updating local state — step components
  were not changed. `submit(compatibilityScore)` is now async: it writes
  the final `status: "submitted"` document, calls the `notifyHugoOfInvite`
  stub, and exposes `submitting`/`submitError` so `SummaryStep` can disable
  its button and show a translated error message if the write genuinely
  fails (not merely "unconfigured", which still lets the guest see the
  confirmation screen).
- **`useInviteProfile`** (`src/hooks/useInviteProfile.ts`): now fetches
  `profileAnswers/hugo` on mount, hydrating over the localStorage-cached
  value once it resolves; `saveProfile`/`resetProfile` write through to
  Firestore and keep updating the localStorage cache as an offline
  fallback. `loading`/`error` are exposed for `/invite/profile`'s UI.
- **`InviteProfile` page**: shows a loading line while the initial fetch is
  in flight, disables Save/Reset while a write is in progress, and toasts a
  translated error (falling back to the local cache) if the Firestore write
  fails.

## Error handling

- Draft saves during the wizard are silent-by-design (a guest shouldn't see
  a toast every time she picks a quiz answer) — failures are
  `console.error`'d, "not configured" is not even logged as an error.
- The final submit and the profile save are the two points where the guest
  or Hugo actually needs to know something went wrong; both show a short,
  translated (EN/PT) message that never repeats the underlying Firebase
  error text — see `invite.summary.submitError` and
  `invite.profile.saveError` in `config/translations.ts`.
- No PT copy that existed before this sprint was changed; all new keys are
  additions.

## Resend (explicitly out of scope here)

`src/lib/notifyHugo.ts` exports `notifyHugoOfInvite(invite)`, called once
after a successful (or gracefully degraded) submission. It only
`console.info`s for now — no network call, no Resend API key read anywhere
in this sprint. Sprint 3 replaces the body of that one function.

## Edge Cases

- Guest completes the whole flow with Firebase unconfigured: every draft
  save and the final submit fail with `FirestoreUnavailableError`, which is
  swallowed everywhere it's expected — she still reaches the confirmation
  screen, just nothing was actually persisted (logged via `console.warn`
  once, at submit time).
- Guest's browser loses connectivity mid-flow: individual draft saves fail
  silently (same as unconfigured); the final submit's failure is a *real*
  error (not `FirestoreUnavailableError`), so `submitError` is set and she
  sees a retry-friendly message instead of a false "sent" screen.
- Hugo edits his profile before Firestore has finished its initial fetch:
  the fetched value only overwrites the draft once (on the `loading`
  `true → false` transition), so an edit made while it's still loading
  isn't clobbered when the fetch resolves.
- Firestore configured but the `profileAnswers/hugo` document doesn't exist
  yet (fresh project): `fetchProfileAnswers` returns `null`, and the app
  falls back to `defaultInviteProfile` — first Save call creates the
  document.

## Priority

P0 (this sprint): Firebase client module, Firestore repository, wizard
draft/submit persistence, profile page persistence, security rules, env
var documentation, spec.

P1 (deferred): Firebase Auth (to tighten the two open-write rules), API key
domain restriction in Google Cloud console, a separate dev Firestore
project, Storage-backed Instagram photos. Sprint 3 (Resend) and Sprint 4
(styling/design-system unification) remain untouched by this sprint.
