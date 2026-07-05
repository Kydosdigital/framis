"use client";

import { useFramis, useDisplayName } from "@/lib/store";
import { OB_QUESTIONS, SETUP_ITEMS } from "@/lib/data";
import { Logo, Check } from "../ui";

const inputCls =
  "rounded-lg border border-line-input px-[14px] py-[13px] text-[15px]";

export default function Onboarding() {
  const s = useFramis();
  const displayName = useDisplayName();

  const bar = (n: number) => (s.obStep >= n ? "#0066CC" : "#E4E7EE");
  const allAnswered = s.obAnswers.q1 && s.obAnswers.q2 && s.obAnswers.q3;
  const beginner = s.obAnswers.q1 === "Never used it";

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 py-10">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white px-11 pb-10 pt-11 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-7 flex items-center justify-between">
          <Logo size={24} wordSize={17} />
          <span className="font-mono text-[12px] font-medium text-ink-500">
            STEP {s.obStep} / 3
          </span>
        </div>
        <div className="mb-8 flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-1 flex-1 rounded-sm"
              style={{ background: bar(n) }}
            />
          ))}
        </div>

        {/* Step 1 — account */}
        {s.obStep === 1 && (
          <>
            <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
              {s.obMode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mb-[26px] text-[14.5px]/[1.55] text-ink-500">
              {s.obMode === "signup"
                ? "Free forever for lessons, sandboxes, and peer review."
                : "Log in to pick up where you left off."}
            </p>
            <div className="flex flex-col gap-[14px]">
              {s.obMode === "signup" && (
                <input
                  value={s.obName}
                  onChange={(e) => s.setOb({ obName: e.target.value })}
                  placeholder="First name"
                  className={inputCls}
                />
              )}
              <input
                value={s.obEmail}
                onChange={(e) => s.setOb({ obEmail: e.target.value })}
                placeholder="Email"
                type="email"
                className={inputCls}
              />
              <input
                value={s.obPw}
                onChange={(e) => s.setOb({ obPw: e.target.value })}
                placeholder="Password"
                type="password"
                className={inputCls}
              />
              {s.authNotice && (
                <p className="text-[13px]/[1.5] text-blue">{s.authNotice}</p>
              )}
              {s.authError && (
                <p className="text-[13px]/[1.5] text-danger">{s.authError}</p>
              )}
              <button
                onClick={s.submitAccount}
                disabled={s.authBusy}
                className="mt-1.5 rounded-lg bg-blue p-[14px] font-inter text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {s.authBusy
                  ? "Working…"
                  : s.obMode === "signup"
                    ? "Continue"
                    : "Log in"}
              </button>
              <button
                onClick={() => s.setObMode(s.obMode === "signup" ? "login" : "signup")}
                className="rounded-lg border-none bg-transparent p-1 font-inter text-[13px] font-semibold text-blue"
              >
                {s.obMode === "signup"
                  ? "Already have an account? Log in"
                  : "New here? Create an account"}
              </button>
            </div>
          </>
        )}

        {/* Step 2 — placement quiz */}
        {s.obStep === 2 && (
          <>
            <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
              Where are you starting from?
            </h2>
            <p className="mb-[26px] text-[14.5px]/[1.55] text-ink-500">
              Three quick questions so we start you in the right place. No wrong
              answers.
            </p>
            <div className="flex flex-col gap-[22px]">
              {OB_QUESTIONS.map((q) => (
                <div key={q.key}>
                  <div className="mb-2.5 font-inter text-[14.5px] font-semibold">
                    {q.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.opts.map((opt) => {
                      const active = s.obAnswers[q.key] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => s.answer(q.key, opt)}
                          className="rounded-full px-4 py-2 text-[13.5px] font-medium"
                          style={{
                            border: `1.5px solid ${active ? "#0066CC" : "#D6DBE3"}`,
                            background: active ? "#EAF2FB" : "#fff",
                            color: active ? "#0066CC" : "#4B5563",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={s.obNext}
                className="rounded-lg p-[14px] font-inter text-[15px] font-semibold text-white"
                style={{ background: allAnswered ? "#0066CC" : "#B9C2CE" }}
              >
                See my starting point
              </button>
            </div>
          </>
        )}

        {/* Step 3 — placement + setup */}
        {s.obStep === 3 && (
          <>
            <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F5F1]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12.5l5 5L20 6.5"
                  stroke="#059669"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
              Nice to meet you
              {s.obName.trim() ? `, ${displayName}` : ""}.
            </h2>
            <p className="mb-6 text-[14.5px]/[1.6] text-ink-500">
              {beginner
                ? "We’ll start you at Module 1 — setting up like an engineer. You’ll run your first program today."
                : "You’re comfortable with the basics, so we’ll start you at Module 2: Python — and your first lesson is Variables."}
            </p>
            <div className="mb-[26px] rounded-[10px] bg-[#F4F6F9] px-5 py-[18px]">
              <div className="mb-3 font-inter text-[13px] font-semibold text-ink-500">
                BEFORE YOUR FIRST LESSON, INSTALL:
              </div>
              <div className="flex flex-col gap-2.5">
                {SETUP_ITEMS.map((item) => {
                  const on = s.setup[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => s.toggleSetup(item.key)}
                      className="flex items-center gap-3 border-none bg-transparent p-0 text-left"
                    >
                      <span
                        className="flex h-5 w-5 flex-none items-center justify-center rounded-md"
                        style={{
                          border: `1.5px solid ${on ? "#059669" : "#C4CBD6"}`,
                          background: on ? "#059669" : "#fff",
                        }}
                      >
                        <Check size={12} opacity={on ? 1 : 0} />
                      </span>
                      <span className="text-[14px] font-medium text-ink-900">
                        {item.label}
                      </span>
                      <span className="ml-auto font-mono text-[12.5px] text-blue">
                        guide →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={s.finishOnboarding}
              className="w-full rounded-lg bg-blue p-[14px] font-inter text-[15px] font-semibold text-white"
            >
              Go to my dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
