"use client";

import { useState } from "react";

export default function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border-none bg-transparent px-5 py-4 text-left"
      >
        <span className="flex-1 font-inter text-[14.5px] font-semibold text-ink-900">{question}</span>
        <span className="flex-none font-mono text-[13px] text-blue">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="border-t border-line px-5 py-4 text-[13.5px]/[1.6] text-ink-500">{answer}</div>
      )}
    </div>
  );
}
