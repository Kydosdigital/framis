import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 3,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "Break: Stopping a Loop the Instant You're Done",
  minutes: 20,
  concept:
    "A for loop normally visits every item in a list — but often you already have your answer partway through and don't need to keep checking the rest. The break statement exits the loop immediately, right where it appears, skipping every remaining item entirely. The moment Python hits break, it jumps straight past the loop to whatever comes after it — no more iterations, no more condition checks. This matters for more than just tidiness: on a list of a few items it's invisible, but on a list of a million, stopping the instant you're done instead of grinding through the rest can be the difference between fast and slow code. break only exits the loop it's directly inside, and it's often paired with a flag variable — one that starts False and flips to True right before the break — so that after the loop ends you still have a clean yes/no record of whether you found anything at all.",
  conceptSimpler:
    "It's like searching every room in a house for your phone — the moment you spot it, you stop searching and walk away. You don't keep checking rooms you no longer have any reason to check.",
  vizStages: [
    {
      label: "1. The problem: the loop keeps going after you've already found it",
      body:
        "Without anything to stop it, this loop keeps overwriting first_negative every time it sees a negative number, so you end up with the last one instead of the first one — the exact opposite of what \"stop when you find it\" should do.",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfor n in numbers:\n    if n < 0:\n        first_negative = n\nprint(first_negative)\n\n-5",
    },
    {
      label: "2. break exits the loop immediately",
      body:
        "The moment n is -2 and the condition matches, break stops the loop right there — 9, -5, and 3 are never even looked at, so first_negative stays locked at the real first match.",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfor n in numbers:\n    if n < 0:\n        first_negative = n\n        break\nprint(first_negative)\n\n-2",
    },
    {
      label: "3. break happens exactly where it's written",
      body:
        "break isn't a flag you check later — it's an instruction that fires the instant Python reaches it. Anything after break inside that same loop iteration never runs either, since the loop has already exited.",
      code: "for n in numbers:\n    if n < 0:\n        first_negative = n\n        break\n        print(\"this line never runs\")",
    },
    {
      label: "4. Still want a yes/no answer afterward? Pair break with a flag",
      body:
        "break exits fast, but sometimes you need to remember afterward whether you found anything at all. Flipping a flag right before the break gives you both: instant exit during the loop, and a clean signal to check once it's over.",
      code: "found = False\nfor role in user_roles:\n    if role == \"admin\":\n        found = True\n        break\nprint(found)",
    },
  ],
  realWorldIntro:
    "This is how a login check works under the hood: a server loops through a user's roles looking for \"admin,\" and breaks the instant it finds one instead of wastefully checking every remaining role once the answer is already known.",
  realWorldCode:
    "is_admin = False\nfor role in user_roles:\n    if role == \"admin\":\n        is_admin = True\n        break",
  sandbox: {
    kind: "code",
    challenge:
      "Add a break right after the print so the loop stops the instant it finds the first temperature over 100, instead of printing an alert for every hot reading that follows.",
    starterCode:
      "temps = [88, 95, 104, 99, 110, 101]\nfor t in temps:\n    if t > 100:\n        print(f\"ALERT: temperature hit {t}\")",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "scores = [12, 45, 67, 91, 30, 88]\nfirst_over_60 = None\nfor s in scores:\n    if s > 60:\n        first_over_60 = s\n        break\nprint(first_over_60)",
  quizOptions: [
    { key: "a", label: "67", correct: true },
    { key: "b", label: "91", correct: false },
    { key: "c", label: "88", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the loop reaches 67 first among scores over 60, so first_over_60 is set to 67 and break exits the loop immediately; 91 and 88, which come later in the list, are never even looked at.",
  quizFeedbackIncorrect:
    "Not quite — walk the list in order: 12 and 45 don't beat 60, but 67 does. The instant that if fires, break exits the loop right there, so 91 and 88 (later in the list) are never reached at all.",
  takeaway:
    "break exits a loop immediately the moment you're done with it — there's no need to keep visiting items you no longer care about. Pair it with a flag variable when you need to remember afterward whether the loop found anything at all.",
};

export default content;
