"use client";

import { useFramis } from "@/lib/store";
import { OB_QUESTIONS, SETUP_ITEMS } from "@/lib/data";
import { Check } from "../../ui";
import StepNav from "../StepNav";

const inputCls =
  "rounded-lg border border-line-input px-[14px] py-[13px] text-[15px]";

export default function Step8QuickStart() {
  const s = useFramis();
  const allAnswered = Boolean(s.obAnswers.q1 && s.obAnswers.q2 && s.obAnswers.q3);

  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        Quick start
      </h2>
      <p className="mb-6 text-[14.5px]/[1.55] text-ink-500">
        Three quick questions so we place you in the right spot, plus your
        setup checklist. No wrong answers.
      </p>

      <div className="mb-6 flex flex-col gap-[22px]">
        {OB_QUESTIONS.map((q) => (
          <div key={q.key}>
            <div className="mb-2.5 font-inter text-[14.5px] font-semibold">{q.label}</div>
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
      </div>

      <div className="mb-6">
        <div className="mb-2.5 font-inter text-[14.5px] font-semibold">
          What’s pulling you toward this? <span className="font-normal text-ink-400">(optional)</span>
        </div>
        <input
          value={s.obLearningGoal}
          onChange={(e) => s.setOb({ obLearningGoal: e.target.value })}
          placeholder="e.g. career switch into engineering, build my own product…"
          className={`${inputCls} w-full`}
        />
      </div>

      <div className="mb-2 rounded-[10px] bg-[#F4F6F9] px-5 py-[18px]">
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
                <span className="text-[14px] font-medium text-ink-900">{item.label}</span>
                <span className="ml-auto font-mono text-[12.5px] text-blue">guide →</span>
              </button>
            );
          })}
        </div>
      </div>

      <StepNav nextLabel="See my starting point" nextDisabled={!allAnswered} />
    </>
  );
}
