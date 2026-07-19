"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

export type MyTrackSession = {
  id: string;
  sessionNumber: number;
  title: string;
  description: string | null;
  mentorNote: string | null;
  month: number | null;
  status: "not_started" | "in_progress" | "completed";
};

export type MyTrack = {
  name: string;
  sessions: MyTrackSession[];
  completed: number;
  total: number;
  currentMonth: number | null;
};

/** The student's own view of their mentor-led track: the canonical
 * sessions, with their mentor's per-student edits and mini messages
 * merged in. RLS returns only their own override/progress rows. */
export async function fetchMyTrack(userId: string): Promise<MyTrack | null> {
  const supabase = createClient();
  try {
    const { data: enrollment } = await withTimeout(
      supabase
        .from("student_track_enrollments")
        .select("track_id, curriculum_tracks(name)")
        .eq("student_id", userId)
        .order("enrolled_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      8000,
    );
    if (!enrollment) return null;

    const trackName =
      ((Array.isArray(enrollment.curriculum_tracks) ? enrollment.curriculum_tracks[0] : enrollment.curriculum_tracks) as
        | { name: string }
        | null)?.name ?? "Curriculum track";

    const [{ data: sessions }, { data: progress }, { data: overrides }] = await Promise.all([
      supabase
        .from("curriculum_track_sessions")
        .select("id, session_number, title, description, month")
        .eq("track_id", enrollment.track_id)
        .order("session_number", { ascending: true }),
      supabase.from("student_track_progress").select("track_session_id, status").eq("student_id", userId),
      supabase
        .from("student_track_session_overrides")
        .select("track_session_id, title, description, mentor_note")
        .eq("student_id", userId),
    ]);

    const statusBy = new Map((progress ?? []).map((p) => [p.track_session_id, p.status] as const));
    const overrideBy = new Map((overrides ?? []).map((o) => [o.track_session_id, o] as const));

    const merged: MyTrackSession[] = (sessions ?? []).map((s) => {
      const o = overrideBy.get(s.id);
      return {
        id: s.id,
        sessionNumber: s.session_number,
        title: o?.title ?? s.title,
        description: o?.description ?? s.description,
        mentorNote: o?.mentor_note ?? null,
        month: s.month,
        status: (statusBy.get(s.id) as MyTrackSession["status"]) ?? "not_started",
      };
    });

    const completed = merged.filter((s) => s.status === "completed").length;
    const firstUnfinished = merged.find((s) => s.status !== "completed");

    return {
      name: trackName,
      sessions: merged,
      completed,
      total: merged.length,
      currentMonth: firstUnfinished?.month ?? null,
    };
  } catch {
    return null;
  }
}
