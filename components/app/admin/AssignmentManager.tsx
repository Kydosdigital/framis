"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignStudent, unassignStudent } from "@/app/admin/actions";
import type { Person, ActiveAssignment } from "@/lib/mentor/adminQueries";

export default function AssignmentManager({
  mentors,
  students,
  active,
}: {
  mentors: Person[];
  students: Person[];
  active: ActiveAssignment[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState("");
  const [studentId, setStudentId] = useState("");

  const mentorCountByStudent = active.reduce<Record<string, number>>((acc, a) => {
    acc[a.studentId] = (acc[a.studentId] ?? 0) + 1;
    return acc;
  }, {});

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    setError(null);
    start(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  };

  const submitAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mentorId || !studentId) return;
    const fd = new FormData();
    fd.set("mentorId", mentorId);
    fd.set("studentId", studentId);
    run(() => assignStudent(fd));
    setStudentId("");
  };

  const submitUnassign = (sid: string, mid: string) => {
    const fd = new FormData();
    fd.set("studentId", sid);
    fd.set("mentorId", mid);
    run(() => unassignStudent(fd));
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submitAssign} className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="font-mono text-[12px] font-semibold text-ink-500">ASSIGN A STUDENT TO A MENTOR</div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[13px] font-medium">
            Mentor
            <select value={mentorId} onChange={(e) => setMentorId(e.target.value)} className="mt-1 block w-56 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]">
              <option value="">— pick a mentor —</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>{m.fullName ?? m.username}</option>
              ))}
            </select>
          </label>
          <label className="text-[13px] font-medium">
            Student
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 block w-56 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]">
              <option value="">— pick a student —</option>
              {students.map((s) => {
                const n = mentorCountByStudent[s.id] ?? 0;
                return (
                  <option key={s.id} value={s.id}>
                    {(s.fullName ?? s.username) + (n ? ` (${n} mentor${n === 1 ? "" : "s"})` : "")}
                  </option>
                );
              })}
            </select>
          </label>
          <button disabled={pending || !mentorId || !studentId} className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
            {pending ? "Saving…" : "Assign"}
          </button>
        </div>
        <p className="text-[12px] text-ink-500">
          A student can have more than one mentor — assigning adds a mentor, it doesn&apos;t replace their existing ones.
          Unassign a specific pairing below to remove just that mentor.
        </p>
        {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}
      </form>

      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-4 font-mono text-[12px] font-semibold text-ink-500">ACTIVE ASSIGNMENTS ({active.length})</div>
        {active.length === 0 ? (
          <p className="text-[14px] text-ink-500">No active assignments yet.</p>
        ) : (
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-ink-500">
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium">Mentor</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {active.map((a) => (
                // keyed by the pair — a student can appear once per mentor
                <tr key={`${a.studentId}-${a.mentorId}`} className="border-b border-line last:border-none">
                  <td className="py-2.5 font-medium">{a.studentName}</td>
                  <td className="py-2.5 text-ink-500">{a.mentorName}</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => submitUnassign(a.studentId, a.mentorId)} disabled={pending} className="text-[13px] font-medium text-[#DC2626] hover:underline disabled:opacity-60">
                      Unassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
