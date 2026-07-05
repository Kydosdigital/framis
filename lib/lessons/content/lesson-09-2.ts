import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 2,
  phaseLabel: "TESTING (UNIT/INTEGRATION/E2E)",
  title: "Isolated on Purpose: What Makes a Test a Unit Test",
  minutes: 18,
  concept:
    "A unit test checks exactly one function, by itself, with inputs you choose and pass in directly — no database, no logged-in user, no other function running alongside it. That word \"unit\" is the whole idea: you're testing a single unit of the program in isolation, the same way an electrician checks one outlet without powering the whole house. The benefit shows up the moment a test fails — if calculate_shipping_cost(5, True) is the only thing running and its assert fails, the bug has to be inside calculate_shipping_cost, full stop. Nothing else was involved, so there's nowhere else to look. Contrast that with clicking through an entire checkout flow and noticing the final receipt looks wrong — the bug could be in shipping, tax, inventory, or the receipt printer itself, and you'd have to hunt through all of it. Unit tests trade that broad uncertainty for a narrow, fast, precise answer about one function at a time.",
  conceptSimpler:
    "A unit test is like turning one gear by hand to see if it's cracked, instead of running the whole engine and guessing which gear made the noise.",
  vizStages: [
    {
      label: "1. The function under test",
      body:
        "calculate_shipping_cost decides what a package costs to ship: members always ship free, and non-members pay a standard rate — or more, if the package is heavy.",
      code:
        "def calculate_shipping_cost(weight, is_member):\n    if is_member:\n        return 0\n    if weight > 20:\n        return 25\n    return 10",
    },
    {
      label: "2. Called directly, with nothing else running",
      body:
        "A unit test calls calculate_shipping_cost by itself, with plain numbers you made up — no shopping cart, no real user account, no database. That's what \"isolation\" means: the only thing under test is this one function.",
      code:
        "result = calculate_shipping_cost(5, True)\nassert result == 0, \"members should ship free\"\nprint(\"member, light package:\", result)",
    },
    {
      label: "3. One assert per behavior",
      body:
        "Because the function is isolated, you can hit each of its branches on purpose, one input at a time, without worrying about anything else in the app getting in the way.",
      code:
        "assert calculate_shipping_cost(5, True) == 0, \"members ship free\"\nassert calculate_shipping_cost(25, False) == 25, \"non-members pay extra for heavy packages\"\nassert calculate_shipping_cost(5, False) == 10, \"non-members pay the standard rate otherwise\"",
    },
    {
      label: "4. Isolation tells you exactly what broke",
      body:
        "If this test fails, the bug is guaranteed to live inside calculate_shipping_cost — not the database, not the email system, not any other function, because none of those things were even running. That precision is the entire point of testing in isolation.",
      code:
        "# AssertionError: members ship free\n# (nothing else in the app was even running when this failed)",
    },
  ],
  realWorldIntro:
    "In a real CI pipeline, unit tests run first and finish in milliseconds because they never touch a database or network — a suite of thousands of them can pass before a slower integration or end-to-end suite even starts.",
  realWorldCode:
    "# tests/test_shipping.py\ndef test_member_free_shipping():\n    assert calculate_shipping_cost(5, True) == 0\n\ndef test_heavy_package_surcharge():\n    assert calculate_shipping_cost(25, False) == 25\n\n# $ pytest tests/test_shipping.py -v\n# 2 passed in 0.01s",
  sandbox: {
    kind: "code",
    challenge:
      "Fix calculate_shipping_cost so members always ship free, even on heavy packages — right now the weight check runs first and overrides membership.",
    starterCode:
      'def calculate_shipping_cost(weight, is_member):\n    if weight > 20:\n        return 25\n    if is_member:\n        return 0\n    return 10\n\ntest1 = calculate_shipping_cost(5, True)\nassert test1 == 0, "members should ship free regardless of package weight"\n\ntest2 = calculate_shipping_cost(25, True)\nassert test2 == 0, "members should ship free even on heavy packages"\n\ntest3 = calculate_shipping_cost(25, False)\nassert test3 == 25, "non-members pay extra for heavy packages"\n\nprint("All unit tests passed:", test1, test2, test3)',
  },
  quizQuestion:
    "A teammate suggests testing calculate_shipping_cost by placing a real order through the entire checkout flow — cart, payment, inventory, email confirmation — and reading the shipping line off the final receipt. Why is calling calculate_shipping_cost(5, True) directly, by itself, a better unit test?",
  quizOptions: [
    {
      key: "a",
      label:
        "It isolates the one function you actually care about, so if the assert fails you know the bug is in calculate_shipping_cost, not somewhere else in the checkout flow",
      correct: true,
    },
    {
      key: "b",
      label:
        "It's better because unit tests are always faster to write than any other kind of test, no matter what they're checking",
      correct: false,
    },
    {
      key: "c",
      label:
        "It's better because a function can never be tested by calling it through another function, only by calling it directly by name",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — calling the function directly with chosen inputs isolates it from the rest of the app, so a failing assert can only mean one thing: calculate_shipping_cost itself is broken.",
  quizFeedbackIncorrect:
    "Not quite — the real advantage is isolation: calling the function directly means a failure points at exactly one place, instead of leaving you to search the entire checkout flow for the cause.",
  takeaway:
    "A unit test isolates one function and calls it directly with inputs you control, so a failure points at exactly one place. That precision is what makes unit tests the fastest way to find out which piece of a program actually broke.",
};

export default content;
