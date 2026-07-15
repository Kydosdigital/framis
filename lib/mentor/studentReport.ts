"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

export type StudentMentorReport = {
  mentored: boolean;
  mentorName: string | null;
  nextSession: { scheduledAt: string; durationMinutes: number } | null;
  pastSessions: { scheduledAt: string; studentSummary: string | null }[];
  track: { name: string; completed: number; total: number; currentMonth: number | null } | null;
};

const EMPTY: StudentMentorReport = { mentored: false, mentorName: null, nextSession: null, pastSessions: [], track: null };

/** The mentored-student slice of the parent report. Reads only rows the
 * student is allowed to see (RLS): their active assignment + mentor's public
 * name, their sessions' shareable summaries (never the mentor-private notes,
 * which live in a table the student has no access to), and their track
 * progress. Returns an all-empty shape when the student isn't mentored. */
export async function fetchStudentMentorReport(userId: string): Promise<StudentMentorReport> {
  const supabase = createClient();

  try {
    const { data: assignment } = await withTimeout(
      supabase
        .from("mentor_assignments")
        .select("mentor_id, profiles!mentor_assignments_mentor_id_fkey(full_name, username)")
        .eq("student_id", userId)
        .eq("active", true)
        .maybeSingle(),
      8000,
    );
    if (!assignment) return EMPTY;

    const mentorProfile = (Array.isArray(assignment.profiles) ? assignment.profiles[0] : assignment.profiles) as
      | { full_name: string | null; username: string }
      | null;
    const mentorName = mentorProfile?.full_name ?? mentorProfile?.username ?? null;

    const nowIso = new Date().toISOString();
    const [{ data: sessions }, track] = await Promise.all([
      supabase
        .from("mentor_sessions")
        .select("scheduled_at, duration_minutes, status, student_summary")
        .eq("student_id", userId)
        .order("scheduled_at", { ascending: false }),
      fetchTrack(userId),
    ]);

    const rows = sessions ?? [];
    const nextSessionRow = rows
      .filter((s) => s.status === "scheduled" && s.scheduled_at >= nowIso)
      .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];
    const pastSessions = rows
      .filter((s) => s.status === "completed")
      .map((s) => ({ scheduledAt: s.scheduled_at, studentSummary: s.student_summary }));

    return {
      mentored: true,
      mentorName,
      nextSession: nextSessionRow ? { scheduledAt: nextSessionRow.scheduled_at, durationMinutes: nextSessionRow.duration_minutes } : null,
      pastSessions,
      track,
    };
  } catch {
    return EMPTY;
  }
}

async function fetchTrack(userId: string): Promise<StudentMentorReport["track"]> {
  const supabase = createClient();
  const { data: enrollment } = await supabase
    .from("student_track_enrollments")
    .select("track_id, curriculum_tracks(name)")
    .eq("student_id", userId)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!enrollment) return null;

  const trackName =
    ((Array.isArray(enrollment.curriculum_tracks) ? enrollment.curriculum_tracks[0] : enrollment.curriculum_tracks) as
      | { name: string }
      | null)?.name ?? "Curriculum track";

  const [{ data: sessions }, { data: progress }] = await Promise.all([
    supabase.from("curriculum_track_sessions").select("id, month, session_number").eq("track_id", enrollment.track_id).order("session_number"),
    supabase.from("student_track_progress").select("track_session_id, status").eq("student_id", userId),
  ]);

  const monthById = new Map((sessions ?? []).map((s) => [s.id, s.month] as const));
  const statusById = new Map((progress ?? []).map((p) => [p.track_session_id, p.status] as const));
  const completed = (sessions ?? []).filter((s) => statusById.get(s.id) === "completed").length;
  const firstUnfinished = (sessions ?? []).find((s) => statusById.get(s.id) !== "completed");
  const currentMonth = firstUnfinished ? monthById.get(firstUnfinished.id) ?? null : null;

  return { name: trackName, completed, total: (sessions ?? []).length, currentMonth };
}
