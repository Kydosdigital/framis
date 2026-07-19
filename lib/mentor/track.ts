import { createClient } from "@/lib/supabase/server";

export type TrackSessionProgress = {
  trackSessionId: string;
  sessionNumber: number;
  /** Effective title — the mentor's per-student override if one exists,
   * otherwise the canonical curriculum title. */
  title: string;
  /** The canonical title, kept so the mentor's editor can show what the
   * shared curriculum actually says underneath their override. */
  canonicalTitle: string;
  description: string | null;
  canonicalDescription: string | null;
  isOverridden: boolean;
  /** The mentor's mini message pinned to this session for this student. */
  mentorNote: string | null;
  month: number | null;
  status: "not_started" | "in_progress" | "completed";
  completedAt: string | null;
};

export type StudentTrack = {
  trackId: string;
  trackName: string;
  sessions: TrackSessionProgress[];
  completedCount: number;
  totalCount: number;
  currentMonth: number | null;
};

/** A student's curriculum-track view: every session in the track they're
 * enrolled in, each carrying that student's progress status. Auto-kept by
 * the sync_track_progress trigger as sessions are logged. Returns null if
 * the student isn't enrolled in any track. */
export async function fetchStudentTrack(studentId: string): Promise<StudentTrack | null> {
  const supabase = createClient();

  const { data: enrollment } = await supabase
    .from("student_track_enrollments")
    .select("track_id, curriculum_tracks(id, name)")
    .eq("student_id", studentId)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!enrollment) return null;
  const track = (Array.isArray(enrollment.curriculum_tracks) ? enrollment.curriculum_tracks[0] : enrollment.curriculum_tracks) as
    | { id: string; name: string }
    | null;
  if (!track) return null;

  const [{ data: sessionRows }, { data: progressRows }, { data: overrideRows }] = await Promise.all([
    supabase
      .from("curriculum_track_sessions")
      .select("id, session_number, title, description, month")
      .eq("track_id", track.id)
      .order("session_number", { ascending: true }),
    supabase
      .from("student_track_progress")
      .select("track_session_id, status, completed_at")
      .eq("student_id", studentId),
    supabase
      .from("student_track_session_overrides")
      .select("track_session_id, title, description, mentor_note")
      .eq("student_id", studentId),
  ]);

  const progressBySession = new Map<string, { status: string; completedAt: string | null }>();
  for (const p of progressRows ?? []) progressBySession.set(p.track_session_id, { status: p.status, completedAt: p.completed_at });

  const overrideBySession = new Map(
    (overrideRows ?? []).map((o) => [o.track_session_id, o] as const),
  );

  const sessions: TrackSessionProgress[] = (sessionRows ?? []).map((s) => {
    const p = progressBySession.get(s.id);
    const o = overrideBySession.get(s.id);
    return {
      trackSessionId: s.id,
      sessionNumber: s.session_number,
      // an override's null title means "keep the canonical one"
      title: o?.title ?? s.title,
      canonicalTitle: s.title,
      description: o?.description ?? s.description,
      canonicalDescription: s.description,
      isOverridden: Boolean(o?.title || o?.description),
      mentorNote: o?.mentor_note ?? null,
      month: s.month,
      status: (p?.status as TrackSessionProgress["status"]) ?? "not_started",
      completedAt: p?.completedAt ?? null,
    };
  });

  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const inProgress = sessions.filter((s) => s.status === "in_progress");
  const firstUnfinished = sessions.find((s) => s.status !== "completed");
  const currentMonth = inProgress[0]?.month ?? firstUnfinished?.month ?? null;

  return {
    trackId: track.id,
    trackName: track.name,
    sessions,
    completedCount,
    totalCount: sessions.length,
    currentMonth,
  };
}

/** The full list of sessions in a track (no per-student progress) — used by
 * the log-session form's "which session did this call cover?" picker. */
export async function fetchTrackSessionsForStudent(
  studentId: string,
): Promise<{ id: string; label: string }[]> {
  const supabase = createClient();
  const { data: enrollment } = await supabase
    .from("student_track_enrollments")
    .select("track_id")
    .eq("student_id", studentId)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!enrollment) return [];

  const { data: rows } = await supabase
    .from("curriculum_track_sessions")
    .select("id, session_number, title")
    .eq("track_id", enrollment.track_id)
    .order("session_number", { ascending: true });

  return (rows ?? []).map((r) => ({ id: r.id, label: `S${r.session_number} · ${r.title}` }));
}
