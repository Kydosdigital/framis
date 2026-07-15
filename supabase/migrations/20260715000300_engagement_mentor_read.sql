-- ============================================================
-- Let mentors read their actively-assigned students' engagement.
-- Additive only — the existing "own rows OR is_admin" SELECT policies
-- on the engagement tables are left untouched; these new policies are
-- OR'd alongside them so a mentor can load the same lesson-by-lesson
-- engagement the admin dashboard shows, scoped to their own students
-- (spec 4.2). super_admin is included so a role-only super admin
-- (no is_admin flag) can read too.
-- ============================================================

create policy "Mentors and super admins view their students' summary"
  on public.lesson_engagement_summary for select
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = lesson_engagement_summary.user_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );

create policy "Mentors and super admins view their students' events"
  on public.lesson_engagement_events for select
  using (
    public.is_super_admin ()
    or exists (
      select 1 from public.mentor_assignments ma
      where ma.student_id = lesson_engagement_events.user_id
        and ma.mentor_id = (select auth.uid ())
        and ma.active
    )
  );
