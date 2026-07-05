import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 4,
  phaseLabel: "PYTHON BASICS",
  title: "Lists and For Loops: Storing Many Values, Doing Something With Each",
  minutes: 24,
  concept:
    "So far every variable has held exactly one value. A list holds many values in a single variable, written as a comma-separated sequence inside square brackets, like scores = [72, 85, 91, 68]. Each value has a position, called an index, starting at 0 — not 1 — so scores[0] is the first item and scores[3] is the fourth. len() tells you how many items a list holds, and .append() adds a new item onto the end of an existing list, which is how you grow a list that starts out empty. A for loop is how you work through a list without touching each position by hand: for score in scores: runs its indented block once per item, automatically binding score to each value in order, from the first item to the last. Put the two together — loop over a list with for, and build a brand-new list with .append() as you go — and you have the core move behind almost every program that processes a whole collection of data instead of one value at a time.",
  conceptSimpler:
    "A list is a numbered egg carton — one variable holding many slots, each one reachable by its position, counting from 0. A for loop is you tapping each egg in the carton in order, one at a time, without having to write out 'egg 1, egg 2, egg 3' yourself.",
  vizStages: [
    {
      label: "1. A list holds many values in one variable",
      body:
        "Square brackets with commas between values create a list. scores holds four numbers at once, in the exact order they were written — len() counts how many items are inside.",
      code: "scores = [72, 85, 91, 68]\nprint(scores)\nprint(len(scores))\n\n[72, 85, 91, 68]\n4",
    },
    {
      label: "2. Reach one item by its index — counting from 0",
      body:
        "Square brackets after a list name reach one specific item by position. scores[0] is the first item (72, not the '0th' in some separate sense — 0 just is the first position), and scores[2] is the third item (91).",
      code: "print(scores[0])\nprint(scores[2])\n\n72\n91",
    },
    {
      label: "3. for loops visit each item automatically",
      body:
        "for score in scores: runs its body once per item in the list — score becomes 72, then 85, then 91, then 68 — without you ever writing scores[0], scores[1], scores[2] by hand.",
      code: "for score in scores:\n    print(score)\n\n72\n85\n91\n68",
    },
    {
      label: "4. append() grows a list — often building a new one inside a loop",
      body:
        "doubled starts empty. Each pass through the loop computes score * 2 and appends it onto doubled, so by the time the loop finishes, doubled holds one transformed value for every original score, in the same order.",
      code:
        "doubled = []\nfor score in scores:\n    doubled.append(score * 2)\nprint(doubled)\n\n[144, 170, 182, 136]",
    },
  ],
  realWorldIntro:
    "Every shopping cart, leaderboard, or set of search results your code touches is stored as a list — and looping over it with for is exactly how you total up prices, display every row, or check each item against a rule, one at a time.",
  realWorldCode:
    "cart_prices = [12.50, 8.00, 24.99]\ntotal = 0\nfor price in cart_prices:\n    total = total + price\nprint(total)",
  sandbox: {
    kind: "code",
    challenge:
      "Add a second list called hot that only keeps temperatures of 85 and above (use the same for + if + append pattern as warm), then print hot.",
    starterCode:
      "temps = [58, 71, 84, 90, 62, 77]\nwarm = []\nfor t in temps:\n    if t >= 70:\n        warm.append(t)\nprint(warm)\nprint(len(warm))",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "prices = [10, 20, 30]\nwith_tax = []\nfor p in prices:\n    with_tax.append(p + 2)\nprint(with_tax)",
  quizOptions: [
    { key: "a", label: "[12, 22, 32]", correct: true },
    { key: "b", label: "[10, 20, 30]", correct: false },
    { key: "c", label: "36", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the loop visits 10, 20, and 30 in order, and each pass appends p + 2 (not p itself) onto with_tax, so the new list ends up as [12, 22, 32] while the original prices list is never changed.",
  quizFeedbackIncorrect:
    "Not quite — walk through it one item at a time: for each p in prices, the loop appends p + 2, not p, onto with_tax. That gives 10 + 2, 20 + 2, and 30 + 2 — so [12, 22, 32], not the original numbers and not a single total.",
  takeaway:
    "A list stores many values in one ordered variable, indexed from 0; len() tells you how many items it holds, and .append() adds new ones onto the end. A for loop visits every item automatically, one at a time — pair for with .append() to build a brand-new list out of an old one, which is the core pattern behind almost every program that works on a whole collection instead of a single value.",
};

export default content;
