"use client";

import { useFramis, useDisplayName } from "@/lib/store";

export default function Step9Completion() {
  const s = useFramis();
  const displayName = useDisplayName();
  const beginner = s.obAnswers.q1 === "Never used it";

  return (
    <>
      <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F5F1]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12.5l5 5L20 6.5"
            stroke="#059669"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        You’re in, {displayName}.
      </h2>
      <p className="mb-4 text-[14.5px]/[1.6] text-ink-500">
        {beginner
          ? "We’ll start you at Module 1 — setting up like an engineer. You’ll run your first program today."
          : "You’re comfortable with the basics, so we’ll start you at Module 2: Python — and your first lesson is Variables."}
      </p>
      <div className="mb-[26px] rounded-[10px] bg-[#F4F6F9] px-5 py-[18px]">
        <p className="text-[13.5px]/[1.6] text-ink-500">
          One permission slip before you start: you will get stuck, and at
          some point Phase 3 will make you want to quit. That’s normal, not a
          sign you’re behind. Close the tab, come back tomorrow, keep going.
        </p>
      </div>
      <button
        onClick={s.completeOnboarding}
        disabled={s.obSaving}
        className="w-full rounded-lg bg-blue p-[14px] font-inter text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {s.obSaving ? "Setting things up…" : "Start Lesson 1"}
      </button>
    </>
  );
}
