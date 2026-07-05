import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 4,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "Attention forgets order, so the model has to be told what came first",
  minutes: 18,
  concept:
    "Attention computes a weighted blend of every token in a sentence based on relevance, but that math has no built-in sense of sequence — if you fed it the same set of words in a shuffled order, attention alone would score them identically, because it treats the input as a bag of tokens rather than a line of them. That's a problem, since \"the dog bit the man\" and \"the man bit the dog\" contain the exact same words but mean opposite things. Positional encoding fixes this by adding information about each token's position directly into its representation before attention ever runs, typically as a pattern of values generated from the token's index in the sequence, so token 1 gets a different nudge than token 2, which gets a different nudge than token 3. Because that position information is baked into the vector each token carries, attention can now implicitly take order into account — a word's representation reflects both what it is and where it sits, so \"dog\" appearing before \"bit\" ends up meaning something different from \"dog\" appearing after it. Without this step, a transformer would be a powerful but order-blind machine, equally happy to make sense of a sentence and its randomly scrambled twin.",
  conceptSimpler:
    "It's like handing out numbered tickets to people in a line — without the tickets everyone looks like an interchangeable crowd, but with a ticket stapled to each person, you can finally tell who was first, second, and third.",
  vizStages: [
    {
      label: "1. Attention alone is order-blind",
      body:
        "Attention scores are based on how relevant two tokens are to each other, not on which one came first. Feed it the same words in any order and, on its own, it has no way to tell the difference.",
      code: "words: {dog, bit, man}  -- attention alone treats this as an unordered set",
    },
    {
      label: "2. But word order changes meaning completely",
      body:
        "\"The dog bit the man\" and \"the man bit the dog\" use identical words but describe opposite events. A model that ignored order would treat these as the same sentence.",
      code: "\"The dog bit the man.\"   != meaning   \"The man bit the dog.\"",
    },
    {
      label: "3. A position signal gets added to each token",
      body:
        "Before attention runs, each token's vector gets a positional encoding added to it — a pattern of numbers generated from its index in the sequence. Position 1's pattern differs from position 2's, which differs from position 3's.",
      code: "token(\"dog\", position 2) = word_vector(\"dog\") + position_vector(2)\ntoken(\"dog\", position 5) = word_vector(\"dog\") + position_vector(5)  -- different!",
    },
    {
      label: "4. Now the same word carries different information by position",
      body:
        "\"Dog\" at position 2 (the subject, before \"bit\") and \"dog\" at position 5 (the object, after \"bit\") now arrive at attention as distinguishable vectors, so the model can tell the sentences apart.",
      code: "\"The dog bit the man\":   dog@2, bit@3, man@5\n\"The man bit the dog\":   man@2, bit@3, dog@5",
    },
  ],
  realWorldIntro:
    "This is exactly why models can tell \"turn left then right\" apart from \"turn right then left,\" and why longer context windows require extending or redesigning positional encoding schemes — the model's whole sense of sequence rides on this one addition.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each reordering of the same five words to see how position changes what the sentence actually means.",
    stages: [
      {
        label: "Original order",
        body:
          "\"The dog bit the man.\" Position tells us \"dog\" comes before the verb, making it the one who did the biting, and \"man\" comes after, making him the one who got bitten.",
        code: "position: 1     2    3   4    5\nword:     The   dog  bit the  man\nmeaning: dog is the biter, man is bitten",
      },
      {
        label: "Swap the noun positions",
        body:
          "\"The man bit the dog.\" Same five words, but now \"man\" sits in the biter's position and \"dog\" sits in the bitten position — the entire event reverses purely because of where each word landed.",
        code: "position: 1     2    3   4    5\nword:     The   man  bit the  dog\nmeaning: man is the biter, dog is bitten",
      },
      {
        label: "A question, from reordering alone",
        body:
          "\"Did the dog bite the man?\" Moving a word to the very front and adjusting structure turns a statement into a question — position near the start of a sequence carries a lot of grammatical weight.",
        code: "position: 1    2   3    4    5   6\nword:     Did  the dog  bite the man\nmeaning: this is now a yes/no question",
      },
      {
        label: "Scrambled beyond grammar",
        body:
          "\"Bit man dog the the.\" With no coherent position pattern left to lean on, the words no longer form a clear event at all — this is roughly what a transformer without positional encoding would effectively be reasoning over: relevance without order.",
        code: "position: 1   2   3    4   5\nword:     Bit man dog  the the\nmeaning: unclear -- no reliable subject or object",
      },
      {
        label: "Position interacting with a longer sentence",
        body:
          "\"After the man teased it, the dog bit him.\" Here \"it\" and \"him\" both need position information to resolve correctly — position doesn't just mark word order, it's part of how the model figures out which earlier noun each pronoun is standing in for.",
        code: "position: 1     2   3   4     5    6   7    8   9   10\nword:     After the man teased it,  the dog  bit him\nmeaning: \"it\" = dog (teased), \"him\" = man (bitten)",
      },
    ],
  },
  quizQuestion:
    "Without positional encoding, why would a transformer struggle to tell \"the dog bit the man\" apart from \"the man bit the dog\"?",
  quizOptions: [
    {
      key: "a",
      label:
        "Attention on its own scores relevance between tokens but has no built-in notion of sequence order, so it would treat both sentences as the same set of words",
      correct: true,
    },
    {
      key: "b",
      label:
        "The tokenizer would assign \"dog\" and \"man\" the exact same token ID in both sentences, making them indistinguishable before attention even runs",
      correct: false,
    },
    {
      key: "c",
      label:
        "Without positional encoding, the model can't compute attention scores at all, so it would fail to process the sentence entirely",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — attention scores relevance, not sequence, so without positional information both word orders would look identical to the mechanism computing them.",
  quizFeedbackIncorrect:
    "Not quite — the tokenizer still assigns distinct tokens fine, and attention would still run; the actual gap is that attention alone has no concept of order, so it can't tell the two orderings apart without positional encoding.",
  takeaway:
    "Attention scores relevance between tokens but is blind to sequence, so positional encoding injects order directly into each token's representation, making word order something the model can actually use.",
};

export default content;
