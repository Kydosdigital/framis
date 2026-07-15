import { notFound } from "next/navigation";
import { fetchLearnerDetail } from "@/lib/engagement/adminQueries";
import LessonEngagementTable from "@/components/app/engagement/LessonEngagementTable";

export const dynamic = "force-dynamic";

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
        <div className="overflow-x-auto">
          <LessonEngagementTable lessons={detail.lessons} />
        </div>
      </div>
    </div>
  );
}
