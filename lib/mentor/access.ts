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
