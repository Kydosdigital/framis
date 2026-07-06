import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 4,
  phaseLabel: "MODEL EVALUATION + CROSS-VALIDATION",
  title: "K-Fold Cross-Validation: One Split Is Just One Guess",
  minutes: 22,
  concept:
    "A single train/test split gives you exactly one number, and that number depends partly on luck — which examples happened to land in the test set. Get an easy test set and your score looks better than the model deserves; get a hard one and it looks worse. K-fold cross-validation fixes this by not relying on just one split. You divide your data into k roughly-equal chunks, called folds. Then you run k rounds: in round 1, fold 1 is the test set and folds 2 through k are the training set; in round 2, fold 2 becomes the test set and everyone else trains; and so on, until every fold has had exactly one turn being the held-out test set. Each round gives you a score, and you average all k scores together into one number — that average is a far more reliable estimate of real-world performance than any single split, because it isn't dependent on which particular examples got unlucky enough to land in the test set that one time. This also matters for hyperparameter tuning: when you're comparing several versions of a model (different thresholds, different tree depths, different k values), you don't just try each one against a single test set and pick the highest score — you cross-validate each candidate and compare average scores, so your choice isn't just the version that happened to get the easiest single split.",
  conceptSimpler:
    "One train/test split is like judging a chef on a single dish — maybe they nailed it, maybe they got lucky with fresh ingredients that day. K-fold cross-validation is having them cook five different dishes on five different days and averaging the reviews — a much fairer read on how good they actually are.",
  vizStages: [
    {
      label: "1. Ten examples, five folds",
      body:
        "Split 10 examples into k=5 folds of 2 examples each, using index math — no shuffling needed to see the mechanism (real code shuffles first, exactly like the train/test split lesson).",
      code:
        "examples = []\nfor i in range(10):\n    examples.append(i)\n\nk = 5\nfold_size = len(examples) // k\n\nfolds = []\nfor f in range(k):\n    fold = []\n    start = f * fold_size\n    for i in range(fold_size):\n        fold.append(examples[start + i])\n    folds.append(fold)\n\nfor f in range(k):\n    print(f\"fold {f}: {folds[f]}\")",
    },
    {
      label: "2. Every fold gets a turn as the test set",
      body:
        "Five rounds. Each round, one fold is held out as test and the other four are combined into the training set — the fold doing the testing rotates every round.",
      code:
        "for f in range(k):\n    test_fold = folds[f]\n    train_fold = []\n    for other in range(k):\n        if other != f:\n            for item in folds[other]:\n                train_fold.append(item)\n    print(f\"round {f}: test={test_fold} train={train_fold}\")",
    },
    {
      label: "3. A toy accuracy for each fold",
      body:
        "In real cross-validation, you'd retrain a real model on each round's training fold and score it on that round's test fold. Here, fold_predicted and fold_actual are toy stand-ins for what those five real predictions would look like — but the accuracy math on them is fully real.",
      code:
        "fold_predicted = []\nfold_predicted.append([1, 0, 1, 0])\nfold_predicted.append([1, 1, 0, 0])\nfold_predicted.append([1, 0, 1, 0])\nfold_predicted.append([0, 1, 1, 0])\nfold_predicted.append([1, 1, 0, 1])\n\nfold_actual = []\nfold_actual.append([1, 0, 1, 1])\nfold_actual.append([1, 1, 0, 0])\nfold_actual.append([0, 0, 1, 1])\nfold_actual.append([0, 1, 1, 1])\nfold_actual.append([1, 0, 0, 1])",
    },
    {
      label: "4. Average across folds — the real cross-validation score",
      body:
        "Each fold's accuracy varies (0.75, 1.0, 0.5, 0.75, 0.75) — proof that any single one of these, on its own, would've been a noisy, unreliable estimate. The average, 0.75, is the number you'd actually report.",
      code:
        "accuracies = []\nfor f in range(len(fold_predicted)):\n    pred_fold = fold_predicted[f]\n    act_fold = fold_actual[f]\n    correct = 0\n    for i in range(len(act_fold)):\n        if pred_fold[i] == act_fold[i]:\n            correct = correct + 1\n    fold_acc = correct / len(act_fold)\n    accuracies.append(fold_acc)\n    print(f\"fold {f} accuracy: {fold_acc}\")\n\ntotal = 0\nfor acc in accuracies:\n    total = total + acc\naverage_acc = total / len(accuracies)\nprint(f\"average cross-validation accuracy: {average_acc}\")",
    },
  ],
  realWorldIntro:
    "scikit-learn's cross_val_score runs this exact rotation — splitting into k folds, training and scoring k times, and handing you back an array of k scores — which is also the standard tool for comparing hyperparameter choices instead of trusting a single train/test split per candidate.",
  realWorldCode:
    "from sklearn.model_selection import cross_val_score\n\nscores = cross_val_score(model, X, y, cv=5)\nprint(scores)          # one real score per fold\nprint(scores.mean())   # the number you'd actually report\n\n# comparing hyperparameters means cross-validating each candidate,\n# not testing each one on a single split and picking the best score\nfor depth in [2, 4, 6, 8]:\n    candidate = DecisionTreeClassifier(max_depth=depth)\n    print(depth, cross_val_score(candidate, X, y, cv=5).mean())",
  sandbox: {
    kind: "code",
    challenge:
      "Build 5 folds from 10 examples using index math, show the training/test rotation across all 5 rounds, then compute each fold's accuracy from a small toy predictions list and average all 5 into a single cross-validation score.",
    starterCode:
      "examples = []\nfor i in range(10):\n    examples.append(i)\n\nk = 5\nfold_size = len(examples) // k\n\nfolds = []\nfor f in range(k):\n    fold = []\n    start = f * fold_size\n    for i in range(fold_size):\n        fold.append(examples[start + i])\n    folds.append(fold)\n\nfor f in range(k):\n    print(f\"fold {f}: {folds[f]}\")\n\nfor f in range(k):\n    test_fold = folds[f]\n    train_fold = []\n    for other in range(k):\n        if other != f:\n            for item in folds[other]:\n                train_fold.append(item)\n    print(f\"round {f}: test={test_fold} train={train_fold}\")\n\nfold_predicted = []\nfold_predicted.append([1, 0, 1, 0])\nfold_predicted.append([1, 1, 0, 0])\nfold_predicted.append([1, 0, 1, 0])\nfold_predicted.append([0, 1, 1, 0])\nfold_predicted.append([1, 1, 0, 1])\n\nfold_actual = []\nfold_actual.append([1, 0, 1, 1])\nfold_actual.append([1, 1, 0, 0])\nfold_actual.append([0, 0, 1, 1])\nfold_actual.append([0, 1, 1, 1])\nfold_actual.append([1, 0, 0, 1])\n\naccuracies = []\nfor f in range(len(fold_predicted)):\n    pred_fold = fold_predicted[f]\n    act_fold = fold_actual[f]\n    correct = 0\n    for i in range(len(act_fold)):\n        if pred_fold[i] == act_fold[i]:\n            correct = correct + 1\n    fold_acc = correct / len(act_fold)\n    accuracies.append(fold_acc)\n    print(f\"fold {f} accuracy: {fold_acc}\")\n\ntotal = 0\nfor acc in accuracies:\n    total = total + acc\naverage_acc = total / len(accuracies)\nprint(f\"average cross-validation accuracy: {average_acc}\")",
  },
  quizQuestion:
    "This code builds k=4 folds from 20 examples. Across all 4 rounds of the rotation (each fold taking one turn as the test set), how many times does the example at index 0 end up in the test set?",
  quizCode:
    "examples = []\nfor i in range(20):\n    examples.append(i)\n\nk = 4\nfold_size = len(examples) // k\n\nfolds = []\nfor f in range(k):\n    fold = []\n    start = f * fold_size\n    for i in range(fold_size):\n        fold.append(examples[start + i])\n    folds.append(fold)\n\nfor f in range(k):\n    print(f\"fold {f}: {folds[f]}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "Exactly once — index 0 lives in fold 0, and fold 0 is the test set during exactly one of the 4 rounds; every other round it's part of training",
      correct: true,
    },
    {
      key: "b",
      label: "4 times — every example is retested every single round, regardless of which fold it's in",
      correct: false,
    },
    {
      key: "c",
      label: "0 times — the first fold built is always reserved as training-only and never gets tested",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the entire point of the rotation is that each fold takes exactly one turn as the test set over the course of k rounds. Index 0 sits in fold 0, so it's part of the test set only during round 0; in rounds 1, 2, and 3, it's folded into the training data instead. Across the whole procedure, every example ends up tested exactly once — never zero times, never repeatedly.",
  quizFeedbackIncorrect:
    "Not quite — k-fold cross-validation guarantees each fold becomes the test set exactly once across the k rounds, no more and no less. Index 0 belongs to fold 0, so it's held out as test data only in round 0; every other round, fold 0 (and index 0 with it) is part of the training data instead.",
  takeaway:
    "A single train/test split gives you one score that depends partly on which examples got unlucky enough to land in the test set. K-fold cross-validation rotates every fold through the test-set role exactly once and averages the k resulting scores, giving you a far more reliable estimate — and it's also the right way to compare hyperparameter choices instead of picking whichever one won a single lucky split.",
  explainers: [
    {
      id: "what-is-cross-validation",
      term: "What's Cross-Validation?",
      emoji: "🔁",
      shortDef:
        "Splitting your data into k folds, rotating which fold is the test set across k rounds, and averaging the k scores into one more reliable estimate.",
      longDef:
        "Cross-validation trades a single train/test split for k of them. Every example gets to be part of the test set exactly once and part of the training set the rest of the time. The average of the k scores smooths out the luck of any one particular split — if one fold happened to contain unusually easy or unusually hard examples, its effect on the final average is diluted by the other k-1 rounds.",
      whyMatters:
        "A model's score on a single train/test split can shift meaningfully just by re-shuffling which examples land in the test set. Cross-validation is how you get a number stable enough to actually trust and compare against other models.",
      realWorldExample:
        "It's like a diving competition using several judges instead of one — any single judge might be having an unusually harsh or generous day, but the average across several judges is a fairer, more stable read on the actual performance.",
      relatedTerms: ["what-is-fold", "what-is-hyperparameter"],
      expandedByDefault: true,
    },
    {
      id: "what-is-fold",
      term: "What's a Fold?",
      emoji: "🗂️",
      shortDef: "One equal-sized chunk of your data in a k-fold split — k of these chunks together make up the whole dataset.",
      longDef:
        "When you cross-validate with k=5, you're dividing your dataset into 5 folds. On each of the 5 rounds, one fold plays the role of the test set while the remaining 4 folds are combined into that round's training set. By the end of all 5 rounds, every fold has played the test-set role exactly once.",
      whyMatters:
        "Understanding folds is what makes the rotation mechanism click: it's not k independent random splits, it's a structured guarantee that every example is tested on exactly once across the whole procedure.",
      realWorldExample:
        "It's like splitting a class of 20 students into 4 groups of 5 for a peer-review exercise, where each group takes a turn being reviewed by the other three groups combined — every group gets reviewed exactly once by the end.",
      relatedTerms: ["what-is-cross-validation"],
    },
    {
      id: "what-is-hyperparameter",
      term: "What's a Hyperparameter?",
      emoji: "🎛️",
      shortDef:
        "A setting you choose before training, like a decision tree's max depth or k in k-nearest-neighbors — not something the model learns from data.",
      longDef:
        "Hyperparameters are the knobs you set going into training, as opposed to the parameters the model actually learns while fitting to data. Choosing good hyperparameters usually means trying several candidate values and comparing how well each one performs — and cross-validation, not a single train/test split, is the reliable way to make that comparison.",
      whyMatters:
        "Picking a hyperparameter based on one lucky train/test split risks choosing a setting that only looked good because of which examples happened to be in that one test set, not because it's actually the better choice.",
      realWorldExample:
        "It's like choosing an oven temperature for a recipe by baking one test batch at each temperature and averaging feedback across several tasters, rather than trusting a single taster's opinion of a single batch.",
      relatedTerms: ["what-is-cross-validation"],
    },
  ],
};

export default content;
