# Invite Experience — Sprint 1

**Feature Branch**: `claude/vigilant-allen-rp3lnr`
**Created**: 2026-09-09
**Status**: Delivered (front-end only, no live backend)
**Related**: [`specs/main/sprint-roadmap.md`](../main/sprint-roadmap.md) ·
Developer prompt: "Sprint 1 – Invite Experience & Profile Setup"

## Purpose

Give Hugo a shareable, bilingual `/invite` page that turns "quer sair
comigo?" into a small, playful, multi-step experience: it collects who the
guest is, what she's hoping for, gets to know her through a quiz, introduces
Hugo, lets her pick a first date, shows a lighthearted "you vs. Hugo"
compatibility score, and captures her availability — ending in a summary she
confirms before (in a later sprint) Hugo is notified by email.

Sprint 1 delivers the full UX and the data/config contracts it will need,
without touching any live backend: no Firebase/Firestore reads or writes, no
Resend calls. State lives in React (per-session) and, for Hugo's editable
profile content, in `localStorage`.

## User Roles

- **Guest** — the person who received the invite link. Anonymous, no
  account. Interacts only with `/invite`.
- **Hugo** — the site owner. Uses `/invite/profile` (not linked from any
  menu, direct URL only) to edit the bio shown mid-flow, his baseline quiz
  answers used for compatibility scoring, and his default date-type
  suggestions.

## Features

1. **Hero** — badge + headline + subtitle explaining this is a special
   invite, plus a "Start" CTA. Reuses the site's existing theme/language
   toggle (`TopControls`), no new toggle implemented.
2. **Identity & socials** — name (required), Instagram handle (required),
   email and phone (optional, validated when present). Friendly privacy
   microcopy.
3. **Intentions** — single-select cards for the six intention options Hugo
   specified (só conhecer, grandes planos, date divertido, direto ao ponto,
   você decide, intenção nenhuma).
4. **Quiz wizard** — eight topics (hobbies, lifestyle, pets, kids, gym,
   travel, where to live, extra habits), each a single-select card grid with
   an always-present "Prefiro contar pessoalmente / I'd rather tell you in
   person" option. Its own progress indicator and back/next navigation
   nested inside the overall wizard step.
5. **"Conheça seu futuro algo…"** — three info cards (who Hugo is, what he
   does, what he likes) sourced from `src/config/inviteBaseline.ts`
   (editable via `/invite/profile`), plus a static sample photo grid.
   Explicitly marked in the UI as editable content.
6. **Date type** — twelve options (Hiking, Jantar, Pub, Baladinha, Games,
   Escalada, Aventura, Cinema, Netflix em casa, Dia de jogos com amigos, Você
   decide, Outro) as a primary + optional secondary choice; "Outro" reveals a
   free-text field.
7. **You vs. Hugo compatibility** — pure, unit-tested comparison
   (`src/lib/compatibility.ts`) between the guest's quiz/intention answers
   and Hugo's baseline, surfaced as a 0–100 score plus a playful summary
   bucket on the final screen.
8. **Availability & who decides** — guest picks whether she or Hugo decides
   the date type, toggles weekday chips and morning/afternoon/evening period
   chips, and can leave an optional free-text note.
9. **Summary & confirmation** — recap of every section plus the
   compatibility card, a privacy disclaimer, and a confirm action that (for
   now) only flips local state to a "sent" screen — no network call yet.
10. **Profile edit page** (`/invite/profile`) — Hugo edits the bilingual bio
    text, tech stack, baseline quiz answers, baseline intention, and default
    date-type suggestions. Persisted to `localStorage` in Sprint 1.

## Data Model

TypeScript contracts live in `src/types/invite.ts`; this is also the
blueprint for the Firestore collections Sprint 2 will create.

| Collection | Doc id | Shape | Notes |
|---|---|---|---|
| `invites` | `{inviteId}` | `InviteDocument` | identity, intention, date type, compatibility score, language, status |
| `quizAnswers` | `{inviteId}` | `QuizAnswersDocument` | per-topic answers keyed by `QuizTopic` |
| `availability` | `{inviteId}` | `AvailabilityDocument` | who decides, day/period slots, note |
| `profileAnswers` | `hugo` (singleton) | `ProfileAnswersDocument` | bio, baseline answers, baseline intention, default date types |

Supporting config (not persisted, defines the option sets and Hugo's
current baseline):

- `src/config/inviteQuizOptions.ts` — quiz topics/options, with a `group`
  and/or `flexible` flag used by the compatibility engine to compute
  match/partial/mismatch.
- `src/config/inviteIntentions.ts`, `src/config/inviteDateTypes.ts` — option
  metadata for those two steps.
- `src/config/inviteBaseline.ts` — `defaultInviteProfile`, the seed for
  `profileAnswers/hugo` and the fallback the app uses until Sprint 2 wires
  Firestore.

Bio text (`role`, `city`, `vibe`) is stored as `{ EN, PT }` pairs directly
(not translation keys), because it's data Hugo edits at runtime — everything
else (buttons, labels, option copy, microcopy) goes through
`config/translations.ts` as usual.

## UI Sections

Implemented under `src/features/invite/` (wizard context, shared
`OptionCard` / `InviteProgressHeader` components, one component per step)
and rendered by `src/pages/Invite.tsx`. Each step is a self-contained
component reading/writing the shared `InviteWizardProvider` context
(`src/features/invite/InviteWizardContext.tsx`), which also owns step
navigation and the (in-memory only) "submitted" flag.

`src/pages/InviteProfile.tsx` is a separate, unlinked page built the same
way (shadcn `Card`/`Input`/`Textarea` + `OptionCard`), backed by
`useInviteProfile` (`src/hooks/useInviteProfile.ts`), a small localStorage
wrapper Sprint 2 will swap for Firestore reads/writes without changing the
hook's interface.

## Animations

Kept intentionally light for Sprint 1: Tailwind `transition-colors` /
`transition-all` on card hover and chip selection states, smooth scroll to
top on every step change. No new animation library introduced — reuses the
`tailwindcss-animate` utilities already in the project.

## i18n

Every user-facing string added for this feature lives in
`config/translations.ts` under the `invite.*` key namespace (~140 keys) with
both `EN` and `PT` entries. PT copy was authored directly (matching Hugo's
existing playful, Star Wars-inflected voice) rather than machine-translated,
and EN is a separate, natural translation — not a literal mirror. The page
reuses the existing `useLanguage` hook and `TopControls` component; no new
toggle or language state was introduced.

## Edge Cases

- Guest skips every sensitive quiz question ("Prefiro contar pessoalmente"):
  those categories are excluded from the compatibility denominator instead
  of penalizing the score; an all-private quiz still yields a neutral
  50%/"mystery" result rather than 0%.
- Guest picks "Outro" for date type without typing anything: `otherText` is
  simply omitted (treated as optional), no validation error blocks progress.
- Optional email left blank: no validation runs; if filled in, it must match
  a basic email pattern before the identity step can advance.
- Profile edit page loaded with no prior save: falls back to
  `defaultInviteProfile` seed data, so `/invite` always has bio + baseline
  content even before Hugo customizes anything.
- Selecting the same date type as both primary and secondary is prevented in
  the UI (secondary list excludes whatever is currently primary).

## Priority

P0 (this sprint): hero → identity → intentions → quiz → bio → date type →
availability → summary flow, compatibility logic + tests, data model types,
profile edit page, full i18n coverage.

P1 (deferred to Sprint 2/3, tracked in `sprint-roadmap.md`): live
Firestore persistence, Resend email notification, real Instagram photo
fetch (currently static placeholders), auth-gating `/invite/profile`.

## Firebase & Resend configuration contract (Sprint 2/3 blueprint)

No live calls happen in Sprint 1. Documenting the expected env vars now so
Sprint 2 can wire them in without re-deriving the contract:

| Variable | Purpose | Sprint |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web SDK config | 2 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Web SDK config | 2 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Web SDK config | 2 |
| `VITE_FIREBASE_APP_ID` | Firebase Web SDK config | 2 |
| `RESEND_API_KEY` | Server-side only (Vercel serverless function / API route), never exposed to the client | 3 |
| `INVITE_NOTIFY_EMAIL` | Address Resend sends the new-invite notification to | 3 |

All values are read through Vercel Environment Variables at deploy time;
none are committed to the repo. `.env.sample` documents the placeholder
names (see repo root) so `.env.local` can be created without guessing var
names. Firebase config values are safe to expose client-side (`VITE_`
prefix) per Firebase's own security model — Firestore security rules, not
secrecy of these values, are what will protect the data in Sprint 2.
