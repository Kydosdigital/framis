import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 4,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "The Case of the Vanishing Total: A Debugging Walkthrough",
  minutes: 22,
  concept:
    "When output looks wrong, the instinct to stare at the whole program and guess almost never works — real debugging follows three steps instead. First, reproduce the bug: find the smallest, most reliable example that triggers the wrong behavior, ideally with numbers you can check by hand, so you can tell for certain \"this is broken\" instead of \"this looks off.\" Second, isolate it: test the suspect pieces separately — call one function alone with known inputs, print a variable partway through a loop — to narrow down the exact line producing the wrong value, rather than treating the whole function as one mysterious black box. Third, fix it: once you've found the exact wrong line, make the smallest change that corrects it, then rerun your reproduction case and confirm the number now matches what you calculated by hand. Skipping straight to \"fixing\" without reproducing and isolating first is how you end up changing five lines, still not knowing which one mattered, and sometimes fixing the symptom while the actual bug stays hidden.",
  conceptSimpler:
    "It's like a mechanic who doesn't randomly swap parts — they reproduce the noise, test one system at a time (brakes, then engine, then belts) until they've isolated exactly which part is making it, and only then replace that one part.",
  vizStages: [
    {
      label: "1. Reproduce it",
      body:
        "checkout_total should discount three prices, sum them, then add tax. By hand: 10% off of 10, 20, and 30 is 9, 18, and 27, which sum to 54; 5% tax on 54 is 56.7. But the function returns 28.35 — clearly, definitely wrong.",
      code:
        "def apply_discount(price, percent):\n    return price - price * percent / 100\n\ndef add_tax(price, rate):\n    return price + price * rate / 100\n\ndef checkout_total(prices, discount_percent, tax_rate):\n    total = 0\n    for price in prices:\n        discounted = apply_discount(price, discount_percent)\n        total = discounted\n    return add_tax(total, tax_rate)\n\nprint(checkout_total([10, 20, 30], 10, 5))\n\n28.35",
    },
    {
      label: "2. Isolate: test the pieces alone",
      body:
        "Call apply_discount by itself with the same numbers used inside the loop. Each call returns exactly the right discounted price — 9, 18, and 27 are all correct. That rules out apply_discount as the source of the bug.",
      code:
        "print(apply_discount(10, 10))\nprint(apply_discount(20, 10))\nprint(apply_discount(30, 10))\n\n9\n18\n27",
    },
    {
      label: "3. Isolate: watch the loop itself",
      body:
        "Printing total on every pass through the loop tells a different story: it shows 9, then 18, then 27 — never a running sum like 9, 27, 54. total isn't accumulating at all; it's just being replaced each time.",
      code:
        "total = 0\nfor price in [10, 20, 30]:\n    discounted = apply_discount(price, 10)\n    total = discounted\n    print(total)\n\n9\n18\n27",
    },
    {
      label: "4. Fix: accumulate instead of overwrite",
      body:
        "The bug was total = discounted, which throws away everything counted so far. Changing it to total = total + discounted makes each pass add to the running total instead of replacing it — and the reproduction case now matches the hand-calculated 56.7.",
      code:
        "def checkout_total(prices, discount_percent, tax_rate):\n    total = 0\n    for price in prices:\n        discounted = apply_discount(price, discount_percent)\n        total = total + discounted\n    return add_tax(total, tax_rate)\n\nprint(checkout_total([10, 20, 30], 10, 5))\n\n56.7",
    },
  ],
  realWorldIntro:
    "This exact accumulator bug shows up constantly in real shopping-cart and billing backends — a loop that means to build up a running total but instead overwrites it — and professional developers track it down using these same three steps: reproduce with a known order, isolate by unit-testing the discount function alone, then isolate the loop itself, before touching a single line.",
  realWorldCode:
    "# reproduce\nassert checkout_total([10, 20, 30], 10, 5) == 56.7\n\n# isolate\nprint(apply_discount(10, 10))  # test one piece alone",
  sandbox: {
    kind: "code",
    challenge:
      "total_distance is supposed to add up every leg of the trip, but total_distance([12, 8, 15, 5]) prints 5 instead of 40. Find the one line that's overwriting the total instead of building it up, and fix it.",
    starterCode:
      "def total_distance(legs):\n    total = 0\n    for leg in legs:\n        total = leg\n    return total\n\ntrip = [12, 8, 15, 5]\nprint(total_distance(trip))",
  },
  quizQuestion:
    "total_items is supposed to add up how many items are in every cart, but it prints 1. Which fix makes it correctly return 6?",
  quizCode:
    "def total_items(carts):\n    total = 0\n    for cart in carts:\n        total = len(cart)\n    return total\n\nprint(total_items([[1, 2], [3, 4, 5], [6]]))",
  quizOptions: [
    { key: "a", label: "Change total = len(cart) to total = total + len(cart)", correct: true },
    { key: "b", label: "Change total = 0 to total = 1 before the loop", correct: false },
    { key: "c", label: "Change for cart in carts: to for cart in range(carts):", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — total = len(cart) overwrites total on every pass, so only the size of the last cart, [6], survives; total = total + len(cart) accumulates every cart's count instead, giving 2 + 3 + 1 = 6.",
  quizFeedbackIncorrect:
    "Not quite — the starting value isn't the problem. total = len(cart) replaces total instead of adding to it each time through the loop, so only total = total + len(cart) actually accumulates across every cart.",
  takeaway:
    "Don't guess at a bug from the outside — reproduce it with a small, hand-checkable example, isolate which exact piece (a function call, a loop iteration, a single line) produces the bad value, then make the smallest fix that makes your known answer come out right. An accumulator that gets overwritten instead of added to is one of the most common and sneaky bugs you'll ever chase down.",
};

export default content;
