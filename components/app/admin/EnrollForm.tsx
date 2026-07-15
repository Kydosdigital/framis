"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollStudentInTrack } from "@/app/admin/actions";
import type { Person } from "@/lib/mentor/adminQueries";

export default function EnrollForm({ students, tracks }: { students: Person[]; tracks: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState("");
  const [trackId, setTrackId] = useState(tracks[0]?.id ?? "");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentId || !trackId) return;
    setError(null);
    const fd = new FormData();
    fd.set("studentId", studentId);
    fd.set("trackId", trackId);
    start(async () => {
      const res = await enrollStudentInTrack(fd);
      if (res.ok) { setStudentId(""); router.refresh(); }
      else setError(res.error);
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5">
      <div className="font-mono text-[12px] font-semibold text-ink-500">ENROL A STUDENT IN A TRACK</div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[13px] font-medium">
          Student
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="mt-1 block w-56 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]">
            <option value="">— pick a student —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName ?? s.username}</option>
            ))}
          </select>
        </label>
        <label className="text-[13px] font-medium">
          Track
          <select value={trackId} onChange={(e) => setTrackId(e.target.value)} className="mt-1 block w-64 rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]">
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <button disabled={pending || !studentId || !trackId} className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
          {pending ? "Enrolling…" : "Enrol"}
        </button>
      </div>
      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}
    </form>
  );
}
