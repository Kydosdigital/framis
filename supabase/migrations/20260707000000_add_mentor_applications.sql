-- Public mentor-recruitment form (/mentor-apply on the landing page) needs
-- somewhere to land submissions. Applicants are not signed in — this is a
-- lead-capture form for prospective mentors, not a learner-facing table —
-- so RLS allows anonymous inserts only, never reads, to keep applicants'
-- contact details from being exposed to other applicants or the public API.

create table public.mentor_applications (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  years_experience text not null,
  portfolio_url text,
  timezone text not null,
  why_mentor text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.mentor_applications enable row level security;

create policy "Anyone can submit a mentor application"
  on public.mentor_applications for insert
  to anon, authenticated
  with check (true);
