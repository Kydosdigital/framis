import { createClient } from "@/lib/supabase/server";

export type Role = "student" | "mentor" | "super_admin";

export type CurrentUser = {
  id: string;
  role: Role;
  isSuperAdmin: boolean;
};

/** The signed-in user's id + role, or null if not signed in. `role` is
 * the new mentor-portal axis (profiles.role), separate from the
 * engagement dashboard's `is_admin` gate. */
export async function currentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = (data?.role as Role | undefined) ?? "student";
  return { id: user.id, role, isSuperAdmin: role === "super_admin" };
}

/** Gate for `/mentor/*` — a mentor, or a super admin previewing it. */
export async function currentUserIsMentor(): Promise<boolean> {
  const me = await currentUser();
  return me != null && (me.role === "mentor" || me.role === "super_admin");
}

/** Gate for super-admin-only areas (the mentor overview / assignment /
 * track-management additions to `/admin`). */
export async function currentUserIsSuperAdmin(): Promise<boolean> {
  const me = await currentUser();
  return me?.isSuperAdmin ?? false;
}

/** The ids of the students a viewer is allowed to see engagement for, or
 * `null` meaning "everyone" (super admin / the original is_admin holder).
 * Mentors are scoped to their actively-assigned students — RLS enforces
 * this on the engagement tables too, this just keeps counts honest and
 * lets pages 404 rather than render an empty shell. */
export async function engagementScopeStudentIds(): Promise<string[] | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "super_admin" || profile?.is_admin) return null;
  if (profile?.role !== "mentor") return [];

  const { data } = await supabase
    .from("mentor_assignments")
    .select("student_id")
    .eq("mentor_id", user.id)
    .eq("active", true);
  return (data ?? []).map((r) => r.student_id);
}

/** True if `mentorId` currently has an active assignment to `studentId`.
 * Super admins pass regardless (they see everything). Used to authorise
 * a mentor's student-detail page before loading anything sensitive. */
export async function mentorCanSeeStudent(me: CurrentUser, studentId: string): Promise<boolean> {
  if (me.isSuperAdmin) return true;
  const supabase = createClient();
  const { data } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", me.id)
    .eq("student_id", studentId)
    .eq("active", true)
    .maybeSingle();
  return Boolean(data);
}
