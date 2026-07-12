# Framis — repo guide for coding agents

Framis is a motion-first, project-based curriculum that takes a **complete beginner** (~12+, zero IT/dev background) to full-stack AI engineer. **`SPEC.md` is the source of truth** for product facts (free forever, £150/mo mentor, 28 modules / 7 phases / 64 weeks, no emojis, etc.) — read it before changing product copy or claims.

Working notes:
- **Deploy = push to `main`** (Vercel auto-deploys). Run **`npx next lint`** before opening any PR — local lint now matches Vercel (`.eslintrc.json` has `root: true`), so a clean local lint means the prod build won't fail on lint.
- Lesson content lives in `lib/lessons/content/lesson-NN[-k].ts` as `LessonData` objects (`lib/lessons/types.ts`), rendered by `components/app/lessons/GenericLesson.tsx`.

---

# Lesson Writing Standard

**Audience: complete beginners, ~12+, zero IT/dev background.** This standard is **canonical for every lesson, every module, permanently.** Every rule names the actual `LessonData` field it governs, so it's checkable against real code — not just against how a section is labelled on screen.

## The lesson object — fixed structure, field by field

Never remove, reorder, or rename these. Each field has **one distinct job** (see Rule 6) — don't let two fields say the same thing in different words.

| On-screen section | `LessonData` field(s) | Its one job |
|---|---|---|
| **Main explanation** | `concept` | Teach the idea from scratch, in plain English, using the lesson's single analogy. Short paragraphs separated by a blank line (`\n\n`) — the renderer honors these. |
| **Explain it simpler** | `conceptSimpler` | The same idea, shorter and even plainer — the fallback for a learner who didn't get `concept`. Genuinely simpler, not the same sentence reworded. |
| **Watch it happen** | `vizStages[]` — each `{ label, body, code? }` | Show the concept happening, step by step. `body` = plain narration; `code` = the literal thing typed and what the computer replies. Held to the **same** no-jargon standard as `concept` (Rule 5). |
| **Try it yourself** | `sandbox` — `{kind:"explore", stages}` or `{kind:"code", challenge, starterCode}` | Hands-on practice. Same no-jargon rule; every example name must be beginner-safe (Rule 4). |
| **Check your understanding** | `quizQuestion`, `quizCode?`, `quizOptions`, `quizFeedbackCorrect`, `quizFeedbackIncorrect` | One question on the core idea. `quizCode` follows Rule 2 (real code) and Rule 4 (safe names). Feedback teaches *why*, it doesn't just say right/wrong. |
| **In the real world** | `realWorldIntro` (+ optional `realWorldCode`) | The big-picture "why this matters in the real world" for the **whole lesson's** concept. Connect to something a beginner can picture (Rule 8). |
| **Key takeaway** | `takeaway` | One-line recap of the whole lesson. |
| **Key terms & tips** | `explainers[]` — each `{ term, shortDef, longDef, whyMatters, realWorldExample, emoji, ... }` | The glossary sidebar: one entry for each jargon term the lesson uses (Rule 3). |

> The seven named sections above (plus Try it yourself, Check your understanding, Key takeaway) are the full lesson. The rules below apply to **all** of these fields — the sandbox and quiz are not exempt.

### The two "real world" layers — distinct jobs, keep both
- **Lesson-level `realWorldIntro` / `realWorldCode`** — the big-picture "why this matters in the real world" for the **whole lesson's concept**.
- **Explainer-level `explainers[].whyMatters` / `explainers[].realWorldExample`** — the same *kind* of idea, but **scoped to that one specific term** in the glossary. Keep both. Never let an explainer's version simply repeat the lesson-level one — the explainer is about its term, the lesson-level is about the whole concept.

## The rules

1. **One analogy per lesson, used consistently.** Pick a single everyday analogy — texting, a video-game save point, shared class notes, a locker, a group essay — and reuse it across `concept`, `conceptSimpler`, and the `explainers[].realWorldExample` entries. **Never introduce a second, competing analogy** within the same lesson.

2. **The analogy never replaces the real command.** Every lesson must show the literal thing to type as plain, unambiguous code — in `vizStages[].code`, the `sandbox`, and `quizCode` — kept visually and structurally **separate** from the metaphor prose in `concept` and `vizStages[].body`. Analogy explains *why*; the code block shows *what to type* (e.g. `git commit -m "message"`).

3. **Define every term the moment it's first used.** A word like "terminal", "commit", "branch", or "directory" must never appear in `concept` or `vizStages[].body` without a plain-English definition right there — and every such term must have a matching `explainers[]` entry (`term` + `shortDef` + `longDef`).

4. **No dev-jargon in file, project, or example names until it's been taught.** In `concept`, `vizStages[].code`, `sandbox`, `quizCode`, and `realWorldCode`, use names a 12-year-old recognises — `homework.txt`, `essay.txt`, `my-game`, `photos.txt` — never `index.html`, `config.js`, `feature/new-header`, and the like, until that concept was explicitly taught in an earlier lesson.

5. **`vizStages` ("Watch it happen") is held to the main-explanation standard.** It is **not exempt** from the no-jargon rule — check it specifically, because it is the section most likely to slip back into dev-shorthand.

6. **Each field adds something new, never a restatement.** `concept`, `conceptSimpler`, `takeaway`, and each `explainers[]` field must each do their one job (see the table). If two say the same thing, rewrite one to serve a distinct purpose: *what it does* vs. *why it's useful* vs. *what happens if you don't*.

7. **Cross-lesson consistency.** Analogies can differ from lesson to lesson, but must **never contradict each other on how the underlying concept actually behaves** — e.g. one lesson implying an action is permanent while another implies the same action is easily undone. Re-read the lessons in sequence before marking a module complete.

8. **`realWorldIntro` must connect to something the learner can picture** — e.g. "this is how people build apps like Instagram" — never internal developer-workflow jargon.

## Difficulty Tiers

These do **not** replace any rule above — one analogy, paragraph spacing, define-before-use, and no silent jargon apply at **every** tier. A tier changes only **what counts as "already taught"** (Rules 3 and 4). Match the tier to the lesson's `phase` (derivable from `num`: modules 1–8 = Phases 1–2, 9–20 = Phases 3–5, 21–28 = Phases 6–7).

Not every lesson can assume zero background — a Phase 6 transformers lesson is inherently for someone who has already survived Phases 1–5. The "explain clearly" discipline never relaxes; only the "assume zero background" bar moves.

### Tier 1 — True Beginner (Phases 1–2 · modules 1–8)
Audience: complete beginners, zero IT/dev background, age ~12+.
- Assume **nothing** beyond what was explicitly taught in an earlier Tier 1 lesson.
- Analogies must come from everyday life a 12-year-old already knows (texting, games, school, a locker, a group chat).
- Every technical term is defined in plain English at first use, every time — no exceptions. Each such term gets an `explainers[]` entry.
- No dev-jargon in examples (`concept`, `vizStages[].code`, `sandbox`, `quizCode`, `realWorldCode`) until it has been taught (Rule 4).

### Tier 2 — Building Learner (Phases 3–5 · modules 9–20)
Audience: has completed Phases 1–2. Knows programming fundamentals, basic web/full-stack concepts, and terminal/Git.
- May assume concepts explicitly taught in Phases 1–2 (variables, functions, loops, terminal commands, git basics, HTTP/API basics where covered).
- Still requires **one consistent analogy** per lesson and paragraph spacing — the "explain clearly" rule never relaxes, only the "assume zero background" rule does.
- New terms specific to this tier (e.g. "DataFrame", "model", "training") must still be defined at first use via `explainers[]` — don't assume the learner has seen them just because they're now more advanced.
- Analogies can draw on slightly broader references (school subjects, sports, organising a room) but should still avoid workplace/office jargon.

### Tier 3 — Advanced Learner (Phases 6–7 · modules 21–28)
Audience: has completed Phases 1–5. Comfortable with programming, data, and foundational ML concepts.
- May assume everything explicitly taught in Phases 1–5.
- Analogies are **optional** if the concept is genuinely abstract (e.g. attention mechanisms, backpropagation) — but if used, still single and consistent, not stacked.
- Explanations must still be paced and spaced. Density of PRIOR knowledge assumed does **not** excuse density of WRITING — a wall of text is still a wall of text at Tier 3.
- New/advanced terms still get defined at first use, even for an experienced learner: assume expertise in the prerequisites, not mind-reading of new vocabulary.

### Applying the tiers
Before rewriting or auditing any lesson, check its `phase` and apply the matching tier's assumptions.
- **Don't apply Tier 1 rules to a Phase 6 lesson** (e.g. re-explaining what a variable is) — it wastes space re-teaching what's already known and buries the actual new content.
- **Don't apply Tier 3 looseness to a Phase 1–2 lesson** — that's exactly the failure mode that made Lesson 1 (terminal) and Lesson 5 (JS) fail beginners.

## Process for every module
- Write or rewrite lessons using the rules above.
- **Before pushing, re-read the full module back to back as a complete beginner would** — not lesson by lesson in isolation.
- Flag anything that still assumes prior IT/dev knowledge before it's been taught.
- Run `npx next lint` before opening the PR.

## Brand note
Per `SPEC.md`, the site uses **no emojis** (Font Awesome icons instead). The `explainers[].emoji` field is legacy and slated for replacement — don't rely on it to carry meaning, and don't add emojis to lesson prose.
