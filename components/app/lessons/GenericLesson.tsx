"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { runPythonExt, type OutputLine } from "@/lib/pythonExt";
import { runJsExt } from "@/lib/jsExt";
import { runSqlExt } from "@/lib/sqlExt";
import type { LessonData, QuizOption } from "@/lib/lessons/types";
import { useLessonEngagement } from "@/lib/engagement/useLessonEngagement";
import { lessonEngagementId, moduleEngagementId } from "@/lib/engagement/types";
import { phaseForModule } from "@/lib/engagement/phase";
import StageViz from "./StageViz";
import ExplainerSidebar from "./ExplainerSidebar";

export default function GenericLesson({
  data,
  totalLessons,
  nextUpLabel,
}: {
  data: LessonData;
  totalLessons: number;
  nextUpLabel: string;
}) {
  const userId = useFramis((st) => st.userId);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [simpler, setSimpler] = useState(false);
  const [quizPick, setQuizPick] = useState<QuizOption["key"] | null>(null);
  const [done, setDone] = useState(false);

  const [code, setCode] = useState(data.sandbox.kind === "code" ? data.sandbox.starterCode : "");
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [sandboxAttempted, setSandboxAttempted] = useState(false);

  const engagement = useLessonEngagement(
    lessonEngagementId(data.num, data.orderIndex),
    moduleEngagementId(data.num),
    phaseForModule(data.num),
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("lessons")
      .select("id, modules!inner(module_number)")
      .eq("modules.module_number", data.num)
      .eq("order_index", data.orderIndex)
      .single()
      .then(({ data: row }) => {
        if (row) setLessonId(row.id as number);
      }, () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.num, data.orderIndex]);

  useEffect(() => {
    if (!userId || !lessonId || quizPick == null) return;
    const supabase = createClient();
    const correct = data.quizOptions.find((o) => o.key === quizPick)?.correct ?? false;
    supabase
      .from("user_progress")
      .upsert(
        { user_id: userId, lesson_id: lessonId, quiz_score: correct ? 100 : 0, status: "in_progress" },
        { onConflict: "user_id,lesson_id" },
      )
      .then(() => {}, () => {});
    engagement.trackQuizAttempt(correct ? 100 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizPick, userId, lessonId]);

  const markComplete = () => {
    setDone(true);
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

  const toggleSimpler = () => {
    setSimpler((v) => !v);
    engagement.trackExplainSimplerToggle();
  };

  const runCode = (src: string) => {
    if (!sandboxAttempted) {
      setSandboxAttempted(true);
      engagement.trackSandboxAttempt();
    }
    const language = data.sandbox.kind === "code" ? data.sandbox.language ?? "python" : "python";
    const result = language === "javascript" ? runJsExt(src) : language === "sql" ? runSqlExt(src) : runPythonExt(src);
    const hadError = result.some((line) => line.color === "#DC2626");
    if (!hadError) engagement.trackSandboxComplete();
    return result;
  };


  const quizCorrect = data.quizOptions.find((o) => o.key === quizPick)?.correct ?? false;
  const quizFeedback = quizPick == null ? "" : quizCorrect ? data.quizFeedbackCorrect : data.quizFeedbackIncorrect;

  const outputLines = output.length ? output : [{ text: "— run your code to see output here", color: "#9AA3AF" }];

  const hasExplainers = Boolean(data.explainers && data.explainers.length > 0);

  return (
    <div ref={engagement.containerRef} className={hasExplainers ? "md:flex md:items-start md:gap-6" : ""}>
      <div className={hasExplainers ? "md:w-[65%] md:min-w-0" : ""}>
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        MODULE {data.num} · {data.phaseLabel} · LESSON {data.orderIndex} OF {totalLessons}
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">{data.title}</h1>
      <div className="mb-[30px] flex flex-wrap items-center gap-3.5">
        <span className="text-[13px] text-ink-500">~{data.minutes} min hands-on</span>
        <span className="text-line-input">·</span>
        <span className="text-[13px] text-ink-500">One concept. That’s the whole lesson.</span>
        <button
          onClick={toggleSimpler}
          className="ml-auto rounded-full border border-line-input bg-card px-4 py-[7px] font-inter text-[12.5px] font-semibold text-blue"
        >
          {simpler ? "Original explanation" : "Explain it simpler"}
        </button>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[26px]">
        {(simpler ? data.conceptSimpler : data.concept)
          .split(/\n\n+/)
          .map((para, i) => (
            <p key={i} className={`whitespace-pre-line text-pretty text-[16px]/[1.7]${i > 0 ? " mt-4" : ""}`}>
              {para}
            </p>
          ))}
      </div>

      <StageViz stages={data.vizStages} mode="auto" />

      {/* real world */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">IN THE REAL WORLD</div>
        <p className="mb-3 text-[15px]/[1.65]">{data.realWorldIntro}</p>
        {data.realWorldCode && (
          <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[13.5px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
            {data.realWorldCode}
          </div>
        )}
      </div>

      {/* sandbox */}
      {data.sandbox.kind === "code" ? (
        <div className="mb-[18px] overflow-hidden rounded-[12px] border border-line bg-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="font-inter text-[14px] font-semibold">Try it yourself</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCode(data.sandbox.kind === "code" ? data.sandbox.starterCode : "");
                  setOutput([]);
                }}
                className="rounded-[7px] border border-line-input bg-card px-[15px] py-2 font-inter text-[12.5px] font-semibold text-ink-500"
              >
                Reset
              </button>
              <button
                onClick={() => setOutput(runCode(code))}
                className="rounded-[7px] bg-success px-[18px] py-2 font-inter text-[12.5px] font-semibold text-white"
              >
                ▸ Run
              </button>
            </div>
          </div>
          <div className="flex flex-wrap">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="min-h-[170px] flex-[1_1_320px] resize-y border-none bg-navy px-5 py-[18px] font-mono text-[14px]/[1.7] text-[#E8EAF0]"
            />
            <div className="min-h-[170px] flex-[1_1_240px] border-l border-line bg-[#F4F6F9] px-5 py-[18px] dark:bg-[#1B2536]">
              <div className="mb-2.5 font-mono text-[11px] font-medium text-ink-500">OUTPUT</div>
              {outputLines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap font-mono text-[13.5px]/[1.7]" style={{ color: line.color }}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#F1E5C9] bg-[#FDF9F0] px-5 py-3 text-[13px] text-[#8A6D1F]">
            Challenge: {data.sandbox.challenge}
          </div>
        </div>
      ) : (
        <div className="mb-[18px]">
          <div className="mb-2.5 font-inter text-[14px] font-semibold">Try it yourself</div>
          <p className="mb-3 text-[13.5px]/[1.6] text-ink-500">{data.sandbox.instructions}</p>
          <StageViz stages={data.sandbox.stages} mode="manual" heading="EXPLORE" />
        </div>
      )}

      {/* quiz */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-6">
        <div className="mb-3 font-inter text-[13px] font-semibold text-ink-500">CHECK YOUR UNDERSTANDING</div>
        <div className="mb-1.5 text-[15px]/[1.6]">{data.quizQuestion}</div>
        {data.quizCode && (
          <div className="mb-4 whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3 font-mono text-[14px]/[1.7] dark:bg-[#1B2536]">
            {data.quizCode}
          </div>
        )}
        <div className="mt-4 flex flex-col gap-[9px]">
          {data.quizOptions.map((qo) => {
            const picked = quizPick === qo.key;
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
                onClick={() => setQuizPick(qo.key)}
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
        <div className="mt-3.5 min-h-[20px] text-[14px]/[1.55] font-medium" style={{ color: quizCorrect ? "#059669" : "#DC2626" }}>
          {quizFeedback}
        </div>
      </div>

      {/* takeaway */}
      <div className="mb-[26px] rounded-[12px] bg-[#E7F5F1] px-7 py-[22px]">
        <div className="mb-2 font-inter text-[13px] font-semibold text-success">KEY TAKEAWAY</div>
        <p className="text-[15.5px]/[1.6] font-medium text-[#1F2937]">{data.takeaway}</p>
      </div>

      {/* next */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-ink-500">Next up</div>
          <div className="font-inter text-[15px] font-semibold">{nextUpLabel}</div>
        </div>
        <button
          onClick={markComplete}
          className="rounded-[9px] px-[26px] py-3.5 font-inter text-[15px] font-semibold text-white"
          style={{
            background: done ? "#059669" : "#0066CC",
            animation: done ? "framisPulse 1.2s ease-out 2" : "none",
          }}
        >
          {done ? "✓ Lesson complete" : "Mark lesson complete"}
        </button>
      </div>
      </div>
      {hasExplainers && (
        <ExplainerSidebar
          explainers={data.explainers as NonNullable<LessonData["explainers"]>}
          onExplainerOpen={engagement.trackExplainerOpen}
        />
      )}
    </div>
  );
}
