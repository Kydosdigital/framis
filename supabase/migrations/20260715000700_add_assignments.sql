-- ============================================================
-- Assignments: a mentor prepares work for a student, sends it, the
-- student sees it on their dashboard and submits there, and the mentor
-- reviews the submission with full timestamps.
--
-- Two tables so a submission's history is separable from the brief, and
-- so "not submitted yet" is the absence of a row rather than a nullable
-- mess on the assignment itself.
-- ============================================================

create table public.assignments (
  id uuid primary key default gen_random_uuid (),
  mentor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  -- optional link to the curriculum session the work follows from
  track_session_id uuid references public.curriculum_track_sessions (id) on delete set null,
  title text not null check (char_length(btrim(title)) > 0),
  instructions text,
  due_at timestamptz,
  -- 'draft' is mentor-only; a student never sees anything but 'sent'
  status text not null default 'sent' check (status in ('draft', 'sent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assignments_student_idx on public.assignments (student_id, created_at desc);
create index assignments_mentor_idx on public.assignments (mentor_id);
create index assignments_track_session_idx on public.assignments (track_session_id);

create trigger set_updated_at before update on public.assignments
  for each row execute function public.set_updated_at ();

alter table public.assignments enable row level security;

create policy "Mentor, assigned student, or super admin view assignments"
  on public.assignments for select
  using (
    (select auth.uid ()) = mentor_id
    or ((select auth.uid ()) = student_id and status = 'sent')
    or public.is_super_admin ()
  );

-- A mentor can only set work for a student they're actively assigned to.
create policy "Mentors create assignments for their own students"
  on public.assignments for insert
  with check (
    public.is_super_admin ()
    or (
      (select auth.uid ()) = mentor_id
      and exists (
        select 1 from public.mentor_assignments ma
        where ma.mentor_id = assignments.mentor_id
          and ma.student_id = assignments.student_id
          and ma.active
      )
    )
  );

create policy "Mentors update their own assignments"
  on public.assignments for update
  using ((select auth.uid ()) = mentor_id or public.is_super_admin ())
  with check ((select auth.uid ()) = mentor_id or public.is_super_admin ());

create policy "Mentors delete their own assignments"
  on public.assignments for delete
  using ((select auth.uid ()) = mentor_id or public.is_super_admin ());

-- ============================================================
-- assignment_submissions — one row per assignment; resubmitting
-- updates it in place and moves submitted_at forward.
-- ============================================================
create table public.assignment_submissions (
  id uuid primary key default gen_random_uuid (),
  assignment_id uuid not null unique references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  content text,
  link_url text,
  submitted_at timestamptz not null default now(),
  mentor_feedback text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assignment_submissions_student_idx on public.assignment_submissions (student_id);

create trigger set_updated_at before update on public.assignment_submissions
  for each row execute function public.set_updated_at ();

alter table public.assignment_submissions enable row level security;

create policy "Student, their mentor, or super admin view submissions"
  on public.assignment_submissions for select
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.assignments a
      where a.id = assignment_submissions.assignment_id
        and a.mentor_id = (select auth.uid ())
    )
  );

create policy "Students submit their own work"
  on public.assignment_submissions for insert
  with check (
    (select auth.uid ()) = student_id
    and exists (
      select 1 from public.assignments a
      where a.id = assignment_submissions.assignment_id
        and a.student_id = (select auth.uid ())
        and a.status = 'sent'
    )
  );

-- Both sides update the same row (student resubmits, mentor leaves
-- feedback). RLS can gate the row but not individual columns, so the
-- trigger below is what actually stops each side editing the other's
-- fields.
create policy "Student resubmits, mentor reviews"
  on public.assignment_submissions for update
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.assignments a
      where a.id = assignment_submissions.assignment_id
        and a.mentor_id = (select auth.uid ())
    )
  )
  with check (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.assignments a
      where a.id = assignment_submissions.assignment_id
        and a.mentor_id = (select auth.uid ())
    )
  );

-- ---------- column-level integrity ----------
-- A student must not be able to write their own feedback, and a mentor
-- must not be able to rewrite the student's submitted work. RLS is
-- row-level only, so enforce the split here: whichever side you are,
-- the other side's columns are reset to their previous values.
create or replace function public.guard_assignment_submission_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_mentor boolean;
begin
  if public.is_super_admin () then
    return new;
  end if;

  select exists (
    select 1 from public.assignments a
    where a.id = new.assignment_id and a.mentor_id = auth.uid ()
  ) into v_is_mentor;

  if v_is_mentor then
    -- mentor may only touch feedback fields
    new.content := old.content;
    new.link_url := old.link_url;
    new.submitted_at := old.submitted_at;
  else
    -- student may only touch their own work
    new.mentor_feedback := old.mentor_feedback;
    new.reviewed_at := old.reviewed_at;
  end if;

  return new;
end;
$$;

revoke all on function public.guard_assignment_submission_columns () from public, anon, authenticated;

create trigger guard_assignment_submission_columns_before_update
  before update on public.assignment_submissions
  for each row execute function public.guard_assignment_submission_columns ();
