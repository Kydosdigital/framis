import { LESSON_CONTENT } from "../data";
import { GENERIC_LESSONS } from "./content";

export type LessonMeta = { key: "variables" | "rag" | number; title: string; minutes: number };

/** Every module (1-24) now has real lesson content — this just picks which
 * component renders it: the two bespoke lessons, or the data-driven GenericLesson. */
export function lessonMeta(num: number): LessonMeta | null {
  const special = LESSON_CONTENT[num];
  if (special) return special;
  const generic = GENERIC_LESSONS[num];
  if (generic) return { key: num, title: generic.title, minutes: generic.minutes };
  return null;
}

export { GENERIC_LESSONS };
