-- The onboarding wizard collects a placement quiz, a setup checklist, and
-- (as of the 9-step Welcome flow) a learning goal, but none of it was ever
-- written to the database — it lived in memory and vanished on completion.
-- This also adds the bookkeeping the Day 1-7 welcome email cron needs to
-- know who's due for their next email.

alter table public.profiles
  add column learning_goal text,
  add column placement_answers jsonb,
  add column setup_checklist jsonb,
  add column onboarding_completed_at timestamptz,
  add column welcome_email_day smallint not null default 0;

comment on column public.profiles.learning_goal is 'Free-text answer from the Quick Start onboarding step.';
comment on column public.profiles.placement_answers is 'Answers to the 3-question placement quiz from onboarding (q1/q2/q3).';
comment on column public.profiles.setup_checklist is 'Which local setup steps (Python/VS Code/Git) the learner had checked off during onboarding.';
comment on column public.profiles.onboarding_completed_at is 'When the learner finished the onboarding flow; null until then. Anchors the Day 1-7 welcome email schedule.';
comment on column public.profiles.welcome_email_day is 'Last Day-N welcome email successfully sent (0 = none yet, up to 7). Lets the daily cron send each day''s email exactly once.';
