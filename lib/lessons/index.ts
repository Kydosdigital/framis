import { ROADMAP_MODULES, LESSON_CONTENT } from "../data";
import { GENERIC_LESSONS } from "./content";
import type { LessonData } from "./types";

/** Modules whose Lesson 1 is a bespoke hand-built component (Variables, RAG)
 * rather than data-driven. Their remaining lessons (2-4) are still generic. */
const BESPOKE_MODULES = [2, 18] as const;

export type LessonRef =
  | { kind: "bespoke"; bespokeKey: "variables" | "rag" }
  | { kind: "generic"; data: LessonData };

function isBespokeModule(num: number): num is 2 | 18 {
  return (BESPOKE_MODULES as readonly number[]).includes(num);
}

/** Every lesson in a module, in order, as {orderIndex, title, minutes}. */
export function moduleLessonList(num: number): { orderIndex: number; title: string; minutes: number }[] {
  const generic = (GENERIC_LESSONS[num] ?? []).map((d) => ({ orderIndex: d.orderIndex, title: d.title, minutes: d.minutes }));
  if (isBespokeModule(num)) {
    const bespoke = LESSON_CONTENT[num];
    return bespoke ? [{ orderIndex: 1, title: bespoke.title, minutes: bespoke.minutes }, ...generic] : generic;
  }
  return generic.sort((a, b) => a.orderIndex - b.orderIndex);
}

export function totalLessonsFor(num: number): number {
  return moduleLessonList(num).length;
}

/** Resolve exactly what to render for a given (module, lessonOrderIndex). */
export function resolveLesson(num: number, orderIndex: number): LessonRef | null {
  if (isBespokeModule(num) && orderIndex === 1) {
    return { kind: "bespoke", bespokeKey: num === 2 ? "variables" : "rag" };
  }
  const data = (GENERIC_LESSONS[num] ?? []).find((d) => d.orderIndex === orderIndex);
  return data ? { kind: "generic", data } : null;
}

/** Module-level summary — used by Dashboard/Roadmap, which only ever care
 * about "the next lesson to work on" (always that module's Lesson 1). */
export function lessonMeta(num: number): { title: string; minutes: number } | null {
  const list = moduleLessonList(num);
  return list.length ? list[0] : null;
}

/** What to show in the "Next up" footer after a given lesson. */
export function nextLessonLabel(num: number, orderIndex: number): string {
  const list = moduleLessonList(num);
  const next = list.find((l) => l.orderIndex === orderIndex + 1);
  if (next) return `Lesson ${next.orderIndex}: ${next.title}`;

  const idx = ROADMAP_MODULES.findIndex((m) => m.num === num);
  const nextModule = idx >= 0 ? ROADMAP_MODULES[idx + 1] : undefined;
  if (nextModule) {
    const nextMeta = lessonMeta(nextModule.num);
    if (nextMeta) return nextMeta.title;
  }
  return "Capstone: Production AI system";
}

export { GENERIC_LESSONS };
