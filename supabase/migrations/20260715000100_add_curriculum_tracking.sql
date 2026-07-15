-- ============================================================
-- Mentor Portal Addendum: Curriculum Tracking + Session Recording
-- (see spec: Mentor Portal Addendum). Additive only — extends the
-- base mentor portal migration (20260715000000_add_mentor_portal.sql:
-- profiles.role, mentor_assignments, mentor_sessions,
-- mentor_session_notes, mentor_messages, is_super_admin()). Nothing
-- in that migration or the engagement system is altered here.
--
-- Adds: (1) the mentor-led bootcamp curriculum as trackable
-- structured content, and (2) fields to capture a Teams
-- recording/summary manually per session.
--
-- Explicitly out of scope (per spec): automated Teams/Graph API
-- sync (manual paste only), multiple simultaneous tracks per student.
-- ============================================================

-- ============================================================
-- curriculum_tracks — a named mentor-led program a student can be
-- enrolled in (e.g. the 3-Month Web App + AI Engineering Track).
-- Separate from the self-paced Framis lesson curriculum. Catalog
-- data: any signed-in user may read it; only super admins manage it.
-- ============================================================
create table public.curriculum_tracks (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

alter table public.curriculum_tracks enable row level security;

create policy "Anyone signed in can view tracks"
  on public.curriculum_tracks for select
  to authenticated
  using (true);

create policy "Only super admins manage tracks"
  on public.curriculum_tracks for all
  using (public.is_super_admin ())
  with check (public.is_super_admin ());

-- ============================================================
-- curriculum_track_sessions — the ordered sessions within a track
-- (1-24 for the 3-month track), grouped by month for the UI.
-- ============================================================
create table public.curriculum_track_sessions (
  id uuid primary key default gen_random_uuid (),
  track_id uuid not null references public.curriculum_tracks (id) on delete cascade,
  session_number int not null,
  title text not null,
  month int,
  description text,
  unique (track_id, session_number)
);

create index curriculum_track_sessions_track_idx
  on public.curriculum_track_sessions (track_id, session_number);

alter table public.curriculum_track_sessions enable row level security;

create policy "Anyone signed in can view track sessions"
  on public.curriculum_track_sessions for select
  to authenticated
  using (true);

create policy "Only super admins manage track sessions"
  on public.curriculum_track_sessions for all
  using (public.is_super_admin ())
  with check (public.is_super_admin ());

-- ============================================================
-- student_track_enrollments — which track a student is enrolled in.
-- One active track at a time is enough for v1 (multiple simultaneous
-- tracks per student is explicitly out of scope), but the unique
-- constraint is on (student_id, track_id) per spec so re-enrolling in
-- the same track is prevented while different tracks aren't blocked
-- at the DB level. The assigned mentor or a super admin enrolls a
-- student; the student and their mentor can read the enrollment.
-- ============================================================
create table public.student_track_enrollments (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  track_id uuid not null references public.curriculum_tracks (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, track_id)
);

create index student_track_enrollments_student_idx
  on public.student_track_enrollments (student_id);

alter table public.student_track_enrollments enable row level security;

-- The student, their currently-assigned mentor, or a super admin.
create policy "Student, their mentor, or super admin view enrollment"
  on public.student_track_enrollments for select
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_enrollments.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- Only the student's active mentor or a super admin enrolls them.
create policy "Assigned mentor or super admin enrolls students"
  on public.student_track_enrollments for insert
  with check (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_enrollments.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

create policy "Assigned mentor or super admin update enrollment"
  on public.student_track_enrollments for update
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_enrollments.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  )
  with check (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_enrollments.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

create policy "Super admins delete enrollment"
  on public.student_track_enrollments for delete
  using (public.is_super_admin ());

-- ============================================================
-- student_track_progress — per-student status against each session
-- in their track. Kept current automatically by a trigger on
-- mentor_sessions (see below), so a mentor logging sessions properly
-- never has to tick progress by hand. Direct writes are still allowed
-- for the assigned mentor / super admin as a manual override.
-- ============================================================
create table public.student_track_progress (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  track_session_id uuid not null references public.curriculum_track_sessions (id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  unique (student_id, track_session_id)
);

create index student_track_progress_student_idx
  on public.student_track_progress (student_id);

alter table public.student_track_progress enable row level security;

create policy "Student, their mentor, or super admin view progress"
  on public.student_track_progress for select
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_progress.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

create policy "Assigned mentor or super admin write progress"
  on public.student_track_progress for all
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_progress.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  )
  with check (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_track_progress.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- ============================================================
-- mentor_sessions extensions — link a logged session to a specific
-- curriculum session, plus the manually-pasted Teams recording link
-- and AI summary. The pasted summary is a raw starting point the
-- mentor edits into student_summary (shared) and the private notes
-- table; it is not itself the final record.
-- ============================================================
alter table public.mentor_sessions
  add column track_session_id uuid references public.curriculum_track_sessions (id) on delete set null,
  add column recording_url text,
  add column ai_generated_summary text;

create index mentor_sessions_track_session_idx
  on public.mentor_sessions (track_session_id);

-- ============================================================
-- Auto-progress: when a mentor session is logged against a track
-- session, keep student_track_progress current without manual
-- ticking (spec: "no separate manual progress-ticking needed if the
-- mentor is already logging sessions properly"). A completed session
-- marks the track session completed; a still-scheduled session marks
-- it in_progress (never downgrading an already-completed one).
-- security definer so it can upsert progress regardless of which
-- mentor/admin triggered it.
-- ============================================================
create or replace function public.sync_track_progress_from_session()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.track_session_id is null then
    return new;
  end if;

  if new.status = 'completed' then
    insert into public.student_track_progress (student_id, track_session_id, status, completed_at)
    values (new.student_id, new.track_session_id, 'completed', coalesce(new.updated_at, now()))
    on conflict (student_id, track_session_id) do update set
      status = 'completed',
      completed_at = coalesce(public.student_track_progress.completed_at, excluded.completed_at);
  else
    -- scheduled / cancelled / no_show against a track session counts as
    -- "in progress", but never downgrades a session already completed.
    insert into public.student_track_progress (student_id, track_session_id, status)
    values (new.student_id, new.track_session_id, 'in_progress')
    on conflict (student_id, track_session_id) do update set
      status = case
        when public.student_track_progress.status = 'completed' then 'completed'
        else 'in_progress'
      end;
  end if;

  return new;
end;
$$;

create trigger sync_track_progress_after_session_write
  after insert or update of status, track_session_id on public.mentor_sessions
  for each row execute function public.sync_track_progress_from_session ();

-- ============================================================
-- Seed: the one track named in the spec. Idempotent — inserts only
-- if a track with this exact name does not already exist. The 24
-- session rows are seeded from the source curriculum doc in a
-- follow-up migration (not fabricated here).
-- ============================================================
insert into public.curriculum_tracks (name, description)
select
  '3-Month Web App + AI Engineering Track',
  'Mentor-led 3-month bootcamp: 24 sessions across 3 months, covering full-stack web app development and AI engineering.'
where not exists (
  select 1 from public.curriculum_tracks where name = '3-Month Web App + AI Engineering Track'
);
