"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { fetchMyTrack, type MyTrack } from "@/lib/mentor/studentTrack";

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-[#ECFDF5] text-[#059669]",
  in_progress: "bg-[#EFF6FF] text-[#0066CC]",
  not_started: "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]",
};
const STATUS_LABEL: Record<string, string> = {
  completed: "done",
  in_progress: "in progress",
  not_started: "not started",
};

export default function Curriculum() {
  const userId = useFramis((st) => st.userId);
  const [track, setTrack] = useState<MyTrack | null | "loading">("loading");

  useEffect(() => {
    if (!userId) return;
    fetchMyTrack(userId).then((t) => setTrack(t));
  }, [userId]);

  if (track === "loading") return <div className="text-[14px] text-ink-500">Loading your curriculum…</div>;

  if (!track) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">CURRICULUM</div>
          <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Your mentor track</h1>
        </div>
        <div className="rounded-[12px] border border-line bg-card px-6 py-5 text-[14px] text-ink-500">
          You&apos;re not enrolled in a mentor-led track. This is separate from the main Framis curriculum, which you
          can keep working through on the Roadmap.
        </div>
      </div>
    );
  }

  const byMonth = new Map<number, MyTrack["sessions"]>();
  for (const s of track.sessions) {
    const m = s.month ?? 0;
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(s);
  }
  const months = Array.from(byMonth.keys()).sort((a, b) => a - b);
  const pct = track.total ? Math.round((track.completed / track.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">CURRICULUM</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">{track.name}</h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Sessions are marked done as your mentor logs them. Notes from your mentor appear on the session they relate to.
        </p>
      </div>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-1 font-mono text-[12px] font-semibold text-ink-500">PROGRESS</div>
        <div className="font-inter text-[24px] font-bold">
          {track.completed} of {track.total} sessions
          {track.currentMonth ? ` · Month ${track.currentMonth}` : ""}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1F3F6] dark:bg-[#1B2536]">
          <div className="h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {months.map((m) => (
        <div key={m} className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">{m ? `MONTH ${m}` : "SESSIONS"}</div>
          <ul className="flex flex-col gap-3">
            {byMonth.get(m)!.map((s) => (
              <li key={s.id} className="border-b border-line pb-3 last:border-none last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 text-[13.5px]">
                    <span className="font-mono text-ink-500">S{s.sessionNumber}</span>{" "}
                    <span className="font-medium">{s.title}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_STYLE[s.status]}`}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </div>
                {s.description && <p className="mt-1 text-[13px] text-ink-500">{s.description}</p>}
                {s.mentorNote && (
                  <p className="mt-1.5 rounded-[6px] bg-[#FFFBEB] px-2.5 py-1.5 text-[12.5px] text-[#92400E] dark:bg-[#2A2410] dark:text-[#D4B78A]">
                    <span className="font-semibold">From your mentor:</span> {s.mentorNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
