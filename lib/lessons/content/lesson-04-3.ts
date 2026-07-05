import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 3,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "Fail Loudly, Fail on Purpose: Raising Your Own Errors",
  minutes: 18,
  concept:
    "So far, every error you've handled was one Python decided to raise for you — a missing dictionary key, a division by zero. But plenty of real bugs come from bad values your own code lets slip through unnoticed: a discount percent over 100, a temperature below absolute zero, a withdrawal bigger than the account balance. If you don't explicitly check for these, the function just computes an answer anyway — a negative price, an impossible temperature — and hands back a number that's flat-out wrong with no warning at all. The raise statement lets you trigger an error yourself: raise ValueError(\"some message\") stops execution immediately and reports exactly what went wrong, in your own words, the instant you detect the bad input, instead of letting it silently corrupt everything downstream. This is called failing loudly, and it's almost always better than failing silently: a crash with a clear message can be found and fixed in seconds, while a wrong number that quietly flows through five more functions might not surface until a customer complains.",
  conceptSimpler:
    "It's the difference between a smoke alarm that screams the instant it smells smoke, and a house that just quietly fills with smoke while everyone assumes it's fine.",
  vizStages: [
    {
      label: "1. The silent wrong answer",
      body:
        "compute_discount happily multiplies by any percent it's given — even 150%, which should never happen for a discount. There's no check, so it just returns a negative price with no warning at all.",
      code:
        "def compute_discount(price, percent):\n    return price - price * percent / 100\n\nprint(compute_discount(50, 150))\n\n-25",
    },
    {
      label: "2. Add a manual check",
      body:
        "raise ValueError(...) lets the function refuse to proceed the moment it sees an impossible percent, reporting the exact bad value instead of quietly computing garbage.",
      code:
        'def compute_discount(price, percent):\n    if percent > 100:\n        raise ValueError(f"percent {percent} is over 100")\n    return price - price * percent / 100\n\nprint(compute_discount(50, 150))\n\nValueError: percent 150 is over 100',
    },
    {
      label: "3. Normal input still works fine",
      body:
        "The check only fires when something is actually wrong. A reasonable percent like 20 sails through untouched, and the function returns the correct discounted price as always.",
      code: "print(compute_discount(50, 20))\n\n40",
    },
    {
      label: "4. Your own raise, caught the same way",
      body:
        "An error you raise yourself behaves exactly like one Python raises automatically — the caller can wrap the call in try/except ValueError as e and handle it, print a friendly message, or log it, instead of the whole program crashing.",
      code:
        'try:\n    compute_discount(50, 150)\nexcept ValueError as e:\n    print(f"bad discount: {e}")\n\nbad discount: percent 150 is over 100',
    },
  ],
  realWorldIntro:
    "This is exactly how payment systems avoid disasters: before charging a card, real checkout code raises its own error the instant it sees a negative amount or a discount over 100%, so a bug three steps upstream gets caught immediately instead of silently issuing a refund for negative money.",
  realWorldCode:
    'if amount < 0:\n    raise ValueError(f"refund amount {amount} cannot be negative")',
  sandbox: {
    kind: "code",
    challenge:
      "withdraw() currently lets a customer's balance go negative without complaint — add a check that raises a ValueError with a clear message when amount is greater than balance, so an overdraft fails loudly instead of quietly succeeding.",
    starterCode:
      "def withdraw(balance, amount):\n    return balance - amount\n\nprint(withdraw(100, 40))\nprint(withdraw(20, 40))",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'def set_temperature(celsius):\n    if celsius < -273:\n        raise ValueError(f"{celsius} is below absolute zero")\n    return celsius\n\ntry:\n    set_temperature(-300)\nexcept ValueError as e:\n    print(f"rejected: {e}")',
  quizOptions: [
    { key: "a", label: "rejected: -300 is below absolute zero", correct: true },
    { key: "b", label: "ValueError: -300 is below absolute zero", correct: false },
    { key: "c", label: "-300", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — set_temperature raises a ValueError because -300 is below -273, but the try/except around the call catches it and prints the friendly \"rejected: ...\" message instead of letting the program crash.",
  quizFeedbackIncorrect:
    "Not quite — set_temperature does raise a ValueError for -300, but it's caught by except ValueError as e before it can crash anything, so the output is the handled message \"rejected: -300 is below absolute zero\", not a raw crash or the unchecked number.",
  takeaway:
    "When your own code can detect a bad value, don't let it quietly produce a wrong answer — raise ValueError(\"...\") (or another fitting error type) with a message that says exactly what went wrong. A loud, immediate crash you can read and fix beats a silent wrong number every time.",
};

export default content;
