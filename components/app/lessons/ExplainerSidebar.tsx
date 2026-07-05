"use client";

import { useEffect, useRef, useState } from "react";
import type { Explainer } from "@/lib/lessons/types";

function ExplainerCard({
  explainer,
  isOpen,
  onToggle,
  flashed,
  onJumpTo,
  registerRef,
  termLabel,
}: {
  explainer: Explainer;
  isOpen: boolean;
  onToggle: () => void;
  flashed: boolean;
  onJumpTo: (id: string) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  termLabel: (id: string) => string;
}) {
  const [showFullDef, setShowFullDef] = useState(Boolean(explainer.expandedByDefault));

  return (
    <div
      ref={(el) => registerRef(explainer.id, el)}
      className="mb-3.5 overflow-hidden rounded-[10px] border border-line bg-card transition-colors duration-700"
      style={{ background: flashed ? "#EAF2FB" : undefined }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 border-none bg-transparent px-3.5 py-3 text-left"
      >
        <span className="flex-none text-[18px] leading-none">{explainer.emoji}</span>
        <span className="flex-1 font-inter text-[13.5px] font-semibold text-ink-900">{explainer.term}</span>
        <span className="flex-none font-mono text-[12px] text-blue">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-line px-3.5 py-3 text-[13px]/[1.55] text-ink-500">
          <p className="mb-0">{explainer.shortDef}</p>

          {showFullDef ? (
            <>
              <p className="mt-3 text-ink-500">{explainer.longDef}</p>

              <div className="mt-3 rounded-[8px] bg-[#F9FAFB] px-3.5 py-3 dark:bg-[#1B2536]">
                <strong className="text-ink-900">💡 Why this matters</strong>
                <p className="mt-1.5 mb-0">{explainer.whyMatters}</p>
              </div>

              <div className="mt-3 rounded-[8px] bg-[#F9FAFB] px-3.5 py-3 dark:bg-[#1B2536]">
                <strong className="text-ink-900">🌍 Real-world example</strong>
                <p className="mt-1.5 mb-0">{explainer.realWorldExample}</p>
              </div>

              {explainer.screenshot && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={explainer.screenshot}
                  alt={explainer.term}
                  className="mt-3 w-full rounded-[8px] border border-line"
                />
              )}

              {explainer.relatedTerms && explainer.relatedTerms.length > 0 && (
                <div className="mt-3 border-t border-line pt-3">
                  <strong className="text-ink-900">Related terms</strong>
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {explainer.relatedTerms.map((id) => (
                      <li key={id}>
                        <button
                          onClick={() => onJumpTo(id)}
                          className="border-none bg-transparent p-0 font-inter text-[13px] font-medium text-blue underline"
                        >
                          {termLabel(id)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowFullDef(true)}
              className="mt-2.5 border-none bg-transparent p-0 font-inter text-[12.5px] font-semibold text-blue"
            >
              Learn more →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplainerSidebar({ explainers }: { explainers: Explainer[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(explainers.filter((e) => e.expandedByDefault).map((e) => e.id)),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flashId, setFlashId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const byId = new Map(explainers.map((e) => [e.id, e]));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpTo = (id: string) => {
    if (!byId.has(id)) return;
    setOpenIds((prev) => new Set(prev).add(id));
    setMobileOpen(true);
    // let the card render open before scrolling to it
    requestAnimationFrame(() => {
      cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setFlashId(id);
  };

  useEffect(() => {
    if (!flashId) return;
    const t = setTimeout(() => setFlashId(null), 1200);
    return () => clearTimeout(t);
  }, [flashId]);

  const registerRef = (id: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  const termLabel = (id: string) => byId.get(id)?.term ?? id;

  const body = (
    <div className="rounded-[12px] border border-line bg-card px-4 py-4 md:sticky md:top-20 md:max-h-[calc(100vh-5.5rem)] md:overflow-y-auto md:border-none md:bg-transparent md:px-0 md:py-0">
      <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">KEY TERMS &amp; TIPS</div>
      {explainers.map((e) => (
        <ExplainerCard
          key={e.id}
          explainer={e}
          isOpen={openIds.has(e.id)}
          onToggle={() => toggle(e.id)}
          flashed={flashId === e.id}
          onJumpTo={jumpTo}
          registerRef={registerRef}
          termLabel={termLabel}
        />
      ))}
    </div>
  );

  return (
    <aside className="mt-8 md:mt-0 md:w-[35%] md:flex-none">
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-input bg-card px-4 py-3 font-inter text-[13.5px] font-semibold text-blue md:hidden"
      >
        📚 {mobileOpen ? "Hide lesson glossary" : "Need help understanding this lesson?"}
      </button>
      <div className={mobileOpen ? "block md:block" : "hidden md:block"}>{body}</div>
    </aside>
  );
}
