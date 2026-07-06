import type { LessonData } from "../types";

const content: LessonData = {
  num: 24,
  orderIndex: 4,
  phaseLabel: "FINE-TUNING + DATASET QUALITY",
  title: "Held-out score decides if it ships — training score doesn't get a vote",
  minutes: 22,
  concept:
    "Evaluating a fine-tuned model works the same way evaluating a prompt does — a loop over test cases, comparing actual output to an expected answer, tallying a pass rate — but the test cases have to be a held-out set the model never saw during training, or the score is meaningless. A held-out set is built the same way a training set is: real examples with correct expected answers, sampled from the same distribution of inputs the model will face in production, but deliberately kept aside and never included in the fine-tuning data. Scoring the model against examples it trained on tells you what it memorized; scoring it against examples it has never seen tells you what it actually generalized, which is the number that predicts production behavior. Before shipping, that held-out score gets compared against two things, not judged in isolation: an absolute bar (is it good enough to be useful at all) and the baseline it's replacing, whether that's the un-tuned base model with a solid prompt or the previous fine-tuned version, because a fine-tune that scores lower than what you already have in production is a regression no matter how good the number looks on its own. Only when the held-out score clears both bars does the model get marked ready to ship.",
  conceptSimpler:
    "It's a driving test given on roads the student has never practiced on, not the exact route they rehearsed — and passing only counts if they also do at least as well as the instructor who was driving before them.",
  vizStages: [
    {
      label: "1. Held-out means genuinely unseen",
      body:
        "Before training starts, a slice of labeled examples is set aside and excluded from the training data entirely — not sampled from it, not overlapping with it. That slice is the only fair test of generalization once training finishes.",
      code: "all_examples = 500  # total labeled rows\ntraining_set = 430   # used to fine-tune\nheld_out_set = 70    # never shown to the model during training",
    },
    {
      label: "2. Run the fine-tuned model against it",
      body:
        "The eval loop is identical in shape to any other eval: feed each held-out input to the fine-tuned model, compare its actual output to the expected answer, and tally a passed count.",
      code: "for case in held_out_set:\n    actual = finetuned_model(case[\"ticket\"])\n    if actual == case[\"expected\"]:\n        passed = passed + 1",
    },
    {
      label: "3. A good-looking number can still be a regression",
      body:
        "The fine-tuned model scores 88% on the held-out set, which sounds strong — until it's compared against the baseline it's meant to replace, a well-prompted base model that was already scoring 91% on the exact same held-out set.",
      code: "finetuned_score = 0.88\nbaseline_score = 0.91\n# finetuned is worse than what's already in production",
    },
    {
      label: "4. Two gates, not one number",
      body:
        "Shipping requires clearing an absolute floor (the model has to be good enough to be useful at all) and beating the baseline it replaces — a fine-tune that only clears the floor but loses to the baseline doesn't ship, because it's a step backward dressed up as a training run.",
      code: "SHIP_FLOOR = 0.85\nif finetuned_score >= SHIP_FLOOR and finetuned_score > baseline_score:\n    print(\"ready to ship\")\nelse:\n    print(\"blocked — floor and/or baseline check failed\")",
    },
  ],
  realWorldIntro:
    "Teams running fine-tuning pipelines typically automate this as a gate in their deploy process: the held-out eval runs automatically after every training job, and the new checkpoint is blocked from deployment unless it beats both a minimum score and the currently deployed model's score on the same fixed set.",
  realWorldCode:
    "eval_result = run_held_out_eval(new_checkpoint, held_out_set)\ncurrent_result = run_held_out_eval(deployed_model, held_out_set)\nif eval_result.score < SHIP_FLOOR or eval_result.score <= current_result.score:\n    block_deploy(new_checkpoint)",
  sandbox: {
    kind: "code",
    challenge:
      "Trace the eval loop below: it scores a fine-tuned support-ticket classifier against a held-out test set it never trained on, then checks the result against a ship threshold before deciding whether the model is ready to deploy.",
    starterCode:
      "def finetuned_model(ticket):\n    if ticket == \"double charged for annual plan\":\n        return \"billing\"\n    elif ticket == \"app crashes after latest update\":\n        return \"bug\"\n    elif ticket == \"refund status for order 5521\":\n        return \"billing\"\n    elif ticket == \"how do I export my data\":\n        return \"question\"\n    elif ticket == \"charged again after canceling subscription\":\n        return \"bug\"\n    else:\n        return \"unknown\"\n\nheld_out_set = []\nheld_out_set.append({\"ticket\": \"double charged for annual plan\", \"expected\": \"billing\"})\nheld_out_set.append({\"ticket\": \"app crashes after latest update\", \"expected\": \"bug\"})\nheld_out_set.append({\"ticket\": \"refund status for order 5521\", \"expected\": \"billing\"})\nheld_out_set.append({\"ticket\": \"how do I export my data\", \"expected\": \"question\"})\nheld_out_set.append({\"ticket\": \"charged again after canceling subscription\", \"expected\": \"billing\"})\n\ndef score_model(model_fn, test_set):\n    passed = 0\n    for case in test_set:\n        actual = model_fn(case[\"ticket\"])\n        expected = case[\"expected\"]\n        if actual == expected:\n            passed = passed + 1\n        else:\n            print(f\"MISS: '{case['ticket']}' -> got '{actual}', expected '{expected}'\")\n    return passed\n\npassed_count = score_model(finetuned_model, held_out_set)\ntotal = len(held_out_set)\npass_rate = passed_count / total\nprint(f\"held-out score: {passed_count}/{total}\")\n\nSHIP_FLOOR = 0.9\nbaseline_score = 0.8\nif pass_rate >= SHIP_FLOOR and pass_rate > baseline_score:\n    print(\"ready to ship\")\nelse:\n    print(\"blocked — does not clear ship floor and baseline together\")",
  },
  quizQuestion:
    "A fine-tuned model scores 97% on the exact rows it was trained on, and 79% on a held-out set of similar tickets it never saw during training. Which score should determine whether it ships?",
  quizCode:
    "training_score = 0.97\nheld_out_score = 0.79\nprint(f\"training: {training_score}\")\nprint(f\"held-out: {held_out_score}\")",
  quizOptions: [
    {
      key: "a",
      label: "The 97% training score, since it reflects the best the model has proven it can do",
      correct: false,
    },
    {
      key: "b",
      label: "The 79% held-out score, since it's the only one measured on data the model didn't memorize",
      correct: true,
    },
    {
      key: "c",
      label: "The average of the two, 88%, since that balances both results fairly",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the training score only shows what the model has memorized, and a wide gap between 97% training and 79% held-out is a classic overfitting signature, so the held-out number is the only one that reflects how the model will actually perform on new tickets in production.",
  quizFeedbackIncorrect:
    "Not quite — the training score is measured on rows the model already saw and can simply recall, so a large gap like 97% vs. 79% signals overfitting rather than genuine skill; the held-out score is the one that predicts production behavior.",
  takeaway:
    "A fine-tuned model gets shipped or blocked based on its score against a held-out set it never trained on, checked against both an absolute floor and the baseline it's replacing — the training score it kept improving during the run doesn't get a say.",
};

export default content;
