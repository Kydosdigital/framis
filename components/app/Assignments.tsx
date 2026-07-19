"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { fetchMyAssignments, submitAssignment, type StudentAssignment } from "@/lib/mentor/studentAssignments";

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function Assignments() {
  const userId = useFramis((st) => st.userId);
  const [items, setItems] = useState<StudentAssignment[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!userId) return;
    fetchMyAssignments(userId).then(setItems);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const startEdit = (a: StudentAssignment) => {
    setOpenId(a.id);
    setContent(a.submission?.content ?? "");
    setLinkUrl(a.submission?.linkUrl ?? "");
    setError(null);
  };

  const save = async (a: StudentAssignment) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    const res = await submitAssignment(userId, a.id, content, linkUrl, Boolean(a.submission));
    setSaving(false);
    if (res.ok) {
      setOpenId(null);
      load();
    } else setError(res.error);
  };

  if (items === null) {
    return <div className="text-[14px] text-ink-500">Loading assignments…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">ASSIGNMENTS</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Work from your mentor</h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Everything your mentor has set for you. Submit here and they&apos;ll see it straight away.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[12px] border border-line bg-card px-6 py-5 text-[14px] text-ink-500">
          No assignments yet. Your mentor will set work here after a session.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((a) => {
            const overdue = a.dueAt && !a.submission && new Date(a.dueAt).getTime() < Date.now();
            return (
              <li key={a.id} className="rounded-[12px] border border-line bg-card px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-inter text-[15px] font-semibold">{a.title}</div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                      a.submission?.reviewedAt
                        ? "bg-[#ECFDF5] text-[#059669]"
                        : a.submission
                          ? "bg-[#EFF6FF] text-[#0066CC]"
                          : overdue
                            ? "bg-[#FDF0F0] text-[#DC2626]"
                            : "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]"
                    }`}
                  >
                    {a.submission?.reviewedAt ? "reviewed" : a.submission ? "submitted" : overdue ? "overdue" : "to do"}
                  </span>
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink-500">
                  {a.mentorName ? `From ${a.mentorName} · ` : ""}set {fmt(a.createdAt)}
                  {a.dueAt ? ` · due ${fmt(a.dueAt)}` : ""}
                </div>

                {a.instructions && <p className="mt-3 whitespace-pre-wrap text-[13.5px]">{a.instructions}</p>}

                {a.submission && (
                  <div className="mt-3 rounded-[8px] border border-line px-3.5 py-3">
                    <div className="font-mono text-[11.5px] font-semibold text-ink-500">
                      YOUR SUBMISSION · {fmt(a.submission.submittedAt)}
                    </div>
                    {a.submission.content && <p className="mt-1.5 whitespace-pre-wrap text-[13.5px]">{a.submission.content}</p>}
                    {a.submission.linkUrl && (
                      <a href={a.submission.linkUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-[13px] font-medium text-blue">
                        {a.submission.linkUrl} ↗
                      </a>
                    )}
                  </div>
                )}

                {a.submission?.mentorFeedback && (
                  <div className="mt-3 rounded-[8px] bg-[#ECFDF5] px-3.5 py-3 text-[13.5px] text-[#065F46] dark:bg-[#0C2A20] dark:text-[#8FD9BC]">
                    <div className="font-mono text-[11.5px] font-semibold">MENTOR FEEDBACK</div>
                    <p className="mt-1 whitespace-pre-wrap">{a.submission.mentorFeedback}</p>
                  </div>
                )}

                {openId === a.id ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <label className="text-[13px] font-medium">
                      Your answer / notes
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
                      />
                    </label>
                    <label className="text-[13px] font-medium">
                      Link (GitHub, live URL — optional)
                      <input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://…"
                        className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
                      />
                    </label>
                    {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => save(a)}
                        disabled={saving}
                        className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
                      >
                        {saving ? "Submitting…" : a.submission ? "Resubmit" : "Submit"}
                      </button>
                      <button onClick={() => setOpenId(null)} className="rounded-[8px] border border-line px-4 py-2 text-[13px] font-semibold">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startEdit(a)} className="mt-4 w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white">
                    {a.submission ? "Edit submission" : "Submit work"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
