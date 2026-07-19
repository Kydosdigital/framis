"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { ROADMAP_MODULES } from "@/lib/data";
import { totalLessonsFor } from "@/lib/lessons";
import { fetchEngagementReport, type EngagementReport } from "@/lib/engagement/reportData";
import { fetchStudentMentorReport, type StudentMentorReport } from "@/lib/mentor/studentReport";

function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function Report() {
  const userId = useFramis((st) => st.userId);
  const stats = useFramis((st) => st.stats);
  const statsLoading = useFramis((st) => st.statsLoading);
  const loadStats = useFramis((st) => st.loadStats);
  const [report, setReport] = useState<EngagementReport | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [mentorReport, setMentorReport] = useState<StudentMentorReport | null>(null);

  useEffect(() => {
    if (!stats && !statsLoading) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;
    setReportLoading(true);
    fetchEngagementReport(userId)
      .then(setReport)
      .finally(() => setReportLoading(false));
    fetchStudentMentorReport(userId).then(setMentorReport);
  }, [userId]);

  if (statsLoading || !stats || reportLoading || !report) {
    return <div className="text-[14px] text-ink-500">Loading engagement report…</div>;
  }

  const currentModuleNum = stats.nextLessonModuleNumber ?? 1;
  const currentModule = ROADMAP_MODULES.find((m) => m.num === currentModuleNum);

  const byPhase = ROADMAP_MODULES.reduce<Record<number, number>>((acc, m) => {
    acc[m.phase] = (acc[m.phase] ?? 0) + totalLessonsFor(m.num);
    return acc;
  }, {});
  const completedByPhase = stats.completedModuleNumbers.reduce<Record<number, number>>((acc, num) => {
    const phase = ROADMAP_MODULES.find((m) => m.num === num)?.phase;
    if (phase != null) acc[phase] = (acc[phase] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">PROGRESS REPORT</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Engagement report</h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Real numbers, not vague adjectives. This is exactly what a mentor or parent sees.
        </p>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">LESSONS COMPLETED</div>
        <div className="font-inter text-[24px] font-bold">
          {stats.completedLessons} of {stats.totalLessons}
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {Object.keys(byPhase)
            .map(Number)
            .sort((a, b) => a - b)
            .map((phase) => (
              <div key={phase} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-500">Phase {phase}</span>
                <span className="font-medium">
                  {completedByPhase[phase] ?? 0} / {byPhase[phase]}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">CURRENT PHASE &amp; MODULE</div>
        <div className="font-inter text-[16px] font-semibold">
          {currentModule ? `Phase ${currentModule.phase} · Module ${currentModule.num}: ${currentModule.title}` : "Not started yet"}
        </div>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">AVERAGE ENGAGEMENT SCORE</div>
        <div className="font-inter text-[24px] font-bold">
          {report.avgEngagementScore != null ? `${report.avgEngagementScore} / 100` : "No lessons visited yet"}
        </div>
        <p className="mt-1.5 text-[13.5px] text-ink-500">{report.interpretation}</p>
        {report.engagementDropped && (
          <div className="mt-3 rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">
            Engagement has dropped over the last two weeks compared to the two before that.
          </div>
        )}
      </div>

      {mentorReport?.mentored && (
        <div className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">MENTORSHIP</div>
          <div className="font-inter text-[16px] font-semibold">
            {mentorReport.mentorNames.length > 0
              ? `Mentored by ${new Intl.ListFormat(undefined, { style: "long", type: "conjunction" }).format(mentorReport.mentorNames)}`
              : "Mentored"}
          </div>

          {mentorReport.track && (
            <div className="mt-3 text-[13.5px]">
              <span className="font-medium">{mentorReport.track.name}:</span>{" "}
              {mentorReport.track.completed} of {mentorReport.track.total} sessions completed
              {mentorReport.track.currentMonth ? ` · currently in Month ${mentorReport.track.currentMonth}` : ""}
            </div>
          )}

          <div className="mt-3 text-[13.5px]">
            <span className="font-medium">Next session:</span>{" "}
            {mentorReport.nextSession ? (
              <span>{formatSessionDate(mentorReport.nextSession.scheduledAt)} · {mentorReport.nextSession.durationMinutes} min</span>
            ) : (
              <span className="text-ink-500">none scheduled</span>
            )}
          </div>

          {mentorReport.pastSessions.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 font-mono text-[11.5px] font-semibold text-ink-500">SESSION HISTORY</div>
              <ul className="flex flex-col gap-2">
                {mentorReport.pastSessions.map((s, i) => (
                  <li key={i} className="text-[13px]">
                    <span className="text-ink-500">{formatSessionDate(s.scheduledAt)}</span>
                    {s.studentSummary ? <span> — {s.studentSummary}</span> : <span className="text-ink-500"> — no summary shared</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(report.strengths.length > 0 || report.gaps.length > 0) && (
        <div className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">STRENGTHS &amp; GAPS</div>
          <ul className="flex flex-col gap-2">
            {report.strengths.map((s, i) => (
              <li key={`s-${i}`} className="flex items-start gap-2 text-[13.5px]">
                <span className="mt-0.5 text-success">+</span>
                <span>{s}</span>
              </li>
            ))}
            {report.gaps.map((g, i) => (
              <li key={`g-${i}`} className="flex items-start gap-2 text-[13.5px]">
                <span className="mt-0.5 text-[#DC2626]">−</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.quizTrend.length > 0 && (
        <div className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">QUIZ PERFORMANCE TREND</div>
          <div className="flex flex-col gap-1.5">
            {report.quizTrend.map((q, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-500">{q.lessonTitle}</span>
                <span className="font-medium">{q.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">TIME INVESTED (LAST 4 WEEKS)</div>
        <div className="flex flex-col gap-1.5">
          {report.weeklyTimeSeconds.map((w, i) => (
            <div key={i} className="flex items-center justify-between text-[13px]">
              <span className="text-ink-500">Week of {w.weekLabel}</span>
              <span className="font-medium">{formatMinutes(w.seconds)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
