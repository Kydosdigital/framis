import type { LessonData } from "../types";

const content: LessonData = {
  num: 18,
  orderIndex: 1,
  phaseLabel: "LINEAR ALGEBRA BASICS",
  title: "Dot product: the one number that says 'these are alike'",
  minutes: 20,
  concept:
    "A vector is nothing exotic — it's just a list of numbers, like [9, 1, 0], where each position captures some measurable quality of the thing it represents (say, out of 10). The dot product takes two vectors of the same length, multiplies each pair of matching positions together, and adds up every one of those products into a single number. When two vectors point in a similar direction — their big numbers line up with big numbers, their near-zero numbers line up with near-zero numbers — those products stack up into a large positive total. When two vectors point in unrelated or opposite directions, the products are small, mixed in sign, or cancel out, so the total stays low. That single number is the entire mathematical trick behind embedding similarity: two pieces of text, images, or products get converted into vectors, and whichever pair has the higher dot product is treated as \"more similar.\"",
  conceptSimpler:
    "It's like comparing two shopping carts item by item and multiplying the quantities at each matching item — two carts full of the same stuff in similar amounts produce a huge running total, two carts with nothing in common barely add up to anything.",
  vizStages: [
    {
      label: "1. A vector is just a list",
      body:
        "Forget the word \"vector\" for a second — it's a plain list of numbers. Here, three made-up features (something like \"furriness,\" \"size,\" \"metal-ness\") describe \"cat\" and \"kitten\" as lists that look almost identical, while \"airplane\" looks nothing like either one.",
      code: "cat      = [9, 1, 0]\nkitten   = [8, 2, 0]\nairplane = [0, 1, 9]",
    },
    {
      label: "2. Multiply matching positions",
      body:
        "The dot product starts by multiplying position 0 with position 0, position 1 with position 1, and so on. Since there's no zip() in our mini-language, a for-loop over range(len(vec)) walks both lists in lockstep using the same index i.",
      code:
        "for i in range(len(cat)):\n    product = cat[i] * kitten[i]\n    print(product)\n# 9*8=72, 1*2=2, 0*0=0",
    },
    {
      label: "3. Add the products together",
      body:
        "A running total accumulates each of those per-position products. That final sum is the dot product — one number that summarizes how aligned the two vectors are.",
      code:
        "def dot_product(vec_a, vec_b):\n    total = 0\n    for i in range(len(vec_a)):\n        total = total + vec_a[i] * vec_b[i]\n    return total",
    },
    {
      label: "4. Higher total = more similar",
      body:
        "Run that same function on cat vs. kitten and cat vs. airplane, and the numbers tell the story on their own — no need to eyeball the raw lists once you have a single comparable score.",
      code:
        "print(dot_product(cat, kitten))    # 74 -> high, they're alike\nprint(dot_product(cat, airplane))  # 1  -> near zero, unrelated",
    },
  ],
  realWorldIntro:
    "This is exactly what a vector-search system does under the hood: it converts your search query into an embedding (a long vector, often hundreds of numbers), takes the dot product against every stored item's embedding, and returns whichever items scored highest — \"search by meaning\" is really just \"sort by dot product.\"",
  realWorldCode:
    "query_vec = embed(\"wireless mouse\")\nfor product in catalog:\n    score = dot_product(query_vec, product.embedding)\n    // the products with the highest score get shown first",
  sandbox: {
    kind: "code",
    challenge:
      "Write dot_product(vec_a, vec_b) with a for-loop over range(len(vec_a)), then use it to decide whether \"cat\" is more similar to \"kitten\" or to \"airplane.\"",
    starterCode:
      "def dot_product(vec_a, vec_b):\n    total = 0\n    for i in range(len(vec_a)):\n        total = total + vec_a[i] * vec_b[i]\n    return total\n\ncat = [9, 1, 0]\nkitten = [8, 2, 0]\nairplane = [0, 1, 9]\n\ncat_kitten = dot_product(cat, kitten)\ncat_airplane = dot_product(cat, airplane)\n\nprint(f\"cat vs kitten: {cat_kitten}\")\nprint(f\"cat vs airplane: {cat_airplane}\")\n\nif cat_kitten > cat_airplane:\n    print(\"cat is more similar to kitten\")\nelse:\n    print(\"cat is more similar to airplane\")",
  },
  quizQuestion:
    "vec_a and vec_b are identical vectors, while vec_c points in a completely unrelated direction. What should dot_product(vec_a, vec_b) look like compared to dot_product(vec_a, vec_c)?",
  quizCode:
    "vec_a = [1, 0, 1]\nvec_b = [1, 0, 1]\nvec_c = [0, 1, 0]\nprint(dot_product(vec_a, vec_b))\nprint(dot_product(vec_a, vec_c))",
  quizOptions: [
    {
      key: "a",
      label:
        "dot_product(vec_a, vec_b) will be higher — matching, aligned values multiply into large positive contributions, while vec_a and vec_c share no overlapping large values",
      correct: true,
    },
    {
      key: "b",
      label: "dot_product(vec_a, vec_b) will be lower, because multiplying identical numbers together cancels them out",
      correct: false,
    },
    {
      key: "c",
      label: "Both dot products will always be equal, since the dot product only depends on how many numbers are in each vector",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — identical vectors multiply their matching large values together at every position, stacking up a big total, while vec_a and vec_c have their large values in different positions, so those products stay near zero.",
  quizFeedbackIncorrect:
    "Not quite — multiplying identical values never cancels them out (it squares them, which is even larger), and the dot product very much depends on the actual numbers lining up, not just the vector length.",
  takeaway:
    "A dot product is just \"multiply matching positions, then add it all up\" — but that one loop is the entire foundation of how embedding search decides which results count as similar.",
  nextUpLabel: "Transformers + Attention",
};

export default content;
