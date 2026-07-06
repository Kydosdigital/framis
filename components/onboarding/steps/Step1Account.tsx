"use client";

import { useFramis } from "@/lib/store";

const inputCls =
  "rounded-lg border border-line-input px-[14px] py-[13px] text-[15px]";

export default function Step1Account() {
  const s = useFramis();

  return (
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
  );
}
