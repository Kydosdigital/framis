import { TICKER_ITEMS } from "@/lib/data";

/** Infinite concept marquee (VARIABLES ▸ RAG ▸ AGENTS …). */
export default function Ticker() {
  const Row = ({ keyPrefix }: { keyPrefix: string }) => (
    <>
      {TICKER_ITEMS.map((tk, i) => (
        <span key={`${keyPrefix}-${i}`} className="flex items-center gap-[30px]">
          <span className="whitespace-nowrap font-mono text-[12px] font-medium tracking-[.08em] text-slateink-300">
            {tk}
          </span>
          <span className="text-[9px] text-teal">▸</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-t border-navy-600 bg-navy py-[15px]">
      <div className="flex w-max items-center gap-[30px] [animation:framisTicker_36s_linear_infinite]">
        <Row keyPrefix="a" />
        <Row keyPrefix="b" />
      </div>
    </div>
  );
}
