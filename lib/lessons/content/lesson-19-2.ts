import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 2,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "Query, key, value: the question every word asks the sentence",
  minutes: 22,
  concept:
    "Take \"The trophy didn't fit in the suitcase because it was too big.\" The word \"it\" has no fixed meaning on its own — it could point to the trophy or the suitcase — so the model needs a way to let \"it\" gather information from whichever other words actually resolve the ambiguity. Attention does this by giving every token three different vectors, each built for a different job. The Query is what a token is looking for (\"it\" is looking for whatever explains what \"it\" refers to). The Key is what each token offers up for others to match against (\"trophy\" offers a key that effectively says \"I'm a physical object that can be big or small\"). The Value is the actual content a token contributes if it gets picked (the substance of \"trophy\" that should flow into \"it\"'s new representation). In a real transformer, all three come from the same input vector multiplied by three separate learned weight matrices — literally the matrix multiplication from the previous module, applied three times per token with three different matrices. A sandbox can't train real weight matrices, so here we'll hand-pick small toy Query/Key/Value vectors that stand in for what training would have produced, and then do the exact same arithmetic a transformer does: take \"it\"'s Query vector and compute its dot product against every other token's Key vector. That dot product is the raw attention score — a bigger number means the query and that key point in a more aligned direction, i.e. that token is more relevant to what \"it\" is looking for.",
  conceptSimpler:
    "It's like \"it\" holding up a question card (Query) and every other word holding up an answer card (Key) — whichever answer card lines up best with the question gets treated as most relevant, and that word's actual content (Value) is what eventually gets pulled in.",
  vizStages: [
    {
      label: "1. Three vectors, three jobs",
      body:
        "For our toy example, \"it\" gets a Query vector, and \"trophy,\" \"big,\" and \"suitcase\" each get a Key vector (their Value vectors come in a later lesson). These are small, hand-picked numbers standing in for what a trained model would produce — every entry is just a made-up feature, not a real learned weight.",
      code:
        "query_it     = [2, 1, 1, 0]\nkey_trophy   = [1, 1, 1, 0]\nkey_big      = [1, 1, 0, 1]\nkey_suitcase = [0, 1, 0, 0]",
    },
    {
      label: "2. The dot product turns \"alignment\" into a number",
      body:
        "Straight from Module 18: multiply matching positions, then add up the products. query_it dotted with key_trophy is (2×1) + (1×1) + (1×1) + (0×0) = 2 + 1 + 1 + 0 = 4.",
      code:
        "query_it   = [2, 1, 1, 0]\nkey_trophy = [1, 1, 1, 0]\n\nscore = 2*1 + 1*1 + 1*1 + 0*0\n# score = 4",
    },
    {
      label: "3. Every key gets scored the same way",
      body:
        "Run the same dot product against every candidate key. \"Trophy\" scores highest, \"big\" comes in second, and \"suitcase\" trails behind — these raw numbers are already ranking relevance correctly.",
      code:
        "it -> trophy   : dot_product([2,1,1,0], [1,1,1,0]) = 4\nit -> big      : dot_product([2,1,1,0], [1,1,0,1]) = 3\nit -> suitcase : dot_product([2,1,1,0], [0,1,0,0]) = 1",
    },
    {
      label: "4. Raw scores rank relevance, but they're not done yet",
      body:
        "4, 3, and 1 correctly say \"trophy matters most,\" but they're not a probability distribution — they don't sum to 1, they aren't bounded, and in a bigger real model they could easily be negative. The next lesson turns these raw scores into real attention weights.",
      code: "raw scores: trophy=4, big=3, suitcase=1  -- ranked correctly, not yet usable as weights",
    },
  ],
  realWorldIntro:
    "Every attention head in a model like GPT computes exactly this: three learned projections per token (Query, Key, Value), then a dot product between one token's query and every token's key — done all at once via matrix multiplication across thousands of tokens and dozens of dimensions per head, instead of one pair at a time like we just did by hand.",
  realWorldCode:
    "query_it = matrix_multiply(W_query, embedding_of(\"it\"))\nkey_trophy = matrix_multiply(W_key, embedding_of(\"trophy\"))\nscore = dot_product(query_it, key_trophy)  # same operation, real learned numbers",
  sandbox: {
    kind: "code",
    challenge:
      "Write dot_product(vec_a, vec_b), then use it to score how relevant \"trophy,\" \"big,\" and \"suitcase\" are to \"it\" by computing query_it's dot product against each of their toy Key vectors.",
    starterCode:
      "def dot_product(vec_a, vec_b):\n    total = 0\n    for i in range(len(vec_a)):\n        total = total + vec_a[i] * vec_b[i]\n    return total\n\nquery_it = [2, 1, 1, 0]\n\nkey_trophy = [1, 1, 1, 0]\nkey_big = [1, 1, 0, 1]\nkey_suitcase = [0, 1, 0, 0]\n\nscore_trophy = dot_product(query_it, key_trophy)\nscore_big = dot_product(query_it, key_big)\nscore_suitcase = dot_product(query_it, key_suitcase)\n\nprint(f\"raw score: it -> trophy   = {score_trophy}\")\nprint(f\"raw score: it -> big      = {score_big}\")\nprint(f\"raw score: it -> suitcase = {score_suitcase}\")",
  },
  quizQuestion:
    "Using query_it = [2, 1, 1, 0] and a new key for the word \"because\", key_because = [0, 0, 0, 1], what raw score does dot_product(query_it, key_because) produce?",
  quizCode:
    "query_it = [2, 1, 1, 0]\nkey_because = [0, 0, 0, 1]\nscore_because = dot_product(query_it, key_because)\nprint(score_because)",
  quizOptions: [
    {
      key: "a",
      label:
        "0 — every position where query_it has a nonzero value, key_because has a 0 (and vice versa), so every product in the dot product is 0",
      correct: true,
    },
    {
      key: "b",
      label: "4 — the score should match the highest score from the sentence regardless of which key is used",
      correct: false,
    },
    {
      key: "c",
      label: "2 — because dot products always return the number of dimensions the vectors share",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — (2×0) + (1×0) + (1×0) + (0×1) = 0. \"Because\" and \"it\" share no overlapping nonzero dimensions in this toy example, so the query and key don't align at all, and the raw score correctly comes out to zero relevance.",
  quizFeedbackIncorrect:
    "Not quite — walk through it position by position: (2×0) + (1×0) + (1×0) + (0×1) = 0. Every product is zero because query_it and key_because never have a nonzero value in the same position, so there's no alignment for the dot product to pick up.",
  takeaway:
    "Query, Key, and Value are three views of the same token built for three different jobs, and the dot product between a Query and a Key is the real arithmetic that measures how relevant one token is to another — the next lesson turns those raw scores into an actual probability distribution.",
};

export default content;
