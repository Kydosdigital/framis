import type { LessonData } from "../types";

const content: LessonData = {
  num: 20,
  orderIndex: 1,
  phaseLabel: "EVALS + SAFETY + GUARDRAILS",
  title: "37 out of 40: the eval loop that scores a prompt instead of guessing",
  minutes: 20,
  concept:
    "An eval is nothing more exotic than a for-loop with a scoreboard: you keep a list of test cases, where each one pairs an input with the expected correct answer, and you run every input through your model or prompt to get its actual output. For each test case you compare actual to expected, and every time they match exactly, you add one to a passed counter — no partial credit, no vibes, just equal or not equal. Once the loop finishes, you divide passed by the total number of test cases to get a single number, like 37 out of 40, that summarizes how the whole prompt performed across every example at once. That number is the entire point: instead of eyeballing five outputs and declaring a prompt change \"feels better,\" you get a repeatable score you can compare directly against the score from before the change. Run the exact same test cases through two different prompts and \"I think this is an improvement\" turns into \"this raised the pass rate from 34/40 to 37/40\" — a claim you can actually defend.",
  conceptSimpler:
    "It's grading a stack of quizzes against an answer key: you don't debate whether an answer feels close enough, you check it against the key and tally how many were exactly right.",
  vizStages: [
    {
      label: "1. Start with an answer key",
      body:
        "Each test case is just an input paired with the one correct expected answer — the ground truth you're grading against, decided before you ever run the model.",
      code:
        "test_cases = []\ntest_cases.append({\"input\": \"capital of France\", \"expected\": \"Paris\"})\ntest_cases.append({\"input\": \"2 + 2\", \"expected\": \"4\"})",
    },
    {
      label: "2. Run every case through the model",
      body:
        "The loop feeds each test case's input to the model (or your prompt) and captures whatever it comes back with as \"actual\" — no judgment yet, just collection.",
      code: "for case in test_cases:\n    actual = model_answer(case[\"input\"])",
    },
    {
      label: "3. Compare, don't judge",
      body:
        "actual gets checked against expected with a plain equality check. A match increments the passed counter; a mismatch just gets logged so you know which case broke.",
      code:
        "if actual == case[\"expected\"]:\n    passed = passed + 1\nelse:\n    print(f\"FAIL: {case['input']}\")",
    },
    {
      label: "4. Collapse it into one score",
      body:
        "After every test case has been checked, passed divided by the total test count becomes a single number — the pass rate — that you can track release over release.",
      code: "print(f\"{passed}/{len(test_cases)} passed\")",
    },
  ],
  realWorldIntro:
    "Before merging a change to a production system prompt, teams run it against a frozen regression suite of hundreds of labeled examples and block the merge if the pass rate drops, no matter how good the new prompt looked in a handful of manual tries.",
  realWorldCode:
    "score_before = run_eval(regression_suite)  # old prompt: 187/200\nscore_after = run_eval(regression_suite)   # new prompt: 179/200\nif score_after < score_before:\n    print(\"regression detected — do not ship\")",
  sandbox: {
    kind: "code",
    challenge:
      "Trace the eval loop below: it runs four test cases through a stub model, prints which one fails, and tallies a final passed/total score.",
    starterCode:
      "def model_answer(question):\n    if question == \"capital of France\":\n        return \"Paris\"\n    elif question == \"2 + 2\":\n        return \"4\"\n    elif question == \"largest planet\":\n        return \"Saturn\"\n    elif question == \"opposite of hot\":\n        return \"cold\"\n    else:\n        return \"unknown\"\n\ntest_cases = []\ntest_cases.append({\"input\": \"capital of France\", \"expected\": \"Paris\"})\ntest_cases.append({\"input\": \"2 + 2\", \"expected\": \"4\"})\ntest_cases.append({\"input\": \"largest planet\", \"expected\": \"Jupiter\"})\ntest_cases.append({\"input\": \"opposite of hot\", \"expected\": \"cold\"})\n\ndef run_eval(cases):\n    passed = 0\n    for case in cases:\n        actual = model_answer(case[\"input\"])\n        expected = case[\"expected\"]\n        if actual == expected:\n            passed = passed + 1\n        else:\n            print(f\"FAIL: {case['input']} -> got '{actual}', expected '{expected}'\")\n    return passed\n\npassed_count = run_eval(test_cases)\ntotal = len(test_cases)\nprint(f\"score: {passed_count}/{total} passed\")",
  },
  quizQuestion:
    "Team A scores their new prompt against 40 test cases and gets 37 passed. Team B scores their prompt against a completely different set of 20 test cases and gets 19 passed. Why can't you use these two scores to decide whose prompt is better?",
  quizCode:
    "team_a_score = 37\nteam_a_total = 40\nteam_b_score = 19\nteam_b_total = 20\nprint(f\"team A: {team_a_score}/{team_a_total}\")\nprint(f\"team B: {team_b_score}/{team_b_total}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "An eval score only means something relative to the specific test cases it was measured against, and two different test sets can have wildly different difficulty — so 37/40 and 19/20 aren't measuring the same thing",
      correct: true,
    },
    {
      key: "b",
      label: "Eval scores are only valid when the total number of test cases is exactly 40, so Team B's result doesn't count",
      correct: false,
    },
    {
      key: "c",
      label: "You can compare them fine — 37/40 is 92.5% and 19/20 is 95%, so Team B's prompt is simply better",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — an eval score is a percentage against one particular set of test cases, so comparing scores from two different test sets tells you nothing about which prompt actually performs better; you'd need to run both prompts against the identical test cases to make that call.",
  quizFeedbackIncorrect:
    "Not quite — the percentages look comparable, but Team B's 20 test cases could be far easier than Team A's 40, so a higher percentage there doesn't mean a better prompt; the fix is running both prompts against the exact same test cases.",
  takeaway:
    "An eval is just a loop that compares actual output to an expected answer for every test case and tallies a passed count — the resulting score is only meaningful when it's measured against the same fixed set of test cases every time you compare two prompts.",
  nextUpLabel: "Probability + Statistics",
};

export default content;
