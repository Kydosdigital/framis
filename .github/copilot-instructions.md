# Copilot instructions — Framis

Framis is a motion-first curriculum for **complete beginners** (~12+, zero IT/dev background). `SPEC.md` is the source of truth for product facts (free forever, £150/mo mentor, 28 modules / 7 phases / 64 weeks, no emojis). Run `npx next lint` before opening a PR — local lint matches Vercel (`.eslintrc.json` has `root: true`), so a clean local lint means the production build won't fail on lint.

**When writing or editing any lesson content** (`lib/lessons/content/lesson-*.ts`, `LessonData` objects in `lib/lessons/types.ts`, rendered by `components/app/lessons/GenericLesson.tsx`), follow the Lesson Writing Standard below **exactly**. It is canonical for every lesson, every module, permanently. (This file mirrors the same standard in the repo-root `CLAUDE.md` — keep the two in sync.)

---

# Lesson Writing Standard

Every rule names the actual `LessonData` field it governs, so it's checkable against real code — not just against the on-screen section label.

## The lesson object — fixed structure, field by field

Never remove, reorder, or rename these. Each field has **one distinct job** (Rule 6); don't let two fields say the same thing.

| On-screen section | `LessonData` field(s) | Its one job |
|---|---|---|
| **Main explanation** | `concept` | Teach the idea from scratch, plain English, using the lesson's single analogy. Short paragraphs separated by a blank line (`\n\n`). |
| **Explain it simpler** | `conceptSimpler` | The same idea, shorter and even plainer — the fallback if `concept` didn't land. Genuinely simpler, not reworded. |
| **Watch it happen** | `vizStages[]` — `{ label, body, code? }` | Show it happening step by step. `body` = plain narration; `code` = the literal thing typed and the computer's reply. Same no-jargon standard as `concept` (Rule 5). |
| **Try it yourself** | `sandbox` — `explore` stages or a `code` challenge | Hands-on. Same no-jargon rule; beginner-safe example names (Rule 4). |
| **Check your understanding** | `quizQuestion`, `quizCode?`, `quizOptions`, `quizFeedbackCorrect`, `quizFeedbackIncorrect` | One question on the core idea. `quizCode` follows Rules 2 & 4. Feedback teaches *why*. |
| **In the real world** | `realWorldIntro` (+ optional `realWorldCode`) | Big-picture "why this matters" for the **whole lesson's** concept; picturable, not dev-workflow (Rule 8). |
| **Key takeaway** | `takeaway` | One-line recap of the whole lesson. |
| **Key terms & tips** | `explainers[]` — `{ term, shortDef, longDef, whyMatters, realWorldExample, emoji, ... }` | Glossary sidebar: one entry per jargon term used (Rule 3). |

> These sections (plus Try it yourself, Check your understanding, Key takeaway) are the full lesson. The rules apply to **all** of them — the sandbox and quiz are not exempt.

### The two "real world" layers — distinct jobs, keep both
- **Lesson-level `realWorldIntro` / `realWorldCode`** — big-picture "why this matters in the real world" for the **whole lesson's concept**.
- **Explainer-level `explainers[].whyMatters` / `explainers[].realWorldExample`** — the same *kind* of idea, **scoped to that one specific term** in the glossary. Keep both; the explainer's version is about its term, never a repeat of the lesson-level one.

## The rules

1. **One analogy per lesson, used consistently** across `concept`, `conceptSimpler`, and `explainers[].realWorldExample` (texting, a video-game save point, shared class notes, a locker, a group essay). Never introduce a second, competing analogy in the same lesson.

2. **The analogy never replaces the real command.** Show the literal thing to type as plain code — in `vizStages[].code`, `sandbox`, and `quizCode` — kept separate from the metaphor prose in `concept` / `vizStages[].body`. Analogy explains *why*; the code shows *what to type* (e.g. `git commit -m "message"`).

3. **Define every term the moment it's first used.** No "terminal", "commit", "branch", "directory" in `concept` or `vizStages[].body` without a plain-English definition right there — and each gets a matching `explainers[]` entry (`term` + `shortDef` + `longDef`).

4. **No dev-jargon in file/project/example names until taught.** In `concept`, `vizStages[].code`, `sandbox`, `quizCode`, `realWorldCode`: use `homework.txt`, `essay.txt`, `my-game`, `photos.txt` — never `index.html`, `config.js`, `feature/new-header`, until that concept was taught in an earlier lesson.

5. **`vizStages` ("Watch it happen") is held to the main-explanation standard** — not exempt from the no-jargon rule. Check it specifically; it's the section most likely to slip into dev-shorthand.

6. **Each field adds something new, never a restatement.** `concept` vs `conceptSimpler` vs `takeaway` vs `explainers[].*` each do their one job (see table): *what it does* vs. *why it's useful* vs. *what happens if you don't*.

7. **Cross-lesson consistency.** Analogies can differ per lesson, but must never contradict each other on how the concept actually behaves (e.g. permanent in one lesson, easily undone in another). Re-read lessons in sequence before marking a module complete.

8. **`realWorldIntro` connects to something the learner can picture** ("how people build apps like Instagram"), never internal developer-workflow jargon.

## Difficulty Tiers

These do **not** replace any rule above — one analogy, paragraph spacing, define-before-use, and no silent jargon apply at **every** tier. A tier changes only **what counts as "already taught"** (Rules 3 and 4). Match the tier to the lesson's `phase` (from `num`: modules 1–8 = Phases 1–2, 9–20 = Phases 3–5, 21–28 = Phases 6–7).

Not every lesson can assume zero background — a Phase 6 transformers lesson is inherently for someone who has already survived Phases 1–5. The "explain clearly" discipline never relaxes; only the "assume zero background" bar moves.

### Tier 1 — True Beginner (Phases 1–2 · modules 1–8)
Complete beginners, zero IT/dev background, age ~12+.
- Assume **nothing** beyond what was explicitly taught in an earlier Tier 1 lesson.
- Analogies from everyday life a 12-year-old knows (texting, games, school, a locker, a group chat).
- Every technical term defined in plain English at first use, every time — each gets an `explainers[]` entry.
- No dev-jargon in examples (`concept`, `vizStages[].code`, `sandbox`, `quizCode`, `realWorldCode`) until taught (Rule 4).

### Tier 2 — Building Learner (Phases 3–5 · modules 9–20)
Has completed Phases 1–2: programming fundamentals, basic web/full-stack, terminal/Git.
- May assume concepts explicitly taught in Phases 1–2 (variables, functions, loops, terminal, git basics, HTTP/API where covered).
- Still requires **one consistent analogy** per lesson and paragraph spacing — "explain clearly" never relaxes, only "assume zero background" does.
- New tier-specific terms (e.g. "DataFrame", "model", "training") still defined at first use via `explainers[]`.
- Analogies may draw on broader references (school subjects, sports, organising a room), still avoiding workplace/office jargon.

### Tier 3 — Advanced Learner (Phases 6–7 · modules 21–28)
Has completed Phases 1–5: comfortable with programming, data, and foundational ML.
- May assume everything explicitly taught in Phases 1–5.
- Analogies are **optional** if the concept is genuinely abstract (attention, backpropagation) — but if used, single and consistent, not stacked.
- Still paced and spaced. Density of PRIOR knowledge assumed does **not** excuse density of WRITING — a wall of text is still a wall of text at Tier 3.
- New/advanced terms still defined at first use: assume expertise in prerequisites, not mind-reading of new vocabulary.

### Applying the tiers
Check the lesson's `phase` before rewriting/auditing and apply the matching tier.
- **Don't apply Tier 1 rules to a Phase 6 lesson** (re-explaining a variable) — it buries the new content under known basics.
- **Don't apply Tier 3 looseness to a Phase 1–2 lesson** — that's what made Lesson 1 (terminal) and Lesson 5 (JS) fail beginners.

## Process for every module
- Write/rewrite using the rules above.
- Before pushing, re-read the **full module back to back** as a complete beginner would — not lesson by lesson.
- Flag anything that assumes prior IT/dev knowledge before it's been taught.
- Run `npx next lint`.

## Brand note
Per `SPEC.md`, the site uses **no emojis** (Font Awesome icons instead). `explainers[].emoji` is legacy and slated for replacement — don't rely on it for meaning, and don't add emojis to lesson prose.
