import type { LessonData } from "../types";

const content: LessonData = {
  num: 25,
  orderIndex: 4,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "When the Loop Won't Stop: Failure Modes and Recovery",
  minutes: 20,
  concept:
    "Agent loops fail in a small number of recognizable ways, and each one has a matching guardrail. The most basic is the loop that simply never converges — max_steps stops it from running forever, but if the agent never gets closer to the goal, hitting that cap just means it fails loudly instead of quietly. A subtler failure is oscillation, where the agent alternates between two or three actions that undo each other — writing a file, then reverting it, then writing it again — burning steps without ever making net progress. Another common one is repeating an identical failing action, like calling the same broken tool with the same arguments a second and third time expecting a different result. The concrete fix for that one is the same retry-with-backoff loop Module 13 used for LLM rate limits — wrap the call in try/except, wait a little longer between attempts, and break the moment one succeeds — except here it wraps a single tool call inside the agent's loop (a database query that times out, a shell command that fails, a flaky internal API) rather than the LLM call itself, and it needs a hard cap on retries after which the loop stops retrying blindly and escalates instead of hanging the whole agent. Finally there's runaway cost or side effects, where each step is individually reasonable but the loop as a whole does something expensive or destructive many more times than intended — like sending the same email to a user on every retry. Good agent design treats all of these as expected failure modes to detect and handle, not edge cases to hope never happen.",
  conceptSimpler:
    "It's like a GPS that keeps recalculating the same wrong turn — the fix isn't just \"eventually give up,\" it's noticing you're stuck in a loop and trying a genuinely different route, or asking the passenger for help. And if one turn-by-turn instruction just times out because of a bad signal, you don't abandon the trip — you wait a moment and ask again, a couple of times, before pulling over for good.",
  vizStages: [
    {
      label: "Failure mode: max_steps exhausted with no progress",
      body:
        "The loop runs its full allotment of steps but the goal check never passes — progress stayed at 0 the entire time. Hitting the cap is working as designed, but silently returning as if nothing went wrong hides a real problem from whoever is relying on the result.",
      code: "# step 0..4: progress stays at 0, goal never met\n# recovery: when max_steps is reached without success, raise or\n# return an explicit \"did not converge\" status instead of a silent stop",
    },
    {
      label: "Failure mode: oscillation between two actions",
      body:
        "Two steps that individually make sense combine into a cycle that goes nowhere — write, then undo, then write, then undo. Progress at the end of the loop is identical to progress at the start, even though five steps of work happened.",
      code: "# step 0: write_config()   -> progress 1\n# step 1: revert_config()  -> progress 0\n# step 2: write_config()   -> progress 1\n# step 3: revert_config()  -> progress 0\n# recovery: track the last N actions; if a short cycle repeats,\n# break the tie by escalating to a human or trying a third option",
    },
    {
      label: "Failure mode: repeating an identical failing action",
      body:
        "The same tool call fails with the same error three times in a row. Retrying unchanged assumes the failure was random, but a config error or a missing permission won't fix itself just because the agent tries again.",
      code: "# attempt 1: call_api(\"charge_card\") -> Error: invalid_api_key\n# attempt 2: call_api(\"charge_card\") -> Error: invalid_api_key\n# attempt 3: call_api(\"charge_card\") -> Error: invalid_api_key\n# recovery: after 2 identical failures, stop retrying blindly and\n# switch strategy (different tool, different args, or ask for help)",
    },
    {
      label: "Recovery in code: retry a failing TOOL call with backoff",
      body:
        "Module 13 wrapped an LLM API call in try/except with a growing wait between retries. The exact same shape applies mid-agent-loop, but this time it's guarding one tool call, not the model call — a timed-out request is just as recoverable as a rate-limited one.",
      code:
        "wait_seconds = 1\nfor attempt in range(max_retries):\n    try:\n        result = call_tool(request)\n        succeeded = True\n        break\n    except ToolTimeoutError as e:\n        print(f\"attempt {attempt}: {e}, backing off {wait_seconds}s\")\n        wait_seconds = wait_seconds * 2",
    },
    {
      label: "Failure mode: runaway side effects",
      body:
        "Every individual step looks reasonable in isolation, but the loop as a whole triggers a real-world action far more times than intended, because nothing is tracking cumulative side effects across steps.",
      code: "# step 0: send_email(user) -- intended\n# step 1: goal check fails due to a bug, loop retries from step 0\n# step 2: send_email(user) -- duplicate!\n# step 3: send_email(user) -- duplicate!\n# recovery: make side-effecting steps idempotent (e.g. check\n# \"already sent\" before sending) so a retried step is a no-op",
    },
    {
      label: "Recovery pattern: escalate instead of looping forever",
      body:
        "Across every failure mode above, the common fix isn't a smarter retry — it's detecting \"this isn't working\" early and handing control to something outside the loop: a human reviewer, a fallback tool, or a clear error the caller can act on.",
      code: "if attempt_failed_twice_in_a_row(history):\n    print(\"escalating to human review instead of retrying again\")\nelse:\n    retry_with_same_action()",
    },
  ],
  realWorldIntro:
    "Production coding agents guard against exactly this: a well-known failure pattern is an agent that keeps \"fixing\" a test by editing it to match broken behavior instead of fixing the underlying code, oscillating between two states that both look like progress but never actually pass review. The same agents also wrap every individual tool call — reading a file, running a shell command, hitting an internal API — in a retry-with-backoff loop, so one timed-out call doesn't take down or silently hang the whole run, and cap consecutive identical failures to force a strategy change or human check-in.",
  sandbox: {
    kind: "code",
    challenge:
      "Simulate a tool call that sometimes times out mid-agent-loop. Wrap it in try/except, back off a little longer between attempts, and either succeed or give up and escalate after a fixed number of retries — the same retry discipline as Module 13's rate-limit lesson, but guarding a single tool call instead of the LLM API itself.",
    starterCode:
      "def call_tool(outcome):\n    if outcome == \"timeout\":\n        raise ToolTimeoutError(\"tool call timed out after 30s\")\n    return \"tool result: \" + outcome\n\nattempts = [\"timeout\", \"timeout\", \"ok\"]\nsucceeded = False\nattempt = 0\nwait_seconds = 1\n\nfor outcome in attempts:\n    attempt = attempt + 1\n    try:\n        result = call_tool(outcome)\n        succeeded = True\n        print(f\"attempt {attempt}: tool call succeeded -> {result}\")\n        break\n    except ToolTimeoutError as e:\n        print(f\"attempt {attempt}: {e}, backing off {wait_seconds}s before retrying\")\n        wait_seconds = wait_seconds * 2\n\nif succeeded:\n    print(f\"done after {attempt} attempt(s)\")\nelse:\n    print(\"tool call never succeeded, escalating instead of retrying forever\")",
  },
  quizQuestion:
    "A tool call inside the agent loop times out with the exact same error on three consecutive attempts, each with a longer backoff in between. What's the best next move?",
  quizCode:
    "wait_seconds = 1\nfor attempt in range(5):\n    try:\n        result = call_tool(\"timeout\")\n        break\n    except ToolTimeoutError as e:\n        print(f\"attempt {attempt}: {e}\")\n        wait_seconds = wait_seconds * 2",
  quizOptions: [
    {
      key: "a",
      label:
        "Keep retrying the identical call up to max_steps, since some failures are transient and will eventually succeed",
      correct: false,
    },
    {
      key: "b",
      label:
        "After the same failure repeats, stop retrying unchanged and switch strategy — try different arguments, a different tool, or escalate to a human",
      correct: true,
    },
    {
      key: "c",
      label:
        "Lower max_steps to 1 so the agent can never retry anything, regardless of whether the failure is transient or permanent",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a repeated identical timeout is usually a sign of a persistent problem (a dead endpoint, bad credentials, an unreachable service) rather than randomness, so blind retries with backoff alone waste time; detecting the repeat and changing approach or escalating is far more likely to actually resolve it.",
  quizFeedbackIncorrect:
    "Not quite — some failures are transient, but three identical timeouts in a row, even with growing backoff, is a strong signal the problem won't fix itself through repetition; and removing all retries (max_steps = 1) throws away the cases where a genuinely transient timeout would have succeeded on a second try. The better move is detecting the repeat and changing strategy.",
  takeaway:
    "Agent loops fail in predictable ways — non-convergence, oscillation, repeated identical failures, and runaway side effects — and each has a matching guardrail. A failing tool call gets the same try/except-and-backoff treatment Module 13 used for rate limits, just aimed at the tool instead of the LLM. The common thread across every failure mode is detecting \"this isn't working\" early and escalating or changing strategy, rather than trusting the loop to eventually sort itself out.",
};

export default content;
