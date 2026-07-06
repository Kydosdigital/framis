"use client";

import StepNav from "../StepNav";

export default function Step3HonestTruth() {
  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        The honest truth
      </h2>
      <p className="mb-4 text-[14.5px]/[1.6] text-ink-500">
        Most people who quit a program like this don’t quit because it’s
        boring. They quit because nobody told them it would get hard, so when
        it did, they assumed something was wrong with them.
      </p>
      <div className="mb-4 rounded-[10px] bg-[#F4F6F9] px-5 py-[18px]">
        <div className="mb-1.5 font-inter text-[13.5px] font-semibold">
          Time: 10–15 hours a week
        </div>
        <p className="text-[13.5px]/[1.55] text-ink-500">
          That’s the honest range to keep moving. Less than that and phases
          will feel like they never end.
        </p>
      </div>
      <div className="mb-4 rounded-[10px] bg-[#FDF3E7] px-5 py-[18px]">
        <div className="mb-1.5 font-inter text-[13.5px] font-semibold">
          It gets hard around Phase 3
        </div>
        <p className="text-[13.5px]/[1.55] text-ink-500">
          Phase 3 — Pandas, feature engineering, classical ML, model
          evaluation — is where most learners hit a wall. It’s genuinely
          harder than the web-dev phase before it, and that’s not a bug in
          the curriculum. That’s where the real learning happens, and where
          most other platforms quietly skip ahead. We don’t.
        </p>
      </div>
      <p className="text-[14.5px]/[1.6] text-ink-500">
        Every phase ends in a real, working project — not a toy exercise you
        follow along with. That’s the trade: harder than a tutorial, but what
        you build is actually yours.
      </p>
      <StepNav />
    </>
  );
}
