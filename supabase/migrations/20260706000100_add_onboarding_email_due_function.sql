-- The daily Day 1-7 welcome-email cron needs each due learner's email
-- address, which lives in auth.users (not public.profiles) and isn't
-- reachable via a plain REST query even with the service role key's
-- elevated privileges through PostgREST. A security-definer function is the
-- standard Supabase pattern for a controlled cross-schema read like this.
--
-- "Due" means: onboarding is complete, the last email sent was Day 0-6 (0 =
-- none sent yet; Day 7 is the last one, so welcome_email_day never needs to
-- exceed 7), and at least (welcome_email_day) days have passed since
-- completion — e.g. Day 2 sends once 1 full day has passed since
-- onboarding_completed_at. Day 1 (welcome_email_day = 0) is also included
-- here as a fallback in case the immediate send-on-completion call fails —
-- without it, a single dropped request would stall the whole sequence
-- forever, since every later day depends on the counter having advanced.

create or replace function public.get_due_onboarding_emails()
returns table (id uuid, email text, full_name text, next_day smallint)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, u.email, p.full_name, (p.welcome_email_day + 1)::smallint as next_day
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.onboarding_completed_at is not null
    and p.welcome_email_day between 0 and 6
    and now() >= p.onboarding_completed_at + (p.welcome_email_day || ' days')::interval;
$$;

revoke execute on function public.get_due_onboarding_emails () from public, anon, authenticated;
