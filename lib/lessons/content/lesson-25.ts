import type { LessonData } from "../types";

const content: LessonData = {
  num: 25,
  orderIndex: 1,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Plan, Act, Check, Repeat: The ReAct Pattern Behind Every Agent Loop",
  minutes: 20,
  concept:
    "Every agent loop follows the same three-beat rhythm on each pass through a fixed number of steps, and that rhythm has a name: ReAct, short for Reason, Act, Observe. First the agent reasons about what to do next — the plan step, often an LLM call deciding which tool to call and with what arguments, structured exactly like Module 15's tool calls: a dict with a \"name\" field and an \"arguments\" field. Then it acts: that call gets routed through a dispatcher — the very same dispatch(call) pattern from Module 15 — which runs the real function behind the tool's name against the real world, like running a command or calling an API. Finally it observes: the tool's return value is read back and used to check whether the goal condition is now true before deciding whether there's anything left to do. Line up an agent loop's plan/act/check against ReAct's reason/act/observe and they match exactly. The whole thing lives inside a hard cap on iterations, usually called max_steps, because an agent that keeps reasoning and acting with no ceiling and no guaranteed convergence can burn time and money forever without ever finishing. Once the goal is met, break exits the loop immediately instead of quietly re-running tool calls on a job that's already done — re-running a finished task wastes resources and can even undo progress.",
  conceptSimpler:
    "It's like giving someone at most 5 tries to solve a puzzle: each try they think about which move to make (reason), make it (act), then check if it's solved (observe) — the moment it's solved, they just sit still for whatever tries are left over.",
  vizStages: [
    {
      label: "1. ReAct: reason, act, observe",
      body:
        "Reasoning produces the same shape of call you saw in Module 15 — a dict with a name field (which tool) and an arguments field (what to run it with). This is the plan step, just named the way real agent frameworks name it.",
      code:
        "call = reason(state)\nprint(call[\"name\"])       # which tool to run\nprint(call[\"arguments\"])  # what to run it with",
    },
    {
      label: "2. Act means dispatching the call, same as Module 15",
      body:
        "The act step doesn't invent new machinery — it reuses the exact dispatch(call) router from Module 15, matching call[\"name\"] against an if/elif chain of real functions and running the one that matches.",
      code:
        "def dispatch(call, state):\n    name = call[\"name\"]\n    if name == \"search\":\n        return search(state)\n    elif name == \"refine\":\n        return refine(state)\n    else:\n        raise ValueError(\"unknown tool\")",
    },
    {
      label: "3. Wrap reason-act-observe in a bounded loop",
      body:
        "That single reason/act/observe step repeats inside a for-loop capped at max_steps — a hard ceiling that guarantees the agent stops eventually even if it never reaches its goal.",
      code:
        "max_steps = 5\nfor step in range(max_steps):\n    call = reason(state)\n    result = dispatch(call, state)",
    },
    {
      label: "4. break the moment observe confirms the goal",
      body:
        "There's no reason to keep looping once observing the result shows the goal is already satisfied — break exits the for loop immediately, so steps 2, 3, and 4 never run at all, not even as a skipped no-op.",
      code:
        "for step in range(max_steps):\n    call = reason(state)\n    result = dispatch(call, state)\n    if goal_met(state):\n        state[\"done\"] = True\n        break",
    },
  ],
  realWorldIntro:
    "A coding agent iterating on a failing test suite runs exactly this ReAct loop: reason about a fix, act by dispatching a patch-tool call, observe whether tests now pass, and break the instant the check comes back green — capped at, say, 10 attempts so a stubborn bug can't spin the agent forever.",
  realWorldCode:
    "for attempt in range(max_attempts):\n    call = reason(state)\n    result = dispatch(call, state)\n    state[\"tests_pass\"] = run_tests()\n    if state[\"tests_pass\"]:\n        break",
  sandbox: {
    kind: "code",
    challenge:
      "Simulate a ReAct loop: reason about which tool to call, dispatch it (Module 15's pattern), observe the result, and check the goal each step — then break out of the loop the instant the goal is met.",
    starterCode:
      "def search(state):\n    return 2\n\ndef refine(state):\n    return 1\n\ndef dispatch(call, state):\n    name = call[\"name\"]\n    if name == \"search\":\n        return search(state)\n    elif name == \"refine\":\n        return refine(state)\n    else:\n        raise ValueError(\"unknown tool\")\n\ndef reason(state):\n    if state[\"progress\"] == 0:\n        return {\"name\": \"search\", \"arguments\": {}}\n    else:\n        return {\"name\": \"refine\", \"arguments\": {}}\n\ndef goal_met(state):\n    return state[\"progress\"] >= state[\"target\"]\n\nstate = {\"progress\": 0, \"target\": 3}\nmax_steps = 5\n\nfor step in range(max_steps):\n    call = reason(state)\n    print(f\"step {step}: reason chose -> {call['name']}\")\n    gained = dispatch(call, state)\n    state[\"progress\"] = state[\"progress\"] + gained\n    print(f\"step {step}: act + observe done, progress is now {state['progress']}\")\n    if goal_met(state):\n        print(f\"step {step}: goal reached, stopping\")\n        break",
  },
  quizQuestion:
    "This loop breaks the moment the goal is met. If that happens on step 1 (the second iteration, since step starts at 0), what happens on steps 2, 3, and 4?",
  quizCode:
    "for step in range(max_steps):\n    action = plan_step(state)\n    result = tool_step(action)\n    state[\"progress\"] = state[\"progress\"] + result\n    if goal_met(state):\n        print(f\"step {step}: done\")\n        break\n    print(f\"step {step}: not done yet\")",
  quizOptions: [
    {
      key: "a",
      label: "They never run at all — break exits the loop entirely the moment the goal check passes on step 1",
      correct: true,
    },
    {
      key: "b",
      label: "They still run, but plan_step and tool_step's results get thrown away",
      correct: false,
    },
    {
      key: "c",
      label: "They run and print \"not done yet\" each time, since nothing tells the loop to stop early",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — break exits the for loop immediately once the goal is met on step 1; range(max_steps) never gets to produce 2, 3, or 4, so nothing about those steps ever runs.",
  quizFeedbackIncorrect:
    "Not quite — break doesn't just skip the remaining work, it exits the loop entirely. The instant goal_met(state) is true on step 1 and break runs, steps 2, 3, and 4 never happen at all.",
  takeaway:
    "An agent loop is Reason, Act, Observe — ReAct for short — repeated inside a hard cap on iterations so it can never run forever, and broken out of immediately the moment the goal check passes instead of wasting further iterations on a job that's already done. Reason decides a tool call shaped just like Module 15's; act runs it through dispatch; observe reads the result back in to drive the next reason step.",
  nextUpLabel: "Human-in-the-Loop + Guardrails",
};

export default content;
