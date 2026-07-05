import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 1,
  phaseLabel: "MODEL EVALUATION + CROSS-VALIDATION",
  title: "Train/Test Split: Why You Can't Grade Your Own Homework",
  minutes: 20,
  concept:
    "So far, when you've checked whether a model \"works,\" you've probably scored it on the exact examples it was trained on — and that number lies to you. A model can memorize its training examples instead of learning the pattern behind them, the same way a student who's seen the exact exam questions in advance can score 100% without understanding a single concept underneath. The number that actually matters is how the model does on examples it has never seen, because that's your best proxy for how it'll perform once it's out in the real world looking at new data. The fix is a train/test split: before you train anything, you set aside a chunk of your labeled examples — commonly 20% — and don't let training touch them at all. You fit the model only on the remaining 80% (the training set), then afterward score it on the untouched 20% (the test set). One honesty note: real code always shuffles the examples randomly before slicing off that test portion, because if your data happens to be sorted — by date, by label, by anything — grabbing a contiguous block risks handing you a test set that isn't representative of the whole. Below, we deliberately skip that shuffle and just take the last 20% by position, purely so the split is identical every time you run it — real tools like scikit-learn's train_test_split shuffle by default.",
  conceptSimpler:
    "It's like a teacher grading you on the exact worksheet you copied answers onto — grading you on new questions you've never seen is the only way to tell whether you actually learned the material or just memorized the answer key.",
  vizStages: [
    {
      label: "1. Ten houses, each with a size and a label",
      body:
        "This is the full labeled dataset: for each house we know its size in square feet and whether it actually sold as \"expensive\" (1) or not (0).",
      code:
        "examples = []\nexamples.append({\"size\": 800, \"actual\": 0})\nexamples.append({\"size\": 900, \"actual\": 0})\nexamples.append({\"size\": 1000, \"actual\": 0})\nexamples.append({\"size\": 1100, \"actual\": 0})\nexamples.append({\"size\": 1600, \"actual\": 1})\nexamples.append({\"size\": 1700, \"actual\": 1})\nexamples.append({\"size\": 1800, \"actual\": 1})\nexamples.append({\"size\": 1900, \"actual\": 1})\nexamples.append({\"size\": 1450, \"actual\": 1})\nexamples.append({\"size\": 1550, \"actual\": 1})\nprint(f\"total examples: {len(examples)}\")",
    },
    {
      label: "2. Split by position — 80% train, 20% test",
      body:
        "split_index marks where train ends and test begins. Real code shuffles the examples first so position in the list has nothing to do with which set an example lands in — we skip that step here only so everyone gets the same, reproducible split to compare.",
      code:
        "split_index = len(examples) * 80 // 100\n\ntrain = []\ntest = []\nfor i in range(len(examples)):\n    if i < split_index:\n        train.append(examples[i])\n    else:\n        test.append(examples[i])\n\nprint(f\"train size: {len(train)}, test size: {len(test)}\")",
    },
    {
      label: "3. A simple rule, tuned by peeking at the training data",
      body:
        "This is a decision stump, like the ones from the trees module — one threshold, one split. We picked 1500 because it happens to sort every training example correctly. That's exactly the trap: it was chosen to fit this data, not because it reflects some universal truth about house prices.",
      code:
        "def predict(size):\n    if size >= 1500:\n        return 1\n    else:\n        return 0\n\ndef score(dataset):\n    correct = 0\n    for ex in dataset:\n        pred = predict(ex[\"size\"])\n        if pred == ex[\"actual\"]:\n            correct = correct + 1\n    return correct / len(dataset)",
    },
    {
      label: "4. Score on train vs. test — watch the gap appear",
      body:
        "The rule scores a perfect 1.0 on the data it was tuned against, but drops to 0.5 the moment it faces houses it never got to peek at. That drop is the entire reason a train/test split exists — the training score was never trustworthy on its own.",
      code:
        "train_acc = score(train)\ntest_acc = score(test)\nprint(f\"train accuracy: {train_acc}\")\nprint(f\"test accuracy: {test_acc}\")",
    },
  ],
  realWorldIntro:
    "In a real project you'd reach for scikit-learn's train_test_split, which shuffles your examples with a random seed before slicing off the test portion, so the split doesn't accidentally line up with how your data happens to be ordered.",
  realWorldCode:
    "from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42, shuffle=True\n)\n# shuffle=True (the default) randomizes example order before splitting\n# random_state=42 just makes that random shuffle reproducible run to run",
  sandbox: {
    kind: "code",
    challenge:
      "Given 10 house examples, split them into train (first 80%) and test (last 20%) using index math, then score the provided predict() rule on both sets and compare the accuracy gap.",
    starterCode:
      "examples = []\nexamples.append({\"size\": 800, \"actual\": 0})\nexamples.append({\"size\": 900, \"actual\": 0})\nexamples.append({\"size\": 1000, \"actual\": 0})\nexamples.append({\"size\": 1100, \"actual\": 0})\nexamples.append({\"size\": 1600, \"actual\": 1})\nexamples.append({\"size\": 1700, \"actual\": 1})\nexamples.append({\"size\": 1800, \"actual\": 1})\nexamples.append({\"size\": 1900, \"actual\": 1})\nexamples.append({\"size\": 1450, \"actual\": 1})\nexamples.append({\"size\": 1550, \"actual\": 1})\n\n# real code shuffles the examples before splitting; we skip that here\n# so the split is identical every time this runs\nsplit_index = len(examples) * 80 // 100\n\ntrain = []\ntest = []\nfor i in range(len(examples)):\n    if i < split_index:\n        train.append(examples[i])\n    else:\n        test.append(examples[i])\n\nprint(f\"total examples: {len(examples)}\")\nprint(f\"train size: {len(train)}, test size: {len(test)}\")\n\ndef predict(size):\n    if size >= 1500:\n        return 1\n    else:\n        return 0\n\ndef score(dataset):\n    correct = 0\n    for ex in dataset:\n        pred = predict(ex[\"size\"])\n        if pred == ex[\"actual\"]:\n            correct = correct + 1\n    return correct / len(dataset)\n\ntrain_acc = score(train)\ntest_acc = score(test)\nprint(f\"train accuracy: {train_acc}\")\nprint(f\"test accuracy: {test_acc}\")",
  },
  quizQuestion:
    "This code builds train/test sets for 12 examples using split_index = len(examples) * 80 // 100. How many examples end up in the test set?",
  quizCode:
    "examples = []\nfor i in range(12):\n    examples.append(i)\n\nsplit_index = len(examples) * 80 // 100\n\ntrain = []\ntest = []\nfor i in range(len(examples)):\n    if i < split_index:\n        train.append(examples[i])\n    else:\n        test.append(examples[i])\n\nprint(f\"train: {train}\")\nprint(f\"test: {test}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "3 examples — 12 * 80 // 100 floors 9.6 down to 9, so the first 9 indices go to train and the remaining 3 go to test",
      correct: true,
    },
    {
      key: "b",
      label: "2 examples — the split always rounds 20% down to the nearest even number",
      correct: false,
    },
    {
      key: "c",
      label: "4 examples — the split always rounds the test portion up to make sure it has enough data",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — 12 * 80 // 100 is integer (floor) division, so 9.6 becomes 9. Indices 0 through 8 (9 examples) go to train, and whatever's left — indices 9, 10, 11, three examples — goes to test. There's no rounding up, just a hard floor.",
  quizFeedbackIncorrect:
    "Not quite — 12 * 80 // 100 works out to 9.6, and // always floors (rounds down, never up), giving split_index = 9. That leaves indices 0–8 (9 examples) for train and indices 9–11 (3 examples) for test.",
  takeaway:
    "Scoring a model on its own training data tells you how well it memorized, not how well it generalizes — that's why a train/test split exists. Set aside a portion of your data the model never trains on, score it only on that held-out portion, and treat the training score as background noise, not a result.",
  explainers: [
    {
      id: "what-is-train-test-split",
      term: "What's a Train/Test Split?",
      emoji: "✂️",
      shortDef:
        "Dividing your labeled data into two pieces before training: one piece the model learns from, and one piece it never sees until you're ready to grade it.",
      longDef:
        "A train/test split reserves a portion of your labeled examples — commonly 20% — as a test set that training never touches. The model fits only on the remaining training set. Afterward, you score it on the test set to estimate how it'll perform on brand-new data it hasn't memorized any quirks of.",
      whyMatters:
        "Without this split, you have no honest way to know whether your model actually learned a generalizable pattern or just memorized the specific examples in front of it. Every serious evaluation in machine learning starts here.",
      realWorldExample:
        "It's the difference between a driving instructor testing you on the exact route you practiced a hundred times versus testing you on a street you've never driven down. Only the second test tells them whether you can actually drive.",
      relatedTerms: ["what-is-generalization"],
      expandedByDefault: true,
    },
    {
      id: "what-is-generalization",
      term: "What's Generalization?",
      emoji: "🌍",
      shortDef:
        "A model's ability to perform well on new examples it never trained on — not just the examples it already saw.",
      longDef:
        "Generalization is the whole point of building a model. A model that only performs well on its training data hasn't learned anything useful — it's just memorized answers. A model that generalizes well has found a real pattern that also holds on data it's never encountered, which is the only kind of performance that matters once it's deployed.",
      whyMatters:
        "Every metric you compute on a test set is really an attempt to measure generalization, since you can never see every example a deployed model will encounter in the future.",
      realWorldExample:
        "A GPS app that only knows the route from your house to your office isn't actually useful — a GPS that generalizes can route you anywhere, including streets it's never specifically been told about before.",
      relatedTerms: ["what-is-train-test-split"],
    },
  ],
};

export default content;
