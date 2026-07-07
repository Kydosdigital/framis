"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { PHASES, FAQ_ITEMS } from "@/lib/data";
import { Logo } from "../ui";
import FaqRow from "../FaqRow";
import ThreeHero from "./ThreeHero";
import LandingDemo from "./LandingDemo";
import Ticker from "./Ticker";
import Reveal from "./Reveal";

const HERO_WORDS = [
  "Learn", "to", "think", "like", "an", "engineer", "who", "builds", "with",
];

export default function Landing() {
  const startOnboarding = useFramis((s) => s.startOnboarding);
  const goScreen = useFramis((s) => s.goScreen);
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 100);
    return () => clearInterval(id);
  }, []);

  const cnt = (target: number) =>
    String(Math.min(target, Math.max(0, Math.round(((t - 8) * target) / 14))));

  return (
    <div>
      {/* nav */}
      <div className="flex items-center justify-between gap-3 bg-navy px-5 py-[14px] sm:px-12 sm:py-[18px]">
        <div className="flex min-w-0 items-center gap-3">
          <Logo size={26} wordSize={17} light />
        </div>
        <div className="flex flex-none items-center gap-4 sm:gap-7">
          <a
            href="#curriculum"
            className="hidden text-[14px] font-medium text-slateink-200 no-underline sm:inline"
          >
            Curriculum
          </a>
          <a
            href="#how"
            className="hidden text-[14px] font-medium text-slateink-200 no-underline sm:inline"
          >
            How it works
          </a>
          <button
            onClick={startOnboarding}
            className="rounded-lg bg-blue px-4 py-2 font-inter text-[13px] font-semibold text-white sm:px-5 sm:py-[10px] sm:text-[14px]"
          >
            Start free
          </button>
        </div>
      </div>

      {/* hero */}
      <div
        className="relative overflow-hidden bg-navy px-12 pb-[72px] pt-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 75% 20%, rgba(0,102,204,.18), transparent), radial-gradient(ellipse 60% 50% at 15% 80%, rgba(75,158,143,.14), transparent)",
        }}
      >
        <ThreeHero />
        <div className="relative mx-auto flex max-w-[1040px] flex-wrap items-center gap-[52px]">
          <div className="min-w-[320px] flex-[1_1_460px]">
            <div className="mb-[26px] inline-flex items-center gap-2 rounded-full border border-navy-400 bg-navy/55 px-[14px] py-[6px] [animation:framisWordIn_.6s_both]">
              <span className="inline-block h-[7px] w-[7px] rounded-full bg-teal [animation:framisPulse_2.4s_ease-out_infinite]" />
              <span className="font-mono text-[12.5px] font-medium tracking-[.04em] text-slateink-300">
                ENGINEERING FORWARD
              </span>
            </div>
            <h1 className="mb-[22px] text-balance font-inter text-[52px]/[1.08] font-extrabold tracking-[-0.03em] text-white">
              {HERO_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    animation: `framisWordIn .7s ${0.1 + i * 0.06}s both`,
                  }}
                >
                  {word}
                </span>
              )).reduce<React.ReactNode[]>((acc, el, i) => {
                if (i > 0) acc.push(" ");
                acc.push(el);
                return acc;
              }, [])}{" "}
              <span
                className="inline-block text-teal"
                style={{ animation: "framisWordIn .7s .64s both" }}
              >
                AI.
              </span>
            </h1>
            <p className="mb-[34px] max-w-[520px] text-pretty text-[18px]/[1.6] text-slateink-200 [animation:framisWordIn_.7s_.78s_both]">
              AI writes the code. Framis teaches the judgment — verification,
              systems thinking, and shipping. Zero to full-stack AI engineer,
              free, 10–15 hours a week.
            </p>
            <div className="flex flex-wrap items-center gap-[14px] [animation:framisWordIn_.7s_.92s_both]">
              <button
                onClick={startOnboarding}
                className="rounded-[10px] bg-blue px-[30px] py-[15px] font-inter text-[16px] font-semibold text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,102,204,.5)]"
              >
                Start free — no card needed
              </button>
              <a
                href="#curriculum"
                className="px-2 py-[15px] font-inter text-[15px] font-semibold text-teal no-underline"
              >
                View the full roadmap →
              </a>
            </div>
            <div className="mt-[44px] flex flex-wrap gap-9 [animation:framisWordIn_.7s_1.05s_both]">
              {[
                [cnt(7), "shipped, deployed projects"],
                [cnt(28), "modules across 7 phases"],
                [cnt(123), "lessons, free forever"],
              ].map(([n, label], i) => (
                <div key={i}>
                  <div className="font-mono text-[26px] font-bold text-white">
                    {n}
                  </div>
                  <div className="text-[13px] text-slateink-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <LandingDemo t={t} />
        </div>
      </div>

      <Ticker />

      {/* how it works */}
      <Reveal id="how" className="flex justify-center px-12 py-20">
        <div className="w-full max-w-[960px]">
          <h2 className="mb-2 font-inter text-[30px] font-bold tracking-[-0.02em]">
            Not another “learn to code” course.
          </h2>
          <p className="mb-9 max-w-[640px] text-[16px]/[1.6] text-ink-500">
            Bootcamps teach syntax. Framis teaches the thinking that matters when
            AI writes the code.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {[
              {
                tag: "01 · SEE IT MOVE",
                tagColor: "#0066CC",
                hover: "#0066CC",
                title: "Motion-guided lessons",
                body: "Every concept — variables to RAG pipelines — explained with an interactive animation, not a wall of text. Built for kinetic and ADHD learners.",
                delay: ".08s",
              },
              {
                tag: "02 · VERIFY IT",
                tagColor: "#4B9E8F",
                hover: "#4B9E8F",
                title: "Judgment over prompting",
                body: "Testing, debugging, security, and evals are core curriculum — so you can tell when AI-generated code is wrong before production does.",
                delay: ".2s",
              },
              {
                tag: "03 · SHIP IT",
                tagColor: "#059669",
                hover: "#059669",
                title: "Portfolio, not certificates",
                body: "Six capstones, all deployed and public on GitHub. You graduate with proof of capability employers can actually inspect.",
                delay: ".32s",
              },
            ].map((c, i) => (
              <div
                key={i}
                data-stagger="1"
                className="group rounded-[12px] border border-line bg-white p-7 transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_16px_34px_rgba(10,20,40,.10)]"
                style={{ animationDelay: c.delay }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = c.hover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#E4E7EE")
                }
              >
                <div
                  className="mb-3 font-mono text-[12px] font-medium"
                  style={{ color: c.tagColor }}
                >
                  {c.tag}
                </div>
                <div className="mb-2 font-inter text-[18px] font-semibold">
                  {c.title}
                </div>
                <p className="text-[14.5px]/[1.6] text-ink-500">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* roadmap */}
      <Reveal id="curriculum" className="flex justify-center px-12 pb-20 pt-6">
        <div className="w-full max-w-[960px]">
          <h2 className="mb-9 font-inter text-[30px] font-bold tracking-[-0.02em]">
            The 64-week roadmap
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {PHASES.map((ph) => (
              <div
                key={ph.num}
                data-stagger="1"
                className="flex flex-col gap-2 rounded-[12px] border border-line bg-white px-6 py-[22px] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-blue hover:shadow-[0_14px_30px_rgba(10,20,40,.10)]"
                style={{ animationDelay: `${ph.delay}s` }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-medium text-ink-500">
                    {ph.weeks}
                  </span>
                  <span className="rounded-full bg-[#EAF2FB] px-[10px] py-[3px] font-inter text-[11px] font-semibold text-blue">
                    PHASE {ph.num}
                  </span>
                </div>
                <div className="font-inter text-[16.5px] font-semibold">
                  {ph.title}
                </div>
                <p className="text-[13.5px]/[1.55] text-ink-500">{ph.desc}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 flex-none rounded-[2px] bg-teal" />
                  <span className="text-[12.5px] font-medium text-teal">
                    {ph.capstone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* graduate outcomes */}
      <Reveal className="flex justify-center px-12 py-20">
        <div className="w-full max-w-[960px]">
          <h2 className="mb-2 font-inter text-[30px] font-bold tracking-[-0.02em]">
            Outcomes, not vibes.
          </h2>
          <p className="mb-9 max-w-[640px] text-[16px]/[1.6] text-ink-500">
            The curriculum is free either way — these numbers are what
            actually happens after people finish it.
          </p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              ["20%", "hired within 6 months, self-paced"],
              ["50%", "hired within 6 months, with a mentor"],
              ["£52k", "average salary on hire"],
              ["8 wks", "typical time-to-hire after a capstone"],
            ].map(([n, label], i) => (
              <div key={i} data-stagger="1" className="rounded-[12px] border border-line bg-white px-5 py-6">
                <div className="mb-1.5 font-mono text-[26px] font-bold text-blue">{n}</div>
                <div className="text-[13px]/[1.4] text-ink-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* mentorship comparison */}
      <Reveal className="flex justify-center bg-[#F4F6F9] px-12 py-20">
        <div className="w-full max-w-[960px]">
          <h2 className="mb-2 font-inter text-[30px] font-bold tracking-[-0.02em]">
            Free forever, or free plus a mentor.
          </h2>
          <p className="mb-9 max-w-[640px] text-[16px]/[1.6] text-ink-500">
            The full curriculum, every lesson, every sandbox, is free —
            permanently. The mentor track is for people who want a real
            person checking their work along the way.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            <div className="rounded-[12px] border border-line bg-white p-7">
              <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">SELF-PACED</div>
              <div className="mb-4 font-inter text-[26px] font-bold">Free, forever</div>
              <ul className="flex flex-col gap-2.5 text-[14px] text-ink-500">
                <li>✓ All 7 phases, 28 modules, 123 lessons</li>
                <li>✓ Code sandboxes and every capstone</li>
                <li>✓ Peer code review</li>
                <li>✓ Public portfolio</li>
              </ul>
            </div>
            <div className="rounded-[12px] border-2 border-blue bg-white p-7">
              <div className="mb-1 font-mono text-[12px] font-medium text-blue">WITH A MENTOR</div>
              <div className="mb-4 font-inter text-[26px] font-bold">
                £150<span className="text-[15px] font-medium text-ink-500">/month</span>
              </div>
              <ul className="mb-5 flex flex-col gap-2.5 text-[14px] text-ink-500">
                <li>✓ Everything in self-paced, plus:</li>
                <li>✓ A dedicated 1:1 mentor</li>
                <li>✓ One code review a week</li>
                <li>✓ Monthly career coaching</li>
              </ul>
              <button
                onClick={() => goScreen("mentorship")}
                className="w-full rounded-lg bg-blue px-5 py-3 font-inter text-[14px] font-semibold text-white"
              >
                Learn about mentorship →
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* faq */}
      <Reveal className="flex justify-center px-12 py-20">
        <div className="w-full max-w-[760px]">
          <h2 className="mb-9 font-inter text-[30px] font-bold tracking-[-0.02em]">
            Questions people ask
          </h2>
          <div className="flex flex-col gap-2.5">
            {FAQ_ITEMS.map((item) => (
              <FaqRow key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="flex flex-col items-center gap-5 bg-navy px-12 py-16 text-center">
        <h2 className="m-0 font-inter text-[30px] font-bold tracking-[-0.02em] text-white">
          The bottleneck isn’t typing code. It’s knowing what to build.
        </h2>
        <button
          onClick={startOnboarding}
          className="rounded-[10px] bg-blue px-8 py-[15px] font-inter text-[16px] font-semibold text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,102,204,.5)]"
        >
          Start free
        </button>
        <span className="font-mono text-[13px] text-ink-500">framis.dev</span>
      </Reveal>
    </div>
  );
}
