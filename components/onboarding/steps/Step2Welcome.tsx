"use client";

import { useDisplayName } from "@/lib/store";
import StepNav from "../StepNav";

export default function Step2Welcome() {
  const name = useDisplayName();

  return (
    <>
      <h2 className="mb-1.5 font-inter text-[24px] font-bold tracking-[-0.02em]">
        Welcome, {name}.
      </h2>
      <p className="mb-4 text-[14.5px]/[1.6] text-ink-500">
        You just signed up for a real engineering education, not a weekend
        tutorial. Framis is a 64-week path from your first terminal command to
        shipping production AI systems — seven phases, each ending in a real
        project you can show an employer.
      </p>
      <p className="mb-4 text-[14.5px]/[1.6] text-ink-500">
        It’s free, and it stays free. No paywall waiting at module 10. If you
        want a dedicated mentor alongside the free curriculum, that’s a paid
        option later — but everything you need to learn and ship is already
        included.
      </p>
      <p className="text-[14.5px]/[1.6] text-ink-500">
        Before you jump into Lesson 1, five quick pages — about three minutes
        — so you know what you’re actually signing up for.
      </p>
      <StepNav showBack={false} />
    </>
  );
}
