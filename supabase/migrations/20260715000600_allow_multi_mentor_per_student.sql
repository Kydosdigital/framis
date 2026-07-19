-- ============================================================
-- Allow multiple mentors per student.
--
-- This deliberately reverses the base spec's v1 decision
-- ("Multi-mentor-per-student — start with one mentor per student"),
-- at the product owner's request. The partial unique index that
-- enforced one active mentor per student is dropped.
--
-- Replaced with a narrower guard: the same mentor cannot hold two
-- ACTIVE assignments to the same student (that would only ever be a
-- duplicate-click bug). Different mentors on the same student are now
-- allowed, and a student may be re-assigned to a mentor later after
-- being unassigned, because the index only covers active rows.
-- ============================================================

drop index if exists public.mentor_assignments_one_active_per_student;

create unique index mentor_assignments_one_active_per_pair
  on public.mentor_assignments (mentor_id, student_id)
  where active;
