# Framis

> Engineering forward. Learn to think like an engineer who builds with AI.

An interactive prototype of the **Framis** learning platform — a motion-first,
project-based curriculum that takes developers from zero to full-stack AI
engineer in 12 months. Built from the [Claude Design](https://claude.ai/design)
handoff (see `chats/` and `project/` for the original brief and prototype).

This is a **hi-fi investor demo**: fully working navigation, state, and a
runnable sandbox — not a static mockup.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (brand tokens in `tailwind.config.ts`)
- **Framer Motion** available for richer motion; the hero/lesson animations are
  hand-tuned canvas + CSS to match the prototype exactly
- **Zustand** for cross-screen app state
- Fonts: Inter · IBM Plex Sans · Fira Code (via `next/font`)

## The five flows

| Flow | What it shows |
|------|---------------|
| **Landing** | Motion-first hero: particle-network canvas, self-typing lesson demo, animated stat counters, concept ticker, scroll-reveal sections, 12-month roadmap |
| **Onboarding** | 3 steps — account → placement quiz → setup checklist (personalises the start point) |
| **Dashboard** | Week 18/48 progress, streak, this-week tasks, capstone + peer-review cards, badges |
| **Lesson (Variables)** | Playable box-metaphor motion viz, runnable mini-Python sandbox, quiz with feedback, "explain simpler" toggle |
| **Capstone** | Notes App brief, acceptance-criteria checklist, progressive hints, submission flow |
| **Peer review** | Anonymised code with a planted plain-text-password bug, weighted scorecard, guided feedback |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

## Project structure

```
app/                 # Next.js App Router entry, layout, fonts, globals
components/
  landing/           # Landing + HeroCanvas, LandingDemo, Ticker, Reveal
  onboarding/        # 3-step onboarding
  app/               # AppShell + Sidebar, Dashboard, Lesson, LessonViz,
                     #   Capstone, PeerReview
  ui.tsx             # shared Logo / Check primitives
lib/
  store.ts           # Zustand store (all screen + form state)
  python.ts          # tiny Python-ish interpreter for the sandbox
  data.ts            # static curriculum / quiz / rubric content
project/             # original Claude Design handoff (reference only)
chats/               # original design conversation (reference only)
```

## Design tokens

Navy `#0A1428` · Blue `#0066CC` · Teal `#4B9E8F` · Success `#059669`.
Full palette in `tailwind.config.ts`.
