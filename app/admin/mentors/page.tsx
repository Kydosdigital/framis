import { redirect } from "next/navigation";
import { currentUserIsSuperAdmin } from "@/lib/mentor/access";
import { fetchMentorsOverview } from "@/lib/mentor/adminQueries";

export const dynamic = "force-dynamic";

export default async function AdminMentorsPage() {
  if (!(await currentUserIsSuperAdmin())) redirect("/admin");
  const mentors = await fetchMentorsOverview();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">ALL MENTORS ({mentors.length})</div>
        {mentors.length === 0 ? (
          <p className="text-[14px] text-ink-500">No mentors yet. Set a learner&apos;s role to &lsquo;mentor&rsquo; to add one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-ink-500">
                  <th className="pb-2 font-medium">Mentor</th>
                  <th className="pb-2 font-medium">Students</th>
                  <th className="pb-2 font-medium">Avg engagement</th>
                  <th className="pb-2 font-medium">Sessions (done / no-show / scheduled)</th>
                  <th className="pb-2 font-medium">Completion</th>
                </tr>
              </thead>
              <tbody>
                {mentors.map((m) => (
                  <tr key={m.mentorId} className="border-b border-line last:border-none">
                    <td className="py-2.5 font-medium">{m.fullName ?? m.username}</td>
                    <td className="py-2.5 text-ink-500">{m.studentCount}</td>
                    <td className="py-2.5">{m.avgStudentEngagement != null ? `${m.avgStudentEngagement} / 100` : "—"}</td>
                    <td className="py-2.5 text-ink-500">
                      {m.sessions.completed} / {m.sessions.noShow} / {m.sessions.scheduled}
                    </td>
                    <td className="py-2.5">{m.completionRate != null ? `${m.completionRate}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
