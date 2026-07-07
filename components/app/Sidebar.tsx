"use client";

import { useFramis, useDisplayName, CONFIG, type AppTab } from "@/lib/store";
import { Logo } from "../ui";

export default function Sidebar() {
  const appTab = useFramis((s) => s.appTab);
  const goTab = useFramis((s) => s.goTab);
  const theme = useFramis((s) => s.theme);
  const setTheme = useFramis((s) => s.setTheme);
  const signOut = useFramis((s) => s.signOut);
  const userEmail = useFramis((s) => s.userEmail);
  const stats = useFramis((s) => s.stats);
  const sidebarOpen = useFramis((s) => s.sidebarOpen);
  const closeSidebar = useFramis((s) => s.closeSidebar);
  const displayName = useDisplayName();

  const capstoneBadge =
    stats?.capstoneStatus === "passed"
      ? "passed"
      : stats?.capstoneStatus === "submitted" || stats?.capstoneStatus === "under_review"
        ? "sent"
        : "";
  const reviewBadge = stats && stats.pendingReviews > 0 ? `${stats.pendingReviews} due` : "";
  const lessonBadge = stats ? `${stats.completedLessons}/${stats.totalLessons}` : "";

  const tabs: { id: AppTab; label: string; badge: string }[] = [
    { id: "dashboard", label: "Dashboard", badge: "" },
    { id: "roadmap", label: "Roadmap", badge: "" },
    { id: "lesson", label: "Lesson", badge: lessonBadge },
    { id: "capstone", label: "Capstone", badge: capstoneBadge },
    { id: "review", label: "Peer review", badge: reviewBadge },
    { id: "portfolio", label: "Portfolio", badge: "" },
    { id: "dictionary", label: "Dictionary", badge: "" },
    { id: "faq", label: "FAQ", badge: "" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-[232px] flex-none flex-col gap-1 overflow-y-auto bg-navy px-[14px] py-[22px] transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-2.5 pb-[22px] pt-1">
          <Logo size={24} wordSize={17} light />
          <button
            onClick={closeSidebar}
            className="rounded-md p-1 text-slateink-300 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {tabs.map((n) => {
          const active = appTab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => {
                goTab(n.id);
                closeSidebar();
              }}
              className="flex w-full items-center gap-[11px] rounded-lg px-3 py-[11px] text-left"
              style={{ background: active ? "#1A2A44" : "transparent" }}
            >
              <span
                className="inline-block h-2 w-2 flex-none rounded-[2px]"
                style={{ background: active ? "#4B9E8F" : "#33455F" }}
              />
              <span
                className="font-inter text-[13.5px] font-semibold"
                style={{ color: active ? "#fff" : "#8FA0B5" }}
              >
                {n.label}
              </span>
              <span className="ml-auto font-mono text-[11px] font-medium text-slateink-400">
                {n.badge}
              </span>
            </button>
          );
        })}

        <div className="mt-auto">
          {CONFIG.showStreaks && stats && stats.currentStreak > 0 && (
            <div className="mb-3 rounded-[10px] bg-navy-700 p-[14px]">
              <div className="flex items-baseline gap-2">
                <span className="font-inter text-[22px] font-bold text-teal">{stats.currentStreak}</span>
                <span className="text-[12px] font-medium text-slateink-300">
                  day streak
                </span>
              </div>
              <div className="mt-1 text-[11.5px] text-slateink-400">
                Longest: {stats.longestStreak} days
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 px-2.5 pb-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md border border-navy-400 bg-navy-700 px-2.5 py-1.5 font-mono text-[11px] font-medium text-slateink-300"
              title="Toggle dark mode"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            {userEmail && (
              <button
                onClick={signOut}
                className="rounded-md border border-navy-400 bg-navy-700 px-2.5 py-1.5 font-mono text-[11px] font-medium text-slateink-300"
              >
                Log out
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5 px-2.5 py-1.5">
            <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-teal font-inter text-[13px] font-semibold text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="font-inter text-[13px] font-semibold text-white">
                {displayName}
              </div>
              <div className="text-[11px] text-slateink-400">Week {stats?.weekNumber ?? 1} of 64</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
