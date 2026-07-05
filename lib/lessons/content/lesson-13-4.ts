import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  orderIndex: 4,
  phaseLabel: "TESTING (UNIT/INTEGRATION/E2E)",
  title: "The Bug Between Them: Writing an Integration Test",
  minutes: 22,
  concept:
    "A unit test proves one function does the right thing with inputs you made up by hand — but real bugs often hide in the seam between two functions, not inside either one. calculate_total might return a dollar amount and pass its own unit test perfectly, while apply_free_shipping might expect a value in cents and also pass its own unit test perfectly — and yet wiring them together produces a wrong answer, because dollars flowing into a function expecting cents is a mismatch neither function's own test could ever catch. An integration test is built specifically to catch that: instead of making up a fake input for the second function, you take the real output of the first function and feed it in, then check that the combined result is correct. That's the whole difference — a unit test checks a function against inputs you chose, an integration test checks whether two real functions actually agree with each other when chained together for real. Neither replaces the other: unit tests give fast, pinpointed feedback about one function at a time, while integration tests confirm the handoff between functions actually works.",
  conceptSimpler:
    "A unit test checks each Lego brick alone for cracks; an integration test snaps two bricks together and checks whether they actually click into place.",
  vizStages: [
    {
      label: "1. Two functions, each unit-tested on its own",
      body:
        "calculate_total figures out an order's dollar total. apply_free_shipping decides whether an order qualifies for free shipping, based on a total in cents.",
      code:
        "def calculate_total(price, quantity):\n    return price * quantity\n\ndef apply_free_shipping(total_cents):\n    if total_cents >= 5000:\n        return True\n    return False",
    },
    {
      label: "2. Each one passes, completely alone",
      body:
        "Tested in isolation with made-up numbers, both functions look flawless — calculate_total does the multiplication correctly, and apply_free_shipping applies its cents threshold correctly.",
      code:
        'assert calculate_total(25, 3) == 75, "25 * 3 should be 75"\nassert apply_free_shipping(5000) == True, "5000 cents qualifies"\nassert apply_free_shipping(100) == False, "100 cents does not qualify"\nprint("both unit tests passed")',
    },
    {
      label: "3. But do they actually work together?",
      body:
        "calculate_total(25, 3) returns 75 — meaning $75, in dollars. Feed that straight into apply_free_shipping, which is expecting cents, and 75 cents is nowhere near the $50 threshold. A real $75 order gets wrongly denied free shipping.",
      code:
        'order_total = calculate_total(25, 3)\nqualifies = apply_free_shipping(order_total)\nassert qualifies == True, "a $75 order should qualify for free shipping"\n# AssertionError: a $75 order should qualify for free shipping\n# (order_total was 75 dollars, but apply_free_shipping expected cents)',
    },
    {
      label: "4. Neither function is \"wrong\" on its own",
      body:
        "Both unit tests from stage 2 still pass — nothing about either function changed. The bug lives entirely at the seam where they connect: a units mismatch that only shows up once you test them together with real, chained data.",
      code:
        "# calculate_total: still correct, returns dollars, as designed\n# apply_free_shipping: still correct, expects cents, as designed\n# the integration is what's broken, not either function",
    },
  ],
  realWorldIntro:
    "In a real CI pipeline, integration tests run after the unit test suite and are slower because they exercise real code paths together instead of stubbed-out inputs — but they're what catches the kind of seam bug (mismatched units, unexpected shapes, wrong assumptions) that two individually-passing unit tests can hide from each other.",
  realWorldCode:
    '# tests/test_checkout_integration.py\ndef test_order_total_flows_into_shipping_check():\n    order_total = calculate_total(25, 3)\n    assert apply_free_shipping(order_total * 100) == True\n\n# $ pytest tests/ -v\n# tests/test_shipping.py::test_calculate_total PASSED\n# tests/test_shipping.py::test_apply_free_shipping PASSED\n# tests/test_checkout_integration.py::test_order_total_flows_into_shipping_check PASSED',
  sandbox: {
    kind: "code",
    challenge:
      "Fix the integration bug so a $75 order correctly qualifies for free shipping — without breaking either function's own unit tests above.",
    starterCode:
      'def calculate_total(price, quantity):\n    return price * quantity\n\ndef apply_free_shipping(total_cents):\n    if total_cents >= 5000:\n        return True\n    return False\n\nassert calculate_total(25, 3) == 75, "unit test: 25 * 3 should be 75"\nassert apply_free_shipping(5000) == True, "unit test: 5000 cents qualifies"\nassert apply_free_shipping(100) == False, "unit test: 100 cents does not qualify"\n\norder_total = calculate_total(25, 3)\nqualifies = apply_free_shipping(order_total)\nassert qualifies == True, "integration test: a $75 order should qualify for free shipping"\n\nprint("All tests passed. Order total:", order_total, "Free shipping:", qualifies)',
  },
  quizQuestion:
    "calculate_total(25, 3) passes its own unit test (it equals 75), and apply_free_shipping(5000) passes its own unit test (it returns True). But apply_free_shipping(calculate_total(25, 3)) incorrectly returns False for what should be a qualifying $75 order. What does this show?",
  quizOptions: [
    {
      key: "a",
      label:
        "Even when each function is individually correct, the two can still disagree about the units or shape of data passed between them — something only an integration test that chains them together for real will catch",
      correct: true,
    },
    {
      key: "b",
      label:
        "One of the two unit tests must actually be wrong, since two genuinely passing unit tests could never coexist with a bug like this",
      correct: false,
    },
    {
      key: "c",
      label:
        "This proves unit tests are pointless and every function should only ever be tested through integration tests",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — both functions are correct against their own specs, but calculate_total hands back dollars while apply_free_shipping expects cents; that mismatch only shows up once you test them chained together with real data.",
  quizFeedbackIncorrect:
    "Not quite — both unit tests are genuinely correct, and unit tests are still valuable for fast, pinpointed feedback. The bug is a units mismatch at the seam between the two functions, which is precisely what an integration test is for.",
  takeaway:
    "Unit tests prove each function is correct on its own terms, but only an integration test that chains their real inputs and outputs together can catch a mismatch at the seam between them, like dollars flowing into a function expecting cents. Use both: unit tests for fast, precise feedback per function, integration tests to confirm the pieces actually fit.",
};

export default content;
