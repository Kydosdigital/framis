"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VizStage } from "@/lib/lessons/types";

/**
 * Generic "watch it happen" stage visualizer, reused across the generic
 * lesson set. Two modes: "auto" plays through stages on a timer (like the
 * bespoke Variables/RAG visualizations); "manual" lets the learner pick a
 * stage themselves (used for the explore-style sandboxes).
 */
export default function StageViz({
  stages,
  mode = "auto",
  heading = "WATCH IT HAPPEN",
}: {
  stages: VizStage[];
  mode?: "auto" | "manual";
  heading?: string;
}) {
  const [active, setActive] = useState(mode === "manual" ? 0 : -1);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(true);
    setActive(-1);
    stages.forEach((_, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setActive(i);
            setPlaying(i !== stages.length - 1);
          },
          600 + i * 1100,
        ),
      );
    });
  };

  const stage = active >= 0 ? stages[active] : null;
  const btnLabel = playing ? "Playing…" : active === stages.length - 1 ? "↻ Replay" : "▶ Play";

  return (
    <div className="mb-[18px] overflow-hidden rounded-[12px] bg-navy px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[12px] font-semibold tracking-[0.06em] text-teal">{heading}</span>
        {mode === "auto" && (
          <button
            onClick={play}
            disabled={playing}
            className="rounded-full bg-blue px-4 py-[7px] font-inter text-[12.5px] font-semibold text-white disabled:opacity-60"
          >
            {btnLabel}
          </button>
        )}
      </div>

      {mode === "manual" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {stages.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className="rounded-full px-3.5 py-[6px] font-mono text-[11.5px] font-medium"
              style={{
                background: active === i ? "#0066CC" : "rgba(255,255,255,0.06)",
                color: active === i ? "#fff" : "#8FA0B5",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[92px] rounded-lg bg-[#0F1826] px-5 py-4">
        <AnimatePresence mode="wait">
          {stage ? (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {mode === "auto" && (
                <div className="mb-1.5 font-mono text-[11px] font-medium text-slateink-400">{stage.label}</div>
              )}
              {stage.code && (
                <div className="mb-2 whitespace-pre-wrap rounded-md bg-[#151F30] px-3.5 py-2.5 font-mono text-[13px]/[1.6] text-[#E8EAF0]">
                  {stage.code}
                </div>
              )}
              <p className="text-[13.5px]/[1.6] text-slateink-200">{stage.body}</p>
            </motion.div>
          ) : (
            <p className="text-[13px] text-slateink-400">Press play to see it step through.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
