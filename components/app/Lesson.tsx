"use client";

import { useFramis } from "@/lib/store";
import { PHASES, ROADMAP_MODULES } from "@/lib/data";
import { moduleLessonList, resolveLesson, nextLessonLabel } from "@/lib/lessons";
import VariablesLesson from "./lessons/VariablesLesson";
import RagLesson from "./lessons/RagLesson";
import GenericLesson from "./lessons/GenericLesson";

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

function LessonSubNav({
  module,
  activeIndex,
  onPick,
}: {
  module: number;
  activeIndex: number;
  onPick: (orderIndex: number) => void;
}) {
  const list = moduleLessonList(module);
  if (list.length < 2) return null;
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {list.map((l) => (
        <button
          key={l.orderIndex}
          onClick={() => onPick(l.orderIndex)}
          className="rounded-full px-3.5 py-[7px] font-inter text-[12.5px] font-semibold"
          style={{
            border: `1.5px solid ${activeIndex === l.orderIndex ? "#0066CC" : "var(--color-border-input)"}`,
            background: activeIndex === l.orderIndex ? "#EAF2FB" : "var(--color-card)",
            color: activeIndex === l.orderIndex ? "#0066CC" : "var(--color-ink-500)",
          }}
        >
          Lesson {l.orderIndex}
        </button>
      ))}
    </div>
  );
}

function LessonBrowser({ onOpen }: { onOpen: (module: number) => void }) {
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
                  const list = moduleLessonList(m.num);
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
                      <span className="font-mono text-[11px] font-medium text-ink-400">
                        {list.length ? `${list.length} lesson${list.length > 1 ? "s" : ""} →` : ""}
                      </span>
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
  const goToLesson = useFramis((s) => s.goToLesson);

  if (active === null) {
    return (
      <div className="max-w-[780px]">
        <LessonBrowser onOpen={(module) => goToLesson(module, 1)} />
      </div>
    );
  }

  const { module, lessonIndex } = active;
  const ref = resolveLesson(module, lessonIndex);
  const totalLessons = moduleLessonList(module).length;

  return (
    <div className="max-w-[780px]">
      <BackToAll onBack={() => setActive(null)} />
      <LessonSubNav module={module} activeIndex={lessonIndex} onPick={(i) => goToLesson(module, i)} />
      {ref?.kind === "bespoke" && ref.bespokeKey === "variables" && <VariablesLesson />}
      {ref?.kind === "bespoke" && ref.bespokeKey === "rag" && <RagLesson />}
      {ref?.kind === "generic" && (
        <GenericLesson
          key={`${module}-${lessonIndex}`}
          data={ref.data}
          totalLessons={totalLessons}
          nextUpLabel={nextLessonLabel(module, lessonIndex)}
        />
      )}
    </div>
  );
}
