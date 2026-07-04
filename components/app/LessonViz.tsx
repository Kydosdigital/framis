"use client";

import { useEffect, useRef, useState } from "react";
import { VIZ_CAPTIONS } from "@/lib/data";

/**
 * The box-metaphor motion visualisation for the Variables lesson. Plays a
 * 4-stage animation on demand: read the value → fly it into the box → store →
 * print it out.
 */
export default function LessonViz() {
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
      [1400, 2],
      [2600, 3],
      [3800, 4],
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

      <div className="relative h-[190px]">
        <div
          className="absolute left-0 top-7 rounded-[10px] border bg-navy-700 px-[18px] py-4 font-mono text-[15px] font-medium text-[#E8EAF0] [transition:border-color_.5s]"
          style={{ borderColor: vz === 1 ? "#4B9E8F" : "#24344D" }}
        >
          <div>
            name = <span className="text-teal">&quot;Alex&quot;</span>
          </div>
          <div
            className="mt-2 [transition:color_.5s]"
            style={{ color: vz === 4 ? "#E8EAF0" : "#5B6B82" }}
          >
            print(name)
          </div>
        </div>

        <div
          className="absolute rounded-lg bg-teal px-[15px] py-[7px] font-mono text-[14px] font-semibold text-white shadow-[0_6px_18px_rgba(75,158,143,.4)] [transition:all_.9s_cubic-bezier(.4,0,.2,1)]"
          style={{
            left: vz < 2 ? "52px" : "calc(100% - 145px)",
            top: vz < 2 ? "38px" : "52px",
            opacity: vz === 1 || vz === 2 ? 1 : 0,
          }}
        >
          &quot;Alex&quot;
        </div>

        <div className="absolute right-0 top-4 w-[170px]">
          <div
            className="flex h-[96px] items-center justify-center rounded-[12px] border-2 border-dashed [transition:all_.6s]"
            style={{
              borderColor: vz >= 3 ? "#4B9E8F" : "#33455F",
              background: vz >= 3 ? "rgba(75,158,143,0.12)" : "transparent",
            }}
          >
            <span
              className="font-mono text-[15px] font-semibold text-teal [transition:opacity_.5s]"
              style={{ opacity: vz >= 3 ? 1 : 0 }}
            >
              &quot;Alex&quot;
            </span>
          </div>
          <div className="mt-2.5 text-center font-mono text-[13px] font-medium text-slateink-300">
            name
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 rounded-lg bg-navy-700 px-[14px] py-2.5 font-mono text-[13px] text-slateink-300">
          <span className="text-slateink-400">output › </span>
          <span
            className="text-[#E8EAF0] [transition:opacity_.5s]"
            style={{ opacity: vz === 4 ? 1 : 0.08 }}
          >
            Alex
          </span>
        </div>
      </div>

      <div className="mt-4 min-h-[22px] text-[14px]/[1.5] text-slateink-200">
        {VIZ_CAPTIONS[vz]}
      </div>
    </div>
  );
}
