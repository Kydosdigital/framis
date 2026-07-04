"use client";

import { useFramis, useDisplayName, CONFIG } from "@/lib/store";
import { WEEK_TASKS } from "@/lib/data";
import { Check } from "../ui";

export default function Dashboard() {
  const s = useFramis();
  const displayName = useDisplayName();

  return (
    <div>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1.5 font-inter text-[27px] font-bold tracking-[-0.02em]">
            Welcome back, {displayName}.
          </h1>
          <p className="text-[14.5px] text-ink-500">
            Phase 3 · Software Engineering Discipline · estimated completion Nov
            2026
          </p>
        </div>
        <button
          onClick={() => s.goTab("lesson")}
          className="rounded-lg bg-blue px-[22px] py-3 font-inter text-[14px] font-semibold text-white"
        >
          Resume: Testing Basics →
        </button>
      </div>

      {/* overall progress */}
      <div className="mb-5 rounded-[12px] border border-line bg-white px-[26px] py-[22px]">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-inter text-[14px] font-semibold">
            Overall progress
          </span>
          <span className="font-mono text-[12.5px] font-medium text-ink-500">
            Week 18 / 48 · 38%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-[5px] bg-[#EDF0F4]">
          <div className="h-full w-[38%] rounded-[5px] bg-gradient-to-r from-blue to-teal" />
        </div>
        <div className="mt-4 flex flex-wrap gap-[26px]">
          {[
            ["8", "modules complete"],
            ["2/6", "capstones shipped"],
            ["94%", "lesson completion"],
            ["4.2/5", "review quality"],
          ].map(([n, label]) => (
            <div key={label}>
              <span className="font-inter text-[18px] font-bold">{n}</span>{" "}
              <span className="text-[13px] text-ink-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {/* this week */}
        <div className="rounded-[12px] border border-line bg-white px-6 py-[22px]">
          <div className="mb-4 font-inter text-[14px] font-semibold">
            This week{" "}
            <span className="text-[12.5px] font-normal text-ink-500">
              · 6.5 of 10–15 hrs
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {WEEK_TASKS.map((task, i) => {
              const done = s.weekDone[i];
              return (
                <button
                  key={i}
                  onClick={() => s.goTab(task.tab)}
                  className="flex w-full items-center gap-3 rounded-[9px] px-[14px] py-3 text-left"
                  style={{
                    background: done ? "#F7FAF9" : "#fff",
                    border: `1px solid ${done ? "#DBEAE4" : "#E4E7EE"}`,
                  }}
                >
                  <span
                    className="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md"
                    style={{
                      border: `1.5px solid ${done ? "#059669" : "#C4CBD6"}`,
                      background: done ? "#059669" : "#fff",
                    }}
                  >
                    <Check size={11} opacity={done ? 1 : 0} />
                  </span>
                  <span className="flex-1">
                    <span
                      className="block text-[13.5px] font-medium text-ink-900"
                      style={{ textDecoration: done ? "line-through" : "none" }}
                    >
                      {task.label}
                    </span>
                    <span className="block text-[11.5px] text-ink-500">
                      {task.meta}
                    </span>
                  </span>
                  <span className="font-mono text-[11.5px] font-medium text-blue">
                    {done ? "done" : task.cta + " →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-5">
          <div className="rounded-[12px] border border-line bg-white px-6 py-[22px]">
            <div className="mb-3.5 font-inter text-[14px] font-semibold">
              Capstone in progress
            </div>
            <div className="mb-1 font-inter text-[16px] font-semibold">
              Project 3 — App with tests, auth &amp; CI
            </div>
            <p className="mb-3.5 text-[13.5px]/[1.55] text-ink-500">
              Due in 2 weeks. Two peers are assigned to review your Notes App
              this Friday.
            </p>
            <button
              onClick={() => s.goTab("capstone")}
              className="rounded-lg border border-[#C9DEF2] bg-[#F0F6FC] px-[18px] py-2.5 font-inter text-[13px] font-semibold text-blue"
            >
              Open project brief
            </button>
          </div>

          <div className="rounded-[12px] border border-line bg-white px-6 py-[22px]">
            <div className="mb-3.5 font-inter text-[14px] font-semibold">
              Peer review queue{" "}
              <span className="ml-1.5 rounded-full bg-[#DC2626] px-2 py-0.5 font-inter text-[11px] font-semibold text-white">
                1 due
              </span>
            </div>
            <p className="mb-3.5 text-[13.5px]/[1.55] text-ink-500">
              Jordan submitted their Notes App. Your review is due in 2 days —
              reviewing others is how you learn to read code.
            </p>
            <button
              onClick={() => s.goTab("review")}
              className="rounded-lg border border-[#C9DEF2] bg-[#F0F6FC] px-[18px] py-2.5 font-inter text-[13px] font-semibold text-blue"
            >
              Start review
            </button>
          </div>

          {CONFIG.showStreaks && (
            <div className="rounded-[12px] border border-line bg-white px-6 py-[22px]">
              <div className="mb-3 font-inter text-[14px] font-semibold">
                Badges
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#EAF2FB] px-[13px] py-1.5 text-[12px] font-medium text-blue">
                  Git Master
                </span>
                <span className="rounded-full bg-[#E7F5F1] px-[13px] py-1.5 text-[12px] font-medium text-success">
                  Debugger
                </span>
                <span className="rounded-full bg-[#FDF3E1] px-[13px] py-1.5 text-[12px] font-medium text-amber">
                  Peer Reviewer Star
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
