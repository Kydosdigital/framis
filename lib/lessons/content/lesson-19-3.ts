import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 3,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "One attention pass isn't enough, so the model runs several at once",
  minutes: 20,
  concept:
    "A single attention calculation forces every word to blend its context into one weighted average, but sentences carry more than one kind of relationship at the same time — grammar, reference, tone, and topic all matter simultaneously. Multi-head attention solves this by running several attention calculations in parallel, called heads, each with its own learned set of weights, so each head is free to specialize in a different kind of pattern without the others interfering. One head might end up mostly tracking which words modify which nouns, another might track which pronoun refers to which entity, and another might pick up on emotional tone or emphasis — nobody assigns these roles by hand, they emerge because splitting the work into separate heads gives the model room to discover more than one useful pattern per layer. After all the heads finish, their separate outputs get concatenated back together and combined into a single representation, so the next layer receives the benefit of every head's perspective at once. Stacking many layers of multi-head attention is a big part of why transformers can capture such rich, layered relationships between words instead of just one flat notion of \"relatedness.\"",
  conceptSimpler:
    "It's like having several editors read the same paragraph at once — one checking grammar, one checking who \"he\" refers to, one checking tone — and then combining all their notes into a single set of feedback.",
  vizStages: [
    {
      label: "1. One attention pattern isn't enough",
      body:
        "If a model only had a single attention calculation, every word would have to compress grammar, reference, and tone into one blended score per relationship — a lot of nuance gets lost in that average.",
      code: "single head \"it\" -> trophy: 0.4, suitcase: 0.3, big: 0.2, ... (one blended signal)",
    },
    {
      label: "2. Split into several heads, each learning differently",
      body:
        "Multi-head attention runs multiple attention calculations side by side on the same sentence. Each head has its own learned weights, so each one is free to notice a different kind of pattern.",
      code: "head 1 (syntax), head 2 (reference), head 3 (sentiment)  — all computed in parallel",
    },
    {
      label: "3. Each head specializes without being told to",
      body:
        "Nothing forces head 2 to track reference — it's not programmed that way. It emerges from training, because having heads specialize turns out to reduce error more than having them all do the same thing.",
      code: "head 2 (\"reference\"): \"it\" -> trophy: 0.71, suitcase: 0.18, ...\nhead 1 (\"syntax\"):    \"it\" -> was: 0.55, too: 0.20, ...",
    },
    {
      label: "4. All heads combine into one representation",
      body:
        "After every head finishes, their outputs are concatenated and mixed back together into a single vector per word, so the next layer of the model gets the combined insight of every head at once.",
      code: "combined(\"it\") = merge(head1 output, head2 output, head3 output, ...)",
    },
  ],
  realWorldIntro:
    "This is why large models list a \"number of attention heads\" per layer in their architecture — GPT-style models commonly use a few dozen heads per layer, giving the network many simultaneous lenses on the same text rather than a single flattened view.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each head to see how the same sentence gets read differently depending on what that head has learned to focus on.",
    stages: [
      {
        label: "The sentence",
        body:
          "\"The reviewer said the movie was boring, but she still recommended it.\" This sentence has a pronoun (\"she\"), an object reference (\"it\"), and a tone shift (\"boring\" vs. \"recommended\") all at once — no single reading captures everything going on.",
        code: "\"The reviewer said the movie was boring, but she still recommended it.\"",
      },
      {
        label: "Head A — syntax / structure",
        body:
          "This head mostly tracks grammatical structure: which words are the subject and verb of each clause. \"Said\" attends strongly to \"reviewer\" (its subject) and \"recommended\" attends strongly to \"she\" (its subject), largely ignoring tone or reference questions.",
        code: "\"said\"        --> [reviewer: 0.58, the: 0.12, movie: 0.09, ...]\n\"recommended\" --> [she: 0.61, still: 0.14, it: 0.10, ...]",
      },
      {
        label: "Head B — reference / coreference",
        body:
          "This head specializes in tracking who or what pronouns point back to. \"She\" attends heavily to \"reviewer,\" and \"it\" attends heavily to \"movie\" — resolving both references correctly even though they're far apart in the sentence.",
        code: "\"she\" --> [reviewer: 0.67, movie: 0.08, boring: 0.05, ...]\n\"it\"  --> [movie: 0.72, boring: 0.09, reviewer: 0.06, ...]",
      },
      {
        label: "Head C — sentiment / contrast",
        body:
          "This head picks up on emotional tone and the contrast word \"but,\" linking \"boring\" and \"recommended\" together even though they're opposite in tone — that contrast is exactly what \"but\" signals.",
        code: "\"but\" --> [boring: 0.44, recommended: 0.39, still: 0.10, ...]\n\"boring\" --> [but: 0.35, recommended: 0.30, movie: 0.15, ...]",
      },
      {
        label: "All three, combined",
        body:
          "No single head captured the full sentence on its own. Together, structure, reference, and tone combine into one rich representation of what's actually being said — a mixed review, delivered anyway.",
        code: "combined understanding: reviewer disliked tone of movie, but recommended it regardless",
      },
    ],
  },
  quizQuestion:
    "Why does a transformer use multiple attention heads instead of one larger attention calculation?",
  quizOptions: [
    {
      key: "a",
      label:
        "Multiple heads let different heads specialize in different kinds of relationships (like grammar vs. reference vs. tone), which get combined afterward",
      correct: true,
    },
    {
      key: "b",
      label:
        "Each head processes a different sentence in the training data, so multiple heads just let the model train on more data per step",
      correct: false,
    },
    {
      key: "c",
      label:
        "Multiple heads exist purely to speed up computation on a GPU; they all learn the exact same attention pattern",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — each head has its own learned weights and can specialize in a different kind of pattern, and their outputs are combined so the model benefits from all of them at once.",
  quizFeedbackIncorrect:
    "Not quite — the heads all attend within the same sentence, not different data, and they don't learn identical patterns; the value of multiple heads is that they can each specialize differently.",
  takeaway:
    "Multi-head attention runs several independent attention patterns over the same sentence so grammar, reference, and tone can each get their own lens, then merges the results into one richer representation.",
};

export default content;
