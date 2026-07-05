"use client";

/**
 * The hero's self-playing "lesson demo": code types itself, the value flies
 * into the memory box, output prints, and it loops forever — the product
 * demoing itself. Driven by a 100ms frame counter `t` from the parent.
 */
export default function LandingDemo({ t }: { t: number }) {
  const f = t % 60;
  const L1 = 'name = "Alex"';
  const L2 = "print(name)";
  const typed1 = Math.max(0, Math.min(L1.length, f - 2));
  const typed2 = Math.max(0, Math.min(L2.length, f - 30));
  const chipShown = f >= 16 && f < 28;
  const chipFly = f >= 20;
  const boxFilled = f >= 28;
  const caret1 = f >= 2 && f < 18;
  const caret2 = f >= 30 && f < 43;

  const caption =
    f < 16
      ? 'Python reads the right side first: the value "Alex".'
      : f < 28
        ? "The value flies into a labelled box in memory."
        : f < 44
          ? "Stored — “name” now points at that box."
          : "print(name) opens the box and shows what’s inside.";

  return (
    <div className="min-w-[340px] flex-[0_1_430px] [animation:framisWordIn_.8s_.5s_both]">
      <div className="overflow-hidden rounded-[14px] border border-navy-400 bg-navy-800 shadow-[0_30px_70px_rgba(0,0,0,.45)]">
        <div className="flex items-center gap-[7px] border-b border-navy-500 px-4 py-3">
          <span className="inline-block h-[10px] w-[10px] rounded-full bg-navy-300" />
          <span className="inline-block h-[10px] w-[10px] rounded-full bg-navy-300" />
          <span className="inline-block h-[10px] w-[10px] rounded-full bg-navy-300" />
          <span className="ml-[10px] font-mono text-[11px] font-medium tracking-[.05em] text-slateink-400">
            LESSON 2.1 · VARIABLES — LIVE
          </span>
          <span className="ml-auto inline-block h-2 w-2 rounded-full bg-teal [animation:framisPulse_2s_ease-out_infinite]" />
        </div>

        <div className="relative h-[236px]">
          <div className="absolute left-[18px] top-[18px] min-h-[78px] min-w-[196px] rounded-[10px] border border-navy-400 bg-navy-700 px-4 py-[14px] font-mono text-[13.5px]/[2] font-medium text-[#E8EAF0]">
            <div>
              {L1.slice(0, typed1)}
              <span
                className="align-[-2px] w-2 bg-teal [animation:framisCaret_1s_infinite]"
                style={{ display: caret1 ? "inline-block" : "none", height: 14 }}
              />
            </div>
            <div>
              {L2.slice(0, typed2)}
              <span
                className="align-[-2px] w-2 bg-teal [animation:framisCaret_1s_infinite]"
                style={{ display: caret2 ? "inline-block" : "none", height: 14 }}
              />
            </div>
          </div>

          <div
            className="absolute rounded-[7px] bg-teal px-[11px] py-[5px] font-mono text-[12.5px] font-semibold text-white shadow-[0_6px_18px_rgba(75,158,143,.45)] [transition:all_.9s_cubic-bezier(.4,0,.2,1)]"
            style={{
              left: chipFly ? "calc(100% - 138px)" : "106px",
              top: chipFly ? "48px" : "28px",
              opacity: chipShown ? 1 : 0,
            }}
          >
            &quot;Alex&quot;
          </div>

          <div className="absolute right-[18px] top-8 w-[120px]">
            <div
              className="flex h-[66px] items-center justify-center rounded-[11px] border-2 border-dashed [transition:all_.6s]"
              style={{
                borderColor: boxFilled ? "#4B9E8F" : "#33455F",
                background: boxFilled ? "rgba(75,158,143,0.12)" : "transparent",
              }}
            >
              <span
                className="font-mono text-[12.5px] font-semibold text-teal [transition:opacity_.5s]"
                style={{ opacity: boxFilled ? 1 : 0 }}
              >
                &quot;Alex&quot;
              </span>
            </div>
            <div className="mt-2 text-center font-mono text-[11.5px] font-medium text-slateink-300">
              name
            </div>
          </div>

          <div className="absolute bottom-4 left-[18px] right-[18px] rounded-lg bg-navy-700 px-[13px] py-[9px] font-mono text-[12.5px] text-slateink-300">
            <span className="text-slateink-400">output › </span>
            <span
              className="text-[#E8EAF0] [transition:opacity_.5s]"
              style={{ opacity: f >= 44 ? 1 : 0.08 }}
            >
              Alex
            </span>
          </div>
        </div>

        <div className="min-h-[20px] border-t border-navy-500 px-[18px] pb-[15px] pt-3 text-[12.5px]/[1.5] text-slateink-200">
          {caption}
        </div>
      </div>
      <div className="mt-3 text-center text-[12px] text-slateink-400">
        This is how every Framis lesson teaches — motion first.
      </div>
    </div>
  );
}
