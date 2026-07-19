import { createClient } from "@/lib/supabase/server";
import { lookupLesson } from "@/lib/engagement/lessonLookup";

const DAY_MS = 86_400_000;

export type StudentRow = {
  studentId: string;
  fullName: string | null;
  username: string;
  currentPhase: number | null;
  currentModuleNum: number | null;
  currentModuleTitle: string | null;
  avgEngagementScore: number | null;
  lastActivityAt: string | null;
  stale: boolean;
};

export type UpcomingSession = {
  id: string;
  studentId: string;
  studentName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
};

export type MentorOverview = {
  students: StudentRow[];
  upcomingThisWeek: UpcomingSession[];
  /** Subset of the week's sessions that fall on today — what the mentor
   * needs in front of them when they log in to prepare. */
  today: UpcomingSession[];
};

/** Everything the `/mentor` overview needs: the mentor's actively-assigned
 * students with their current position + engagement (pulled from the
 * existing lesson_engagement_summary), plus this week's scheduled sessions.
 * RLS scopes every read to this mentor's own students. */
export async function fetchMentorOverview(mentorId: string): Promise<MentorOverview> {
  const supabase = createClient();

  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("student_id, profiles!mentor_assignments_student_id_fkey(id, full_name, username)")
    .eq("mentor_id", mentorId)
    .eq("active", true);

  const studentIds = (assignments ?? []).map((a) => a.student_id);

  const now = Date.now();
  const weekAhead = new Date(now + 7 * DAY_MS).toISOString();
  const nowIso = new Date(now).toISOString();

  const [{ data: summaryRows }, { data: sessions }] = await Promise.all([
    // `.in` with an empty list is valid and simply returns no rows, so no
    // special-casing needed when the mentor has no students yet.
    supabase
      .from("lesson_engagement_summary")
      .select("user_id, lesson_id, phase, engagement_score, last_visited_at")
      .in("user_id", studentIds),
    supabase
      .from("mentor_sessions")
      .select("id, student_id, scheduled_at, duration_minutes, status")
      .eq("mentor_id", mentorId)
      .eq("status", "scheduled")
      .gte("scheduled_at", nowIso)
      .lte("scheduled_at", weekAhead)
      .order("scheduled_at", { ascending: true }),
  ]);

  const nameById = new Map<string, { fullName: string | null; username: string }>();
  for (const a of assignments ?? []) {
    // Supabase types the embedded relation as an array; it's a to-one here.
    const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as
      | { id: string; full_name: string | null; username: string }
      | null;
    if (p) nameById.set(a.student_id, { fullName: p.full_name, username: p.username });
  }

  // Per-student: latest-visited lesson → current position; avg score.
  const byStudent = new Map<
    string,
    { scoreSum: number; scoreCount: number; latest: { at: number; lessonId: string } | null }
  >();
  for (const row of summaryRows ?? []) {
    const entry = byStudent.get(row.user_id) ?? { scoreSum: 0, scoreCount: 0, latest: null };
    if (row.engagement_score != null) {
      entry.scoreSum += row.engagement_score;
      entry.scoreCount += 1;
    }
    const at = row.last_visited_at ? new Date(row.last_visited_at).getTime() : 0;
    if (at && (!entry.latest || at > entry.latest.at)) entry.latest = { at, lessonId: row.lesson_id };
    byStudent.set(row.user_id, entry);
  }

  const students: StudentRow[] = studentIds.map((id) => {
    const name = nameById.get(id);
    const agg = byStudent.get(id);
    const meta = agg?.latest ? lookupLesson(agg.latest.lessonId) : undefined;
    const lastAt = agg?.latest?.at ?? null;
    return {
      studentId: id,
      fullName: name?.fullName ?? null,
      username: name?.username ?? id.slice(0, 8),
      currentPhase: meta?.phase ?? null,
      currentModuleNum: meta?.moduleNum ?? null,
      currentModuleTitle: meta?.moduleTitle ?? null,
      avgEngagementScore: agg && agg.scoreCount ? Math.round((agg.scoreSum / agg.scoreCount) * 10) / 10 : null,
      lastActivityAt: lastAt ? new Date(lastAt).toISOString() : null,
      stale: lastAt != null ? now - lastAt > 14 * DAY_MS : true,
    };
  });

  students.sort((a, b) => (a.fullName ?? a.username).localeCompare(b.fullName ?? b.username));

  const upcomingThisWeek: UpcomingSession[] = (sessions ?? []).map((s) => ({
    id: s.id,
    studentId: s.student_id,
    studentName: nameById.get(s.student_id)?.fullName ?? nameById.get(s.student_id)?.username ?? "Student",
    scheduledAt: s.scheduled_at,
    durationMinutes: s.duration_minutes,
    status: s.status,
  }));

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const today = upcomingThisWeek.filter((s) => new Date(s.scheduledAt).getTime() <= endOfToday.getTime());

  return { students, upcomingThisWeek, today };
}

export type OpenQuestion = {
  id: string;
  studentId: string;
  studentName: string;
  lessonTitle: string | null;
  body: string;
  createdAt: string;
  replyCount: number;
  /** True when the student addressed this question to this mentor
   * specifically. Unaddressed questions are still shown — an unavailable
   * mentor shouldn't leave a student stuck. */
  addressedToMe: boolean;
};

/** Unresolved questions across ALL of this mentor's students — the inbox
 * they work from, so they don't have to open each student to find out who
 * is stuck. RLS already limits these rows to their own students. */
export async function fetchOpenQuestions(mentorId: string): Promise<OpenQuestion[]> {
  const supabase = createClient();

  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("student_id, profiles!mentor_assignments_student_id_fkey(full_name, username)")
    .eq("mentor_id", mentorId)
    .eq("active", true);

  const studentIds = (assignments ?? []).map((a) => a.student_id);
  if (!studentIds.length) return [];

  const nameById = new Map<string, string>();
  for (const a of assignments ?? []) {
    const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as
      | { full_name: string | null; username: string }
      | null;
    nameById.set(a.student_id, p?.full_name ?? p?.username ?? a.student_id.slice(0, 8));
  }

  const { data: questions } = await supabase
    .from("lesson_questions")
    .select("id, student_id, lesson_title, body, created_at, assigned_mentor_id")
    .in("student_id", studentIds)
    .is("resolved_at", null)
    .order("created_at", { ascending: false });

  const ids = (questions ?? []).map((q) => q.id);
  const { data: replies } = ids.length
    ? await supabase.from("lesson_question_replies").select("question_id").in("question_id", ids)
    : { data: [] as { question_id: string }[] };

  const replyCount = new Map<string, number>();
  for (const r of replies ?? []) replyCount.set(r.question_id, (replyCount.get(r.question_id) ?? 0) + 1);

  return (questions ?? [])
    .map((q) => ({
      id: q.id,
      studentId: q.student_id,
      studentName: nameById.get(q.student_id) ?? "Student",
      lessonTitle: q.lesson_title,
      body: q.body,
      createdAt: q.created_at,
      replyCount: replyCount.get(q.id) ?? 0,
      addressedToMe: q.assigned_mentor_id === mentorId,
    }))
    // questions addressed to me first, then everything else, newest first
    .sort((a, b) => Number(b.addressedToMe) - Number(a.addressedToMe) || b.createdAt.localeCompare(a.createdAt));
}

export type SessionRecord = {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  studentSummary: string | null;
  recordingUrl: string | null;
  aiGeneratedSummary: string | null;
  privateNotes: string | null;
  trackSessionId: string | null;
  trackSessionLabel: string | null;
};

export type MessageRecord = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
};

export type StudentEngagementLesson = {
  lessonId: string;
  title: string | null;
  moduleTitle: string | null;
  totalTimeSeconds: number;
  maxScrollPct: number;
  quizBestScore: number | null;
  sandboxCompleted: boolean;
  engagementScore: number;
  lastVisitedAt: string | null;
};

export type StudentDetail = {
  profile: { id: string; fullName: string | null; username: string; createdAt: string };
  lessons: StudentEngagementLesson[];
  avgEngagementScore: number | null;
  stale: boolean;
  sessions: SessionRecord[];
  messages: MessageRecord[];
};

/** The full mentor student-detail payload: engagement history (reusing the
 * same summary data the admin dashboard shows, RLS-scoped to this mentor's
 * student), session log (with the mentor-private notes joined in), and the
 * message thread. Assumes the caller already authorised access via
 * `mentorCanSeeStudent`. */
export async function fetchStudentDetail(studentId: string): Promise<StudentDetail | null> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, username, created_at")
    .eq("id", studentId)
    .maybeSingle();
  if (!profile) return null;

  const [{ data: summaryRows }, { data: sessionRows }, { data: noteRows }, { data: messageRows }, { data: trackSessionRows }] =
    await Promise.all([
      supabase
        .from("lesson_engagement_summary")
        .select("lesson_id, total_time_seconds, max_scroll_pct, quiz_best_score, sandbox_completed, engagement_score, last_visited_at")
        .eq("user_id", studentId)
        .order("last_visited_at", { ascending: false }),
      supabase
        .from("mentor_sessions")
        .select("id, scheduled_at, duration_minutes, status, student_summary, recording_url, ai_generated_summary, track_session_id")
        .eq("student_id", studentId)
        .order("scheduled_at", { ascending: false }),
      supabase.from("mentor_session_notes").select("session_id, notes"),
      supabase
        .from("mentor_messages")
        .select("id, sender_id, body, created_at, read_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: true }),
      supabase.from("curriculum_track_sessions").select("id, session_number, title"),
    ]);

  const lessons: StudentEngagementLesson[] = (summaryRows ?? []).map((r) => {
    const meta = lookupLesson(r.lesson_id);
    return {
      lessonId: r.lesson_id,
      title: meta?.title ?? null,
      moduleTitle: meta?.moduleTitle ?? null,
      totalTimeSeconds: r.total_time_seconds,
      maxScrollPct: r.max_scroll_pct,
      quizBestScore: r.quiz_best_score,
      sandboxCompleted: r.sandbox_completed,
      engagementScore: r.engagement_score,
      lastVisitedAt: r.last_visited_at,
    };
  });

  const avgEngagementScore = lessons.length
    ? Math.round((lessons.reduce((s, l) => s + l.engagementScore, 0) / lessons.length) * 10) / 10
    : null;
  const mostRecent = lessons[0]?.lastVisitedAt ? new Date(lessons[0].lastVisitedAt).getTime() : null;
  const stale = mostRecent != null ? Date.now() - mostRecent > 14 * DAY_MS : true;

  const notesBySession = new Map<string, string>();
  for (const n of noteRows ?? []) notesBySession.set(n.session_id, n.notes);
  const trackLabelById = new Map<string, string>();
  for (const t of trackSessionRows ?? []) trackLabelById.set(t.id, `S${t.session_number} · ${t.title}`);

  const sessions: SessionRecord[] = (sessionRows ?? []).map((s) => ({
    id: s.id,
    scheduledAt: s.scheduled_at,
    durationMinutes: s.duration_minutes,
    status: s.status,
    studentSummary: s.student_summary,
    recordingUrl: s.recording_url,
    aiGeneratedSummary: s.ai_generated_summary,
    privateNotes: notesBySession.get(s.id) ?? null,
    trackSessionId: s.track_session_id,
    trackSessionLabel: s.track_session_id ? trackLabelById.get(s.track_session_id) ?? null : null,
  }));

  const messages: MessageRecord[] = (messageRows ?? []).map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    body: m.body,
    createdAt: m.created_at,
    readAt: m.read_at,
  }));

  return {
    profile: { id: profile.id, fullName: profile.full_name, username: profile.username, createdAt: profile.created_at },
    lessons,
    avgEngagementScore,
    stale,
    sessions,
    messages,
  };
}
