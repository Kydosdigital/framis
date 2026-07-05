import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 1,
  phaseLabel: "DEBUGGING + LOGGING + MONITORING",
  title: "Print Statements: X-Ray Vision for Broken Code",
  minutes: 20,
  concept:
    "A function can run without crashing and still hand back the wrong answer — that's the hardest kind of bug, because there's no error message pointing you at the problem. The fix is to interrogate the code while it runs: drop a print() statement right where you suspect trouble, so you can watch a variable's real value at that exact moment instead of guessing from reading the code. Trace one loop iteration at a time — print what came in, print what you're about to store, and print what actually got stored — until you find the exact line where the printed value stops matching what you expected. Everything before that line was fine; the bug lives right there. This turns a vague feeling of \"the number is wrong somewhere\" into a precise, provable \"the number goes wrong on line 6, inside the loop, when total gets reassigned instead of added to.\"",
  conceptSimpler:
    "It's like a detective questioning witnesses in order along a timeline — you're not guessing who's lying, you're checking each person's story until you find the exact moment the account stops matching reality.",
  vizStages: [
    {
      label: "1. A function that lies quietly",
      body:
        "This function is supposed to add up late fees across every order, but it returns a suspiciously small number. It doesn't crash, so nothing points you at the problem — you just get a wrong total back.",
      code:
        "def calculate_total_fees(orders):\n    total = 0\n    for order in orders:\n        fee = order[\"days_late\"] * 5\n        total = fee\n    return total\n\norders = [{\"days_late\": 2}, {\"days_late\": 5}, {\"days_late\": 1}]\nresult = calculate_total_fees(orders)\nprint(f\"Total late fees: ${result}\")",
    },
    {
      label: "2. Drop a print checkpoint inside the loop",
      body:
        "Instead of staring at the code hoping to spot the bug, add a print() right after the line you're suspicious of. Now every single loop iteration reports its own fee and the running total at that moment.",
      code:
        "def calculate_total_fees(orders):\n    total = 0\n    for order in orders:\n        fee = order[\"days_late\"] * 5\n        total = fee\n        print(f\"fee={fee} total={total}\")\n    return total",
    },
    {
      label: "3. Read the trace line by line",
      body:
        "The printed trace shows fee is correct every time, but total is always identical to fee — it never carries forward what came before. That's the tell: total is being replaced, not accumulated.",
      code: "fee=10 total=10\nfee=25 total=25\nfee=5 total=5",
    },
    {
      label: "4. Fix the exact line the trace pointed to",
      body:
        "Once the trace shows total resetting instead of growing, the fix is obvious: add the new fee to the existing total instead of overwriting it. Rerun and the printed total now climbs across iterations.",
      code:
        "def calculate_total_fees(orders):\n    total = 0\n    for order in orders:\n        fee = order[\"days_late\"] * 5\n        total = total + fee\n        print(f\"fee={fee} total={total}\")\n    return total",
    },
  ],
  realWorldIntro:
    "In a live production system you can't pause a request and poke at variables in a debugger, so engineers leave print-style log lines inside functions on purpose — tools like Datadog or CloudWatch then let them replay exactly what a variable held at each step of one specific failed request.",
  realWorldCode:
    "def calculate_shipping_cost(order):\n    print(f\"order_id={order['id']} weight={order['weight']}\")\n    cost = order[\"weight\"] * 2\n    print(f\"order_id={order['id']} computed_cost={cost}\")\n    return cost",
  sandbox: {
    kind: "code",
    challenge:
      "Add print statements inside the loop to find where the running total stops accumulating, then fix the bug.",
    starterCode:
      "def calculate_total_distance(trips):\n    total = 0\n    for trip in trips:\n        miles = trip[\"miles\"]\n        total = miles\n    return total\n\ntrips = [{\"miles\": 12}, {\"miles\": 8}, {\"miles\": 20}]\nresult = calculate_total_distance(trips)\nprint(f\"Total distance: {result} miles\")",
  },
  quizQuestion:
    "You add print(f\"fee={fee} total={total}\") inside the loop and see this trace. What does it reveal about the bug?",
  quizCode: "fee=10 total=10\nfee=25 total=25\nfee=5 total=5",
  quizOptions: [
    {
      key: "a",
      label: "total is being reassigned to the latest fee each iteration instead of adding to the running total",
      correct: true,
    },
    { key: "b", label: "fee is being calculated with the wrong multiplier, so every value is wrong", correct: false },
    { key: "c", label: "the for loop is only running once, so later orders are skipped entirely", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — fee is correct on every line of the trace, but total always equals that iteration's fee, which means the loop is overwriting total instead of accumulating it with total = total + fee.",
  quizFeedbackIncorrect:
    "Look again at the fee values in the trace (10, 25, 5) — they're all correct for their orders, so the multiplier is fine and the loop is clearly running three times; the tell is that total always matches fee exactly, meaning it's being replaced, not summed.",
  takeaway:
    "When code runs but returns the wrong answer, don't just reread it — print the suspect variable at each step and watch where the trace stops matching what you expected. That exact line is the bug, and this same instinct is what real logging and monitoring in production systems is built on.",
  nextUpLabel: "Security + Auth Patterns",
};

export default content;
