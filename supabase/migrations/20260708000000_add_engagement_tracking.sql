-- ============================================================
-- Engagement tracking + admin dashboard (see spec: Engagement
-- Tracking & Admin Dashboard). Additive only — no existing
-- table, column, or policy is altered beyond adding `is_admin`
-- to profiles.
-- ============================================================

-- ---------- admin flag ----------
-- Single boolean, no roles/permissions system — per spec §4, there is
-- exactly one admin (Stephen) for now.
alter table public.profiles add column is_admin boolean not null default false;

-- ---------- raw engagement events ----------
-- Full history of every tracked interaction, one row per event. Kept
-- separate from the summary table so later analysis (e.g. "do learners
-- who reopen the glossary score higher on quizzes?") isn't lost, while
-- the dashboard never has to aggregate this table directly.
create table public.lesson_engagement_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  module_id text not null,
  phase smallint not null,
  event_type text not null check (
    event_type in (
      'page_view',
      'scroll_depth',
      'explainer_open',
      'explain_simpler_toggle',
      'sandbox_attempt',
      'sandbox_complete',
      'quiz_attempt',
      'quiz_complete'
    )
  ),
  event_value jsonb not null default '{}'::jsonb,
  session_id uuid not null,
  created_at timestamptz not null default now()
);

create index lesson_engagement_events_user_lesson_idx on public.lesson_engagement_events (user_id, lesson_id);
create index lesson_engagement_events_session_idx on public.lesson_engagement_events (session_id);

alter table public.lesson_engagement_events enable row level security;

create policy "Users can insert their own engagement events"
  on public.lesson_engagement_events for insert
  with check ((select auth.uid ()) = user_id);

create policy "Users can view their own engagement events"
  on public.lesson_engagement_events for select
  using (
    (select auth.uid ()) = user_id
    or exists (select 1 from public.profiles p where p.id = (select auth.uid ()) and p.is_admin)
  );

-- ---------- aggregated per-learner-per-lesson summary ----------
-- This is what every dashboard/report screen actually queries — keeps
-- load fast regardless of how many raw events pile up.
create table public.lesson_engagement_summary (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  module_id text not null default '',
  phase smallint not null default 1,
  total_time_seconds int not null default 0,
  max_scroll_pct smallint not null default 0,
  explainer_opens_count int not null default 0,
  explain_simpler_used boolean not null default false,
  sandbox_attempted boolean not null default false,
  sandbox_completed boolean not null default false,
  quiz_best_score numeric,
  quiz_attempts int not null default 0,
  visit_count int not null default 0,
  engagement_score numeric not null default 0,
  last_visited_at timestamptz,
  primary key (user_id, lesson_id)
);

alter table public.lesson_engagement_summary enable row level security;

create policy "Users can view their own engagement summary"
  on public.lesson_engagement_summary for select
  using (
    (select auth.uid ()) = user_id
    or exists (select 1 from public.profiles p where p.id = (select auth.uid ()) and p.is_admin)
  );

-- Summary rows are only ever written by the (service-role) engagement
-- API route via `recompute_lesson_engagement_summary`, never directly by
-- learners, so no insert/update policy is granted to `authenticated`.

-- ---------- recompute function ----------
-- Rebuilds one (user_id, lesson_id) summary row from the full raw-event
-- history for that pair. Simple "recompute on each new event" per the
-- spec's build order — cheap enough at current volume, can be swapped
-- for an incremental update later without changing callers.
create or replace function public.recompute_lesson_engagement_summary(p_user_id uuid, p_lesson_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module_id text;
  v_phase smallint;
  v_total_time int;
  v_max_scroll smallint;
  v_explainer_opens int;
  v_simpler_used boolean;
  v_sandbox_attempted boolean;
  v_sandbox_completed boolean;
  v_quiz_best numeric;
  v_quiz_attempts int;
  v_visit_count int;
  v_scroll_pct numeric;
  v_interaction_pct numeric;
  v_sandbox_pct numeric;
  v_quiz_pct numeric;
  v_score numeric;
  v_last_visit timestamptz;
begin
  select
    coalesce(max(module_id), ''),
    coalesce(max(phase), 1),
    coalesce(sum((event_value->>'seconds')::int) filter (where event_type = 'page_view'), 0),
    coalesce(max((event_value->>'pct')::int) filter (where event_type = 'scroll_depth'), 0),
    coalesce(count(*) filter (where event_type = 'explainer_open'), 0),
    coalesce(bool_or(event_type = 'explain_simpler_toggle'), false),
    coalesce(bool_or(event_type = 'sandbox_attempt'), false),
    coalesce(bool_or(event_type = 'sandbox_complete'), false),
    max((event_value->>'score')::numeric) filter (where event_type in ('quiz_attempt', 'quiz_complete')),
    coalesce(count(*) filter (where event_type in ('quiz_attempt', 'quiz_complete')), 0),
    coalesce(count(distinct session_id) filter (where event_type = 'page_view'), 0),
    max(created_at)
  into
    v_module_id, v_phase, v_total_time, v_max_scroll, v_explainer_opens, v_simpler_used,
    v_sandbox_attempted, v_sandbox_completed, v_quiz_best, v_quiz_attempts, v_visit_count, v_last_visit
  from public.lesson_engagement_events
  where user_id = p_user_id and lesson_id = p_lesson_id;

  -- Composite 0-100 score. Time-on-page is deliberately excluded — it's
  -- the easiest signal to game and least reliable alone (spec §1).
  v_scroll_pct := least(100, greatest(0, v_max_scroll));
  v_interaction_pct := least(100, (v_explainer_opens * 15) + (case when v_simpler_used then 25 else 0 end));
  v_sandbox_pct := case when v_sandbox_completed then 100 when v_sandbox_attempted then 40 else 0 end;
  v_quiz_pct := least(100, greatest(0, coalesce(v_quiz_best, 0)));

  v_score := round(
    (v_scroll_pct * 0.25) + (v_interaction_pct * 0.20) + (v_sandbox_pct * 0.25) + (v_quiz_pct * 0.30)
  );

  insert into public.lesson_engagement_summary (
    user_id, lesson_id, module_id, phase, total_time_seconds, max_scroll_pct,
    explainer_opens_count, explain_simpler_used, sandbox_attempted, sandbox_completed,
    quiz_best_score, quiz_attempts, visit_count, engagement_score, last_visited_at
  )
  values (
    p_user_id, p_lesson_id, v_module_id, v_phase, v_total_time, v_max_scroll,
    v_explainer_opens, v_simpler_used, v_sandbox_attempted, v_sandbox_completed,
    v_quiz_best, v_quiz_attempts, v_visit_count, v_score, v_last_visit
  )
  on conflict (user_id, lesson_id) do update set
    module_id = excluded.module_id,
    phase = excluded.phase,
    total_time_seconds = excluded.total_time_seconds,
    max_scroll_pct = excluded.max_scroll_pct,
    explainer_opens_count = excluded.explainer_opens_count,
    explain_simpler_used = excluded.explain_simpler_used,
    sandbox_attempted = excluded.sandbox_attempted,
    sandbox_completed = excluded.sandbox_completed,
    quiz_best_score = excluded.quiz_best_score,
    quiz_attempts = excluded.quiz_attempts,
    visit_count = excluded.visit_count,
    engagement_score = excluded.engagement_score,
    last_visited_at = excluded.last_visited_at;
end;
$$;

-- ---------- on-write trigger ----------
-- Keeps the summary table current the moment new events land, so the
-- dashboard/report never has to run this aggregation itself.
create or replace function public.trigger_recompute_lesson_engagement_summary()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recompute_lesson_engagement_summary(new.user_id, new.lesson_id);
  return new;
end;
$$;

create trigger recompute_engagement_summary_after_insert
  after insert on public.lesson_engagement_events
  for each row execute function public.trigger_recompute_lesson_engagement_summary();
