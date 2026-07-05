import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 2,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Divide and Conquer: Turning One Goal Into Many Subtasks",
  minutes: 20,
  concept:
    "A single high-level goal like \"plan a trip to Denver\" is too vague for an agent to act on directly — there's no one tool call that does that. Multi-step planning is the process of decomposing that goal into an ordered list of smaller, concrete subtasks, each one small enough to map onto a single tool call or reasoning step, like \"search flights\", \"book hotel\", and \"rent car\". Once that list exists, execution becomes mechanical: a for-loop walks through the subtasks in order, running each one and recording whether it succeeded. This separation matters because planning and doing are different kinds of work — planning benefits from seeing the whole goal at once, while execution only needs to know about the one subtask in front of it. It also makes the plan inspectable: you can print, log, or even show a user the full subtask list before a single tool runs, instead of discovering the agent's intentions one action at a time.",
  conceptSimpler:
    "It's like writing a packing list before a trip instead of grabbing random items as you think of them — you decide the whole list up front, then just check items off one by one.",
  vizStages: [
    {
      label: "1. Start with one vague goal",
      body:
        "A goal like \"plan a trip to Denver\" doesn't correspond to any single action an agent can take — it has to be broken down first.",
      code: "goal = \"plan a trip to Denver\"",
    },
    {
      label: "2. Decompose it into an ordered list of subtasks",
      body:
        "Planning produces a list of short, concrete strings, each one small enough to execute on its own. Order matters — later subtasks often depend on earlier ones finishing first.",
      code: "subtasks = [\"search flights\", \"book hotel\", \"rent car\", \"confirm itinerary\"]",
    },
    {
      label: "3. A for-loop executes each subtask in turn",
      body:
        "With the plan already decided, execution is just a for-loop over the list — no more planning happens mid-loop, just running each subtask and recording the outcome.",
      code: "results = []\nfor i in range(len(subtasks)):\n    subtask = subtasks[i]\n    ok = execute_subtask(subtask)\n    results.append(ok)",
    },
    {
      label: "4. The loop keeps going even after a failure",
      body:
        "Because there's no break, one failed subtask (rent car, say) doesn't stop confirm itinerary from being attempted next — the loop just records that one entry as failed and moves on.",
      code: "# search flights: success\n# book hotel: success\n# rent car: failed\n# confirm itinerary: success\n# results = [True, True, False, True]",
    },
  ],
  realWorldIntro:
    "Coding agents like those built on Claude routinely turn a request such as \"add dark mode to the settings page\" into a subtask list — find the settings component, add a theme toggle, wire it to a context provider, update the stylesheet — and then execute that list one file-editing step at a time.",
  realWorldCode:
    "subtasks = [\"locate settings component\", \"add theme toggle\", \"wire context provider\", \"update stylesheet\"]\nfor i in range(len(subtasks)):\n    print(f\"working on: {subtasks[i]}\")",
  sandbox: {
    kind: "code",
    challenge:
      "Build a list of subtask strings for a goal, then use a for-loop to execute each one in order and count how many succeeded.",
    starterCode:
      "def execute_subtask(subtask):\n    if subtask == \"search flights\":\n        return True\n    elif subtask == \"book hotel\":\n        return True\n    elif subtask == \"rent car\":\n        return False\n    else:\n        return True\n\ngoal = \"plan a trip to Denver\"\nsubtasks = [\"search flights\", \"book hotel\", \"rent car\", \"confirm itinerary\"]\n\nresults = []\ncompleted = 0\nfor i in range(len(subtasks)):\n    subtask = subtasks[i]\n    print(f\"step {i}: attempting -> {subtask}\")\n    ok = execute_subtask(subtask)\n    results.append(ok)\n    if ok:\n        completed = completed + 1\n        print(f\"step {i}: done -> {subtask}\")\n    else:\n        print(f\"step {i}: failed -> {subtask}\")\n\nprint(f\"completed {completed} of {len(subtasks)} subtasks for goal: {goal}\")",
  },
  quizQuestion:
    "In this loop, rent car (the third subtask) fails. What happens to search flights and book hotel, which come before it in the list?",
  quizCode:
    "subtasks = [\"search flights\", \"book hotel\", \"rent car\", \"confirm itinerary\"]\nfor i in range(len(subtasks)):\n    ok = execute_subtask(subtasks[i])\n    if ok:\n        print(f\"{subtasks[i]}: success\")\n    else:\n        print(f\"{subtasks[i]}: failed\")",
  quizOptions: [
    {
      key: "a",
      label:
        "Nothing changes for them — they already ran and printed their own success messages before rent car was even attempted, since the loop executes subtasks strictly in list order",
      correct: true,
    },
    {
      key: "b",
      label:
        "The for loop exits as soon as rent car fails, so confirm itinerary never gets attempted",
      correct: false,
    },
    {
      key: "c",
      label:
        "search flights and book hotel get automatically re-run to double-check they weren't affected by the later failure",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a for-loop with no break runs every subtask regardless of earlier outcomes; a failure is just recorded, it doesn't rewind or halt work that already happened.",
  quizFeedbackIncorrect:
    "Not quite — there's no break statement here, so the loop keeps going through confirm itinerary; and earlier subtasks already finished and printed before rent car ever ran, so there's nothing to undo or re-check.",
  takeaway:
    "Multi-step planning means deciding the full list of subtasks before execution starts, then letting a simple for-loop run them in order. Separating \"what's the plan\" from \"run the next subtask\" keeps each part of the agent simple and inspectable.",
};

export default content;
