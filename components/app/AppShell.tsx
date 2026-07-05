"use client";

import { useFramis } from "@/lib/store";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Lesson from "./Lesson";
import Capstone from "./Capstone";
import PeerReview from "./PeerReview";
import Portfolio from "./Portfolio";

export default function AppShell() {
  const appTab = useFramis((s) => s.appTab);

  return (
    <div className="flex min-h-screen items-stretch bg-surface">
      <Sidebar />
      <div className="min-w-0 max-w-[1100px] flex-1 px-11 pb-16 pt-9">
        {appTab === "dashboard" && <Dashboard />}
        {appTab === "lesson" && <Lesson />}
        {appTab === "capstone" && <Capstone />}
        {appTab === "review" && <PeerReview />}
        {appTab === "portfolio" && <Portfolio />}
      </div>
    </div>
  );
}
