"use client";

import { useMemo, useState } from "react";
import { useFramis } from "@/lib/store";
import { getAllDictionaryTerms, type DictionaryTerm } from "@/lib/lessons";

function TermCard({ term, onOpenLesson }: { term: DictionaryTerm; onOpenLesson: (module: number, orderIndex: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border-none bg-transparent px-5 py-3.5 text-left"
      >
        <span className="flex-none text-[18px] leading-none">{term.emoji}</span>
        <span className="flex-1">
          <span className="block font-inter text-[14px] font-semibold text-ink-900">{term.term}</span>
          <span className="block text-[12.5px] text-ink-500">{term.shortDef}</span>
        </span>
        <span className="flex-none font-mono text-[12px] text-blue">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="border-t border-line px-5 py-4 text-[13px]/[1.6] text-ink-500">
          <p className="mb-3">{term.longDef}</p>
          <div className="mb-3 rounded-[8px] bg-[#F9FAFB] px-3.5 py-3 dark:bg-[#1B2536]">
            <strong className="text-ink-900">💡 Why this matters</strong>
            <p className="mb-0 mt-1.5">{term.whyMatters}</p>
          </div>
          <div className="mb-3 rounded-[8px] bg-[#F9FAFB] px-3.5 py-3 dark:bg-[#1B2536]">
            <strong className="text-ink-900">🌍 Real-world example</strong>
            <p className="mb-0 mt-1.5">{term.realWorldExample}</p>
          </div>
          <div className="mb-1 font-inter text-[12.5px] font-semibold text-ink-900">Appears in</div>
          <div className="flex flex-col gap-1">
            {term.appearsIn.map((a, i) => (
              <button
                key={i}
                onClick={() => onOpenLesson(a.module, a.orderIndex)}
                className="text-left font-mono text-[12px] text-blue"
              >
                Module {a.module}, Lesson {a.orderIndex} — {a.lessonTitle}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dictionary() {
  const goToLesson = useFramis((s) => s.goToLesson);
  const [query, setQuery] = useState("");
  const terms = useMemo(() => getAllDictionaryTerms(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.shortDef.toLowerCase().includes(q),
    );
  }, [terms, query]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map((t) => t.term[0]?.toUpperCase()).filter(Boolean));
    return [...set].sort();
  }, [filtered]);

  return (
    <div className="max-w-[720px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        DICTIONARY · {terms.length} TERMS
      </div>
      <h1 className="mb-2.5 font-inter text-[27px] font-bold tracking-[-0.02em]">
        Look up any term
      </h1>
      <p className="mb-6 max-w-[560px] text-[14.5px]/[1.6] text-ink-500">
        Every key term from every lesson, in one searchable place — useful
        mid-capstone when you’ve forgotten what something means.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms…"
        className="mb-6 w-full rounded-lg border border-line-input bg-transparent px-[14px] py-[13px] text-[15px]"
      />

      {filtered.length === 0 ? (
        <p className="text-[13.5px] text-ink-500">No terms match “{query}”.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {letters.map((letter) => (
            <div key={letter}>
              <div className="mb-2.5 font-mono text-[12px] font-semibold tracking-[0.06em] text-ink-400">
                {letter}
              </div>
              <div className="flex flex-col gap-2">
                {filtered
                  .filter((t) => t.term[0]?.toUpperCase() === letter)
                  .map((t) => (
                    <TermCard key={t.id} term={t} onOpenLesson={goToLesson} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
