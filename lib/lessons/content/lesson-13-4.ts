import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  orderIndex: 4,
  phaseLabel: "LLM APIS + TOKENS + COST",
  title: "Try, Try Again: Surviving Rate Limits in Production",
  minutes: 20,
  concept:
    "Every LLM API caps how many requests (or tokens) you can send in a given window, and once you cross that cap the provider doesn't process your request — it rejects it with a rate-limit error and expects you to slow down. A production integration can't just crash the first time that happens; it needs to catch the error and retry, usually waiting a little longer before each subsequent attempt so it doesn't immediately hit the same wall again, an approach called exponential backoff. The retry loop itself needs a way to stop trying once a call finally succeeds — in languages with a break statement you'd just break out of the loop, but the same idea works with a boolean flag: set succeeded to False before the loop, and only attempt the call when the flag is still False, flipping it to True the moment one attempt works. Wrapping the actual call in try/except lets you catch the specific error type the provider raises, log or count the failure, and let the loop move on to the next attempt instead of crashing the whole program.",
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
      label: "3. No break, so use a flag instead",
      body:
        "This language has no break statement, so the loop can't just exit early. A succeeded flag does the same job: once it flips to True, the if-guard skips the call on every remaining iteration.",
      code: "succeeded = False\nfor attempt in attempts:\n    if not succeeded:\n        # try the call here",
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
      "Simulate calling a flaky API across a fixed list of attempt outcomes, retrying with try/except until one succeeds — using a success flag instead of break, since this language has no break.",
    starterCode:
      "def call_api(result):\n    if result == \"error\":\n        raise RateLimitError(\"429: too many requests\")\n    return \"ok: \" + result\n\nattempts = [\"error\", \"error\", \"success\"]\nsucceeded = False\ntries = 0\n\nfor result in attempts:\n    if not succeeded:\n        tries = tries + 1\n        try:\n            response = call_api(result)\n            succeeded = True\n            print(f\"try {tries} succeeded: {response}\")\n        except RateLimitError as e:\n            print(f\"try {tries} failed: {e}\")\n\nif succeeded:\n    print(f\"done after {tries} attempt(s)\")\nelse:\n    print(\"all retries exhausted, giving up\")",
  },
  quizQuestion:
    "This retry loop runs over a fixed list of attempt outcomes. How many times does tries get incremented before the loop finishes, and why doesn't it keep counting after the success?",
  quizCode:
    "def call_api(result):\n    if result == \"error\":\n        raise RateLimitError(\"429\")\n    return \"ok\"\n\nattempts = [\"error\", \"success\", \"success\"]\nsucceeded = False\ntries = 0\n\nfor result in attempts:\n    if not succeeded:\n        tries = tries + 1\n        try:\n            response = call_api(result)\n            succeeded = True\n        except RateLimitError as e:\n            print(f\"retrying after {e}\")\n\nprint(tries)",
  quizOptions: [
    {
      key: "a",
      label:
        "2 — the loop still visits every item in attempts, but once succeeded is True the if-guard stops the body from running, so tries stops climbing",
      correct: true,
    },
    {
      key: "b",
      label: "3 — tries increments once for every item in attempts regardless of whether the call already succeeded",
      correct: false,
    },
    {
      key: "c",
      label: "1 — the loop stops iterating entirely the instant succeeded becomes True, like a break statement would",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the loop still runs for all three items in attempts since there's no break, but the if not succeeded guard means the third iteration's body never executes, so tries only reaches 2, incrementing on the \"error\" attempt and the first \"success\" attempt.",
  quizFeedbackIncorrect:
    "Not quite — the for loop keeps visiting every item in attempts since this language has no break, but the if not succeeded guard prevents the body (and the tries increment) from running once succeeded is True, so the count stops at 2, not 1 or 3.",
  takeaway:
    "Handling rate limits in production means catching the specific error with try/except, retrying with a growing delay between attempts, and — without a break statement — using a success flag to guard the retry logic so a working call stops future attempts from doing anything.",
};

export default content;
