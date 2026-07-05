import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 2,
  phaseLabel: "PYTHON BASICS",
  title: "Functions: Packaging Up Logic You'll Use Again",
  minutes: 20,
  concept:
    "A function is a named, reusable block of code that you define once with def and then call as many times as you want. Parameters are placeholders in the function's signature — like price in def total_with_tax(price): — that get filled in with a real value (an argument) every time the function is called. Inside the function body, that parameter behaves like any other variable, except it only exists while that particular call is running. return is how the function hands a result back to whoever called it: without it, calling a function just runs its code and silently gives you None, with nothing to store or print. Once a function is defined, calling it with different arguments is how you reuse the exact same logic for as many different inputs as you need.",
  conceptSimpler:
    "A function is like a vending machine: you define it once (wire up the machine), then every time someone inserts an input (a parameter), the machine runs the same process and returns an output — without you having to rebuild the machine each time.",
  vizStages: [
    {
      label: "1. The problem: repeating the same logic",
      body:
        "Without a function, doing the same calculation for different values means copying and pasting the same lines over and over. It works, but it's repetitive, and if the formula ever needs to change, you'd have to find and fix every copy.",
      code: 'price = 20\ntax = price * 0.08\nprint(price + tax)\n\nprice = 45\ntax = price * 0.08\nprint(price + tax)',
    },
    {
      label: "2. def packages the logic into a name",
      body:
        "def gives this block of logic a name, total_with_tax, and turns price into a parameter — a placeholder that stands in for whatever value gets passed in later. Nothing runs yet; this just defines the function.",
      code: "def total_with_tax(price):\n    tax = price * 0.08\n    return price + tax",
    },
    {
      label: "3. Calling the function fills in the parameter",
      body:
        "Each call passes in a different argument for price. Python runs the function body with that value substituted in for price, and return sends the final result back out to wherever the function was called.",
      code: "print(total_with_tax(20))\nprint(total_with_tax(45))\n\n21.6\n48.6",
    },
    {
      label: "4. return hands back a value you can reuse",
      body:
        "Because total_with_tax returns a value instead of just printing one, you can capture that value in a variable and keep using it — do more math with it, pass it to another function, or print it later.",
      code: "result = total_with_tax(100)\ndoubled = result * 2\nprint(doubled)",
    },
  ],
  realWorldIntro:
    "Every 'calculate shipping cost' or 'format a display price' operation on a real site is a function — written once, then called from dozens of places in the codebase with different inputs each time.",
  realWorldCode: "def shipping_cost(weight):\n    return weight * 2 + 5\n\nprint(shipping_cost(3))",
  sandbox: {
    kind: "code",
    challenge:
      "Add a second function called total_pay(salary) that returns salary plus its bonus_pay, then print total_pay(50000).",
    starterCode:
      "def bonus_pay(salary):\n    bonus = salary * 0.05\n    return bonus\n\nprint(bonus_pay(40000))\nprint(bonus_pay(62000))",
  },
  quizQuestion: "What does the following code print?",
  quizCode: "def square(n):\n    return n * n\n\ndef cube(n):\n    return square(n) * n\n\nprint(cube(3))",
  quizOptions: [
    { key: "a", label: "27", correct: true },
    { key: "b", label: "9", correct: false },
    { key: "c", label: "6", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — cube(3) calls square(3) first, which returns 3 * 3 = 9, and then multiplies that 9 by n (which is still 3) to get 27.",
  quizFeedbackIncorrect:
    "Not quite — trace it step by step: square(3) runs first and returns 3 * 3 = 9, then cube multiplies that 9 by n (3) to reach 27.",
  takeaway:
    "def packages logic into a reusable, named block; parameters are the inputs it expects, and return is how it hands a result back to whoever called it. Write the logic once, then call it as many times as you need with different arguments.",
};

export default content;
