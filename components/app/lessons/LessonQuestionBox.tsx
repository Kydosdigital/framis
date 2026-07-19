"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { fetchQuestionsForLesson, fetchMyMentors, askQuestion, type Question, type MyMentor } from "@/lib/mentor/studentQuestions";

/** Inline "ask about this lesson" box, shown at the bottom of every lesson.
 *
 * Writes to the same `lesson_questions` tables as the Ask-a-question tab,
 * tagged with this lesson's engagement id — so a question asked here shows
 * up in the student's Questions tab and in their mentor's inbox with the
 * lesson name attached, rather than as a context-free message. */
export default function LessonQuestionBox({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  const userId = useFramis((st) => st.userId);
  const goTab = useFramis((st) => st.goTab);
  const [items, setItems] = useState<Question[] | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentors, setMentors] = useState<MyMentor[]>([]);
  const [assignTo, setAssignTo] = useState("");

  const load = () => {
    if (!userId) return;
    fetchQuestionsForLesson(userId, lessonId).then(setItems);
  };

  useEffect(() => {
    load();
    if (userId) {
      fetchMyMentors(userId).then((m) => {
        setMentors(m);
        if (m.length === 1) setAssignTo(m[0].id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, lessonId]);

  // Signed-out preview of a lesson — nothing to ask against.
  if (!userId) return null;

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    const res = await askQuestion(userId, body, lessonId, lessonTitle, assignTo || null);
    setSending(false);
    if (res.ok) {
      setBody("");
      setSent(true);
      setTimeout(() => setSent(false), 2500);
      load();
    } else setError(res.error);
  };

  const answered = (items ?? []).filter((q) => q.replies.length > 0).length;

  return (
    <div className="mb-8 rounded-[12px] border border-line bg-card px-6 py-5">
      <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">STUCK ON THIS LESSON?</div>
      <p className="mb-3 text-[13.5px] text-ink-500">
        Ask your mentor about <span className="font-medium">{lessonTitle}</span>. They&apos;ll see which lesson you
        were on when you asked.
      </p>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="What isn't making sense?"
        className="block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
      />

      {error && <div className="mt-2 rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {mentors.length > 1 && (
        <label className="mt-2 block text-[12.5px] text-ink-500">
          Send to
          <select
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            className="ml-2 rounded-[8px] border border-line bg-transparent px-2 py-1.5 text-[13px]"
          >
            <option value="">Any of my mentors</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={send}
          disabled={sending || !body.trim()}
          className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending…" : "Ask your mentor"}
        </button>
        {sent && <span className="text-[13px] font-medium text-success">Sent — your mentor will reply.</span>}
        {items && items.length > 0 && (
          <button onClick={() => goTab("questions")} className="text-[12.5px] font-medium text-blue hover:underline">
            See all your questions{answered ? ` (${answered} answered)` : ""} →
          </button>
        )}
      </div>

      {items && items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
          {items.map((q) => (
            <li key={q.id} className="text-[13.5px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11.5px] text-ink-500">
                  You asked · {new Date(q.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    q.resolvedAt
                      ? "bg-[#ECFDF5] text-[#059669]"
                      : q.replies.length
                        ? "bg-[#EFF6FF] text-[#0066CC]"
                        : "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]"
                  }`}
                >
                  {q.resolvedAt ? "resolved" : q.replies.length ? "answered" : "waiting"}
                </span>
              </div>
              <p className="mt-0.5 whitespace-pre-wrap">{q.body}</p>
              {q.replies.map((r) => (
                <div key={r.id} className="mt-1.5 border-l-2 border-line pl-3">
                  <div className="font-mono text-[11.5px] text-ink-500">{r.authorName ?? "Mentor"}</div>
                  <p className="mt-0.5 whitespace-pre-wrap">{r.body}</p>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
