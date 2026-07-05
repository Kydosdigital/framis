"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useFramis } from "@/lib/store";
import { ROADMAP_MODULES, PHASES, LESSON_CONTENT } from "@/lib/data";

const COLS = [90, 290, 490, 690];
const ROW_HEIGHT = 220;
const TOP_PAD = 110;
const VIEW_W = 780;
const CAPSTONE_DROP = 74;

function nodePos(i: number) {
  const row = Math.floor(i / 4);
  const posInRow = i % 4;
  const col = row % 2 === 0 ? posInRow : 3 - posInRow;
  return { x: COLS[col], y: TOP_PAD + row * ROW_HEIGHT };
}

type NodeStatus = "complete" | "current" | "locked";
type Selection = { kind: "module"; index: number } | { kind: "capstone"; phaseIndex: number };

export default function Roadmap() {
  const stats = useFramis((s) => s.stats);
  const statsLoading = useFramis((s) => s.statsLoading);
  const loadStats = useFramis((s) => s.loadStats);
  const goToLesson = useFramis((s) => s.goToLesson);
  const goTab = useFramis((s) => s.goTab);
  const [selected, setSelected] = useState<Selection | null>(null);

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
  const capstonePositions = useMemo(
    () => positions.filter((_, i) => i % 4 === 3).map((p) => ({ x: p.x, y: p.y + CAPSTONE_DROP })),
    [positions],
  );

  const currentIndex = stats
    ? Math.max(0, ROADMAP_MODULES.findIndex((m) => m.num === stats.nextLessonModuleNumber))
    : 0;
  const progress = ROADMAP_MODULES.length > 1 ? currentIndex / (ROADMAP_MODULES.length - 1) : 0;

  const statusOf = (num: number): NodeStatus => {
    if (stats?.completedModuleNumbers?.includes(num)) return "complete";
    if (stats && num === stats.nextLessonModuleNumber) return "current";
    return "locked";
  };

  const notesAppShipped = stats ? stats.capstoneStatus !== "not_started" : false;

  const anchorFor = (x: number): "left" | "center" | "right" => {
    if (x <= COLS[0] + 10) return "left";
    if (x >= COLS[3] - 10) return "right";
    return "center";
  };
  const translateFor = (anchor: "left" | "center" | "right") =>
    `translate(${anchor === "left" ? "0%" : anchor === "right" ? "-100%" : "-50%"}, calc(-100% - 18px))`;

  let popoverPos: { x: number; y: number } | null = null;
  let popoverBody: { title: string; eyebrow: string; desc: string; action?: { label: string; go: () => void } } | null =
    null;

  if (selected?.kind === "module") {
    const m = ROADMAP_MODULES[selected.index];
    const status = statusOf(m.num);
    popoverPos = positions[selected.index];
    popoverBody = {
      eyebrow: `MODULE ${m.num} · PHASE ${m.phase}`,
      title: m.title,
      desc:
        status === "complete"
          ? "Shipped — you've completed this one."
          : status === "current"
            ? "This is where you are right now."
            : "Ahead on your route — not unlocked yet.",
      action: { label: "Go to lesson →", go: () => goToLesson(LESSON_CONTENT[m.num] ? LESSON_CONTENT[m.num].key : m.num) },
    };
  } else if (selected?.kind === "capstone") {
    const ph = PHASES[selected.phaseIndex];
    const isNotesApp = selected.phaseIndex === 1;
    popoverPos = capstonePositions[selected.phaseIndex];
    popoverBody = {
      eyebrow: `CAPSTONE · PHASE ${ph.num}`,
      title: ph.capstone.replace(/^Capstone:\s*/, ""),
      desc: isNotesApp
        ? notesAppShipped
          ? "Shipped — nice work."
          : "This is the one real capstone brief right now."
        : "Unlocks when you reach this phase.",
      action: isNotesApp ? { label: "Open project brief →", go: () => goTab("capstone") } : undefined,
    };
  }

  return (
    <div className="max-w-[900px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        THE ROUTE · 12 MONTHS · 6 PHASES · 24 MODULES
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Your route to AI engineer
      </h1>
      <p className="mb-7 max-w-[560px] text-[14.5px]/[1.6] text-ink-500">
        Every module on the full curriculum, mapped. Tap any stop for details. Teal is what
        you&apos;ve shipped, the pulsing node is where you are right now.
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
          <span className="inline-block h-3 w-3 bg-amber" style={{ transform: "rotate(45deg)" }} /> Capstone
        </span>
      </div>

      <div className="mb-6 rounded-[16px] border border-line bg-card px-2 py-6">
        <div className="relative">
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
            {capstonePositions.map((cp, phaseIdx) => {
              const rowEndY = TOP_PAD + phaseIdx * ROW_HEIGHT;
              const isNotesAppCapstone = phaseIdx === 1;
              const shipped = isNotesAppCapstone && notesAppShipped;
              const isSelected = selected?.kind === "capstone" && selected.phaseIndex === phaseIdx;
              return (
                <g key={`cap-${phaseIdx}`}>
                  <line
                    x1={cp.x}
                    y1={rowEndY}
                    x2={cp.x}
                    y2={cp.y - 12}
                    stroke="var(--color-border)"
                    strokeWidth={2}
                  />
                  <motion.rect
                    x={cp.x - 10}
                    y={cp.y - 10}
                    width={20}
                    height={20}
                    transform={`rotate(45 ${cp.x} ${cp.y})`}
                    fill={shipped ? "#4B9E8F" : "var(--color-card)"}
                    stroke={shipped ? "#4B9E8F" : "#C4A24D"}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ cursor: "pointer" }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() =>
                      setSelected(
                        selected?.kind === "capstone" && selected.phaseIndex === phaseIdx
                          ? null
                          : { kind: "capstone", phaseIndex: phaseIdx },
                      )
                    }
                  />
                </g>
              );
            })}

            {/* module nodes */}
            {ROADMAP_MODULES.map((m, i) => {
              const p = positions[i];
              const status = statusOf(m.num);
              const isCurrent = status === "current";
              const isSelected = selected?.kind === "module" && selected.index === i;
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
                    stroke={isSelected ? "#0066CC" : stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ cursor: "pointer" }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.025 }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() =>
                      setSelected(selected?.kind === "module" && selected.index === i ? null : { kind: "module", index: i })
                    }
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

          {popoverPos && popoverBody && (
            <div
              className="absolute z-10"
              style={{
                left: `${(popoverPos.x / VIEW_W) * 100}%`,
                top: `${(popoverPos.y / viewH) * 100}%`,
                transform: translateFor(anchorFor(popoverPos.x)),
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="w-[240px] rounded-[10px] border border-line bg-card px-4 py-3 shadow-[0_12px_28px_rgba(10,20,40,.18)]"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-2.5 top-2.5 font-mono text-[12px] text-ink-400"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="mb-1 pr-4 font-mono text-[11px] font-medium text-ink-500">
                  {popoverBody.eyebrow}
                </div>
                <div className="mb-1.5 pr-4 font-inter text-[14.5px] font-semibold leading-snug">
                  {popoverBody.title}
                </div>
                <p className="mb-3 text-[12.5px]/[1.5] text-ink-500">{popoverBody.desc}</p>
                {popoverBody.action && (
                  <button
                    onClick={popoverBody.action.go}
                    className="rounded-md bg-blue px-3.5 py-2 font-inter text-[12.5px] font-semibold text-white"
                  >
                    {popoverBody.action.label}
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
