"use client";

import StepNav from "../StepNav";

export default function Step7Expectations() {
  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        What we’re each signing up for
      </h2>
      <div className="mb-4 flex flex-col gap-2.5">
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="mb-1 font-inter text-[13.5px] font-semibold text-teal">We commit to</div>
          <p className="text-[13.5px]/[1.55] text-ink-500">
            A free curriculum that never gets paywalled mid-course, working
            code sandboxes, and a straight answer whenever something’s
            confusing — including in this onboarding.
          </p>
        </div>
        <div className="rounded-[10px] border border-line bg-card px-4 py-3.5">
          <div className="mb-1 font-inter text-[13.5px] font-semibold text-blue">You commit to</div>
          <p className="text-[13.5px]/[1.55] text-ink-500">
            Roughly 10–15 hours a week, and finishing each capstone before
            moving on — even the rough version.
          </p>
        </div>
      </div>
      <div className="mb-5 rounded-[10px] bg-[#F4F6F9] px-5 py-[18px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          A REALISTIC WEEK
        </div>
        <div className="flex flex-col gap-1.5 text-[13.5px] text-ink-900">
          <div>Mon / Wed / Fri — 2 lessons each (~1 hr)</div>
          <div>Tue / Thu — sandbox practice, no new material</div>
          <div>Weekend — one longer session on the current capstone</div>
        </div>
      </div>
      <p className="text-[14.5px]/[1.6] text-ink-500">
        You’ll fall behind that schedule sometimes. Everyone does. That’s not
        the same as quitting — just get back to it.
      </p>
      <StepNav />
    </>
  );
}
