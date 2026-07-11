"use client";

import { useFramis } from "@/lib/store";
import Reveal from "./Reveal";

function Check({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-none">
      <path d="M20 7L10 17l-5-5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "Free forever, or free plus a mentor." — a real pricing module: mentor tier
 * featured, monospace pricing, a balanced CTA on each column (the free tier
 * finally has its own), and a tight comparison matrix. Only SPEC-backed
 * figures (~1-in-5 / ~1-in-2 placement).
 */
export default function Pricing() {
  const startOnboarding = useFramis((s) => s.startOnboarding);
  const goScreen = useFramis((s) => s.goScreen);

  const freeFeats = [
    "All 7 phases · 28 modules · 123 lessons",
    "Code sandboxes & every capstone",
    "Peer code review · public portfolio",
  ];
  const mentorFeats = [
    "Everything in free, plus:",
    "A dedicated 1:1 mentor",
    "One code review a week · Slack (12-hr)",
    "Monthly career coaching · cancel anytime",
  ];
  const matrix: [string, string, string][] = [
    ["Curriculum", "All 28 modules", "All 28 modules"],
    ["Code review", "Peer review", "1 a week, from your mentor"],
    ["Career coaching", "Community", "1:1 monthly"],
    ["Hired within 6 months", "~1 in 5", "~1 in 2"],
  ];

  return (
    <Reveal className="flex justify-center bg-[#F4F6F9] px-6 py-16 sm:px-12 sm:py-20">
      <div className="w-full max-w-[960px]">
        <p className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-teal before:h-px before:w-4 before:bg-teal before:content-['']">
          Pricing
        </p>
        <h2 className="mb-2 font-inter text-[26px] font-bold tracking-[-0.02em] sm:text-[30px]">
          Free forever, or free plus a mentor.
        </h2>
        <p className="mb-9 max-w-[56ch] text-[15px]/[1.6] text-ink-500">
          Every lesson, sandbox and capstone is free — permanently. A mentor adds a real person checking your work;
          it unlocks no extra curriculum.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* free */}
          <div
            data-stagger="1"
            className="flex flex-col rounded-[14px] border border-line bg-white p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
          >
            <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-400">Self-paced</span>
            <div className="mb-0.5 mt-1.5 font-mono text-[34px] font-extrabold tracking-[-0.02em] text-ink-900">
              £0 <span className="text-[14px] font-medium text-ink-400">/ forever</span>
            </div>
            <p className="mb-4 text-[13px] text-ink-500">How most people learn. It works.</p>
            <ul className="mb-5 flex flex-col gap-2.5">
              {freeFeats.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-500">
                  <Check color="#4B9E8F" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={startOnboarding}
              className="mt-auto rounded-[9px] border border-[#C9DEF2] bg-[#F0F6FC] px-[18px] py-3 font-inter text-[14px] font-semibold text-blue"
            >
              Start free — no card needed
            </button>
          </div>

          {/* mentor — featured */}
          <div
            data-stagger="1"
            style={{ animationDelay: "0.08s" }}
            className="relative flex flex-col rounded-[14px] border-2 border-blue bg-white p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
          >
            <span className="absolute -top-[11px] left-6 rounded-full bg-blue px-2.5 py-[3px] font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-white">
              Most chosen
            </span>
            <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-blue">With a mentor</span>
            <div className="mb-0.5 mt-1.5 font-mono text-[34px] font-extrabold tracking-[-0.02em] text-ink-900">
              £150 <span className="text-[14px] font-medium text-ink-400">/ month</span>
            </div>
            <p className="mb-4 text-[13px] text-ink-500">How people who finish and get hired learn.</p>
            <ul className="mb-5 flex flex-col gap-2.5">
              {mentorFeats.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-500">
                  <Check color="#0066CC" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => goScreen("mentorship")}
              className="mt-auto rounded-[9px] bg-blue px-[18px] py-3 font-inter text-[14px] font-semibold text-white"
            >
              Learn about mentorship →
            </button>
          </div>
        </div>

        {/* comparison matrix */}
        <div className="mt-6 overflow-x-auto rounded-[12px] border border-line bg-white">
          <table className="w-full min-w-[520px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#F4F6F9] text-left">
                <th className="px-3.5 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.04em] text-ink-400"> </th>
                <th className="px-3.5 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.04em] text-ink-400">
                  Self-paced
                </th>
                <th className="px-3.5 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.04em] text-blue">
                  With a mentor
                </th>
              </tr>
            </thead>
            <tbody className="text-ink-500">
              {matrix.map(([label, free, mentor]) => (
                <tr key={label} className="border-t border-line">
                  <td className="px-3.5 py-2.5 font-semibold text-ink-900">{label}</td>
                  <td className="px-3.5 py-2.5">{free}</td>
                  <td className="px-3.5 py-2.5">{mentor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}
