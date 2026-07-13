/** Shared types for lesson engagement tracking — see spec §1-3. */

import type { Json } from "@/lib/supabase/database.types";

export type EngagementEventType =
  | "page_view"
  | "scroll_depth"
  | "explainer_open"
  | "explain_simpler_toggle"
  | "sandbox_attempt"
  | "sandbox_complete"
  | "quiz_attempt"
  | "quiz_complete";

export type EngagementEvent = {
  lesson_id: string;
  module_id: string;
  phase: number;
  event_type: EngagementEventType;
  event_value: Record<string, Json>;
  session_id: string;
};

export type EngagementBatchPayload = {
  events: EngagementEvent[];
};

/** Composite 0-100 engagement score weights (spec §1). Time-on-page is
 * deliberately excluded — easiest signal to game, least reliable alone. */
export const ENGAGEMENT_WEIGHTS = {
  scroll: 0.25,
  interaction: 0.2,
  sandbox: 0.25,
  quiz: 0.3,
} as const;

/** `lib/lessons/content` lessons are addressed by (module number, order
 * index), not a single string id — this derives the stable text id the
 * engagement tables key on. */
export function lessonEngagementId(moduleNum: number, orderIndex: number): string {
  return `m${moduleNum}-l${orderIndex}`;
}

export function moduleEngagementId(moduleNum: number): string {
  return `m${moduleNum}`;
}
