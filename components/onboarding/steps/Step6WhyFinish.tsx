"use client";

import StepNav from "../StepNav";

export default function Step6WhyFinish() {
  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        Why finishing matters
      </h2>
      <p className="mb-5 text-[14.5px]/[1.6] text-ink-500">
        Nobody hires “80% of a curriculum.” What gets you hired is the
        capstones — real, working, deployed projects an employer can actually
        open and click around in.
      </p>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="font-inter text-[22px] font-bold text-blue">20%</div>
          <div className="text-[12.5px]/[1.4] text-ink-500">hired within 6 months, self-paced</div>
        </div>
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="font-inter text-[22px] font-bold text-teal">50%</div>
          <div className="text-[12.5px]/[1.4] text-ink-500">hired within 6 months, with a mentor</div>
        </div>
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="font-inter text-[22px] font-bold">£52k</div>
          <div className="text-[12.5px]/[1.4] text-ink-500">average salary on hire</div>
        </div>
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="font-inter text-[22px] font-bold">8 weeks</div>
          <div className="text-[12.5px]/[1.4] text-ink-500">typical time-to-hire after shipping a capstone</div>
        </div>
      </div>
      <p className="text-[14.5px]/[1.6] text-ink-500">
        Most hires trace back to two things: a capstone good enough to talk
        about in an interview, and simply not stopping. The curriculum is
        built so finishing is realistic — but only if you keep going.
      </p>
      <StepNav />
    </>
  );
}
