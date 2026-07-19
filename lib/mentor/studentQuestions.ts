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
  replies: QuestionReply[];
};

/** The student's own questions with their reply threads. */
export async function fetchMyQuestions(userId: string): Promise<Question[]> {
  const supabase = createClient();
  try {
    const { data: questions } = await withTimeout(
      supabase
        .from("lesson_questions")
        .select("id, lesson_id, lesson_title, body, resolved_at, created_at")
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
): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("lesson_questions").insert({
    student_id: userId,
    body: body.trim(),
    lesson_id: lessonId,
    lesson_title: lessonTitle,
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
