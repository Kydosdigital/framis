import Link from "next/link";
import { fetchOverviewStats } from "@/lib/engagement/adminQueries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await fetchOverviewStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total learners" value={stats.totalLearners} />
        <StatCard label="Active this week" value={stats.activeThisWeek} />
        <StatCard label="Active this month" value={stats.activeThisMonth} />
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">CURRICULUM-WIDE AVERAGE ENGAGEMENT</div>
        <div className="font-inter text-[28px] font-bold">
          {stats.avgEngagementScore != null ? `${stats.avgEngagementScore} / 100` : "No data yet"}
        </div>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">PHASE-BY-PHASE DROP-OFF FUNNEL</div>
        {stats.phaseFunnel.length === 0 ? (
          <p className="text-[14px] text-ink-500">No engagement data yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.phaseFunnel.map((p) => {
              const max = stats.phaseFunnel[0]?.learners || 1;
              const pct = Math.round((p.learners / max) * 100);
              return (
                <div key={p.phase} className="flex items-center gap-3">
                  <div className="w-20 flex-none font-inter text-[13px] font-semibold">Phase {p.phase}</div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#F1F3F6] dark:bg-[#1B2536]">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-16 flex-none text-right font-mono text-[12.5px] text-ink-500">{p.learners}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">LOWEST-ENGAGEMENT LESSONS (BOTTOM 10)</div>
        {stats.lowestEngagementLessons.length === 0 ? (
          <p className="text-[14px] text-ink-500">No engagement data yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-ink-500">
                <th className="pb-2 font-medium">Lesson</th>
                <th className="pb-2 font-medium">Module</th>
                <th className="pb-2 font-medium">Avg score</th>
                <th className="pb-2 font-medium">Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowestEngagementLessons.map((l) => (
                <tr key={l.lessonId} className="border-b border-line last:border-none">
                  <td className="py-2">
                    <Link href={`/admin/lessons/${l.lessonId}`} className="font-medium text-blue">
                      {l.title ?? l.lessonId}
                    </Link>
                  </td>
                  <td className="py-2 text-ink-500">{l.moduleTitle ?? "—"}</td>
                  <td className="py-2">{l.avgScore} / 100</td>
                  <td className="py-2 text-ink-500">{l.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[12px] border border-line bg-card px-5 py-4">
      <div className="mb-1 font-mono text-[11.5px] font-semibold text-ink-500">{label.toUpperCase()}</div>
      <div className="font-inter text-[24px] font-bold">{value}</div>
    </div>
  );
}
