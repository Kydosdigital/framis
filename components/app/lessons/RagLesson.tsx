"use client";

import { useEffect, useState } from "react";
import { useFramis, type QuizKey } from "@/lib/store";
import { moduleLessonList, nextLessonLabel } from "@/lib/lessons";
import { createClient } from "@/lib/supabase/client";
import RagViz from "./RagViz";

type LessonContent = {
  concept: string;
  concept_simpler: string;
  quiz: { options: { key: QuizKey; label: string; correct: boolean }[] };
};

const DEFAULT_CONCEPT =
  "RAG means Retrieval-Augmented Generation. Instead of trusting the model's memory, you hand it the actual source text before it answers — split into small chunks, matched by meaning to the question, then pasted straight into the prompt. The model answers from what's in front of it, and can point to exactly which chunk it used.";
const DEFAULT_SIMPLER =
  "Open-book exam, not closed-book. Find the right page first, then answer from that page — and say which page.";

const DEFAULT_QUIZ: { key: QuizKey; label: string; correct: boolean }[] = [
  { key: "a", label: "It's required by the LLM API", correct: false },
  { key: "b", label: "So the answer is grounded in a real source it can cite", correct: true },
  { key: "c", label: "To make the UI look more complex", correct: false },
];

// Real embedding models turn text into hundreds or thousands of numbers,
// learned automatically. We can't run one of those in the browser, but the
// underlying mechanism is exactly this: each chunk gets a small numeric
// vector along "meaning" axes, and the query gets compared against every
// chunk with real cosine-similarity math — not by checking whether words
// literally appear in both. Axes: [refunds, password/login, shipping].
const AXES = ["refunds", "password/login", "shipping"] as const;

const KB = [
  {
    id: 1,
    text: "Refunds are processed within 5–7 business days after the return is received.",
    // a long, detailed chunk — big numbers in every direction, not just "refunds"
    vector: [6, 5, 5],
  },
  {
    id: 2,
    text: "Password resets require clicking the emailed link within 30 minutes.",
    vector: [0, 3, 0],
  },
  {
    id: 3,
    text: "Free shipping applies to orders over £50 within the UK only.",
    vector: [0, 0, 3],
  },
];

// A toy "embedder": counts how many words in the query hit each axis's
// keyword set. This stands in for a real embedding model (there's no ML
// model running in the browser) — but everything downstream of this is
// real vector math, computed for real, not string matching.
const AXIS_KEYWORDS = [
  ["refund", "refunds", "return", "returns", "returned", "money", "back", "reimburse"],
  ["password", "passwords", "reset", "resets", "login", "log", "account", "email", "link"],
  ["shipping", "ship", "shipped", "delivery", "deliver", "free", "order", "orders", "postage"],
];

function embed(text: string): number[] {
  const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  return AXIS_KEYWORDS.map((keywords) => words.filter((w) => keywords.includes(w)).length);
}

function dotProduct(a: number[], b: number[]): number {
  let total = 0;
  for (let i = 0; i < a.length; i++) total += a[i] * b[i];
  return total;
}

function magnitude(v: number[]): number {
  return Math.sqrt(dotProduct(v, v));
}

// The actual retrieval math: cosine similarity, not keyword overlap.
// Dividing by both magnitudes is what keeps a long, "big-numbered" chunk
// from automatically beating a short, precisely-on-topic one (see Lesson 2).
function cosineSimilarity(a: number[], b: number[]): number {
  const denom = magnitude(a) * magnitude(b);
  if (denom === 0) return 0;
  return dotProduct(a, b) / denom;
}

function retrieve(query: string) {
  const queryVector = embed(query);
  const scored = KB.map((doc) => ({
    doc,
    dot: dotProduct(queryVector, doc.vector),
    cosine: cosineSimilarity(queryVector, doc.vector),
  }));
  const byCosine = [...scored].sort((a, b) => b.cosine - a.cosine);
  const byDotOnly = [...scored].sort((a, b) => b.dot - a.dot);
  return { queryVector, scored, best: byCosine[0], bestByRawDot: byDotOnly[0] };
}

export default function RagLesson() {
  const s = useFramis();
  const userId = useFramis((st) => st.userId);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [simpler, setSimpler] = useState(false);

  const [query, setQuery] = useState("How long do refunds take?");
  const [result, setResult] = useState<ReturnType<typeof retrieve> | null>(null);

  const [ragQuizPick, setRagQuizPick] = useState<QuizKey | null>(null);
  const [ragDone, setRagDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("lessons")
      .select("id, content, modules!inner(module_number)")
      .eq("modules.module_number", 18)
      .eq("order_index", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setLessonId(data.id);
          setContent(data.content as LessonContent);
        }
      }, () => {});
  }, []);

  useEffect(() => {
    if (!userId || !lessonId || ragQuizPick == null) return;
    const supabase = createClient();
    const quizOptions = content?.quiz.options ?? DEFAULT_QUIZ;
    const correct = quizOptions.find((o) => o.key === ragQuizPick)?.correct ?? false;
    supabase
      .from("user_progress")
      .upsert(
        { user_id: userId, lesson_id: lessonId, quiz_score: correct ? 100 : 0, status: "in_progress" },
        { onConflict: "user_id,lesson_id" },
      )
      .then(() => {}, () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ragQuizPick, userId, lessonId]);

  const markComplete = () => {
    setRagDone(true);
    if (userId && lessonId) {
      const supabase = createClient();
      supabase
        .from("user_progress")
        .upsert(
          { user_id: userId, lesson_id: lessonId, status: "completed", completed_at: new Date().toISOString() },
          { onConflict: "user_id,lesson_id" },
        )
        .then(() => {}, () => {});
    }
  };

  const quizOptions = content?.quiz.options ?? DEFAULT_QUIZ;
  const ragQuizCorrect = quizOptions.find((o) => o.key === ragQuizPick)?.correct ?? false;
  const ragQuizFeedback =
    ragQuizPick == null
      ? ""
      : ragQuizCorrect
        ? "Right. Grounding the answer in a retrieved source is what makes it trustworthy and checkable."
        : "Not quite — think about why you'd bother retrieving text at all before answering.";

  return (
    <div>
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        MODULE 18 · EMBEDDINGS + RAG · LESSON 1 OF {moduleLessonList(18).length}
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        RAG — teaching an LLM to cite its sources
      </h1>
      <div className="mb-[30px] flex flex-wrap items-center gap-3.5">
        <span className="text-[13px] text-ink-500">~25 min hands-on</span>
        <span className="text-line-input">·</span>
        <span className="text-[13px] text-ink-500">One concept. That’s the whole lesson.</span>
        <button
          onClick={() => setSimpler(!simpler)}
          className="ml-auto rounded-full border border-line-input bg-card px-4 py-[7px] font-inter text-[12.5px] font-semibold text-blue"
        >
          {simpler ? "Original explanation" : "Explain it simpler"}
        </button>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[26px]">
        <p className="text-pretty text-[16px]/[1.7]">
          {simpler ? (content?.concept_simpler ?? DEFAULT_SIMPLER) : (content?.concept ?? DEFAULT_CONCEPT)}
        </p>
      </div>

      <RagViz />

      {/* real world */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          IN THE REAL WORLD
        </div>
        <p className="mb-3 text-[15px]/[1.65]">
          A support bot doesn&apos;t memorise your refund policy — it retrieves the actual
          policy doc, then answers from it:
        </p>
        <div className="rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[13.5px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          query → embed → cosine-similarity search(top_k=1) →{" "}
          <span className="text-teal">stuff into prompt</span> → answer
        </div>
      </div>

      {/* mini retrieval sandbox */}
      <div className="mb-[18px] overflow-hidden rounded-[12px] border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="font-inter text-[14px] font-semibold">Try it yourself</span>
        </div>
        <div className="px-5 py-[18px]">
          <div className="mb-3 font-mono text-[11px] font-medium text-ink-500">
            KNOWLEDGE BASE (3 chunks) — each pre-embedded as a toy vector along axes [{AXES.join(", ")}]
          </div>
          <p className="mb-3 text-[13px]/[1.55] text-ink-500">
            Real embeddings have hundreds of dimensions learned by a model; here we use 3 hand-picked
            ones so the math stays visible. Matching happens with real cosine similarity — a dot
            product divided by both vectors&apos; lengths — never by checking whether words literally
            repeat between your question and a chunk.
          </p>
          <div className="mb-4 flex flex-col gap-2">
            {KB.map((doc) => {
              const scored = result?.scored.find((s) => s.doc.id === doc.id);
              const isBest = result?.best.doc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className="rounded-md border border-line-input px-3 py-2 font-mono text-[12.5px] text-ink-700"
                  style={{
                    borderColor: isBest ? "#4B9E8F" : undefined,
                    background: isBest ? "rgba(75,158,143,0.08)" : undefined,
                  }}
                >
                  chunk {doc.id} · {doc.text}
                  <div className="mt-1 text-[11px] text-ink-500">
                    vector [{doc.vector.join(", ")}]
                    {scored ? ` · dot ${scored.dot.toFixed(1)} · cosine ${scored.cosine.toFixed(2)}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-lg border border-line-input bg-transparent px-3.5 py-2.5 font-mono text-[13.5px] text-ink-900"
            />
            <button
              onClick={() => setResult(retrieve(query))}
              className="rounded-[7px] bg-success px-[18px] py-2 font-inter text-[12.5px] font-semibold text-white"
            >
              ▸ Search
            </button>
          </div>
          {result && (
            <div className="mt-3 rounded-lg bg-[#F4F6F9] px-4 py-3 font-mono text-[13px]/[1.6] dark:bg-[#1B2536]">
              <div>query vector (toy embedding) → [{result.queryVector.join(", ")}]</div>
              <div className="mt-1.5">
                retrieved chunk {result.best.cosine > 0.05 ? result.best.doc.id : "—"} (cosine{" "}
                {result.best.cosine.toFixed(2)}) → answer:{" "}
                <span className="text-teal">
                  {result.best.cosine > 0.05
                    ? result.best.doc.text
                    : "no confident match — the model would say so, not guess."}
                </span>
              </div>
              {result.best.cosine > 0.05 && result.bestByRawDot.doc.id !== result.best.doc.id && (
                <div className="mt-1.5 text-[11.5px] text-ink-500">
                  note: raw dot product alone would have picked chunk {result.bestByRawDot.doc.id} instead
                  (dot {result.bestByRawDot.dot.toFixed(1)}) — it just has bigger numbers in every
                  direction. Dividing by vector length (cosine similarity) corrects for that.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* quiz */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-6">
        <div className="mb-3 font-inter text-[13px] font-semibold text-ink-500">
          CHECK YOUR UNDERSTANDING
        </div>
        <div className="mb-4 text-[15px]/[1.6]">
          RAG retrieves the single most relevant chunk before answering. What&apos;s the main reason?
        </div>
        <div className="flex flex-col gap-[9px]">
          {quizOptions.map((qo) => {
            const picked = ragQuizPick === qo.key;
            let border = "var(--color-border-input)";
            let bg = "var(--color-card)";
            let keyColor = "var(--color-ink-500)";
            if (picked && qo.correct) {
              border = "#059669";
              bg = "#E7F5F1";
              keyColor = "#059669";
            }
            if (picked && !qo.correct) {
              border = "#DC2626";
              bg = "#FDF0F0";
              keyColor = "#DC2626";
            }
            return (
              <button
                key={qo.key}
                onClick={() => setRagQuizPick(qo.key)}
                className="flex items-center gap-3 rounded-[9px] px-4 py-[13px] text-left text-[14px] font-medium text-ink-900"
                style={{ border: `1.5px solid ${border}`, background: bg }}
              >
                <span className="font-mono text-[12.5px] font-semibold" style={{ color: keyColor }}>
                  {qo.key})
                </span>
                <span>{qo.label}</span>
              </button>
            );
          })}
        </div>
        <div
          className="mt-3.5 min-h-[20px] text-[14px]/[1.55] font-medium"
          style={{ color: ragQuizCorrect ? "#059669" : "#DC2626" }}
        >
          {ragQuizFeedback}
        </div>
      </div>

      {/* takeaway */}
      <div className="mb-[26px] rounded-[12px] bg-[#E7F5F1] px-7 py-[22px]">
        <div className="mb-2 font-inter text-[13px] font-semibold text-success">
          KEY TAKEAWAY
        </div>
        <p className="text-[15.5px]/[1.6] font-medium text-[#1F2937]">
          Retrieval turns a guess into a citation. If the model can&apos;t point to the chunk it
          used, don&apos;t trust the answer.
        </p>
      </div>

      {/* next */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-ink-500">Next up</div>
          <div className="font-inter text-[15px] font-semibold">
            {nextLessonLabel(14, 1)}
          </div>
        </div>
        <button
          onClick={markComplete}
          className="rounded-[9px] px-[26px] py-3.5 font-inter text-[15px] font-semibold text-white"
          style={{
            background: ragDone ? "#059669" : "#0066CC",
            animation: ragDone ? "framisPulse 1.2s ease-out 2" : "none",
          }}
        >
          {ragDone ? "✓ Lesson complete" : "Mark lesson complete"}
        </button>
      </div>
    </div>
  );
}
