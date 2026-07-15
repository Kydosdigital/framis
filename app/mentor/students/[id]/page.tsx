import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser, mentorCanSeeStudent } from "@/lib/mentor/access";
import { fetchStudentDetail } from "@/lib/mentor/queries";
import { fetchStudentTrack, fetchTrackSessionsForStudent } from "@/lib/mentor/track";
import MentorStudentDetail from "@/components/app/mentor/MentorStudentDetail";

export const dynamic = "force-dynamic";

export default async function MentorStudentPage({ params }: { params: { id: string } }) {
  const me = await currentUser();
  if (!me) redirect("/");
  if (!(await mentorCanSeeStudent(me, params.id))) redirect("/mentor");

  const [detail, track, trackSessionOptions] = await Promise.all([
    fetchStudentDetail(params.id),
    fetchStudentTrack(params.id),
    fetchTrackSessionsForStudent(params.id),
  ]);
  if (!detail) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/mentor" className="text-[13px] font-medium text-ink-500 hover:text-ink-900">
          ← All students
        </Link>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="font-inter text-[20px] font-bold">{detail.profile.fullName ?? detail.profile.username}</div>
        <div className="text-[13.5px] text-ink-500">@{detail.profile.username}</div>
        <div className="mt-1 text-[13px] text-ink-500">Signed up {new Date(detail.profile.createdAt).toLocaleDateString()}</div>
        {detail.stale && (
          <div className="mt-3 inline-block rounded-full bg-[#FDF0F0] px-3 py-1 font-inter text-[12.5px] font-semibold text-[#DC2626]">
            No activity in 14+ days
          </div>
        )}
      </div>

      <MentorStudentDetail
        studentId={detail.profile.id}
        lessons={detail.lessons}
        avgEngagementScore={detail.avgEngagementScore}
        sessions={detail.sessions}
        messages={detail.messages}
        currentUserId={me.id}
        track={track}
        trackSessionOptions={trackSessionOptions}
        isEnrolled={track != null}
      />
    </div>
  );
}
