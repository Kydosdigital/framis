-- ============================================================
-- Student diary + goals.
--
-- Two shapes, because they change at different rates:
--   student_plan    — one row per student. The slow-moving stuff:
--                     mission, vision, how they intend to get there.
--   student_goals   — the things they're tracking toward, each with a
--                     0-100 progress value they nudge over time.
--   diary_entries   — the running log: what they learnt, what they
--                     don't understand.
--
-- The student owns all three. Their actively-assigned mentors can READ
-- them (so the mentor can work toward the student's actual goals) but
-- never write — this is the student's own space.
-- ============================================================

-- ---------- mission / vision ----------
create table public.student_plan (
  student_id uuid primary key references public.profiles (id) on delete cascade,
  mission text,
  vision text,
  how_to_achieve text,
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.student_plan
  for each row execute function public.set_updated_at ();

alter table public.student_plan enable row level security;

create policy "Student manages their own plan"
  on public.student_plan for all
  using ((select auth.uid ()) = student_id)
  with check ((select auth.uid ()) = student_id);

create policy "Assigned mentors and super admins read the plan"
  on public.student_plan for select
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_plan.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- ---------- goals with progress ----------
create table public.student_goals (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0),
  detail text,
  -- how close they feel they are, 0-100; self-reported on purpose
  progress_pct smallint not null default 0 check (progress_pct between 0 and 100),
  target_date date,
  achieved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index student_goals_student_idx on public.student_goals (student_id, created_at desc);

create trigger set_updated_at before update on public.student_goals
  for each row execute function public.set_updated_at ();

alter table public.student_goals enable row level security;

create policy "Student manages their own goals"
  on public.student_goals for all
  using ((select auth.uid ()) = student_id)
  with check ((select auth.uid ()) = student_id);

create policy "Assigned mentors and super admins read goals"
  on public.student_goals for select
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = student_goals.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

-- ---------- diary entries ----------
create table public.diary_entries (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references public.profiles (id) on delete cascade,
  learnt text,
  stuck_on text,
  note text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diary_entries_student_idx on public.diary_entries (student_id, entry_date desc);

create trigger set_updated_at before update on public.diary_entries
  for each row execute function public.set_updated_at ();

alter table public.diary_entries enable row level security;

create policy "Student manages their own diary"
  on public.diary_entries for all
  using ((select auth.uid ()) = student_id)
  with check ((select auth.uid ()) = student_id);

create policy "Assigned mentors and super admins read the diary"
  on public.diary_entries for select
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = diary_entries.student_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );
