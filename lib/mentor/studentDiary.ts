"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

export type StudentPlan = { mission: string; vision: string; howToAchieve: string };
export type StudentGoal = {
  id: string;
  title: string;
  detail: string | null;
  progressPct: number;
  targetDate: string | null;
  achievedAt: string | null;
};
export type DiaryEntry = {
  id: string;
  learnt: string | null;
  stuckOn: string | null;
  note: string | null;
  entryDate: string;
};

export type DiaryData = { plan: StudentPlan; goals: StudentGoal[]; entries: DiaryEntry[] };

const EMPTY_PLAN: StudentPlan = { mission: "", vision: "", howToAchieve: "" };

/** The student's own diary: plan, goals and log entries. RLS keeps this to
 * their own rows (their assigned mentors can read it, nobody else). */
export async function fetchDiary(userId: string): Promise<DiaryData> {
  const supabase = createClient();
  try {
    const [{ data: plan }, { data: goals }, { data: entries }] = await withTimeout(
      Promise.all([
        supabase.from("student_plan").select("mission, vision, how_to_achieve").eq("student_id", userId).maybeSingle(),
        supabase
          .from("student_goals")
          .select("id, title, detail, progress_pct, target_date, achieved_at")
          .eq("student_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("diary_entries")
          .select("id, learnt, stuck_on, note, entry_date")
          .eq("student_id", userId)
          .order("entry_date", { ascending: false })
          .limit(30),
      ]),
      8000,
    );

    return {
      plan: plan
        ? { mission: plan.mission ?? "", vision: plan.vision ?? "", howToAchieve: plan.how_to_achieve ?? "" }
        : EMPTY_PLAN,
      goals: (goals ?? []).map((g) => ({
        id: g.id,
        title: g.title,
        detail: g.detail,
        progressPct: g.progress_pct,
        targetDate: g.target_date,
        achievedAt: g.achieved_at,
      })),
      entries: (entries ?? []).map((e) => ({
        id: e.id,
        learnt: e.learnt,
        stuckOn: e.stuck_on,
        note: e.note,
        entryDate: e.entry_date,
      })),
    };
  } catch {
    return { plan: EMPTY_PLAN, goals: [], entries: [] };
  }
}

type Result = { ok: true } | { ok: false; error: string };

export async function savePlan(userId: string, plan: StudentPlan): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("student_plan").upsert(
    {
      student_id: userId,
      mission: plan.mission.trim() || null,
      vision: plan.vision.trim() || null,
      how_to_achieve: plan.howToAchieve.trim() || null,
    },
    { onConflict: "student_id" },
  );
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function addGoal(userId: string, title: string, detail: string, targetDate: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("student_goals").insert({
    student_id: userId,
    title: title.trim(),
    detail: detail.trim() || null,
    target_date: targetDate || null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function setGoalProgress(goalId: string, progressPct: number): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("student_goals")
    .update({ progress_pct: progressPct, achieved_at: progressPct >= 100 ? new Date().toISOString() : null })
    .eq("id", goalId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteGoal(goalId: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("student_goals").delete().eq("id", goalId);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function addDiaryEntry(userId: string, learnt: string, stuckOn: string, note: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("diary_entries").insert({
    student_id: userId,
    learnt: learnt.trim() || null,
    stuck_on: stuckOn.trim() || null,
    note: note.trim() || null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}
