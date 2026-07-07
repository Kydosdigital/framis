"use client";

import { useState } from "react";
import { useFramis } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "../ui";

const inputCls = "rounded-lg border border-line-input px-[14px] py-[13px] text-[15px]";

export default function MentorApply() {
  const goScreen = useFramis((s) => s.goScreen);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [timezone, setTimezone] = useState("");
  const [whyMentor, setWhyMentor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const ready = name.trim() && email.trim() && yearsExperience.trim() && timezone.trim() && whyMentor.trim();

  const submit = async () => {
    if (!ready) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("mentor_applications").insert({
      name: name.trim(),
      email: email.trim(),
      years_experience: yearsExperience.trim(),
      portfolio_url: portfolioUrl.trim() || null,
      timezone: timezone.trim(),
      why_mentor: whyMentor.trim(),
    });
    setBusy(false);
    if (error) {
      setError("Something went wrong sending your application — try again in a moment.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 bg-navy px-5 py-[14px] sm:px-12 sm:py-[18px]">
        <button onClick={() => goScreen("landing")} className="flex min-w-0 items-center gap-3 border-none bg-transparent">
          <Logo size={26} wordSize={17} light />
        </button>
      </div>

      <div className="flex justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-[560px]">
          {submitted ? (
            <div className="rounded-[12px] border border-line bg-card px-8 py-10 text-center">
              <div className="mb-3 font-inter text-[22px] font-bold">Thanks — we’ve got it.</div>
              <p className="text-[14.5px]/[1.6] text-ink-500">
                We read every application. If it looks like a fit, we’ll reach
                out by email to talk through the next step.
              </p>
              <button
                onClick={() => goScreen("landing")}
                className="mt-6 rounded-lg bg-blue px-6 py-3 font-inter text-[14px] font-semibold text-white"
              >
                Back to Framis
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">BECOME A MENTOR</div>
              <h1 className="mb-3 font-inter text-[30px] font-bold tracking-[-0.02em]">
                Mentor the next engineer
              </h1>
              <p className="mb-8 max-w-[480px] text-[14.5px]/[1.6] text-ink-500">
                Mentors get matched with up to 5 students at a time — one code
                review a week, plus a monthly career check-in per student, at
                £50/month/student.
              </p>

              <div className="flex flex-col gap-[14px]">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputCls} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={inputCls} />
                <input
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="Years of engineering experience"
                  className={inputCls}
                />
                <input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="GitHub, LinkedIn, or portfolio URL (optional)"
                  className={inputCls}
                />
                <input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Timezone (e.g. GMT+2)"
                  className={inputCls}
                />
                <textarea
                  value={whyMentor}
                  onChange={(e) => setWhyMentor(e.target.value)}
                  placeholder="Why do you want to mentor?"
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
                {error && <p className="text-[13px]/[1.5] text-danger">{error}</p>}
                <button
                  onClick={submit}
                  disabled={!ready || busy}
                  className="mt-1.5 rounded-lg bg-blue p-[14px] font-inter text-[15px] font-semibold text-white disabled:opacity-40"
                >
                  {busy ? "Sending…" : "Submit application"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
