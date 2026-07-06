"use client";

import { useFramis } from "@/lib/store";

export default function StepNav({
  nextLabel = "Continue",
  nextDisabled = false,
  onNext,
  showBack = true,
}: {
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  showBack?: boolean;
}) {
  const obBack = useFramis((s) => s.obBack);
  const obNext = useFramis((s) => s.obNext);

  return (
    <div className="mt-8 flex items-center gap-3">
      {showBack && (
        <button
          onClick={obBack}
          className="rounded-lg border border-line-input bg-transparent px-5 py-[13px] font-inter text-[14.5px] font-semibold text-ink-500"
        >
          Back
        </button>
      )}
      <button
        onClick={onNext ?? obNext}
        disabled={nextDisabled}
        className="flex-1 rounded-lg bg-blue p-[14px] font-inter text-[15px] font-semibold text-white disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}
