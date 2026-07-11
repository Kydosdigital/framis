"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { Logo } from "../ui";
import { Icon } from "../Icon";
import ThreeHero from "./ThreeHero";
import RoadmapHero from "./RoadmapHero";
import WhyFramis from "./WhyFramis";
import OutcomesSection from "./OutcomesSection";
import Pricing from "./Pricing";
import FaqSection from "./FaqSection";
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
            <div className="mb-[26px] font-inter text-[15px] font-semibold text-slateink-200 [animation:framisWordIn_.6s_both]">
              Code is cheap. <span className="font-bold text-teal">Judgment isn’t.</span>
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
              systems thinking, and shipping. The full curriculum is free; add a
              1:1 mentor whenever you want accountability. Zero to full-stack AI
              engineer at 10–15 hours a week.
            </p>
            <div className="flex flex-wrap items-center gap-[14px] [animation:framisWordIn_.7s_.92s_both]">
              <button
                onClick={startOnboarding}
                className="inline-flex items-center gap-2.5 rounded-[10px] bg-blue px-[30px] py-[15px] font-inter text-[16px] font-semibold text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,102,204,.5)]"
              >
                Start free — no card needed
                <Icon name="arrow-right" size={15} />
              </button>
              <button
                onClick={() => goScreen("mentorship")}
                className="inline-flex items-center gap-1.5 border-none bg-transparent px-2 py-[15px] font-inter text-[15px] font-semibold text-teal"
              >
                Explore mentorship
                <Icon name="arrow-right" size={13} />
              </button>
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

      {/* why framis — positioning pillars */}
      <WhyFramis />

      {/* roadmap — 3D helix build graph */}
      <RoadmapHero />

      {/* graduate outcomes — dot matrix */}
      <OutcomesSection />

      {/* pricing — tiers + matrix */}
      <Pricing />

      {/* faq — categorized */}
      <FaqSection />

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
