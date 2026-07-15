-- ============================================================
-- Mentor Portal & Super Admin Extension (see spec: Mentor Portal
-- & Super Admin Extension). Additive only — builds on top of the
-- already-shipped engagement tracking system
-- (lesson_engagement_events, lesson_engagement_summary, /admin,
-- profiles.is_admin). Nothing in that system is altered here.
--
-- Explicitly out of scope for this migration (per spec): calendar
-- sync/integration, in-app video calling, multi-mentor-per-student.
-- ============================================================

-- ---------- profiles.role ----------
-- `is_admin` (existing) stays untouched and keeps gating the
-- engagement dashboard at /admin. `role` is a new, separate axis
-- used by the mentor portal: a learner is always 'student' unless
-- explicitly made a 'mentor' or 'super_admin'. Any existing is_admin
-- user is backfilled to 'super_admin' so they can use both areas.
alter table public.profiles
  add column role text not null default 'student'
  check (role in ('student', 'mentor', 'super_admin'));

create index profiles_role_idx on public.profiles (role);

update public.profiles set role = 'super_admin' where is_admin = true;

-- ---------- helper: is the current user a super admin? ----------
-- Centralises the "super_admin bypasses restrictions" rule so it
-- isn't hand-duplicated across every policy below. security definer
-- + fixed search_path so it can safely read profiles regardless of
-- the caller's own RLS visibility into that table.
create or replace function public.is_super_admin(p_user_id uuid default auth.uid ())
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select p.role = 'super_admin' from public.profiles p where p.id = p_user_id),
    false
  );
$$;

revoke all on function public.is_super_admin (uuid) from public;
grant execute on function public.is_super_admin (uuid) to authenticated;

-- ============================================================
-- mentor_assignments — which mentor is assigned to which student.
-- One active mentor per student (multi-mentor-per-student is
-- explicitly out of scope). Only a super admin creates/edits
-- assignments (step 5: assign-students-to-mentors UI); mentors and
-- students only ever read their own side of it.
-- ============================================================
create table public.mentor_assignments (
  id uuid primary key default gen_random_uuid (),
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  assigned_by uuid references public.profiles (id) on delete set null,
  active boolean not null default true,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  check (mentor_id <> student_id)
);

create index mentor_assignments_mentor_idx on public.mentor_assignments (mentor_id);
create index mentor_assignments_student_idx on public.mentor_assignments (student_id);

-- Enforces "no multi-mentor-per-student": a student can have at most
-- one *active* assignment row at a time. Re-assigning a student means
-- deactivating the old row (unassigned_at set, active = false) before
-- inserting a new one.
create unique index mentor_assignments_one_active_per_student
  on public.mentor_assignments (student_id)
  where active;

alter table public.mentor_assignments enable row level security;

create policy "Mentors and students view their own assignment"
  on public.mentor_assignments for select
  using (
    (select auth.uid ()) = mentor_id
    or (select auth.uid ()) = student_id
    or public.is_super_admin ()
  );

create policy "Only super admins manage assignments"
  on public.mentor_assignments for insert
  with check (public.is_super_admin ());

create policy "Only super admins update assignments"
  on public.mentor_assignments for update
  using (public.is_super_admin ())
  with check (public.is_super_admin ());

create policy "Only super admins delete assignments"
  on public.mentor_assignments for delete
  using (public.is_super_admin ());

-- ============================================================
-- mentor_sessions — simple list-based scheduling (no calendar
-- UI/sync yet, deferred per spec). `student_summary` is shared with
-- the student and surfaces in the parent report; mentor-private
-- notes live in the separate mentor_session_notes table below so
-- students can never read them, even by accident.
-- ============================================================
create table public.mentor_sessions (
  id uuid primary key default gen_random_uuid (),
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 30 check (duration_minutes > 0),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'completed', 'cancelled', 'no_show')
  ),
  student_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mentor_sessions_mentor_idx on public.mentor_sessions (mentor_id);
create index mentor_sessions_student_idx on public.mentor_sessions (student_id, scheduled_at);

create trigger set_updated_at before update on public.mentor_sessions
  for each row execute function public.set_updated_at ();

alter table public.mentor_sessions enable row level security;

create policy "Mentors and students view their own sessions"
  on public.mentor_sessions for select
  using (
    (select auth.uid ()) = mentor_id
    or (select auth.uid ()) = student_id
    or public.is_super_admin ()
  );

create policy "Mentors create their own sessions"
  on public.mentor_sessions for insert
  with check (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  );

create policy "Mentors update their own sessions"
  on public.mentor_sessions for update
  using (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  )
  with check (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  );

create policy "Mentors delete their own sessions"
  on public.mentor_sessions for delete
  using (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  );

-- ---------- mentor_session_notes — mentor-private, never student-visible ----------
-- Deliberately a separate table (not just a column) so there is no
-- policy on it at all for students — row-level security can hide
-- rows but not columns, so mentor-private notes are kept out of any
-- table students have a select policy on.
create table public.mentor_session_notes (
  id uuid primary key default gen_random_uuid (),
  session_id uuid not null unique references public.mentor_sessions (id) on delete cascade,
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mentor_session_notes_mentor_idx on public.mentor_session_notes (mentor_id);

create trigger set_updated_at before update on public.mentor_session_notes
  for each row execute function public.set_updated_at ();

alter table public.mentor_session_notes enable row level security;

-- No student policy exists here on purpose — students have zero
-- access, not even via a false condition, to this table.
create policy "Mentors manage their own session notes"
  on public.mentor_session_notes for all
  using (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  )
  with check (
    (select auth.uid ()) = mentor_id
    or public.is_super_admin ()
  );

-- ============================================================
-- mentor_messages — simple threaded messages per student (one
-- thread per mentor/student pair, not a generic DM system).
-- ============================================================
create table public.mentor_messages (
  id uuid primary key default gen_random_uuid (),
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) > 0),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (sender_id in (mentor_id, student_id))
);

create index mentor_messages_thread_idx on public.mentor_messages (mentor_id, student_id, created_at);

alter table public.mentor_messages enable row level security;

create policy "Mentors and students view their own thread"
  on public.mentor_messages for select
  using (
    (select auth.uid ()) = mentor_id
    or (select auth.uid ()) = student_id
    or public.is_super_admin ()
  );

-- Only an active assignment's mentor/student pair may message each
-- other, and only as themselves (sender_id must be the caller).
create policy "Assigned mentors and students send messages"
  on public.mentor_messages for insert
  with check (
    (select auth.uid ()) = sender_id
    and ((select auth.uid ()) = mentor_id or (select auth.uid ()) = student_id)
    and exists (
      select 1 from public.mentor_assignments ma
      where ma.mentor_id = mentor_messages.mentor_id
        and ma.student_id = mentor_messages.student_id
        and ma.active
    )
  );

-- Recipients can mark a message read (read_at only); nothing else on
-- the row is meant to change after it's sent.
create policy "Recipients can mark messages read"
  on public.mentor_messages for update
  using (
    (select auth.uid ()) = mentor_id
    or (select auth.uid ()) = student_id
    or public.is_super_admin ()
  )
  with check (
    (select auth.uid ()) = mentor_id
    or (select auth.uid ()) = student_id
    or public.is_super_admin ()
  );

create policy "Only super admins delete messages"
  on public.mentor_messages for delete
  using (public.is_super_admin ());
