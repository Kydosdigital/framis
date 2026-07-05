import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 4,
  phaseLabel: "AGENTS + ORCHESTRATION",
  title: "When the Loop Won't Stop: Failure Modes and Recovery",
  minutes: 20,
  concept:
    "Agent loops fail in a small number of recognizable ways, and each one has a matching guardrail. The most basic is the loop that simply never converges — max_steps stops it from running forever, but if the agent never gets closer to the goal, hitting that cap just means it fails loudly instead of quietly. A subtler failure is oscillation, where the agent alternates between two or three actions that undo each other — writing a file, then reverting it, then writing it again — burning steps without ever making net progress. Another common one is repeating an identical failing action, like calling the same broken tool with the same arguments a second and third time expecting a different result; the fix is detecting the repeat and forcing a different action or an escalation instead of trying again unchanged. Finally there's runaway cost or side effects, where each step is individually reasonable but the loop as a whole does something expensive or destructive many more times than intended — like sending the same email to a user on every retry. Good agent design treats all of these as expected failure modes to detect and handle, not edge cases to hope never happen.",
  conceptSimpler:
    "It's like a GPS that keeps recalculating the same wrong turn — the fix isn't just \"eventually give up,\" it's noticing you're stuck in a loop and trying a genuinely different route, or asking the passenger for help.",
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
    "Production coding agents guard against exactly this: a well-known failure pattern is an agent that keeps \"fixing\" a test by editing it to match broken behavior instead of fixing the underlying code, oscillating between two states that both look like progress but never actually pass review — which is why many agent harnesses cap consecutive identical edits and force a strategy change or human check-in after repeated failures.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each failure mode to see what it looks like in a trace and what recovery strategy addresses it.",
    stages: [
      {
        label: "Max steps exhausted with no progress",
        body:
          "The loop runs its full allotment of steps but the goal check never passes — progress stayed at 0 the entire time. Hitting the cap is working as designed, but silently returning as if nothing went wrong hides a real problem from whoever is relying on the result.",
        code: "# step 0..4: progress stays at 0, goal never met\n# recovery: when max_steps is reached without success, raise or\n# return an explicit \"did not converge\" status instead of a silent stop",
      },
      {
        label: "Oscillation between two actions",
        body:
          "Two steps that individually make sense combine into a cycle that goes nowhere — write, then undo, then write, then undo. Progress at the end of the loop is identical to progress at the start, even though five steps of work happened.",
        code: "# step 0: write_config()   -> progress 1\n# step 1: revert_config()  -> progress 0\n# step 2: write_config()   -> progress 1\n# step 3: revert_config()  -> progress 0\n# recovery: track the last N actions; if a short cycle repeats,\n# break the tie by escalating to a human or trying a third option",
      },
      {
        label: "Repeating an identical failing action",
        body:
          "The same tool call fails with the same error three times in a row. Retrying unchanged assumes the failure was random, but a config error or a missing permission won't fix itself just because the agent tries again.",
        code: "# attempt 1: call_api(\"charge_card\") -> Error: invalid_api_key\n# attempt 2: call_api(\"charge_card\") -> Error: invalid_api_key\n# attempt 3: call_api(\"charge_card\") -> Error: invalid_api_key\n# recovery: after 2 identical failures, stop retrying blindly and\n# switch strategy (different tool, different args, or ask for help)",
      },
      {
        label: "Runaway side effects",
        body:
          "Every individual step looks reasonable in isolation, but the loop as a whole triggers a real-world action far more times than intended, because nothing is tracking cumulative side effects across steps.",
        code: "# step 0: send_email(user) -- intended\n# step 1: goal check fails due to a bug, loop retries from step 0\n# step 2: send_email(user) -- duplicate!\n# step 3: send_email(user) -- duplicate!\n# recovery: make side-effecting steps idempotent (e.g. check\n# \"already sent\" before sending) so a retried step is a no-op",
      },
      {
        label: "Escalate instead of looping forever",
        body:
          "Across every failure mode above, the common fix isn't a smarter retry — it's detecting \"this isn't working\" early and handing control to something outside the loop: a human reviewer, a fallback tool, or a clear error the caller can act on.",
        code: "if attempt_failed_twice_in_a_row(history):\n    print(\"escalating to human review instead of retrying again\")\nelse:\n    retry_with_same_action()",
      },
    ],
  },
  quizQuestion:
    "An agent's tool call fails with the exact same error on three consecutive attempts. What's the best recovery strategy?",
  quizCode:
    "for attempt in range(5):\n    result = call_api(\"charge_card\")\n    if result == \"success\":\n        break",
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
    "Right — a repeated identical error is usually a sign of a persistent problem (bad credentials, wrong arguments) rather than randomness, so blind retries waste steps; detecting the repeat and changing approach or escalating is far more likely to actually resolve it.",
  quizFeedbackIncorrect:
    "Not quite — some failures are transient, but three identical errors in a row is a strong signal the problem won't fix itself through repetition; and removing all retries (max_steps = 1) throws away the cases where a genuinely transient failure would have succeeded on a second try. The better move is detecting the repeat and changing strategy.",
  takeaway:
    "Agent loops fail in predictable ways — non-convergence, oscillation, repeated identical failures, and runaway side effects — and each has a matching guardrail. The common thread is detecting \"this isn't working\" early and escalating or changing strategy, rather than trusting the loop to eventually sort itself out.",
};

export default content;
