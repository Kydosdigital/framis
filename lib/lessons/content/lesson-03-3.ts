import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 3,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "The Flag Trick: Faking 'Stop the Loop' Without a Break",
  minutes: 20,
  concept:
    "A for loop always visits every item in a list — there's no built-in \"stop early\" move in this mini-language, so once you're a few items past the one you cared about, the loop is still grinding through the rest for no reason. The fix is a flag: a variable that starts as False and only flips to True the moment you find what you were looking for. Every loop iteration checks that flag with an if before doing its real work, so once the flag becomes True, the if condition is False for every remaining item and the body quietly does nothing. The loop technically still runs to the end of the list, but the work inside it effectively stops the instant the flag flips — which is exactly what a real break statement would do in a language that has one. This pattern shows up constantly: \"have we found the user yet,\" \"has an error already happened,\" \"did we already send the alert\" are all flag variables in disguise.",
  conceptSimpler:
    "It's like searching every room in a house for your phone but leaving a sticky note on the front door the moment you find it — you don't have to re-check rooms you've already searched, because the note (the flag) tells future-you the search is already done.",
  vizStages: [
    {
      label: "1. The problem: no break, so the loop can't stop itself",
      body:
        "Without a flag, this loop keeps overwriting first_negative every time it sees a negative number, so you end up with the last one instead of the first one — the exact opposite of what \"stop when you find it\" should do.",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfor n in numbers:\n    if n < 0:\n        first_negative = n\nprint(first_negative)\n\n-5",
    },
    {
      label: "2. Add a flag that starts False",
      body:
        "found is the flag. It starts at False, meaning \"we haven't found one yet.\" The real work only happens while found is still False.",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfound = False",
    },
    {
      label: "3. Guard the work with 'if not found'",
      body:
        "Every iteration checks not found first. While found is False, not found is True, so the inner if still runs normally. The moment n is -2, first_negative gets set AND found flips to True.",
      code: "for n in numbers:\n    if not found:\n        if n < 0:\n            first_negative = n\n            found = True",
    },
    {
      label: "4. After the flag flips, the rest of the loop is a no-op",
      body:
        "Once found is True, not found is False for every remaining item — 9, -5, 3 — so the inner block never runs again even though the loop keeps technically iterating over them. first_negative stays locked at the first match, -2.",
      code: "print(first_negative)\nprint(found)\n\n-2\nTrue",
    },
  ],
  realWorldIntro:
    "This is how a login check works under the hood in languages without an early-exit keyword: a server loops through a user's roles looking for \"admin,\" and a found flag makes sure that once it's confirmed, it doesn't waste time (or accidentally overwrite the result) checking the rest of the roles.",
  realWorldCode:
    "is_admin = False\nfor role in user_roles:\n    if not is_admin:\n        if role == \"admin\":\n            is_admin = True",
  sandbox: {
    kind: "code",
    challenge:
      "Add a flag called sent so the loop stops actually sending alerts after the first temperature over 100 — it should print the alert only once, even though hotter readings come later in the list.",
    starterCode:
      "temps = [88, 95, 104, 99, 110, 101]\nfor t in temps:\n    if t > 100:\n        print(f\"ALERT: temperature hit {t}\")",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "scores = [12, 45, 67, 91, 30, 88]\nfound = False\nfirst_over_60 = None\nfor s in scores:\n    if not found:\n        if s > 60:\n            first_over_60 = s\n            found = True\nprint(first_over_60)",
  quizOptions: [
    { key: "a", label: "67", correct: true },
    { key: "b", label: "91", correct: false },
    { key: "c", label: "88", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the loop reaches 67 first among scores over 60, so first_over_60 is set to 67 and found flips to True; by the time it reaches 91, not found is already False, so the check never fires again.",
  quizFeedbackIncorrect:
    "Not quite — walk the list in order: 12 and 45 don't beat 60, but 67 does, so found flips to True right there. 91 comes later in the list, and by then not found is already False, so it's never even considered.",
  takeaway:
    "A flag variable that starts False and flips to True lets a for loop simulate stopping early, even without a break statement — guard the real work with an if not flag check so it silently does nothing once the flag flips. Look for this pattern anywhere code needs to react to the first match and ignore everything after it.",
};

export default content;
