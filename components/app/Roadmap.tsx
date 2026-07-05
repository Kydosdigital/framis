"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useFramis } from "@/lib/store";
import { ROADMAP_MODULES, PHASES } from "@/lib/data";

const COLS = [90, 290, 490, 690];
const ROW_HEIGHT = 220;
const TOP_PAD = 110;
const VIEW_W = 780;

function nodePos(i: number) {
  const row = Math.floor(i / 4);
  const posInRow = i % 4;
  const col = row % 2 === 0 ? posInRow : 3 - posInRow;
  return { x: COLS[col], y: TOP_PAD + row * ROW_HEIGHT };
}

type NodeStatus = "complete" | "current" | "locked";

export default function Roadmap() {
  const stats = useFramis((s) => s.stats);
  const statsLoading = useFramis((s) => s.statsLoading);
  const loadStats = useFramis((s) => s.loadStats);
  const goToLesson = useFramis((s) => s.goToLesson);
  const goTab = useFramis((s) => s.goTab);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!stats && !statsLoading) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const positions = useMemo(() => ROADMAP_MODULES.map((_, i) => nodePos(i)), []);
  const pathD = useMemo(
    () => positions.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    [positions],
  );
  const viewH = TOP_PAD + (ROADMAP_MODULES.length / 4 - 1) * ROW_HEIGHT + TOP_PAD;

  const currentIndex = stats
    ? Math.max(0, ROADMAP_MODULES.findIndex((m) => m.num === stats.nextLessonModuleNumber))
    : 0;
  const progress = ROADMAP_MODULES.length > 1 ? currentIndex / (ROADMAP_MODULES.length - 1) : 0;

  const statusOf = (num: number): NodeStatus => {
    if (stats?.completedModuleNumbers?.includes(num)) return "complete";
    if (stats && num === stats.nextLessonModuleNumber) return "current";
    return "locked";
  };

  const capstoneAfter = new Set([3, 7, 11, 15, 19, 23]); // 0-based index of last module in each phase
  const notesAppShipped = stats ? stats.capstoneStatus !== "not_started" : false;

  const selectedModule = selected != null ? ROADMAP_MODULES[selected] : null;
  const selectedStatus = selectedModule ? statusOf(selectedModule.num) : null;
  const selectedIsRealLesson = selectedModule && (selectedModule.num === 2 || selectedModule.num === 14);

  return (
    <div className="max-w-[900px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        THE ROUTE · 12 MONTHS · 6 PHASES · 24 MODULES
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Your route to AI engineer
      </h1>
      <p className="mb-7 max-w-[560px] text-[14.5px]/[1.6] text-ink-500">
        Every module on the full curriculum, mapped. Teal is what you&apos;ve shipped, the pulsing
        node is where you are right now — the rest is what&apos;s ahead.
      </p>

      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-ink-500">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-teal" /> Shipped
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue" /> Current
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-line-input" /> Ahead
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 bg-amber"
            style={{ transform: "rotate(45deg)" }}
          />{" "}
          Capstone
        </span>
      </div>

      <div className="mb-6 overflow-hidden rounded-[16px] border border-line bg-card px-2 py-6">
        <svg viewBox={`0 0 ${VIEW_W} ${viewH}`} className="w-full" style={{ height: "auto" }}>
          {/* phase labels */}
          {PHASES.map((ph, i) => (
            <text
              key={ph.num}
              x={VIEW_W / 2}
              y={TOP_PAD + i * ROW_HEIGHT - 62}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 13, fill: "var(--color-ink-400)", letterSpacing: "0.08em" }}
            >
              PHASE {ph.num} · {ph.title.toUpperCase()}
            </text>
          ))}

          {/* base path */}
          <path d={pathD} fill="none" stroke="var(--color-border)" strokeWidth={3} />

          {/* progress path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#4B9E8F"
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 1 - progress }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* capstone spurs + diamonds */}
          {positions.map((p, i) => {
            if (!capstoneAfter.has(i)) return null;
            const phaseIdx = Math.floor(i / 4);
            const isNotesAppCapstone = phaseIdx === 1; // Phase 2 -> Notes App, module 8
            const shipped = isNotesAppCapstone && notesAppShipped;
            const cy = p.y + 74;
            return (
              <g key={`cap-${i}`}>
                <line x1={p.x} y1={p.y} x2={p.x} y2={cy - 12} stroke="var(--color-border)" strokeWidth={2} />
                <motion.rect
                  x={p.x - 10}
                  y={cy - 10}
                  width={20}
                  height={20}
                  transform={`rotate(45 ${p.x} ${cy})`}
                  fill={shipped ? "#4B9E8F" : "var(--color-card)"}
                  stroke={shipped ? "#4B9E8F" : "#C4A24D"}
                  strokeWidth={2}
                  style={{ cursor: isNotesAppCapstone ? "pointer" : "default" }}
                  whileHover={isNotesAppCapstone ? { scale: 1.15 } : undefined}
                  onClick={isNotesAppCapstone ? () => goTab("capstone") : undefined}
                />
              </g>
            );
          })}

          {/* module nodes */}
          {ROADMAP_MODULES.map((m, i) => {
            const p = positions[i];
            const status = statusOf(m.num);
            const isCurrent = status === "current";
            const fill =
              status === "complete" ? "#4B9E8F" : status === "current" ? "#0066CC" : "var(--color-card)";
            const stroke = status === "locked" ? "#C4CBD6" : fill;
            return (
              <g key={m.num}>
                {isCurrent && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={22}
                    fill="none"
                    stroke="#0066CC"
                    strokeWidth={2}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.6 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={17}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.025 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setSelected(i)}
                />
                <text
                  x={p.x}
                  y={p.y + 5}
                  textAnchor="middle"
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-fira), monospace",
                    fontWeight: 600,
                    fill: status === "locked" ? "var(--color-ink-500)" : "#fff",
                    pointerEvents: "none",
                  }}
                >
                  {m.num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedModule && selectedStatus && (
        <div className="rounded-[12px] border border-line bg-card px-6 py-5">
          <div className="mb-1 font-mono text-[11.5px] font-medium text-ink-500">
            MODULE {selectedModule.num} · PHASE {selectedModule.phase}
          </div>
          <div className="mb-2 font-inter text-[17px] font-semibold">{selectedModule.title}</div>
          <p className="mb-4 text-[13.5px] text-ink-500">
            {selectedStatus === "complete"
              ? "Shipped — you've completed this one."
              : selectedStatus === "current"
                ? "This is where you are right now."
                : "Ahead on your route — not unlocked yet."}
          </p>
          {selectedIsRealLesson && (
            <button
              onClick={() => goToLesson(selectedModule.num === 2 ? "variables" : "rag")}
              className="rounded-lg bg-blue px-5 py-2.5 font-inter text-[13px] font-semibold text-white"
            >
              Go to lesson →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
