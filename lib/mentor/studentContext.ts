import { createClient } from "@/lib/supabase/server";

export type MentorViewGoal = { id: string; title: string; detail: string | null; progressPct: number; targetDate: string | null; achievedAt: string | null };
export type MentorViewDiaryEntry = { id: string; learnt: string | null; stuckOn: string | null; note: string | null; entryDate: string };
export type MentorViewQuestion = {
  id: string;
  lessonTitle: string | null;
  body: string;
  createdAt: string;
  resolvedAt: string | null;
  assignedMentorId: string | null;
  replies: { id: string; authorId: string; body: string; createdAt: string }[];
};

export type StudentContext = {
  plan: { mission: string | null; vision: string | null; howToAchieve: string | null } | null;
  goals: MentorViewGoal[];
  entries: MentorViewDiaryEntry[];
  questions: MentorViewQuestion[];
};

/** The student's own written context — plan, goals, diary and questions —
 * as their mentor sees it. Read-only by RLS: the diary and goals are the
 * student's space; the mentor can reply to questions but never edit the
 * rest. */
export async function fetchStudentContext(studentId: string): Promise<StudentContext> {
  const supabase = createClient();

  const [{ data: plan }, { data: goals }, { data: entries }, { data: questions }] = await Promise.all([
    supabase.from("student_plan").select("mission, vision, how_to_achieve").eq("student_id", studentId).maybeSingle(),
    supabase
      .from("student_goals")
      .select("id, title, detail, progress_pct, target_date, achieved_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
    supabase
      .from("diary_entries")
      .select("id, learnt, stuck_on, note, entry_date")
      .eq("student_id", studentId)
      .order("entry_date", { ascending: false })
      .limit(20),
    supabase
      .from("lesson_questions")
      .select("id, lesson_title, body, created_at, resolved_at, assigned_mentor_id")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
  ]);

  const questionIds = (questions ?? []).map((q) => q.id);
  const { data: replies } = questionIds.length
    ? await supabase
        .from("lesson_question_replies")
        .select("id, question_id, author_id, body, created_at")
        .in("question_id", questionIds)
        .order("created_at", { ascending: true })
    : { data: [] as { id: string; question_id: string; author_id: string; body: string; created_at: string }[] };

  const repliesByQuestion = new Map<string, MentorViewQuestion["replies"]>();
  for (const r of replies ?? []) {
    const list = repliesByQuestion.get(r.question_id) ?? [];
    list.push({ id: r.id, authorId: r.author_id, body: r.body, createdAt: r.created_at });
    repliesByQuestion.set(r.question_id, list);
  }

  return {
    plan: plan ? { mission: plan.mission, vision: plan.vision, howToAchieve: plan.how_to_achieve } : null,
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
    questions: (questions ?? []).map((q) => ({
      id: q.id,
      lessonTitle: q.lesson_title,
      body: q.body,
      createdAt: q.created_at,
      resolvedAt: q.resolved_at,
      assignedMentorId: q.assigned_mentor_id,
      replies: repliesByQuestion.get(q.id) ?? [],
    })),
  };
}
