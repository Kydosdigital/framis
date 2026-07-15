/** Per-lesson engagement table. Shared by the super-admin learner-detail
 * page (`/admin/learners/[id]`) and the mentor student-detail page
 * (`/mentor/students/[id]`) so both show the exact same lesson-by-lesson
 * breakdown (spec 4.2). Presentational only — the caller supplies rows
 * already scoped by RLS to a learner they're allowed to see. */

export type LessonEngagementRow = {
  lessonId: string;
  title: string | null;
  moduleTitle: string | null;
  totalTimeSeconds: number;
  maxScrollPct: number;
  quizBestScore: number | null;
  sandboxCompleted: boolean;
  engagementScore: number;
};

function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? "<1 min" : `${minutes} min`;
}

export default function LessonEngagementTable({ lessons }: { lessons: LessonEngagementRow[] }) {
  if (lessons.length === 0) {
    return <p className="text-[14px] text-ink-500">No lessons visited yet.</p>;
  }

  return (
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
        {lessons.map((l) => (
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
  );
}
