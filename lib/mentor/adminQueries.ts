import { createClient } from "@/lib/supabase/server";

export type MentorSummary = {
  mentorId: string;
  fullName: string | null;
  username: string;
  studentCount: number;
  avgStudentEngagement: number | null;
  sessions: { scheduled: number; completed: number; noShow: number; cancelled: number };
  completionRate: number | null; // completed / (completed + no_show), 0-100
};

/** Super-admin mentor overview: every mentor with their assigned-student
 * count, average engagement across those students, and session outcomes.
 * All reads are super-admin-scoped by RLS. */
export async function fetchMentorsOverview(): Promise<MentorSummary[]> {
  const supabase = createClient();

  const [{ data: mentors }, { data: assignments }, { data: summaryRows }, { data: sessions }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, username").eq("role", "mentor"),
    supabase.from("mentor_assignments").select("mentor_id, student_id").eq("active", true),
    supabase.from("lesson_engagement_summary").select("user_id, engagement_score"),
    supabase.from("mentor_sessions").select("mentor_id, status"),
  ]);

  const studentsByMentor = new Map<string, string[]>();
  for (const a of assignments ?? []) {
    if (!studentsByMentor.has(a.mentor_id)) studentsByMentor.set(a.mentor_id, []);
    studentsByMentor.get(a.mentor_id)!.push(a.student_id);
  }

  const scoresByStudent = new Map<string, { sum: number; count: number }>();
  for (const r of summaryRows ?? []) {
    if (r.engagement_score == null) continue;
    const e = scoresByStudent.get(r.user_id) ?? { sum: 0, count: 0 };
    e.sum += r.engagement_score;
    e.count += 1;
    scoresByStudent.set(r.user_id, e);
  }

  const sessionsByMentor = new Map<string, { scheduled: number; completed: number; noShow: number; cancelled: number }>();
  for (const s of sessions ?? []) {
    const e = sessionsByMentor.get(s.mentor_id) ?? { scheduled: 0, completed: 0, noShow: 0, cancelled: 0 };
    if (s.status === "scheduled") e.scheduled += 1;
    else if (s.status === "completed") e.completed += 1;
    else if (s.status === "no_show") e.noShow += 1;
    else if (s.status === "cancelled") e.cancelled += 1;
    sessionsByMentor.set(s.mentor_id, e);
  }

  return (mentors ?? [])
    .map((m) => {
      const studentIds = studentsByMentor.get(m.id) ?? [];
      const studentAvgs = studentIds
        .map((id) => {
          const e = scoresByStudent.get(id);
          return e && e.count ? e.sum / e.count : null;
        })
        .filter((v): v is number => v != null);
      const avgStudentEngagement = studentAvgs.length
        ? Math.round((studentAvgs.reduce((a, b) => a + b, 0) / studentAvgs.length) * 10) / 10
        : null;
      const sess = sessionsByMentor.get(m.id) ?? { scheduled: 0, completed: 0, noShow: 0, cancelled: 0 };
      const decided = sess.completed + sess.noShow;
      return {
        mentorId: m.id,
        fullName: m.full_name,
        username: m.username,
        studentCount: studentIds.length,
        avgStudentEngagement,
        sessions: sess,
        completionRate: decided ? Math.round((sess.completed / decided) * 1000) / 10 : null,
      };
    })
    .sort((a, b) => (a.fullName ?? a.username).localeCompare(b.fullName ?? b.username));
}

export type Person = { id: string; fullName: string | null; username: string; role: string };
export type ActiveAssignment = { studentId: string; studentName: string; mentorId: string; mentorName: string };

/** Data for the assign-students-to-mentors UI: everyone, split into
 * mentors and students, plus the current active pairings. `people` is the
 * unsplit list (with each person's role) used by the role manager. */
export async function fetchAssignmentData(): Promise<{
  mentors: Person[];
  students: Person[];
  people: Person[];
  active: ActiveAssignment[];
}> {
  const supabase = createClient();
  const [{ data: people }, { data: assignments }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, username, role"),
    supabase.from("mentor_assignments").select("mentor_id, student_id").eq("active", true),
  ]);

  const all = (people ?? []).map((p) => ({ id: p.id, fullName: p.full_name, username: p.username, role: p.role }));
  const nameById = new Map(all.map((p) => [p.id, p.fullName ?? p.username]));

  const mentors = all.filter((p) => p.role === "mentor" || p.role === "super_admin").sort(byName);
  const students = all.filter((p) => p.role === "student").sort(byName);
  const allSorted = [...all].sort(byName);
  const active: ActiveAssignment[] = (assignments ?? []).map((a) => ({
    studentId: a.student_id,
    studentName: nameById.get(a.student_id) ?? a.student_id.slice(0, 8),
    mentorId: a.mentor_id,
    mentorName: nameById.get(a.mentor_id) ?? a.mentor_id.slice(0, 8),
  }));

  return { mentors, students, people: allSorted, active };
}

function byName(a: Person, b: Person) {
  return (a.fullName ?? a.username).localeCompare(b.fullName ?? b.username);
}

export type TrackAdmin = {
  trackId: string;
  name: string;
  description: string | null;
  sessionCount: number;
  enrolledCount: number;
};

export type TrackSessionRow = { id: string; sessionNumber: number; title: string; month: number | null };

export type TrackEnrollmentProgress = {
  studentId: string;
  studentName: string;
  completed: number;
  total: number;
  currentMonth: number | null;
};

/** All tracks with their session + enrolment counts (super-admin track
 * management view). */
export async function fetchTracksAdmin(): Promise<TrackAdmin[]> {
  const supabase = createClient();
  const [{ data: tracks }, { data: sessions }, { data: enrollments }] = await Promise.all([
    supabase.from("curriculum_tracks").select("id, name, description").order("created_at", { ascending: true }),
    supabase.from("curriculum_track_sessions").select("track_id"),
    supabase.from("student_track_enrollments").select("track_id"),
  ]);

  const sessionCount = new Map<string, number>();
  for (const s of sessions ?? []) sessionCount.set(s.track_id, (sessionCount.get(s.track_id) ?? 0) + 1);
  const enrolledCount = new Map<string, number>();
  for (const e of enrollments ?? []) enrolledCount.set(e.track_id, (enrolledCount.get(e.track_id) ?? 0) + 1);

  return (tracks ?? []).map((t) => ({
    trackId: t.id,
    name: t.name,
    description: t.description,
    sessionCount: sessionCount.get(t.id) ?? 0,
    enrolledCount: enrolledCount.get(t.id) ?? 0,
  }));
}

/** Per-track: its sessions, and every enrolled student's progress against
 * it — the cross-student track-progress view (spec: super admin sees track
 * progress across all students, not just one mentor's). */
export async function fetchTrackDetailAdmin(
  trackId: string,
): Promise<{ sessions: TrackSessionRow[]; enrollments: TrackEnrollmentProgress[] } | null> {
  const supabase = createClient();
  const { data: track } = await supabase.from("curriculum_tracks").select("id").eq("id", trackId).maybeSingle();
  if (!track) return null;

  const [{ data: sessionRows }, { data: enrollmentRows }, { data: progressRows }] = await Promise.all([
    supabase.from("curriculum_track_sessions").select("id, session_number, title, month").eq("track_id", trackId).order("session_number"),
    supabase.from("student_track_enrollments").select("student_id, profiles(full_name, username)").eq("track_id", trackId),
    supabase.from("student_track_progress").select("student_id, track_session_id, status"),
  ]);

  const sessions: TrackSessionRow[] = (sessionRows ?? []).map((s) => ({
    id: s.id,
    sessionNumber: s.session_number,
    title: s.title,
    month: s.month,
  }));
  const sessionIds = new Set(sessions.map((s) => s.id));
  const monthBySession = new Map(sessions.map((s) => [s.id, s.month] as const));

  const completedByStudent = new Map<string, number>();
  const currentMonthByStudent = new Map<string, number | null>();
  for (const p of progressRows ?? []) {
    if (!sessionIds.has(p.track_session_id)) continue;
    if (p.status === "completed") completedByStudent.set(p.student_id, (completedByStudent.get(p.student_id) ?? 0) + 1);
    else if (p.status === "in_progress" && !currentMonthByStudent.get(p.student_id)) {
      currentMonthByStudent.set(p.student_id, monthBySession.get(p.track_session_id) ?? null);
    }
  }

  const enrollments: TrackEnrollmentProgress[] = (enrollmentRows ?? []).map((e) => {
    const p = (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles) as { full_name: string | null; username: string } | null;
    return {
      studentId: e.student_id,
      studentName: p?.full_name ?? p?.username ?? e.student_id.slice(0, 8),
      completed: completedByStudent.get(e.student_id) ?? 0,
      total: sessions.length,
      currentMonth: currentMonthByStudent.get(e.student_id) ?? null,
    };
  });

  return { sessions, enrollments };
}
