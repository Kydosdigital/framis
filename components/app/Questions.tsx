"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { fetchMyQuestions, askQuestion, replyToQuestion, setQuestionResolved, type Question } from "@/lib/mentor/studentQuestions";
import { resolveLesson } from "@/lib/lessons";

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function Questions() {
  const userId = useFramis((st) => st.userId);
  const activeLessonKey = useFramis((st) => st.activeLessonKey);
  const [items, setItems] = useState<Question[] | null>(null);
  const [body, setBody] = useState("");
  const [attachLesson, setAttachLesson] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  // If the learner is mid-lesson, offer to tag the question to it.
  const current = activeLessonKey ? resolveLesson(activeLessonKey.module, activeLessonKey.lessonIndex) : null;
  const currentLessonId = activeLessonKey ? `m${activeLessonKey.module}-l${activeLessonKey.lessonIndex}` : null;
  // LessonRef is a union — only the generic variant carries a title.
  const currentLessonTitle = current?.kind === "generic" ? current.data.title : null;

  const load = () => {
    if (!userId) return;
    fetchMyQuestions(userId).then(setItems);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const send = async () => {
    if (!userId || !body.trim()) return;
    setSending(true);
    setError(null);
    const res = await askQuestion(
      userId,
      body,
      attachLesson ? currentLessonId : null,
      attachLesson ? currentLessonTitle : null,
    );
    setSending(false);
    if (res.ok) {
      setBody("");
      load();
    } else setError(res.error);
  };

  const sendReply = async (questionId: string) => {
    if (!userId || !replyBody.trim()) return;
    const res = await replyToQuestion(userId, questionId, replyBody);
    if (res.ok) {
      setReplyBody("");
      setReplyFor(null);
      load();
    } else setError(res.error);
  };

  if (items === null) return <div className="text-[14px] text-ink-500">Loading questions…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">QUESTIONS</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Ask your mentor</h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Stuck on something? Ask here and your mentor will reply. Real answers from a person who knows where
          you&apos;re up to — not an autoresponder.
        </p>
      </div>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="What are you stuck on?"
          className="block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
        />
        {currentLessonId && (
          <label className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-500">
            <input type="checkbox" checked={attachLesson} onChange={(e) => setAttachLesson(e.target.checked)} />
            Attach the lesson I&apos;m on{currentLessonTitle ? ` (${currentLessonTitle})` : ""}
          </label>
        )}
        <button onClick={send} disabled={sending || !body.trim()} className="mt-3 rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
          {sending ? "Sending…" : "Ask"}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-[14px] text-ink-500">No questions yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((q) => (
            <li key={q.id} className="rounded-[12px] border border-line bg-card px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-[11.5px] font-semibold text-ink-500">
                  {q.lessonTitle ? q.lessonTitle.toUpperCase() : "GENERAL"} · {fmt(q.createdAt)}
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                    q.resolvedAt ? "bg-[#ECFDF5] text-[#059669]" : q.replies.length ? "bg-[#EFF6FF] text-[#0066CC]" : "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]"
                  }`}
                >
                  {q.resolvedAt ? "resolved" : q.replies.length ? "answered" : "waiting"}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[13.5px]">{q.body}</p>

              {q.replies.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2 border-l-2 border-line pl-3">
                  {q.replies.map((r) => (
                    <li key={r.id} className="text-[13.5px]">
                      <div className="font-mono text-[11.5px] text-ink-500">
                        {r.authorId === userId ? "You" : r.authorName ?? "Mentor"} · {fmt(r.createdAt)}
                      </div>
                      <p className="mt-0.5 whitespace-pre-wrap">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {replyFor === q.id ? (
                  <div className="flex w-full flex-col gap-2">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      rows={2}
                      placeholder="Add to this thread…"
                      className="block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => sendReply(q.id)} className="rounded-[8px] bg-blue px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
                        Send
                      </button>
                      <button onClick={() => setReplyFor(null)} className="rounded-[8px] border border-line px-3.5 py-1.5 text-[12.5px] font-semibold">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { setReplyFor(q.id); setReplyBody(""); }} className="text-[12.5px] font-medium text-blue hover:underline">
                      Reply
                    </button>
                    <button
                      onClick={async () => {
                        await setQuestionResolved(q.id, !q.resolvedAt);
                        load();
                      }}
                      className="text-[12.5px] font-medium text-ink-500 hover:text-ink-900"
                    >
                      {q.resolvedAt ? "Reopen" : "Mark resolved"}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
