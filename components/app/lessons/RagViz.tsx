"use client";

import { useEffect, useRef, useState } from "react";

const CAPTIONS = [
  "Press play to watch a question get answered with a real source, not a guess.",
  "The source doc is split into small chunks — a few sentences each.",
  "Each chunk (and the question) gets plotted as a point in meaning-space. Similar meaning, nearby points.",
  "The chunk closest to the question is retrieved.",
  "That chunk is pasted into the prompt, so the answer can cite exactly where it came from.",
];

const CHUNKS = [
  { label: "chunk 1", x: 22, y: 20 },
  { label: "chunk 2", x: 70, y: 58 },
  { label: "chunk 3", x: 38, y: 78 },
];
const NEAREST_INDEX = 1;
const QUERY_POINT = { x: 62, y: 46 };

/** The chunk → embed → retrieve → cite visualisation for the RAG lesson. */
export default function RagViz() {
  const [vz, setVz] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVz(0);
    setPlaying(true);
    const stages: [number, number][] = [
      [300, 1],
      [1500, 2],
      [2800, 3],
      [4000, 4],
    ];
    stages.forEach(([t, stage]) => {
      timers.current.push(
        setTimeout(() => {
          setVz(stage);
          setPlaying(stage !== 4);
        }, t),
      );
    });
  };

  const btnLabel = playing ? "Playing…" : vz === 4 ? "↻ Replay" : "▶ Play";

  return (
    <div className="mb-[18px] rounded-[12px] bg-navy px-7 pb-[22px] pt-[26px]">
      <div className="mb-[22px] flex items-center justify-between">
        <span className="font-mono text-[12px] font-medium tracking-[.06em] text-teal">
          WATCH IT MOVE
        </span>
        <button
          onClick={play}
          className="rounded-full bg-blue px-5 py-[9px] font-inter text-[13px] font-semibold text-white"
        >
          {btnLabel}
        </button>
      </div>

      <div className="relative h-[220px]">
        {/* source document */}
        <div
          className="absolute left-0 top-0 w-[150px] rounded-[10px] border px-4 py-3 font-mono text-[12px]/[1.6] text-[#E8EAF0] [transition:border-color_.5s]"
          style={{ borderColor: vz === 1 ? "#4B9E8F" : "#24344D", background: "#121F35" }}
        >
          support-guide.md
          <div className="mt-1 text-[10.5px] text-slateink-400">3 chunks</div>
        </div>

        {/* chunk pills flying from the doc */}
        {CHUNKS.map((c, i) => (
          <div
            key={c.label}
            className="absolute rounded-md bg-teal px-2.5 py-1 font-mono text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(75,158,143,.4)] [transition:all_.9s_cubic-bezier(.4,0,.2,1)]"
            style={{
              left: vz < 2 ? "12px" : `${c.x}%`,
              top: vz < 2 ? "70px" : `${c.y}%`,
              opacity: vz >= 1 ? 1 : 0,
            }}
          >
            {c.label}
          </div>
        ))}

        {/* meaning-space panel */}
        <div
          className="absolute right-0 top-0 h-[150px] w-[190px] rounded-[10px] border [transition:border-color_.5s]"
          style={{ borderColor: vz >= 2 ? "#4B9E8F" : "#24344D", background: "#121F35" }}
        >
          <div className="px-3 pt-2 font-mono text-[10px] tracking-[.05em] text-slateink-400">
            MEANING SPACE
          </div>
          {/* query point */}
          <div
            className="absolute h-2.5 w-2.5 rounded-full bg-[#F59E0B] [transition:opacity_.6s]"
            style={{
              left: `${QUERY_POINT.x}%`,
              top: `${QUERY_POINT.y}%`,
              opacity: vz >= 2 ? 1 : 0,
            }}
          />
          {/* line to nearest chunk */}
          {vz >= 3 && (
            <svg className="absolute inset-0 h-full w-full">
              <line
                x1={`${QUERY_POINT.x}%`}
                y1={`${QUERY_POINT.y}%`}
                x2={`${CHUNKS[NEAREST_INDEX].x}%`}
                y2={`${CHUNKS[NEAREST_INDEX].y}%`}
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="3,3"
              />
            </svg>
          )}
        </div>

        {/* output */}
        <div className="absolute bottom-0 left-0 right-0 rounded-lg bg-navy-700 px-[14px] py-2.5 font-mono text-[12px]/[1.6] text-slateink-300">
          <div style={{ opacity: vz >= 3 ? 1 : 0.15, transition: "opacity .5s" }}>
            <span className="text-slateink-400">retrieved › </span>
            <span className="text-[#E8EAF0]">{CHUNKS[NEAREST_INDEX].label}</span>
          </div>
          <div style={{ opacity: vz === 4 ? 1 : 0.08, transition: "opacity .5s" }}>
            <span className="text-slateink-400">answer › </span>
            <span className="text-[#E8EAF0]">
              …per chunk 2 [source]. <span className="text-teal">✓ cited</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[22px] text-[14px]/[1.5] text-slateink-200">
        {CAPTIONS[vz]}
      </div>
    </div>
  );
}
