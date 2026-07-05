import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 4,
  phaseLabel: "FEATURE ENGINEERING + SELECTION",
  title: "Feature Selection: Deciding What Earns a Seat in the Model",
  minutes: 20,
  concept:
    "Adding more features to a model isn't free — every additional column gives a model more opportunity to find a \"pattern\" that's really just noise in your specific training data, a failure mode called overfitting: the model memorizes coincidences that don't generalize to new data, and the risk grows the more irrelevant features you add relative to how many rows you have. Feature selection is the practice of deciding, before or during training, which features actually carry a relationship to the target and which are just adding noise and cost. Real pipelines lean on tools like a correlation matrix (df.corr()), a tree model's built-in .feature_importances_, or dedicated selectors like scikit-learn's SelectKBest and mutual_info_classif — all of which quantify, with real statistics, how strongly each feature relates to the target. This lesson builds a deliberately simplified stand-in you can compute by hand with a loop: for a binary (0/1) feature, compare the average target value for rows where the feature is 1 against rows where it's 0. A big gap between those two averages means the feature is genuinely splitting your data into meaningfully different groups — worth keeping. A gap near zero means the feature barely matters — rows with it look basically indistinguishable, on average, from rows without it — and it's a candidate to drop. This isn't real correlation (it ignores continuous features, sample size, and statistical significance), but the intuition — \"does knowing this feature change what I'd expect the target to be?\" — is exactly what real feature-importance metrics are formalizing with more rigor.",
  conceptSimpler:
    "Every extra feature is a chance for the model to \"find\" a fake pattern instead of a real one, so it's worth checking whether a feature actually earns its place. A cheap gut-check: does the average outcome look different for rows where the feature is on versus off? Big difference — keep it. Basically the same — it's probably just noise.",
  vizStages: [
    {
      label: "1. More features, more chances to overfit",
      body:
        "With only 2 rows and already 4 candidate columns per row, a model has almost nothing to anchor real patterns to — it can just as easily \"learn\" a coincidence in one of those columns as a genuine relationship. This risk only grows as you add more candidate features without adding more rows.",
      code:
        "rows = []\nrows.append({\"has_badge\": 1, \"coin_flip\": 1, \"days_since_signup\": 40, \"spent\": 90})\nrows.append({\"has_badge\": 0, \"coin_flip\": 0, \"days_since_signup\": 12, \"spent\": 20})\nprint(len(rows))\nprint(len(rows[0]))",
    },
    {
      label: "2. A useful feature: has_badge",
      body:
        "Split rows by has_badge and average spent within each group. Rows with the badge average $90; rows without it average $20 — a $70 gap. That's a real, sizeable difference — has_badge is telling you something about spending.",
      code:
        "rows = []\nrows.append({\"has_badge\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 0, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"spent\": 20})\n\nsum1 = 0\ncount1 = 0\nsum0 = 0\ncount0 = 0\nfor row in rows:\n    if row[\"has_badge\"] == 1:\n        sum1 = sum1 + row[\"spent\"]\n        count1 = count1 + 1\n    else:\n        sum0 = sum0 + row[\"spent\"]\n        count0 = count0 + 1\navg1 = sum1 / count1\navg0 = sum0 / count0\ngap = avg1 - avg0\nif gap < 0:\n    gap = 0 - gap\nprint(avg1)\nprint(avg0)\nprint(gap)",
    },
    {
      label: "3. A noise feature: coin_flip",
      body:
        "Run the exact same computation on coin_flip, a feature with no real relationship to spending. Both groups average $55 — a $0 gap. Knowing coin_flip tells you nothing about what a row is likely to spend, so it isn't earning its place as a feature.",
      code:
        "rows = []\nrows.append({\"coin_flip\": 1, \"spent\": 90})\nrows.append({\"coin_flip\": 1, \"spent\": 90})\nrows.append({\"coin_flip\": 0, \"spent\": 90})\nrows.append({\"coin_flip\": 0, \"spent\": 90})\nrows.append({\"coin_flip\": 1, \"spent\": 20})\nrows.append({\"coin_flip\": 1, \"spent\": 20})\nrows.append({\"coin_flip\": 0, \"spent\": 20})\nrows.append({\"coin_flip\": 0, \"spent\": 20})\n\nsum1 = 0\ncount1 = 0\nsum0 = 0\ncount0 = 0\nfor row in rows:\n    if row[\"coin_flip\"] == 1:\n        sum1 = sum1 + row[\"spent\"]\n        count1 = count1 + 1\n    else:\n        sum0 = sum0 + row[\"spent\"]\n        count0 = count0 + 1\navg1 = sum1 / count1\navg0 = sum0 / count0\ngap = avg1 - avg0\nif gap < 0:\n    gap = 0 - gap\nprint(avg1)\nprint(avg0)\nprint(gap)",
    },
    {
      label: "4. Turn it into a reusable, repeatable check",
      body:
        "Wrap the same logic in a function that takes any feature name and target name, so you can run this check on every candidate feature in a loop instead of copy-pasting it. Pick a cutoff (here, a gap over 10) to turn each check into a keep/drop decision — remembering this cutoff itself is a simplification, not a statistical guarantee.",
      code:
        "def feature_signal(rows, feature_name, target_name):\n    sum1 = 0\n    count1 = 0\n    sum0 = 0\n    count0 = 0\n    for row in rows:\n        if row[feature_name] == 1:\n            sum1 = sum1 + row[target_name]\n            count1 = count1 + 1\n        else:\n            sum0 = sum0 + row[target_name]\n            count0 = count0 + 1\n    avg1 = sum1 / count1\n    avg0 = sum0 / count0\n    gap = avg1 - avg0\n    if gap < 0:\n        gap = 0 - gap\n    return gap\n\nrows = []\nrows.append({\"has_badge\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 0, \"spent\": 20})\nprint(feature_signal(rows, \"has_badge\", \"spent\"))",
    },
  ],
  realWorldIntro:
    "Real feature selection tools formalize exactly this question — \"does this feature actually relate to the target?\" — with real statistics instead of a simplified average-gap check. df.corr() computes a real correlation coefficient between numeric columns; a trained RandomForestClassifier exposes .feature_importances_ for every feature it used; and scikit-learn's SelectKBest(score_func=f_classif, k=10) automatically keeps only the 10 features that score highest against the target. All of them are more rigorous versions of the same instinct: quantify how much a feature actually moves the target, then keep the ones that matter and drop the ones that don't.",
  realWorldCode:
    "# hand-built stand-in (average gap for a binary feature):\ngap = feature_signal(rows, \"has_badge\", \"spent\")\n\n# real pandas correlation matrix:\n# df.corr()[\"spent\"].sort_values(ascending=False)\n\n# real scikit-learn feature importance (tree-based model):\n# model = RandomForestRegressor().fit(X_train, y_train)\n# importances = model.feature_importances_\n\n# real scikit-learn automatic selection:\n# from sklearn.feature_selection import SelectKBest, f_classif\n# selector = SelectKBest(score_func=f_classif, k=10).fit(X_train, y_train)",
  sandbox: {
    kind: "code",
    challenge:
      "Write feature_signal(rows, feature_name, target_name), returning the absolute gap between the average target value when the feature is 1 versus 0. Call it for both \"has_badge\" and \"coin_flip\" against \"spent\", and print a keep/drop decision using a gap-over-10 cutoff.",
    starterCode:
      "def feature_signal(rows, feature_name, target_name):\n    sum1 = 0\n    count1 = 0\n    sum0 = 0\n    count0 = 0\n    for row in rows:\n        if row[feature_name] == 1:\n            sum1 = sum1 + row[target_name]\n            count1 = count1 + 1\n        else:\n            sum0 = sum0 + row[target_name]\n            count0 = count0 + 1\n    avg1 = sum1 / count1\n    avg0 = sum0 / count0\n    gap = avg1 - avg0\n    if gap < 0:\n        gap = 0 - gap\n    return gap\n\nrows = []\nrows.append({\"has_badge\": 1, \"coin_flip\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"coin_flip\": 1, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"coin_flip\": 0, \"spent\": 90})\nrows.append({\"has_badge\": 1, \"coin_flip\": 0, \"spent\": 90})\nrows.append({\"has_badge\": 0, \"coin_flip\": 1, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"coin_flip\": 1, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"coin_flip\": 0, \"spent\": 20})\nrows.append({\"has_badge\": 0, \"coin_flip\": 0, \"spent\": 20})\n\nfeature_names = [\"has_badge\", \"coin_flip\"]\nfor feature_name in feature_names:\n    gap = feature_signal(rows, feature_name, \"spent\")\n    if gap > 10:\n        decision = \"keep\"\n    else:\n        decision = \"drop\"\n    print(f\"{feature_name}: gap={gap} -> {decision}\")",
  },
  quizQuestion:
    "This computes the average spend on weekends (is_weekend=1) vs. weekdays (is_weekend=0). Based on the printed averages, what should you conclude about is_weekend as a feature for predicting spent?",
  quizCode:
    "rows = []\nrows.append({\"is_weekend\": 1, \"spent\": 50})\nrows.append({\"is_weekend\": 1, \"spent\": 60})\nrows.append({\"is_weekend\": 0, \"spent\": 55})\nrows.append({\"is_weekend\": 0, \"spent\": 45})\nsum1 = 0\ncount1 = 0\nsum0 = 0\ncount0 = 0\nfor row in rows:\n    if row[\"is_weekend\"] == 1:\n        sum1 = sum1 + row[\"spent\"]\n        count1 = count1 + 1\n    else:\n        sum0 = sum0 + row[\"spent\"]\n        count0 = count0 + 1\navg1 = sum1 / count1\navg0 = sum0 / count0\nprint(avg1)\nprint(avg0)",
  quizOptions: [
    {
      key: "a",
      label:
        "The averages are close (55 vs. 50) so is_weekend carries only a weak signal here — on its own, it's a weaker candidate to keep than a feature with a bigger gap between groups",
      correct: true,
    },
    {
      key: "b",
      label:
        "Since count1 also increased along the way, is_weekend is definitely the strongest feature in the dataset",
      correct: false,
    },
    {
      key: "c",
      label:
        "Because avg1 and avg0 are both valid numbers, this proves is_weekend has zero relationship to spent",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — 55 vs. 50 is only a 5-point gap, much smaller than the 70-point gap has_badge showed. That doesn't prove is_weekend is completely useless, but on this simplified signal it looks far less informative, and with more candidate features than rows, weak signals like this are exactly the ones worth dropping first.",
  quizFeedbackIncorrect:
    "Not quite — count1 and count0 are just bookkeeping (how many rows landed in each group), not a signal about predictiveness. The number that matters here is the gap between avg1 and avg0: at 5 points, it's much smaller than a feature like has_badge's 70-point gap, which is the sign of a comparatively weak (though not necessarily zero) relationship to spent.",
  takeaway:
    "Too many features relative to rows invites a model to memorize noise instead of learning real patterns — that's overfitting. Comparing the average target value for a binary feature's on-group vs. off-group is a simplified stand-in for real correlation and feature-importance metrics: a big gap signals a feature worth keeping, a gap near zero signals a feature that's probably just adding noise and cost.",
  explainers: [
    {
      id: "what-is-overfitting",
      term: "What's Overfitting?",
      emoji: "🪤",
      shortDef:
        "Overfitting is when a model learns the quirks of its specific training data instead of the general pattern — it looks great on training data and falls apart on new data.",
      longDef:
        "A model has a limited amount of \"room\" to learn patterns in, and every feature you give it is a chance to use that room on something real or on pure noise. With too many features relative to how many rows you have, a model can find a coincidental relationship in your training set — one that happens to fit those specific rows but reflects nothing true about the world — and treat it as a real pattern. That model will perform beautifully on the data it memorized and poorly on anything new.",
      whyMatters:
        "Feature selection is one of the simplest defenses against overfitting: fewer, more relevant features give the model less opportunity to latch onto noise, and often produce a model that generalizes better even though it \"sees\" less information.",
      realWorldExample:
        "Imagine studying for a test by memorizing the exact answers to last year's practice exam instead of understanding the material — you'd ace that exact exam and struggle the moment a single question changed. An overfit model has done the equivalent with its training data.",
      relatedTerms: ["what-is-feature-selection"],
      expandedByDefault: true,
    },
    {
      id: "what-is-feature-selection",
      term: "What's Feature Selection?",
      emoji: "🎯",
      shortDef:
        "Feature selection is deciding which of your candidate features actually help the model, and dropping the ones that don't.",
      longDef:
        "Once you've engineered and encoded a set of candidate features, feature selection asks a follow-up question: does each one actually carry a relationship to the target worth the risk of overfitting and the cost of extra computation? Real techniques include correlation analysis, statistical tests, and model-based importance scores; this lesson's average-gap check is a hand-built, simplified stand-in for that same idea, built to run in a sandbox with no statistics library available.",
      whyMatters:
        "Feature selection isn't just about accuracy — fewer, well-chosen features also make a model faster to train, cheaper to run, and easier for a human to interpret and debug.",
      realWorldExample:
        "A retailer building a churn model might start with 200 candidate columns pulled from every table in their database. Feature selection is the process of narrowing that down to the 20 or so that actually predict churn, instead of feeding the model all 200 and hoping for the best.",
      relatedTerms: ["what-is-overfitting"],
    },
  ],
};

export default content;
