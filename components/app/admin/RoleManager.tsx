"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/app/admin/actions";
import type { Person } from "@/lib/mentor/adminQueries";

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  mentor: "Mentor",
  super_admin: "Super admin",
};

const ROLE_STYLE: Record<string, string> = {
  student: "bg-[#F1F3F6] text-ink-500 dark:bg-[#1B2536]",
  mentor: "bg-[#EFF6FF] text-[#0066CC]",
  super_admin: "bg-[#ECFDF5] text-[#059669]",
};

export default function RoleManager({ people, currentUserId }: { people: Person[]; currentUserId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const change = (userId: string, role: string) => {
    setError(null);
    setBusyId(userId);
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("role", role);
    start(async () => {
      const res = await setUserRole(fd);
      if (res.ok) router.refresh();
      else setError(res.error);
      setBusyId(null);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-line bg-card px-6 py-5">
      <div className="font-mono text-[12px] font-semibold text-ink-500">PEOPLE &amp; ROLES ({people.length})</div>
      <p className="text-[12px] text-ink-500">
        Make someone a mentor here — they then appear in the mentor dropdown below and can open /mentor.
      </p>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {people.length === 0 ? (
        <p className="text-[14px] text-ink-500">No users yet.</p>
      ) : (
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line text-ink-500">
              <th className="pb-2 font-medium">Person</th>
              <th className="pb-2 font-medium">Current role</th>
              <th className="pb-2 font-medium">Change to</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => {
              const isSelf = p.id === currentUserId;
              return (
                <tr key={p.id} className="border-b border-line last:border-none">
                  <td className="py-2.5">
                    <span className="font-medium">{p.fullName ?? p.username}</span>
                    {isSelf && <span className="ml-2 text-[12px] text-ink-500">(you)</span>}
                    <div className="text-[12px] text-ink-500">@{p.username}</div>
                  </td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${ROLE_STYLE[p.role] ?? ROLE_STYLE.student}`}>
                      {ROLE_LABEL[p.role] ?? p.role}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <select
                      value={p.role}
                      disabled={pending && busyId === p.id}
                      onChange={(e) => change(p.id, e.target.value)}
                      className="rounded-[8px] border border-line bg-transparent px-3 py-1.5 text-[13px] disabled:opacity-60"
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                    {isSelf && <div className="mt-1 text-[11.5px] text-ink-500">You can&apos;t remove your own super admin role.</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
