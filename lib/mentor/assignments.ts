import { createClient } from "@/lib/supabase/server";

export type AssignmentRecord = {
  id: string;
  title: string;
  instructions: string | null;
  dueAt: string | null;
  status: string;
  createdAt: string;
  trackSessionLabel: string | null;
  submission: {
    content: string | null;
    linkUrl: string | null;
    submittedAt: string;
    mentorFeedback: string | null;
    reviewedAt: string | null;
  } | null;
};

/** Every assignment a mentor has set for one student, with the student's
 * submission (and its timestamps) joined in. RLS scopes this to the
 * mentor's own assignments. */
export async function fetchAssignmentsForStudent(studentId: string): Promise<AssignmentRecord[]> {
  const supabase = createClient();

  const [{ data: rows }, { data: subs }, { data: trackSessions }] = await Promise.all([
    supabase
      .from("assignments")
      .select("id, title, instructions, due_at, status, created_at, track_session_id")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
    supabase
      .from("assignment_submissions")
      .select("assignment_id, content, link_url, submitted_at, mentor_feedback, reviewed_at")
      .eq("student_id", studentId),
    supabase.from("curriculum_track_sessions").select("id, session_number, title"),
  ]);

  const subByAssignment = new Map((subs ?? []).map((s) => [s.assignment_id, s] as const));
  const labelById = new Map((trackSessions ?? []).map((t) => [t.id, `S${t.session_number} · ${t.title}`] as const));

  return (rows ?? []).map((a) => {
    const s = subByAssignment.get(a.id);
    return {
      id: a.id,
      title: a.title,
      instructions: a.instructions,
      dueAt: a.due_at,
      status: a.status,
      createdAt: a.created_at,
      trackSessionLabel: a.track_session_id ? labelById.get(a.track_session_id) ?? null : null,
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
}
