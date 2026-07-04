"use client";

import { useFramis } from "@/lib/store";
import Landing from "./landing/Landing";
import Onboarding from "./onboarding/Onboarding";
import AppShell from "./app/AppShell";

export default function Framis() {
  const screen = useFramis((s) => s.screen);

  return (
    <div className="min-h-screen bg-surface font-sans text-ink-900">
      {screen === "landing" && <Landing />}
      {screen === "onboarding" && <Onboarding />}
      {screen === "app" && <AppShell />}
    </div>
  );
}
