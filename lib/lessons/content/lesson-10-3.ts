import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 3,
  phaseLabel: "FEATURE ENGINEERING + SELECTION",
  title: "Min-Max Scaling: Putting Every Feature on the Same Scale",
  minutes: 22,
  concept:
    "Some algorithms compare rows by measuring distance between their feature values, or by taking gradient steps whose size depends on the scale of each input — k-nearest neighbors, k-means clustering, linear/logistic regression, and neural networks all fall into this bucket. If one feature ranges from 0 to 500 (a raw engagement score) and another ranges from 0 to 5 (a ratio), the big-range feature will dominate any distance calculation or gradient step purely because of its scale, not because it's actually more predictive. Min-max scaling fixes this by squeezing every feature into the same 0-to-1 range using the formula (x - min) / (max - min): the minimum value becomes 0, the maximum becomes 1, and everything else lands proportionally in between. Since there's no min()/max() builtin here, you build the running minimum and maximum yourself with a loop and two accumulator variables — exactly what you'd do in real Python before reaching for pandas' .min()/.max() or scikit-learn's MinMaxScaler(). Tree-based models (decision trees, random forests, gradient-boosted trees) don't need any of this — a tree splits each feature independently at a threshold (\"is engagement_score > 310?\"), and that threshold doesn't care whether the feature's original range was 0-500 or 0-1. One rule matters no matter which algorithm you use: compute the min and max from your training data only, then reuse those exact same numbers to scale every other dataset — validation, test, production. Recomputing min/max separately on new data silently changes what your scaled numbers mean, and it's a specific case of the data leakage problem you'll see formalized later in this phase.",
  conceptSimpler:
    "Min-max scaling squeezes every feature onto the same 0-to-1 ruler so a huge-range feature doesn't automatically \"win\" just because its numbers are bigger. You measure that ruler once, using training data, and reuse the same ruler everywhere else — you don't get to redraw it for every new batch of data.",
  vizStages: [
    {
      label: "1. Different features, wildly different scales",
      body:
        "A raw engagement_score might run from 0 to 500; a ratio feature like pages_per_minute might run from 0 to about 5. Feed both directly into a distance calculation and engagement_score's sheer size will dominate, regardless of which feature is actually more predictive.",
      code: "engagement_score = 420\npages_per_minute = 2.5\nprint(engagement_score)\nprint(pages_per_minute)",
    },
    {
      label: "2. Build the running min and max by hand",
      body:
        "There's no max() builtin here, so you track the running minimum and maximum yourself: start both at the first value, then update them whenever you see a bigger or smaller number.",
      code:
        "train_scores = [0, 250, 500]\ntrain_min = train_scores[0]\ntrain_max = train_scores[0]\nfor score in train_scores:\n    if score < train_min:\n        train_min = score\n    if score > train_max:\n        train_max = score\nprint(train_min)\nprint(train_max)",
    },
    {
      label: "3. Apply the min-max formula",
      body:
        "(x - min) / (max - min) maps the minimum value to 0, the maximum to 1, and everything else proportionally between. This sandbox doesn't support parentheses for grouping math, so compute the numerator and denominator as their own named steps.",
      code:
        "def scale(x, lo, hi):\n    numerator = x - lo\n    denominator = hi - lo\n    return numerator / denominator\n\nprint(scale(0, 0, 500))\nprint(scale(250, 0, 500))\nprint(scale(500, 0, 500))",
    },
    {
      label: "4. Fit on train, apply everywhere — don't refit",
      body:
        "Scale test_scores using train's min/max and you get 0.25 / 0.6 / 0.75. Recompute min/max on test_scores alone instead, and the exact same three numbers scale to 0 / 0.7 / 1 — a different result for identical real-world values, purely because you measured the ruler twice. Always reuse the training set's min and max.",
      code:
        "train_scores = [0, 250, 500]\ntest_scores = [125, 300, 375]\n\ntrain_min = train_scores[0]\ntrain_max = train_scores[0]\nfor score in train_scores:\n    if score < train_min:\n        train_min = score\n    if score > train_max:\n        train_max = score\n\ndef scale(x, lo, hi):\n    numerator = x - lo\n    denominator = hi - lo\n    return numerator / denominator\n\nprint(\"scaled using train's min/max (correct):\")\nfor score in test_scores:\n    print(scale(score, train_min, train_max))\n\ntest_min = test_scores[0]\ntest_max = test_scores[0]\nfor score in test_scores:\n    if score < test_min:\n        test_min = score\n    if score > test_max:\n        test_max = score\n\nprint(\"scaled using test's own min/max (the bug):\")\nfor score in test_scores:\n    print(scale(score, test_min, test_max))",
    },
  ],
  realWorldIntro:
    "In real code, this is one call: scaler = MinMaxScaler(); scaler.fit(train_df[['engagement_score']]) computes the min/max exactly once from training data, and scaler.transform(...) applies that same stored min/max to any other dataset — which is exactly the discipline the fit/transform split is designed to enforce. pandas' own .min()/.max() would replace your running-min loop with one call each, but they'd still need to be computed on train only and reused, never recomputed per dataset.",
  realWorldCode:
    "# hand-built:\ndef scale(x, lo, hi):\n    numerator = x - lo\n    denominator = hi - lo\n    return numerator / denominator\n\n# real scikit-learn (fit on train, transform everywhere):\n# from sklearn.preprocessing import MinMaxScaler\n# scaler = MinMaxScaler()\n# scaler.fit(train_df[[\"engagement_score\"]])              # learns min/max from train only\n# train_scaled = scaler.transform(train_df[[\"engagement_score\"]])\n# test_scaled = scaler.transform(test_df[[\"engagement_score\"]])  # reuses train's min/max",
  sandbox: {
    kind: "code",
    challenge:
      "Given train_scores and test_scores, compute train's min and max with a loop (no max() builtin), write scale(x, lo, hi), and apply it — using train's min/max only — to both the train and test lists. Print all six scaled values.",
    starterCode:
      "train_scores = [0, 250, 500]\ntest_scores = [125, 300, 375]\n\ntrain_min = train_scores[0]\ntrain_max = train_scores[0]\nfor score in train_scores:\n    if score < train_min:\n        train_min = score\n    if score > train_max:\n        train_max = score\n\ndef scale(x, lo, hi):\n    numerator = x - lo\n    denominator = hi - lo\n    return numerator / denominator\n\nprint(\"train scaled:\")\nfor score in train_scores:\n    print(scale(score, train_min, train_max))\n\nprint(\"test scaled (using train's min/max):\")\nfor score in test_scores:\n    print(scale(score, train_min, train_max))",
  },
  quizQuestion:
    "You trained min-max scaling using train_min=0 and train_max=500 from your training data. A new engagement score of 375 comes in from production. What does this code print, and what should you do?",
  quizCode:
    "train_min = 0\ntrain_max = 500\n\ndef scale(x, lo, hi):\n    numerator = x - lo\n    denominator = hi - lo\n    return numerator / denominator\n\nnew_score = 375\nprint(scale(new_score, train_min, train_max))",
  quizOptions: [
    {
      key: "a",
      label:
        "It prints 0.75 — reuse the training set's min and max on any new data point; recomputing min/max on the new data would give inconsistent scaling",
      correct: true,
    },
    {
      key: "b",
      label:
        "It prints 0.75, but you should still recompute min and max on the new data first for the most accurate scaling",
      correct: false,
    },
    {
      key: "c",
      label: "It raises an error, because 375 wasn't part of the original training set",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — scale() doesn't care where lo and hi came from, it just does the arithmetic, so it happily scales any new value against train's stored min/max. The discipline is entirely on you: keep reusing train's numbers so the same real-world score always maps to the same scaled value.",
  quizFeedbackIncorrect:
    "Not quite — recomputing min/max on new data is exactly the bug this lesson warns about. It would print 0.75 here, but the moment you start deriving min/max from whatever data happens to walk in, the same real-world score can map to a different scaled number depending on what else was in that batch — which is inconsistent and untrustworthy for a trained model.",
  takeaway:
    "Min-max scaling — (x - min) / (max - min) — puts every feature on the same 0-to-1 footing, which matters for distance- and gradient-based algorithms (k-NN, k-means, linear models, neural nets) but not for tree-based ones. Compute the min and max from training data only, then reuse those exact numbers everywhere else — recomputing them per dataset quietly changes what your scaled numbers mean, which is a form of data leakage.",
  explainers: [
    {
      id: "what-is-normalization",
      term: "What's Normalization (Min-Max Scaling)?",
      emoji: "📐",
      shortDef:
        "Normalization rescales a feature so its values fall between 0 and 1, using (x - min) / (max - min).",
      longDef:
        "Min-max scaling (one common form of \"normalization\") takes a feature's minimum value and maps it to 0, takes its maximum value and maps it to 1, and places every other value proportionally in between. A value exactly at the minimum always becomes 0; a value exactly at the maximum always becomes 1; the midpoint of the range becomes 0.5, and so on. It doesn't change the relative order or spacing of your data — it just compresses or stretches the number line it lives on.",
      whyMatters:
        "Algorithms that measure distance or take gradient steps (k-NN, k-means, linear regression, neural networks) treat a feature's raw scale as meaningful. Without scaling, a feature that happens to range in the thousands can silently dominate one that ranges from 0 to 1, even if the smaller-range feature is more predictive.",
      realWorldExample:
        "Comparing \"income\" (tens of thousands) and \"years of experience\" (single digits) with raw distance math is like comparing two people's height in millimeters vs. their age in centuries — the units alone would make one number tower over the other for no meaningful reason.",
      relatedTerms: ["what-is-data-leakage"],
      expandedByDefault: true,
    },
    {
      id: "what-is-data-leakage",
      term: "What's Data Leakage (in Scaling)?",
      emoji: "🚱",
      shortDef:
        "Data leakage happens when information from outside the training set sneaks into how you prepare your data, making results look better (or just different) than they really are.",
      longDef:
        "In the context of scaling, leakage happens the moment you compute min/max (or any other statistic) from data your model isn't supposed to have learned from yet — like test data, or a future production batch. Even though scaling itself isn't \"training\" in the usual sense, recomputing the min/max separately per dataset lets information about that dataset's distribution quietly influence your numbers, breaking the assumption that train and test are being treated identically.",
      whyMatters:
        "The fix is simple and easy to skip under deadline pressure: always fit your scaler (compute min/max) on training data only, and reuse those exact values everywhere else. This is a small preview of a much bigger data-leakage topic that comes up throughout this phase.",
      realWorldExample:
        "If you scale training data with its own min/max and test data with its own separate min/max, a test score of 375 might scale to 0.75 in one run and 0 in another, depending on what else happened to be in the batch — the model is now comparing numbers that don't mean the same thing.",
      relatedTerms: ["what-is-normalization"],
    },
  ],
};

export default content;
