import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 1,
  phaseLabel: "CLASSICAL MACHINE LEARNING",
  title: "Decision Stumps: Teaching a Tree to Ask One Good Question",
  minutes: 22,
  concept:
    "A decision tree's most basic building block is a single yes/no question about one feature: \"is this number above some threshold?\" A tree that asks exactly one such question and then stops — predicting one class if the answer is yes, a different class if no — is called a decision stump, and it's a complete, if minimal, decision tree (a tree of depth 1, meaning one level of questions). The hard part was never asking a threshold question, it's picking a good one: given a feature and a batch of labeled examples, you want the threshold that splits the data into two groups that are each as \"pure\" as possible — mostly one class on one side, mostly the other class on the other side. The real algorithm behind every decision tree library does exactly this, just more thoroughly: for every candidate threshold (usually every midpoint between two consecutive sorted feature values), split the data, measure how mixed each side is using an impurity score like Gini impurity or entropy, and keep whichever split minimizes that impurity — then repeat the entire process again inside each new branch to grow a taller, multi-level tree. Our version keeps the exact same search-and-score mechanic but simplifies the scoring: instead of Gini impurity, we score a candidate threshold by literally counting how many examples end up correctly classified once each side predicts its own majority label — a real, working measure of split quality, just a cruder one than scikit-learn's, and we stop after one split instead of recursing deeper. Nothing here is a fake stand-in: this is a genuine search over real candidate thresholds, on real labeled data, using a real (if simplified) scoring rule to find the best one.",
  conceptSimpler:
    "A decision stump is like a bouncer with exactly one rule: \"let anyone taller than X inches into the front row.\" Finding a good decision tree threshold is that bouncer trying out a few different heights for X and keeping whichever one sorts the crowd most cleanly into \"belongs up front\" and \"doesn't,\" based on how the people actually turned out.",
  vizStages: [
    {
      label: "1. A stump is one threshold question",
      body:
        "Before searching for the best threshold, look at what a single, already-chosen stump actually does: it checks one feature against one fixed number and predicts one label above that line, the other label below it.",
      code:
        "def predict_stump(hours, threshold):\n    if hours > threshold:\n        return 1\n    else:\n        return 0\n\nprint(predict_stump(5, 3.5))\nprint(predict_stump(2, 3.5))\n\n1\n0",
    },
    {
      label: "2. Real data is rarely perfectly separable",
      body:
        "Here are seven students: hours studied, and whether they passed (1) or failed (0). Notice hours=4 is a genuine outlier — a student who studied more than three others who passed, but still failed. Any threshold we pick has to work around examples like that, not through them.",
      code:
        "examples = []\nexamples.append({\"hours\": 1, \"label\": 0})\nexamples.append({\"hours\": 2, \"label\": 0})\nexamples.append({\"hours\": 3, \"label\": 1})\nexamples.append({\"hours\": 4, \"label\": 0})\nexamples.append({\"hours\": 5, \"label\": 1})\nexamples.append({\"hours\": 6, \"label\": 1})\nexamples.append({\"hours\": 7, \"label\": 1})\nprint(examples)",
    },
    {
      label: "3. Scoring a threshold: majority vote on each side",
      body:
        "To score one candidate threshold, split the examples into a left group (hours <= threshold) and a right group (hours > threshold). Each side then predicts whatever label is the majority within that side — this is exactly how a real leaf predicts, just simplified to plain vote-counting instead of a probability.",
      code:
        "def count_matches(group, label):\n    count = 0\n    for ex in group:\n        if ex[\"label\"] == label:\n            count = count + 1\n    return count\n\ndef majority_label(group):\n    count0 = count_matches(group, 0)\n    count1 = count_matches(group, 1)\n    if count1 > count0:\n        return 1\n    else:\n        return 0",
    },
    {
      label: "4. Trying several thresholds and keeping the best",
      body:
        "Now try a handful of candidate thresholds — the midpoints between consecutive hour values — and count how many of the seven examples each one gets right. Threshold 2.5 and threshold 4.5 both land on 6 out of 7; the search below keeps the first one it finds.",
      code:
        "def split(examples, threshold):\n    left = []\n    right = []\n    for ex in examples:\n        if ex[\"hours\"] <= threshold:\n            left.append(ex)\n        else:\n            right.append(ex)\n    result = {\"left\": left, \"right\": right}\n    return result\n\ndef count_correct(examples, threshold):\n    parts = split(examples, threshold)\n    left_pred = majority_label(parts[\"left\"])\n    right_pred = majority_label(parts[\"right\"])\n    correct = 0\n    for ex in examples:\n        if ex[\"hours\"] <= threshold:\n            pred = left_pred\n        else:\n            pred = right_pred\n        if pred == ex[\"label\"]:\n            correct = correct + 1\n    return correct\n\nprint(count_correct(examples, 2.5))\n\n6",
    },
  ],
  realWorldIntro:
    "scikit-learn's DecisionTreeClassifier does this same threshold search for every feature you give it, not just one, and it can keep splitting inside each branch to build a tree many levels deep instead of stopping at a single stump. A stump on its own (max_depth=1) is also exactly what gets used as the \"weak learner\" inside boosting algorithms like AdaBoost — a single good-but-imperfect threshold question, combined many times over.",
  realWorldCode:
    "from sklearn.tree import DecisionTreeClassifier\n\n# a real one-level tree (a \"decision stump\") — same idea, real impurity math\nstump = DecisionTreeClassifier(max_depth=1)\nstump.fit(X_train, y_train)\n# under the hood: scans every feature and every candidate threshold,\n# scoring each split with Gini impurity instead of our plain accuracy count",
  sandbox: {
    kind: "code",
    challenge:
      "Given seven labeled examples (hours studied -> passed 0/1, including one noisy outlier), write split(examples, threshold), majority_label(group), and count_correct(examples, threshold), then try every threshold in a candidate list and print out which one gets the most examples right.",
    starterCode:
      "def count_matches(group, label):\n    count = 0\n    for ex in group:\n        if ex[\"label\"] == label:\n            count = count + 1\n    return count\n\ndef majority_label(group):\n    count0 = count_matches(group, 0)\n    count1 = count_matches(group, 1)\n    if count1 > count0:\n        return 1\n    else:\n        return 0\n\ndef split(examples, threshold):\n    left = []\n    right = []\n    for ex in examples:\n        if ex[\"hours\"] <= threshold:\n            left.append(ex)\n        else:\n            right.append(ex)\n    result = {\"left\": left, \"right\": right}\n    return result\n\ndef count_correct(examples, threshold):\n    parts = split(examples, threshold)\n    left_pred = majority_label(parts[\"left\"])\n    right_pred = majority_label(parts[\"right\"])\n    correct = 0\n    for ex in examples:\n        if ex[\"hours\"] <= threshold:\n            pred = left_pred\n        else:\n            pred = right_pred\n        if pred == ex[\"label\"]:\n            correct = correct + 1\n    return correct\n\nexamples = []\nexamples.append({\"hours\": 1, \"label\": 0})\nexamples.append({\"hours\": 2, \"label\": 0})\nexamples.append({\"hours\": 3, \"label\": 1})\nexamples.append({\"hours\": 4, \"label\": 0})\nexamples.append({\"hours\": 5, \"label\": 1})\nexamples.append({\"hours\": 6, \"label\": 1})\nexamples.append({\"hours\": 7, \"label\": 1})\n\nthresholds = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]\n\nbest_threshold = thresholds[0]\nbest_correct = -1\n\nfor t in thresholds:\n    c = count_correct(examples, t)\n    print(f\"threshold {t}: {c}/{len(examples)} correct\")\n    if c > best_correct:\n        best_correct = c\n        best_threshold = t\n\nprint(f\"best split: hours <= {best_threshold}, getting {best_correct}/{len(examples)} right\")",
  },
  quizQuestion:
    "The search above picks threshold 2.5 (the first threshold to reach 6/7 correct). At that split, left predicts 0 and right predicts 1. Which single example does this winning stump get wrong, and why can't a one-level stump fix it without breaking something else?",
  quizCode:
    "threshold = 2.5\nparts = split(examples, threshold)\nleft_pred = majority_label(parts[\"left\"])\nright_pred = majority_label(parts[\"right\"])\nprint(left_pred, right_pred)\n\nfor ex in examples:\n    if ex[\"hours\"] <= threshold:\n        pred = left_pred\n    else:\n        pred = right_pred\n    print(ex[\"hours\"], ex[\"label\"], pred)",
  quizOptions: [
    {
      key: "a",
      label:
        "The hours=4, label=0 student — it lands on the \"right\" side (hours > 2.5) with every other passing student, so it gets predicted 1 even though it actually failed, and a single threshold can't carve it out without also misclassifying its neighbors",
      correct: true,
    },
    {
      key: "b",
      label:
        "The hours=1, label=0 student — the left side always mispredicts its lowest member",
      correct: false,
    },
    {
      key: "c",
      label:
        "None of them — a one-level stump always gets 100% accuracy once it finds the best threshold",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — hours=4 sits solidly inside the \"hours > 2.5\" region alongside 5, 6, and 7, all of which passed, so the right side's majority vote is 1. A single threshold can only draw one line; it has no way to fence off just that one exceptional student without also cutting off the genuinely-passing students right next to it. A deeper tree (more thresholds, applied inside each branch) could eventually isolate it, at the cost of fitting noise instead of a real pattern.",
  quizFeedbackIncorrect:
    "Not quite — run the split at threshold 2.5 and check each example against its side's majority label: hours=4 (label 0) falls on the \"right\" side with 5, 6, and 7 (all label 1), so the right side's majority vote of 1 misclassifies it. A one-level stump can't rope off a single exception without also misclassifying the correctly-passing students sitting right next to it in feature space — that would require another split, i.e. a deeper tree.",
  takeaway:
    "A decision stump picks the one threshold, on one feature, that best separates two classes — scored here by counting correct predictions instead of scikit-learn's Gini impurity, but the underlying search (try candidate thresholds, split the data, score each split, keep the best) is the real algorithm at the heart of every decision tree, just running once instead of recursing into a full tree.",
  explainers: [
    {
      id: "what-is-decision-tree",
      term: "What's a Decision Tree?",
      emoji: "🌳",
      shortDef:
        "A decision tree is a series of yes/no questions about your data that ends in a prediction — like a flowchart built from real numbers instead of guesses.",
      longDef:
        "A decision tree classifies an example by asking a sequence of threshold questions, one after another: \"is feature X above 5?\" then, depending on the answer, another question, and so on, until it reaches a final answer at the bottom (a \"leaf\"). Each individual question is chosen by an algorithm, not a person — it picks whichever feature and threshold best separates the training examples at that point.",
      whyMatters:
        "Decision trees are one of the few machine learning models a human can actually read end to end and understand why it made a specific prediction, which is why they're still used heavily in places where explainability matters (like credit decisions), and why they form the building blocks of more powerful models like random forests.",
      realWorldExample:
        "A doctor triaging patients might ask \"temperature above 100.4?\" then, if yes, \"symptoms started more than 3 days ago?\" — each answer narrows things down. A decision tree formalizes exactly that kind of branching logic, but picks the questions and thresholds from data instead of intuition.",
      relatedTerms: ["what-is-decision-stump", "what-is-training-data"],
      expandedByDefault: true,
    },
    {
      id: "what-is-decision-stump",
      term: "What's a Decision Stump?",
      emoji: "🪓",
      shortDef:
        "A decision stump is a decision tree that only asks one question — a tree that's exactly one level deep.",
      longDef:
        "Where a full decision tree can chain many threshold questions together, a stump stops after the very first one: it picks a single feature and a single threshold, and predicts one class above that line, another class below it. It's the smallest possible decision tree, and it's a real, complete, working classifier on its own — just usually not a very accurate one by itself.",
      whyMatters:
        "Stumps are the go-to \"weak learner\" inside ensemble methods like random forests and AdaBoost — instead of trying to build one huge, accurate tree, those methods combine many small, imperfect stumps and let their combined vote outperform any single one, which is exactly the idea in the next lesson.",
      realWorldExample:
        "Think of a stump as a single rule-of-thumb, like \"anyone who studied more than 3 hours probably passed.\" It's not always right, but it's right often enough to be useful, especially once you start combining several different rules-of-thumb together.",
      relatedTerms: ["what-is-decision-tree"],
    },
    {
      id: "what-is-training-data",
      term: "What's Training Data / a Label?",
      emoji: "🏷️",
      shortDef:
        "Training data is a set of past examples with known answers — each one paired with the correct label the model is trying to learn to predict.",
      longDef:
        "In our lesson, each example is a dict like {\"hours\": 4, \"label\": 0} — hours studied is the feature (the input the model gets to see), and label is the answer we already know from the past (whether that student actually passed). A learning algorithm looks at many of these feature-label pairs and tries to find a rule — like a decision stump's threshold — that predicts the label from the feature as accurately as possible.",
      whyMatters:
        "Every classical ML algorithm in this module — decision stumps, forests, logistic regression, and even the centroids in k-means — either directly fits itself to labeled examples like these, or (for k-means specifically) works on unlabeled data, which is exactly what the last lesson in this module is about.",
      realWorldExample:
        "It's like grading a stack of old exams where you already know the final course outcome for each student — you're looking for the pattern in the old data (features) that predicted the known outcome (label), so you can apply that same rule to a brand new student.",
      relatedTerms: ["what-is-decision-tree"],
    },
  ],
};

export default content;
