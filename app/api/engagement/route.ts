import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EngagementBatchPayload } from "@/lib/engagement/types";

export const dynamic = "force-dynamic";

const MAX_EVENTS_PER_BATCH = 200;

/**
 * Receives batched lesson-engagement events from `useLessonEngagement`
 * (via `navigator.sendBeacon` or a keepalive fetch) and inserts them as
 * the signed-in user. Row Level Security enforces `user_id = auth.uid()`
 * on insert, and a DB trigger recomputes that lesson's summary row —
 * this route never touches `lesson_engagement_summary` directly.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: EngagementBatchPayload;
  try {
    // sendBeacon delivers a Blob body — text() then JSON.parse handles both that and a normal fetch body.
    payload = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = Array.isArray(payload?.events) ? payload.events.slice(0, MAX_EVENTS_PER_BATCH) : [];
  if (!events.length) return NextResponse.json({ inserted: 0 });

  const rows = events
    .filter((e) => e && typeof e.lesson_id === "string" && typeof e.event_type === "string" && typeof e.session_id === "string")
    .map((e) => ({
      user_id: user.id,
      lesson_id: e.lesson_id,
      module_id: e.module_id,
      phase: e.phase,
      event_type: e.event_type,
      event_value: e.event_value ?? {},
      session_id: e.session_id,
    }));

  if (!rows.length) return NextResponse.json({ inserted: 0 });

  const { error } = await supabase.from("lesson_engagement_events").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inserted: rows.length });
}
