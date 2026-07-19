-- ============================================================
-- In-lesson questions: a student asks a question while working through
-- a lesson, it's tagged to that lesson, and their mentor sees it and
-- replies. Mentor-answered (no AI) — the point is that a human who
-- knows the student answers, and that the super admin keeps visibility
-- of where students are actually getting stuck.
--
-- Threaded: one question row, many replies. Kept separate from
-- mentor_messages because these are lesson-scoped and need a
-- resolved/unresolved state, whereas messages are a running thread.
-- ============================================================

create table public.lesson_questions (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  -- engagement-style lesson id (e.g. "m9-l2"); text so it matches the
  -- TypeScript curriculum rather than the sparse DB lessons table
  lesson_id text,
  lesson_title text,
  body text not null check (char_length(btrim(body)) > 0),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lesson_questions_student_idx on public.lesson_questions (student_id, created_at desc);
create index lesson_questions_open_idx on public.lesson_questions (created_at desc) where resolved_at is null;

create trigger set_updated_at before update on public.lesson_questions
  for each row execute function public.set_updated_at ();

alter table public.lesson_questions enable row level security;

create policy "Student asks their own questions"
  on public.lesson_questions for insert
  with check ((select auth.uid ()) = student_id);

create policy "Student, their mentors, or super admin view questions"
  on public.lesson_questions for select
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = lesson_questions.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- Student can edit/resolve their own; mentors can mark resolved.
create policy "Student or their mentors update questions"
  on public.lesson_questions for update
  using (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = lesson_questions.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  )
  with check (
    (select auth.uid ()) = student_id
    or public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = lesson_questions.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

create policy "Student or super admin delete questions"
  on public.lesson_questions for delete
  using ((select auth.uid ()) = student_id or public.is_super_admin ());

-- ---------- replies ----------
create table public.lesson_question_replies (
  id uuid primary key default gen_random_uuid (),
  question_id uuid not null references public.lesson_questions (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) > 0),
  created_at timestamptz not null default now()
);

create index lesson_question_replies_question_idx
  on public.lesson_question_replies (question_id, created_at);

alter table public.lesson_question_replies enable row level security;

-- Visible to anyone who can see the parent question.
create policy "Visible with the parent question"
  on public.lesson_question_replies for select
  using (
    exists (
      select 1 from public.lesson_questions q
      where q.id = lesson_question_replies.question_id
        and (
          q.student_id = (select auth.uid ())
          or public.is_super_admin ()
          or exists (
            select 1 from public.mentor_assignments ma
            where ma.student_id = q.student_id
              and ma.mentor_id = (select auth.uid ())
              and ma.active
          )
        )
    )
  );

-- The asking student or one of their active mentors may reply, always
-- as themselves.
create policy "Student or their mentors reply"
  on public.lesson_question_replies for insert
  with check (
    (select auth.uid ()) = author_id
    and exists (
      select 1 from public.lesson_questions q
      where q.id = lesson_question_replies.question_id
        and (
          q.student_id = (select auth.uid ())
          or public.is_super_admin ()
          or exists (
            select 1 from public.mentor_assignments ma
            where ma.student_id = q.student_id
              and ma.mentor_id = (select auth.uid ())
              and ma.active
          )
        )
    )
  );

create policy "Authors and super admins delete replies"
  on public.lesson_question_replies for delete
  using ((select auth.uid ()) = author_id or public.is_super_admin ());
