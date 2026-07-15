"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentUser, mentorCanSeeStudent } from "@/lib/mentor/access";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Resolve the mentor_id to write rows under. A mentor writes as themselves;
 * a super admin acts on behalf of the student's actual assigned mentor so
 * RLS + the data stay consistent. Returns null if unauthorised. */
async function resolveMentorFor(studentId: string): Promise<{ meId: string; mentorId: string } | null> {
  const me = await currentUser();
  if (!me) return null;
  if (!(await mentorCanSeeStudent(me, studentId))) return null;

  if (!me.isSuperAdmin) return { meId: me.id, mentorId: me.id };

  const supabase = createClient();
  const { data } = await supabase
    .from("mentor_assignments")
    .select("mentor_id")
    .eq("student_id", studentId)
    .eq("active", true)
    .maybeSingle();
  if (!data) return null; // super admin can only act where a mentor is assigned
  return { meId: me.id, mentorId: data.mentor_id };
}

/** Schedule a future session — a simple mentor_sessions row with
 * status='scheduled'. The student sees it on their dashboard (spec 4.3). */
export async function scheduleSession(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const duration = Number(formData.get("durationMinutes") ?? 30);
  if (!studentId || !scheduledAt) return { ok: false, error: "Pick a date and time." };

  const resolved = await resolveMentorFor(studentId);
  if (!resolved) return { ok: false, error: "Not authorised for this student." };

  const supabase = createClient();
  const { error } = await supabase.from("mentor_sessions").insert({
    mentor_id: resolved.mentorId,
    student_id: studentId,
    scheduled_at: new Date(scheduledAt).toISOString(),
    duration_minutes: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 30,
    status: "scheduled",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/mentor/students/${studentId}`);
  revalidatePath("/mentor");
  return { ok: true };
}

/** Log a session that already happened: link it to a curriculum session
 * (auto-advances track progress via the DB trigger), paste the Teams
 * recording URL + AI summary (raw), and write the mentor's edited
 * private notes + the parent-visible student summary (spec addendum). */
export async function logSession(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  const duration = Number(formData.get("durationMinutes") ?? 30);
  const trackSessionId = String(formData.get("trackSessionId") ?? "");
  const recordingUrl = String(formData.get("recordingUrl") ?? "").trim();
  const aiSummary = String(formData.get("aiGeneratedSummary") ?? "").trim();
  const studentSummary = String(formData.get("studentSummary") ?? "").trim();
  const privateNotes = String(formData.get("privateNotes") ?? "").trim();
  if (!studentId || !scheduledAt) return { ok: false, error: "A session date is required." };

  const resolved = await resolveMentorFor(studentId);
  if (!resolved) return { ok: false, error: "Not authorised for this student." };

  const supabase = createClient();
  const { data: session, error } = await supabase
    .from("mentor_sessions")
    .insert({
      mentor_id: resolved.mentorId,
      student_id: studentId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 30,
      status: "completed",
      track_session_id: trackSessionId || null,
      recording_url: recordingUrl || null,
      ai_generated_summary: aiSummary || null,
      student_summary: studentSummary || null,
    })
    .select("id")
    .single();
  if (error || !session) return { ok: false, error: error?.message ?? "Could not save the session." };

  if (privateNotes) {
    const { error: noteErr } = await supabase.from("mentor_session_notes").insert({
      session_id: session.id,
      mentor_id: resolved.mentorId,
      notes: privateNotes,
    });
    if (noteErr) return { ok: false, error: noteErr.message };
  }

  revalidatePath(`/mentor/students/${studentId}`);
  revalidatePath("/mentor");
  return { ok: true };
}

/** Send a threaded message to the student. Sender is always the caller;
 * RLS additionally requires an active assignment between the pair. */
export async function sendMessage(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!studentId || !body) return { ok: false, error: "Message can't be empty." };

  const resolved = await resolveMentorFor(studentId);
  if (!resolved) return { ok: false, error: "Not authorised for this student." };

  const me = await currentUser();
  if (!me) return { ok: false, error: "Not signed in." };

  const supabase = createClient();
  const { error } = await supabase.from("mentor_messages").insert({
    mentor_id: resolved.mentorId,
    student_id: studentId,
    sender_id: me.id,
    body,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/mentor/students/${studentId}`);
  return { ok: true };
}
