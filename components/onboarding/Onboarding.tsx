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
              <button
                onClick={s.signInWithGithub}
                disabled={s.authBusy}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-line-input bg-transparent p-[13px] font-inter text-[14.5px] font-semibold text-ink-900 disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
                </svg>
                Continue with GitHub
              </button>
              <div className="flex items-center gap-3 py-0.5">
                <div className="h-px flex-1 bg-line-input" />
                <span className="font-mono text-[11.5px] font-medium text-ink-500">OR</span>
                <div className="h-px flex-1 bg-line-input" />
              </div>
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
