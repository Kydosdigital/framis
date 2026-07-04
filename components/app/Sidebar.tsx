"use client";

import { useFramis, useDisplayName, CONFIG, type AppTab } from "@/lib/store";
import { Logo } from "../ui";

export default function Sidebar() {
  const appTab = useFramis((s) => s.appTab);
  const goTab = useFramis((s) => s.goTab);
  const capstoneSubmitted = useFramis((s) => s.capstoneSubmitted);
  const reviewSent = useFramis((s) => s.reviewSent);
  const displayName = useDisplayName();

  const tabs: { id: AppTab; label: string; badge: string }[] = [
    { id: "dashboard", label: "Dashboard", badge: "" },
    { id: "lesson", label: "Lesson", badge: "wk 18" },
    { id: "capstone", label: "Capstone", badge: capstoneSubmitted ? "sent" : "due 2w" },
    { id: "review", label: "Peer review", badge: reviewSent ? "done" : "1 due" },
  ];

  return (
    <div className="flex w-[232px] flex-none flex-col gap-1 bg-navy px-[14px] py-[22px]">
      <div className="flex items-center gap-2.5 px-2.5 pb-[22px] pt-1">
        <Logo size={24} wordSize={17} light />
      </div>

      {tabs.map((n) => {
        const active = appTab === n.id;
        return (
          <button
            key={n.id}
            onClick={() => goTab(n.id)}
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
        {CONFIG.showStreaks && (
          <div className="mb-3 rounded-[10px] bg-navy-700 p-[14px]">
            <div className="flex items-baseline gap-2">
              <span className="font-inter text-[22px] font-bold text-teal">12</span>
              <span className="text-[12px] font-medium text-slateink-300">
                day streak
              </span>
            </div>
            <div className="mt-1 text-[11.5px] text-slateink-400">
              Longest: 28 days
            </div>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-2.5 py-1.5">
          <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-teal font-inter text-[13px] font-semibold text-white">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div>
            <div className="font-inter text-[13px] font-semibold text-white">
              {displayName}
            </div>
            <div className="text-[11px] text-slateink-400">Week 18 of 48</div>
          </div>
        </div>
      </div>
    </div>
  );
}
