import { redirect } from "next/navigation";
import { currentUserIsSuperAdmin } from "@/lib/mentor/access";
import { fetchAssignmentData } from "@/lib/mentor/adminQueries";
import AssignmentManager from "@/components/app/admin/AssignmentManager";

export const dynamic = "force-dynamic";

export default async function AdminAssignmentsPage() {
  if (!(await currentUserIsSuperAdmin())) redirect("/admin");
  const { mentors, students, active } = await fetchAssignmentData();

  return (
    <div className="flex flex-col gap-6">
      {mentors.length === 0 && (
        <div className="rounded-[8px] bg-[#FFFBEB] px-3.5 py-2.5 text-[13px] font-medium text-[#92400E] dark:bg-[#2A2410] dark:text-[#D4B78A]">
          No mentors exist yet — set a learner&apos;s role to &lsquo;mentor&rsquo; first.
        </div>
      )}
      <AssignmentManager mentors={mentors} students={students} active={active} />
    </div>
  );
}
