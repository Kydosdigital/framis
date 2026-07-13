import { GENERIC_LESSONS } from "@/lib/lessons/content";
import { ROADMAP_MODULES } from "@/lib/data";
import { lessonEngagementId } from "./types";

export type LessonLookupEntry = {
  lessonId: string;
  moduleId: string;
  phase: number;
  moduleNum: number;
  moduleTitle: string;
  title: string;
  orderIndex: number;
};

let cache: Map<string, LessonLookupEntry> | null = null;

/** Reverse-maps an engagement `lesson_id` (e.g. "m9-l2") back to a
 * human-readable title/module for the admin dashboard and reports. */
export function lessonLookup(): Map<string, LessonLookupEntry> {
  if (cache) return cache;
  const map = new Map<string, LessonLookupEntry>();
  for (const mod of ROADMAP_MODULES) {
    const lessons = GENERIC_LESSONS[mod.num] ?? [];
    for (const lesson of lessons) {
      const id = lessonEngagementId(mod.num, lesson.orderIndex);
      map.set(id, {
        lessonId: id,
        moduleId: `m${mod.num}`,
        phase: mod.phase,
        moduleNum: mod.num,
        moduleTitle: mod.title,
        title: lesson.title,
        orderIndex: lesson.orderIndex,
      });
    }
  }
  cache = map;
  return map;
}

export function lookupLesson(lessonId: string): LessonLookupEntry | undefined {
  return lessonLookup().get(lessonId);
}
