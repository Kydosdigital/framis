import { createClient } from "./supabase/client";
import { withTimeout } from "./timeout";

export type LearnerStats = {
  weekNumber: number;
  totalLessons: number;
  completedLessons: number;
  nextLessonModuleNumber: number | null;
  completedModuleNumbers: number[];
  totalCapstones: number;
  shippedCapstones: number;
  capstoneStatus: "not_started" | "submitted" | "under_review" | "passed";
  /** slugs of every project this learner has a non-draft submission for. */
  shippedCapstoneSlugs: string[];
  /** real per-project status, keyed by slug — for capstones with no submission yet, look up "not_started" as the default. */
  capstoneStatusBySlug: Record<string, "not_started" | "submitted" | "under_review" | "passed">;
  pendingReviews: number;
  currentStreak: number;
  longestStreak: number;
};

const EMPTY_STATS: LearnerStats = {
  weekNumber: 1,
  totalLessons: 0,
  completedLessons: 0,
  nextLessonModuleNumber: 2,
  completedModuleNumbers: [],
  totalCapstones: 0,
  shippedCapstones: 0,
  capstoneStatus: "not_started",
  shippedCapstoneSlugs: [],
  capstoneStatusBySlug: {},
  pendingReviews: 0,
  currentStreak: 0,
  longestStreak: 0,
};

function computeStreaks(dates: string[]): { current: number; longest: number } {
  const days = Array.from(new Set(dates.map((d) => d.slice(0, 10)))).sort();
  if (!days.length) return { current: 0, longest: 0 };

  const dayMs = 86400000;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / dayMs;
    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayMs = new Date(today).getTime();
  const lastDayMs = new Date(days[days.length - 1]).getTime();
  const daysSinceLast = (todayMs - lastDayMs) / dayMs;
  let current = 0;
  if (daysSinceLast <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const gap = (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / dayMs;
      if (gap === 1) current++;
      else break;
    }
  }
  return { current, longest };
}

/** Fetches real progress for the signed-in learner — no fabricated numbers. */
export async function fetchLearnerStats(userId: string): Promise<LearnerStats> {
  const supabase = createClient();

  try {
    const [profileRes, lessonsRes, progressRes, projectsRes, submissionsRes, reviewsRes] = await withTimeout(
      Promise.all([
        supabase.from("profiles").select("created_at").eq("id", userId).maybeSingle(),
        supabase.from("lessons").select("id, modules(module_number)").order("order_index"),
        supabase.from("user_progress").select("lesson_id, status, started_at, completed_at").eq("user_id", userId),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("project_submissions")
          .select("status, submitted_at, projects(slug)")
          .eq("user_id", userId)
          .order("submitted_at", { ascending: false }),
        supabase
          .from("review_assignments")
          .select("id", { count: "exact", head: true })
          .eq("reviewer_id", userId)
          .eq("status", "pending"),
      ]),
      8000,
    );

    const createdAt = profileRes.data?.created_at;
    const weekNumber = createdAt
      ? Math.min(64, Math.max(1, Math.ceil((Date.now() - new Date(createdAt).getTime()) / (7 * 86400000)) + 1))
      : 1;

    const lessons = lessonsRes.data ?? [];
    const totalLessons = lessons.length;
    const progress = progressRes.data ?? [];
    const completedLessons = progress.filter((p) => p.status === "completed").length;

    const completedLessonIds = new Set(progress.filter((p) => p.status === "completed").map((p) => p.lesson_id));
    const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id));
    const nextModule = nextLesson && !Array.isArray(nextLesson.modules) ? nextLesson.modules : null;
    const nextLessonModuleNumber = nextModule?.module_number ?? null;
    const completedModuleNumbers = lessons
      .filter((l) => completedLessonIds.has(l.id))
      .map((l) => (!Array.isArray(l.modules) ? l.modules?.module_number : null))
      .filter((n): n is number => n != null);

    const totalCapstones = projectsRes.count ?? 0;
    const submissions = submissionsRes.data ?? [];
    const shippedSubmissions = submissions.filter((s) => s.status !== "draft");
    const shippedCapstones = shippedSubmissions.length;
    const capstoneStatus = (submissions[0]?.status as LearnerStats["capstoneStatus"]) ?? "not_started";
    const shippedCapstoneSlugs = shippedSubmissions
      .map((s) => (!Array.isArray(s.projects) ? s.projects?.slug : null))
      .filter((slug): slug is string => Boolean(slug));
    const capstoneStatusBySlug: LearnerStats["capstoneStatusBySlug"] = {};
    for (const sub of submissions) {
      const slug = !Array.isArray(sub.projects) ? sub.projects?.slug : null;
      if (slug && !(slug in capstoneStatusBySlug)) {
        capstoneStatusBySlug[slug] = sub.status as LearnerStats["capstoneStatus"];
      }
    }

    const activeDates = [
      ...progress.flatMap((p) => [p.started_at, p.completed_at].filter(Boolean) as string[]),
      ...submissions.map((s) => s.submitted_at).filter(Boolean),
    ] as string[];
    const { current, longest } = computeStreaks(activeDates);

    return {
      weekNumber,
      totalLessons,
      completedLessons,
      nextLessonModuleNumber,
      completedModuleNumbers,
      totalCapstones,
      shippedCapstones,
      capstoneStatus,
      shippedCapstoneSlugs,
      capstoneStatusBySlug,
      pendingReviews: reviewsRes.count ?? 0,
      currentStreak: current,
      longestStreak: longest,
    };
  } catch {
    return EMPTY_STATS;
  }
}
