import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 2,
  phaseLabel: "CLASSICAL MACHINE LEARNING",
  title: "Random Forests: Why a Vote Beats Any Single Guess",
  minutes: 22,
  concept:
    "A single decision stump is cheap and easy to understand, but it's also a \"weak\" classifier — it can only ever ask one threshold question, so it will always get some examples wrong, especially noisy or borderline ones. The core insight behind ensembles like random forests is that several weak, imperfect classifiers, combined the right way, can outperform any one of them alone. The combining trick used here is majority vote: run every classifier on the same example, collect their predictions into a list, and go with whichever label the most classifiers agreed on. This works because different classifiers tend to make different mistakes — a stump that only looks at hours studied will get fooled by a student who studied a lot but still failed for unrelated reasons, but a second stump that looks at practice tests taken might get that exact student right, and when you outvote the first stump's mistake with the other two, the ensemble's answer ends up more reliable than any single member's. A real random forest builds this same idea at scale and adds two extra sources of randomness so the trees actually disagree with each other in useful ways: each tree is trained on a random resample of the training rows (called bagging, short for bootstrap aggregating), and at each split, each tree is only allowed to consider a random subset of the available features, not all of them. That randomness is what decorrelates the trees — if every tree in the forest were trained identically, they'd all make the same mistakes and majority vote would buy you nothing. Our version skips the random resampling and random feature subsets and instead hand-picks three different stumps on different features (and one combining both) for simplicity, but the vote-and-combine mechanic — the actual payoff of a forest — is the exact same real algorithm.",
  conceptSimpler:
    "Imagine asking three different friends to guess whether a stranger will like a movie, each friend basing their guess on a different clue — one looks at genre, one at runtime, one at the lead actor. Any one friend will sometimes guess wrong, but if you go with whatever two out of three agree on, you're right more often than trusting any single friend alone — that's a random forest.",
  vizStages: [
    {
      label: "1. Three different, imperfect stumps",
      body:
        "Each of these three functions is its own tiny decision stump, looking at a different feature (or combination of features). None of them is trained to be perfect — each is just a simple rule that's right most of the time.",
      code:
        "def stump_hours(ex):\n    if ex[\"hours\"] > 3:\n        return 1\n    else:\n        return 0\n\ndef stump_tests(ex):\n    if ex[\"tests\"] > 1:\n        return 1\n    else:\n        return 0\n\ndef stump_combo(ex):\n    total = ex[\"hours\"] + ex[\"tests\"]\n    if total > 4:\n        return 1\n    else:\n        return 0",
    },
    {
      label: "2. Majority vote combines predictions",
      body:
        "majority_vote takes a list of 0/1 predictions from however many classifiers you ran, and returns whichever label got more votes. With three voters, two agreeing is enough to win, even if the third one disagrees.",
      code:
        "def majority_vote(predictions):\n    count1 = 0\n    for p in predictions:\n        if p == 1:\n            count1 = count1 + 1\n    count0 = len(predictions) - count1\n    if count1 > count0:\n        return 1\n    else:\n        return 0\n\nprint(majority_vote([0, 1, 1]))\nprint(majority_vote([0, 0, 1]))\n\n1\n0",
    },
    {
      label: "3. A single stump gets fooled — the ensemble doesn't",
      body:
        "This student studied only 1 hour but took 5 practice tests and still passed. stump_hours, which only looks at hours studied, predicts fail (0) — wrong. But stump_tests and stump_combo both correctly predict pass (1), so the majority vote overrides stump_hours' mistake.",
      code:
        "student = {\"hours\": 1, \"tests\": 5, \"passed\": 1}\n\npred_a = stump_hours(student)\npred_b = stump_tests(student)\npred_c = stump_combo(student)\nprint(pred_a, pred_b, pred_c)\n\nensemble = majority_vote([pred_a, pred_b, pred_c])\nprint(\"ensemble:\", ensemble, \"actual:\", student[\"passed\"])\n\n0 1 1\nensemble: 1 actual: 1",
    },
    {
      label: "4. Averaging across many examples, not just one",
      body:
        "One corrected mistake could be a coincidence. Running all three stumps plus the ensemble across six different students shows the real pattern: stump_hours and stump_tests each get fooled on different students (4/6 accuracy each), but every time one of them is wrong, the other two usually outvote it, so the ensemble lands at 6/6.",
      code:
        "stump_hours accuracy: 4/6\nstump_tests accuracy: 4/6\nstump_combo accuracy: 6/6\nensemble accuracy: 6/6",
    },
  ],
  realWorldIntro:
    "scikit-learn's RandomForestClassifier runs this same majority-vote mechanic across (by default) 100 separate decision trees, each trained on a random bootstrap resample of the training rows and restricted to a random subset of features at every split, so the trees genuinely disagree with each other instead of all making the same mistakes.",
  realWorldCode:
    "from sklearn.ensemble import RandomForestClassifier\n\nforest = RandomForestClassifier(n_estimators=100)\nforest.fit(X_train, y_train)\n# under the hood: 100 trees, each on a random row-and-feature subset,\n# predict() takes their majority vote — same idea as majority_vote() above",
  sandbox: {
    kind: "code",
    challenge:
      "Build three simple stumps on different features (hours, tests, and their combination), write majority_vote(predictions), then run all three plus the ensemble across six students and print each stump's accuracy next to the ensemble's.",
    starterCode:
      "def stump_hours(ex):\n    if ex[\"hours\"] > 3:\n        return 1\n    else:\n        return 0\n\ndef stump_tests(ex):\n    if ex[\"tests\"] > 1:\n        return 1\n    else:\n        return 0\n\ndef stump_combo(ex):\n    total = ex[\"hours\"] + ex[\"tests\"]\n    if total > 4:\n        return 1\n    else:\n        return 0\n\ndef majority_vote(predictions):\n    count1 = 0\n    for p in predictions:\n        if p == 1:\n            count1 = count1 + 1\n    count0 = len(predictions) - count1\n    if count1 > count0:\n        return 1\n    else:\n        return 0\n\nstudents = []\nstudents.append({\"hours\": 1, \"tests\": 5, \"passed\": 1})\nstudents.append({\"hours\": 5, \"tests\": 0, \"passed\": 1})\nstudents.append({\"hours\": 1, \"tests\": 0, \"passed\": 0})\nstudents.append({\"hours\": 5, \"tests\": 5, \"passed\": 1})\nstudents.append({\"hours\": 2, \"tests\": 2, \"passed\": 0})\nstudents.append({\"hours\": 4, \"tests\": 0, \"passed\": 0})\n\nhours_correct = 0\ntests_correct = 0\ncombo_correct = 0\nensemble_correct = 0\n\nfor s in students:\n    pa = stump_hours(s)\n    pb = stump_tests(s)\n    pc = stump_combo(s)\n    votes = [pa, pb, pc]\n    ensemble = majority_vote(votes)\n    actual = s[\"passed\"]\n\n    if pa == actual:\n        hours_correct = hours_correct + 1\n    if pb == actual:\n        tests_correct = tests_correct + 1\n    if pc == actual:\n        combo_correct = combo_correct + 1\n    if ensemble == actual:\n        ensemble_correct = ensemble_correct + 1\n\n    print(f\"hours={s['hours']} tests={s['tests']} actual={actual} -> hours_stump={pa} tests_stump={pb} combo_stump={pc} ensemble={ensemble}\")\n\nprint(f\"stump_hours accuracy: {hours_correct}/{len(students)}\")\nprint(f\"stump_tests accuracy: {tests_correct}/{len(students)}\")\nprint(f\"stump_combo accuracy: {combo_correct}/{len(students)}\")\nprint(f\"ensemble accuracy: {ensemble_correct}/{len(students)}\")",
  },
  quizQuestion:
    "In the run above, stump_hours gets 4/6 students right and stump_tests also gets 4/6 right, but the majority vote across all three stumps gets 6/6 right. How can combining two so-so classifiers (plus a third) end up more accurate than any single one alone?",
  quizCode:
    "# continuing from the sandbox above, after the loop over all six students:\nprint(f\"stump_hours accuracy: {hours_correct}/{len(students)}\")\nprint(f\"stump_tests accuracy: {tests_correct}/{len(students)}\")\nprint(f\"ensemble accuracy: {ensemble_correct}/{len(students)}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "Because stump_hours and stump_tests tend to be wrong on different students, not the same ones — so whenever one of them misses, the others usually outvote its mistake, which majority vote can only do if the errors don't all line up",
      correct: true,
    },
    {
      key: "b",
      label:
        "Because majority vote always produces a perfect classifier once you combine at least three models, regardless of what they're individually predicting",
      correct: false,
    },
    {
      key: "c",
      label:
        "Because stump_hours and stump_tests are actually the same rule written two different ways, so combining them just double-counts one correct answer",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — stump_hours and stump_tests are wrong on different students (a low-hours-but-high-tests student fools stump_hours; a high-tests-but-low-hours student fools stump_tests), so their mistakes don't overlap. Majority vote only pays off when errors are spread out like that — if every model made the exact same mistakes, outvoting wouldn't fix anything, which is exactly why real random forests train each tree on a different random slice of the data and features, to keep their errors from lining up.",
  quizFeedbackIncorrect:
    "Not quite — majority vote isn't magic, and it doesn't work because the models are secretly identical. It works here specifically because stump_hours and stump_tests are wrong on different students: a low-hours, high-tests student fools stump_hours; a different high-hours, low-tests-ish student fools stump_tests. Since their mistakes don't overlap, the remaining votes usually outnumber whichever one is wrong on a given example.",
  takeaway:
    "An ensemble combines several imperfect classifiers by majority vote, and it pays off precisely when those classifiers tend to make different mistakes rather than the same ones — real random forests engineer that disagreement on purpose, training each tree on a random subset of rows and features, but the underlying payoff is the exact same vote-counting mechanic you just built by hand.",
  explainers: [
    {
      id: "what-is-ensemble",
      term: "What's an Ensemble?",
      emoji: "🎻",
      shortDef:
        "An ensemble is a model made of several smaller models working together, whose combined answer is usually more reliable than any one of them alone.",
      longDef:
        "Instead of trying to build one single, perfect classifier, an ensemble trains several simpler ones — often called \"weak learners\" because each one only needs to be a little better than a coin flip — and combines their outputs, commonly by majority vote for classification or by averaging for numeric predictions. Random forests, gradient boosting, and AdaBoost are all ensemble methods; they differ mainly in how they train their individual models and how they combine the results.",
      whyMatters:
        "Ensembles are one of the most reliable ways to boost accuracy in classical machine learning without needing more data or a fundamentally smarter algorithm — they're often the first thing practitioners reach for when a single model plateaus.",
      realWorldExample:
        "It's the same reasoning behind asking several doctors for a second and third opinion instead of trusting one diagnosis — if their mistakes tend to be different rather than the same, agreement across a few of them is more trustworthy than any single opinion.",
      relatedTerms: ["what-is-majority-vote", "what-is-random-forest"],
      expandedByDefault: true,
    },
    {
      id: "what-is-random-forest",
      term: "What's a Random Forest?",
      emoji: "🌲",
      shortDef:
        "A random forest is an ensemble of many decision trees, each trained slightly differently, that predicts by majority vote across all of them.",
      longDef:
        "Each tree in a random forest is trained on a random resample of the training rows (bagging) and is only allowed to consider a random subset of features at each split. That double dose of randomness makes the individual trees genuinely different from one another, so their mistakes tend not to overlap — which is exactly what makes the majority vote across them more accurate than any single tree.",
      whyMatters:
        "Random forests are one of the most widely used classical ML algorithms in practice — they're accurate, hard to overfit compared to a single deep tree, and require very little tuning to get solid results.",
      realWorldExample:
        "Picture 100 different people each independently sketching a rough map of a city from memory, each one slightly wrong in different places. Overlaying all 100 sketches and going with whatever most of them agree on tends to produce a far more accurate map than any single person's sketch.",
      relatedTerms: ["what-is-ensemble", "what-is-majority-vote"],
    },
    {
      id: "what-is-majority-vote",
      term: "What's Majority Vote?",
      emoji: "🗳️",
      shortDef:
        "Majority vote means going with whatever answer the most individual models agreed on.",
      longDef:
        "Given a list of predictions from several classifiers on the same example — like [0, 1, 1] — majority vote counts how many predicted each class and returns whichever class got more votes. With three voters, any two agreeing is enough to win, even if the third disagrees entirely.",
      whyMatters:
        "It's the combining step that turns a pile of individually-imperfect models into one classifier that's usually more accurate than any single member — the entire payoff of an ensemble depends on this step, not just on having many models.",
      realWorldExample:
        "It's exactly how a panel of judges scores a competition: no single judge's opinion decides the outcome, but the group's combined verdict tends to be fairer and more consistent than trusting any one judge alone.",
      relatedTerms: ["what-is-ensemble"],
    },
  ],
};

export default content;
