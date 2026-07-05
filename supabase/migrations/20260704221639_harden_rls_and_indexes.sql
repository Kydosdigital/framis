-- Lock down trigger functions from direct RPC invocation, add the FK index
-- that was missed, and consolidate multi-policy SELECT rules per the
-- advisor's performance recommendations.

revoke execute on function public.handle_code_review_submitted () from public, anon, authenticated;
revoke execute on function public.handle_new_user () from public, anon, authenticated;

create index portfolio_testimonials_author_id_idx on public.portfolio_testimonials (author_id);

-- ---- review_assignments: combine the two SELECT policies into one ----
drop policy "Reviewers can view their own assignments" on public.review_assignments;
drop policy "Submission owners can view assignments on their work" on public.review_assignments;

create policy "Reviewers and submission owners can view assignments"
  on public.review_assignments for select
  using (
    (select auth.uid ()) = reviewer_id
    or exists (
      select 1 from public.project_submissions s
      where s.id = submission_id and s.user_id = (select auth.uid ())
    )
  );

-- ---- code_reviews: combine the two SELECT policies into one ----
drop policy "Reviewers can view their own submitted reviews" on public.code_reviews;
drop policy "Submission owners can view reviews on their work" on public.code_reviews;

create policy "Reviewers and submission owners can view reviews"
  on public.code_reviews for select
  using (
    exists (
      select 1 from public.review_assignments a
      where a.id = assignment_id
        and (
          a.reviewer_id = (select auth.uid ())
          or exists (
            select 1 from public.project_submissions s
            where s.id = a.submission_id and s.user_id = (select auth.uid ())
          )
        )
    )
  );
