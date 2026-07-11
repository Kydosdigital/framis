"use client";

import { useState } from "react";

export default function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 border-none bg-transparent py-4 text-left"
      >
        <span className="flex-1 font-inter text-[14.5px] font-semibold text-ink-900">{question}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 flex-none transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-90 text-blue" : "text-ink-400"
          }`}
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-[13.5px]/[1.65] text-ink-500">{answer}</p>
        </div>
      </div>
    </div>
  );
}
