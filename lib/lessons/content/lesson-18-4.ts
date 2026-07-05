import type { LessonData } from "../types";

const content: LessonData = {
  num: 18,
  orderIndex: 4,
  phaseLabel: "LINEAR ALGEBRA BASICS",
  title: "Cosine similarity: comparing direction, not just magnitude",
  minutes: 20,
  concept:
    "The dot product has a blind spot: it conflates \"pointing the same way\" with \"being big.\" A vector that's simply longer — because it represents a longer document, a louder signal, or a more emphatic score — can rack up a bigger dot product even when it points in a less similar direction than a shorter vector that's actually aligned. Cosine similarity fixes this by dividing the dot product by the product of the two vectors' magnitudes, which cancels their lengths out entirely and leaves a pure measure of direction: a value of 1 means the vectors point exactly the same way, 0 means they're unrelated (perpendicular), and -1 means they point exactly opposite. You can spot the cleanest case without doing any division at all — if the dot product exactly equals magnitude(a) times magnitude(b), the cosine similarity is exactly 1, meaning the vectors are perfectly aligned (one is just a scaled-up or scaled-down copy of the other). That's why real embedding search almost always compares vectors with cosine similarity, or normalizes every vector to the same length before storing it, so a document doesn't win a search just because its embedding happens to be \"louder.\"",
  conceptSimpler:
    "It's the difference between asking \"who spent the most money at the store\" versus \"who bought the same kind of stuff\" — cosine similarity divides out the total spent so you're comparing taste, not budget.",
  vizStages: [
    {
      label: "1. Same direction, different length",
      body:
        "query = [3, 4] and aligned = [6, 8] point in exactly the same direction — aligned is just query with every entry doubled. Their dot product is 3×6 + 4×8 = 50.",
      code: "query = [3, 4]\naligned = [6, 8]\n# dot_product(query, aligned) = 3*6 + 4*8 = 50",
    },
    {
      label: "2. A different direction with a bigger raw score",
      body:
        "skewed = [5, 12] points in a noticeably different direction than query, yet its dot product is 3×5 + 4×12 = 63 — higher than aligned's 50. By raw dot product alone, skewed looks like the \"better match,\" even though it isn't the true direction match.",
      code: "query = [3, 4]\nskewed = [5, 12]\n# dot_product(query, skewed) = 3*5 + 4*12 = 63  -- bigger than 50!",
    },
    {
      label: "3. Divide out the magnitudes to see direction",
      body:
        "magnitude(query) is 5, magnitude(aligned) is 10, and magnitude(skewed) is 13. For aligned, the dot product (50) exactly equals 5 × 10 — a dead giveaway that cosine similarity is exactly 1, perfectly aligned. For skewed, the dot product (63) falls short of 5 × 13 = 65, so its cosine similarity is less than 1.",
      code:
        "print(50 == 5 * 10)   # True  -> aligned has cosine similarity exactly 1\nprint(63 < 5 * 13)    # True  -> skewed has cosine similarity less than 1",
    },
    {
      label: "4. Direction wins over raw size",
      body:
        "Once you divide out magnitude, the ranking flips back to the truth: aligned is the perfect direction match (cosine similarity 1), while skewed only looked better because it happened to be a longer vector. This is exactly why similarity search normalizes by magnitude instead of trusting the raw dot product.",
      code:
        "# raw dot product ranking: skewed (63) > aligned (50)\n# cosine similarity ranking: aligned (1) > skewed (63/65, less than 1)",
    },
  ],
  realWorldIntro:
    "Real documents and queries naturally produce embeddings of different magnitudes — a long, detail-heavy document can end up with a \"bigger\" vector than a short, precise one purely due to length, not relevance. Vector databases like Pinecone and pgvector let you choose \"cosine\" as the similarity metric specifically so search results are ranked by meaning (direction) instead of by which embedding happened to be the largest.",
  realWorldCode:
    "index = create_index(metric=\"cosine\")\n# under the hood, this is just:\n# cosine_similarity(a, b) = dot_product(a, b) / (magnitude(a) * magnitude(b))",
  sandbox: {
    kind: "code",
    challenge:
      "Compute dot products and magnitudes for query vs. two candidates, then use the equals/less-than comparison (no decimals needed) to reveal which candidate is truly more aligned in direction.",
    starterCode:
      "def dot_product(vec_a, vec_b):\n    total = 0\n    for i in range(len(vec_a)):\n        total = total + vec_a[i] * vec_b[i]\n    return total\n\ndef sum_of_squares(vec):\n    total = 0\n    for i in range(len(vec)):\n        total = total + vec[i] * vec[i]\n    return total\n\ndef magnitude(vec):\n    target = sum_of_squares(vec)\n    for guess in range(0, target + 1):\n        if guess * guess == target:\n            return guess\n    return -1\n\nquery = [3, 4]\naligned = [6, 8]\nskewed = [5, 12]\n\ndot_aligned = dot_product(query, aligned)\ndot_skewed = dot_product(query, skewed)\n\nproduct_aligned = magnitude(query) * magnitude(aligned)\nproduct_skewed = magnitude(query) * magnitude(skewed)\n\nprint(f\"dot(query, aligned) = {dot_aligned}, magnitude product = {product_aligned}\")\nprint(f\"dot(query, skewed) = {dot_skewed}, magnitude product = {product_skewed}\")\n\nif dot_aligned == product_aligned:\n    print(\"aligned points in exactly the same direction as query (cosine similarity = 1)\")\n\nif dot_skewed < product_skewed:\n    print(\"skewed points in a different direction than query (cosine similarity < 1)\")\n\nprint(f\"raw dot product alone says skewed ({dot_skewed}) beats aligned ({dot_aligned})\")\nprint(\"cosine similarity reveals aligned is the true direction match\")",
  },
  quizQuestion:
    "query = [3, 4], option_1 = [9, 12], option_2 = [8, 6]. Using dot_product and magnitude, which option is more cosine-similar to query, and how can you tell without computing a decimal?",
  quizCode:
    "query = [3, 4]\noption_1 = [9, 12]\noption_2 = [8, 6]\nprint(dot_product(query, option_1), magnitude(query) * magnitude(option_1))\nprint(dot_product(query, option_2), magnitude(query) * magnitude(option_2))",
  quizOptions: [
    {
      key: "a",
      label:
        "option_1 — its dot product (75) exactly equals magnitude(query) times magnitude(option_1) (5 × 15 = 75), which is only possible when cosine similarity is exactly 1",
      correct: true,
    },
    {
      key: "b",
      label: "option_2 — its dot product uses smaller numbers, so it must be the \"purer\" direction match",
      correct: false,
    },
    {
      key: "c",
      label: "They're equally similar, since both dot products are positive and every entry in every vector is positive",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — option_1 is literally query scaled by 3, so it points in exactly the same direction; the giveaway is that its dot product exactly matches magnitude(query) × magnitude(option_1) (75 = 5 × 15), which only happens at a cosine similarity of 1.",
  quizFeedbackIncorrect:
    "Not quite — smaller raw numbers don't imply better alignment, and both vectors having positive entries only means they're in the same general quadrant, not that they point the same way; option_2's dot product (48) falls short of its magnitude product (5 × 10 = 50), so its cosine similarity is less than 1.",
  takeaway:
    "Cosine similarity is a dot product with the vectors' lengths divided back out, so it measures whether two things point the same way instead of just whether they're both \"big\" — that's the fix that makes embedding search compare meaning, not size.",
};

export default content;
