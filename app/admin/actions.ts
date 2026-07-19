"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { currentUser, currentUserIsSuperAdmin } from "@/lib/mentor/access";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Add a mentor to a student. A student may have several mentors, so this
 * only adds — it never deactivates the student's other mentors. The DB
 * rejects a duplicate active (mentor, student) pair; that's surfaced as a
 * friendly message rather than a raw constraint error.
 * Super-admin only (also enforced by RLS). */
export async function assignStudent(formData: FormData): Promise<ActionResult> {
  const mentorId = String(formData.get("mentorId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  if (!mentorId || !studentId) return { ok: false, error: "Pick a mentor and a student." };
  if (mentorId === studentId) return { ok: false, error: "A student can't mentor themselves." };

  const me = await currentUser();
  if (!me?.isSuperAdmin) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  const { error } = await supabase.from("mentor_assignments").insert({
    mentor_id: mentorId,
    student_id: studentId,
    assigned_by: me.id,
    active: true,
  });
  if (error) {
    const duplicate = error.code === "23505" || /duplicate|unique/i.test(error.message);
    return { ok: false, error: duplicate ? "That mentor is already assigned to this student." : error.message };
  }

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/mentors");
  revalidatePath("/admin/students");
  return { ok: true };
}

/** Deactivate one specific mentor/student pairing, leaving the student's
 * other mentors untouched. */
export async function unassignStudent(formData: FormData): Promise<ActionResult> {
  const studentId = String(formData.get("studentId") ?? "");
  const mentorId = String(formData.get("mentorId") ?? "");
  if (!studentId || !mentorId) return { ok: false, error: "Missing mentor or student." };
  if (!(await currentUserIsSuperAdmin())) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  const { error } = await supabase
    .from("mentor_assignments")
    .update({ active: false, unassigned_at: new Date().toISOString() })
    .eq("student_id", studentId)
    .eq("mentor_id", mentorId)
    .eq("active", true);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/mentors");
  revalidatePath("/admin/students");
  return { ok: true };
}

/** Promote/demote a user (student | mentor | super_admin). Goes through
 * the set_user_role security-definer function because profiles UPDATE is
 * owner-only — that function is the one narrow path that can change a
 * role, and it re-checks super-admin server-side. */
export async function setUserRole(formData: FormData): Promise<ActionResult> {
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !role) return { ok: false, error: "Pick a person and a role." };
  if (!(await currentUserIsSuperAdmin())) return { ok: false, error: "Super admins only." };

  const supabase = createClient();
  const { error } = await supabase.rpc("set_user_role", { p_user_id: userId, p_role: role });
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
