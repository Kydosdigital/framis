import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 1,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "The For + If Filter: Building a New List From an Old One",
  minutes: 22,
  concept:
    "A for loop lets you walk through a list one item at a time, and an if check inside that loop lets you make a decision about each item as you pass it. The filter pattern combines these two moves: start with an empty list, loop over the original list, and only call .append() to add an item into the new list when it passes the if condition. Anything that fails the check just gets skipped — it stays untouched in the original list but never makes it into the new one. By the time the loop finishes, you're left with a brand-new list containing only the items you actually wanted, built entirely out of for + if + append.",
  conceptSimpler:
    "It's like a bouncer checking IDs at a door: everyone in line gets looked at one at a time, but only the ones who meet the rule get waved through into the new list.",
  vizStages: [
    {
      label: "1. Two lists: one full, one empty",
      body:
        "You start with the original list you want to filter, plus a brand-new empty list called passing that will hold only the scores that qualify.",
      code: "scores = [55, 82, 91, 40, 76]\npassing = []",
    },
    {
      label: "2. The for loop hands you one item at a time",
      body:
        "for score in scores runs the loop body once per item in order, so score becomes 55, then 82, then 91, then 40, then 76 — one value at a time, never all at once.",
      code: "for score in scores:\n    if score >= 60:\n        passing.append(score)",
    },
    {
      label: "3. The if check decides: keep or skip",
      body:
        "Every score gets tested against the same rule. When score is 91, 91 >= 60 is True, so it's appended into passing. When score is 40, 40 >= 60 is False, so nothing happens — it's silently skipped.",
      code: "score = 91  ->  91 >= 60 is True   ->  passing.append(91)\nscore = 40  ->  40 >= 60 is False  ->  skipped",
    },
    {
      label: "4. After the loop: only the winners remain",
      body:
        "Once every item has been checked, passing holds only the scores that passed the test. The loop never deletes anything from scores — it just decides what gets copied over.",
      code: "print(passing)\nprint(len(passing))\n\n[82, 91, 76]\n3",
    },
  ],
  realWorldIntro:
    "This exact for + if + append pattern is what runs behind a \"Show only in-stock items\" toggle or a \"send this promotion to opted-in users only\" job — the server starts with one big list from the database and hands back a smaller, filtered one.",
  realWorldCode: "for product in products:\n    if product[\"in_stock\"]:\n        available.append(product)",
  sandbox: {
    kind: "code",
    challenge:
      "Extend the code so it also builds a second list called big_orders that only keeps totals over 100, then print big_orders too.",
    starterCode:
      "orders = [42, 88, 15, 75, 120, 60, 8]\nfree_shipping = []\nfor total in orders:\n    if total >= 75:\n        free_shipping.append(total)\nprint(\"Free shipping orders:\", free_shipping)\nprint(\"Count:\", len(free_shipping))",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "nums = [3, 8, 15, 4, 9, 20]\nbig = []\nfor n in nums:\n    if n > 8:\n        big.append(n)\nprint(big)",
  quizOptions: [
    { key: "a", label: "[15, 9, 20]", correct: true },
    { key: "b", label: "[3, 8, 15, 4, 9, 20]", correct: false },
    { key: "c", label: "[15, 20]", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — each number tested with n > 8 only gets appended when it's actually greater than 8, so 15, 9, and 20 make it into big in the order they were found; 8 itself fails since 8 > 8 is False.",
  quizFeedbackIncorrect:
    "Not quite — big only ends up with the numbers where n > 8 is True. Walk through nums one at a time (3, 8, 15, 4, 9, 20) and check each one against the rule to see which three actually get appended.",
  takeaway:
    "for + if + append is the filter pattern: loop over a list, test each item, and only copy the ones that pass into a new list. Once you see it once, you'll spot it everywhere — search results, dashboards, notifications — anywhere a big collection needs to become a smaller, relevant one.",
  nextUpLabel: "File I/O + Errors + Debugging",
};

export default content;
