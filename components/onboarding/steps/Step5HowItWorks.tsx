"use client";

import StepNav from "../StepNav";

const ROWS = [
  {
    title: "A lesson",
    body: "Concept, in plain English → a short animation walking through it → a live code sandbox where you actually write it → a quick check-your-understanding question. About 20–30 minutes.",
  },
  {
    title: "A module",
    body: "Four lessons, one topic. Modules build in order — each one assumes you’ve done the last.",
  },
  {
    title: "A phase",
    body: "Four modules, then a capstone: a real project using everything in that phase, not a guided walkthrough.",
  },
  {
    title: "When you’re stuck",
    body: "Every lesson has a key-terms sidebar — plain-English definitions for anything jargon-y, with a real-world example. When you ship a capstone, another learner reviews your actual code before you’re marked done.",
  },
];

export default function Step5HowItWorks() {
  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        How it’s structured
      </h2>
      <p className="mb-6 text-[14.5px]/[1.6] text-ink-500">
        Same shape every time, so you never have to relearn how to learn.
      </p>
      <div className="flex flex-col gap-4">
        {ROWS.map((r) => (
          <div key={r.title}>
            <div className="mb-1 font-inter text-[14.5px] font-semibold">{r.title}</div>
            <p className="text-[13.5px]/[1.6] text-ink-500">{r.body}</p>
          </div>
        ))}
      </div>
      <StepNav />
    </>
  );
}
