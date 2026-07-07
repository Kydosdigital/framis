"use client";

import { useFramis } from "@/lib/store";
import { Logo } from "../ui";

export default function Mentorship() {
  const goScreen = useFramis((s) => s.goScreen);
  const startOnboarding = useFramis((s) => s.startOnboarding);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 bg-navy px-5 py-[14px] sm:px-12 sm:py-[18px]">
        <button onClick={() => goScreen("landing")} className="flex min-w-0 items-center gap-3 border-none bg-transparent">
          <Logo size={26} wordSize={17} light />
        </button>
        <button
          onClick={startOnboarding}
          className="rounded-lg bg-blue px-4 py-2 font-inter text-[13px] font-semibold text-white sm:px-5 sm:py-[10px] sm:text-[14px]"
        >
          Start free
        </button>
      </div>

      <div className="flex justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-[760px]">
          <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">MENTORSHIP</div>
          <h1 className="mb-4 font-inter text-[36px] font-bold tracking-[-0.02em]">
            A dedicated mentor, on top of the free curriculum
          </h1>
          <p className="mb-9 max-w-[600px] text-[16px]/[1.6] text-ink-500">
            The mentor track doesn’t unlock anything that isn’t already free —
            every lesson, sandbox, and capstone is available without it. It’s
            for people who want a real person checking their work and holding
            them to a schedule.
          </p>

          <div className="mb-10 rounded-[12px] border-2 border-blue bg-[#F0F6FC] px-7 py-6">
            <div className="mb-1 font-mono text-[12px] font-medium text-blue">£150 / MONTH · CANCEL ANYTIME</div>
            <ul className="mt-3 flex flex-col gap-2.5 text-[14.5px] text-ink-900">
              <li>A dedicated 1:1 mentor, matched to you</li>
              <li>One code review a week on real work, not just capstones</li>
              <li>Slack access with a 12-hour response window</li>
              <li>A monthly career-coaching check-in</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="mb-3 font-inter text-[20px] font-bold">Why it exists</h2>
            <p className="text-[14.5px]/[1.7] text-ink-500">
              Self-paced learners finish and get hired too — about 1 in 5
              within 6 months. With a mentor, that’s closer to 1 in 2. The
              difference isn’t better content, it’s accountability: someone
              who notices when you’ve gone quiet for two weeks, and reads
              your code before an employer does.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="mb-3 font-inter text-[20px] font-bold">How matching works</h2>
            <p className="text-[14.5px]/[1.7] text-ink-500">
              You’re matched based on your goals and timezone. If it’s not a
              fit, you can switch mentors free in your first two weeks — no
              awkward conversation required, just ask.
            </p>
          </div>

          <div className="rounded-[12px] border border-line bg-card px-7 py-6 text-center">
            <p className="mb-4 text-[14.5px] text-ink-500">
              Start with the free curriculum — you can add a mentor once
              you’re in.
            </p>
            <button
              onClick={startOnboarding}
              className="rounded-[10px] bg-blue px-8 py-[14px] font-inter text-[15px] font-semibold text-white"
            >
              Start free — no card needed
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => goScreen("mentor-apply")}
              className="font-inter text-[13.5px] font-semibold text-teal"
            >
              Interested in becoming a mentor instead? →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
