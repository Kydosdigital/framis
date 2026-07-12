import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 2,
  phaseLabel: "PYTHON BASICS",
  title: "Functions: write the steps once, use them again",
  minutes: 20,
  concept:
    "Imagine a recipe card. You write the steps down once, and after that you can follow it any time to make the same thing — you never rewrite the recipe, you just use it again.\n\n" +
    "A function is a recipe for your code: a set of steps you write once, give a name, and then run whenever you want. Writing the function is called defining it. Running it is called calling it.\n\n" +
    "You define a function with the word def, then a name, then a pair of round brackets, with the steps listed underneath. Most recipes have blanks to fill in — \"___ cups of flour\". In a function, those blanks are called parameters: named placeholders you put inside the brackets.\n\n" +
    "When you call the function, you hand it real values to drop into those blanks. Each real value you pass in is called an argument — two cups of flour instead of a blank.\n\n" +
    "One more word matters: return. return is how the recipe hands you back the finished dish. A function with no return still runs its steps, but gives nothing back — Python calls that empty result None, and there's nothing to save or use. With return, you get a real result you can store in a variable, print, or hand to another function.\n\n" +
    "The whole point is reuse: write the steps once, then call the function with different arguments as many times as you like — the same recipe, different ingredients, a fresh result every time.",
  conceptSimpler:
    "A function is a recipe card.\n\n" +
    "You write the steps once and give it a name — that's def. The blanks you fill in are parameters. The real ingredients you hand it each time are arguments. And return is the finished dish it hands back.\n\n" +
    "Write it once, cook with different ingredients as often as you like.",
  vizStages: [
    {
      label: "1. The problem: writing the same steps over and over",
      body:
        "Without a recipe to reuse, you rewrite the same steps every time. Here the same tax calculation is copied out for two different prices. It works — but if the tax rate ever changes, you'd have to hunt down and fix every copy.",
      code: "price = 20\ntax = price * 0.08\nprint(price + tax)\n\nprice = 45\ntax = price * 0.08\nprint(price + tax)",
    },
    {
      label: "2. def writes the recipe down once, under a name",
      body:
        "def writes the steps once under the name total_with_tax, and turns price into a parameter — the blank you'll fill in later. Nothing runs yet: you've written the recipe, not cooked with it.",
      code: "def total_with_tax(price):\n    tax = price * 0.08\n    return price + tax",
    },
    {
      label: "3. Calling it fills the blank with an argument",
      body:
        "Now you follow the recipe. total_with_tax(20) passes 20 in as the argument, so price becomes 20 for that run, and return hands the finished number back — it prints 21.6. Call it again with 45 and the same recipe gives 48.6.",
      code: "print(total_with_tax(20))\nprint(total_with_tax(45))",
    },
    {
      label: "4. return lets you keep the result",
      body:
        "Because the recipe returns its number instead of just printing it, you can catch that number in a variable and keep going. Here the returned total is saved as result, then doubled — so this prints 200.",
      code: "result = total_with_tax(100)\ndoubled = result * 2\nprint(doubled)",
    },
  ],
  realWorldIntro:
    "Every \"work out the delivery cost\" or \"add up your basket\" step in a shopping app is a function like this — written once, then followed (called) from all over the app with different numbers each time. Nobody rewrites the delivery recipe on every page; they reuse the one they already wrote.",
  realWorldCode: "def delivery_cost(weight):\n    return weight * 2 + 5\n\nprint(delivery_cost(3))",
  sandbox: {
    kind: "code",
    challenge:
      "You have a recipe called bonus_pay that returns 5% of a salary. Write a second recipe, total_pay(salary), that returns the salary plus its bonus_pay — you can call bonus_pay from inside it. Then print total_pay(50000).",
    starterCode:
      "def bonus_pay(salary):\n    bonus = salary * 0.05\n    return bonus\n\nprint(bonus_pay(40000))\nprint(bonus_pay(62000))",
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode: "def square(n):\n    return n * n\n\ndef cube(n):\n    return square(n) * n\n\nprint(cube(3))",
  quizOptions: [
    { key: "a", label: "27", correct: true },
    { key: "b", label: "9", correct: false },
    { key: "c", label: "6", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — cube(3) follows square(3) first, which hands back 3 * 3 = 9, then multiplies that 9 by n (still 3) to get 27.",
  quizFeedbackIncorrect:
    "Not quite — follow it one step at a time: square(3) runs first and returns 3 * 3 = 9, then cube multiplies that 9 by n (3) to reach 27.",
  takeaway:
    "A function is a recipe: def writes the steps once under a name, parameters are the blanks you fill in, arguments are the real values you pass each time, and return hands back the finished result. Write it once, then call it with different arguments as often as you need.",
  explainers: [
    {
      id: "what-is-function",
      term: "What's a Function?",
      emoji: "📋",
      shortDef: "A function is a named set of steps you write once and can run (call) as many times as you like — like a recipe card.",
      longDef:
        "You define a function with def, a name, and brackets, then list its steps underneath, indented. After that, the steps have a name you can use anywhere. \"Defining\" writes the recipe; \"calling\" (writing the name followed by brackets, like total_with_tax(20)) actually follows it. The steps don't run until you call it.",
      whyMatters:
        "Real programs do the same job — work out a price, format a date, check a password — over and over. A function lets you write that job once and reuse it everywhere, so a fix in one place fixes it everywhere.",
      realWorldExample:
        "A recipe card for pancakes: you write it once, then make pancakes any morning you like without rewriting the steps. The card is the function; making the pancakes is calling it.",
      relatedTerms: ["parameter-vs-argument", "what-is-return"],
      expandedByDefault: true,
    },
    {
      id: "parameter-vs-argument",
      term: "Parameter vs. Argument",
      emoji: "🧩",
      shortDef: "A parameter is the blank in the recipe; an argument is the real ingredient you fill it with each time you call the function.",
      longDef:
        "In def total_with_tax(price):, price is a parameter — a named blank inside the brackets. When you call total_with_tax(20), the 20 is the argument: the real value that fills that blank for this one run. Inside the function, the parameter behaves like a normal variable, but it only exists while that call is running.",
      whyMatters:
        "This is what lets one function handle many inputs. Change the argument and you get a different result from the exact same steps — no rewriting.",
      realWorldExample:
        "A recipe says \"___ cups of flour\" (the parameter). Today you pour in 2 cups (the argument); tomorrow you pour in 3. Same recipe, different amount, different pancakes.",
      relatedTerms: ["what-is-function"],
    },
    {
      id: "what-is-return",
      term: "What Does return Do?",
      emoji: "🎁",
      shortDef: "return hands a finished result back out of the function, so you can store it or use it.",
      longDef:
        "When Python reaches return inside a function, it stops there and sends that value back to wherever the function was called. That result can be saved in a variable, printed, or passed straight into another function. printing a value inside a function only shows it on screen; return actually gives it back so your code can keep using it.",
      whyMatters:
        "Without return, a function does its work but hands you nothing to build on. return is what turns a function into a reusable step in a bigger calculation.",
      realWorldExample:
        "Following the recipe hands you an actual plate of pancakes (the return value) — not just the smell of cooking. Now you can eat them, share them, or stack them with something else.",
      relatedTerms: ["what-is-none"],
    },
    {
      id: "what-is-none",
      term: "What's None?",
      emoji: "⬜",
      shortDef: "None is Python's word for \"nothing here\" — what a function hands back when it has no return.",
      longDef:
        "If a function runs its steps but never reaches a return, Python still hands something back: the special value None, meaning \"no real result.\" You can't do useful maths with None or display it as an answer, so if you tried to save the result of such a function, you'd just be holding \"nothing.\"",
      whyMatters:
        "A very common beginner surprise is a function that prints a value but forgets to return it — so trying to reuse its result gives None. Knowing None means \"you forgot to hand something back\" saves a lot of confusion.",
      realWorldExample:
        "You follow all the recipe steps but never actually plate the food — so when someone asks for their pancakes, you hand them an empty plate. That empty plate is None.",
      relatedTerms: ["what-is-return"],
    },
  ],
};

export default content;
