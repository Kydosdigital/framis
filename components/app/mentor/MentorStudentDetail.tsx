"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import LessonEngagementTable, { type LessonEngagementRow } from "@/components/app/engagement/LessonEngagementTable";
import {
  scheduleSession,
  logSession,
  sendMessage,
  createAssignment,
  reviewSubmission,
  type ActionResult,
} from "@/app/mentor/actions";
import type { SessionRecord, MessageRecord } from "@/lib/mentor/queries";
import type { StudentTrack } from "@/lib/mentor/track";
import type { AssignmentRecord } from "@/lib/mentor/assignments";

type Tab = "engagement" | "sessions" | "assignments" | "curriculum" | "messages";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-[#ECFDF5] text-[#059669]",
  scheduled: "bg-[#EFF6FF] text-[#0066CC]",
  cancelled: "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]",
  no_show: "bg-[#FDF0F0] text-[#DC2626]",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function MentorStudentDetail({
  studentId,
  lessons,
  avgEngagementScore,
  sessions,
  messages,
  currentUserId,
  track,
  trackSessionOptions,
  isEnrolled,
  assignments,
}: {
  studentId: string;
  lessons: LessonEngagementRow[];
  avgEngagementScore: number | null;
  sessions: SessionRecord[];
  messages: MessageRecord[];
  currentUserId: string;
  track: StudentTrack | null;
  trackSessionOptions: { id: string; label: string }[];
  isEnrolled: boolean;
  assignments: AssignmentRecord[];
}) {
  const [tab, setTab] = useState<Tab>("engagement");

  const awaitingReview = assignments.filter((a) => a.submission && !a.submission.reviewedAt).length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "engagement", label: "Engagement" },
    { key: "sessions", label: `Sessions (${sessions.length})` },
    { key: "assignments", label: `Assignments (${assignments.length})${awaitingReview ? ` · ${awaitingReview} to review` : ""}` },
    { key: "curriculum", label: "Curriculum" },
    { key: "messages", label: `Messages (${messages.length})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-[13.5px] font-medium transition-colors ${
              tab === t.key ? "border-blue text-blue" : "border-transparent text-ink-500 hover:text-ink-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "engagement" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-[12px] border border-line bg-card px-6 py-5">
            <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">AVERAGE ENGAGEMENT SCORE</div>
            <div className="font-inter text-[28px] font-bold">
              {avgEngagementScore != null ? `${avgEngagementScore} / 100` : "No lessons visited yet"}
            </div>
          </div>
          <div className="rounded-[12px] border border-line bg-card px-6 py-5">
            <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">PER-LESSON ENGAGEMENT</div>
            <div className="overflow-x-auto">
              <LessonEngagementTable lessons={lessons} />
            </div>
          </div>
        </div>
      )}

      {tab === "sessions" && (
        <SessionsTab studentId={studentId} sessions={sessions} trackSessionOptions={trackSessionOptions} />
      )}

      {tab === "assignments" && (
        <AssignmentsTab studentId={studentId} assignments={assignments} trackSessionOptions={trackSessionOptions} />
      )}

      {tab === "curriculum" && <CurriculumTab track={track} isEnrolled={isEnrolled} />}

      {tab === "messages" && <MessagesTab studentId={studentId} messages={messages} currentUserId={currentUserId} />}
    </div>
  );
}

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (fn: () => Promise<ActionResult>, onOk?: () => void) => {
    setError(null);
    start(async () => {
      const res = await fn();
      if (res.ok) {
        onOk?.();
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };
  return { pending, error, run };
}

function SessionsTab({
  studentId,
  sessions,
  trackSessionOptions,
}: {
  studentId: string;
  sessions: SessionRecord[];
  trackSessionOptions: { id: string; label: string }[];
}) {
  const [mode, setMode] = useState<"none" | "schedule" | "log">("none");
  const { pending, error, run } = useAction();

  const submitSchedule = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    fd.set("studentId", studentId);
    run(() => scheduleSession(fd), () => { form.reset(); setMode("none"); });
  };
  const submitLog = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    fd.set("studentId", studentId);
    run(() => logSession(fd), () => { form.reset(); setMode("none"); });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <button onClick={() => setMode(mode === "schedule" ? "none" : "schedule")} className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white">
          Schedule session
        </button>
        <button onClick={() => setMode(mode === "log" ? "none" : "log")} className="rounded-[8px] border border-line px-4 py-2 text-[13px] font-semibold">
          Log a completed session
        </button>
      </div>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {mode === "schedule" && (
        <form
          onSubmit={(e) => { e.preventDefault(); submitSchedule(e.currentTarget); }}
          className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5"
        >
          <div className="font-mono text-[12px] font-semibold text-ink-500">SCHEDULE A SESSION</div>
          <label className="text-[13px] font-medium">
            Date &amp; time
            <input type="datetime-local" name="scheduledAt" required className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Duration (minutes)
            <input type="number" name="durationMinutes" defaultValue={30} min={1} className="mt-1 block w-40 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <button disabled={pending} className="mt-1 w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
            {pending ? "Saving…" : "Schedule"}
          </button>
        </form>
      )}

      {mode === "log" && (
        <form
          onSubmit={(e) => { e.preventDefault(); submitLog(e.currentTarget); }}
          className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5"
        >
          <div className="font-mono text-[12px] font-semibold text-ink-500">LOG A COMPLETED SESSION</div>
          <div className="flex flex-wrap gap-3">
            <label className="text-[13px] font-medium">
              When it happened
              <input type="datetime-local" name="scheduledAt" required className="mt-1 block rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
            </label>
            <label className="text-[13px] font-medium">
              Duration (min)
              <input type="number" name="durationMinutes" defaultValue={30} min={1} className="mt-1 block w-28 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
            </label>
          </div>
          <label className="text-[13px] font-medium">
            Which curriculum session did this cover?
            <select name="trackSessionId" className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" disabled={trackSessionOptions.length === 0}>
              <option value="">{trackSessionOptions.length === 0 ? "No track sessions yet" : "— none —"}</option>
              {trackSessionOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-[12px] text-ink-500">Linking a session auto-updates the student&apos;s curriculum progress.</span>
          </label>
          <label className="text-[13px] font-medium">
            Teams recording URL
            <input type="url" name="recordingUrl" placeholder="https://…" className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Teams / Copilot summary (pasted, raw)
            <textarea name="aiGeneratedSummary" rows={3} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Your private notes (never shown to the student)
            <textarea name="privateNotes" rows={3} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Shareable summary (parent / student visible)
            <textarea name="studentSummary" rows={3} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <button disabled={pending} className="mt-1 w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
            {pending ? "Saving…" : "Save session"}
          </button>
        </form>
      )}

      {sessions.length === 0 ? (
        <p className="text-[14px] text-ink-500">No sessions yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => (
            <li key={s.id} className="rounded-[12px] border border-line bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="font-inter text-[14px] font-semibold">{fmt(s.scheduledAt)}</div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_STYLES[s.status] ?? "bg-[#F1F3F6] text-ink-500"}`}>
                  {s.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-500">{s.durationMinutes} min{s.trackSessionLabel ? ` · ${s.trackSessionLabel}` : ""}</div>
              {s.studentSummary && (
                <p className="mt-2 text-[13.5px]"><span className="font-medium">Shared summary:</span> {s.studentSummary}</p>
              )}
              {s.privateNotes && (
                <p className="mt-2 rounded-[8px] bg-[#FFFBEB] px-3 py-2 text-[13px] text-[#92400E] dark:bg-[#2A2410] dark:text-[#D4B78A]">
                  <span className="font-medium">Private notes:</span> {s.privateNotes}
                </p>
              )}
              {s.recordingUrl && (
                <a href={s.recordingUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px] font-medium text-blue">
                  Recording ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AssignmentsTab({
  studentId,
  assignments,
  trackSessionOptions,
}: {
  studentId: string;
  assignments: AssignmentRecord[];
  trackSessionOptions: { id: string; label: string }[];
}) {
  const [creating, setCreating] = useState(false);
  const { pending, error, run } = useAction();

  const submitNew = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    fd.set("studentId", studentId);
    run(() => createAssignment(fd), () => { form.reset(); setCreating(false); });
  };

  const submitReview = (form: HTMLFormElement, assignmentId: string) => {
    const fd = new FormData(form);
    fd.set("studentId", studentId);
    fd.set("assignmentId", assignmentId);
    run(() => reviewSubmission(fd));
  };

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => setCreating(!creating)} className="w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white">
        {creating ? "Cancel" : "Set an assignment"}
      </button>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {creating && (
        <form
          onSubmit={(e) => { e.preventDefault(); submitNew(e.currentTarget); }}
          className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5"
        >
          <div className="font-mono text-[12px] font-semibold text-ink-500">NEW ASSIGNMENT</div>
          <label className="text-[13px] font-medium">
            Title
            <input name="title" required placeholder="e.g. Build the login form" className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Instructions / notes for the student
            <textarea name="instructions" rows={5} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="text-[13px] font-medium">
              Due (optional)
              <input type="datetime-local" name="dueAt" className="mt-1 block rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
            </label>
            <label className="flex-1 text-[13px] font-medium">
              Curriculum session (optional)
              <select name="trackSessionId" disabled={trackSessionOptions.length === 0} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]">
                <option value="">{trackSessionOptions.length === 0 ? "No track sessions" : "— none —"}</option>
                {trackSessionOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>
          <button disabled={pending} className="mt-1 w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
            {pending ? "Sending…" : "Send to student"}
          </button>
        </form>
      )}

      {assignments.length === 0 ? (
        <p className="text-[14px] text-ink-500">No assignments set yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {assignments.map((a) => {
            const overdue = a.dueAt && !a.submission && new Date(a.dueAt).getTime() < Date.now();
            return (
              <li key={a.id} className="rounded-[12px] border border-line bg-card px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-inter text-[14.5px] font-semibold">{a.title}</div>
                  <SubmissionPill submission={a.submission} overdue={Boolean(overdue)} />
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink-500">
                  Set {fmt(a.createdAt)}
                  {a.dueAt ? ` · due ${fmt(a.dueAt)}` : ""}
                  {a.trackSessionLabel ? ` · ${a.trackSessionLabel}` : ""}
                </div>
                {a.instructions && <p className="mt-2 whitespace-pre-wrap text-[13.5px]">{a.instructions}</p>}

                {a.submission ? (
                  <div className="mt-3 rounded-[8px] border border-line px-3.5 py-3">
                    <div className="font-mono text-[11.5px] font-semibold text-ink-500">
                      SUBMITTED {fmt(a.submission.submittedAt)}
                    </div>
                    {a.submission.content && <p className="mt-1.5 whitespace-pre-wrap text-[13.5px]">{a.submission.content}</p>}
                    {a.submission.linkUrl && (
                      <a href={a.submission.linkUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-[13px] font-medium text-blue">
                        {a.submission.linkUrl} ↗
                      </a>
                    )}
                    <form
                      onSubmit={(e) => { e.preventDefault(); submitReview(e.currentTarget, a.id); }}
                      className="mt-3 flex flex-col gap-2"
                    >
                      <label className="text-[12.5px] font-medium">
                        Feedback to the student
                        <textarea
                          name="mentorFeedback"
                          rows={2}
                          defaultValue={a.submission.mentorFeedback ?? ""}
                          className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
                        />
                      </label>
                      <button disabled={pending} className="w-fit rounded-[8px] border border-line px-3.5 py-1.5 text-[12.5px] font-semibold disabled:opacity-60">
                        {a.submission.reviewedAt ? "Update feedback" : "Save feedback"}
                      </button>
                      {a.submission.reviewedAt && (
                        <span className="text-[11.5px] text-ink-500">Reviewed {fmt(a.submission.reviewedAt)}</span>
                      )}
                    </form>
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] text-ink-500">Not submitted yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SubmissionPill({ submission, overdue }: { submission: AssignmentRecord["submission"]; overdue: boolean }) {
  if (!submission) {
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${overdue ? "bg-[#FDF0F0] text-[#DC2626]" : "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]"}`}>
        {overdue ? "overdue" : "not submitted"}
      </span>
    );
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${submission.reviewedAt ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#EFF6FF] text-[#0066CC]"}`}>
      {submission.reviewedAt ? "reviewed" : "awaiting review"}
    </span>
  );
}

function CurriculumTab({ track, isEnrolled }: { track: StudentTrack | null; isEnrolled: boolean }) {
  if (!isEnrolled || !track) {
    return (
      <div className="rounded-[12px] border border-line bg-card px-6 py-5 text-[14px] text-ink-500">
        This student isn&apos;t enrolled in a curriculum track yet. Enrolment is managed from the admin dashboard.
      </div>
    );
  }

  const byMonth = new Map<number, typeof track.sessions>();
  for (const s of track.sessions) {
    const m = s.month ?? 0;
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(s);
  }
  const months = Array.from(byMonth.keys()).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">{track.trackName.toUpperCase()}</div>
        <div className="font-inter text-[20px] font-bold">
          {track.completedCount} of {track.totalCount} sessions completed
          {track.currentMonth ? ` · currently in Month ${track.currentMonth}` : ""}
        </div>
        {track.totalCount === 0 && (
          <p className="mt-1 text-[13px] text-ink-500">The track has no sessions loaded yet.</p>
        )}
      </div>

      {months.map((m) => (
        <div key={m} className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">{m ? `MONTH ${m}` : "SESSIONS"}</div>
          <ul className="flex flex-col gap-1.5">
            {byMonth.get(m)!.map((s) => (
              <li key={s.trackSessionId} className="flex items-center justify-between text-[13.5px]">
                <span>
                  <span className="font-mono text-ink-500">S{s.sessionNumber}</span> · {s.title}
                </span>
                <StatusPill status={s.status} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-[#ECFDF5] text-[#059669]",
    in_progress: "bg-[#EFF6FF] text-[#0066CC]",
    not_started: "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]",
  };
  const label: Record<string, string> = { completed: "completed", in_progress: "in progress", not_started: "not started" };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${styles[status]}`}>{label[status]}</span>;
}

function MessagesTab({ studentId, messages, currentUserId }: { studentId: string; messages: MessageRecord[]; currentUserId: string }) {
  const { pending, error, run } = useAction();
  const submit = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    fd.set("studentId", studentId);
    run(() => sendMessage(fd), () => form.reset());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        {messages.length === 0 ? (
          <p className="text-[14px] text-ink-500">No messages yet. Say hello.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-[12px] px-3.5 py-2 text-[13.5px] ${mine ? "bg-blue text-white" : "bg-[#F1F3F6] dark:bg-[#1B2536]"}`}>
                    <div>{m.body}</div>
                    <div className={`mt-0.5 text-[11px] ${mine ? "text-white/70" : "text-ink-500"}`}>{fmt(m.createdAt)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }} className="flex gap-2">
        <input name="body" required placeholder="Write a message…" className="flex-1 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
        <button disabled={pending} className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
