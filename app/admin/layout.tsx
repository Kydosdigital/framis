import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserIsAdmin } from "@/lib/engagement/adminQueries";
import { currentUser } from "@/lib/mentor/access";

/** Gates `/admin/*`. Super admins (and the original is_admin holder) see
 * the whole cohort; a mentor is let in but every page is scoped to their
 * own assigned students. The mentor-overview / assignment / track sections
 * stay super-admin-only and each page re-checks, so those nav links only
 * appear for a super admin. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, me] = await Promise.all([currentUserIsAdmin(), currentUser()]);
  const isSuperAdmin = me?.isSuperAdmin ?? false;
  const isMentor = me?.role === "mentor";
  if (!isAdmin && !isSuperAdmin && !isMentor) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <div className="font-mono text-[12px] font-medium text-ink-500">{isSuperAdmin || isAdmin ? "ADMIN" : "MENTOR"}</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Engagement dashboard</h1>
        {isMentor && !isSuperAdmin && (
          <p className="mt-1 text-[13px] text-ink-500">Showing only the students assigned to you.</p>
        )}
      </div>
      <nav className="mb-8 flex flex-wrap gap-4 border-b border-line pb-3 text-[13.5px] font-medium">
        <Link href="/admin" className="text-ink-500 hover:text-blue">Engagement</Link>
        <Link href="/mentor" className="text-ink-500 hover:text-blue">My students</Link>
        {isSuperAdmin && (
          <>
            <Link href="/admin/students" className="text-ink-500 hover:text-blue">All students</Link>
            <Link href="/admin/mentors" className="text-ink-500 hover:text-blue">Mentors</Link>
            <Link href="/admin/assignments" className="text-ink-500 hover:text-blue">Assignments</Link>
            <Link href="/admin/tracks" className="text-ink-500 hover:text-blue">Tracks</Link>
          </>
        )}
      </nav>
      {children}
    </div>
  );
}
