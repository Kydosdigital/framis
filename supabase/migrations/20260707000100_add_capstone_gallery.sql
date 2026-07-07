-- Real capstone gallery: show shipped (status = 'passed') projects from
-- learners who've opted their portfolio public (reusing the existing
-- portfolios.is_public flag rather than inventing a new privacy control).
-- Empty until real learners actually pass real capstones — no seed data,
-- no placeholder projects.

create policy "Passed submissions are publicly viewable"
  on public.project_submissions for select
  using (
    status = 'passed'
    and exists (
      select 1 from public.portfolios p
      where p.user_id = project_submissions.user_id and p.is_public = true
    )
  );

-- PostgREST can't auto-embed profiles/portfolios into a project_submissions
-- query (they're siblings under auth.users, not a direct FK chain), so a
-- security-definer function does the join server-side instead. Unlike
-- get_due_onboarding_emails, this one is meant to be called publicly —
-- it only ever returns rows that already passed the RLS-equivalent filter
-- above (passed + public portfolio), nothing more sensitive.

create or replace function public.get_capstone_gallery()
returns table (
  project_title text,
  project_slug text,
  github_url text,
  deployed_url text,
  submitted_at timestamptz,
  author_name text,
  portfolio_slug text
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    pr.title,
    pr.slug,
    ps.github_url,
    ps.deployed_url,
    ps.submitted_at,
    coalesce(p.full_name, p.username),
    po.slug
  from public.project_submissions ps
  join public.projects pr on pr.id = ps.project_id
  join public.profiles p on p.id = ps.user_id
  join public.portfolios po on po.user_id = ps.user_id
  where ps.status = 'passed' and po.is_public = true
  order by ps.submitted_at desc;
$$;

grant execute on function public.get_capstone_gallery () to anon, authenticated;
