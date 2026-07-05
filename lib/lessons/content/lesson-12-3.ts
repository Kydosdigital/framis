import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 3,
  phaseLabel: "MODEL EVALUATION + CROSS-VALIDATION",
  title: "Overfitting vs. Underfitting: Reading the Gap",
  minutes: 20,
  concept:
    "A model that's too simple can't capture the real pattern in your data at all, so it does poorly on both the training data and the test data — that's underfitting, and it looks like uniformly high error everywhere. A model that's too complex can start memorizing quirks and noise specific to its training examples — quirks that don't hold up on new data — so its training error keeps dropping while its test error stalls out or gets worse; that's overfitting, and the tell is a growing gap between the two. The sweet spot is the complexity level where test error is lowest, right before that gap starts opening up. A learning curve is a plot of train error and test error across increasing model complexity (or increasing training data size), and the gap between the two lines at each point is the single most useful diagnostic in this whole module: small gap + high error on both = underfit, try a more complex model or better features; small train error + large gap = overfit, try a simpler model or more training data; small gap + low error on both = right where you want to be. One honesty note: real learning curves come from actually training many versions of a model at different complexity levels and measuring real error — that takes real data and real compute. Below, the train/test error numbers at each complexity level are toy stand-ins for what that real experiment would produce, chosen to demonstrate the shape of the curve you'd actually see.",
  conceptSimpler:
    "Underfitting is like someone who barely studied and gets every question wrong, on the practice test and the real one. Overfitting is like someone who memorized the exact practice questions and aces those, but bombs the real exam because they never actually learned the concept.",
  vizStages: [
    {
      label: "1. Error at six complexity levels (toy numbers)",
      body:
        "These stand in for what you'd get from actually training six versions of a model, from very simple (complexity 1) to very complex (complexity 6), and measuring error as a percentage on both a training set and a held-out test set.",
      code:
        "complexity = [1, 2, 3, 4, 5, 6]\ntrain_error = [42, 30, 20, 14, 9, 5]\ntest_error = [45, 32, 22, 18, 24, 33]\nprint(f\"levels to check: {complexity}\")",
    },
    {
      label: "2. Walk the curve, tracking the gap at each level",
      body:
        "gap = test_error - train_error. Watch what happens to it as complexity increases: it barely moves at first, then blows up.",
      code:
        "for i in range(len(complexity)):\n    c = complexity[i]\n    tr = train_error[i]\n    te = test_error[i]\n    gap = te - tr\n    print(f\"complexity {c}: train_error={tr} test_error={te} gap={gap}\")",
    },
    {
      label: "3. Underfitting: complexity 1–2",
      body:
        "Both errors are high (42/45, 30/32) and the gap is tiny (3, 2). The model isn't capturing the pattern well enough — but at least it's failing consistently on train and test alike, which is the underfitting signature.",
      code:
        "# complexity 1: train_error=42 test_error=45 gap=3\n# complexity 2: train_error=30 test_error=32 gap=2",
    },
    {
      label: "4. Overfitting: complexity 5–6",
      body:
        "Train error keeps falling (9, then 5) — the model is fitting its training data better and better. But test error rises (24, then 33) and the gap balloons (15, then 28). It's memorizing noise instead of learning something that generalizes.",
      code:
        "# complexity 5: train_error=9 test_error=24 gap=15\n# complexity 6: train_error=5 test_error=33 gap=28\n# the sweet spot is complexity 4 — lowest test_error, gap still modest",
    },
  ],
  realWorldIntro:
    "A real learning-curve experiment trains the same model architecture at increasing complexity (or the same complexity on increasing amounts of data) and plots both error curves — scikit-learn's learning_curve and validation_curve functions automate exactly this loop instead of you hardcoding six numbers by hand.",
  realWorldCode:
    "from sklearn.model_selection import validation_curve\n\ntrain_scores, test_scores = validation_curve(\n    estimator, X, y, param_name=\"max_depth\", param_range=[1, 2, 3, 4, 5, 6], cv=5\n)\n# train_scores and test_scores come back as real arrays of measured\n# error/accuracy at each complexity level, not hardcoded stand-ins",
  sandbox: {
    kind: "code",
    challenge:
      "Given toy train/test error at six complexity levels, compute the train-test gap at each level in a loop, then find and print the complexity level with the lowest test error — that's the sweet spot.",
    starterCode:
      "complexity = [1, 2, 3, 4, 5, 6]\ntrain_error = [42, 30, 20, 14, 9, 5]\ntest_error = [45, 32, 22, 18, 24, 33]\n\nbest_complexity = complexity[0]\nbest_test_error = test_error[0]\n\nfor i in range(len(complexity)):\n    c = complexity[i]\n    tr = train_error[i]\n    te = test_error[i]\n    gap = te - tr\n    print(f\"complexity {c}: train_error={tr} test_error={te} gap={gap}\")\n    if te < best_test_error:\n        best_test_error = te\n        best_complexity = c\n\nprint(f\"best complexity (lowest test error): {best_complexity}\")",
  },
  quizQuestion:
    "Model A has train error 38% and test error 40% (gap 2). Model B has train error 4% and test error 44% (gap 40). Which model is overfitting, and how can you tell from the gap?",
  quizCode:
    "model_a_train_error = 38\nmodel_a_test_error = 40\nmodel_a_gap = model_a_test_error - model_a_train_error\n\nmodel_b_train_error = 4\nmodel_b_test_error = 44\nmodel_b_gap = model_b_test_error - model_b_train_error\n\nprint(f\"model A: train={model_a_train_error} test={model_a_test_error} gap={model_a_gap}\")\nprint(f\"model B: train={model_b_train_error} test={model_b_test_error} gap={model_b_gap}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "Model B — its tiny 4% train error paired with a much larger 44% test error and a 40-point gap shows it memorized the training data instead of learning something that generalizes",
      correct: true,
    },
    {
      key: "b",
      label: "Model A — its test error (40%) is technically the higher of the two models' train errors, so it's worse",
      correct: false,
    },
    {
      key: "c",
      label: "Neither — Model A actually has the lower test error percentage-point count between train and test",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the gap is the tell. Model A's small gap (2 points) with both errors high means it's underfitting, not overfitting — it's failing consistently, not memorizing. Model B's tiny train error next to a much bigger test error (a 40-point gap) is the classic overfitting signature: it fit the training data closely, including quirks that don't hold up on new data, and that shows up as a test error even worse than Model A's.",
  quizFeedbackIncorrect:
    "Not quite — look at the gap between train and test error, not just the raw numbers in isolation. Model A's gap is only 2 points (38 vs. 40) — high error on both sides, which is underfitting. Model B's gap is 40 points (4 vs. 44) — a near-perfect train score paired with a much worse test score, which is the signature of overfitting.",
  takeaway:
    "The gap between train error and test error is the diagnostic, not either number alone. A small gap with high error on both sides means underfitting — the model's too simple. A tiny train error with a much bigger test error means overfitting — the model memorized noise. The sweet spot is the complexity level where test error is lowest, right before that gap starts opening up.",
  explainers: [
    {
      id: "what-is-overfitting",
      term: "What's Overfitting?",
      emoji: "🪞",
      shortDef:
        "When a model fits its training data so closely that it starts memorizing noise and quirks that don't hold up on new data.",
      longDef:
        "An overfit model has enough complexity to essentially memorize its training examples instead of learning the underlying pattern. Its training error looks fantastic, but that's misleading — it's not because the model understood something true about the data, it's because it fit every little wrinkle, including the ones that were just random noise. Test error is where an overfit model gets exposed.",
      whyMatters:
        "Overfitting is the single most common way a model looks great in development and then quietly fails in production — the training numbers everyone celebrated were never a reliable signal in the first place.",
      realWorldExample:
        "It's like someone who memorizes the answer key to last year's exact exam instead of learning the subject — they'll ace a copy of that exam, but a new one with different questions exposes that they never really learned the material.",
      relatedTerms: ["what-is-underfitting", "what-is-learning-curve"],
      expandedByDefault: true,
    },
    {
      id: "what-is-underfitting",
      term: "What's Underfitting?",
      emoji: "📉",
      shortDef:
        "When a model is too simple to capture the real pattern in the data, so it performs poorly everywhere — training data included.",
      longDef:
        "An underfit model hasn't been given enough capacity (or enough good features) to represent the actual relationship in the data. Unlike overfitting, there's no gap to point to — training error and test error are both bad, because the model genuinely hasn't learned the pattern anywhere, not even on the data right in front of it.",
      whyMatters:
        "Underfitting is the easier of the two problems to spot, precisely because there's no gap trick to it — if a model does poorly even on the data it trained on, it needs more capacity, better features, or both.",
      realWorldExample:
        "It's like trying to predict tomorrow's weather using only \"it's currently summer\" — that rule is too simple to capture what's really going on, so it does poorly no matter which day you test it on.",
      relatedTerms: ["what-is-overfitting", "what-is-learning-curve"],
    },
    {
      id: "what-is-learning-curve",
      term: "What's a Learning Curve?",
      emoji: "📈",
      shortDef:
        "A plot of train error and test error across increasing model complexity (or training data size) — the gap between the two lines is the diagnostic.",
      longDef:
        "A learning curve lets you see underfitting and overfitting as shapes instead of guessing from a single number. As complexity rises, train error steadily falls; test error falls too at first, then flattens and eventually rises again once the model starts overfitting. The point where test error is lowest — right before the lines diverge — is usually the complexity level you actually want to ship.",
      whyMatters:
        "A single accuracy number from one trained model tells you nothing about whether you're near the sweet spot or way past it. A learning curve across several complexity levels is what actually tells you which direction to adjust.",
      realWorldExample:
        "It's like tracking a runner's practice-lap times against race-day times as they train harder and harder — practice times keep improving, but if race times start getting worse, that's the signal they've overtrained for the wrong thing.",
      relatedTerms: ["what-is-overfitting", "what-is-underfitting"],
    },
  ],
};

export default content;
