"use client";

import { useState } from "react";
import VariablesLesson from "./lessons/VariablesLesson";
import RagLesson from "./lessons/RagLesson";

const LESSONS = [
  { key: "variables", label: "Variables (Module 2)" },
  { key: "rag", label: "RAG (Module 14)" },
] as const;

export default function Lesson() {
  const [active, setActive] = useState<(typeof LESSONS)[number]["key"]>("variables");

  return (
    <div className="max-w-[780px]">
      <div className="mb-6 flex gap-2">
        {LESSONS.map((l) => (
          <button
            key={l.key}
            onClick={() => setActive(l.key)}
            className="rounded-full px-4 py-[7px] font-inter text-[12.5px] font-semibold"
            style={{
              border: `1.5px solid ${active === l.key ? "#0066CC" : "var(--color-border-input)"}`,
              background: active === l.key ? "#EAF2FB" : "var(--color-card)",
              color: active === l.key ? "#0066CC" : "var(--color-ink-500)",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      {active === "variables" ? <VariablesLesson /> : <RagLesson />}
    </div>
  );
}
