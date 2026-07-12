import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 3,
  phaseLabel: "PYTHON BASICS",
  title: "The shape of Python: indentation, comments, and choices",
  minutes: 18,
  concept:
    "When you write directions for a friend, you do three things without even thinking: you group steps together, you scribble little notes in the margin, and you tell them what to do at each decision point. Python code works the same way — and this lesson is those three moves.\n\n" +
    "First, grouping. Many languages use brackets to show which steps belong together. Python uses indentation instead — spaces at the start of a line. Any line indented underneath a line that ends with a colon (:) belongs to that group, which is called a block. The moment a line goes back to the left edge, you've stepped out of the block. So in Python the shape of your code isn't decoration — it's the meaning.\n\n" +
    "Second, notes. A hash symbol (#) starts a comment: everything after it on that line is a note for a human, and Python ignores it completely. Comments never change what the code does. They're the margin scribbles that help the next person — often future-you — understand why.\n\n" +
    "Third, decisions. A condition is a yes/no question, like age >= 18 (\"is age at least 18?\"), and its answer is either True or False. An if statement runs its block only when its condition is True. You can add more choices with elif (short for \"else, if...\") and finish with else, the catch-all that runs when nothing above it matched.\n\n" +
    "Here's the key rule for decisions: Python checks the conditions from top to bottom and takes the very first one that's True, then skips all the rest — even ones that would also have been true. It's exactly like directions: \"if it's raining, take the bus; otherwise if you've got your bike, cycle; otherwise, walk.\" Your friend takes the first option that fits, not all of them.",
  conceptSimpler:
    "Think of writing directions for a friend.\n\n" +
    "Indentation groups steps together — the tabbed-in lines belong to the line above them. That's how Python knows what's \"inside\" an if.\n\n" +
    "A # is a margin note for a human; Python ignores it.\n\n" +
    "if / elif / else are the decision points: \"if it's raining, take the bus; otherwise, walk.\" Python takes the first option that fits and skips the rest.",
  vizStages: [
    {
      label: "1. Indentation groups steps into a block",
      body:
        "Everything indented under \"if age >= 18:\" belongs to that block, so \"welcome in\" only prints when the condition is True. The next line, \"thanks for visiting\", is back at the left edge — it's outside the if, so it always prints. Here age is 20, so both lines print.",
      code: 'age = 20\nif age >= 18:\n    print("welcome in")\nprint("thanks for visiting")',
    },
    {
      label: "2. Comments are notes for people, not the computer",
      body:
        "Anything after a # is a comment, and Python skips it — both on its own line and trailing after real code. These notes are for whoever reads the code later, not instructions to run. This example still just prints \"10% off\".",
      code: '# only members get a discount\nis_member = True\nif is_member:\n    print("10% off")  # shown at checkout',
    },
    {
      label: "3. if / elif / else — the first match wins",
      body:
        "Python checks \"score >= 90\" first; it's False, so it moves to the next question, then the next, stopping at the first one that's True. Here score is 74, so it skips A and B, matches \"C\", and never even looks at else. Only one line prints.",
      code: 'score = 74\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")',
    },
    {
      label: "4. Indentation changes the meaning, not just the look",
      body:
        'print("hi") is indented under the if, so it only runs when logged_in is True. print("bye") sits back at the left edge, level with the if, so it is not part of the block — it runs every time. Here logged_in is False, so only "bye" prints.',
      code: 'logged_in = False\nif logged_in:\n    print("hi")\nprint("bye")',
    },
  ],
  realWorldIntro:
    "Every \"if your basket is empty, show a message\" or age check on a website is an if / elif / else chain, checked top to bottom in exactly this order. The site follows your directions and takes the first path that fits the situation.",
  realWorldCode:
    'basket_total = 0\nif basket_total <= 0:\n    print("Your basket is empty")\nelif basket_total < 25:\n    print("Add a bit more for free delivery")\nelse:\n    print("You have got free delivery")',
  sandbox: {
    kind: "code",
    challenge:
      "This code sorts a temperature into Hot, Warm, or Cool. Add another elif branch between \"Warm\" and else that prints \"Mild\" for temperatures from 50 up to (but not including) 70. Then change temp to 60 and check it prints \"Mild\".",
    starterCode:
      '# sort a temperature into a label\ntemp = 82\n\nif temp >= 90:\n    print("Hot")\nelif temp >= 70:\n    print("Warm")\nelse:\n    print("Cool")',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode: 'x = 15\nif x > 20:\n    print("big")\nelif x > 10:\n    print("medium")\nelse:\n    print("small")',
  quizOptions: [
    { key: "a", label: "medium", correct: true },
    { key: "b", label: "small", correct: false },
    { key: "c", label: "big", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — Python checks the conditions top to bottom and stops at the first True one. 15 > 20 is False, but 15 > 10 is True, so \"medium\" prints and else is never reached.",
  quizFeedbackIncorrect:
    "Not quite — go through the conditions in order: 15 > 20 is False, so Python moves to elif x > 10, which is True (15 is more than 10), so \"medium\" prints and else never runs.",
  takeaway:
    "Indentation is how Python groups steps into a block — the tabbed-in lines belong to the line above. A # starts a comment Python ignores. And if / elif / else pick at most one path, checked top to bottom, stopping at the first condition that's True.",
  explainers: [
    {
      id: "what-is-indentation",
      term: "What's Indentation (and a Block)?",
      emoji: "📐",
      shortDef: "Indentation is the spaces at the start of a line. In Python, the indented lines under a colon form a block — the group of steps that belong together.",
      longDef:
        "A line that ends in a colon (:) — like an if — expects a block underneath it, indented by four spaces. Those indented lines are \"inside\" the if. As soon as a line returns to the left edge, it's back outside. Unlike most languages, Python has no brackets or \"end\" word marking blocks; the indentation itself is the instruction, so lining code up correctly is not optional neatness — it changes what runs.",
      whyMatters:
        "Getting indentation wrong is the most common early Python error. A line that's meant to be inside an if but isn't indented will run every time; one that's accidentally indented will run only sometimes. The shape has to match the meaning.",
      realWorldExample:
        "In written directions, the steps tucked under \"When you reach the park:\" clearly belong to that moment. Indentation is that tucking-under — it shows which steps happen as part of the line above.",
      relatedTerms: ["if-elif-else"],
      expandedByDefault: true,
    },
    {
      id: "what-is-comment",
      term: "What's a Comment (#)?",
      emoji: "🗒️",
      shortDef: "A comment starts with # and is a note for humans — Python ignores everything after it.",
      longDef:
        "Anything from a # to the end of the line is a comment. Python runs none of it, whether it's on its own line or trailing at the end of a line of real code. Comments exist purely to explain intent — why the code does something — to the next person who reads it, which is very often you, a month later.",
      whyMatters:
        "Code says what happens; a good comment says why. On real projects, the why is what saves hours when someone (including future-you) has to change the code without breaking it.",
      realWorldExample:
        "A note in the margin of your directions — \"(this gate sticks, give it a push)\" — helps your friend but doesn't change the route. A # comment is exactly that margin note.",
      relatedTerms: ["what-is-indentation"],
    },
    {
      id: "what-is-condition",
      term: "What's a Condition (True / False)?",
      emoji: "⚖️",
      shortDef: "A condition is a yes/no question whose answer is either True or False — the two special values Python uses for yes and no.",
      longDef:
        "You build a condition by comparing values. >= means \"is at least\", > means \"greater than\", < means \"less than\", and == means \"is equal to\" (two equals signs, because a single = already means \"store this value\"). Each comparison works out to True or False, and that answer is what an if reads to decide whether to run its block.",
      whyMatters:
        "Every decision your program makes — show this, block that, charge more, warn the user — comes down to a condition being True or False. It's the switch that all branching runs on.",
      realWorldExample:
        "Before you leave, you ask \"is it raining?\" The answer, yes or no, decides what you do next. age >= 18 is that same yes/no question, written in code.",
      relatedTerms: ["if-elif-else"],
    },
    {
      id: "if-elif-else",
      term: "if / elif / else — Picking One Path",
      emoji: "🔀",
      shortDef: "if runs a block when its condition is True; elif adds another option; else is the catch-all. Python takes only the first path that fits.",
      longDef:
        "Python reads the conditions from top to bottom and runs the block of the very first one that's True, then skips everything else in the chain — even later conditions that would also have been true. elif (\"else, if\") lets you add as many extra options as you need between the first if and the final else. else has no condition; it runs only when nothing above it matched.",
      whyMatters:
        "Because only the first match runs, the order of your branches matters. Put the most specific condition first and the catch-all else last, or a broad condition near the top will grab cases you meant for a lower branch.",
      realWorldExample:
        "\"If it's raining, take the bus; otherwise if you've got your bike, cycle; otherwise, walk.\" You take the first option that fits your situation, not all three — that's exactly how if / elif / else behaves.",
      relatedTerms: ["what-is-condition", "what-is-indentation"],
    },
  ],
};

export default content;
