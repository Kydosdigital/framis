"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

export type StudentAssignment = {
  id: string;
  title: string;
  instructions: string | null;
  dueAt: string | null;
  createdAt: string;
  mentorName: string | null;
  submission: {
    content: string | null;
    linkUrl: string | null;
    submittedAt: string;
    mentorFeedback: string | null;
    reviewedAt: string | null;
  } | null;
};

/** The student's own assignments. RLS only returns rows where they are the
 * student and the assignment has actually been sent, so drafts stay hidden. */
export async function fetchMyAssignments(userId: string): Promise<StudentAssignment[]> {
  const supabase = createClient();
  try {
    const [{ data: rows }, { data: subs }] = await withTimeout(
      Promise.all([
        supabase
          .from("assignments")
          .select("id, title, instructions, due_at, created_at, mentor_id, profiles!assignments_mentor_id_fkey(full_name, username)")
          .eq("student_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("assignment_submissions")
          .select("assignment_id, content, link_url, submitted_at, mentor_feedback, reviewed_at")
          .eq("student_id", userId),
      ]),
      8000,
    );

    const subBy = new Map((subs ?? []).map((s) => [s.assignment_id, s] as const));

    return (rows ?? []).map((a) => {
      const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as
        | { full_name: string | null; username: string }
        | null;
      const s = subBy.get(a.id);
      return {
        id: a.id,
        title: a.title,
        instructions: a.instructions,
        dueAt: a.due_at,
        createdAt: a.created_at,
        mentorName: p?.full_name ?? p?.username ?? null,
        submission: s
          ? {
              content: s.content,
              linkUrl: s.link_url,
              submittedAt: s.submitted_at,
              mentorFeedback: s.mentor_feedback,
              reviewedAt: s.reviewed_at,
            }
          : null,
      };
    });
  } catch {
    return [];
  }
}

/** Submit (or resubmit) work. Resubmitting updates the existing row and
 * moves submitted_at forward; a DB trigger stops this touching feedback. */
export async function submitAssignment(
  userId: string,
  assignmentId: string,
  content: string,
  linkUrl: string,
  alreadySubmitted: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient();
  const payload = {
    content: content.trim() || null,
    link_url: linkUrl.trim() || null,
    submitted_at: new Date().toISOString(),
  };

  const { error } = alreadySubmitted
    ? await supabase.from("assignment_submissions").update(payload).eq("assignment_id", assignmentId)
    : await supabase
        .from("assignment_submissions")
        .insert({ assignment_id: assignmentId, student_id: userId, ...payload });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
