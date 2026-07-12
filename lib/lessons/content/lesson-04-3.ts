import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 3,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "Fail loudly, on purpose: raising your own errors",
  minutes: 18,
  concept:
    "Every error you've handled so far was one Python raised for you — a missing key, a missing file. But plenty of real bugs come from bad values your own code lets through: a discount of 150%, a temperature below the coldest possible, a withdrawal bigger than the balance. Python has no idea these are wrong — it will happily do the maths and hand back a negative price with no warning at all.\n\n" +
    "The fix is to raise an error yourself. raise ValueError(\"a clear message\") stops the function on the spot and reports what went wrong, in your own words, the instant you spot the bad input — instead of letting a wrong number flow on and quietly corrupt everything after it.\n\n" +
    "Think of a smoke alarm. The whole point is that it screams the instant it smells smoke, so you deal with a small problem early. The alternative is a house that quietly fills with smoke while everyone assumes things are fine — until it's a disaster. raise is the smoke alarm; a missing check is the silent, smoke-filling house.\n\n" +
    "This is called failing loudly, and it's almost always better than failing silently. A crash with a clear message can be found and fixed in seconds. A wrong number that slips through five more functions might not surface until someone downstream notices the totals don't add up.\n\n" +
    "And an error you raise yourself behaves exactly like one Python raises: whoever calls your function can wrap the call in try / except and handle it — show a friendly message, or try something else — instead of the program crashing.",
  conceptSimpler:
    "It's the difference between a smoke alarm and a quiet house fire.\n\n" +
    "raise ValueError(\"...\") is the alarm: the moment your code spots a value that can't be right — a 150% discount, a negative age — it stops and says so, loudly and clearly.\n\n" +
    "The alternative is staying silent while a wrong number drifts through the rest of your program, only noticed much later when something's already gone wrong.",
  vizStages: [
    {
      label: "1. The silent wrong answer",
      body:
        "compute_discount happily multiplies by any percent it's given — even 150%, which can't be a real discount. There's no check, so it just returns -25, a negative price, with no warning at all.",
      code: "def compute_discount(price, percent):\n    return price - price * percent / 100\n\nprint(compute_discount(50, 150))",
    },
    {
      label: "2. Add a check that raises",
      body:
        "raise ValueError(...) lets the function refuse to go on the moment it sees an impossible percent, reporting the problem in a clear message instead of quietly computing garbage. This stops the program with a ValueError.",
      code: 'def compute_discount(price, percent):\n    if percent > 100:\n        raise ValueError("percent cannot be over 100")\n    return price - price * percent / 100\n\nprint(compute_discount(50, 150))',
    },
    {
      label: "3. Normal input still sails through",
      body:
        "The check only fires when something's actually wrong. A sensible percent like 20 passes straight through, and the function returns the correct discounted price — 40.",
      code: "print(compute_discount(50, 20))",
    },
    {
      label: "4. Your own error is caught the same way",
      body:
        "An error you raise behaves exactly like one Python raises — the caller can wrap the call in try / except ValueError, catch it (as e captures the message), and print a friendly note instead of crashing. This prints \"bad discount: percent cannot be over 100\".",
      code: 'try:\n    compute_discount(50, 150)\nexcept ValueError as e:\n    print("bad discount:", e)',
    },
  ],
  realWorldIntro:
    "It's why a good app refuses a bad value on the spot instead of trusting it. A shop's till that raises an error the instant someone tries a 150%-off coupon — rather than quietly charging a negative amount and only noticing when the day's takings don't add up — is doing exactly this: failing loudly, early, where the mistake is easy to find.",
  realWorldCode: 'if amount < 0:\n    raise ValueError("amount cannot be negative")',
  sandbox: {
    kind: "code",
    challenge:
      "withdraw() currently lets a balance go negative without complaint. Add a check that raises a ValueError with a clear message when amount is greater than balance, so an overdraft fails loudly instead of quietly succeeding.",
    starterCode:
      "def withdraw(balance, amount):\n    return balance - amount\n\nprint(withdraw(100, 40))\nprint(withdraw(20, 40))",
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'def set_temperature(degrees):\n    if degrees < -273:\n        raise ValueError("below absolute zero")\n    return degrees\n\ntry:\n    set_temperature(-300)\nexcept ValueError as e:\n    print("rejected:", e)',
  quizOptions: [
    { key: "a", label: "rejected: below absolute zero", correct: true },
    { key: "b", label: "The program crashes with an uncaught ValueError", correct: false },
    { key: "c", label: "-300", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — set_temperature raises a ValueError because -300 is below -273, but the try / except around the call catches it and prints the friendly \"rejected: ...\" message instead of letting the program crash.",
  quizFeedbackIncorrect:
    "Not quite — set_temperature does raise a ValueError for -300, but except ValueError as e catches it before it can crash anything, so the output is the handled message \"rejected: below absolute zero\".",
  takeaway:
    "When your own code can spot a bad value, don't let it quietly produce a wrong answer — raise ValueError(\"...\") (or another fitting error) with a clear message, like a smoke alarm going off the instant it smells trouble. A loud, immediate crash you can read beats a silent wrong number that surfaces days later.",
  explainers: [
    {
      id: "what-is-raise",
      term: "What Does raise Do?",
      emoji: "🚨",
      shortDef: "raise makes an error happen on purpose, stopping the code and reporting a message you wrote.",
      longDef:
        "raise ValueError(\"message\") stops the current function immediately and reports your message, exactly the way Python stops when it hits a KeyError. You use it when your own code detects something that should never happen — an impossible value, a broken rule — so the problem is announced the instant it's spotted, not five steps later.",
      whyMatters:
        "Without a raise, a function just computes an answer from bad input and hands back something wrong-but-believable. raise turns \"quietly wrong\" into \"loudly stopped\", which is far easier to catch and fix.",
      realWorldExample:
        "A smoke alarm going off the instant it smells smoke. It doesn't fix the problem — it makes sure you can't miss it while it's still small.",
      relatedTerms: ["fail-loud-vs-silent", "catch-with-as-e"],
      expandedByDefault: true,
    },
    {
      id: "fail-loud-vs-silent",
      term: "Failing Loudly vs. Silently",
      emoji: "📣",
      shortDef: "Failing loudly stops with a clear message the moment something's wrong; failing silently hands back a wrong answer and says nothing.",
      longDef:
        "A silent failure is the dangerous one: the code keeps running with a bad value, and the mistake only shows up much later, far from where it started, when it's hard to trace. Failing loudly — raising an error right at the check — puts the alarm exactly where the problem is, so you fix the cause instead of chasing the symptom.",
      whyMatters:
        "Almost every nasty, hard-to-find bug is a silent failure that travelled. Choosing to fail loudly at the source is one of the biggest quality habits a new programmer can build.",
      realWorldExample:
        "A smoke alarm (loud, early, easy to act on) versus a house quietly filling with smoke while everyone assumes it's fine (silent, late, disastrous).",
      relatedTerms: ["what-is-raise"],
    },
    {
      id: "catch-with-as-e",
      term: "Catching an Error With \"as e\"",
      emoji: "🎣",
      shortDef: "except ValueError as e catches the error and stores its message in e, so you can print or use it.",
      longDef:
        "Adding as e to an except line hands you the error itself as a variable, usually called e. Its message is the text you passed to raise. So print(\"bad discount:\", e) shows your own message wrapped in a friendlier line, instead of a raw crash — and the program keeps running because the error was caught.",
      whyMatters:
        "It closes the loop between the two halves of error handling: one part of the code raises with a clear message, another part catches it and decides what the user should see.",
      realWorldExample:
        "The alarm tells you which room smells of smoke (the message), so the person who hears it knows exactly where to go — not just that something, somewhere, is wrong.",
      relatedTerms: ["what-is-raise"],
    },
  ],
};

export default content;
