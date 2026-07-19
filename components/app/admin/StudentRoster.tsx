"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assignStudent } from "@/app/admin/actions";
import type { AllStudentRow, Person } from "@/lib/mentor/adminQueries";

function relativeDays(iso: string | null): string {
  if (!iso) return "never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

/** Whole-cohort roster: every student, their mentors, position and
 * engagement — with inline "add a mentor" so assignment can happen right
 * where the gap is visible, without bouncing to another page. */
export default function StudentRoster({ students, mentors }: { students: AllStudentRow[]; mentors: Person[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);

  const visible = students.filter((s) => {
    if (onlyUnassigned && s.mentorNames.length > 0) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (s.fullName ?? "").toLowerCase().includes(q) || s.username.toLowerCase().includes(q);
  });

  const addMentor = (studentId: string, mentorId: string) => {
    if (!mentorId) return;
    setError(null);
    const fd = new FormData();
    fd.set("studentId", studentId);
    fd.set("mentorId", mentorId);
    start(async () => {
      const res = await assignStudent(fd);
      if (res.ok) {
        setOpenFor(null);
        router.refresh();
      } else setError(res.error);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[12px] font-semibold text-ink-500">ALL STUDENTS ({visible.length})</div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="rounded-[8px] border border-line bg-transparent px-3 py-1.5 text-[13px]"
          />
          <label className="flex items-center gap-1.5 text-[13px] text-ink-500">
            <input type="checkbox" checked={onlyUnassigned} onChange={(e) => setOnlyUnassigned(e.target.checked)} />
            No mentor only
          </label>
        </div>
      </div>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {visible.length === 0 ? (
        <p className="text-[14px] text-ink-500">No students match.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-ink-500">
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium">Mentors</th>
                <th className="pb-2 font-medium">Position</th>
                <th className="pb-2 font-medium">Track</th>
                <th className="pb-2 font-medium">Engagement</th>
                <th className="pb-2 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.studentId} className="border-b border-line last:border-none align-top">
                  <td className="py-2.5">
                    <Link href={`/admin/learners/${s.studentId}`} className="font-medium text-blue">
                      {s.fullName ?? s.username}
                    </Link>
                    {s.stale && (
                      <span className="ml-2 inline-block rounded-full bg-[#FDF0F0] px-2 py-0.5 text-[11px] font-semibold text-[#DC2626]">
                        stale
                      </span>
                    )}
                    <div className="text-[12px] text-ink-500">@{s.username}</div>
                  </td>
                  <td className="py-2.5">
                    {s.mentorNames.length === 0 ? (
                      <span className="text-ink-500">none</span>
                    ) : (
                      <span>{s.mentorNames.join(", ")}</span>
                    )}
                    <div className="mt-1">
                      {openFor === s.studentId ? (
                        <select
                          autoFocus
                          disabled={pending}
                          defaultValue=""
                          onChange={(e) => addMentor(s.studentId, e.target.value)}
                          className="rounded-[8px] border border-line bg-transparent px-2 py-1 text-[12.5px]"
                        >
                          <option value="">— pick a mentor —</option>
                          {mentors.map((m) => (
                            <option key={m.id} value={m.id}>{m.fullName ?? m.username}</option>
                          ))}
                        </select>
                      ) : (
                        mentors.length > 0 && (
                          <button
                            onClick={() => setOpenFor(s.studentId)}
                            className="text-[12.5px] font-medium text-blue hover:underline"
                          >
                            + add mentor
                          </button>
                        )
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 text-ink-500">
                    {s.currentModuleNum ? `P${s.currentPhase} · M${s.currentModuleNum} ${s.currentModuleTitle}` : "Not started"}
                  </td>
                  <td className="py-2.5 text-ink-500">{s.enrolledTrack ?? "—"}</td>
                  <td className="py-2.5">{s.avgEngagementScore != null ? `${s.avgEngagementScore} / 100` : "—"}</td>
                  <td className="py-2.5 text-ink-500">{relativeDays(s.lastActivityAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
