"use client";

import { FAQ_ITEMS } from "@/lib/data";
import FaqRow from "../FaqRow";

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
