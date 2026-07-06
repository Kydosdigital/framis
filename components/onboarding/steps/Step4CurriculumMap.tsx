"use client";

import { PHASES } from "@/lib/data";
import StepNav from "../StepNav";

export default function Step4CurriculumMap() {
  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        The full map
      </h2>
      <p className="mb-6 text-[14.5px]/[1.6] text-ink-500">
        Seven phases, 28 modules, 64 weeks. You start at Phase 1 today — here’s
        everything ahead of you.
      </p>
      <div className="mb-2 flex flex-col gap-2.5">
        {PHASES.map((ph, i) => (
          <div
            key={ph.num}
            className="flex gap-3.5 rounded-[10px] border px-4 py-3.5"
            style={{
              borderColor: i === 0 ? "#0066CC" : "var(--color-border)",
              background: i === 0 ? "#EAF2FB" : "var(--color-card)",
            }}
          >
            <span
              className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[12px] font-semibold"
              style={{
                background: i === 0 ? "#0066CC" : "var(--color-surface)",
                color: i === 0 ? "#fff" : "var(--color-ink-500)",
                border: i === 0 ? "none" : "1.5px solid var(--color-border-input)",
              }}
            >
              {ph.num}
            </span>
            <div>
              <div className="mb-0.5 flex items-center gap-2">
                <span className="font-inter text-[14px] font-semibold">{ph.title}</span>
                {i === 0 && (
                  <span className="rounded-full bg-blue px-2 py-[1px] font-mono text-[10px] font-semibold text-white">
                    YOU START HERE
                  </span>
                )}
              </div>
              <div className="mb-1 font-mono text-[11px] font-medium text-ink-400">{ph.weeks}</div>
              <p className="text-[13px]/[1.5] text-ink-500">{ph.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13.5px]/[1.6] text-ink-500">
        Every phase ends with a capstone — a real project, not a toy exercise.
      </p>
      <StepNav />
    </>
  );
}
