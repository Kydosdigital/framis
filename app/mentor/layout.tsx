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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="font-mono text-[12px] font-medium text-ink-500">MENTOR PORTAL</div>
          <Link href="/mentor" className="font-inter text-[24px] font-bold tracking-[-0.02em]">
            Your students
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
