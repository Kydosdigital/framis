import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 4,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "Same average, totally different wobble: standard deviation",
  minutes: 20,
  concept:
    "Two datasets can have the exact same mean and still look completely different — one tightly clustered around that average, the other scattered wildly above and below it. Standard deviation is the number that captures this \"wobble\": roughly speaking, how far a typical value sits from the mean. Getting there starts with variance: for each value, subtract the mean to get its difference, then square that difference — squaring is the trick that turns every negative difference positive, so values below the mean and values above it don't cancel each other out to a misleading zero. Average all of those squared differences and you get the variance; standard deviation is just the square root of the variance, which brings the units back to something you can compare directly against the original data (since squaring a difference in milliseconds gives you \"squared milliseconds,\" which nobody can picture). We can't compute a square root directly here, but that's fine — the variance alone already tells you which of two datasets is more spread out, and you can reason about standard deviation as \"roughly the square root of this number.\"",
  conceptSimpler:
    "Picture two archers with the same average distance from the bullseye — one's arrows are all clustered tightly near that average, the other's are scattered all over the target. Standard deviation is the number that tells you which archer is consistent and which one is all over the place.",
  vizStages: [
    {
      label: "1. Two datasets, identical mean",
      body:
        "Set A: [8, 9, 10, 11, 12]. Set B: [2, 6, 10, 14, 18]. Sum each with a loop and divide by the count — both come out to a mean of exactly 10, even though B is visibly more spread out.",
      code:
        'a = [8, 9, 10, 11, 12]\nb = [2, 6, 10, 14, 18]\n\ntotal = 0\nfor x in a:\n    total = total + x\nmean_a = total / len(a)\nprint(mean_a)\n\n# 10 - and set b also averages to 10',
    },
    {
      label: "2. Plain differences from the mean always sum to zero",
      body:
        "Subtract the mean from every value in set A: -2, -1, 0, 1, 2. Add those up and you get exactly 0 — the positive and negative differences always cancel perfectly, no matter how spread out the data is. That's why raw differences can't measure spread.",
      code:
        'total = 0\nfor x in a:\n    diff = x - mean_a\n    total = total + diff\nprint(total)\n\n# 0 - always zero, for any dataset, which is useless for measuring spread',
    },
    {
      label: "3. Squaring the differences fixes that",
      body:
        "Square each difference before adding it up: (-2)^2, (-1)^2, 0^2, 1^2, 2^2 becomes 4, 1, 0, 1, 4 — all positive, so they no longer cancel. Average them and you get the variance.",
      code:
        'sum_squared = 0\nfor x in a:\n    diff = x - mean_a\n    sum_squared = sum_squared + diff * diff\nvariance_a = sum_squared / len(a)\nprint(variance_a)\n\n# 2',
    },
    {
      label: "4. The wider dataset gets a much bigger variance",
      body:
        "Run the same calculation on set B: differences are -8, -4, 0, 4, 8; squared, they're 64, 16, 0, 16, 64, averaging to a variance of 32 — sixteen times bigger than set A's variance of 2. Standard deviation is the square root of each: roughly 1.4 for A, roughly 5.7 for B, meaning a typical value in B sits about four times farther from the mean than in A.",
      code:
        'sum_squared = 0\nfor x in b:\n    diff = x - mean_b\n    sum_squared = sum_squared + diff * diff\nvariance_b = sum_squared / len(b)\nprint(variance_b)\n\n# 32 - much wider spread than set a\'s variance of 2',
    },
  ],
  realWorldIntro:
    "This is why ML dashboards report standard deviation right alongside the average eval score: a model that scores consistently around 80% across test runs is far more trustworthy than one that swings between 60% and 100% while still averaging 80%, and standard deviation is the number that exposes that difference.",
  realWorldCode:
    'model_scores = [76, 78, 80, 82, 84]\n\ntotal = 0\nfor s in model_scores:\n    total = total + s\nmean = total / len(model_scores)\n\nsum_squared_diffs = 0\nfor s in model_scores:\n    diff = s - mean\n    sum_squared_diffs = sum_squared_diffs + diff * diff\n\nvariance = sum_squared_diffs / len(model_scores)\n\nprint(f"mean score: {mean}")\nprint(f"variance: {variance}")',
  sandbox: {
    kind: "code",
    challenge:
      "This variance calculator is squaring each difference incorrectly — fix it so it actually multiplies each difference by itself, instead of just doubling it, so the variance stops printing 0 for data that clearly has spread.",
    starterCode:
      'scores = [60, 70, 80, 90, 100]\n\ntotal = 0\nfor s in scores:\n    total = total + s\nmean = total / len(scores)\n\nsum_squared_diffs = 0\nfor s in scores:\n    diff = s - mean\n    squared = diff * 2\n    sum_squared_diffs = sum_squared_diffs + squared\n\nvariance = sum_squared_diffs / len(scores)\n\nprint(f"mean: {mean}")\nprint(f"variance: {variance}")',
  },
  quizQuestion:
    "Dataset A and dataset B both have a mean of 50. Dataset A has a variance of 4, and dataset B has a variance of 400. What does this tell you?",
  quizCode:
    "variance_a = 4\nvariance_b = 400\n# both datasets have a mean of 50",
  quizOptions: [
    {
      key: "a",
      label:
        "Dataset B's values are far more spread out around the mean than A's — since standard deviation is roughly the square root of variance, B's typical distance from 50 is about 20, versus about 2 for A",
      correct: true,
    },
    {
      key: "b",
      label:
        "Dataset B must have a higher mean than dataset A, since its variance is so much larger",
      correct: false,
    },
    {
      key: "c",
      label:
        "Variance only reflects how many data points are in a dataset, not how spread out the values are",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — variance (and its square root, standard deviation) measures spread around the mean, not the mean itself; a variance 100 times bigger means values in B typically sit roughly 10 times farther from 50 than values in A do.",
  quizFeedbackIncorrect:
    "Not quite — both datasets share the same mean of 50; variance says nothing about where the mean sits, only about how far the values typically stray from it, and B's much larger variance means its values are far more spread out.",
  takeaway:
    "Variance is the average of the squared differences from the mean — squaring keeps positive and negative differences from canceling out — and standard deviation is just its square root, back in the original units. Two datasets can share an identical mean and still tell very different stories about how consistent or scattered their values really are.",
};

export default content;
