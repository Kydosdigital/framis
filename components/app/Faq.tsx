"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/data";

function FaqRow({ question, answer }: { question: string; answer: string }) {
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

export default function Faq() {
  return (
    <div className="max-w-[720px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">HELP</div>
      <h1 className="mb-2.5 font-inter text-[27px] font-bold tracking-[-0.02em]">
        Frequently asked questions
      </h1>
      <p className="mb-7 max-w-[560px] text-[14.5px]/[1.6] text-ink-500">
        The questions people ask most before and during the curriculum.
      </p>
      <div className="flex flex-col gap-2.5">
        {FAQ_ITEMS.map((item) => (
          <FaqRow key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}
