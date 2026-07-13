"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";
import { lookupLesson } from "./lessonLookup";

export type WeeklyTime = { weekLabel: string; seconds: number };

export type EngagementReport = {
  avgEngagementScore: number | null;
  interpretation: string;
  quizTrend: { lessonTitle: string; score: number }[];
  weeklyTimeSeconds: WeeklyTime[];
  engagementDropped: boolean;
  sandboxGapCount: number;
  strengths: string[];
  gaps: string[];
};

const WEEK_MS = 7 * 86_400_000;

/** Honest, in-app parent/learner engagement report — real numbers, no
 * fabricated positivity (spec §5). Reads only the current user's own
 * rows (enforced by RLS regardless). */
export async function fetchEngagementReport(userId: string): Promise<EngagementReport> {
  const supabase = createClient();

  const [{ data: summaryRows }, { data: eventRows }] = await withTimeout(
    Promise.all([
      supabase
        .from("lesson_engagement_summary")
        .select("lesson_id, engagement_score, quiz_best_score, sandbox_attempted, sandbox_completed, last_visited_at")
        .eq("user_id", userId)
        .order("last_visited_at", { ascending: false }),
      supabase
        .from("lesson_engagement_events")
        .select("created_at, event_value")
        .eq("user_id", userId)
        .eq("event_type", "page_view")
        .gte("created_at", new Date(Date.now() - 4 * WEEK_MS).toISOString()),
    ]),
    8000,
  );

  const summary = summaryRows ?? [];
  const avgEngagementScore = summary.length
    ? Math.round((summary.reduce((sum, r) => sum + (r.engagement_score ?? 0), 0) / summary.length) * 10) / 10
    : null;

  const interpretation = interpretScore(avgEngagementScore, summary);

  const quizTrend = summary
    .filter((r) => r.quiz_best_score != null)
    .slice(0, 8)
    .reverse()
    .map((r) => ({ lessonTitle: lookupLesson(r.lesson_id)?.title ?? r.lesson_id, score: r.quiz_best_score as number }));

  const recentLessons = summary.slice(0, 3);
  const sandboxGapCount = recentLessons.filter((r) => !r.sandbox_completed).length;

  const weeklyTimeSeconds = bucketByWeek(eventRows ?? []);
  const engagementDropped = hasEngagementDropped(weeklyTimeSeconds);

  const strengths: string[] = [];
  const gaps: string[] = [];
  const quizScores = summary.map((r) => r.quiz_best_score).filter((v): v is number => v != null);
  const avgQuiz = quizScores.length ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : null;
  if (avgQuiz != null && avgQuiz >= 70) strengths.push(`Strong quiz scores — averaging ${Math.round(avgQuiz)}%`);
  if (sandboxGapCount >= 3) gaps.push(`Hasn't attempted the sandbox on the last ${sandboxGapCount} lessons`);
  const attemptedSandbox = summary.filter((r) => r.sandbox_attempted).length;
  if (summary.length && attemptedSandbox / summary.length >= 0.8) strengths.push("Consistently tries the hands-on sandbox");
  if (avgQuiz != null && avgQuiz < 50) gaps.push(`Quiz scores are low — averaging ${Math.round(avgQuiz)}%`);

  return {
    avgEngagementScore,
    interpretation,
    quizTrend,
    weeklyTimeSeconds,
    engagementDropped,
    sandboxGapCount,
    strengths,
    gaps,
  };
}

function interpretScore(score: number | null, summary: { sandbox_attempted: boolean; quiz_best_score: number | null }[]): string {
  if (score == null) return "No lessons visited yet.";
  const lowSandboxAndQuiz = summary.length > 0 && summary.every((r) => !r.sandbox_attempted && r.quiz_best_score == null);
  if (score >= 70) return "Actively working through material — strong engagement across lessons.";
  if (score >= 40) return "Steady but uneven engagement — some lessons are getting more attention than others.";
  if (lowSandboxAndQuiz) return "Mostly skimming — sandbox and quiz attempts are low.";
  return "Engagement is low right now — worth checking in.";
}

function weekLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function bucketByWeek(events: { created_at: string; event_value: unknown }[]): WeeklyTime[] {
  const buckets: WeeklyTime[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(Date.now() - (i + 1) * WEEK_MS);
    buckets.push({ weekLabel: weekLabel(start), seconds: 0 });
  }
  for (const ev of events) {
    const t = new Date(ev.created_at).getTime();
    const weeksAgo = Math.floor((Date.now() - t) / WEEK_MS);
    const idx = 3 - weeksAgo;
    if (idx < 0 || idx > 3) continue;
    const seconds = typeof ev.event_value === "object" && ev.event_value && "seconds" in ev.event_value ? Number((ev.event_value as { seconds?: number }).seconds ?? 0) : 0;
    buckets[idx].seconds += seconds;
  }
  return buckets;
}

function hasEngagementDropped(weeks: WeeklyTime[]): boolean {
  if (weeks.length < 4) return false;
  const [w1, w2, w3, w4] = weeks;
  const recent = w3.seconds + w4.seconds;
  const earlier = w1.seconds + w2.seconds;
  return earlier > 0 && recent < earlier * 0.4;
}
