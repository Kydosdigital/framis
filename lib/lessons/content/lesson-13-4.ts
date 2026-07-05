import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  orderIndex: 4,
  phaseLabel: "LLM APIS + TOKENS + COST",
  title: "Try, Try Again: Surviving Rate Limits in Production",
  minutes: 20,
  concept:
    "Every LLM API caps how many requests (or tokens) you can send in a given window, and once you cross that cap the provider doesn't process your request — it rejects it with a rate-limit error and expects you to slow down. A production integration can't just crash the first time that happens; it needs to catch the error and retry, usually waiting a little longer before each subsequent attempt so it doesn't immediately hit the same wall again, an approach called exponential backoff. The retry loop itself needs a way to stop trying once a call finally succeeds — break exits the loop the instant one attempt works, so you're not burning further attempts (or further waiting) on a problem that's already solved. It's still worth keeping a succeeded flag alongside the break, flipped to True right before it, so that after the loop ends you have a clean answer to \"did it eventually work, or did every attempt fail?\" Wrapping the actual call in try/except lets you catch the specific error type the provider raises, log or count the failure, and let the loop move on to the next attempt instead of crashing the whole program.",
  conceptSimpler:
    "Retrying a rate-limited API is like redialing a phone number that's busy — you don't slam the phone down after one busy signal, you hang up, wait a bit, and try again, giving up only after a reasonable number of attempts.",
  vizStages: [
    {
      label: "1. The provider says \"slow down\"",
      body:
        "Cross the rate limit and the API doesn't return a normal response — it returns an error signaling you sent too many requests too fast.",
      code: "raise RateLimitError(\"429: too many requests\")",
    },
    {
      label: "2. Catch it instead of crashing",
      body:
        "Wrapping the call in try/except means a rate-limit error gets handled in code, not by crashing the whole program.",
      code: "try:\n    response = call_api(request)\nexcept RateLimitError as e:\n    print(\"rate limited:\", e)",
    },
    {
      label: "3. break out of the loop the moment a call succeeds",
      body:
        "Once a call actually works, there's no reason to keep retrying — break exits the loop immediately, before it ever reaches the remaining attempts. Flipping succeeded to True right before the break still gives you a clean record to check once the loop is over.",
      code: "succeeded = False\nfor attempt in attempts:\n    try:\n        response = call_api(attempt)\n        succeeded = True\n        break\n    except RateLimitError as e:\n        print(\"retrying after\", e)",
    },
    {
      label: "4. Back off a little longer each time",
      body:
        "Real systems don't retry instantly — they wait longer after each failure (1 second, then 2, then 4...) so a struggling API isn't immediately hit with the exact same burst of traffic again.",
      code: "wait_seconds = 2 ** tries\nprint(f\"waiting {wait_seconds}s before retrying\")",
    },
  ],
  realWorldIntro:
    "Both the OpenAI and Anthropic SDKs retry rate-limit and server errors automatically with exponential backoff by default, and production code that calls these APIs directly (or through a custom client) needs the same try/except-and-retry pattern to stay reliable under load.",
  sandbox: {
    kind: "code",
    challenge:
      "Simulate calling a flaky API across a fixed list of attempt outcomes, retrying with try/except until one succeeds, then break out of the loop the instant it does.",
    starterCode:
      "def call_api(result):\n    if result == \"error\":\n        raise RateLimitError(\"429: too many requests\")\n    return \"ok: \" + result\n\nattempts = [\"error\", \"error\", \"success\"]\nsucceeded = False\ntries = 0\n\nfor result in attempts:\n    tries = tries + 1\n    try:\n        response = call_api(result)\n        succeeded = True\n        print(f\"try {tries} succeeded: {response}\")\n        break\n    except RateLimitError as e:\n        print(f\"try {tries} failed: {e}\")\n\nif succeeded:\n    print(f\"done after {tries} attempt(s)\")\nelse:\n    print(\"all retries exhausted, giving up\")",
  },
  quizQuestion:
    "This retry loop runs over a fixed list of attempt outcomes. How many times does tries get incremented, and what happens to the loop once a call succeeds?",
  quizCode:
    "def call_api(result):\n    if result == \"error\":\n        raise RateLimitError(\"429\")\n    return \"ok\"\n\nattempts = [\"error\", \"success\", \"success\"]\nsucceeded = False\ntries = 0\n\nfor result in attempts:\n    tries = tries + 1\n    try:\n        response = call_api(result)\n        succeeded = True\n        break\n    except RateLimitError as e:\n        print(f\"retrying after {e}\")\n\nprint(tries)",
  quizOptions: [
    {
      key: "a",
      label:
        "2 — the first attempt fails and the second succeeds, then break exits the loop immediately, so the third \"success\" in the list is never even visited",
      correct: true,
    },
    {
      key: "b",
      label: "3 — tries increments once for every item in attempts regardless of whether a call already succeeded",
      correct: false,
    },
    {
      key: "c",
      label: "1 — the loop stops after the very first attempt, since call_api raises an error immediately",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the first attempt raises and is caught (tries becomes 1), the second attempt succeeds (tries becomes 2) and immediately hits break, which exits the loop right there — the third \"success\" later in the list is never even reached.",
  quizFeedbackIncorrect:
    "Not quite — walk it through: the first attempt raises and is caught (tries becomes 1), the second attempt succeeds (tries becomes 2) and then hits break, which exits the loop immediately — the third item in attempts is never visited at all, so tries stops at 2.",
  takeaway:
    "Handling rate limits in production means catching the specific error with try/except, retrying with a growing delay between attempts, and breaking out of the retry loop the instant a call finally succeeds instead of wasting further attempts on a problem that's already solved.",
};

export default content;
