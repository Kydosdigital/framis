import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 4,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "The payoff: attention weights become an actual answer",
  minutes: 22,
  concept:
    "Every step so far has been building toward one final move: using the attention weights to actually construct \"it\"'s new, context-aware representation. That construction is a weighted sum — multiply each token's Value vector by the attention weight \"it\" gave it, then add all of those scaled vectors together. Trophy earned the highest weight (about 0.55), so its Value vector contributes the most to the result; suitcase earned the lowest weight (about 0.12), so its Value vector barely moves the needle; big sits in between (about 0.33), pulling the output partway toward whatever \"big\" contributes. The output is a single new vector, the same size as any one Value vector, that blends mostly-trophy with a real but smaller dose of big and a faint trace of suitcase — this is the actual mathematical sense in which \"it\" now means \"mostly trophy, informed by context\" instead of nothing at all. This same three-step recipe — Query dot Key for raw scores, scale and softmax for weights, weighted sum of Values for the output — is exactly what a real transformer runs, except it runs it many times in parallel per layer, called heads, each with its own separately learned Query/Key/Value weight matrices. Nothing forces different heads to specialize, but because each head gets its own weights, one head often ends up tracking grammar, another tracking coreference, another tone — and their separate output vectors get concatenated and combined back into a single vector before moving on to whatever comes next in the block.",
  conceptSimpler:
    "Once you know how much attention each word deserves, you finally cash those percentages in — take that much of each word's actual content and blend it together, the way mixing paint by percentage gives you one final color instead of a list of ratios.",
  vizStages: [
    {
      label: "1. Multiply each Value by its weight",
      body:
        "Trophy's Value vector [8, 2, 0, 0] gets scaled by its weight, about 0.55; big's Value [0, 0, 4, 4] gets scaled by about 0.33; suitcase's Value [0, 8, 0, 0] gets scaled by about 0.12. Each scaled vector represents that word's \"fair share\" of the final answer.",
      code:
        "weighted_trophy   ~= 0.547 * [8, 2, 0, 0] = [4.37, 1.09, 0, 0]\nweighted_big      ~= 0.331 * [0, 0, 4, 4] = [0, 0, 1.33, 1.33]\nweighted_suitcase ~= 0.122 * [0, 8, 0, 0] = [0, 0.98, 0, 0]",
    },
    {
      label: "2. Add the scaled Values together",
      body:
        "Add all three scaled vectors entry by entry. Whatever comes out is the new vector attention hands back for \"it\" at this layer.",
      code:
        "output = weighted_trophy + weighted_big + weighted_suitcase\noutput ~= [4.37, 2.07, 1.33, 1.33]",
    },
    {
      label: "3. The result: \"it\" now means something concrete",
      body:
        "Look at the shape of that output vector: entries 0 and 1 come almost entirely from trophy (with a little suitcase mixed into entry 1), while entries 2 and 3 come entirely from big, since trophy and suitcase are both 0 there. \"It\"'s new representation is mostly trophy-shaped, but it carries a real, non-zero trace of \"big\" too — exactly the disambiguating clue that made trophy win in the first place.",
      code: "output entries 0-1 ~= trophy's signature   |   output entries 2-3 ~= entirely from big",
    },
    {
      label: "4. Real transformers do this several times at once: multi-head attention",
      body:
        "One attention calculation forces every relationship (grammar, reference, tone) to blend into a single score per pair of words. Multi-head attention runs several of these Query/Key/Value pipelines in parallel, each with its own learned weights, so one head can specialize in grammar, another in coreference, another in tone — nobody assigns these roles by hand, they emerge because splitting the work gives the model room to discover more than one useful pattern per layer.",
      code:
        "head 1 (syntax):    \"it\" -> was: 0.55, too: 0.20, ...\nhead 2 (reference):  \"it\" -> trophy: 0.71, suitcase: 0.18, ...\ncombined(\"it\") = merge(head 1 output, head 2 output, ...)",
    },
  ],
  realWorldIntro:
    "A model like GPT runs this whole pipeline — Query dot Key, scale and softmax, weighted sum of Values — across dozens of heads per layer and dozens of stacked layers, which is how a single token's vector accumulates such a rich, context-dependent representation by the time it reaches the output.",
  realWorldCode:
    "for head in attention_heads:\n    scores = scale_and_softmax(dot_product(head.query, head.keys))\n    head_output = weighted_sum(scores, head.values)\noutput = combine(all_head_outputs)  # concatenate + project back to one vector",
  sandbox: {
    kind: "code",
    challenge:
      "Compute the real attention weights with exp_approx, then use them to compute the weighted sum of the Value vectors for trophy, big, and suitcase — the final output vector for \"it.\"",
    starterCode:
      "def exp_approx(x):\n    result = 1\n    term = 1\n    for i in range(1, 20):\n        term = term * x / i\n        result = result + term\n    return result\n\ndef scale_vector(vec, w):\n    result = []\n    for i in range(len(vec)):\n        result.append(vec[i] * w)\n    return result\n\ndef add_vectors(vec_a, vec_b):\n    result = []\n    for i in range(len(vec_a)):\n        result.append(vec_a[i] + vec_b[i])\n    return result\n\n# scaled scores from the previous lesson (raw scores 4, 3, 1 divided by sqrt(4) = 2)\nscaled_trophy = 2\nscaled_big = 1.5\nscaled_suitcase = 0.5\n\nexp_trophy = exp_approx(scaled_trophy)\nexp_big = exp_approx(scaled_big)\nexp_suitcase = exp_approx(scaled_suitcase)\ntotal = exp_trophy + exp_big + exp_suitcase\n\nweight_trophy = exp_trophy / total\nweight_big = exp_big / total\nweight_suitcase = exp_suitcase / total\n\nprint(f\"attention weights: trophy={weight_trophy}, big={weight_big}, suitcase={weight_suitcase}\")\n\nvalue_trophy = [8, 2, 0, 0]\nvalue_big = [0, 0, 4, 4]\nvalue_suitcase = [0, 8, 0, 0]\n\nweighted_trophy = scale_vector(value_trophy, weight_trophy)\nweighted_big = scale_vector(value_big, weight_big)\nweighted_suitcase = scale_vector(value_suitcase, weight_suitcase)\n\noutput = add_vectors(add_vectors(weighted_trophy, weighted_big), weighted_suitcase)\n\nprint(f\"weighted trophy value:   {weighted_trophy}\")\nprint(f\"weighted big value:      {weighted_big}\")\nprint(f\"weighted suitcase value: {weighted_suitcase}\")\nprint(f\"final output vector for 'it': {output}\")",
  },
  quizQuestion:
    "value_trophy and value_suitcase are both 0 in their last two entries, while value_big = [0, 0, 4, 4]. Which word's Value vector is entirely responsible for the last two entries of the final output, and roughly what value should they be?",
  quizCode:
    "value_big = [0, 0, 4, 4]\nweight_big = 0.331  # approx\nweighted_big = scale_vector(value_big, weight_big)\nprint(weighted_big)",
  quizOptions: [
    {
      key: "a",
      label:
        "\"Big\" — since trophy and suitcase contribute 0 in those positions, the last two output entries are entirely 0.331 × 4, or roughly 1.33 each",
      correct: true,
    },
    {
      key: "b",
      label: "\"Trophy\" — because it has the highest attention weight overall, it must dominate every entry of the output",
      correct: false,
    },
    {
      key: "c",
      label: "\"Suitcase\" — the lowest-weighted word always ends up controlling the final two dimensions",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — having the highest overall weight doesn't mean a word controls every entry; it only contributes where its own Value vector is nonzero. Since value_trophy and value_suitcase are both 0 in the last two slots, only value_big's 4s (scaled by ~0.331) land there, giving roughly 1.33 in each.",
  quizFeedbackIncorrect:
    "Not quite — a word's overall attention weight doesn't override the actual entries of its Value vector. Trophy and suitcase are both 0 in the last two positions, so only big's [4, 4], scaled by its weight (~0.331), can produce a nonzero result there — about 1.33 in each slot.",
  takeaway:
    "The weighted sum of Value vectors is where attention weights stop being abstract percentages and start being an actual new vector — and real transformers repeat this whole process across many parallel heads so different kinds of relationships can be captured at once.",
};

export default content;
