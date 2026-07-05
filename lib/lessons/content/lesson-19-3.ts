import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 3,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "Raw scores aren't probabilities yet: scaling and softmax",
  minutes: 22,
  concept:
    "The raw scores from the last lesson — trophy: 4, big: 3, suitcase: 1 — already rank relevance correctly, but they're not usable as attention weights yet, for two related reasons. First, dot products grow with the number of dimensions being multiplied and summed: our toy 4-dimensional vectors produce modest scores, but real attention heads often use 64 or more dimensions per vector, so their raw dot products can land in the dozens or hundreds. Second, and more subtly, once scores get fed into softmax — the function that turns a list of numbers into a genuine probability distribution, one that's all positive and sums to exactly 1, via score -> exp(score) / sum of exp(all scores) — larger raw scores get pushed apart more aggressively, because exp() grows extremely fast for bigger inputs. Big enough raw scores make softmax nearly one-hot: one token gets almost all the weight and everyone else gets a weight so close to zero that, during training, the gradient flowing back through those near-zero connections vanishes and the model stops learning from them. The fix is to divide every score by the square root of d_k (the dimensionality of the Query/Key vectors) before softmax ever sees them — scaling scores down in proportion to how many dimensions produced them, so softmax stays in a range where every token still gets a meaningful, learnable gradient. Our sandbox has no exp() or sqrt() built in, so we build both from scratch: a whole-number square root by testing guesses (the same brute-force trick from the vector magnitude lesson in Module 18, since our toy d_k of 4 is a perfect square), and exp(x) from its own mathematical definition — the series 1 + x + x²/2! + x³/3! + ... converges to the real value of e^x, so a loop that adds up enough of those terms gives a genuine, if approximate, exponential, and from there a real softmax.",
  conceptSimpler:
    "It's like turning down the contrast on a photo before you compare it to others — raw scores already show which token matters more, but scaling (and the softmax that follows) is what keeps that contrast from blowing out into pure black-and-white before you've had a fair look.",
  vizStages: [
    {
      label: "1. Why divide by √d_k at all",
      body:
        "The more dimensions two vectors have, the more terms get added into their dot product, so scores naturally grow just from vector length, not from genuine relevance. Dividing every score by √d_k undoes that growth in a way that scales consistently regardless of how many dimensions a head uses.",
      code: "d_k = 4 (our toy dimension)   ->   scale = sqrt(4) = 2\nreal transformer d_k = 64     ->   scale = sqrt(64) = 8",
    },
    {
      label: "2. Softmax's real formula, and why we need our own exp()",
      body:
        "Real softmax is score -> exp(score) / sum of exp(all scores). Our mini-language has no exp() or math module, so we hand-build one from the Taylor series definition of e^x — a loop that keeps adding smaller and smaller terms until the sum is a very close approximation of the true value.",
      code:
        "def exp_approx(x):\n    result = 1\n    term = 1\n    for i in range(1, 20):\n        term = term * x / i\n        result = result + term\n    return result\n# this is a real approximation of e^x, not a simplified stand-in formula",
    },
    {
      label: "3. Unscaled vs. scaled: watch the distribution soften",
      body:
        "Run softmax on the raw scores (4, 3, 1) and trophy grabs about 70% of the weight, with suitcase down near 4%. Scale those same scores by √4 = 2 first (2, 1.5, 0.5), and trophy drops to about 55% while suitcase rises to about 12% — a softer, more balanced distribution.",
      code:
        "UNSCALED softmax: trophy=0.705, big=0.259, suitcase=0.035\nSCALED softmax:   trophy=0.547, big=0.331, suitcase=0.122",
    },
    {
      label: "4. Scaling doesn't change the ranking, just the sharpness",
      body:
        "Trophy still wins the most attention either way — scaling never flips which token matters most. What it changes is how extreme the gap is: without it, \"big\" and \"suitcase\" would get starved of almost any gradient signal during training; with it, they stay meaningfully in the mix.",
      code: "trophy > big > suitcase in both cases -- scaling changes the spread, not the winner",
    },
  ],
  realWorldIntro:
    "PyTorch's built-in scaled_dot_product_attention divides by exactly this — the square root of the Query/Key dimension — before softmax, for exactly this reason. Real models tend to pick d_k so the scale factor is a clean small number (64 dimensions per head is common, giving a scale of 8); our toy example uses d_k = 4 for the same reason, so √d_k comes out to a clean 2.",
  sandbox: {
    kind: "code",
    challenge:
      "Implement sqrt_whole(n) and exp_approx(x) from scratch, then use them to compute softmax on the raw attention scores both with and without scaling by √d_k, and compare the two weight distributions.",
    starterCode:
      "def sqrt_whole(n):\n    for guess in range(0, n + 1):\n        if guess * guess == n:\n            return guess\n    return -1\n\ndef exp_approx(x):\n    result = 1\n    term = 1\n    for i in range(1, 20):\n        term = term * x / i\n        result = result + term\n    return result\n\nd_k = 4\nscale = sqrt_whole(d_k)\nprint(f\"scale factor = sqrt({d_k}) = {scale}\")\n\nscore_trophy = 4\nscore_big = 3\nscore_suitcase = 1\n\n# softmax WITHOUT scaling\nexp_t_raw = exp_approx(score_trophy)\nexp_b_raw = exp_approx(score_big)\nexp_s_raw = exp_approx(score_suitcase)\ntotal_raw = exp_t_raw + exp_b_raw + exp_s_raw\nprint(f\"UNSCALED weights: trophy={exp_t_raw / total_raw}, big={exp_b_raw / total_raw}, suitcase={exp_s_raw / total_raw}\")\n\n# softmax WITH scaling\nscaled_trophy = score_trophy / scale\nscaled_big = score_big / scale\nscaled_suitcase = score_suitcase / scale\n\nexp_t = exp_approx(scaled_trophy)\nexp_b = exp_approx(scaled_big)\nexp_s = exp_approx(scaled_suitcase)\ntotal = exp_t + exp_b + exp_s\nprint(f\"SCALED weights:   trophy={exp_t / total}, big={exp_b / total}, suitcase={exp_s / total}\")",
  },
  quizQuestion:
    "If you skip the ÷√d_k step and run softmax directly on the raw scores (4, 3, 1), roughly what weight does \"trophy\" end up with, and why does that matter?",
  quizCode:
    "score_trophy = 4\nscore_big = 3\nscore_suitcase = 1\nexp_t = exp_approx(score_trophy)\nexp_b = exp_approx(score_big)\nexp_s = exp_approx(score_suitcase)\ntotal = exp_t + exp_b + exp_s\nprint(exp_t / total)",
  quizOptions: [
    {
      key: "a",
      label:
        "About 0.71 — noticeably more extreme than the ~0.55 you get after scaling, which is exactly the vanishing-gradient risk scaling is meant to prevent",
      correct: true,
    },
    {
      key: "b",
      label: "About 0.55 — scaling doesn't actually change softmax's output, it's a purely cosmetic step",
      correct: false,
    },
    {
      key: "c",
      label: "About 0.33 — softmax always splits weight evenly across however many scores it's given",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — unscaled softmax on (4, 3, 1) gives trophy about 70.5% of the weight, versus about 54.7% once the scores are scaled down by √d_k first. That extra sharpness is exactly what makes low-scoring tokens' gradients vanish once real models push dot products into much larger ranges.",
  quizFeedbackIncorrect:
    "Not quite — scaling absolutely changes softmax's output (it doesn't just relabel the same numbers), and softmax never splits weight evenly; it's driven entirely by how far apart the input scores are, and unscaled scores here push trophy up to about 70.5%, versus about 54.7% scaled.",
  takeaway:
    "Scaling by √d_k keeps dot products from ballooning as dimensionality grows, and softmax turns those tamed scores into a genuine probability distribution over which tokens matter — together they're what makes raw relevance scores usable and trainable.",
};

export default content;
