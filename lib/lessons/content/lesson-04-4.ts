import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 4,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "The case of the vanishing total: a debugging walkthrough",
  minutes: 22,
  concept:
    "When output looks wrong, the urge is to stare at the whole program and guess. That almost never works. Real debugging follows three steps, in order.\n\n" +
    "First, reproduce it. Find the smallest, most reliable example that triggers the wrong behaviour — ideally with numbers you can work out by hand — so you can say for certain \"this is broken\", not just \"this looks off\".\n\n" +
    "Second, isolate it. Test the suspect pieces on their own: call one function by itself with numbers you know, or print a variable partway through a loop, to narrow down the exact line producing the wrong value. Don't treat the whole function as one mysterious box.\n\n" +
    "Third, fix it. Once you've found the exact wrong line, make the smallest change that corrects it — then rerun your reproduction case and check the number now matches what you worked out by hand.\n\n" +
    "Think of a good mechanic. They don't randomly swap parts hoping the noise goes away. They reproduce the noise, test one system at a time — brakes, then engine, then belts — until they've isolated exactly which part is making it, and only then replace that one part. Jumping straight to \"fixing\" without reproducing and isolating first is how you change five lines, still don't know which one mattered, and sometimes fix the symptom while the real bug stays hidden.",
  conceptSimpler:
    "Debug like a good mechanic, not a guesser.\n\n" +
    "Reproduce the noise — get the bug to happen reliably, with numbers you can check by hand.\n\n" +
    "Isolate it — test one part at a time (brakes, then engine, then belts) until you know exactly which piece is wrong.\n\n" +
    "Then fix that one part — and start the car again to confirm the noise is gone.",
  vizStages: [
    {
      label: "1. Reproduce it — with hand-checkable numbers",
      body:
        "checkout_total should take 10% off three prices, add them up, then add 5% tax. By hand: 10% off 10, 20, and 30 gives 9, 18, and 27, which sum to 54; 5% tax on 54 is 56.7. But the function returns 28.35 — definitely wrong.",
      code: "def apply_discount(price, percent):\n    return price - price * percent / 100\n\ndef add_tax(price, rate):\n    return price + price * rate / 100\n\ndef checkout_total(prices, discount, tax):\n    total = 0\n    for price in prices:\n        discounted = apply_discount(price, discount)\n        total = discounted\n    return add_tax(total, tax)\n\nprint(checkout_total([10, 20, 30], 10, 5))",
    },
    {
      label: "2. Isolate — test one piece alone",
      body:
        "Call apply_discount by itself with the same numbers the loop uses. Each returns exactly the right discounted price — 9, 18, and 27, all correct. So apply_discount isn't the bug.",
      code: "print(apply_discount(10, 10))\nprint(apply_discount(20, 10))\nprint(apply_discount(30, 10))",
    },
    {
      label: "3. Isolate — watch the loop itself",
      body:
        "Print total on every pass. It shows 9, then 18, then 27 — never a running sum like 9, 27, 54. total isn't adding up at all; it's being replaced each time round.",
      code: "total = 0\nfor price in [10, 20, 30]:\n    discounted = apply_discount(price, 10)\n    total = discounted\n    print(total)",
    },
    {
      label: "4. Fix — accumulate instead of overwrite",
      body:
        "The bug is total = discounted, which throws away everything counted so far. Changing it to total = total + discounted makes each pass add to the running total — and the reproduction case now gives the hand-checked 56.7.",
      code: "def checkout_total(prices, discount, tax):\n    total = 0\n    for price in prices:\n        discounted = apply_discount(price, discount)\n        total = total + discounted\n    return add_tax(total, tax)\n\nprint(checkout_total([10, 20, 30], 10, 5))",
    },
  ],
  realWorldIntro:
    "This exact bug — a loop that means to build up a running total but instead overwrites it — shows up constantly in real shopping-basket and billing code. And experienced developers don't fix it by guessing; they use these same three steps: reproduce with a known order, isolate the discount step and then the loop, and only then change a single line.",
  realWorldCode:
    "# reproduce with a known answer:\nprint(checkout_total([10, 20, 30], 10, 5))   # should be 56.7\n\n# isolate one piece:\nprint(apply_discount(10, 10))                # test the discount alone",
  sandbox: {
    kind: "code",
    challenge:
      "total_distance is supposed to add up every leg of the trip, but total_distance([12, 8, 15, 5]) prints 5 instead of 40. Find the one line that's overwriting the total instead of building it up, and fix it.",
    starterCode:
      "def total_distance(legs):\n    total = 0\n    for leg in legs:\n        total = leg\n    return total\n\ntrip = [12, 8, 15, 5]\nprint(total_distance(trip))",
    language: "python",
  },
  quizQuestion:
    "total_items is supposed to add up how many items are in every cart, but it prints 1. Which fix makes it correctly return 6?",
  quizCode:
    "def total_items(carts):\n    total = 0\n    for cart in carts:\n        total = len(cart)\n    return total\n\nprint(total_items([[1, 2], [3, 4, 5], [6]]))",
  quizOptions: [
    { key: "a", label: "Change total = len(cart) to total = total + len(cart)", correct: true },
    { key: "b", label: "Change total = 0 to total = 1 before the loop", correct: false },
    { key: "c", label: "Move the return total line inside the loop", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — total = len(cart) overwrites total on every pass, so only the last cart's size ([6] → 1) survives. total = total + len(cart) adds each cart's count instead: 2 + 3 + 1 = 6.",
  quizFeedbackIncorrect:
    "Not quite — the bug is that total = len(cart) replaces total each time instead of adding to it, so only the last cart counts. Only total = total + len(cart) accumulates across every cart to reach 6.",
  takeaway:
    "Don't guess a bug from the outside — reproduce it with a small, hand-checkable example, isolate which exact piece (a function call, a loop pass, a single line) makes the wrong value, then make the smallest fix and confirm your known answer comes out right. An accumulator that gets overwritten (total = x) instead of added to (total = total + x) is one of the most common and sneaky bugs you'll ever chase.",
  explainers: [
    {
      id: "three-step-debug",
      term: "Reproduce, Isolate, Fix",
      emoji: "🔧",
      shortDef: "The three steps of debugging: make the bug happen reliably, narrow down the exact line, then make the smallest fix.",
      longDef:
        "Reproduce means getting the wrong behaviour to happen on demand, with an example small enough to check by hand. Isolate means testing pieces separately — one function alone, or one variable printed inside a loop — until you've cornered the exact line at fault. Fix means changing only that line, then rerunning your reproduction to confirm it's right. Doing them in order stops you flailing.",
      whyMatters:
        "Most wasted debugging time comes from skipping straight to \"fix\" and guessing. The three steps turn a vague \"something's wrong\" into a specific, provable \"this line, this change\".",
      realWorldExample:
        "A mechanic reproduces the noise, tests one system at a time until they've isolated the worn part, then replaces just that part — instead of swapping components at random and hoping.",
      relatedTerms: ["accumulator-bug", "hand-check"],
      expandedByDefault: true,
    },
    {
      id: "accumulator-bug",
      term: "The Accumulator (and Its Classic Bug)",
      emoji: "➕",
      shortDef: "An accumulator is a variable that builds up a running total with total = total + x. Writing total = x instead is a very common bug.",
      longDef:
        "You met this pattern earlier: start total at 0, then inside a loop do total = total + something to add each item on. The classic mistake is writing total = something — which replaces total every pass instead of adding to it, so only the last item survives. The fix is always the missing \"total +\": total = total + something.",
      whyMatters:
        "This one bug hides behind countless \"my total is wrong\" problems. Once you can recognise overwrite-instead-of-accumulate on sight, you'll fix a whole family of bugs in seconds.",
      realWorldExample:
        "Adding up a shopping receipt: you keep a running total and add each item to it. If you instead just wrote down each item's price on its own, you'd end up with the price of the last item, not the bill.",
      relatedTerms: ["three-step-debug"],
    },
    {
      id: "hand-check",
      term: "Check Against a Hand-Worked Answer",
      emoji: "✅",
      shortDef: "Pick an example simple enough to solve by hand, so you know the exact right answer before you trust the code.",
      longDef:
        "Debugging needs a fixed target. If you work out by hand that the answer should be 56.7, then \"the code says 28.35\" is a hard fact, not a hunch — and after your fix, \"the code now says 56.7\" is proof. Without a hand-checked number, you're guessing whether the output is even wrong.",
      whyMatters:
        "\"This looks off\" isn't something you can fix; \"this should be 56.7 and it's 28.35\" is. A known answer is what turns debugging from a feeling into a check.",
      realWorldExample:
        "The mechanic knows what the engine should sound like when it's healthy. That reference is how they can tell it's fixed — not just that it sounds a bit different.",
      relatedTerms: ["three-step-debug"],
    },
  ],
};

export default content;
