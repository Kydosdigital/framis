import { notFound } from "next/navigation";
import { fetchLessonDetail } from "@/lib/engagement/adminQueries";

export const dynamic = "force-dynamic";

function formatMinutes(seconds: number | null): string {
  if (seconds == null) return "—";
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? "<1 min" : `${minutes} min`;
}

export default async function AdminLessonDetailPage({ params }: { params: { id: string } }) {
  const detail = await fetchLessonDetail(decodeURIComponent(params.id));
  if (detail.learnerCount === 0 && !detail.title) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-inter text-[20px] font-bold">{detail.title ?? detail.lessonId}</div>
        <div className="text-[13.5px] text-ink-500">{detail.moduleTitle ?? "—"}</div>
        <div className="mt-1 text-[13px] text-ink-500">{detail.learnerCount} learner{detail.learnerCount === 1 ? "" : "s"} have visited</div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard label="Average time" value={formatMinutes(detail.avgTimeSeconds)} />
        <MetricCard label="Average scroll depth" value={detail.avgScrollPct != null ? `${detail.avgScrollPct}%` : "—"} />
        <MetricCard label="Average quiz score" value={detail.avgQuizScore != null ? `${detail.avgQuizScore}%` : "no attempts yet"} />
        <MetricCard label="Quiz attempt rate" value={detail.quizAttemptRate != null ? `${detail.quizAttemptRate}%` : "—"} />
        <MetricCard label="Sandbox completion rate" value={detail.sandboxCompletionRate != null ? `${detail.sandboxCompletionRate}%` : "—"} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-card px-5 py-4">
      <div className="mb-1 font-mono text-[11.5px] font-semibold text-ink-500">{label.toUpperCase()}</div>
      <div className="font-inter text-[22px] font-bold">{value}</div>
    </div>
  );
}
