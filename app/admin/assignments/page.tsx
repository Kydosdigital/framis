import { redirect } from "next/navigation";
import { currentUser, currentUserIsSuperAdmin } from "@/lib/mentor/access";
import { fetchAssignmentData } from "@/lib/mentor/adminQueries";
import AssignmentManager from "@/components/app/admin/AssignmentManager";
import RoleManager from "@/components/app/admin/RoleManager";

export const dynamic = "force-dynamic";

export default async function AdminAssignmentsPage() {
  if (!(await currentUserIsSuperAdmin())) redirect("/admin");
  const [me, { mentors, students, people, active }] = await Promise.all([currentUser(), fetchAssignmentData()]);

  return (
    <div className="flex flex-col gap-6">
      <RoleManager people={people} currentUserId={me?.id ?? ""} />

      {mentors.length === 0 && (
        <div className="rounded-[8px] bg-[#FFFBEB] px-3.5 py-2.5 text-[13px] font-medium text-[#92400E] dark:bg-[#2A2410] dark:text-[#D4B78A]">
          No mentors yet — set someone&apos;s role to Mentor above, then assign students to them.
        </div>
      )}

      <AssignmentManager mentors={mentors} students={students} active={active} />
    </div>
  );
}
