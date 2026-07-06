"use client";

import { useFramis, OB_STEP_COUNT } from "@/lib/store";
import { Logo } from "../ui";
import Step1Account from "./steps/Step1Account";
import Step2Welcome from "./steps/Step2Welcome";
import Step3HonestTruth from "./steps/Step3HonestTruth";
import Step4CurriculumMap from "./steps/Step4CurriculumMap";
import Step5HowItWorks from "./steps/Step5HowItWorks";
import Step6WhyFinish from "./steps/Step6WhyFinish";
import Step7Expectations from "./steps/Step7Expectations";
import Step8QuickStart from "./steps/Step8QuickStart";
import Step9Completion from "./steps/Step9Completion";

const STEPS = [
  Step1Account,
  Step2Welcome,
  Step3HonestTruth,
  Step4CurriculumMap,
  Step5HowItWorks,
  Step6WhyFinish,
  Step7Expectations,
  Step8QuickStart,
  Step9Completion,
];

export default function Onboarding() {
  const obStep = useFramis((s) => s.obStep);
  const StepComponent = STEPS[obStep - 1] ?? Step1Account;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 py-10">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white px-11 pb-10 pt-11 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-7 flex items-center justify-between">
          <Logo size={24} wordSize={17} />
          <span className="font-mono text-[12px] font-medium text-ink-500">
            STEP {obStep} / {OB_STEP_COUNT}
          </span>
        </div>
        <div className="mb-8 flex gap-1.5">
          {Array.from({ length: OB_STEP_COUNT }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className="h-1 flex-1 rounded-sm"
              style={{ background: obStep >= n ? "#0066CC" : "#E4E7EE" }}
            />
          ))}
        </div>

        <StepComponent />
      </div>
    </div>
  );
}
