-- Auto-assign up to 2 peer reviewers when a capstone is submitted, drawn
-- from other learners who have at least one submission of their own.
-- NOT YET APPLIED to the live project as of this commit — the Supabase MCP
-- connector was disconnected when this was written. Apply via
-- `supabase db push` or the SQL editor once reconnected.

create or replace function public.assign_peer_reviewers()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer record;
begin
  for reviewer in
    select distinct ps.user_id
    from public.project_submissions ps
    where ps.user_id <> new.user_id
    order by random()
    limit 2
  loop
    insert into public.review_assignments (submission_id, reviewer_id, due_at)
    values (new.id, reviewer.user_id, now() + interval '3 days')
    on conflict (submission_id, reviewer_id) do nothing;
  end loop;
  return new;
end;
$$;

revoke execute on function public.assign_peer_reviewers () from public, anon, authenticated;

create trigger on_submission_submitted_insert
  after insert on public.project_submissions
  for each row
  when (new.status = 'submitted')
  execute function public.assign_peer_reviewers ();

create trigger on_submission_submitted_update
  after update on public.project_submissions
  for each row
  when (new.status = 'submitted' and old.status is distinct from new.status)
  execute function public.assign_peer_reviewers ();
