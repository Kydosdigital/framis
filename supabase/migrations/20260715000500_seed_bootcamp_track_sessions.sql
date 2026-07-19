-- ============================================================
-- Seed the 24 sessions of the 3-Month Web App + AI Engineering
-- Track from the source curriculum doc (Framis Mentor Bootcamp).
-- Content is taken from that doc, not regenerated.
--
-- Idempotent: re-running updates title/month/description in place
-- via the (track_id, session_number) unique constraint, so this is
-- safe to apply more than once and safe to edit-and-reapply.
--
-- Month grouping mirrors the doc: M1 Foundations (S1-S8),
-- M2 MCP/Docker/RAG/first agents (S9-S16), M3 Capstone (S17-S24).
-- ============================================================

-- Bring the track blurb in line with the doc's honest framing
-- (two shipped projects; Kubernetes/production RAG guided, not mastered).
update public.curriculum_tracks
set description = 'Mentor-led 3-month bootcamp: 2 sessions/week over 12 weeks (24 sessions). Students ship two real, deployed, explainable projects — a foundational web app with a real backend, and an AI-powered capstone — using Claude Code and Copilot as primary build tools. Genuine hands-on experience with prompt engineering, Supabase, MCP, Docker, basic RAG and a first AI agent; Kubernetes and production-grade RAG are covered as confidently guided, not mastered.'
where name = '3-Month Web App + AI Engineering Track';

with t as (
  select id from public.curriculum_tracks
  where name = '3-Month Web App + AI Engineering Track'
  limit 1
)
insert into public.curriculum_track_sessions (track_id, session_number, title, month, description)
select t.id, v.session_number, v.title, v.month, v.description
from t,
(values
  -- ---------- Month 1 — Foundations: Real Tools, Real Backend, Real Habits ----------
  (1, $d$Setup: VS Code, Claude Code, Copilot, GitHub$d$, 1,
   $d$Setup (VS Code, Claude Code, Copilot, GitHub). What a web app is vs. a website. First scaffold with Claude Code, narrated.$d$),
  (2, $d$Prompt engineering fundamentals$d$, 1,
   $d$Prompt engineering fundamentals: clarity, context, iteration, asking the AI to explain its reasoning. Rebuild S1's scaffold more intentionally using better prompts.$d$),
  (3, $d$Backend concepts + Supabase setup$d$, 1,
   $d$Backend concepts (data, auth, logic) + Supabase setup: tables, auth, basic queries.$d$),
  (4, $d$Connect frontend to Supabase$d$, 1,
   $d$Connect frontend to Supabase for real. App now saves/loads real data.$d$),
  (5, $d$Git and GitHub properly$d$, 1,
   $d$Git/GitHub properly: init/add/commit/push, branches, PRs. Push the project with a real commit history.$d$),
  (6, $d$Copilot vs. Claude Code$d$, 1,
   $d$Copilot vs. Claude Code: when to use inline suggestions vs. agentic task delegation. Practice both on the same feature.$d$),
  (7, $d$Feature-building prompt engineering$d$, 1,
   $d$Feature-building prompt engineering: breaking an ambitious ask into buildable chunks. Add one real feature end to end.$d$),
  (8, $d$Deploy Project 1$d$, 1,
   $d$Deploy Project 1 (Vercel or similar). Live URL. Review: what did they build vs. what did the AI build — can they explain every part of it?$d$),

  -- ---------- Month 2 — Going Deeper: MCP, Docker, RAG, and First Agents ----------
  (9, $d$MCP properly$d$, 2,
   $d$MCP properly: what it is, why it exists (giving AI tools access to real data/systems instead of guessing). Connect and use one real MCP server hands-on.$d$),
  (10, $d$Build a feature with an MCP connector$d$, 2,
   $d$Build a small feature using an MCP connector for real — not a demo, something in their own project.$d$),
  (11, $d$What LLMs actually are$d$, 2,
   $d$What LLMs actually are (tokens, context windows, why prompting matters) — enough real understanding to reason about model behaviour, not just use it as a black box.$d$),
  (12, $d$RAG, hands-on$d$, 2,
   $d$RAG, hands-on: build a simple retrieval-augmented feature (e.g. "answer questions about a document I upload") using Supabase + embeddings. Real code, real result, appropriately scoped — not a production-grade pipeline, but genuinely built and understood.$d$),
  (13, $d$Docker fundamentals$d$, 2,
   $d$Docker fundamentals: what containers are and why they exist, write a real Dockerfile for their Project 1 app, run it locally in a container.$d$),
  (14, $d$AI agents, conceptually and hands-on$d$, 2,
   $d$AI agents, conceptually and then hands-on: what makes something an "agent" vs. a single AI call (tools, multi-step reasoning, autonomy). Claude Code itself is the running example.$d$),
  (15, $d$Build a first simple agent$d$, 2,
   $d$Build a first simple agent: a small script/app that uses an LLM with tool access to complete a multi-step task on its own.$d$),
  (16, $d$Review + scope Project 2$d$, 2,
   $d$Review + start scoping Project 2 (the capstone/"genius idea") — student pitches their idea, mentor helps shape scope to be ambitious but achievable in 4 remaining weeks.$d$),

  -- ---------- Month 3 — The Capstone: Build the Genius Idea, Ship It, Present It ----------
  (17, $d$Capstone build begins$d$, 3,
   $d$Capstone build begins: scaffold + backend setup, applying everything from Month 1 with much less mentor scaffolding needed.$d$),
  (18, $d$Core feature build$d$, 3,
   $d$Core feature build, prompt-engineering their way through genuinely hard parts rather than defaulting to the simplest version.$d$),
  (19, $d$Integrate the AI-native piece$d$, 3,
   $d$Integrate the AI-native piece (MCP, RAG, or agent behaviour — whichever fits their idea) — this is the "genius idea, not just a simple thing" requirement made concrete.$d$),
  (20, $d$Kubernetes, conceptual + guided hands-on$d$, 3,
   $d$Kubernetes, conceptual + guided hands-on: what it's for (running many containers at scale), why Docker alone isn't enough at scale, a guided walkthrough of a basic deployment to a managed Kubernetes service. Framed honestly: "you now know enough to keep learning this on the job — full mastery takes longer than 3 months and that's normal."$d$),
  (21, $d$Debugging + polish$d$, 3,
   $d$Debugging + polish session — real production apps break; teach debugging with Claude Code as a genuine skill, not just building.$d$),
  (22, $d$Deploy Project 2$d$, 3,
   $d$Deploy Project 2 for real. Live URL.$d$),
  (23, $d$Presentation prep$d$, 3,
   $d$Presentation prep: each student prepares to explain their app, their architecture, and one hard problem they solved.$d$),
  (24, $d$Demo day$d$, 3,
   $d$Demo day: each student presents both projects. Revisit the vision/mission/drive writing from the intro session — how does this connect? Parents invited if possible — this is the natural moment for the honest, real-numbers report from the engagement dashboard to also come into play.$d$)
) as v(session_number, title, month, description)
on conflict (track_id, session_number) do update set
  title = excluded.title,
  month = excluded.month,
  description = excluded.description;
