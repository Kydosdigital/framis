import type { LessonData } from "../types";

const content: LessonData = {
  num: 25,
  orderIndex: 2,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "Orchestration: The Supervisor That Routes Work to the Right Agent",
  minutes: 20,
  concept:
    "A single high-level goal like \"write a blog post about Denver's food scene\" is too vague for any one agent to handle end to end — some parts of the work call for very different skills. Orchestration starts with the same decomposition idea as any planning step: break the goal into an ordered list of subtasks. What makes it orchestration is the next decision — not just what to do, but which agent should do it. A research_agent gathers facts; a writer_agent turns facts into prose; neither one is good at the other's job. The piece of code that makes that decision is called a supervisor or coordinator, and it's structurally identical to Module 15's dispatch(call) — except instead of routing a tool name to a tool function, it routes a subtask's type to whichever agent is equipped to handle that kind of work. Once the supervisor has picked an agent for a subtask, execution is still a for-loop, walking through the subtask list in order, handing each one off, and recording the result before moving to the next. This matters because a single agent juggling every possible skill tends to do all of them a little worse, while a system of specialized agents plus a router that hands off cleanly between them tends to do each part better. In production you would rarely hand-write this router from scratch: frameworks like LangGraph and CrewAI exist specifically to manage multi-agent hand-off, shared state, and routing decisions off the shelf — but the underlying idea, a supervisor deciding who does what, is exactly what you're building a miniature version of here.",
  conceptSimpler:
    "It's like a manager assigning tasks to the right specialist on a team instead of asking one generalist to do everything — the researcher looks things up, the writer turns findings into prose, and the manager's whole job is deciding who gets which task.",
  vizStages: [
    {
      label: "1. One goal, several kinds of subtasks",
      body:
        "Decomposing the goal isn't just a flat list anymore — each subtask also carries a type, because different subtasks call for genuinely different skills, not just a different order.",
      code:
        "subtasks = []\nsubtasks.append({\"task\": \"research neighborhood food scenes\", \"type\": \"research\"})\nsubtasks.append({\"task\": \"write an engaging intro paragraph\", \"type\": \"writing\"})",
    },
    {
      label: "2. A supervisor routes each subtask's type to an agent",
      body:
        "This is a dispatcher in every sense that matters — it just routes on subtask[\"type\"] to an agent function instead of routing a tool name to a tool function.",
      code:
        "def supervisor(subtask):\n    kind = subtask[\"type\"]\n    if kind == \"research\":\n        return research_agent(subtask[\"task\"])\n    elif kind == \"writing\":\n        return writer_agent(subtask[\"task\"])\n    else:\n        raise ValueError(\"no agent for type: \" + kind)",
    },
    {
      label: "3. Execution is still a for-loop, handing off one subtask at a time",
      body:
        "Nothing about running the plan changes — a for-loop walks the subtask list in order, and each iteration hands one subtask to the supervisor instead of executing it directly.",
      code:
        "results = []\nfor i in range(len(subtasks)):\n    outcome = supervisor(subtasks[i])\n    results.append(outcome)",
    },
    {
      label: "4. Real systems reach for a framework, not a hand-rolled router",
      body:
        "The miniature supervisor above is the whole idea in one function. At production scale, multi-agent frameworks like LangGraph and CrewAI provide this routing, plus shared state and hand-off between agents, without you writing the if/elif chain yourself.",
      code:
        "# research_agent(\"research neighborhood food scenes\") -> gathers facts\n# writer_agent(\"write an engaging intro paragraph\") -> drafts prose\n# LangGraph / CrewAI: same supervisor idea, managed for you at scale",
    },
  ],
  realWorldIntro:
    "Multi-agent systems built with LangGraph or CrewAI use exactly this supervisor pattern at a larger scale — a coordinator agent looks at the task queue, decides whether the next step needs a research agent, a coding agent, or a review agent, and hands off full conversational context to whichever one is chosen, instead of asking a single agent to be equally good at researching, coding, and reviewing all at once.",
  realWorldCode:
    "def supervisor(subtask):\n    kind = subtask[\"type\"]\n    if kind == \"research\":\n        return research_agent(subtask[\"task\"])\n    elif kind == \"writing\":\n        return writer_agent(subtask[\"task\"])\n    elif kind == \"review\":\n        return review_agent(subtask[\"task\"])\n    else:\n        raise ValueError(\"no agent for type: \" + kind)",
  sandbox: {
    kind: "code",
    challenge:
      "Write a research_agent and a writer_agent, then a supervisor(subtask) router that hands each subtask off to the right one based on subtask[\"type\"], and run a full subtask list through it.",
    starterCode:
      "def research_agent(task):\n    return \"[research] found facts for: \" + task\n\ndef writer_agent(task):\n    return \"[writer] drafted prose for: \" + task\n\ndef supervisor(subtask):\n    kind = subtask[\"type\"]\n    if kind == \"research\":\n        return research_agent(subtask[\"task\"])\n    elif kind == \"writing\":\n        return writer_agent(subtask[\"task\"])\n    else:\n        raise ValueError(\"no agent for type: \" + kind)\n\nsubtasks = []\nsubtasks.append({\"task\": \"research neighborhood food scenes\", \"type\": \"research\"})\nsubtasks.append({\"task\": \"write an engaging intro paragraph\", \"type\": \"writing\"})\nsubtasks.append({\"task\": \"find 3 highly rated restaurants\", \"type\": \"research\"})\nsubtasks.append({\"task\": \"write the closing paragraph\", \"type\": \"writing\"})\n\nresults = []\nfor i in range(len(subtasks)):\n    subtask = subtasks[i]\n    print(f\"step {i}: handing off -> {subtask['task']} (type: {subtask['type']})\")\n    outcome = supervisor(subtask)\n    results.append(outcome)\n    print(f\"step {i}: {outcome}\")\n\nprint(f\"completed {len(results)} of {len(subtasks)} subtasks\")",
  },
  quizQuestion:
    "Suppose you deleted the supervisor and research_agent entirely, and routed every subtask below — including the research ones — into writer_agent. What's the most likely real-world consequence, even though the code runs without crashing?",
  quizCode:
    "def writer_agent(task):\n    return \"[writer] drafted prose for: \" + task\n\nsubtasks = []\nsubtasks.append({\"task\": \"research neighborhood food scenes\", \"type\": \"research\"})\nsubtasks.append({\"task\": \"write an engaging intro paragraph\", \"type\": \"writing\"})\n\nfor subtask in subtasks:\n    print(writer_agent(subtask[\"task\"]))",
  quizOptions: [
    {
      key: "a",
      label:
        "It still runs and prints something for every subtask, but the research subtasks get prose-writing treatment instead of fact-gathering — the code doesn't crash, but the output quality suffers because the wrong specialist handled the task",
      correct: true,
    },
    {
      key: "b",
      label: "Python raises a TypeError, since writer_agent's parameter doesn't match a research-shaped subtask",
      correct: false,
    },
    {
      key: "c",
      label: "Nothing changes at all, since research_agent and writer_agent do the same thing under the hood",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — this is the real risk orchestration guards against. There's no crash to warn you, since writer_agent runs fine on any string it's handed. The failure is silent and qualitative: a research task run through a writing-only agent produces confident-sounding prose with no actual fact-gathering behind it, which is much harder to catch than a Python error would be.",
  quizFeedbackIncorrect:
    "Not quite — writer_agent takes a single task string and both subtasks provide one, so nothing crashes. The real problem is invisible to Python entirely: routing a research subtask to a writing-only agent just produces well-written prose with no real facts behind it, a quality failure no stack trace will ever show you.",
  takeaway:
    "Orchestration means more than sequencing subtasks — it means deciding which agent should handle each one, and handing off cleanly via a supervisor/router just like Module 15's dispatch(call), but routing to an agent instead of a single function. Production systems reach for frameworks like LangGraph or CrewAI to manage that hand-off, shared state, and routing at scale, but the core idea — a coordinator matching subtask type to specialist agent — is the same one you just built.",
};

export default content;
