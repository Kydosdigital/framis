import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 1,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "Real JavaScript: Variables, Types, and Functions",
  minutes: 20,
  concept:
    "JavaScript is the one language browsers actually run — every interactive thing you've heard about (buttons, forms, live updates) ultimately comes down to real JS syntax, and it's time to write some. Start with variables: \"let\" declares a value you plan to change later, and \"const\" declares one you don't — reach for const by default and only use let when a value genuinely needs to be reassigned, like a running total or a counter. Every value has a type, and three cover most of what you'll touch day to day: number (42, 3.14), string (\"hello\", built with double, single, or backtick quotes), and boolean (true or false) — \"typeof\" tells you which one you're holding when you're not sure. Backtick strings are special: they're template literals, and anything inside \"${ }\" gets evaluated and dropped into the string, which beats gluing pieces together with +. JavaScript's operators mostly look like what you'd expect (+ - * / for arithmetic, === and !== to compare, && || ! for logic) plus one new shape: the ternary \"condition ? ifTrue : ifFalse\", a compact if/else that produces a value instead of running a block. Finally, functions: a \"function name(params) { ... }\" declaration is the classic form, and an arrow function — \"(params) => expression\" or \"(params) => { ... }\" — is a shorter way to write the same idea, especially for small one-off pieces of logic you're about to pass around.",
  conceptSimpler:
    "let is a labeled box you can swap the contents of any time; const is a box you sealed the moment you filled it. A function is a recipe card: hand it ingredients (parameters), it follows the same steps every time, and hands you back a result.",
  vizStages: [
    {
      label: "1. let vs. const",
      body:
        "let can be reassigned as many times as you want — here score goes up after being declared. const can't be reassigned at all, which is exactly why you use it for values like a player's name that should never accidentally change mid-program.",
      code: "let score = 10;\nconst playerName = \"Ava\";\nscore = score + 5;\nconsole.log(playerName, \"scored\", score);",
    },
    {
      label: "2. Three data types you'll use constantly",
      body:
        "Every value is one of a handful of types. Here age is a number, city is a string, and isEnrolled is a boolean — typeof asks JavaScript directly which one each variable is holding.",
      code: "let age = 16;\nlet city = \"Austin\";\nlet isEnrolled = true;\nconsole.log(typeof age, typeof city, typeof isEnrolled);",
    },
    {
      label: "3. Template literals and the ternary operator",
      body:
        "Backtick strings let you drop a live expression straight into text with ${ }, no gluing with + required. The ternary here — temp > 90 ? \"hot\" : \"mild\" — picks one of two values based on a condition, all in one line.",
      code: "let temp = 95;\nlet status = temp > 90 ? \"hot\" : \"mild\";\nconsole.log(`It's ${status} today (${temp} degrees).`);",
    },
    {
      label: "4. Two ways to write a function",
      body:
        "A function declaration names a reusable piece of logic up front. An arrow function does the same thing in a shorter shape — square(x) and cube use different syntax but both take a value in and return one out.",
      code: "function square(x) {\n  return x * x;\n}\nconst cube = x => x * x * x;\nconsole.log(square(5), cube(3));",
    },
  ],
  realWorldIntro:
    "Every price you've ever seen drop the instant a discount code is applied — no page reload, the number just changes — is a small function exactly like this one, run the moment the code is entered, with the result dropped straight into a template literal so the page can display it.",
  realWorldCode:
    "function applyDiscount(price, percentOff) {\n  return price - (price * percentOff) / 100;\n}\n\nconst finalPrice = applyDiscount(40, 25);\nconsole.log(`Final price: $${finalPrice}`);",
  sandbox: {
    kind: "code",
    challenge:
      "describeMember only reports a name and a visit count. Give it a third parameter, isPro, and use a ternary to add \" and is a Pro member\" or \" and is on the free plan\" to the sentence. While you're in there, rewrite the string itself as a template literal instead of gluing pieces together with +. Update both calls below to pass true or false, and check that each printed sentence reads correctly.",
    starterCode:
      "function describeMember(name, visits) {\n  return name + \" has visited \" + visits + \" times.\";\n}\n\nconsole.log(describeMember(\"Jordan\", 12));\nconsole.log(describeMember(\"Priya\", 3));",
    language: "javascript",
  },
  quizQuestion:
    "What does this code print?",
  quizCode:
    "let price = 20;\nconst label = \"Book\";\nprice = price - 5;\nconsole.log(`${label}: $${price}`);",
  quizOptions: [
    { key: "a", label: "Book: $15", correct: true },
    { key: "b", label: "Book: $20 — because label is a const, JavaScript ignores the later change to price", correct: false },
    { key: "c", label: "${label}: $${price} — printed literally, with the braces and dollar signs included", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — price is a let, so price = price - 5 reassigns it from 20 to 15; the template literal then evaluates ${label} and ${price} and substitutes their current values, giving \"Book: $15\".",
  quizFeedbackIncorrect:
    "Not quite — label being const has nothing to do with price, which is a separate let variable that gets reassigned to 15 right before the log; and template literals evaluate everything inside ${ } rather than printing it as literal text, so the output is \"Book: $15\".",
  takeaway:
    "let and const declare variables, number/string/boolean cover most of the values you'll work with, template literals build strings out of live expressions, and functions — whether written as declarations or arrow functions — are how you name a piece of logic once and reuse it anywhere. This is the real syntax the rest of the module builds on.",
  nextUpLabel: "React Basics + Components",
};

export default content;
