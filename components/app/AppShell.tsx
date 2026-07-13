"use client";

import { useFramis } from "@/lib/store";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Roadmap from "./Roadmap";
import Lesson from "./Lesson";
import Capstone from "./Capstone";
import PeerReview from "./PeerReview";
import Portfolio from "./Portfolio";
import Report from "./Report";
import Faq from "./Faq";
import Dictionary from "./Dictionary";
import { Logo } from "../ui";

export default function AppShell() {
  const appTab = useFramis((s) => s.appTab);
  const toggleSidebar = useFramis((s) => s.toggleSidebar);

  return (
    <div className="min-h-screen bg-surface md:flex md:items-stretch">
      {/* mobile top bar */}
      <div className="flex items-center justify-between bg-navy px-4 py-3 md:hidden">
        <Logo size={22} wordSize={15} light />
        <button
          onClick={toggleSidebar}
          className="rounded-md border border-navy-400 px-3 py-1.5 font-mono text-[12px] font-medium text-slateink-300"
          aria-label="Open menu"
        >
          ☰ Menu
        </button>
      </div>

      <Sidebar />
      <div className="min-w-0 max-w-[1100px] flex-1 px-5 pb-12 pt-6 sm:px-8 md:px-11 md:pb-16 md:pt-9">
        {appTab === "dashboard" && <Dashboard />}
        {appTab === "roadmap" && <Roadmap />}
        {appTab === "lesson" && <Lesson />}
        {appTab === "capstone" && <Capstone />}
        {appTab === "review" && <PeerReview />}
        {appTab === "portfolio" && <Portfolio />}
        {appTab === "report" && <Report />}
        {appTab === "faq" && <Faq />}
        {appTab === "dictionary" && <Dictionary />}
      </div>
    </div>
  );
}
