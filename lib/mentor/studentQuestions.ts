"use client";

import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

export type QuestionReply = { id: string; authorId: string; authorName: string | null; body: string; createdAt: string };
export type Question = {
  id: string;
  lessonId: string | null;
  lessonTitle: string | null;
  body: string;
  resolvedAt: string | null;
  createdAt: string;
  assignedMentorId: string | null;
  replies: QuestionReply[];
};

export type MyMentor = { id: string; name: string };

/** The student's active mentors — the choices when addressing a question. */
export async function fetchMyMentors(userId: string): Promise<MyMentor[]> {
  const supabase = createClient();
  try {
    const { data } = await withTimeout(
      supabase
        .from("mentor_assignments")
        .select("mentor_id, profiles!mentor_assignments_mentor_id_fkey(full_name, username)")
        .eq("student_id", userId)
        .eq("active", true)
        .order("assigned_at", { ascending: true }),
      8000,
    );
    return (data ?? []).map((a) => {
      const p = (Array.isArray(a.profiles) ? a.profiles[0] : a.profiles) as
        | { full_name: string | null; username: string }
        | null;
      return { id: a.mentor_id, name: p?.full_name ?? p?.username ?? "Mentor" };
    });
  } catch {
    return [];
  }
}

/** The student's own questions with their reply threads. */
export async function fetchMyQuestions(userId: string): Promise<Question[]> {
  const supabase = createClient();
  try {
    const { data: questions } = await withTimeout(
      supabase
        .from("lesson_questions")
        .select("id, lesson_id, lesson_title, body, resolved_at, assigned_mentor_id, created_at")
        .eq("student_id", userId)
        .order("created_at", { ascending: false }),
      8000,
    );
    const ids = (questions ?? []).map((q) => q.id);
    const { data: replies } = await supabase
      .from("lesson_question_replies")
      .select("id, question_id, author_id, body, created_at, profiles(full_name, username)")
      .in("question_id", ids)
      .order("created_at", { ascending: true });

    const byQuestion = new Map<string, QuestionReply[]>();
    for (const r of replies ?? []) {
      const p = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as
        | { full_name: string | null; username: string }
        | null;
      const list = byQuestion.get(r.question_id) ?? [];
      list.push({
        id: r.id,
        authorId: r.author_id,
        authorName: p?.full_name ?? p?.username ?? null,
        body: r.body,
        createdAt: r.created_at,
      });
      byQuestion.set(r.question_id, list);
    }

    return (questions ?? []).map((q) => ({
      id: q.id,
      lessonId: q.lesson_id,
      lessonTitle: q.lesson_title,
      body: q.body,
      resolvedAt: q.resolved_at,
      createdAt: q.created_at,
      assignedMentorId: q.assigned_mentor_id,
      replies: byQuestion.get(q.id) ?? [],
    }));
  } catch {
    return [];
  }
}

/** The student's questions for one specific lesson — powers the inline
 * "ask about this lesson" box. Same tables as the Questions tab, just
 * filtered by lesson_id, so anything asked here shows up there too. */
export async function fetchQuestionsForLesson(userId: string, lessonId: string): Promise<Question[]> {
  const supabase = createClient();
  try {
    const { data: questions } = await withTimeout(
      supabase
        .from("lesson_questions")
        .select("id, lesson_id, lesson_title, body, resolved_at, assigned_mentor_id, created_at")
        .eq("student_id", userId)
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false }),
      8000,
    );
    const ids = (questions ?? []).map((q) => q.id);
    if (!ids.length) return [];

    const { data: replies } = await supabase
      .from("lesson_question_replies")
      .select("id, question_id, author_id, body, created_at, profiles(full_name, username)")
      .in("question_id", ids)
      .order("created_at", { ascending: true });

    const byQuestion = new Map<string, QuestionReply[]>();
    for (const r of replies ?? []) {
      const p = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as
        | { full_name: string | null; username: string }
        | null;
      const list = byQuestion.get(r.question_id) ?? [];
      list.push({
        id: r.id,
        authorId: r.author_id,
        authorName: p?.full_name ?? p?.username ?? null,
        body: r.body,
        createdAt: r.created_at,
      });
      byQuestion.set(r.question_id, list);
    }

    return (questions ?? []).map((q) => ({
      id: q.id,
      lessonId: q.lesson_id,
      lessonTitle: q.lesson_title,
      body: q.body,
      resolvedAt: q.resolved_at,
      createdAt: q.created_at,
      assignedMentorId: q.assigned_mentor_id,
      replies: byQuestion.get(q.id) ?? [],
    }));
  } catch {
    return [];
  }
}

type Result = { ok: true } | { ok: false; error: string };

export async function askQuestion(
  userId: string,
  body: string,
  lessonId: string | null,
  lessonTitle: string | null,
  assignedMentorId?: string | null,
): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("lesson_questions").insert({
    student_id: userId,
    body: body.trim(),
    lesson_id: lessonId,
    lesson_title: lessonTitle,
    assigned_mentor_id: assignedMentorId ?? null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function replyToQuestion(userId: string, questionId: string, body: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("lesson_question_replies")
    .insert({ question_id: questionId, author_id: userId, body: body.trim() });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function setQuestionResolved(questionId: string, resolved: boolean): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("lesson_questions")
    .update({ resolved_at: resolved ? new Date().toISOString() : null })
    .eq("id", questionId);
  return error ? { ok: false, error: error.message } : { ok: true };
}
