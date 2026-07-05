import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 3,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Agents Need a Notebook (With a Page Limit): Memory and the Context Window",
  minutes: 20,
  concept:
    "An agent loop only works if each step can see what happened in earlier steps — without that, it's not reasoning about progress, it's just repeating the same first move forever. Memory, in its simplest and most common form, is nothing fancier than a list that the loop appends a history entry to on every iteration. Later steps read from that same list — usually just its most recent entry, sometimes the whole thing — to decide what to do next, which is what lets the agent's behavior actually change as the conversation or task progresses. But that history list can't grow forever in a real system: every LLM call re-sends the conversation so far as part of its input, and every model has a finite context window — a hard cap on how many tokens (Module 13's unit for LLM input) it can read in a single call. An agent that runs for dozens or hundreds of loop iterations without ever trimming its history will eventually try to send more than the model can accept, and the call fails outright, or an older, still-relevant piece of context quietly falls out of what actually gets sent. Production agents handle this with a truncation (or summarization) strategy applied before every call: the simplest version keeps only the last N entries, discarding everything older; a better version keeps the very first entry — often the original goal or system instructions — plus the last N, so the agent never forgets what it was originally asked to do even as everything in between gets dropped. Either way, the rule is the same: memory keeps accumulating during the loop, but what gets sent to the model each turn is a bounded, recently-trimmed view of that memory, not the whole unbounded list.",
  conceptSimpler:
    "It's like a hiker keeping a trail log — before deciding the next move, they flip back to the last entry they wrote, rather than starting every decision from scratch. But the notebook only has so many pages: a smart hiker tears out old pages once it fills up, keeping the very first page (the destination) plus just the most recent few, instead of dragging around an ever-growing stack they'll never have time to re-read.",
  vizStages: [
    {
      label: "1. Memory starts as an empty list",
      body:
        "Before the loop runs even once, there's nothing to remember yet — history is just an empty list waiting to be filled in.",
      code: "history = []",
    },
    {
      label: "2. Each step appends what it did",
      body:
        "After taking an action, the loop appends a short description of it to history. The list grows by exactly one entry per iteration, forever, unless something trims it back.",
      code: "history.append(\"asked clarifying question\")\n# history is now: [\"asked clarifying question\"]",
    },
    {
      label: "3. The next step reads the last entry before acting",
      body:
        "Instead of deciding blind, the planning function looks at history[len(history) - 1] — the most recent entry — and picks its next move based on what that was.",
      code: "def recall_last(history):\n    if len(history) == 0:\n        return \"nothing yet\"\n    else:\n        return history[len(history) - 1]",
    },
    {
      label: "4. History keeps growing — but context windows don't",
      body:
        "After enough iterations, history holds every entry the agent has ever produced. Every one of those entries gets re-sent to the model on the next call, and every model has a finite context window it can read in one go.",
      code: "history = [\"a\", \"b\", \"c\", \"d\", \"e\", \"f\", \"g\"]\nprint(f\"history now holds {len(history)} entries and keeps growing every step\")",
    },
    {
      label: "5. Truncate before every call: keep the first entry plus the last N",
      body:
        "The simplest fix keeps only the most recent N entries. A better one keeps the very first entry too — usually the original goal — so the agent never forgets what it was asked to do, even once the middle of its history has aged out.",
      code:
        "def truncate(history, keep_last):\n    if len(history) <= keep_last + 1:\n        return history\n    trimmed = [history[0]]\n    start = len(history) - keep_last\n    for i in range(start, len(history)):\n        trimmed.append(history[i])\n    return trimmed",
    },
  ],
  realWorldIntro:
    "Long-running coding assistants hit this constantly — a session that reads dozens of files and runs dozens of commands generates a transcript far larger than any model's context window, which is why real agent harnesses periodically summarize or drop older turns (while keeping the original task and system prompt intact) instead of ever sending the full, unbounded transcript back to the model.",
  realWorldCode:
    "def truncate(history, keep_last):\n    if len(history) <= keep_last + 1:\n        return history\n    trimmed = [history[0]]\n    start = len(history) - keep_last\n    for i in range(start, len(history)):\n        trimmed.append(history[i])\n    return trimmed\n\nsent_to_model = truncate(history, 5)",
  sandbox: {
    kind: "code",
    challenge:
      "Accumulate a growing history list across many loop iterations, then write a truncate(history, keep_last) function that keeps the first entry (the original goal) plus only the most recent keep_last entries, and use it to bound what gets 'sent to the model' each step.",
    starterCode:
      "def truncate(history, keep_last):\n    if len(history) <= keep_last + 1:\n        return history\n    trimmed = [history[0]]\n    start = len(history) - keep_last\n    for i in range(start, len(history)):\n        trimmed.append(history[i])\n    return trimmed\n\nhistory = []\nhistory.append(\"goal: refactor the payment module\")\n\nsteps = 8\nfor step in range(steps):\n    history.append(f\"step {step}: read file {step}\")\n    sent_to_model = truncate(history, 3)\n    print(f\"step {step}: full history has {len(history)} entries, sending {len(sent_to_model)} to the model\")\n\nprint(f\"final trimmed view: {truncate(history, 3)}\")",
  },
  quizQuestion:
    "This truncate(history, keep_last) function keeps the first entry plus only the last keep_last entries. If you instead wrote a version that just kept the last keep_last entries — dropping the first one too — what real problem would that create for a long-running agent, even though the code still runs fine?",
  quizCode:
    "def truncate_naive(history, keep_last):\n    trimmed = []\n    start = len(history) - keep_last\n    if start < 0:\n        start = 0\n    for i in range(start, len(history)):\n        trimmed.append(history[i])\n    return trimmed\n\nhistory = [\"goal: refactor the payment module\", \"step 0: read file\", \"step 1: read file\", \"step 2: edit file\", \"step 3: run tests\", \"step 4: run tests\"]\nprint(truncate_naive(history, 3))",
  quizOptions: [
    {
      key: "a",
      label:
        "Once the original goal entry ages past the last keep_last slots, it gets dropped entirely — the agent keeps acting, but loses track of what it was originally asked to do",
      correct: true,
    },
    {
      key: "b",
      label: "The function raises an IndexError once history grows past keep_last entries",
      correct: false,
    },
    {
      key: "c",
      label:
        "Nothing different happens — dropping the first entry has no effect, since the agent only ever reads the most recent entry anyway",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — recall_last and most planning logic only look at recent history day to day, so losing the middle rarely matters. But the very first entry is often special — it's the original goal or system instructions — and a truncation strategy that treats it like any other aging entry will eventually drop it, leaving the agent still looping but with no memory of what it was actually trying to accomplish.",
  quizFeedbackIncorrect:
    "Not quite — the index math here is clamped safely (start never goes below 0), so nothing crashes. The real cost is silent: the first entry — often the original goal — ages out just like everything else, and once it's gone the agent keeps looping with no record of what it was originally asked to do.",
  takeaway:
    "Memory in an agent loop is a list that grows every iteration, but LLM context windows are finite — a production agent can't just keep sending an ever-growing transcript. A simple, effective fix is truncating before every call: keep the first entry (the original goal) plus only the most recent N, so old detail falls away but the agent never forgets what it's actually trying to do.",
};

export default content;
