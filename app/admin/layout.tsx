import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserIsAdmin } from "@/lib/engagement/adminQueries";
import { currentUserIsSuperAdmin } from "@/lib/mentor/access";

/** Gates every `/admin/*` route behind `profiles.is_admin`. The mentor
 * overview / assignment / track sections additionally show only for a
 * super admin (each page re-checks), so a nav link only appears for them. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, isSuperAdmin] = await Promise.all([currentUserIsAdmin(), currentUserIsSuperAdmin()]);
  if (!isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <div className="font-mono text-[12px] font-medium text-ink-500">ADMIN</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Engagement dashboard</h1>
      </div>
      <nav className="mb-8 flex flex-wrap gap-4 border-b border-line pb-3 text-[13.5px] font-medium">
        <Link href="/admin" className="text-ink-500 hover:text-blue">Engagement</Link>
        {isSuperAdmin && (
          <>
            <Link href="/admin/students" className="text-ink-500 hover:text-blue">Students</Link>
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
