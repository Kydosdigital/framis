import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserIsSuperAdmin } from "@/lib/mentor/access";
import { fetchTracksAdmin, fetchTrackDetailAdmin, fetchAssignmentData } from "@/lib/mentor/adminQueries";
import EnrollForm from "@/components/app/admin/EnrollForm";

export const dynamic = "force-dynamic";

export default async function AdminTracksPage({ searchParams }: { searchParams: { track?: string } }) {
  if (!(await currentUserIsSuperAdmin())) redirect("/admin");

  const [tracks, { students }] = await Promise.all([fetchTracksAdmin(), fetchAssignmentData()]);
  const selectedId = searchParams.track ?? tracks[0]?.trackId ?? null;
  const detail = selectedId ? await fetchTrackDetailAdmin(selectedId) : null;
  const selected = tracks.find((t) => t.trackId === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">CURRICULUM TRACKS ({tracks.length})</div>
        {tracks.length === 0 ? (
          <p className="text-[14px] text-ink-500">No tracks yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-ink-500">
                <th className="pb-2 font-medium">Track</th>
                <th className="pb-2 font-medium">Sessions</th>
                <th className="pb-2 font-medium">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.trackId} className="border-b border-line last:border-none">
                  <td className="py-2.5">
                    <Link href={`/admin/tracks?track=${t.trackId}`} className={`font-medium ${t.trackId === selectedId ? "text-blue" : ""}`}>
                      {t.name}
                    </Link>
                    {t.description && <div className="text-[12px] text-ink-500">{t.description}</div>}
                  </td>
                  <td className="py-2.5 text-ink-500">{t.sessionCount}</td>
                  <td className="py-2.5 text-ink-500">{t.enrolledCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {tracks.length > 0 && <EnrollForm students={students} tracks={tracks.map((t) => ({ id: t.trackId, name: t.name }))} />}

      {selected && detail && (
        <>
          <div className="rounded-[12px] border border-line bg-card px-6 py-5">
            <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">{selected.name.toUpperCase()} — SESSIONS</div>
            {detail.sessions.length === 0 ? (
              <p className="text-[14px] text-ink-500">
                No sessions loaded for this track yet. Seed the 24 bootcamp sessions from the source curriculum doc.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5 text-[13.5px]">
                {detail.sessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <span className="w-14 flex-none font-mono text-ink-500">S{s.sessionNumber}</span>
                    <span className="flex-1">{s.title}</span>
                    <span className="text-ink-500">{s.month ? `Month ${s.month}` : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[12px] border border-line bg-card px-6 py-5">
            <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">ENROLLED STUDENTS — PROGRESS</div>
            {detail.enrollments.length === 0 ? (
              <p className="text-[14px] text-ink-500">No students enrolled in this track yet.</p>
            ) : (
              <table className="w-full text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-line text-ink-500">
                    <th className="pb-2 font-medium">Student</th>
                    <th className="pb-2 font-medium">Completed</th>
                    <th className="pb-2 font-medium">Current month</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.enrollments.map((e) => (
                    <tr key={e.studentId} className="border-b border-line last:border-none">
                      <td className="py-2.5 font-medium">{e.studentName}</td>
                      <td className="py-2.5 text-ink-500">{e.completed} of {e.total}</td>
                      <td className="py-2.5 text-ink-500">{e.currentMonth ? `Month ${e.currentMonth}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
