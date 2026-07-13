import { notFound } from "next/navigation";
import { fetchLearnerDetail } from "@/lib/engagement/adminQueries";

export const dynamic = "force-dynamic";

function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? "<1 min" : `${minutes} min`;
}

export default async function AdminLearnerDetailPage({ params }: { params: { id: string } }) {
  const detail = await fetchLearnerDetail(params.id);
  if (!detail.profile) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-inter text-[20px] font-bold">{detail.profile.fullName ?? detail.profile.username}</div>
        <div className="text-[13.5px] text-ink-500">@{detail.profile.username}</div>
        <div className="mt-1 text-[13px] text-ink-500">
          Signed up {new Date(detail.profile.createdAt).toLocaleDateString()}
        </div>
        {detail.staleLearner && (
          <div className="mt-3 inline-block rounded-full bg-[#FDF0F0] px-3 py-1 font-inter text-[12.5px] font-semibold text-[#DC2626]">
            No activity in 14+ days
          </div>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">AVERAGE ENGAGEMENT SCORE</div>
        <div className="font-inter text-[28px] font-bold">
          {detail.avgEngagementScore != null ? `${detail.avgEngagementScore} / 100` : "No lessons visited yet"}
        </div>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">PER-LESSON ENGAGEMENT</div>
        {detail.lessons.length === 0 ? (
          <p className="text-[14px] text-ink-500">No lessons visited yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-ink-500">
                <th className="pb-2 font-medium">Lesson</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Scroll</th>
                <th className="pb-2 font-medium">Quiz</th>
                <th className="pb-2 font-medium">Sandbox</th>
                <th className="pb-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {detail.lessons.map((l) => (
                <tr key={l.lessonId} className="border-b border-line last:border-none">
                  <td className="py-2">
                    <div className="font-medium">{l.title ?? l.lessonId}</div>
                    <div className="text-[12px] text-ink-500">{l.moduleTitle ?? "—"}</div>
                  </td>
                  <td className="py-2 text-ink-500">{formatMinutes(l.totalTimeSeconds)}</td>
                  <td className="py-2 text-ink-500">{l.maxScrollPct}%</td>
                  <td className="py-2 text-ink-500">{l.quizBestScore != null ? `${l.quizBestScore}%` : "not attempted"}</td>
                  <td className="py-2 text-ink-500">{l.sandboxCompleted ? "yes" : "no"}</td>
                  <td className="py-2 font-medium">{l.engagementScore} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
