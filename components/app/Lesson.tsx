"use client";

import { useFramis } from "@/lib/store";
import { PHASES, ROADMAP_MODULES, LESSON_CONTENT } from "@/lib/data";
import VariablesLesson from "./lessons/VariablesLesson";
import RagLesson from "./lessons/RagLesson";

function BackToAll({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="mb-5 font-inter text-[13px] font-semibold text-blue"
    >
      ← All lessons
    </button>
  );
}

function ComingSoon({ num, title, onBack }: { num: number; title: string; onBack: () => void }) {
  return (
    <div>
      <BackToAll onBack={onBack} />
      <div className="rounded-[12px] border border-line bg-card px-7 py-[26px]">
        <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
          MODULE {num}
        </div>
        <h1 className="mb-2.5 font-inter text-[22px] font-bold tracking-[-0.02em]">
          {title}
        </h1>
        <p className="text-[14.5px]/[1.6] text-ink-500">
          This lesson isn&apos;t published yet — check back soon.
        </p>
      </div>
    </div>
  );
}

function LessonBrowser({ onOpen }: { onOpen: (num: number) => void }) {
  const stats = useFramis((s) => s.stats);
  const completed = stats?.completedModuleNumbers ?? [];

  return (
    <div>
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        ALL LESSONS · 24 MODULES
      </div>
      <h1 className="mb-2.5 font-inter text-[27px] font-bold tracking-[-0.02em]">
        Pick any lesson
      </h1>
      <p className="mb-7 max-w-[560px] text-[14.5px]/[1.6] text-ink-500">
        Jump to whatever you want to work on — nothing here is locked.
      </p>

      <div className="flex flex-col gap-7">
        {PHASES.map((ph, i) => {
          const phaseNum = i + 1;
          const modules = ROADMAP_MODULES.filter((m) => m.phase === phaseNum);
          return (
            <div key={ph.num}>
              <div className="mb-2.5 font-mono text-[11.5px] font-medium tracking-[0.06em] text-ink-400">
                PHASE {ph.num} · {ph.title.toUpperCase()}
              </div>
              <div className="overflow-hidden rounded-[12px] border border-line bg-card">
                {modules.map((m, mi) => {
                  const built = LESSON_CONTENT[m.num];
                  const isDone = completed.includes(m.num);
                  return (
                    <button
                      key={m.num}
                      onClick={() => onOpen(m.num)}
                      className="flex w-full items-center gap-3.5 px-5 py-[13px] text-left"
                      style={{ borderTop: mi === 0 ? "none" : "1px solid var(--color-border)" }}
                    >
                      <span
                        className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[11.5px] font-semibold"
                        style={{
                          background: isDone ? "#4B9E8F" : "var(--color-surface)",
                          color: isDone ? "#fff" : "var(--color-ink-500)",
                          border: isDone ? "none" : "1.5px solid var(--color-border-input)",
                        }}
                      >
                        {m.num}
                      </span>
                      <span className="flex-1 font-inter text-[14px] font-medium">
                        {m.title}
                      </span>
                      {built ? (
                        <span className="font-mono text-[11px] font-medium text-ink-400">
                          {built.minutes} min →
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#F4F6F9] px-2.5 py-[3px] font-mono text-[10.5px] font-medium text-ink-400 dark:bg-[#1B2536]">
                          Coming soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Lesson() {
  const active = useFramis((s) => s.activeLessonKey);
  const setActive = useFramis((s) => s.setActiveLessonKey);

  if (active === null) {
    return (
      <div className="max-w-[780px]">
        <LessonBrowser
          onOpen={(num) => setActive(LESSON_CONTENT[num] ? LESSON_CONTENT[num].key : num)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[780px]">
      {active === "variables" && (
        <>
          <BackToAll onBack={() => setActive(null)} />
          <VariablesLesson />
        </>
      )}
      {active === "rag" && (
        <>
          <BackToAll onBack={() => setActive(null)} />
          <RagLesson />
        </>
      )}
      {typeof active === "number" && (
        <ComingSoon
          num={active}
          title={ROADMAP_MODULES.find((m) => m.num === active)?.title ?? ""}
          onBack={() => setActive(null)}
        />
      )}
    </div>
  );
}
