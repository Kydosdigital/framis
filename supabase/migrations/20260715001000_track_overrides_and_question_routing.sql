-- ============================================================
-- (1) Per-student curriculum overrides + a mentor's mini message.
--
-- The seeded 24-session track stays canonical and untouched: a mentor
-- adapting the plan for one student must never rewrite the programme
-- for every other student and mentor on that track. So an edit is an
-- OVERRIDE row scoped to (student, session), not an edit of the
-- curriculum row itself.
--
-- One row carries both jobs:
--   title / description — null means "use the canonical text"
--   mentor_note         — the mini message pinned to this session for
--                         this student
--
-- Written by the student's active mentors (and super admins). The
-- STUDENT can read but not write: it's their mentor's adaptation of
-- the plan, not their own notes (those live in diary_entries).
--
-- (2) Question routing: a student can address a question to one of
-- their mentors.
-- ============================================================

create table public.student_track_session_overrides (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  track_session_id uuid not null references public.curriculum_track_sessions (id) on delete cascade,
  title text,
  description text,
  mentor_note text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, track_session_id)
);

create index student_track_session_overrides_student_idx
  on public.student_track_session_overrides (student_id);

create trigger set_updated_at before update on public.student_track_session_overrides
  for each row execute function public.set_updated_at ();

alter table public.student_track_session_overrides enable row level security;

create policy "Student, their mentors, or super admin read overrides"
  on public.student_track_session_overrides for select
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_session_overrides.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- Only the student's active mentors (or a super admin) may write.
create policy "Assigned mentors write overrides"
  on public.student_track_session_overrides for all
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_session_overrides.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  )
  with check (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_session_overrides.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- ---------- question routing ----------
-- Which mentor the student addressed the question to. Nullable: a
-- question can still be asked without picking anyone. Deliberately does
-- NOT tighten the select policy — every active mentor of that student
-- can still see it, so an unassigned or unavailable mentor can't leave a
-- student stuck; the assignment is routing, not a lock.
alter table public.lesson_questions
  add column assigned_mentor_id uuid references public.profiles (id) on delete set null;

create index lesson_questions_assigned_idx
  on public.lesson_questions (assigned_mentor_id)
  where resolved_at is null;
