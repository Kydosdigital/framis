import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUserIsMentor } from "@/lib/mentor/access";

/** Gates every `/mentor/*` route behind profiles.role = 'mentor' (a super
 * admin is let through to preview it). Separate axis from the engagement
 * dashboard's is_admin gate at /admin. */
export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const allowed = await currentUserIsMentor();
  if (!allowed) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <div className="font-mono text-[12px] font-medium text-ink-500">MENTOR PORTAL</div>
        <Link href="/mentor" className="font-inter text-[24px] font-bold tracking-[-0.02em]">
          Your students
        </Link>
      </div>
      <nav className="mb-8 flex flex-wrap gap-4 border-b border-line pb-3 text-[13.5px] font-medium">
        <Link href="/mentor" className="text-ink-500 hover:text-blue">My students</Link>
        <Link href="/admin" className="text-ink-500 hover:text-blue">Engagement dashboard</Link>
      </nav>
      {children}
    </div>
  );
}
