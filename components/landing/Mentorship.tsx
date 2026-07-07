"use client";

import { useFramis } from "@/lib/store";
import { Logo } from "../ui";
import { Icon } from "../Icon";

const WHAT_YOU_GET: { icon: string; title: string; body: string }[] = [
  { icon: "user-tie", title: "Dedicated mentor", body: "An experienced engineer matched to your goals and timezone." },
  { icon: "code", title: "Weekly code review", body: "One detailed review a week on real work, with written feedback." },
  { icon: "slack", title: "Slack access", body: "Direct messaging with a 12-hour response window." },
  { icon: "graduation-cap", title: "Career coaching", body: "A monthly 1:1 on job search, CV, and interview prep." },
  { icon: "list-check", title: "Progress tracking", body: "Your mentor notices when you go quiet, and helps you restart." },
  { icon: "handshake", title: "Accountability", body: "Someone who cares that you finish and get hired." },
];

const HOW_IT_WORKS: { title: string; body: string }[] = [
  { title: "Add mentorship", body: "£150/month, cancel anytime. We match you with a mentor." },
  { title: "Meet your mentor", body: "A short intro call to set goals and a working rhythm." },
  { title: "Learn together", body: "Weekly code reviews and Slack support as you work through the curriculum." },
  { title: "Build your capstone", body: "Your mentor reviews it, gives feedback, and helps you polish it." },
  { title: "Go to market", body: "Career coaching on the job search when your portfolio is ready." },
];

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
            <h2 className="mb-4 font-inter text-[20px] font-bold">What you get</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {WHAT_YOU_GET.map((f) => (
                <div key={f.title} className="rounded-[12px] border border-line bg-card p-5">
                  <Icon name={f.icon} size={22} className="mb-2.5 text-blue" />
                  <div className="mb-1 font-inter text-[15px] font-semibold">{f.title}</div>
                  <p className="text-[13px]/[1.55] text-ink-500">{f.body}</p>
                </div>
              ))}
            </div>
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

          <div className="mb-10">
            <h2 className="mb-4 font-inter text-[20px] font-bold">How it works</h2>
            <div className="flex flex-col gap-3">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue font-mono text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-inter text-[15px] font-semibold">{step.title}</div>
                    <p className="text-[13.5px]/[1.55] text-ink-500">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
