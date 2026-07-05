import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 2,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "Control Flow, Arrays, and Objects in Real JavaScript",
  minutes: 22,
  concept:
    "With variables, types, and functions in hand, the next piece is deciding what runs and how many times. \"if / else if / else\" branches on a condition exactly like you'd expect, and JavaScript gives you two shapes of loop: a classic \"for (let i = 0; i < n; i++)\" when you need the index itself, and \"for (const item of array)\" when you just want each item, one at a time, without touching an index at all. Arrays come with built-in methods that replace a lot of hand-written loops: \".filter(fn)\" keeps only the items where fn returns true, \".map(fn)\" transforms every item into something new and returns a same-length array of the results, and \".forEach(fn)\" just runs fn once per item for its side effects, without collecting anything. These chain naturally — \"array.filter(...).map(...)\" reads left to right as \"first keep these, then transform them.\" The other shape you'll use constantly is the object literal: \"{ name: \\\"Ava\\\", score: 88 }\" bundles related values under named keys instead of juggling separate variables, and you read or change one with dot notation, like \"student.score = 91\". Arrays of objects — a list of records, each with its own named fields — are how almost all real data gets modeled and processed.",
  conceptSimpler:
    "if/else is a fork in a hallway. A for loop is walking a hallway a fixed number of times; for-of is walking through a line of people and greeting each one without needing to know their position in line. filter is a bouncer letting some people through and not others; map sends everyone who gets through into a costume-change booth. An object is an index card with labeled fields instead of one bare fact.",
  vizStages: [
    {
      label: "1. if / else if / else",
      body:
        "Conditions are checked top to bottom, and the first one that's true wins — the rest are skipped entirely. Here 95 matches the first branch, 82 falls through to the second, and 60 falls all the way to else.",
      code: "function letterGrade(score) {\n  if (score >= 90) {\n    return \"A\";\n  } else if (score >= 80) {\n    return \"B\";\n  } else {\n    return \"C or below\";\n  }\n}\nconsole.log(letterGrade(95), letterGrade(82), letterGrade(60));",
    },
    {
      label: "2. for vs. for-of",
      body:
        "The classic for loop gives you the index i, which is useful when you need to know position or count up manually. for-of skips the index bookkeeping entirely and just hands you each item directly, one at a time — cleaner whenever you don't actually need i.",
      code: "const scores = [95, 82, 60, 71];\n\nfor (let i = 0; i < scores.length; i++) {\n  console.log(`index ${i}: ${scores[i]}`);\n}\n\nfor (const s of scores) {\n  console.log(\"score:\", s);\n}",
    },
    {
      label: "3. filter and map",
      body:
        "filter walks the array and keeps only the items where the function returns true — passing is 3 numbers long, the original 4-item array untouched. map walks every item and transforms it into something new, always returning the same number of items it started with.",
      code: "const scores = [95, 82, 60, 71];\nconst passing = scores.filter(s => s >= 70);\nconst grades = scores.map(s => s >= 90 ? \"A\" : \"not A\");\nconsole.log(passing);\nconsole.log(grades);",
    },
    {
      label: "4. Object literals",
      body:
        "An object bundles related values under named keys instead of scattering them across separate variables. Dot notation reads a property (student.name) and also writes one — reassigning student.score changes it on the same object.",
      code: "const student = { name: \"Priya\", score: 88, passed: true };\nconsole.log(student.name, student.score);\nstudent.score = 91;\nconsole.log(student.score);",
    },
  ],
  realWorldIntro:
    "Any dashboard that shows \"2 of 3 students passed\" is running exactly this pattern under the hood: an array of record objects gets filtered down by a condition, and the resulting array's .length is the number that actually gets displayed.",
  realWorldCode:
    "const students = [\n  { name: \"Ava\", score: 92 },\n  { name: \"Lee\", score: 58 },\n  { name: \"Kim\", score: 74 },\n];\n\nconst passing = students.filter(s => s.score >= 60);\nconsole.log(`${passing.length} of ${students.length} students passed`);",
  sandbox: {
    kind: "code",
    challenge:
      "This prints only the orders over $20. Add code below the loop that uses .map() to turn bigOrders into an array of description strings shaped like \"Headphones — $45\", then compute and log the combined total price of just the big orders (a for-of loop with a running total, or .reduce(), both work).",
    starterCode:
      "const orders = [\n  { item: \"Notebook\", price: 4 },\n  { item: \"Headphones\", price: 45 },\n  { item: \"Desk Lamp\", price: 22 },\n  { item: \"Sticky Notes\", price: 3 },\n];\n\nconst bigOrders = orders.filter(order => order.price > 20);\n\nfor (const order of bigOrders) {\n  console.log(`${order.item}: $${order.price}`);\n}",
    language: "javascript",
  },
  quizQuestion:
    "What does this code print?",
  quizCode:
    "const nums = [3, 8, 12, 5, 20];\nconst result = nums.filter(n => n > 6).map(n => n * 2);\nconsole.log(result);",
  quizOptions: [
    { key: "a", label: "[ 16, 24, 40 ]", correct: true },
    { key: "b", label: "[ 6, 16, 24, 10, 40 ]", correct: false },
    { key: "c", label: "[ 3, 8, 12, 5, 20 ]", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — filter first keeps only 8, 12, and 20 (the values greater than 6), then map doubles each of those survivors, giving [16, 24, 40]; 3 and 5 never make it past filter, so they're never doubled at all.",
  quizFeedbackIncorrect:
    "Not quite — walk it in order: filter runs first and throws out 3 and 5 (not greater than 6), keeping only [8, 12, 20]; map then doubles just those three survivors, giving [16, 24, 40] — filter and map both apply, but filter narrows the array before map ever touches it.",
  takeaway:
    "if/else picks a path, for and for-of repeat work a controlled number of times, filter and map turn hand-written loops into one-line transformations, and object literals let you bundle related fields into one value instead of tracking them as separate variables. Arrays of objects — records with named fields — are how most real data actually gets modeled.",
};

export default content;
