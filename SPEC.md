# Framis — Master Spec (Source of Truth)

> Engineering forward. Learn to think like an engineer who builds with AI.

**Status as of 2026-07-07.** This document is generated from the actual codebase
(`lib/`, `components/`, `supabase/migrations/`, `app/`), not from a plan. Where the
running app and the database schema disagree, both are stated and the drift is
flagged. Update this file when the code changes — it is the source of truth going
forward.

---

## 1. What Framis is

A motion-first, project-based curriculum that takes a complete beginner to
full-stack AI engineer over **64 weeks (7 phases, 28 modules)**, ~10–15 hrs/week.
Every lesson has an animated concept visual, a plain-English "explain simpler"
toggle, a runnable in-browser code sandbox (Python / JavaScript / SQL), a quiz,
and a key-terms glossary. Capstones are reviewed by another learner before they
count as shipped.

### Critical product facts (authoritative — used across site copy & emails)

| Fact | Value | Where it lives |
|------|-------|----------------|
| Curriculum price | **Free forever.** No trial, no paywall deeper in. | FAQ, Day-1/Day-3 emails, email footer |
| Mentorship price | **£150/month exactly**, cancel anytime. Optional. Unlocks **no** curriculum. | FAQ, Day-3 email, `lib/data.ts` |
| Mentor includes | Dedicated mentor · 1 code review/week · Slack (12-hr response) · monthly career check-in | FAQ |
| Job placement | **~1 in 5 (20%)** self-paced within 6 months; **~1 in 2 (50%)** with a mentor | FAQ, Day-3 email |
| Avg salary | **£52,000** | FAQ |
| Program length | 64 weeks · 7 phases · 28 modules | FAQ, `PHASES`, `ROADMAP_MODULES` |
| "Phase 3" | Data + Classical ML — the deliberate difficulty spike | FAQ, Day-5 email |

> Note on "50% job placement": in the codebase this is specifically the **mentored**
> rate. Self-paced is 20%. Keep both numbers together — the honesty is the point.

### Brand

| Token | Hex |
|-------|-----|
| Navy (primary) | `#0A1428` |
| Blue (accent/CTA) | `#0066CC` |
| Teal (highlight/pulse) | `#4B9E8F` |
| Success | `#059669` |
| Danger | `#DC2626` |
| Amber | `#B45309` |

Full navy ramp (`navy.200`–`navy.900`) and theme-aware surface/ink/line CSS
variables in `tailwind.config.ts` + `app/globals.css`. Fonts: **Inter**,
**IBM Plex Sans** (`font-sans`), **Fira Code** (`font-mono`) via `next/font`.

**No emojis on the site — use Font Awesome icons.**
⚠️ Known violation to clean up: `CAPSTONE_TEMPLATES` in `lib/data.ts` still carry
an `emoji` field (💬 ⚡ 📄 🎯 📊 ✍️ 🖼️ 🧹). Replace with Font Awesome icon refs
during the icon migration (see `FRAMIS_ICON_REFERENCE` if/when it lands — that file
is **not currently in the repo**).

---

## 2. Stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** (brand tokens) · **Framer Motion** · **Three.js** (hero only)
- **Zustand** — all cross-screen state (`lib/store.ts`)
- **Supabase** — auth (email/password + GitHub OAuth), Postgres, RLS
- **Resend** — transactional email · **Vercel Cron** — daily email job
- Deployed on **Vercel** (`vercel.json`)

Single-page shell: `app/page.tsx` → `components/Framis.tsx` switches on
`store.screen` (`landing | mentorship | mentor-apply | onboarding | app`). The
`app` screen has 7 tabs: `dashboard · lesson · capstone · review · portfolio ·
roadmap · faq`.

---

## 3. What's actually shipped

### 3.1 Curriculum — 28 modules, 7 phases (all content authored)

Phases (`lib/data.ts` → `PHASES`):

| # | Weeks | Title | Capstone |
|---|-------|-------|----------|
| 1 | 1–8 | Programming foundations | CLI expense tracker |
| 2 | 9–16 | Web + full-stack basics | Notes app with login |
| 3 | 17–32 | Data + classical ML | Classical ML model comparison |
| 4 | 33–40 | Engineering discipline | Tested app with CI pipeline |
| 5 | 41–48 | AI application engineering | AI Q&A system with citations |
| 6 | 49–56 | ML fundamentals | Train + deploy a classifier |
| 7 | 57–64 | Production AI systems | Production AI system |

28 modules mapped to phases in `ROADMAP_MODULES`. **Lesson content lives in
TypeScript**, not the DB: `lib/lessons/content/lesson-NN[-k].ts`, registered in
`lib/lessons/content/index.ts` as `GENERIC_LESSONS: Record<moduleNumber,
LessonData[]>`. Every module 1–28 has authored lessons — **~125 lessons total**
across the 28 modules (module lesson counts range 3–7).

**Two bespoke, hand-built interactive Lesson 1s** (richer than the data-driven
generic renderer), keyed in `LESSON_CONTENT` and `BESPOKE_MODULES = [2, 18]`:
- **Module 2 — Variables** (`variables`): playable box-metaphor viz, Python sandbox.
- **Module 18 — RAG** (`rag`): retrieval viz (`RagLesson`, `RagViz`).

Resolution logic: `lib/lessons/index.ts` (`resolveLesson`, `moduleLessonList`,
`nextLessonLabel`). Lesson shape: `lib/lessons/types.ts` (`LessonData`,
`VizStage`, `Explainer`, `QuizOption`).

### 3.2 Onboarding — ✅ complete (9 steps, persisted)

`OB_STEP_COUNT = 9` (`lib/store.ts`). Components in
`components/onboarding/steps/`:

1. `Step1Account` — signup/login (email+password or GitHub OAuth)
2. `Step2Welcome`
3. `Step3HonestTruth`
4. `Step4CurriculumMap`
5. `Step5HowItWorks`
6. `Step6WhyFinish`
7. `Step7Expectations`
8. `Step8QuickStart` — 3-question placement quiz (`OB_QUESTIONS` q1/q2/q3) +
   learning goal; **`obNext` gates here** until all three are answered
9. `Step9Completion`

State (Zustand): `obStep, obMode, obName, obEmail, obPw, obAnswers{q1,q2,q3},
setup{py,vsc,git}, obLearningGoal, obSaving`. Nav: `obNext` (caps at 9, quiz gate
at step 8), `obBack` (floors at 2).

`completeOnboarding()` persists to `profiles`:
`learning_goal, placement_answers, setup_checklist, onboarding_completed_at`,
fires the Day-1 email (fire-and-forget), then routes the learner into their first
lesson — **beginner** (q1 = "Never used it") → Module 1, otherwise → Module 2.

### 3.3 Capstones & peer review

- **7 capstones** in `lib/data.ts` → `CAPSTONES` (one per phase; each with brief,
  acceptance criteria, progressive hints, and a planted bug for the peer-review
  screen). Phase 7's `production-ai-system` has `templates: true`.
- **8 capstone templates** (`CAPSTONE_TEMPLATES`) the Phase-7 learner picks from:
  `support-chatbot · code-assistant · doc-analyzer · recommendation-engine ·
  sentiment-dashboard · blog-generator · image-classifier ·
  data-cleaning-automation`. Each carries stack, learning outcomes, architecture,
  starter folder structure, and starter code.
- **Peer review**: anonymised code + weighted scorecard (`REVIEW_ROWS`:
  crit 40 / read 20 / tests 20 / deploy 10 / readme 10), guided feedback fields
  (`FEEDBACK_FIELDS`). Reviewers auto-assigned in DB (see 4.4).
- Capstone checklist & rubric: `CAPSTONE_CHECKLIST`, `CAPSTONE_RUBRIC`.

### 3.4 Learner stats — real, never fabricated

`lib/learnerStats.ts` → `fetchLearnerStats(userId)` computes everything from the
DB (lessons completed, next module, streaks, capstone status per slug, pending
reviews, week number capped at 64). Returns `EMPTY_STATS` on any error.

> ⚠️ **Drift**: `totalLessons` counts rows in the DB `lessons` table, which is
> currently seeded with **only 2 lessons** (Variables, RAG) — not the ~125
> TypeScript lessons learners actually see. Progress %, "next lesson," and
> completed-module tracking therefore reflect DB rows, not authored content.
> Reconciling the TS curriculum into the `lessons`/`user_progress` tables is a
> known outstanding task.

---

## 4. Database schema (Supabase / Postgres)

10 migrations in `supabase/migrations/`. All tables have RLS enabled.

### 4.1 Core tables (`20260704221526_init_schema.sql`)

- **profiles** (1:1 `auth.users`) — `username, full_name, bio, avatar_url,
  location, theme(light|dark|high_contrast), email_frequency, public_portfolio`.
  Auto-created on signup via `handle_new_user()` trigger. Public read; owner
  write.
- **modules** — `phase, module_number(unique), title, description, weeks_label`.
- **lessons** — `module_id, title, content(jsonb), learning_outcomes[],
  estimated_minutes, order_index, difficulty, published_at`.
- **user_progress** — `(user_id, lesson_id) unique`, `status(started|in_progress|
  completed), quiz_score, time_spent_seconds, started_at, completed_at`. Owner-only.
- **projects** (capstones) — `module_id, title, slug(unique), requirements/rubric/
  hints(jsonb), solo_or_pair, order_index`.
- **project_submissions** — `(user_id, project_id) unique`, `github_url,
  deployed_url, demo_video_url, status(draft|submitted|under_review|passed|
  revision_needed), auto_check_results(jsonb), submitted_at`. Owner-only (plus a
  public-read policy for passed+public, see 4.5).
- **review_assignments** — `submission_id, reviewer_id, due_at, status(pending|
  completed)`.
- **code_reviews** — `assignment_id(unique), scores(jsonb), feedback(jsonb)`.
  Trigger `handle_code_review_submitted()` flips the assignment to `completed`.
- **portfolios**, **portfolio_testimonials**, **community_posts**,
  **community_replies** — portfolio + community layer (schema present; UI partial).

Shared `set_updated_at()` trigger on profiles / submissions / portfolios /
community_posts. `20260704221639` hardens RLS (revokes trigger-fn execute,
consolidates duplicate SELECT policies, adds a missing FK index).

### 4.2 Phase 2.5 insertion (`20260705000000...classical_ml.sql`)

Widens `modules.phase` check to `1..7`, shifts old modules 9–24 up by 4 numbers
and +1 phase (collision-safe via a temporary +1000 range), reflows week labels,
and inserts the 4 new **Data + Classical ML** modules (9–12). Net result: **28
modules across 7 phases**, matching the app.

### 4.3 Seeded content

- `20260704221559_seed_curriculum.sql` — seeds modules + **6 projects** +
  the **Variables** lesson.
- `20260705000200_seed_rag_lesson.sql` — seeds the **RAG** lesson (Module 18).

> ⚠️ **Drift**: the app defines **7** capstones (`CAPSTONES`) but the DB seeds
> only **6 projects** — `classical-ml-model-comparison` (Phase 3) is authored in
> the app but not in the seed. And two migration files
> (`auto_assign_peer_reviewers`, `seed_rag_lesson`) carry an in-file note: *"NOT
> YET APPLIED to the live project — the Supabase MCP connector was disconnected."*
> Verify against the live database before trusting seed/trigger state.

### 4.4 Peer-reviewer auto-assignment (`20260705000000_auto_assign_peer_reviewers.sql`)

`assign_peer_reviewers()` picks up to 2 random other learners (who have their own
submission) and creates `review_assignments` with a 3-day due date, on both
insert and status→`submitted` update.

### 4.5 Onboarding persistence & email plumbing

- `20260706000000_add_onboarding_persistence.sql` — adds to **profiles**:
  `learning_goal, placement_answers(jsonb), setup_checklist(jsonb),
  onboarding_completed_at, welcome_email_day(smallint default 0)`.
- `20260706000100_add_onboarding_email_due_function.sql` — `get_due_onboarding_
  emails()` (security-definer, reads `auth.users.email`): returns learners whose
  onboarding is complete, `welcome_email_day` is 0–6, and enough days have passed
  to be due the next email. Day-1 included as a fallback if the instant send fails.

### 4.6 Mentor applications & capstone gallery (`20260707...`)

- **mentor_applications** — public lead-capture form (`/mentor-apply`):
  `name, email, years_experience, portfolio_url, timezone, why_mentor, status`.
  Anonymous **insert-only** RLS (no reads) to protect applicants' contact details.
- **Capstone gallery** — `get_capstone_gallery()` (security-definer, public) joins
  passed submissions with public portfolios; plus a public-read policy on
  `project_submissions` for `passed` + public portfolio. **Empty until real
  learners pass real capstones — no seed/placeholder data.**

---

## 5. Email system (Day 1–7 onboarding sequence)

Templates: `lib/email/onboardingEmails.ts` → `getOnboardingEmail(day, name)`,
brand-styled inline HTML, footer *"Free, forever."*

| Day | Subject | Theme |
|-----|---------|-------|
| 1 | You're in — here's where everything lives | Orientation |
| 2 | How's Lesson 1 going? | Nudge to Lesson 2 |
| 3 | If you want more accountability than a website can give you | Mentor pitch (£150/mo, 20%→50%) |
| 4 | The part of Framis most people skip | Peer review |
| 5 | A heads-up about Phase 3 | Difficulty-spike honesty |
| 6 | The schedule matters more than the hours | Consistency |
| 7 | One week in | Retention |

**Delivery**
- **Day 1** — sent immediately on onboarding completion via
  `POST /api/send-onboarding-email` (authed as the user's own session,
  idempotent: skips if `welcome_email_day >= 1`).
- **Days 2–7** — daily **Vercel Cron** `0 13 * * *` (13:00 UTC, `vercel.json`) →
  `GET /api/cron/send-onboarding-emails`. Guarded by `Authorization: Bearer
  $CRON_SECRET`. Uses service-role client + `get_due_onboarding_emails()`, sends
  one day per learner per run, advances `welcome_email_day`. Missed runs advance
  by one day (no catch-up burst).
- **Sender**: Resend (`lib/resend.ts`), `EMAIL_FROM = RESEND_FROM_EMAIL ||
  "Framis <onboarding@framis.dev>"` — requires a Resend-verified domain to
  actually deliver.

---

## 6. Environment variables

Referenced in code (`lib/supabase/*`, `lib/resend.ts`, API routes,
`onboardingEmails.ts`):

| Var | Required | Used by |
|-----|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | all Supabase clients |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | browser/server auth clients |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (cron) | `createAdminClient()` — email cron |
| `RESEND_API_KEY` | ✅ (email) | `getResendClient()` |
| `CRON_SECRET` | ✅ (cron) | cron route bearer auth |
| `RESEND_FROM_EMAIL` | optional | sender identity (falls back to default) |
| `NEXT_PUBLIC_SITE_URL` | optional | email links (falls back to `framis-delta.vercel.app`) |

> **⏳ Deploy blocker (current):** add the outstanding env vars to Vercel and
> redeploy. The email/cron feature needs `SUPABASE_SERVICE_ROLE_KEY`,
> `RESEND_API_KEY`, and `CRON_SECRET` (plus `RESEND_FROM_EMAIL` for a real
> sender); the two `NEXT_PUBLIC_SUPABASE_*` vars should already be set from prior
> deploys. Confirm in the Vercel dashboard.
>
> (`API_KEY`, `DATABASE_URL`, `STRIPE_SECRET_KEY` also appear via grep but are
> inside **lesson teaching content**, not app configuration.)

---

## 7. State & sandbox internals

- **Store**: `lib/store.ts` (`useFramis`) — screen/tab nav, auth, onboarding,
  lesson, capstone (keyed by slug: criteria, hints, URLs, submission, template
  choice), peer review, dashboard. `useDisplayName()` derives the first name.
- **Sandboxes**: `lib/python.ts` (+ `pythonExt`), `lib/jsExt.ts`, `lib/sqlExt.ts`
  — tiny in-browser interpreters; no server execution.
- **Auth bootstrap**: `store.bootstrap()` restores the Supabase session, loads the
  profile + real stats, or falls through to landing on any network hiccup.

---

## 8. Next priorities

1. **⏳ Finish deploy** — add remaining env vars to Vercel, redeploy, verify the
   cron fires and Day-1 email sends.
2. **Priority 3 — Homepage update with Three.js.**
   - **Three.js only on the hero background.**
   - **Keep the current homepage header unchanged.**
   - Motion-first hero, mentorship section, outcomes, FAQ (see
     `components/landing/`: `Landing`, `ThreeHero`, `Mentorship`, `MentorApply`,
     `Ticker`, `Reveal`, `LandingDemo`).
3. **Icon migration** — replace all emojis (incl. `CAPSTONE_TEMPLATES.emoji`) with
   Font Awesome, per the icon reference doc (not yet in repo).
4. **Curriculum ↔ DB reconciliation** — land the ~125 TS lessons + 7th capstone
   into `lessons` / `projects` so `learnerStats` reflects real content (see the
   §3.4 and §4.3 drift notes); confirm the "NOT YET APPLIED" migrations are live.

---

## 9. Known drifts / cleanup backlog (single list)

- DB `lessons` table has 2 rows; app authors ~125 lessons in TS → stats undercount.
- App has 7 capstones; DB seeds 6 (`classical-ml-model-comparison` missing).
- `auto_assign_peer_reviewers` + `seed_rag_lesson` migrations flagged "NOT YET
  APPLIED" — verify against live DB.
- `CAPSTONE_TEMPLATES` still contain emoji fields (violates no-emoji rule).
- Referenced but absent from the repo: `FRAMIS_MASTER_SPEC.md`,
  `FRAMIS_ICON_REFERENCE.md` (this `SPEC.md` supersedes the former).
