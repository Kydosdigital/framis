import { redirect } from "next/navigation";
import { currentUserIsAdmin } from "@/lib/engagement/adminQueries";

/** Gates every `/admin/*` route behind `profiles.is_admin` — single admin,
 * no roles/permissions system needed yet (spec §4). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await currentUserIsAdmin();
  if (!isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <div className="font-mono text-[12px] font-medium text-ink-500">ADMIN</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Engagement dashboard</h1>
      </div>
      {children}
    </div>
  );
}
