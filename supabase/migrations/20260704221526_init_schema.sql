-- ============================================================
-- Framis initial schema: curriculum, progress, capstones,
-- peer review, and portfolio — per the PRD's data model (§9.2).
-- ============================================================

-- ---------- profiles (1:1 with auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text,
  bio text,
  avatar_url text,
  location text,
  theme text not null default 'light' check (theme in ('light', 'dark', 'high_contrast')),
  email_frequency text not null default 'weekly' check (email_frequency in ('daily', 'weekly', 'none')),
  public_portfolio boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid ()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid ()) = id)
  with check ((select auth.uid ()) = id);

-- ---------- modules (12-month curriculum structure) ----------
create table public.modules (
  id bigint generated always as identity primary key,
  phase smallint not null check (phase between 1 and 6),
  module_number smallint not null unique,
  title text not null,
  description text,
  weeks_label text,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Modules are viewable by everyone"
  on public.modules for select
  using (true);

-- ---------- lessons ----------
create table public.lessons (
  id bigint generated always as identity primary key,
  module_id bigint not null references public.modules (id) on delete cascade,
  title text not null,
  description text,
  content jsonb not null default '{}'::jsonb,
  learning_outcomes text[] not null default '{}',
  estimated_minutes int,
  order_index smallint not null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (module_id, order_index)
);

create index lessons_module_id_idx on public.lessons (module_id);

alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone"
  on public.lessons for select
  using (true);

-- ---------- user_progress ----------
create table public.user_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id bigint not null references public.lessons (id) on delete cascade,
  status text not null default 'started' check (status in ('started', 'in_progress', 'completed')),
  quiz_score smallint,
  time_spent_seconds int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create index user_progress_user_id_idx on public.user_progress (user_id);
create index user_progress_lesson_id_idx on public.user_progress (lesson_id);

alter table public.user_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_progress for select
  using ((select auth.uid ()) = user_id);

create policy "Users can upsert their own progress"
  on public.user_progress for insert
  with check ((select auth.uid ()) = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using ((select auth.uid ()) = user_id)
  with check ((select auth.uid ()) = user_id);

-- ---------- projects (capstones) ----------
create table public.projects (
  id bigint generated always as identity primary key,
  module_id bigint references public.modules (id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  difficulty text,
  duration_label text,
  solo_or_pair text not null default 'solo' check (solo_or_pair in ('solo', 'pair')),
  requirements jsonb not null default '[]'::jsonb,
  rubric jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  starter_repo_url text,
  order_index smallint,
  created_at timestamptz not null default now()
);

create index projects_module_id_idx on public.projects (module_id);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

-- ---------- project_submissions ----------
create table public.project_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id bigint not null references public.projects (id) on delete cascade,
  github_url text,
  deployed_url text,
  demo_video_url text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'under_review', 'passed', 'revision_needed')),
  auto_check_results jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, project_id)
);

create index project_submissions_user_id_idx on public.project_submissions (user_id);
create index project_submissions_project_id_idx on public.project_submissions (project_id);

alter table public.project_submissions enable row level security;

create policy "Owners can view their own submissions"
  on public.project_submissions for select
  using ((select auth.uid ()) = user_id);

create policy "Owners can insert their own submissions"
  on public.project_submissions for insert
  with check ((select auth.uid ()) = user_id);

create policy "Owners can update their own submissions"
  on public.project_submissions for update
  using ((select auth.uid ()) = user_id)
  with check ((select auth.uid ()) = user_id);

-- ---------- review_assignments (system-assigned peer reviewers) ----------
create table public.review_assignments (
  id bigint generated always as identity primary key,
  submission_id bigint not null references public.project_submissions (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  due_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  unique (submission_id, reviewer_id)
);

create index review_assignments_submission_id_idx on public.review_assignments (submission_id);
create index review_assignments_reviewer_id_idx on public.review_assignments (reviewer_id);

alter table public.review_assignments enable row level security;

create policy "Reviewers can view their own assignments"
  on public.review_assignments for select
  using ((select auth.uid ()) = reviewer_id);

create policy "Submission owners can view assignments on their work"
  on public.review_assignments for select
  using (
    exists (
      select 1 from public.project_submissions s
      where s.id = submission_id and s.user_id = (select auth.uid ())
    )
  );

-- ---------- code_reviews (submitted peer review scorecards) ----------
create table public.code_reviews (
  id bigint generated always as identity primary key,
  assignment_id bigint not null unique references public.review_assignments (id) on delete cascade,
  scores jsonb not null default '{}'::jsonb,
  feedback jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

alter table public.code_reviews enable row level security;

create policy "Reviewers can insert a review for their own assignment"
  on public.code_reviews for insert
  with check (
    exists (
      select 1 from public.review_assignments a
      where a.id = assignment_id and a.reviewer_id = (select auth.uid ())
    )
  );

create policy "Reviewers can view their own submitted reviews"
  on public.code_reviews for select
  using (
    exists (
      select 1 from public.review_assignments a
      where a.id = assignment_id and a.reviewer_id = (select auth.uid ())
    )
  );

create policy "Submission owners can view reviews on their work"
  on public.code_reviews for select
  using (
    exists (
      select 1 from public.review_assignments a
      join public.project_submissions s on s.id = a.submission_id
      where a.id = assignment_id and s.user_id = (select auth.uid ())
    )
  );

-- mark the assignment completed once a review lands
create or replace function public.handle_code_review_submitted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.review_assignments
  set status = 'completed'
  where id = new.assignment_id;
  return new;
end;
$$;

create trigger on_code_review_submitted
  after insert on public.code_reviews
  for each row execute function public.handle_code_review_submitted ();

-- ---------- portfolios ----------
create table public.portfolios (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  slug text not null unique,
  is_public boolean not null default false,
  bio text,
  featured_project_ids bigint[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolios enable row level security;

create policy "Public portfolios are viewable by everyone, owners see their own"
  on public.portfolios for select
  using (is_public = true or (select auth.uid ()) = user_id);

create policy "Owners can insert their own portfolio"
  on public.portfolios for insert
  with check ((select auth.uid ()) = user_id);

create policy "Owners can update their own portfolio"
  on public.portfolios for update
  using ((select auth.uid ()) = user_id)
  with check ((select auth.uid ()) = user_id);

-- ---------- portfolio_testimonials ----------
create table public.portfolio_testimonials (
  id bigint generated always as identity primary key,
  portfolio_id bigint not null references public.portfolios (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index portfolio_testimonials_portfolio_id_idx on public.portfolio_testimonials (portfolio_id);

alter table public.portfolio_testimonials enable row level security;

create policy "Testimonials are viewable by everyone"
  on public.portfolio_testimonials for select
  using (true);

create policy "Authenticated users can leave a testimonial"
  on public.portfolio_testimonials for insert
  with check ((select auth.uid ()) = author_id);

-- ---------- community_posts ----------
create table public.community_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users (id) on delete cascade,
  lesson_id bigint references public.lessons (id) on delete set null,
  project_id bigint references public.projects (id) on delete set null,
  title text not null,
  content text not null,
  status text not null default 'published' check (status in ('published', 'flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index community_posts_author_id_idx on public.community_posts (author_id);
create index community_posts_lesson_id_idx on public.community_posts (lesson_id);
create index community_posts_project_id_idx on public.community_posts (project_id);

alter table public.community_posts enable row level security;

create policy "Published posts are viewable by everyone, authors see their own"
  on public.community_posts for select
  using (status = 'published' or (select auth.uid ()) = author_id);

create policy "Authenticated users can create posts"
  on public.community_posts for insert
  with check ((select auth.uid ()) = author_id);

create policy "Authors can update their own posts"
  on public.community_posts for update
  using ((select auth.uid ()) = author_id)
  with check ((select auth.uid ()) = author_id);

-- ---------- community_replies ----------
create table public.community_replies (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.community_posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index community_replies_post_id_idx on public.community_replies (post_id);
create index community_replies_author_id_idx on public.community_replies (author_id);

alter table public.community_replies enable row level security;

create policy "Replies are viewable by everyone"
  on public.community_replies for select
  using (true);

create policy "Authenticated users can reply"
  on public.community_replies for insert
  with check ((select auth.uid ()) = author_id);

-- ---------- shared updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at ();
create trigger set_updated_at before update on public.project_submissions
  for each row execute function public.set_updated_at ();
create trigger set_updated_at before update on public.portfolios
  for each row execute function public.set_updated_at ();
create trigger set_updated_at before update on public.community_posts
  for each row execute function public.set_updated_at ();

-- ---------- auto-create a profile row on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
    ),
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();
