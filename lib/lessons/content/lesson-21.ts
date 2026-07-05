import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 1,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Plan, Act, Check, Repeat: The Shape of Every Agent Loop",
  minutes: 20,
  concept:
    "Every agent loop follows the same three-beat rhythm on each pass through a fixed number of steps: plan, act, check. First the agent decides what to do next — the plan step, often an LLM call reasoning over the current state — then it actually performs that action against the real world, the tool step, like running a command or calling an API. After the tool runs, the loop checks whether the goal condition is now true before deciding whether there's anything left to do. The whole thing lives inside a hard cap on iterations, usually called max_steps, because an agent that keeps planning and acting with no ceiling and no guaranteed convergence can burn time and money forever without ever finishing. Once the goal is met, every remaining iteration should skip the real work instead of quietly re-running tool calls on a job that's already done — re-running a finished task wastes resources and can even undo progress.",
  conceptSimpler:
    "It's like giving someone at most 5 tries to solve a puzzle: each try they think, then move a piece, then check if it's solved — the moment it's solved, they just sit still for whatever tries are left over.",
  vizStages: [
    {
      label: "1. Three actions per step: plan, act, check",
      body:
        "Inside a single iteration, the agent decides what to do (plan), does it (tool call), then checks whether the goal is now satisfied.",
      code:
        "action = plan_step(state)\nresult = tool_step(action)\nif goal_met(state):\n    state[\"done\"] = True",
    },
    {
      label: "2. Wrap it in a bounded loop",
      body:
        "That single step repeats inside a for-loop capped at max_steps — a hard ceiling that guarantees the agent stops eventually even if it never reaches its goal.",
      code:
        "max_steps = 5\nfor step in range(max_steps):\n    action = plan_step(state)\n    result = tool_step(action)",
    },
    {
      label: "3. Skip the real work once the goal is met",
      body:
        "There's no break statement here, so the loop still counts all the way to max_steps. Instead, an if state[\"done\"] check at the top of every iteration turns the leftover passes into no-ops.",
      code:
        "for step in range(max_steps):\n    if state[\"done\"]:\n        print(\"already done, skipping\")\n    else:\n        action = plan_step(state)\n        result = tool_step(action)\n        if goal_met(state):\n            state[\"done\"] = True",
    },
    {
      label: "4. Trace a full run",
      body:
        "With max_steps = 5 and a goal reached on the second pass, the trace shows real work on steps 0 and 1, then three skipped iterations that do nothing but confirm the job is finished.",
      code:
        "# step 0: progress 0 -> 2, not done yet\n# step 1: progress 2 -> 3, goal reached!\n# step 2: already done, skipping\n# step 3: already done, skipping\n# step 4: already done, skipping",
    },
  ],
  realWorldIntro:
    "A coding agent iterating on a failing test suite runs exactly this loop: plan a fix, apply the patch, run the tests, and stop doing real work the moment the check comes back green — capped at, say, 10 attempts so a stubborn bug can't spin the agent forever.",
  realWorldCode:
    "for attempt in range(max_attempts):\n    if state[\"tests_pass\"]:\n        print(\"tests already green, skipping\")\n    else:\n        patch = plan_fix(state)\n        apply_patch(patch)\n        state[\"tests_pass\"] = run_tests()",
  sandbox: {
    kind: "code",
    challenge:
      "Simulate an agent loop that plans, acts, and checks a goal each step, then skips the remaining steps once the goal is already met.",
    starterCode:
      "def plan_step(state):\n    if state[\"progress\"] == 0:\n        return \"search\"\n    else:\n        return \"refine\"\n\ndef tool_step(action):\n    if action == \"search\":\n        return 2\n    elif action == \"refine\":\n        return 1\n    else:\n        return 0\n\ndef goal_met(state):\n    return state[\"progress\"] >= state[\"target\"]\n\nstate = {\"progress\": 0, \"target\": 3, \"done\": False}\nmax_steps = 5\n\nfor step in range(max_steps):\n    if state[\"done\"]:\n        print(f\"step {step}: goal already met, skipping\")\n    else:\n        action = plan_step(state)\n        print(f\"step {step}: plan chose -> {action}\")\n        gained = tool_step(action)\n        state[\"progress\"] = state[\"progress\"] + gained\n        print(f\"step {step}: tool ran, progress is now {state['progress']}\")\n        if goal_met(state):\n            state[\"done\"] = True\n            print(f\"step {step}: goal reached, stopping early\")",
  },
  quizQuestion:
    "This loop has no break statement. Once state[\"done\"] becomes True on step 1, what actually happens on steps 2, 3, and 4?",
  quizCode:
    "for step in range(max_steps):\n    if state[\"done\"]:\n        print(f\"step {step}: skipping\")\n    else:\n        action = plan_step(state)\n        result = tool_step(action)\n        state[\"progress\"] = state[\"progress\"] + result\n        if goal_met(state):\n            state[\"done\"] = True",
  quizOptions: [
    {
      key: "a",
      label:
        "The loop keeps iterating all the way through step 4, but each remaining pass just prints a skip message instead of calling plan_step or tool_step again",
      correct: true,
    },
    {
      key: "b",
      label: "The for loop exits immediately once done becomes True, the same as a break statement would",
      correct: false,
    },
    {
      key: "c",
      label: "plan_step and tool_step still run every remaining iteration, but their results get thrown away",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — without a break statement, range(max_steps) always finishes every iteration; the if state[\"done\"] check just makes each remaining pass a no-op that skips the real work instead of exiting the loop early.",
  quizFeedbackIncorrect:
    "Not quite — this language has no break statement, so the for loop still counts all the way to max_steps; the done check doesn't exit the loop, it just prevents plan_step and tool_step from running again once the goal is already met.",
  takeaway:
    "An agent loop is plan, act, check — repeated inside a hard cap on iterations so it can never run forever. Once the goal check passes, every remaining iteration should skip the real work instead of assuming the loop will stop itself.",
  nextUpLabel: "Human-in-the-Loop + Guardrails",
};

export default content;
