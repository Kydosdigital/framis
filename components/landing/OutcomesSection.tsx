"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const BLUE = "#0066CC";
const TEAL = "#4B9E8F";

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A row of 10 figures; the first `on` are "hired" and pop in sequentially. */
function FigureRow({ on, color, inView }: { on: number; color: string; inView: boolean }) {
  return (
    <div className="flex flex-wrap gap-[5px]">
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < on;
        const reduced = prefersReduced();
        return (
          <svg
            key={i}
            viewBox="0 0 16 20"
            className="h-6 w-5"
            style={
              filled
                ? {
                    fill: color,
                    opacity: inView || reduced ? 1 : 0,
                    transform: inView || reduced ? "scale(1)" : "scale(0.4)",
                    transition: reduced ? "none" : "opacity .45s ease, transform .45s cubic-bezier(.34,1.4,.6,1)",
                    transitionDelay: `${i * 75}ms`,
                  }
                : { fill: "none", stroke: "#C4CBD6", strokeWidth: 1.1 }
            }
          >
            <use href="#framis-fig" />
          </svg>
        );
      })}
    </div>
  );
}

function useCountUp(target: number, inView: boolean, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReduced()) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, ms]);
  return v;
}

/**
 * "Outcomes, not vibes." — makes the headline literally true: the self-paced
 * vs mentored placement rate is an isotype dot-matrix that fills in on scroll
 * (1-in-5 vs 1-in-2), with a counting-up salary tile. Honest caveat included.
 */
export default function OutcomesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const salary = useCountUp(52000, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setInView(true);
            obs.unobserve(en.target);
          }
        }),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Reveal className="flex justify-center px-6 py-16 sm:px-12 sm:py-20">
      {/* figure glyph, defined once */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <symbol id="framis-fig" viewBox="0 0 16 20">
          <circle cx="8" cy="4.4" r="3.4" />
          <path d="M1.6 20c0-3.9 2.9-6.6 6.4-6.6s6.4 2.7 6.4 6.6z" />
        </symbol>
      </svg>

      <div ref={ref} className="w-full max-w-[960px]">
        <p className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-teal before:h-px before:w-4 before:bg-teal before:content-['']">
          Outcomes
        </p>
        <h2 className="mb-2 font-inter text-[26px] font-bold tracking-[-0.02em] sm:text-[30px]">Outcomes, not vibes.</h2>
        <p className="mb-9 max-w-[56ch] text-[15px]/[1.6] text-ink-500">
          The curriculum is free either way. These are what actually happen after people finish it — shown, not
          asserted.
        </p>

        <div className="flex max-w-[560px] flex-col gap-6">
          <div>
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <span className="text-[14.5px] font-semibold text-ink-900">Self-paced</span>
              <span className="font-mono text-[13px] font-semibold" style={{ color: BLUE }}>
                ~1 in 5 hired
              </span>
            </div>
            <FigureRow on={2} color={BLUE} inView={inView} />
          </div>
          <div>
            <div className="mb-2.5 flex items-baseline justify-between gap-2">
              <span className="text-[14.5px] font-semibold text-ink-900">With a mentor</span>
              <span className="font-mono text-[13px] font-semibold" style={{ color: TEAL }}>
                ~1 in 2 hired
              </span>
            </div>
            <FigureRow on={5} color={TEAL} inView={inView} />
          </div>
        </div>

        <div className="mt-6 grid max-w-[560px] grid-cols-2 gap-3.5">
          <div className="rounded-[12px] border border-line bg-white px-[18px] py-4">
            <div className="font-mono text-[24px] font-bold tracking-[-0.01em] text-ink-900">
              £{salary.toLocaleString("en-GB")}
            </div>
            <div className="mt-0.5 text-[12.5px]/[1.4] text-ink-500">average first AI-engineering salary</div>
          </div>
          <div className="rounded-[12px] border border-line bg-white px-[18px] py-4">
            <div className="font-mono text-[24px] font-bold tracking-[-0.01em] text-ink-900">~8 wks</div>
            <div className="mt-0.5 text-[12.5px]/[1.4] text-ink-500">typical capstone → first offer</div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="h-1 flex-1 rounded-[2px] bg-teal" />
              <span className="h-1 flex-1 rounded-[2px] bg-teal" />
              <span className="h-1 flex-1 rounded-[2px] bg-teal" />
              <span className="h-1 flex-1 rounded-[2px] bg-line" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[12.5px] text-ink-400">
          Outcome rates for learners who finish, within 6 months — not guarantees. The curriculum is identical on
          both tracks.
        </p>
      </div>
    </Reveal>
  );
}
