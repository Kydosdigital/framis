import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 1,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "Catch me if you crash: handling errors with try / except",
  minutes: 20,
  concept:
    "Sometimes your code asks for something that isn't there — a dictionary key that was never added, or a list position past the last item — and Python's normal response is to stop the whole program with an error. You've met one already: a KeyError when you ask a dictionary for a missing key. Reaching past the end of a list does the same thing, with an error called an IndexError.\n\n" +
    "Crashing is fine while you're learning, but a real program can't fall over every time one piece of data is missing. A try / except block is how you say: \"try this risky thing, and if it fails in a particular way, do this instead of stopping.\"\n\n" +
    "Think of reaching into a drawer for your keys. If they're not there, you don't give up your whole morning — you calmly say \"not here, I'll check my coat pocket instead\" and carry on. try is reaching into the drawer; except is your backup plan.\n\n" +
    "In code, you put the line that might fail inside the try block, and after except you name the exact kind of error you're expecting — except KeyError. If that error happens, Python jumps straight into the except block and skips the rest of the try. If nothing goes wrong, the except block never runs at all.\n\n" +
    "The real power shows up inside a loop: one missing item no longer kills the whole run. Each item gets its own try, so a single bad one is handled and the loop keeps going.",
  conceptSimpler:
    "It's like reaching into a drawer for your keys.\n\n" +
    "If they're there, great. If they're not, you don't fall apart — you say \"not here, I'll check my coat pocket\" and move on. try is the reach; except is the backup plan.\n\n" +
    "In code: put the risky line in try, and name the error you expect after except. If it happens, the backup plan runs instead of the program crashing.",
  vizStages: [
    {
      label: "1. An unguarded lookup crashes the whole program",
      body:
        "inventory[\"cherries\"] asks for a key that was never added. With nothing around it, Python stops the whole program right there with a KeyError — nothing after this line runs.",
      code: 'inventory = {"apples": 12, "bananas": 5}\nprint(inventory["cherries"])',
    },
    {
      label: "2. Wrap the risky line in try / except",
      body:
        "Putting the lookup inside try tells Python \"attempt this, but be ready if it fails.\" except KeyError names exactly the failure this backup plan is for — so instead of crashing, it prints \"cherries not in stock\".",
      code: 'try:\n    print(inventory["cherries"])\nexcept KeyError:\n    print("cherries not in stock")',
    },
    {
      label: "3. No error? The except is skipped",
      body:
        "The except block is only a backup — it runs only when the try fails. Here \"apples\" is in the dictionary, so the try finishes normally (printing 12) and the except code is never touched.",
      code: 'try:\n    print(inventory["apples"])\nexcept KeyError:\n    print("apples not in stock")',
    },
    {
      label: "4. In a loop, one missing item doesn't stop the rest",
      body:
        "This is where try / except earns its keep. Each item gets its own try, so the missing \"cherries\" is handled (printing \"cherries missing\") and the loop keeps marching — apples and bananas still print their counts.",
      code: 'for item in ["apples", "cherries", "bananas"]:\n    try:\n        print(item, inventory[item])\n    except KeyError:\n        print(item, "missing")',
    },
  ],
  realWorldIntro:
    "It's how an app keeps working when data is missing. Tap a friend's profile who's deleted their account, and instead of the whole app crashing, it catches the \"not found\" error and shows a tidy \"this user isn't available\" message — everyone else's app keeps running just fine.",
  realWorldCode:
    'try:\n    profile = users[user_id]\nexcept KeyError:\n    profile = {"error": "user not found"}',
  sandbox: {
    kind: "code",
    challenge:
      "Run the code and watch the except block catch the typo \"expres\" without crashing the loop. Then fix the typo in the orders list to \"express\" so that order gets its real cost of 12 instead of the default.",
    starterCode:
      'shipping_costs = {"standard": 5, "express": 12, "overnight": 25}\norders = ["standard", "overnight", "expres", "standard"]\n\nfor order in orders:\n    try:\n        cost = shipping_costs[order]\n        print(order, "costs", cost)\n    except KeyError:\n        print(order, "unknown type, charging default 8")',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'fruit = {"apple": 3}\ntry:\n    print(fruit["banana"])\nexcept KeyError:\n    print("no bananas")\nprint("done")',
  quizOptions: [
    { key: "a", label: "no bananas, then done", correct: true },
    { key: "b", label: "The program crashes on fruit[\"banana\"] and never prints done", correct: false },
    { key: "c", label: "3, then done", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — fruit[\"banana\"] raises a KeyError, so Python jumps into the except and prints \"no bananas\" instead of crashing. Because the error was handled, the program carries on and prints \"done\" too.",
  quizFeedbackIncorrect:
    "Not quite — \"banana\" isn't a key, so the lookup raises a KeyError, but the except catches it and prints \"no bananas\" instead of crashing. Since nothing crashed, the last line still runs, so \"done\" prints as well.",
  takeaway:
    "try / except lets your program attempt something risky and fall back gracefully when the exact error you named happens — like checking your coat pocket when the keys aren't in the drawer — instead of crashing the moment a key or index is missing. Name the error type after except, and the loop (or the whole program) keeps going.",
  explainers: [
    {
      id: "what-is-try-except",
      term: "What's a try / except Block?",
      emoji: "🧯",
      shortDef: "try holds a line that might fail; except holds the backup plan that runs only if it does.",
      longDef:
        "You put the risky line inside try, and after except you name the kind of error you're ready for, like except KeyError. If that error happens while the try runs, Python immediately jumps to the except block and skips the rest of the try. If no error happens, the except block is ignored entirely. It turns a program-ending crash into a case your code chose to handle.",
      whyMatters:
        "Real data is messy — a field is blank, a record is missing. Without try / except, one bad value stops everything. With it, your program expects the occasional failure and keeps running.",
      realWorldExample:
        "Reaching into the drawer for your keys (the try). If they're not there, you don't stop your day — you check your coat pocket (the except). One planned backup, only used when needed.",
      relatedTerms: ["key-index-error", "except-only-on-error"],
      expandedByDefault: true,
    },
    {
      id: "key-index-error",
      term: "KeyError and IndexError",
      emoji: "❓",
      shortDef: "A KeyError means a dictionary key isn't there; an IndexError means a list position doesn't exist.",
      longDef:
        "You met KeyError with dictionaries — asking for a key that was never set. IndexError is its list cousin: asking for a position that doesn't exist. Remember lists count from 0, so a list of three items has positions 0, 1, and 2 — asking for position 3 (or higher) reaches past the end and raises an IndexError. Both errors are Python's way of saying \"you asked for something that isn't there.\"",
      whyMatters:
        "These two are among the most common crashes you'll cause, and they're the exact ones try / except is built to catch. Recognising them by name tells you instantly what went wrong and which except to reach for.",
      realWorldExample:
        "Opening a drawer that was never installed (KeyError), or reaching for the fourth locker in a row of three (IndexError). Either way, there's nothing there to find.",
      relatedTerms: ["what-is-try-except"],
    },
    {
      id: "except-only-on-error",
      term: "The except Only Runs on an Error",
      emoji: "🔀",
      shortDef: "If the try succeeds, the except block is skipped completely — it's a backup, not a second step.",
      longDef:
        "A common early mix-up is thinking the except always runs. It doesn't. When the try finishes without an error, Python jumps clean over the except. The except is a plan B that only activates when plan A actually fails — which is why the same code behaves differently depending on whether the data was there.",
      whyMatters:
        "Knowing the except is conditional keeps you from putting normal, everyday work inside it. Only recovery code — the \"what to do when it went wrong\" — belongs there.",
      realWorldExample:
        "If your keys are in the drawer, you never check your coat pocket. The backup plan only happens when the first attempt comes up empty.",
      relatedTerms: ["what-is-try-except"],
    },
  ],
};

export default content;
