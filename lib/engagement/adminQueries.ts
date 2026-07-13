import { createClient } from "@/lib/supabase/server";
import { lookupLesson } from "./lessonLookup";
import { ROADMAP_MODULES } from "@/lib/data";

export type OverviewStats = {
  totalLearners: number;
  activeThisWeek: number;
  activeThisMonth: number;
  avgEngagementScore: number | null;
  phaseFunnel: { phase: number; learners: number }[];
  lowestEngagementLessons: { lessonId: string; title: string | null; moduleTitle: string | null; avgScore: number; visits: number }[];
};

const DAY_MS = 86_400_000;

/** Everything the `/admin` overview page needs, in as few round-trips as
 * the summary table allows. Reads only `lesson_engagement_summary` —
 * never the raw event table — to keep this fast regardless of volume. */
export async function fetchOverviewStats(): Promise<OverviewStats> {
  const supabase = createClient();

  const [{ count: totalLearners }, { data: summaryRows }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("lesson_engagement_summary")
      .select("user_id, lesson_id, phase, engagement_score, last_visited_at"),
  ]);

  const rows = summaryRows ?? [];
  const now = Date.now();
  const weekAgo = now - 7 * DAY_MS;
  const monthAgo = now - 30 * DAY_MS;

  const activeWeekUsers = new Set<string>();
  const activeMonthUsers = new Set<string>();
  const phaseLearners = new Map<number, Set<string>>();

  let scoreSum = 0;
  let scoreCount = 0;

  const perLesson = new Map<string, { sum: number; count: number }>();

  for (const row of rows) {
    const visitedAt = row.last_visited_at ? new Date(row.last_visited_at).getTime() : null;
    if (visitedAt && visitedAt >= weekAgo) activeWeekUsers.add(row.user_id);
    if (visitedAt && visitedAt >= monthAgo) activeMonthUsers.add(row.user_id);

    if (!phaseLearners.has(row.phase)) phaseLearners.set(row.phase, new Set());
    phaseLearners.get(row.phase)!.add(row.user_id);

    if (row.engagement_score != null) {
      scoreSum += row.engagement_score;
      scoreCount += 1;
    }

    const entry = perLesson.get(row.lesson_id) ?? { sum: 0, count: 0 };
    entry.sum += row.engagement_score ?? 0;
    entry.count += 1;
    perLesson.set(row.lesson_id, entry);
  }

  // "Reached phase N" is cumulative — a learner active in phase 3 has by
  // definition passed through phases 1-2, so the funnel counts anyone who
  // has touched phase P *or higher*, not only exactly P.
  const phaseFunnel = ROADMAP_MODULES.reduce<number[]>((acc, m) => (acc.includes(m.phase) ? acc : [...acc, m.phase]), [])
    .sort((a, b) => a - b)
    .map((phase) => {
      const learners = new Set<string>();
      for (const [p, users] of phaseLearners) {
        if (p >= phase) users.forEach((u) => learners.add(u));
      }
      return { phase, learners: learners.size };
    });

  const lowestEngagementLessons = Array.from(perLesson.entries())
    .map(([lessonId, { sum, count }]) => ({
      lessonId,
      avgScore: count ? Math.round((sum / count) * 10) / 10 : 0,
      visits: count,
    }))
    .filter((l) => l.visits >= 1)
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 10)
    .map((l) => {
      const meta = lookupLesson(l.lessonId);
      return { ...l, title: meta?.title ?? null, moduleTitle: meta?.moduleTitle ?? null };
    });

  return {
    totalLearners: totalLearners ?? 0,
    activeThisWeek: activeWeekUsers.size,
    activeThisMonth: activeMonthUsers.size,
    avgEngagementScore: scoreCount ? Math.round((scoreSum / scoreCount) * 10) / 10 : null,
    phaseFunnel,
    lowestEngagementLessons,
  };
}

export type LearnerDetail = {
  profile: { id: string; fullName: string | null; username: string; createdAt: string } | null;
  lessons: {
    lessonId: string;
    title: string | null;
    moduleTitle: string | null;
    totalTimeSeconds: number;
    maxScrollPct: number;
    quizBestScore: number | null;
    sandboxCompleted: boolean;
    engagementScore: number;
    lastVisitedAt: string | null;
  }[];
  avgEngagementScore: number | null;
  staleLearner: boolean;
};

export async function fetchLearnerDetail(userId: string): Promise<LearnerDetail> {
  const supabase = createClient();
  const [{ data: profile }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, username, created_at").eq("id", userId).maybeSingle(),
    supabase
      .from("lesson_engagement_summary")
      .select("lesson_id, total_time_seconds, max_scroll_pct, quiz_best_score, sandbox_completed, engagement_score, last_visited_at")
      .eq("user_id", userId)
      .order("last_visited_at", { ascending: false }),
  ]);

  const lessons = (rows ?? []).map((r) => {
    const meta = lookupLesson(r.lesson_id);
    return {
      lessonId: r.lesson_id,
      title: meta?.title ?? null,
      moduleTitle: meta?.moduleTitle ?? null,
      totalTimeSeconds: r.total_time_seconds,
      maxScrollPct: r.max_scroll_pct,
      quizBestScore: r.quiz_best_score,
      sandboxCompleted: r.sandbox_completed,
      engagementScore: r.engagement_score,
      lastVisitedAt: r.last_visited_at,
    };
  });

  const avgEngagementScore = lessons.length
    ? Math.round((lessons.reduce((sum, l) => sum + l.engagementScore, 0) / lessons.length) * 10) / 10
    : null;

  const mostRecent = lessons[0]?.lastVisitedAt ? new Date(lessons[0].lastVisitedAt).getTime() : null;
  const staleLearner = mostRecent != null ? Date.now() - mostRecent > 14 * DAY_MS : lessons.length === 0;

  return {
    profile: profile ? { id: profile.id, fullName: profile.full_name, username: profile.username, createdAt: profile.created_at } : null,
    lessons,
    avgEngagementScore,
    staleLearner,
  };
}

export type LessonDetail = {
  lessonId: string;
  title: string | null;
  moduleTitle: string | null;
  learnerCount: number;
  avgTimeSeconds: number | null;
  avgScrollPct: number | null;
  avgQuizScore: number | null;
  sandboxCompletionRate: number | null;
  quizAttemptRate: number | null;
};

export async function fetchLessonDetail(lessonId: string): Promise<LessonDetail> {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("lesson_engagement_summary")
    .select("total_time_seconds, max_scroll_pct, quiz_best_score, quiz_attempts, sandbox_completed")
    .eq("lesson_id", lessonId);

  const list = rows ?? [];
  const meta = lookupLesson(lessonId);
  const count = list.length;

  const avg = (values: number[]) => (values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null);

  return {
    lessonId,
    title: meta?.title ?? null,
    moduleTitle: meta?.moduleTitle ?? null,
    learnerCount: count,
    avgTimeSeconds: avg(list.map((r) => r.total_time_seconds)),
    avgScrollPct: avg(list.map((r) => r.max_scroll_pct)),
    avgQuizScore: avg(list.map((r) => r.quiz_best_score).filter((v): v is number => v != null)),
    sandboxCompletionRate: count ? Math.round((list.filter((r) => r.sandbox_completed).length / count) * 1000) / 10 : null,
    quizAttemptRate: count ? Math.round((list.filter((r) => r.quiz_attempts > 0).length / count) * 1000) / 10 : null,
  };
}

/** Gate for `/admin/*` — checks the signed-in user's `profiles.is_admin`. */
export async function currentUserIsAdmin(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  return Boolean(data?.is_admin);
}
