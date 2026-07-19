import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserIsSuperAdmin } from "@/lib/mentor/access";
import { fetchAllStudents, fetchAssignmentData } from "@/lib/mentor/adminQueries";
import StudentRoster from "@/components/app/admin/StudentRoster";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  if (!(await currentUserIsSuperAdmin())) redirect("/admin");
  const [students, { mentors }] = await Promise.all([fetchAllStudents(), fetchAssignmentData()]);

  const unassigned = students.filter((s) => s.mentorNames.length === 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="All students" value={String(students.length)} />
        <StatCard label="Without a mentor" value={String(unassigned)} />
        <StatCard label="Inactive 14+ days" value={String(students.filter((s) => s.stale).length)} />
      </div>

      {mentors.length === 0 && (
        <div className="rounded-[8px] bg-[#FFFBEB] px-3.5 py-2.5 text-[13px] font-medium text-[#92400E] dark:bg-[#2A2410] dark:text-[#D4B78A]">
          No mentors yet — set someone&apos;s role to Mentor on the{" "}
          <Link href="/admin/assignments" className="underline">Assignments</Link> page first.
        </div>
      )}

      <StudentRoster students={students} mentors={mentors} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-card px-5 py-4">
      <div className="mb-1 font-mono text-[11.5px] font-semibold text-ink-500">{label.toUpperCase()}</div>
      <div className="font-inter text-[24px] font-bold">{value}</div>
    </div>
  );
}
