import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  orderIndex: 1,
  phaseLabel: "TESTING (UNIT/INTEGRATION/E2E)",
  title: "Right Answer, Wrong Reason: The Test That Passed by Accident",
  minutes: 22,
  concept:
    "A test works by picking one specific input, working out the correct answer by hand ahead of time, and using assert to demand that the function's real output matches that exact number — if it doesn't, the program raises an AssertionError instead of quietly limping along with a wrong result. That single design choice is what makes tests powerful: unlike glancing at printed output and thinking \"yeah, that looks about right,\" an assert has no opinion and no mercy — it only knows whether two values are equal. But an assert is only as good as the input you chose for it. apply_discount(100, 10) happens to equal 90 whether the function does the math correctly or is badly broken, so a test built on that input would pass either way and hide a real bug. A well-chosen test picks numbers where the correct answer and a plausible buggy answer come out different, so the two behaviors can't be confused with each other. That's why writing good tests takes as much thought as writing the function itself — an assert only ever catches what its chosen input is capable of exposing. In a real project you don't run these asserts by hand one at a time — you wrap each one in its own function whose name starts with test_, save it in a file, and run the pytest command from the terminal. pytest automatically finds every function named test_* in the project, calls each one, and reports which passed and which raised an AssertionError, so \"testing the code\" becomes a single command instead of a manual ritual.",
  conceptSimpler:
    "An assert is a smoke detector, but only for the exact spot you wired it into — it won't warn you about a fire in the room next door.",
  vizStages: [
    {
      label: "1. The function under test",
      body:
        "apply_discount is supposed to take a price and a percent off, then return the price minus that percentage of itself.",
      code:
        "def apply_discount(price, percent):\n    discount = price * percent / 100\n    return price - discount",
    },
    {
      label: "2. A test that happens to pass",
      body:
        "Testing with price=100 and percent=10 gives 90. But 100 - 10 also equals 90, so this particular input can't tell a correct function apart from one that just subtracts the percent number directly.",
      code:
        "result = apply_discount(100, 10)\nassert result == 90\nprint(\"passed:\", result)",
    },
    {
      label: "3. The bug slips past",
      body:
        "Imagine apply_discount gets \"simplified\" to price - percent, skipping the percentage math entirely. The exact same test above still passes, because 100 - 10 is 90 either way — a real bug just hid behind a bad choice of test numbers.",
      code:
        "def apply_discount(price, percent):\n    return price - percent\n\nresult = apply_discount(100, 10)\nassert result == 90\nprint(\"still passes:\", result)",
    },
    {
      label: "4. A sharper test catches it",
      body:
        "Testing with price=200 instead makes the two behaviors disagree: correct math gives 180, but the buggy shortcut gives 190. Now the assert finally has something real to catch.",
      code:
        "result = apply_discount(200, 10)\nassert result == 180, \"10% off $200 should be $180\"\n# AssertionError: 10% off $200 should be $180",
    },
    {
      label: "5. Wrap it in a function pytest can find",
      body:
        "pytest doesn't scan for stray assert statements — it scans for functions whose name starts with test_. Put the sharp assert from stage 4 inside one of those, in a file, and pytest will discover and run it automatically.",
      code:
        "# tests/test_pricing.py\ndef test_ten_percent_discount():\n    result = apply_discount(200, 10)\n    assert result == 180, \"10% off $200 should be $180\"",
    },
    {
      label: "6. Run pytest and read the result",
      body:
        "From the terminal, running pytest against that file executes every test_* function it finds and prints one line per test. A correct apply_discount reports PASSED; the broken price - percent version reports FAILED along with the exact assert that blew up.",
      code:
        "$ pytest tests/test_pricing.py -v\ntests/test_pricing.py::test_ten_percent_discount PASSED\n\n1 passed in 0.01s\n\n# if apply_discount were still the broken price - percent version:\n$ pytest tests/test_pricing.py -v\ntests/test_pricing.py::test_ten_percent_discount FAILED\n\nAssertionError: 10% off $200 should be $180\nassert 190 == 180\n\n1 failed in 0.01s",
    },
  ],
  realWorldIntro:
    "In a real project this same test would live in a file pytest runs automatically on every push, and a CI pipeline like GitHub Actions turns the whole build red and blocks the merge the moment one assert fails.",
  realWorldCode:
    "# tests/test_pricing.py\ndef test_ten_percent_discount():\n    assert apply_discount(200, 10) == 180\n\n# .github/workflows/ci.yml\n# - run: pytest tests/\n#   (a failing assert here blocks the merge automatically)",
  sandbox: {
    kind: "code",
    challenge:
      "Fix apply_discount so it correctly computes the discount, making the assert below (which uses a sharp, non-coincidental input) pass.",
    starterCode:
      'def apply_discount(price, percent):\n    return price - percent\n\nresult = apply_discount(200, 10)\nassert result == 180, "10% off $200 should be $180"\nprint("Test passed! Price after discount:", result)',
  },
  quizQuestion:
    "The buggy apply_discount(price, percent) that just returns price - percent passes assert apply_discount(100, 10) == 90, but fails assert apply_discount(200, 10) == 180. What does this reveal about writing good tests?",
  quizOptions: [
    {
      key: "a",
      label:
        "Some test inputs can accidentally match a buggy function's output, so picking inputs where correct and incorrect behavior actually diverge matters more than just having a test at all",
      correct: true,
    },
    {
      key: "b",
      label:
        "The function is actually correct, and the second assert must be wrong because 200 and 10 aren't valid arguments to pass together",
      correct: false,
    },
    {
      key: "c",
      label:
        "Once a test passes for one input, the function is guaranteed correct for every input, so the second assert was unnecessary",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — an assert can only expose a bug if the input you chose makes the correct and incorrect answers come out different; 100 and 10 happened to produce the same result either way, which hid the bug completely.",
  quizFeedbackIncorrect:
    "Not quite — the function really is broken, and the second assert isn't wrong at all; 100 and 10 was just a coincidental input where the buggy math happened to match the correct math, and passing one test never guarantees correctness on every other input.",
  takeaway:
    "An assert only proves what its specific input is capable of proving — a test that happens to pass by coincidence gives false confidence, while a test built around inputs that make bugs and correct behavior disagree is what actually protects you. Good testing is as much about choosing sharp inputs as it is about writing the assert itself.",
  nextUpLabel: "Debugging + Logging + Monitoring",
};

export default content;
