"use client";

import { useFramis } from "@/lib/store";
import { CRITERIA_LABELS, HINT_TEXTS } from "@/lib/data";
import { Check } from "../ui";

export default function Capstone() {
  const s = useFramis();
  const critCount = s.criteria.filter(Boolean).length;
  const capReady = critCount === 7 && s.ghUrl.trim() && s.depUrl.trim();

  return (
    <div className="max-w-[780px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        CAPSTONE 2 · PHASE 2 · INTERMEDIATE · 2–3 WEEKS · SOLO
      </div>
      <h1 className="mb-3.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Full-stack notes app with login
      </h1>
      <p className="mb-[26px] max-w-[640px] text-[15.5px]/[1.65] text-ink-700">
        You’re building an MVP where users sign up, log in, and manage private
        notes. React frontend, FastAPI + SQLite backend, deployed on Vercel +
        Railway, 70%+ test coverage.
      </p>

      {!s.capstoneSubmitted ? (
        <>
          {/* acceptance criteria */}
          <div className="mb-[18px] rounded-[12px] border border-line bg-white px-[26px] py-[22px]">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="font-inter text-[14px] font-semibold">
                Acceptance criteria
              </span>
              <span
                className="font-mono text-[12.5px] font-medium"
                style={{ color: critCount === 7 ? "#059669" : "#6B7280" }}
              >
                {critCount} / 7
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {CRITERIA_LABELS.map((label, i) => {
                const on = s.criteria[i];
                return (
                  <button
                    key={i}
                    onClick={() => s.toggleCriterion(i)}
                    className="flex items-center gap-3 border-none bg-transparent px-0 py-0.5 text-left"
                  >
                    <span
                      className="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md"
                      style={{
                        border: `1.5px solid ${on ? "#059669" : "#C4CBD6"}`,
                        background: on ? "#059669" : "#fff",
                      }}
                    >
                      <Check size={11} opacity={on ? 1 : 0} />
                    </span>
                    <span className="text-[14px] text-ink-900">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* hints */}
          <div className="mb-[18px] rounded-[12px] border border-line bg-white px-[26px] py-[22px]">
            <div className="mb-1.5 font-inter text-[14px] font-semibold">
              Stuck? Reveal hints one at a time
            </div>
            <p className="mb-3.5 text-[12.5px] text-ink-500">
              Struggling first is how it sticks. Hints don’t affect your score.
            </p>
            <div className="flex flex-col gap-[9px]">
              {HINT_TEXTS.map((text, i) =>
                s.hintsOpen[i] ? (
                  <div
                    key={i}
                    className="rounded-lg bg-[#F4F6F9] px-4 py-3 text-[13.5px]/[1.55] text-ink-900"
                  >
                    <span className="font-mono text-[12px] font-semibold text-blue">
                      HINT {i + 1} ·{" "}
                    </span>
                    {text}
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={() => s.revealHint(i)}
                    className="rounded-lg border border-dashed border-[#C4CBD6] bg-white px-4 py-3 text-left font-inter text-[13px] font-semibold text-ink-500"
                  >
                    Reveal hint {i + 1}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* submission */}
          <div className="rounded-[12px] border border-line bg-white px-[26px] py-[22px]">
            <div className="mb-4 font-inter text-[14px] font-semibold">
              Submit your project
            </div>
            <div className="flex flex-col gap-3">
              <input
                value={s.ghUrl}
                onChange={(e) => s.setGhUrl(e.target.value)}
                placeholder="GitHub repo URL (must be public)"
                className="rounded-lg border border-line-input px-3.5 py-3 font-mono text-[14px]"
              />
              <input
                value={s.depUrl}
                onChange={(e) => s.setDepUrl(e.target.value)}
                placeholder="Deployed URL"
                className="rounded-lg border border-line-input px-3.5 py-3 font-mono text-[14px]"
              />
              <div className="text-[12.5px] text-ink-500">
                On submit we auto-check: repo is public · README exists · no
                hardcoded secrets · tests pass. Then two peers review within 3
                days.
              </div>
              <button
                onClick={s.submitCapstone}
                className="rounded-[9px] p-[14px] font-inter text-[15px] font-semibold text-white"
                style={{ background: capReady ? "#059669" : "#B9C2CE" }}
              >
                Submit for peer review
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[12px] border border-[#B7E3D4] bg-white px-8 py-[34px] text-center">
          <div className="mx-auto mb-[18px] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#E7F5F1] [animation:framisPulse_1.4s_ease-out_2]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5l5 5L20 6.5"
                stroke="#059669"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="mb-2 font-inter text-[22px] font-bold">
            Shipped. That’s project 3 of 6.
          </h2>
          <p className="mb-1.5 text-[14.5px]/[1.6] text-ink-500">
            Auto-checks passed: repo public · README found · no secrets detected
            · 12/12 tests green.
          </p>
          <p className="mb-[22px] text-[14.5px]/[1.6] text-ink-500">
            Two peers have been assigned. Reviews land within 3 days, then it
            goes on your portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => s.goTab("dashboard")}
              className="rounded-lg bg-blue px-[22px] py-3 font-inter text-[14px] font-semibold text-white"
            >
              Back to dashboard
            </button>
            <button
              onClick={() => s.goTab("review")}
              className="rounded-lg border border-[#C9DEF2] bg-white px-[22px] py-3 font-inter text-[14px] font-semibold text-blue"
            >
              Review Jordan’s project now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
