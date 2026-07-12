import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 3,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "break: stopping a loop the instant you're done",
  minutes: 20,
  concept:
    "A for loop normally visits every item in a list, start to finish. But often you get your answer partway through and there's no reason to keep looking. break is the word that stops a loop early — the instant Python reaches it, the loop ends and the program carries on with whatever comes next.\n\n" +
    "Think of searching a house for your phone. You check rooms one by one, but the moment you spot it, you stop — you don't keep opening doors you no longer have any reason to open. break is that \"found it, stop looking\".\n\n" +
    "This is more than tidiness. On a list of five items you'd never notice the difference, but on a list of a million, stopping the instant you're done instead of grinding through the rest can be the gap between fast and slow.\n\n" +
    "break only stops the loop it's directly inside. And it's often paired with a flag — a True/False variable that starts False and flips to True right before the break. That way, after the loop is over, you still have a clean yes/no record of whether you found what you were looking for.",
  conceptSimpler:
    "It's like searching a house for your phone.\n\n" +
    "You check rooms one at a time, but the moment you spot it, you stop and walk away — you don't keep checking rooms for no reason. break is that \"found it, stop looking\" for a loop.\n\n" +
    "If you need to remember afterwards whether you found it, flip a True/False flag right before you stop.",
  vizStages: [
    {
      label: "1. The problem: the loop keeps going after you've found it",
      body:
        "With nothing to stop it, this loop overwrites first_negative every time it sees a negative number, so it ends up holding the last one (-5) instead of the first — the opposite of \"stop when you find it\".",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfor n in numbers:\n    if n < 0:\n        first_negative = n\nprint(first_negative)",
    },
    {
      label: "2. break stops the loop immediately",
      body:
        "The instant n is -2 and the condition matches, break ends the loop right there — 9, -5, and 3 are never even looked at. So first_negative stays locked on the real first match, and this prints -2.",
      code: "numbers = [4, 7, -2, 9, -5, 3]\nfirst_negative = None\nfor n in numbers:\n    if n < 0:\n        first_negative = n\n        break\nprint(first_negative)",
    },
    {
      label: "3. break fires exactly where it's written",
      body:
        "break isn't a flag you check later — it fires the moment Python reaches it. Any line after break in that same step never runs, because the loop has already ended.",
      code: 'for n in numbers:\n    if n < 0:\n        first_negative = n\n        break\n        print("this line never runs")',
    },
    {
      label: "4. Want a yes/no answer afterwards? Pair break with a flag",
      body:
        "break exits fast, but sometimes you need to remember whether you found anything. Flipping found to True right before the break gives you both: an instant stop during the loop, and a clean True/False to check once it's over.",
      code: 'found = False\nfor name in names:\n    if name == "Ben":\n        found = True\n        break\nprint(found)',
    },
  ],
  realWorldIntro:
    "It's how an \"is this name on the list?\" check works — a program looks down a list for the name it wants and stops the moment it finds it, instead of pointlessly reading every remaining name once the answer is already yes.",
  realWorldCode:
    'names = ["Ava", "Ben", "Sam"]\nfound = False\nfor name in names:\n    if name == "Ben":\n        found = True\n        break\nprint(found)',
  sandbox: {
    kind: "code",
    challenge:
      "This code prints an alert for every temperature over 100. Add a break right after the print so the loop stops the instant it finds the first one over 100, instead of alerting for every hot reading after it.",
    starterCode:
      'temps = [88, 95, 104, 99, 110, 101]\nfor t in temps:\n    if t > 100:\n        print("ALERT: temperature hit", t)',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    "scores = [12, 45, 67, 91, 30, 88]\nfirst_over_60 = None\nfor s in scores:\n    if s > 60:\n        first_over_60 = s\n        break\nprint(first_over_60)",
  quizOptions: [
    { key: "a", label: "67", correct: true },
    { key: "b", label: "91", correct: false },
    { key: "c", label: "88", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the loop reaches 67 first among the scores over 60, so first_over_60 is set to 67 and break ends the loop immediately; 91 and 88, later in the list, are never even looked at.",
  quizFeedbackIncorrect:
    "Not quite — walk the list in order: 12 and 45 don't beat 60, but 67 does. The instant that if fires, break ends the loop right there, so 91 and 88 (later in the list) are never reached.",
  takeaway:
    "break stops a loop the instant you're done — like stopping your search the moment you spot your phone, instead of checking every remaining room. Pair it with a True/False flag when you need to remember afterwards whether the loop found anything.",
  explainers: [
    {
      id: "what-is-break",
      term: "What Does break Do?",
      emoji: "🛑",
      shortDef: "break stops the loop it's inside immediately, skipping every remaining item.",
      longDef:
        "When Python reaches break, the loop ends on the spot — no more items are visited, and the program continues with whatever comes after the loop. It only affects the loop it's directly inside. You use it the moment more looping would be pointless, usually right after you've found what you were searching for.",
      whyMatters:
        "Beyond being tidy, break saves real time on big lists: there's no reason to check a million items once item three already answered your question. It's the difference between a fast search and a slow one.",
      realWorldExample:
        "Searching your house for your phone: the instant you spot it in the kitchen, you stop. You don't keep checking the bedroom, the car, the garden. break is that stop.",
      relatedTerms: ["flag-variable"],
      expandedByDefault: true,
    },
    {
      id: "flag-variable",
      term: "What's a Flag Variable?",
      emoji: "🚩",
      shortDef: "A flag is a True/False variable that remembers whether something happened during a loop.",
      longDef:
        "You start a flag at False before the loop, then flip it to True at the moment the thing you care about happens — usually right before a break. After the loop ends, you check the flag to know the answer: True means \"yes, it happened\", False means \"never did\". The flag survives the loop; the loop variable doesn't.",
      whyMatters:
        "break stops the loop but doesn't, by itself, leave you a record of why. A flag is how you carry a clean yes/no out of the loop so the rest of your program can act on it.",
      realWorldExample:
        "As you search the house, the fact \"I found my phone\" is a yes/no you carry with you once you stop. The flag is that remembered yes/no.",
      relatedTerms: ["what-is-break"],
    },
  ],
};

export default content;
