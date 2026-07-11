"use client";

import { FAQ_ITEMS } from "@/lib/data";
import Reveal from "./Reveal";
import FaqRow from "../FaqRow";

// Group the single-source FAQ_ITEMS by matching question text, so the copy
// stays in lib/data (no duplication) but reads as categorized on the page.
const GROUPS: { label: string; match: string[] }[] = [
  { label: "Pricing & mentorship", match: ["free forever", "mentor option"] },
  { label: "Curriculum", match: ["know how to code", "get stuck", "phase 3", "phone or an old"] },
  { label: "Outcomes", match: ["how long does this", "if you finish"] },
];

function itemsFor(match: string[]) {
  return FAQ_ITEMS.filter((it) => match.some((m) => it.question.toLowerCase().includes(m)));
}

export default function FaqSection() {
  return (
    <Reveal className="flex justify-center px-6 py-16 sm:px-12 sm:py-20">
      <div className="w-full max-w-[960px]">
        <p className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-teal before:h-px before:w-4 before:bg-teal before:content-['']">
          FAQ
        </p>
        <h2 className="mb-9 font-inter text-[26px] font-bold tracking-[-0.02em] sm:text-[30px]">Questions people ask.</h2>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {GROUPS.map((g) => {
            const items = itemsFor(g.match);
            if (!items.length) return null;
            return (
              <div key={g.label} data-stagger="1">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">// {g.label}</p>
                <div>
                  {items.map((it) => (
                    <FaqRow key={it.question} question={it.question} answer={it.answer} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[13.5px] text-ink-500">
          Still stuck? Email{" "}
          <a href="mailto:support@framis.dev" className="font-semibold text-blue no-underline">
            support@framis.dev
          </a>{" "}
          — a real person answers.
        </p>
      </div>
    </Reveal>
  );
}
