"use client";

import { useCallback, useEffect, useRef } from "react";
import { EngagementEvent, EngagementEventType } from "./types";

const FLUSH_INTERVAL_MS = 15_000;
/** Longer than this with the tab hidden/inactive doesn't count as attention —
 * caps the "someone left the tab open all night" outlier (spec §1). */
const MAX_IDLE_GAP_SECONDS = 30 * 60;
const ENDPOINT = "/api/engagement";

function randomUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback for environments without crypto.randomUUID (older browsers).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Lightweight behavioural tracking for one lesson page — session id,
 * time-on-page (pausable), max scroll depth, and fire-and-forget event
 * hooks for existing lesson interactions to call into. See spec §3.
 *
 * Wire the returned `containerRef` onto the lesson's outer scroll
 * container so scroll depth can be measured.
 */
export function useLessonEngagement(lessonId: string, moduleId: string, phase: number) {
  const sessionIdRef = useRef<string>(randomUuid());
  const queueRef = useRef<EngagementEvent[]>([]);
  const maxScrollRef = useRef(0);
  const accumulatedSecondsRef = useRef(0);
  const visibleSinceRef = useRef<number | null>(typeof document !== "undefined" && !document.hidden ? Date.now() : null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const enqueue = useCallback(
    (eventType: EngagementEventType, eventValue: Record<string, unknown> = {}) => {
      queueRef.current.push({
        lesson_id: lessonId,
        module_id: moduleId,
        phase,
        event_type: eventType,
        event_value: eventValue,
        session_id: sessionIdRef.current,
      });
    },
    [lessonId, moduleId, phase],
  );

  const flush = useCallback((useBeacon: boolean) => {
    if (!queueRef.current.length) return;
    const payload = JSON.stringify({ events: queueRef.current });
    queueRef.current = [];
    if (useBeacon && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  }, []);

  const settleTime = useCallback(() => {
    if (visibleSinceRef.current == null) return;
    const elapsed = (Date.now() - visibleSinceRef.current) / 1000;
    accumulatedSecondsRef.current += Math.min(elapsed, MAX_IDLE_GAP_SECONDS);
    visibleSinceRef.current = null;
  }, []);

  // session start + visibility-aware timer.
  useEffect(() => {
    enqueue("page_view", { seconds: 0 });

    const onVisibility = () => {
      if (document.hidden) {
        settleTime();
      } else {
        visibleSinceRef.current = Date.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const flushInterval = setInterval(() => flush(false), FLUSH_INTERVAL_MS);

    const onHide = () => {
      settleTime();
      enqueue("page_view", { seconds: Math.round(accumulatedSecondsRef.current) });
      flush(true);
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
      clearInterval(flushInterval);
      onHide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, moduleId, phase]);

  // scroll-depth tracking — percentage of the lesson's own scroll
  // container that's passed the viewport bottom, not raw pixels.
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = total > 0 ? Math.min(100, Math.max(0, ((-rect.top) / total) * 100)) : 100;
      if (scrolled > maxScrollRef.current) {
        maxScrollRef.current = Math.round(scrolled);
        enqueue("scroll_depth", { pct: maxScrollRef.current });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const trackExplainerOpen = useCallback((termId: string) => enqueue("explainer_open", { termId }), [enqueue]);
  const trackExplainSimplerToggle = useCallback(() => enqueue("explain_simpler_toggle", {}), [enqueue]);
  const trackSandboxAttempt = useCallback(() => enqueue("sandbox_attempt", {}), [enqueue]);
  const trackSandboxComplete = useCallback(() => enqueue("sandbox_complete", {}), [enqueue]);
  const trackQuizAttempt = useCallback((score: number) => enqueue("quiz_attempt", { score }), [enqueue]);

  return {
    containerRef,
    trackExplainerOpen,
    trackExplainSimplerToggle,
    trackSandboxAttempt,
    trackSandboxComplete,
    trackQuizAttempt,
  };
}
