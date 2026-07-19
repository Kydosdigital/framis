import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/mentor/access";
import { fetchMentorOverview, fetchOpenQuestions } from "@/lib/mentor/queries";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function relativeDays(iso: string | null): string {
  if (!iso) return "never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default async function MentorOverviewPage() {
  const me = await currentUser();
  if (!me) redirect("/");
  const [{ students, upcomingThisWeek, today }, openQuestions] = await Promise.all([
    fetchMentorOverview(me.id),
    fetchOpenQuestions(me.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">TODAY</div>
        {today.length === 0 ? (
          <p className="text-[14px] text-ink-500">No sessions today.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {today.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 text-[13.5px]">
                <Link href={`/mentor/students/${s.studentId}`} className="font-medium text-blue">
                  {s.studentName}
                </Link>
                <span className="text-ink-500">
                  {new Date(s.scheduledAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · {s.durationMinutes} min
                  <Link href={`/mentor/students/${s.studentId}`} className="ml-3 font-medium text-blue">
                    prepare notes &amp; assignment →
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">
          OPEN QUESTIONS{openQuestions.length ? ` (${openQuestions.length})` : ""}
        </div>
        {openQuestions.length === 0 ? (
          <p className="text-[14px] text-ink-500">Nothing waiting on you.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {openQuestions.map((q) => (
              <li key={q.id} className="border-b border-line pb-3 last:border-none last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/mentor/students/${q.studentId}`} className="text-[13.5px] font-medium text-blue">
                    {q.studentName}
                  </Link>
                  <span className="font-mono text-[11.5px] text-ink-500">
                    {q.lessonTitle ? q.lessonTitle : "General"} ·{" "}
                    {new Date(q.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    {q.replyCount ? " · replied" : ""}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-[13.5px]">{q.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">UPCOMING SESSIONS THIS WEEK</div>
        {upcomingThisWeek.length === 0 ? (
          <p className="text-[14px] text-ink-500">No sessions scheduled in the next 7 days.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {upcomingThisWeek.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-[13.5px]">
                <Link href={`/mentor/students/${s.studentId}`} className="font-medium text-blue">
                  {s.studentName}
                </Link>
                <span className="text-ink-500">
                  {formatDate(s.scheduledAt)} · {s.durationMinutes} min
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">ASSIGNED STUDENTS ({students.length})</div>
        {students.length === 0 ? (
          <p className="text-[14px] text-ink-500">No students assigned yet. A super admin assigns students from the admin dashboard.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-ink-500">
                  <th className="pb-2 font-medium">Student</th>
                  <th className="pb-2 font-medium">Current position</th>
                  <th className="pb-2 font-medium">Engagement</th>
                  <th className="pb-2 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.studentId} className="border-b border-line last:border-none">
                    <td className="py-2.5">
                      <Link href={`/mentor/students/${s.studentId}`} className="font-medium text-blue">
                        {s.fullName ?? s.username}
                      </Link>
                      {s.stale && (
                        <span className="ml-2 inline-block rounded-full bg-[#FDF0F0] px-2 py-0.5 text-[11px] font-semibold text-[#DC2626]">
                          stale
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-ink-500">
                      {s.currentModuleNum
                        ? `Phase ${s.currentPhase} · Module ${s.currentModuleNum}: ${s.currentModuleTitle}`
                        : "Not started"}
                    </td>
                    <td className="py-2.5">{s.avgEngagementScore != null ? `${s.avgEngagementScore} / 100` : "—"}</td>
                    <td className="py-2.5 text-ink-500">{relativeDays(s.lastActivityAt)}</td>
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
