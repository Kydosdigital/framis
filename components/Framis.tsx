"use client";

import { useEffect } from "react";
import { useFramis } from "@/lib/store";
import Landing from "./landing/Landing";
import Onboarding from "./onboarding/Onboarding";
import AppShell from "./app/AppShell";

export default function Framis() {
  const screen = useFramis((s) => s.screen);
  const authLoading = useFramis((s) => s.authLoading);
  const bootstrap = useFramis((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) {
    return <div className="min-h-screen bg-navy" />;
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-ink-900">
      {screen === "landing" && <Landing />}
      {screen === "onboarding" && <Onboarding />}
      {screen === "app" && <AppShell />}
    </div>
  );
}
