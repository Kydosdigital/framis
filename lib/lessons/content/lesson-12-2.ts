import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 2,
  phaseLabel: "MODEL EVALUATION + CROSS-VALIDATION",
  title: "Metrics That Actually Matter: Precision, Recall, F1",
  minutes: 22,
  concept:
    "Accuracy — the percent of predictions a model got right — feels like the obvious way to grade a classifier, but it can be dangerously misleading whenever one outcome is much rarer than the other. To see why, you need to break predictions into four buckets by comparing what the model predicted against what actually happened: a true positive (predicted yes, actually yes), a false positive (predicted yes, actually no), a true negative (predicted no, actually no), and a false negative (predicted no, actually yes). Arrange those four counts in a grid and you get a confusion matrix — the raw material every other metric is built from. Accuracy is (TP + TN) divided by everything. Precision asks \"of the times the model said yes, how often was it actually right?\" — TP over (TP + FP) — and matters when false alarms are expensive. Recall asks \"of all the actual yeses, how many did the model catch?\" — TP over (TP + FN) — and matters when a missed case is expensive, like a disease that goes undetected. F1 is the harmonic mean of precision and recall, a single number that stays low if either one is bad, so a model can't hide a terrible recall behind a great precision. This whole lesson is fully real arithmetic — just division on counts you tally by looping — no shortcuts or simplifications needed here.",
  conceptSimpler:
    "Accuracy is like grading a fire alarm only on how often it's silent when there's no fire — it'll look great even if it never once rings during an actual fire. Precision and recall grade the two ways it can fail separately: false alarms, and fires it missed.",
  vizStages: [
    {
      label: "1. Predicted vs. actual, side by side",
      body:
        "A spam filter checked 12 emails. predicted[i] is what the filter said; actual[i] is the truth. Line them up by index to compare, one email at a time.",
      code:
        "predicted = [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]\nactual =    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]\nprint(f\"checked {len(actual)} emails\")",
    },
    {
      label: "2. Loop once, count all four buckets",
      body:
        "One pass through the list sorts every prediction into exactly one of four buckets: true positive, false positive, true negative, or false negative.",
      code:
        "tp = 0\nfp = 0\ntn = 0\nfn = 0\nfor i in range(len(actual)):\n    p = predicted[i]\n    a = actual[i]\n    if p == 1 and a == 1:\n        tp = tp + 1\n    elif p == 1 and a == 0:\n        fp = fp + 1\n    elif p == 0 and a == 0:\n        tn = tn + 1\n    elif p == 0 and a == 1:\n        fn = fn + 1\n\nprint(f\"TP={tp} FP={fp} TN={tn} FN={fn}\")",
    },
    {
      label: "3. Accuracy, precision, recall, F1 — all just division",
      body:
        "Every one of these comes straight out of the four counts above. Precision only looks at what happens when the model said yes; recall only looks at what happens to the actual yeses.",
      code:
        "total = len(actual)\ncorrect = tp + tn\naccuracy = correct / total\n\nprecision_denom = tp + fp\nprecision = tp / precision_denom\n\nrecall_denom = tp + fn\nrecall = tp / recall_denom\n\nf1_denom = precision + recall\nf1 = 2 * precision * recall / f1_denom\n\nprint(f\"accuracy: {accuracy}\")\nprint(f\"precision: {precision}\")\nprint(f\"recall: {recall}\")\nprint(f\"f1: {f1}\")",
    },
    {
      label: "4. The trap: 95% accuracy, 0% recall",
      body:
        "A rare-disease screening set: 95 healthy patients, 5 sick ones. A lazy \"model\" that always predicts \"healthy\" never has to be right about a sick patient to rack up a great-looking accuracy score.",
      code:
        "actual = []\nfor i in range(95):\n    actual.append(0)\nfor i in range(5):\n    actual.append(1)\n\npredicted = []\nfor i in range(100):\n    predicted.append(0)\n\n# same counting loop as before, then accuracy vs. recall\n# accuracy: 0.95   recall: 0.0",
    },
  ],
  realWorldIntro:
    "Every ML framework computes these same four counts under the hood — scikit-learn's confusion_matrix and classification_report just do the looping and division for you at a scale that would be painful by hand.",
  realWorldCode:
    "from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score\n\ntn, fp, fn, tp = confusion_matrix(y_actual, y_predicted).ravel()\nprecision = precision_score(y_actual, y_predicted)\nrecall = recall_score(y_actual, y_predicted)\nf1 = f1_score(y_actual, y_predicted)\n# scikit-learn also warns and defaults to 0 when a denominator is 0,\n# exactly like the guard clauses below",
  sandbox: {
    kind: "code",
    challenge:
      "A disease-screening model always predicts \"healthy\" (0) on 100 patients, 5 of whom are actually sick. Compute TP/FP/TN/FN by looping, then compute accuracy, precision, recall, and F1 — using a guard clause so dividing by zero doesn't crash the program.",
    starterCode:
      "actual = []\nfor i in range(95):\n    actual.append(0)\nfor i in range(5):\n    actual.append(1)\n\npredicted = []\nfor i in range(100):\n    predicted.append(0)\n\ntp = 0\nfp = 0\ntn = 0\nfn = 0\nfor i in range(len(actual)):\n    p = predicted[i]\n    a = actual[i]\n    if p == 1 and a == 1:\n        tp = tp + 1\n    elif p == 1 and a == 0:\n        fp = fp + 1\n    elif p == 0 and a == 0:\n        tn = tn + 1\n    elif p == 0 and a == 1:\n        fn = fn + 1\n\nprint(f\"TP={tp} FP={fp} TN={tn} FN={fn}\")\n\ntotal = len(actual)\ncorrect = tp + tn\naccuracy = correct / total\n\nprecision_denom = tp + fp\nif precision_denom == 0:\n    precision = 0\nelse:\n    precision = tp / precision_denom\n\nrecall_denom = tp + fn\nif recall_denom == 0:\n    recall = 0\nelse:\n    recall = tp / recall_denom\n\nf1_denom = precision + recall\nif f1_denom == 0:\n    f1 = 0\nelse:\n    f1 = 2 * precision * recall / f1_denom\n\nprint(f\"accuracy: {accuracy}\")\nprint(f\"precision: {precision}\")\nprint(f\"recall: {recall}\")\nprint(f\"f1: {f1}\")",
  },
  quizQuestion:
    "A cancer-screening model is evaluated on 200 patients: TP=8, FP=30, FN=2, TN=160. Missing an actual cancer case is far more costly than a false alarm that just leads to a follow-up test. Which metric best captures how good this model is at not missing real cases, and what does it score here?",
  quizCode:
    "tp = 8\nfp = 30\nfn = 2\ntn = 160\n\nrecall_denom = tp + fn\nrecall = tp / recall_denom\n\nprecision_denom = tp + fp\nprecision = tp / precision_denom\n\nprint(f\"recall: {recall}\")\nprint(f\"precision: {precision}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "Recall = TP / (TP + FN) = 8 / 10 = 0.8 — it catches 80% of actual cancer cases, which is what matters when a miss is costly",
      correct: true,
    },
    {
      key: "b",
      label:
        "Precision = TP / (TP + FP) ≈ 0.21 — that's the number to focus on, since it's lower and lower always means worse",
      correct: false,
    },
    {
      key: "c",
      label: "Accuracy = (TP + TN) / 200 = 0.84 — it's the single number that captures overall correctness best",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — recall = TP / (TP + FN) only looks at the actual positive cases and asks how many the model caught, which is exactly \"how many real cancers did we miss?\" With 8 caught out of 10 actual cases, recall is 0.8. This model does trigger a lot of false alarms (precision is low, about 0.21), but that's a separate, less costly problem in this scenario.",
  quizFeedbackIncorrect:
    "Not quite — precision (about 0.21) measures how often a positive prediction was correct, which describes the false-alarm rate, not missed cases. And accuracy blends everything together, so it can't tell you specifically how many real cancer cases slipped through. Recall = TP / (TP + FN) = 8 / 10 = 0.8 is the metric that isolates \"how many actual positives did we catch.\"",
  takeaway:
    "Accuracy alone can hide a model that's completely useless at the one thing you actually need it to do. Break predictions into TP/FP/TN/FN, then reach for precision when false alarms are the expensive mistake and recall when missed cases are — a model can look great on accuracy and still score 0% on the metric that actually matters for your problem.",
  explainers: [
    {
      id: "what-is-confusion-matrix",
      term: "What's a Confusion Matrix?",
      emoji: "🔲",
      shortDef:
        "A grid that sorts every prediction into one of four buckets: true positive, false positive, true negative, false negative.",
      longDef:
        "A confusion matrix is the raw count data behind every classification metric. Instead of collapsing performance into a single accuracy number, it keeps the four outcomes separate — correct yeses, incorrect yeses, correct nos, and incorrect nos — so you can see exactly which kind of mistake a model is making, not just how often it's wrong overall.",
      whyMatters:
        "Two models can have the identical accuracy while making completely different kinds of mistakes — one all false alarms, one all missed cases. The confusion matrix is what reveals that difference; accuracy alone hides it.",
      realWorldExample:
        "It's like a scoreboard for a spam filter that separately tracks \"real emails wrongly flagged as spam\" versus \"actual spam that got through\" — two very different problems that a single \"percent correct\" number would blur together.",
      relatedTerms: ["what-is-precision", "what-is-recall"],
      expandedByDefault: true,
    },
    {
      id: "what-is-precision",
      term: "What's Precision?",
      emoji: "🎯",
      shortDef:
        "Of everything the model flagged as positive, what fraction was actually positive? TP / (TP + FP).",
      longDef:
        "Precision only looks at the times the model said \"yes.\" It answers: when this model raises its hand, how often is it actually right? A model with low precision cries wolf a lot — it makes plenty of positive predictions, but many of them are false alarms.",
      whyMatters:
        "Precision matters most when a false positive is costly or annoying — flagging a legitimate transaction as fraud, or a healthy patient as sick, both waste time and erode trust even though nothing was technically missed.",
      realWorldExample:
        "A metal detector that beeps at every belt buckle and coin in someone's pocket has low precision — most of its \"alerts\" aren't actually threats, even if it never misses a real one.",
      relatedTerms: ["what-is-recall", "what-is-confusion-matrix"],
    },
    {
      id: "what-is-recall",
      term: "What's Recall?",
      emoji: "🕸️",
      shortDef:
        "Of everything that was actually positive, what fraction did the model catch? TP / (TP + FN).",
      longDef:
        "Recall only looks at the actual positive cases in your data. It answers: of everything that was really true, how much did the model find? A model with low recall lets a lot of real positives slip through undetected, even if it's very careful about the positives it does flag.",
      whyMatters:
        "Recall matters most when a false negative — a miss — is the expensive or dangerous outcome, like a fraud transaction that goes through unflagged or a disease that goes undiagnosed.",
      realWorldExample:
        "A smoke detector that only goes off for large, obvious fires has low recall — it's letting a lot of real early-stage fires go undetected, which is exactly the failure mode you can't afford in a smoke detector.",
      relatedTerms: ["what-is-precision", "what-is-confusion-matrix"],
    },
  ],
};

export default content;
