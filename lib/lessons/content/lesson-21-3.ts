import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 3,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Agents Need a Notebook: Building Memory Across Loop Steps",
  minutes: 20,
  concept:
    "An agent loop only works if each step can see what happened in earlier steps — without that, it's not reasoning about progress, it's just repeating the same first move forever. Memory, in its simplest and most common form, is nothing fancier than a list that the loop appends a history entry to on every iteration. Later steps read from that same list — usually just its most recent entry, sometimes the whole thing — to decide what to do next, which is what lets the agent's behavior actually change as the conversation or task progresses. This is different from the state used to track a goal (like a progress counter): history remembers the sequence of what was tried, not just where things currently stand, so a planning function can ask \"what did I just do\" and branch on the answer. The pattern scales from a handful of strings in a list all the way up to production agents storing full transcripts, tool results, and intermediate reasoning — the mechanism is the same accumulate-then-read loop either way.",
  conceptSimpler:
    "It's like a hiker keeping a trail log — before deciding the next move, they flip back to the last entry they wrote, rather than starting every decision from scratch as if they'd just begun the hike.",
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
        "After taking an action, the loop appends a short description of it to history. The list grows by exactly one entry per iteration.",
      code: "history.append(\"asked clarifying question\")\n# history is now: [\"asked clarifying question\"]",
    },
    {
      label: "3. The next step reads the last entry before acting",
      body:
        "Instead of deciding blind, the planning function looks at history[len(history) - 1] — the most recent entry — and picks its next move based on what that was.",
      code: "def recall_last(history):\n    if len(history) == 0:\n        return \"nothing yet\"\n    else:\n        return history[len(history) - 1]",
    },
    {
      label: "4. Behavior changes because memory changes",
      body:
        "Across four iterations, the same planning function returns four different actions — not because its code changed, but because the history list it's reading from grew each time.",
      code: "# step 0: last='nothing yet'          -> next='ask clarifying question'\n# step 1: last='asked clarifying question' -> next='read user reply'\n# step 2: last='read user reply'      -> next='draft answer'\n# step 3: last='draft answer'         -> next='done'",
    },
  ],
  realWorldIntro:
    "A conversational coding assistant does exactly this across a multi-turn session — it appends each tool call and result to a running history, then reads that history back before its next response so it knows not to re-read a file it already opened three turns ago.",
  realWorldCode:
    "history.append(f\"read file: {filename}\")\nlast = history[len(history) - 1]\nif last == f\"read file: {filename}\":\n    print(\"already have this file's contents, skip re-reading it\")",
  sandbox: {
    kind: "code",
    challenge:
      "Accumulate a history list across loop iterations and have each step's plan read the most recent entry before deciding what to do next.",
    starterCode:
      "def recall_last(history):\n    if len(history) == 0:\n        return \"nothing yet\"\n    else:\n        return history[len(history) - 1]\n\ndef plan_next(history):\n    last = recall_last(history)\n    if last == \"nothing yet\":\n        return \"ask clarifying question\"\n    elif last == \"asked clarifying question\":\n        return \"read user reply\"\n    elif last == \"read user reply\":\n        return \"draft answer\"\n    else:\n        return \"done\"\n\nhistory = []\nsteps = 4\n\nfor step in range(steps):\n    last = recall_last(history)\n    action = plan_next(history)\n    print(f\"step {step}: last action was '{last}', so next action is '{action}'\")\n    if action == \"ask clarifying question\":\n        history.append(\"asked clarifying question\")\n    elif action == \"read user reply\":\n        history.append(\"read user reply\")\n    elif action == \"draft answer\":\n        history.append(\"draft answer\")\n    else:\n        history.append(\"done\")\n\nprint(f\"final history: {history}\")",
  },
  quizQuestion:
    "If plan_next(history) were changed to always return \"ask clarifying question\" regardless of what history contains, what would break?",
  quizCode:
    "def plan_next(history):\n    return \"ask clarifying question\"\n\nhistory = []\nfor step in range(4):\n    action = plan_next(history)\n    print(f\"step {step}: {action}\")\n    history.append(action)",
  quizOptions: [
    {
      key: "a",
      label:
        "The loop would still run four times, but every step would take the same action instead of progressing through the conversation, since plan_next would stop reading from history at all",
      correct: true,
    },
    {
      key: "b",
      label:
        "history.append would immediately raise an error because plan_next no longer takes a used parameter",
      correct: false,
    },
    {
      key: "c",
      label:
        "The loop would only run once, since a plan_next that ignores history has no way to signal the loop should continue",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the for-loop's iteration count comes from range(4), not from anything plan_next returns; ignoring history just means the agent repeats the same action every step instead of advancing.",
  quizFeedbackIncorrect:
    "Not quite — an unused function parameter doesn't cause an error, and the loop's length is fixed by range(4) regardless of what plan_next returns; the real symptom is the agent getting stuck repeating one action because it's no longer reading its own history.",
  takeaway:
    "Memory in an agent loop is usually just a list that gets appended to every step and read from on the next one. That accumulate-then-read pattern is what lets an agent's behavior change over time instead of repeating its first move forever.",
};

export default content;
