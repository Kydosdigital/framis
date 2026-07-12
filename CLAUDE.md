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

## Process for every module
- Write or rewrite lessons using the rules above.
- **Before pushing, re-read the full module back to back as a complete beginner would** — not lesson by lesson in isolation.
- Flag anything that still assumes prior IT/dev knowledge before it's been taught.
- Run `npx next lint` before opening the PR.

## Brand note
Per `SPEC.md`, the site uses **no emojis** (Font Awesome icons instead). The `explainers[].emoji` field is legacy and slated for replacement — don't rely on it to carry meaning, and don't add emojis to lesson prose.
