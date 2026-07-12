import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 4,
  phaseLabel: "PYTHON BASICS",
  title: "Lists and for loops: many values, one at a time",
  minutes: 24,
  concept:
    "Every variable so far has held exactly one value. But often you have many values that belong together — a set of test scores, a shopping basket, a class register. For that, Python has the list.\n\n" +
    "Picture a row of lockers along a wall, all under one name. A list is exactly that: one variable holding many values in order. You write it with square brackets and commas — scores = [72, 85, 91, 68] is a row of four lockers, each holding one number.\n\n" +
    "Each locker has a number, called its index — and here's the catch every beginner trips on: Python counts the lockers from 0, not 1. So scores[0] is the first locker (72), scores[1] is the second (85), and scores[3] is the fourth (68). len(scores) tells you how many lockers there are in total.\n\n" +
    "You can add lockers too. .append() bolts a new one onto the end of the row, so scores.append(50) makes the row one longer. That's how you grow a list that started out empty.\n\n" +
    "The real power is the for loop. Instead of opening scores[0], then scores[1], then scores[2] by hand, a for loop walks along the whole row for you. \"for score in scores:\" runs its indented block once per locker, with score standing for whatever's inside the current one — first 72, then 85, then 91, then 68.\n\n" +
    "Put the two together — walk a list with for, and .append() results into a new list as you go — and you have the move behind almost every program that works on a whole collection of things instead of one value at a time.",
  conceptSimpler:
    "A list is a row of lockers under one name — one variable holding many values in order.\n\n" +
    "Each locker has a number (its index), and Python counts them from 0, so the first locker is number 0. len() counts the lockers; .append() bolts a new one on the end.\n\n" +
    "A for loop walks the whole row for you, handing you what's inside each locker in turn — so you never have to open scores[0], scores[1], scores[2] by hand.",
  vizStages: [
    {
      label: "1. A list holds many values in one variable",
      body:
        "Square brackets with commas make a list — a row of lockers under one name. scores holds four numbers at once, in the order written. len(scores) counts them, so this prints the whole list, then 4.",
      code: "scores = [72, 85, 91, 68]\nprint(scores)\nprint(len(scores))",
    },
    {
      label: "2. Reach one locker by its number — counting from 0",
      body:
        "Square brackets after the name open one specific locker by its index. scores[0] is the first locker (72) and scores[2] is the third (91). Remember the first locker is number 0 — so this prints 72, then 91.",
      code: "print(scores[0])\nprint(scores[2])",
    },
    {
      label: "3. A for loop walks every locker automatically",
      body:
        "\"for score in scores:\" opens each locker in turn — score becomes 72, then 85, then 91, then 68 — running the indented block once each time, without you writing scores[0], scores[1], scores[2] by hand. So this prints all four numbers, one per line.",
      code: "for score in scores:\n    print(score)",
    },
    {
      label: "4. append() into a new list to transform a whole row",
      body:
        "doubled starts as an empty row. Each pass through the loop works out score * 2 and appends it onto doubled, so when the loop finishes, doubled holds a doubled value for every original score, in the same order — it prints [144, 170, 182, 136].",
      code: "doubled = []\nfor score in scores:\n    doubled.append(score * 2)\nprint(doubled)",
    },
  ],
  realWorldIntro:
    "Every shopping basket, leaderboard, or page of search results your code touches is stored as a list — and looping over it with for is exactly how a site adds up the prices in a basket, shows every row of a leaderboard, or checks each result against a rule, one item at a time.",
  realWorldCode:
    "basket_prices = [12.50, 8.00, 24.99]\ntotal = 0\nfor price in basket_prices:\n    total = total + price\nprint(total)",
  sandbox: {
    kind: "code",
    challenge:
      "This code builds a new list, warm, holding only the temperatures of 70 and above. Add a second list called hot that keeps only the temperatures of 85 and above, using the same for + if + append pattern. Then print hot.",
    starterCode:
      "temps = [58, 71, 84, 90, 62, 77]\nwarm = []\nfor t in temps:\n    if t >= 70:\n        warm.append(t)\nprint(warm)\nprint(len(warm))",
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    "prices = [10, 20, 30]\nwith_tax = []\nfor p in prices:\n    with_tax.append(p + 2)\nprint(with_tax)",
  quizOptions: [
    { key: "a", label: "[12, 22, 32]", correct: true },
    { key: "b", label: "[10, 20, 30]", correct: false },
    { key: "c", label: "36", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the loop visits 10, 20, and 30 in order, and each pass appends p + 2 (not p itself) onto with_tax, so the new list ends up as [12, 22, 32] while the original prices list is never touched.",
  quizFeedbackIncorrect:
    "Not quite — go through it one locker at a time: for each p in prices, the loop appends p + 2, not p. That gives 10 + 2, 20 + 2, and 30 + 2 — so [12, 22, 32], not the original numbers and not one total.",
  takeaway:
    "A list is a row of lockers under one name, indexed from 0. len() counts them and .append() adds one on the end. A for loop walks every locker for you, one at a time — pair for with .append() to build a brand-new list from an old one, the core move behind almost every program that works on a whole collection at once.",
  explainers: [
    {
      id: "what-is-list",
      term: "What's a List?",
      emoji: "🗄️",
      shortDef: "A list is one variable that holds many values in order, written with square brackets and commas: [72, 85, 91].",
      longDef:
        "Until now a variable held a single value. A list holds a whole ordered row of them under one name, so you can pass them around, count them, and work through them together. The values keep the exact order you wrote them in, and a list can grow or shrink over time.",
      whyMatters:
        "Almost all real data comes in groups — every order in a basket, every score in a class, every message in a chat. A list is how you hold a group in one place instead of inventing a separate variable for each item.",
      realWorldExample:
        "A row of lockers along a wall, all under one name: locker after locker, each holding one thing, kept in order. The whole row is the list.",
      relatedTerms: ["what-is-index", "what-is-for-loop"],
      expandedByDefault: true,
    },
    {
      id: "what-is-index",
      term: "What's an Index (and Why Start at 0)?",
      emoji: "🔢",
      shortDef: "An index is a value's position in a list. Python numbers positions from 0, so the first item is at index 0.",
      longDef:
        "Write square brackets with a number after a list name — scores[0] — to reach one item by its position. The surprise for everyone new to this is that counting starts at 0: the first item is index 0, the second is index 1, and a list of four items ends at index 3. It's a fixed rule of the language, not a mistake.",
      whyMatters:
        "\"Off-by-one\" mistakes — reaching for scores[1] expecting the first item, or scores[4] in a four-item list (which doesn't exist) — are among the most common beginner bugs. Remembering \"first item is 0\" prevents most of them.",
      realWorldExample:
        "Think of the lockers as numbered starting at 0: locker 0 is the first one you reach. Odd at first, but once it clicks, \"the first locker is number 0\" becomes automatic.",
      relatedTerms: ["what-is-list"],
    },
    {
      id: "what-is-for-loop",
      term: "What's a for Loop?",
      emoji: "🔁",
      shortDef: "A for loop runs the same block of code once for each item in a list, handing you one item at a time.",
      longDef:
        "\"for score in scores:\" walks through the list from first item to last. Each time round, the name you chose (score) is set to the current item, and Python runs the indented block underneath. You never write out the positions by hand — the loop visits every item for you, in order, however long the list is.",
      whyMatters:
        "Doing the same thing to every item — totalling prices, printing every row, checking each entry — is one of the most common jobs in all of programming. The for loop is how you say \"do this to each one\" without copying code per item.",
      realWorldExample:
        "Walking along the row of lockers, opening each in turn and doing the same thing with whatever's inside — that's a for loop. One pass per locker, start to end.",
      relatedTerms: ["what-is-list", "what-is-append"],
    },
    {
      id: "what-is-append",
      term: "What Does .append() Do?",
      emoji: "➕",
      shortDef: ".append() adds one new value onto the end of an existing list, making it one item longer.",
      longDef:
        "scores.append(50) sticks 50 onto the end of scores. A very common pattern is to start with an empty list ([]) and append to it inside a for loop, building a brand-new list one item at a time — often a transformed or filtered version of another list.",
      whyMatters:
        "Most useful lists aren't written out by hand; they're built up as a program runs — every valid result, every matching row. append inside a loop is the standard way to assemble that kind of list.",
      realWorldExample:
        "Bolting a new locker onto the end of the row when you need more space. The row keeps its order; it just gets one locker longer.",
      relatedTerms: ["what-is-for-loop", "what-is-list"],
    },
  ],
};

export default content;
