"use client";

import { useEffect } from "react";
import { useFramis, useDisplayName, CONFIG } from "@/lib/store";
import { PHASES, CAPSTONES } from "@/lib/data";
import { lessonMeta } from "@/lib/lessons";
import { Check } from "../ui";

const CAPSTONE_COPY: Record<string, string> = {
  not_started: "You haven't started this yet — open the brief when you're ready.",
  submitted: "Submitted — waiting on peer review.",
  under_review: "Under peer review right now.",
  passed: "Passed! This one's shipped.",
};

export default function Dashboard() {
  const s = useFramis();
  const displayName = useDisplayName();
  const stats = useFramis((st) => st.stats);
  const statsLoading = useFramis((st) => st.statsLoading);
  const loadStats = useFramis((st) => st.loadStats);
  const goToLesson = useFramis((st) => st.goToLesson);
  const goToCapstone = useFramis((st) => st.goToCapstone);

  useEffect(() => {
    if (!stats && !statsLoading) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (statsLoading || !stats) {
    return <div className="text-[14px] text-ink-500">Loading your progress…</div>;
  }

  const nextLesson = stats.nextLessonModuleNumber != null ? lessonMeta(stats.nextLessonModuleNumber) : null;
  const phaseNum = Math.min(7, Math.max(1, Math.ceil((stats.nextLessonModuleNumber ?? 28) / 4)));
  const phase = PHASES[phaseNum - 1];
  const justStarting = stats.completedLessons === 0 && stats.shippedCapstones === 0;
  const lessonPct = stats.totalLessons ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0;

  const currentCapstone = CAPSTONES.find((c) => c.phaseIndex === phaseNum - 1) ?? CAPSTONES[0];
  const currentCapstoneStatus = stats.capstoneStatusBySlug[currentCapstone.slug] ?? "not_started";
  const currentCapstoneTitle = currentCapstone.title;

  const tasks: { label: string; meta: string; done: boolean; go: () => void }[] = [];
  if (nextLesson) {
    tasks.push({
      label: `Lesson: ${nextLesson.title}`,
      meta: `${nextLesson.minutes} min · Module ${stats.nextLessonModuleNumber}`,
      done: false,
      go: () => goToLesson(stats.nextLessonModuleNumber as number),
    });
  }
  if (currentCapstoneStatus === "not_started") {
    tasks.push({
      label: `Capstone: submit ${currentCapstoneTitle}`,
      meta: "2–3 wks",
      done: false,
      go: () => goToCapstone(currentCapstone.slug),
    });
  } else {
    tasks.push({
      label: `Capstone: ${currentCapstoneTitle}`,
      meta: CAPSTONE_COPY[currentCapstoneStatus],
      done: currentCapstoneStatus === "passed",
      go: () => goToCapstone(currentCapstone.slug),
    });
  }
  if (stats.pendingReviews > 0) {
    tasks.push({
      label: `Peer review (${stats.pendingReviews} due)`,
      meta: "Reviewing others is how you learn to read code",
      done: false,
      go: () => s.goTab("review"),
    });
  }

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1.5 font-inter text-[27px] font-bold tracking-[-0.02em]">
            {justStarting ? "Welcome" : "Welcome back"}, {displayName}.
          </h1>
          <p className="text-[14.5px] text-ink-500">
            {justStarting
              ? `Week 1 · Phase ${phaseNum} · ${phase.title} · let's get started`
              : `Week ${stats.weekNumber} of 64 · Phase ${phaseNum} · ${phase.title}`}
          </p>
        </div>
        {nextLesson && (
          <button
            onClick={() => goToLesson(stats.nextLessonModuleNumber as number)}
            className="rounded-lg bg-blue px-[22px] py-3 font-inter text-[14px] font-semibold text-white"
          >
            {justStarting ? "Start" : "Resume"}: {nextLesson.title} →
          </button>
        )}
      </div>

      {/* overall progress */}
      <div className="mb-5 rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-inter text-[14px] font-semibold">
            Overall progress
          </span>
          <span className="font-mono text-[12.5px] font-medium text-ink-500">
            Week {stats.weekNumber} / 64
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-[5px] bg-[var(--color-track)]">
          <div
            className="h-full rounded-[5px] bg-gradient-to-r from-blue to-teal"
            style={{ width: `${lessonPct}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-[26px]">
          {[
            [`${stats.completedLessons}/${stats.totalLessons}`, "lessons complete"],
            [`${stats.shippedCapstones}/${stats.totalCapstones}`, "capstones shipped"],
            [String(stats.pendingReviews), "reviews due"],
          ].map(([n, label]) => (
            <div key={label}>
              <span className="font-inter text-[18px] font-bold">{n}</span>{" "}
              <span className="text-[13px] text-ink-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* your journey — compact 7-phase progress strip */}
      <div className="mb-5 rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-3.5 font-inter text-[14px] font-semibold">Your journey</div>
        <div className="flex flex-wrap gap-2.5">
          {PHASES.map((ph, i) => {
            const num = i + 1;
            const status = num < phaseNum ? "complete" : num === phaseNum ? "current" : "locked";
            return (
              <div
                key={ph.num}
                className="flex min-w-[110px] flex-1 items-center gap-2.5 rounded-[9px] px-3.5 py-2.5"
                style={{
                  background: status === "current" ? "#EAF2FB" : "var(--color-surface)",
                  border: `1.5px solid ${status === "current" ? "#0066CC" : "var(--color-border)"}`,
                }}
              >
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-full font-mono text-[11px] font-semibold"
                  style={{
                    background: status === "complete" ? "#4B9E8F" : status === "current" ? "#0066CC" : "var(--color-card)",
                    color: status === "locked" ? "var(--color-ink-500)" : "#fff",
                    border: status === "locked" ? "1.5px solid var(--color-border-input)" : "none",
                  }}
                >
                  {status === "complete" ? <Check size={11} opacity={1} /> : num}
                </span>
                <span
                  className="text-[12px] font-medium leading-tight"
                  style={{ color: status === "locked" ? "var(--color-ink-500)" : "var(--color-ink-900)" }}
                >
                  {ph.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {/* this week */}
        <div className="rounded-[12px] border border-line bg-card px-6 py-[22px]">
          <div className="mb-4 font-inter text-[14px] font-semibold">
            Up next
          </div>
          <div className="flex flex-col gap-3">
            {tasks.length === 0 ? (
              <p className="text-[13.5px] text-ink-500">You&apos;re all caught up — nice work.</p>
            ) : (
              tasks.map((task, i) => (
                <button
                  key={i}
                  onClick={task.go}
                  className="flex w-full items-center gap-3 rounded-[9px] px-[14px] py-3 text-left"
                  style={{
                    background: task.done ? "var(--color-done-bg)" : "var(--color-card)",
                    border: `1px solid ${task.done ? "var(--color-done-border)" : "var(--color-border)"}`,
                  }}
                >
                  <span
                    className="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md"
                    style={{
                      border: `1.5px solid ${task.done ? "#059669" : "#C4CBD6"}`,
                      background: task.done ? "#059669" : "var(--color-card)",
                    }}
                  >
                    <Check size={11} opacity={task.done ? 1 : 0} />
                  </span>
                  <span className="flex-1">
                    <span
                      className="block text-[13.5px] font-medium text-ink-900"
                      style={{ textDecoration: task.done ? "line-through" : "none" }}
                    >
                      {task.label}
                    </span>
                    <span className="block text-[11.5px] text-ink-500">{task.meta}</span>
                  </span>
                  <span className="font-mono text-[11.5px] font-medium text-blue">
                    {task.done ? "done" : "open →"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-5">
          <div className="rounded-[12px] border border-line bg-card px-6 py-[22px]">
            <div className="mb-3.5 font-inter text-[14px] font-semibold">
              Capstone: {currentCapstoneTitle}
            </div>
            <p className="mb-3.5 text-[13.5px]/[1.55] text-ink-500">
              {CAPSTONE_COPY[currentCapstoneStatus]}
            </p>
            <button
              onClick={() => goToCapstone(currentCapstone.slug)}
              className="rounded-lg border border-[#C9DEF2] bg-[#F0F6FC] px-[18px] py-2.5 font-inter text-[13px] font-semibold text-blue"
            >
              Open project brief
            </button>
          </div>

          <div className="rounded-[12px] border border-line bg-card px-6 py-[22px]">
            <div className="mb-3.5 font-inter text-[14px] font-semibold">
              Peer review queue
              {stats.pendingReviews > 0 && (
                <span className="ml-1.5 rounded-full bg-[#DC2626] px-2 py-0.5 font-inter text-[11px] font-semibold text-white">
                  {stats.pendingReviews} due
                </span>
              )}
            </div>
            <p className="mb-3.5 text-[13.5px]/[1.55] text-ink-500">
              {stats.pendingReviews > 0
                ? "Reviewing others is how you learn to read code — take a look when you can."
                : "No reviews assigned yet. They're assigned automatically once capstones start shipping."}
            </p>
            {stats.pendingReviews > 0 && (
              <button
                onClick={() => s.goTab("review")}
                className="rounded-lg border border-[#C9DEF2] bg-[#F0F6FC] px-[18px] py-2.5 font-inter text-[13px] font-semibold text-blue"
              >
                Start review
              </button>
            )}
          </div>

          {CONFIG.showStreaks && stats.currentStreak > 0 && (
            <div className="rounded-[12px] border border-line bg-card px-6 py-[22px]">
              <div className="flex items-baseline gap-2">
                <span className="font-inter text-[22px] font-bold text-teal">{stats.currentStreak}</span>
                <span className="text-[13px] font-medium text-ink-500">day streak</span>
              </div>
              <div className="mt-1 text-[12px] text-ink-500">Longest: {stats.longestStreak} days</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
