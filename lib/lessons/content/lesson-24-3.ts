import type { LessonData } from "../types";

const content: LessonData = {
  num: 24,
  orderIndex: 3,
  phaseLabel: "AI PRODUCT DESIGN + EDGE CASES",
  title: "Latency as a feature: what to show while the model thinks",
  minutes: 18,
  concept:
    "Model inference isn't instant — a good answer can take anywhere from a few hundred milliseconds to several seconds — and users notice the wait long before it becomes an actual complaint. What determines whether that wait feels acceptable isn't just the total time, it's what the interface shows during it: a blank screen with a spinner makes even a one-second wait feel uncertain and stalled, while text streaming in as it's generated makes a much longer total wait feel fast, because the user is watching visible progress instead of staring at nothing. The metric to design around is time-to-first-token, not total completion time — the moment something appears on screen resets a user's sense of \"is this working,\" even if the full response takes several more seconds to finish. For multi-step AI work — searching, retrieving documents, then drafting an answer — showing what stage is happening (\"searching your documents…\", \"reading 4 sources…\", \"writing your answer…\") does the same job at a coarser grain, turning an opaque wait into a visible, legible process. The one hard rule underneath all of it: whatever you show has to reflect what's actually happening, because a progress indicator that lies — one that races to 90% and then stalls, or a status message that doesn't match the real step — destroys more trust than a plain, honest spinner ever would.",
  conceptSimpler:
    "It's the difference between a restaurant kitchen you can watch through a window and one sealed behind a closed door — the food takes the same time either way, but watching it get made makes the wait feel shorter and the result feel more trustworthy.",
  vizStages: [
    {
      label: "1. Same total time, different feel",
      body:
        "Both versions below take four seconds to fully generate. One shows nothing until the end; the other shows the first word almost immediately. Users describe them as completely different experiences.",
      code: '// version A: blocking\n[spinner for 4.0s] -> "Your refund was processed on..."\n\n// version B: streaming\n[first token at 0.3s] "Your" "refund" "was" "processed" ... (finishes at 4.0s)',
    },
    {
      label: "2. The metric that actually matters: time-to-first-token",
      body:
        "Total completion time and time-to-first-token are different numbers that can move independently. Streaming can cut time-to-first-token by 90% without changing total generation time at all.",
      code: 'total_completion_time = 4.0s        // unchanged\ntime_to_first_token   = 0.3s (streaming) vs 4.0s (blocking)\n// this is the number users actually feel',
    },
    {
      label: "3. Staged status for multi-step work",
      body:
        "When an answer requires search and retrieval before generation even starts, a single spinner hides three very different kinds of waiting. Naming each stage turns an opaque delay into a legible one.",
      code: '"Searching your documents…"     (0.0s - 1.2s)\n"Found 4 relevant sections…"    (1.2s - 1.4s)\n"Writing your answer…"          (1.4s - 4.0s, streaming)',
    },
    {
      label: "4. The rule: never fake progress",
      body:
        "A progress bar that jumps to 80% in half a second and then sits there for six seconds is worse than no bar at all — the first time a user notices it lying, they stop trusting every progress indicator the product ever shows again.",
      code: '// anti-pattern: bar reaches 80% instantly, stalls\n// real state never matched what was displayed\nprogress: 0% -> 80% (0.1s) -> 80% (6s, no movement) -> 100% (done)',
    },
  ],
  realWorldIntro:
    "OpenAI's decision to stream ChatGPT's responses token-by-token, rather than waiting for the full completion and printing it all at once, is widely credited as a major reason the product felt fast and alive from launch — even though the underlying model latency was comparable to earlier chatbots that returned one large, delayed block of text.",
  realWorldCode:
    '// blocking: nothing rendered until the full response is ready\nconst response = await client.chat.completions.create({ ...params, stream: false });\nrender(response.choices[0].message.content);\n// user stares at a spinner for the entire generation\n\n// streaming: tokens rendered as they arrive\nconst stream = await client.chat.completions.create({ ...params, stream: true });\nfor await (const chunk of stream) {\n  appendToUI(chunk.choices[0].delta.content ?? "");\n}\n// first token appears around 300ms; user starts reading while the rest generates',
  sandbox: {
    kind: "explore",
    instructions:
      "Click through five stages of the same chat request to see how the interface, not the model's actual speed, determines whether a four-second wait feels instant or endless.",
    stages: [
      {
        label: "Stage 1: the blocking wait",
        body:
          'A spinner fills the screen for the full four seconds with no other feedback. The user has no way to tell whether the request is progressing, stuck, or has silently failed — four seconds of total ambiguity feels much longer than four seconds of visible motion.',
      },
      {
        label: "Stage 2: streaming tokens",
        body:
          'The same four-second request now shows its first word at roughly 300 milliseconds, then continues appearing word by word. Total time hasn\'t changed, but the user starts reading immediately instead of waiting to start — the wait is filled with content instead of being empty.',
      },
      {
        label: "Stage 3: staged status for a multi-step answer",
        body:
          'A retrieval-augmented answer shows "Searching your documents…" for the first 1.2 seconds, then "Found 4 relevant sections…" briefly, then streams the written answer. Each label matches something real that\'s actually happening behind it, so the wait reads as a process rather than a delay.',
      },
      {
        label: "Stage 4: skeleton UI for structured output",
        body:
          'When the output is a table or chart rather than prose, a generic spinner is a worse match than a skeleton — gray placeholder rows and columns in the exact shape the final table will take, filling in as each row of real data arrives, so the user can see the shape of what\'s coming before the numbers land.',
      },
      {
        label: "Stage 5: the anti-pattern — a progress bar that lies",
        body:
          'A bar jumps to 80% in the first tenth of a second (to look responsive), then sits frozen at 80% for six more seconds while the real work happens. Once a user notices that pattern, they learn the bar is decorative rather than informative, and stop trusting it — including on requests where it would have been accurate.',
      },
    ],
  },
  quizQuestion:
    "Two versions of the same chat feature both take four seconds on average to fully generate a response. Version A shows a spinner until the full text is ready; version B streams tokens starting at 300ms. Users report version B feels \"much faster.\" What actually changed?",
  quizCode:
    'version A: [spinner, 4.0s] -> full text appears\nversion B: [first token, 0.3s] -> text streams in -> done at 4.0s',
  quizOptions: [
    {
      key: "a",
      label: "The model's total latency was reduced in version B",
      correct: false,
    },
    {
      key: "b",
      label:
        "Time-to-first-token dropped, so users saw visible progress almost immediately even though total completion time didn't change",
      correct: true,
    },
    {
      key: "c",
      label: "Version B must be running on a smaller, faster model than version A",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — total generation time is identical in both versions; what changed is time-to-first-token, and seeing visible progress within a few hundred milliseconds is what makes a wait feel short, regardless of how long the full response actually takes to finish.",
  quizFeedbackIncorrect:
    "Not quite — nothing about the model's actual speed changed between the two versions; both take four seconds end-to-end. The entire perceived speedup comes from streaming showing the first token far sooner, not from faster generation.",
  takeaway:
    "Perceived speed is a design decision, not just an inference-speed number. Shipping honest, early, visible progress — streamed tokens, real staged status, matching skeleton screens — can matter more to how fast your product feels than shaving actual milliseconds off the model call.",
};

export default content;
