import { ROADMAP_MODULES } from "@/lib/data";

/** Looks up a module's curriculum phase (1-7) from its module number. */
export function phaseForModule(moduleNum: number): number {
  return ROADMAP_MODULES.find((m) => m.num === moduleNum)?.phase ?? 1;
}
