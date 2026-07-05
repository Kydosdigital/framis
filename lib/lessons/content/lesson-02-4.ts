import type { LessonData } from "../types";

const content: LessonData = {
  num: 2,
  orderIndex: 4,
  phaseLabel: "PYTHON BASICS",
  title: "Your First Real Script: Variables + a Function + a Decision",
  minutes: 24,
  concept:
    "A real program is rarely one concept in isolation — it's variables, functions, and if/else composed together into a small pipeline. First, variables hold the raw inputs: names, numbers, whatever the program has to work with. Next, a function takes some of those variables in as parameters and turns them into a single result with return, keeping the calculation logic in one reusable place instead of scattered inline. Finally, if/else looks at that result and decides what should happen next — which message to show, which path to take. Once you can see these three pieces working together, you can read (and write) most small scripts, because bigger programs are just more of the same pattern, layered deeper.",
  conceptSimpler:
    "Think of a small assembly line: raw materials (variables) go into a machine (a function) that produces a part (a return value), and an inspector at the end (if/else) sorts that part into a pass or fail bin.",
  vizStages: [
    {
      label: "1. Start with variables holding the raw inputs",
      body:
        "Before any logic runs, the program stores the facts it needs in plain variables: a name, hours worked, and an hourly rate. Nothing is calculated yet — this is just the raw data.",
      code: 'name = "Priya"\nhours_worked = 46\nhourly_rate = 22',
    },
    {
      label: "2. A function turns inputs into a result",
      body:
        "calculate_pay takes hours and rate as parameters and uses its own if/else to decide whether overtime applies, then returns a single number — the pay amount — without printing anything itself.",
      code:
        "def calculate_pay(hours, rate):\n    if hours > 40:\n        overtime = hours - 40\n        return 40 * rate + overtime * rate * 1.5\n    else:\n        return hours * rate",
    },
    {
      label: "3. if / else decides what to tell the user",
      body:
        "Once pay comes back from the function, a separate if/else looks at that result and picks which message fits — this decision has nothing to do with overtime, it's purely about how big the final number is.",
      code:
        'pay = calculate_pay(hours_worked, hourly_rate)\nif pay > 900:\n    print(name, "earned a big paycheck:", pay)\nelse:\n    print(name, "earned:", pay)',
    },
    {
      label: "4. All three pieces, working together",
      body:
        "hours_worked (46) and hourly_rate (22) flow into calculate_pay, which sees 46 > 40, calculates 6 hours of overtime, and returns 1078. The final if/else then sees 1078 > 900 is True and prints the \"big paycheck\" message.",
      code:
        'name = "Priya"\nhours_worked = 46\nhourly_rate = 22\n\ndef calculate_pay(hours, rate):\n    if hours > 40:\n        overtime = hours - 40\n        return 40 * rate + overtime * rate * 1.5\n    else:\n        return hours * rate\n\npay = calculate_pay(hours_worked, hourly_rate)\nif pay > 900:\n    print(name, "earned a big paycheck:", pay)\nelse:\n    print(name, "earned:", pay)\n\nPriya earned a big paycheck: 1078',
    },
  ],
  realWorldIntro:
    "This exact pattern — gather inputs into variables, run them through a function, then branch on the result — is basically how a payroll system, a shipping calculator, or a loan-approval check works under the hood.",
  realWorldCode:
    "def is_eligible(income, debt):\n    if income == 0:\n        return False\n    ratio = debt / income\n    return ratio < 0.4",
  sandbox: {
    kind: "code",
    challenge:
      'Add an if/else after the existing print that also prints "Discount applied" when items_bought * item_price is 100 or more, and "No discount" otherwise.',
    starterCode:
      'customer = "Jordan"\nitems_bought = 7\nitem_price = 15\n\ndef total_cost(items, price):\n    subtotal = items * price\n    if subtotal >= 100:\n        return subtotal - 10\n    else:\n        return subtotal\n\nfinal_price = total_cost(items_bought, item_price)\nprint(customer, "owes:", final_price)',
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    'def grade_label(score):\n    if score >= 60:\n        return "Pass"\n    else:\n        return "Fail"\n\nstudent = "Sam"\nresult = grade_label(55)\nprint(student, result)',
  quizOptions: [
    { key: "a", label: "Sam Fail", correct: true },
    { key: "b", label: "Sam Pass", correct: false },
    { key: "c", label: "Fail Sam", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — grade_label(55) hits the else branch since 55 >= 60 is False, returning \"Fail\", which gets stored in result and then printed after student's name, in the order they were passed to print().",
  quizFeedbackIncorrect:
    'Not quite — trace it in order: grade_label(55) checks 55 >= 60 (False), so it returns "Fail" from the else branch; that value lands in result, and print(student, result) prints student first, then result, in that order.',
  takeaway:
    "Real programs are built by composing pieces you already know: variables hold data, functions turn that data into a result, and if/else decides what happens next based on that result. Layer these three together and you can build almost anything.",
};

export default content;
