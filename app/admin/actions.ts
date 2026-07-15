"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentUser, currentUserIsSuperAdmin } from "@/lib/mentor/access";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Assign a student to a mentor. Enforces one active mentor per student:
 * any existing active assignment is deactivated first (the DB has a
 * partial unique index that would otherwise reject a second active row).
 * Super-admin only (also enforced by RLS). */
export async function assignStudent(formData: FormData): Promise<ActionResult> {
  const mentorId = String(formData.get("mentorId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  if (!mentorId || !studentId) return { ok: false, error: "Pick a mentor and a student." };
  if (mentorId === studentId) return { ok: false, error: "A student can't mentor themselves." };

  const me = await currentUser();
  if (!me?.isSuperAdmin) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  await supabase
    .from("mentor_assignments")
    .update({ active: false, unassigned_at: new Date().toISOString() })
    .eq("student_id", studentId)
    .eq("active", true);

  const { error } = await supabase.from("mentor_assignments").insert({
    mentor_id: mentorId,
    student_id: studentId,
    assigned_by: me.id,
    active: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/mentors");
  return { ok: true };
}

/** Deactivate a student's current active assignment. */
export async function unassignStudent(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return { ok: false, error: "Missing student." };
  if (!(await currentUserIsSuperAdmin())) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  const { error } = await supabase
    .from("mentor_assignments")
    .update({ active: false, unassigned_at: new Date().toISOString() })
    .eq("student_id", studentId)
    .eq("active", true);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/mentors");
  return { ok: true };
}

/** Enrol a student in a curriculum track (one row per student+track). */
export async function enrollStudentInTrack(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  const trackId = String(formData.get("trackId") ?? "");
  if (!studentId || !trackId) return { ok: false, error: "Pick a student and a track." };
  if (!(await currentUserIsSuperAdmin())) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  const { error } = await supabase.from("student_track_enrollments").insert({ student_id: studentId, track_id: trackId });
  if (error && !error.message.includes("duplicate")) return { ok: false, error: error.message };

  revalidatePath("/admin/tracks");
  return { ok: true };
}
