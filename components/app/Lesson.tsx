"use client";

import { useFramis } from "@/lib/store";
import { QUIZ_ANSWERS } from "@/lib/data";
import LessonViz from "./LessonViz";

export default function Lesson() {
  const s = useFramis();

  const outputLines = s.output.length
    ? s.output
    : [{ text: "— run your code to see output here", color: "#9AA3AF" }];

  const quizCorrect = s.quizPick === "b";
  const quizFeedback =
    s.quizPick == null
      ? ""
      : quizCorrect
        ? "Right. x stays 5 — Python copies its value into the maths, then stores 8 in a new box called y."
        : "Not quite — look at which side of the = the maths happens on, then try again.";

  return (
    <div className="max-w-[780px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        MODULE 2 · PYTHON BASICS · LESSON 1 OF 4
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Variables — storing information
      </h1>
      <div className="mb-[30px] flex flex-wrap items-center gap-3.5">
        <span className="text-[13px] text-ink-500">~25 min hands-on</span>
        <span className="text-line-input">·</span>
        <span className="text-[13px] text-ink-500">
          One concept. That’s the whole lesson.
        </span>
        <button
          onClick={s.toggleSimpler}
          className="ml-auto rounded-full border border-line-input bg-white px-4 py-[7px] font-inter text-[12.5px] font-semibold text-blue"
        >
          {s.simpler ? "Original explanation" : "Explain it simpler"}
        </button>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-white px-7 py-[26px]">
        <p className="text-pretty text-[16px]/[1.7]">
          {s.simpler
            ? "A variable is a labelled box. Put a value in. Use the label to get it back later. That’s it — everything else in this lesson is just practising that one move."
            : "A variable is like a labelled box. When you write name = “Alex”, you’re writing “Alex” on a sticky note and putting it into a box labelled “name”. Later, any time your code says name, Python walks over to that box and takes the value out."}
        </p>
      </div>

      <LessonViz />

      {/* real world */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-white px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          IN THE REAL WORLD
        </div>
        <p className="mb-3 text-[15px]/[1.65]">In a restaurant app, you might store:</p>
        <div className="rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900">
          user_name = <span className="text-teal">&quot;Sarah&quot;</span>
          <br />
          order_total = <span className="text-blue">42.50</span>
        </div>
      </div>

      {/* sandbox */}
      <div className="mb-[18px] overflow-hidden rounded-[12px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="font-inter text-[14px] font-semibold">Try it yourself</span>
          <div className="flex gap-2">
            <button
              onClick={s.resetCode}
              className="rounded-[7px] border border-line-input bg-white px-[15px] py-2 font-inter text-[12.5px] font-semibold text-ink-500"
            >
              Reset
            </button>
            <button
              onClick={s.runCode}
              className="rounded-[7px] bg-success px-[18px] py-2 font-inter text-[12.5px] font-semibold text-white"
            >
              ▸ Run
            </button>
          </div>
        </div>
        <div className="flex flex-wrap">
          <textarea
            value={s.code}
            onChange={(e) => s.setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[170px] flex-[1_1_320px] resize-y border-none bg-navy px-5 py-[18px] font-mono text-[14px]/[1.7] text-[#E8EAF0]"
          />
          <div className="min-h-[170px] flex-[1_1_240px] border-l border-line bg-[#F4F6F9] px-5 py-[18px]">
            <div className="mb-2.5 font-mono text-[11px] font-medium text-ink-500">
              OUTPUT
            </div>
            {outputLines.map((line, i) => (
              <div
                key={i}
                className="whitespace-pre-wrap font-mono text-[13.5px]/[1.7]"
                style={{ color: line.color }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#F1E5C9] bg-[#FDF9F0] px-5 py-3 text-[13px] text-[#8A6D1F]">
          Challenge: store your own name and age in variables, then print “Hi
          [name], you are [age]!”
        </div>
      </div>

      {/* quiz */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-white px-7 py-6">
        <div className="mb-3 font-inter text-[13px] font-semibold text-ink-500">
          CHECK YOUR UNDERSTANDING
        </div>
        <div className="mb-1.5 text-[15px]/[1.6]">What does this do?</div>
        <div className="mb-4 rounded-lg bg-[#F4F6F9] px-[18px] py-3 font-mono text-[14px]/[1.7]">
          x = 5<br />y = x + 3
        </div>
        <div className="flex flex-col gap-[9px]">
          {QUIZ_ANSWERS.map((qo) => {
            const picked = s.quizPick === qo.key;
            let border = "#D6DBE3";
            let bg = "#fff";
            let keyColor = "#6B7280";
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
                onClick={() => s.pickQuiz(qo.key)}
                className="flex items-center gap-3 rounded-[9px] px-4 py-[13px] text-left text-[14px] font-medium text-ink-900"
                style={{ border: `1.5px solid ${border}`, background: bg }}
              >
                <span
                  className="font-mono text-[12.5px] font-semibold"
                  style={{ color: keyColor }}
                >
                  {qo.key})
                </span>
                <span>{qo.label}</span>
              </button>
            );
          })}
        </div>
        <div
          className="mt-3.5 min-h-[20px] text-[14px]/[1.55] font-medium"
          style={{ color: quizCorrect ? "#059669" : "#DC2626" }}
        >
          {quizFeedback}
        </div>
      </div>

      {/* takeaway */}
      <div className="mb-[26px] rounded-[12px] bg-[#E7F5F1] px-7 py-[22px]">
        <div className="mb-2 font-inter text-[13px] font-semibold text-success">
          KEY TAKEAWAY
        </div>
        <p className="text-[15.5px]/[1.6] font-medium text-ink-900">
          Variables store values you’ll use later. Give them clear names so
          future-you remembers what they hold.
        </p>
      </div>

      {/* next */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-ink-500">Next up</div>
          <div className="font-inter text-[15px] font-semibold">
            Functions — reusable recipes
          </div>
        </div>
        <button
          onClick={s.completeLesson}
          className="rounded-[9px] px-[26px] py-3.5 font-inter text-[15px] font-semibold text-white"
          style={{
            background: s.lessonDone ? "#059669" : "#0066CC",
            animation: s.lessonDone ? "framisPulse 1.2s ease-out 2" : "none",
          }}
        >
          {s.lessonDone ? "✓ Lesson complete" : "Mark lesson complete"}
        </button>
      </div>
    </div>
  );
}
