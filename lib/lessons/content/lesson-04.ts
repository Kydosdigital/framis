import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 1,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "Catch Me If You Crash: Handling Missing Data with Try/Except",
  minutes: 20,
  concept:
    "Sometimes your code asks for something that isn't there — a dictionary key that was never added, or a list index past the last item — and Python's normal response is to crash immediately with an error like KeyError or IndexError. A try/except block lets you say \"attempt this risky operation, and if a specific kind of error happens, run this other code instead of stopping the whole program.\" You put the line that might fail inside the try block, and you name the exact error type you're expecting after except. If that error occurs, control jumps straight into the except block and the rest of the try block is skipped; if no error occurs at all, the except block never runs. This turns a program-ending crash into an expected, handled case your code can recover from and keep going.",
  conceptSimpler:
    "It's like reaching into a drawer for your keys — if they're not there, you don't burn the house down, you just say \"not here, I'll check the coat pocket instead\" and move on.",
  vizStages: [
    {
      label: "1. The unguarded lookup",
      body:
        "inventory[\"cherries\"] asks the dictionary for a key that was never added. With no protection around it, Python stops the entire program right there — nothing after this line ever runs.",
      code:
        "inventory = {\"apples\": 12, \"bananas\": 5}\nprint(inventory[\"cherries\"])\n\nKeyError: cherries",
    },
    {
      label: "2. Wrap the risky line in try",
      body:
        "Putting the lookup inside a try block tells Python \"attempt this, but be ready to catch it if it fails.\" The except KeyError line names exactly which kind of failure this handler is prepared for.",
      code:
        "try:\n    print(inventory[\"cherries\"])\nexcept KeyError:\n    print(\"cherries not in stock\")\n\ncherries not in stock",
    },
    {
      label: "3. The except block only fires on error",
      body:
        "When the lookup succeeds, the except block is skipped entirely — it only exists as a backup plan. Here \"apples\" is in the dictionary, so the try block finishes normally and the program never touches the except code.",
      code:
        "try:\n    print(inventory[\"apples\"])\nexcept KeyError:\n    print(\"apples not in stock\")\n\n12",
    },
    {
      label: "4. The loop keeps going",
      body:
        "Inside a loop, this is what makes try/except so powerful: one missing item no longer kills the whole run. Each item gets its own chance to succeed or fail, and the loop keeps marching forward either way.",
      code:
        "for item in [\"apples\", \"cherries\", \"bananas\"]:\n    try:\n        print(item, inventory[item])\n    except KeyError:\n        print(item, \"missing\")\n\napples 12\ncherries missing\nbananas 5",
    },
  ],
  realWorldIntro:
    "This is exactly how a web server survives bad requests: when someone asks for a user profile by an ID that isn't in the database, the raw lookup would normally crash the whole request handler, but a try/except around it lets the server catch the KeyError and send back a clean \"user not found\" response instead of taking down the app for every other user.",
  realWorldCode:
    "try:\n    profile = users[user_id]\nexcept KeyError:\n    profile = {\"error\": \"user not found\"}",
  sandbox: {
    kind: "code",
    challenge:
      "Run the code and watch the except block catch the typo \"expres\" without crashing, then fix the typo in the orders list so that order gets the real $12 express rate instead of the $8 fallback.",
    starterCode:
      "shipping_costs = {\"standard\": 5, \"express\": 12, \"overnight\": 25}\norders = [\"standard\", \"overnight\", \"expres\", \"standard\"]\n\nfor order in orders:\n    try:\n        cost = shipping_costs[order]\n        print(f\"{order}: ${cost} shipping\")\n    except KeyError:\n        print(f\"{order}: unknown shipping type, charging default $8\")",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    "prices = {\"widget\": 10, \"gadget\": 25}\n\ntry:\n    print(prices[\"gizmo\"])\nexcept KeyError as e:\n    print(f\"missing key: {e}\")",
  quizOptions: [
    { key: "a", label: "missing key: gizmo", correct: true },
    { key: "b", label: "KeyError: gizmo", correct: false },
    { key: "c", label: "The program crashes because \"gizmo\" isn't in prices", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — prices[\"gizmo\"] raises a KeyError, but except KeyError as e catches it and stores its message (\"gizmo\") in e, so the f-string prints \"missing key: gizmo\" instead of crashing.",
  quizFeedbackIncorrect:
    "Not quite — the lookup does raise a KeyError, but except KeyError as e catches it before it can crash anything and binds just the message (\"gizmo\") to e, so the output is \"missing key: gizmo\".",
  takeaway:
    "try/except lets your program attempt something risky and recover gracefully when a specific, expected error occurs, instead of crashing the moment a key or index goes missing. Naming the error type after except and optionally capturing it with \"as e\" turns a fatal crash into a handled case your code can respond to.",
  nextUpLabel: "HTML, CSS, JavaScript",
};

export default content;
