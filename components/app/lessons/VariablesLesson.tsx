"use client";

import { useEffect, useState } from "react";
import { useFramis, type QuizKey } from "@/lib/store";
import { QUIZ_ANSWERS } from "@/lib/data";
import { moduleLessonList, nextLessonLabel } from "@/lib/lessons";
import { createClient } from "@/lib/supabase/client";
import LessonViz from "../LessonViz";

type LessonContent = {
  concept: string;
  concept_simpler: string;
  quiz: { options: { key: QuizKey; label: string; correct: boolean }[] };
};

export default function VariablesLesson() {
  const s = useFramis();
  const userId = useFramis((st) => st.userId);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("lessons")
      .select("id, content, modules!inner(module_number)")
      .eq("modules.module_number", 2)
      .eq("order_index", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setLessonId(data.id);
          setContent(data.content as LessonContent);
        }
      }, () => {});
  }, []);

  // Persist quiz result once we know both the learner and the lesson row.
  useEffect(() => {
    if (!userId || !lessonId || s.quizPick == null) return;
    const supabase = createClient();
    supabase
      .from("user_progress")
      .upsert(
        { user_id: userId, lesson_id: lessonId, quiz_score: s.quizPick === "b" ? 100 : 0, status: "in_progress" },
        { onConflict: "user_id,lesson_id" },
      )
      .then(() => {}, () => {});
  }, [s.quizPick, userId, lessonId]);

  const markComplete = () => {
    s.completeLesson();
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

  const quizOptions = content?.quiz.options ?? QUIZ_ANSWERS;

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
    <div>
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        MODULE 2 · PYTHON BASICS · LESSON 1 OF {moduleLessonList(2).length}
      </div>
      <h1 className="mb-2.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Variables — storing information
      </h1>
      <div className="mb-[30px] flex flex-wrap items-center gap-3.5">
        <span className="text-[13px] text-ink-500">~40 min hands-on</span>
        <span className="text-line-input">·</span>
        <span className="text-[13px] text-ink-500">
          Variables, the four core types, the operators you’ll use everywhere, and f-strings.
        </span>
        <button
          onClick={s.toggleSimpler}
          className="ml-auto rounded-full border border-line-input bg-card px-4 py-[7px] font-inter text-[12.5px] font-semibold text-blue"
        >
          {s.simpler ? "Original explanation" : "Explain it simpler"}
        </button>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[26px]">
        <p className="text-pretty text-[16px]/[1.7]">
          {s.simpler
            ? (content?.concept_simpler ??
              "A variable is a labelled box. Put a value in. Use the label to get it back later. That’s it — everything else in this lesson is just practising that one move.")
            : (content?.concept ??
              "A variable is like a labelled box. When you write name = “Alex”, you’re writing “Alex” on a sticky note and putting it into a box labelled “name”. Later, any time your code says name, Python walks over to that box and takes the value out.")}
        </p>
      </div>

      <LessonViz />

      {/* data types */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          DATA TYPES: WHAT KIND OF VALUE IS IN THE BOX?
        </div>
        <p className="mb-3 text-[15px]/[1.65]">
          Every value you put in a variable has a <strong>type</strong>. The four
          you’ll use constantly: <code>int</code> (a whole number), <code>float</code>{" "}
          (a number with a decimal point), <code>str</code> (text, wrapped in
          quotes), and <code>bool</code> (exactly one of two values,{" "}
          <code>True</code> or <code>False</code>). Python figures out a value’s
          type automatically from how you write it — you never declare it up
          front. The built-in <code>type()</code> function tells you, for any
          value, exactly which one you’re holding.
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          {`age = 24              # int
price = 19.99         # float
name = "Alex"         # str
is_member = True      # bool

print(type(age))        # <class 'int'>
print(type(price))      # <class 'float'>
print(type(name))       # <class 'str'>
print(type(is_member))  # <class 'bool'>`}
        </div>
      </div>

      {/* arithmetic operators */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          ARITHMETIC OPERATORS
        </div>
        <p className="mb-3 text-[15px]/[1.65]">
          Numbers aren’t much use just sitting in boxes — Python gives you six
          arithmetic operators to combine them: <code>+</code> add,{" "}
          <code>-</code> subtract, <code>*</code> multiply, <code>/</code>{" "}
          divide (always gives you back a <code>float</code>, even when it
          divides evenly), <code>{"//"}</code> floor division (divides, then
          rounds <em>down</em> to a whole number), and <code>%</code> modulo
          (the remainder left over after that division).
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          {`a = 17
b = 5

print(a + b)   # 22
print(a - b)   # 12
print(a * b)   # 85
print(a / b)   # 3.4  -> true division, keeps the decimal
print(a // b)  # 3    -> floor division, rounds down
print(a % b)   # 2    -> what's left over: 17 = 3*5 + 2`}
        </div>
      </div>

      {/* comparison + boolean operators */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          COMPARISON + BOOLEAN OPERATORS
        </div>
        <p className="mb-3 text-[15px]/[1.65]">
          Comparison operators — <code>==</code> equal, <code>!=</code> not
          equal, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>,{" "}
          <code>&gt;=</code> — compare two values and always produce a{" "}
          <code>bool</code>: <code>True</code> or <code>False</code>. Once you
          have a few of those booleans, <code>and</code>, <code>or</code>, and{" "}
          <code>not</code> combine or flip them: <code>and</code> needs both
          sides to be <code>True</code>, <code>or</code> only needs one side,
          and <code>not</code> flips a single value to its opposite.
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          {`age = 20
print(age >= 18)   # True
print(age == 21)   # False
print(age != 21)   # True

is_member = True
is_adult = age >= 18

print(is_member and is_adult)  # True  - both sides are True
print(is_member or is_adult)   # True  - at least one side is True
print(not is_member)           # False - flips True to False`}
        </div>
      </div>

      {/* f-strings */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          STRING FORMATTING WITH F-STRINGS
        </div>
        <p className="mb-3 text-[15px]/[1.65]">
          Gluing strings and variables together with <code>+</code> gets messy
          fast, especially once numbers are involved. An <strong>f-string</strong>{" "}
          — a string literal with an <code>f</code> right before the opening
          quote — lets you drop a variable, or any expression, straight inside{" "}
          <code>{"{ }"}</code> curly braces, and Python fills in its value when
          the string is built. You’ll see <code>{'f"..."'}</code> constantly from
          here on, so it’s worth getting comfortable with it now.
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          {`name = "Priya"
age = 29
print(f"{name} is {age} years old.")
# Priya is 29 years old.

price = 19.99
quantity = 3
print(f"Total: {price * quantity}")
# Total: 59.97`}
        </div>
        <p className="mt-3 text-[15px]/[1.65]">
          One more tool you’ll meet once you’re running real Python on your
          own machine (this browser sandbox can’t take live keyboard input):{" "}
          <code>input()</code> pauses your program, waits for someone to type
          something, and hands back whatever they typed — always as a{" "}
          <code>str</code>, even if it looks like a number. That’s why you’ll
          often see it wrapped in <code>int()</code> or <code>float()</code>{" "}
          to convert it before doing math with it.
        </p>
        <div className="whitespace-pre-wrap rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          {`name = input("What's your name? ")
age = int(input("How old are you? "))
print(f"Hi {name}, next year you'll be {age + 1}.")`}
        </div>
      </div>

      {/* real world */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-[22px]">
        <div className="mb-2.5 font-inter text-[13px] font-semibold text-ink-500">
          IN THE REAL WORLD
        </div>
        <p className="mb-3 text-[15px]/[1.65]">In a restaurant app, you might store:</p>
        <div className="rounded-lg bg-[#F4F6F9] px-[18px] py-3.5 font-mono text-[14px]/[1.7] text-ink-900 dark:bg-[#1B2536]">
          user_name = <span className="text-teal">&quot;Sarah&quot;</span>
          <br />
          order_total = <span className="text-blue">42.50</span>
        </div>
      </div>

      {/* sandbox */}
      <div className="mb-[18px] overflow-hidden rounded-[12px] border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="font-inter text-[14px] font-semibold">Try it yourself</span>
          <div className="flex gap-2">
            <button
              onClick={s.resetCode}
              className="rounded-[7px] border border-line-input bg-card px-[15px] py-2 font-inter text-[12.5px] font-semibold text-ink-500"
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
          <div className="min-h-[170px] flex-[1_1_240px] border-l border-line bg-[#F4F6F9] px-5 py-[18px] dark:bg-[#1B2536]">
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
          Challenge: store your own name and age in variables, then use an
          f-string to print something like “Hi Alex, you are 24 years old!”
        </div>
      </div>

      {/* quiz */}
      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-7 py-6">
        <div className="mb-3 font-inter text-[13px] font-semibold text-ink-500">
          CHECK YOUR UNDERSTANDING
        </div>
        <div className="mb-1.5 text-[15px]/[1.6]">What does this do?</div>
        <div className="mb-4 rounded-lg bg-[#F4F6F9] px-[18px] py-3 font-mono text-[14px]/[1.7] dark:bg-[#1B2536]">
          x = 5<br />y = x + 3
        </div>
        <div className="flex flex-col gap-[9px]">
          {quizOptions.map((qo) => {
            const picked = s.quizPick === qo.key;
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
        <p className="text-[15.5px]/[1.6] font-medium text-[#1F2937]">
          Variables store values you’ll use later — give them clear names so
          future-you remembers what they hold. Every value has a type
          (<code>int</code>, <code>float</code>, <code>str</code>,{" "}
          <code>bool</code>), which <code>type()</code> can always confirm.
          Arithmetic operators (<code>+ - * / // %</code>) combine numbers,
          comparison operators (<code>== != &lt; &gt; &lt;= &gt;=</code>)
          produce booleans, <code>and</code>/<code>or</code>/<code>not</code>{" "}
          combine those booleans, and f-strings (<code>f&quot;...&#123;expr&#125;...&quot;</code>)
          are how you’ll build almost every piece of readable output from here on.
        </p>
      </div>

      {/* next */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[12.5px] text-ink-500">Next up</div>
          <div className="font-inter text-[15px] font-semibold">
            {nextLessonLabel(2, 1)}
          </div>
        </div>
        <button
          onClick={markComplete}
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
