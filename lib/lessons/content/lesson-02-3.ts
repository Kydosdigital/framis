import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 3,
  phaseLabel: "PYTHON BASICS",
  title: "Reading Python's Shape: Indentation, Comments, and Branching",
  minutes: 16,
  concept:
    "Python doesn't use curly braces or an \"end\" keyword to mark where a block of code starts and stops — it uses indentation. Every line indented one level (4 spaces) underneath a line ending in a colon belongs to that block; the moment a line returns to the earlier indentation, you're back outside it. A # starts a comment that runs to the end of the line, and Python ignores it completely — comments exist purely to explain your intent to a human reading the code later. if, elif, and else let a program choose exactly one path: Python checks each condition in order from top to bottom and runs the first block whose condition is True, skipping every other branch, even ones that would also be True. else is the catch-all that runs only when nothing above it matched.",
  conceptSimpler:
    "Indentation is like an outline in a document — what's tabbed in belongs under the heading above it. if/elif/else is a flowchart's decision diamond: follow the arrows in order and take the very first path that fits.",
  vizStages: [
    {
      label: "1. Indentation defines what's inside a block",
      body:
        "Everything indented one level under if age >= 18: belongs to that block. The line print(\"thanks for visiting\") is back at the original indentation, so it's outside the if — it always runs, whether the condition was True or not.",
      code: 'age = 20\nif age >= 18:\n    print("welcome in")\nprint("thanks for visiting")',
    },
    {
      label: "2. Comments explain, they don't execute",
      body:
        "Anything after a # is a comment. Python skips right over it, both on its own line and trailing at the end of a line of real code — comments are notes for people, not instructions for the computer.",
      code: '# only give a discount to members\nis_member = True\nif is_member:\n    print("10% off")  # applied at checkout',
    },
    {
      label: "3. if / elif / else pick exactly one path",
      body:
        "Python tests score >= 90 first; if that's False it moves to the next elif, and so on, stopping at the very first True condition. Here score is 74, so it skips the A and B checks, matches C, and never even looks at else.",
      code: 'score = 74\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")',
    },
    {
      label: "4. Indentation changes meaning, not just looks",
      body:
        'print("hi") is indented under the if, so it only runs when logged_in is True. print("bye") sits back at the same indentation as if itself, so it is not part of the if block — it runs every single time, no matter what logged_in is.',
      code: 'logged_in = False\nif logged_in:\n    print("hi")\nprint("bye")',
    },
  ],
  realWorldIntro:
    "Every shipping-cost calculator, age gate, or \"if the cart is empty, show a message\" feature is an if/elif/else chain, checked top to bottom in exactly this order.",
  realWorldCode:
    'cart_total = 0\nif cart_total <= 0:\n    print("Your cart is empty")\nelif cart_total < 25:\n    print("Add $" + str(25 - cart_total) + " more for free shipping")\nelse:\n    print("You qualify for free shipping")',
  sandbox: {
    kind: "code",
    challenge:
      'Add another elif branch between "Warm" and "else" that prints "Mild" for temperatures from 50 up to (but not including) 70, then test it by changing temp to 60.',
    starterCode:
      '# categorize a temperature reading\ntemp = 82\n\nif temp >= 90:\n    print("Hot")\nelif temp >= 70:\n    print("Warm")\nelse:\n    print("Cool")',
  },
  quizQuestion: "What does the following code print?",
  quizCode: 'x = 15\nif x > 20:\n    print("big")\nelif x > 10:\n    print("medium")\nelse:\n    print("small")',
  quizOptions: [
    { key: "a", label: "medium", correct: true },
    { key: "b", label: "small", correct: false },
    { key: "c", label: "big", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — Python checks conditions top to bottom and stops at the first True one; 15 > 20 is False, but 15 > 10 is True, so \"medium\" prints and else is never reached.",
  quizFeedbackIncorrect:
    'Not quite — walk through the conditions in order: 15 > 20 is False, so Python moves to elif x > 10, which is True (15 > 10), so "medium" prints and else never runs.',
  takeaway:
    "Indentation, not braces or keywords, is how Python knows what belongs inside a block. Comments starting with # are ignored entirely, and if/elif/else run at most one branch — checked top to bottom, stopping at the first True condition.",
};

export default content;
