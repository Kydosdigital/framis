import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "\"It\" doesn't mean anything until it looks around",
  minutes: 20,
  concept:
    "Attention is how a transformer figures out what a word actually means in context, by letting every word look at every other word in the sentence and decide how much each one matters. Take \"The trophy didn't fit in the suitcase because it was too big.\" The word \"it\" has no meaning on its own — it could point to the trophy or the suitcase — so the model computes an attention weight from \"it\" to every other word, and those weights say how much \"trophy,\" \"suitcase,\" \"fit,\" and \"big\" should each contribute to building \"it\"'s meaning in this exact sentence. Because \"big\" is the word that disambiguates things (a big trophy doesn't fit in a small-ish suitcase), \"it\" ends up attending most strongly to \"trophy,\" and the model quietly resolves the reference without anyone hand-coding a grammar rule for it. Swap one word — \"because it was too small\" — and the same mechanism now sends \"it\"'s attention mostly toward \"suitcase\" instead, purely because the weights get recomputed from the new context. Every word in a transformer gets this treatment, not just pronouns, which is how the model builds a representation of each word that's shaped by its whole sentence rather than a fixed dictionary definition.",
  conceptSimpler:
    "It's like reading a sentence and unconsciously darting your eyes back to the word that clears up an ambiguous \"it\" — attention is the model doing that eye-dart, mathematically, for every word at once.",
  vizStages: [
    {
      label: "1. Words have no fixed meaning alone",
      body:
        "In the sentence \"The trophy didn't fit in the suitcase because it was too big,\" the word \"it\" is just a placeholder — it grammatically could refer to the trophy or the suitcase. Read in isolation, it resolves to nothing.",
      code: "sentence: The trophy didn't fit in the suitcase because it was too big\ntarget word: \"it\"  ->  refers to: ???",
    },
    {
      label: "2. Every word scores every other word",
      body:
        "The transformer computes an attention score from \"it\" to each other word in the sentence — a number for how relevant that word is to figuring out what \"it\" means here.",
      code: "\"it\" scoring every word:\n  trophy   -> 0.62\n  suitcase -> 0.19\n  fit      -> 0.08\n  big      -> 0.07\n  because  -> 0.02\n  ...",
    },
    {
      label: "3. The high-weight words win",
      body:
        "\"Trophy\" gets the largest share of \"it\"'s attention because \"big\" — a trophy being too big to fit is the sentence's whole logic — points back at it. The model blends mostly \"trophy\" into \"it\"'s meaning, with small contributions from the rest.",
      code: "\"it\" meaning ~= 0.62*(trophy) + 0.19*(suitcase) + 0.19*(everything else)",
    },
    {
      label: "4. Change one word, the weights flip",
      body:
        "Replace \"big\" with \"small\": \"...because it was too small.\" Now the logic reverses — something too small wouldn't be the reason it didn't fit — so attention recomputes and \"it\" swings toward \"suitcase\" instead. No rule was rewritten; the weights just responded to new context.",
      code: "new sentence ends in \"...it was too small\"\n\"it\" scoring every word:\n  suitcase -> 0.58\n  trophy   -> 0.21\n  small    -> 0.11\n  ...",
    },
  ],
  realWorldIntro:
    "This is exactly why LLMs can track pronouns, resolve ambiguity, and keep a coherent thread across a long paragraph — every token is constantly re-reading the whole context and reweighting what matters, instead of relying on a word's meaning being fixed in advance.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each word below to see which other words it attends to most strongly, and why.",
    stages: [
      {
        label: "\"Trophy\"",
        body:
          "\"Trophy\" mostly attends to \"fit\" and \"suitcase\" — those words define the situation it's part of (something that either does or doesn't fit inside something else). It doesn't need to attend to \"it\" or \"big\" much, since it's the noun being described, not the ambiguous one.",
        code: "trophy --> [fit: 0.41, suitcase: 0.33, didn't: 0.14, big: 0.07, it: 0.05]",
      },
      {
        label: "\"Suitcase\"",
        body:
          "\"Suitcase\" attends heavily to \"fit\" and \"trophy,\" the two things it's directly related to in the sentence's core claim, with a smaller pull toward \"big\" since size is what's at stake.",
        code: "suitcase --> [fit: 0.38, trophy: 0.30, big: 0.16, didn't: 0.10, it: 0.06]",
      },
      {
        label: "\"Fit\"",
        body:
          "\"Fit\" is the verb tying the trophy and suitcase together, so it spreads attention fairly evenly across both nouns plus \"didn't,\" since negation flips what \"fit\" means here.",
        code: "fit --> [trophy: 0.29, suitcase: 0.28, didn't: 0.24, it: 0.10, big: 0.09]",
      },
      {
        label: "\"It\"",
        body:
          "\"It\" is the pronoun with no meaning of its own, so it leans hardest on \"trophy\" — the noun that \"big\" logically points back to — while giving \"suitcase\" a smaller, hedged weight since it's still grammatically possible.",
        code: "it --> [trophy: 0.62, suitcase: 0.19, fit: 0.08, big: 0.07, because: 0.02, ...]",
      },
      {
        label: "\"Big\"",
        body:
          "\"Big\" attends most strongly back to \"it\" and \"trophy,\" because it's the adjective doing the disambiguating work — it's the reason the model can confidently resolve what \"it\" means at all.",
        code: "big --> [it: 0.45, trophy: 0.27, suitcase: 0.15, fit: 0.09, too: 0.04]",
      },
    ],
  },
  quizQuestion:
    "In \"The trophy didn't fit in the suitcase because it was too big,\" why does \"it\" attend most strongly to \"trophy\" rather than \"suitcase\"?",
  quizOptions: [
    {
      key: "a",
      label:
        "\"Trophy\" appears earlier in the sentence, and attention always weights earlier words more heavily",
      correct: false,
    },
    {
      key: "b",
      label:
        "The attention weights are computed from the whole context, and \"big\" as the reason something didn't fit makes \"trophy\" the word that best explains \"it\" here",
      correct: true,
    },
    {
      key: "c",
      label:
        "\"Trophy\" and \"it\" are the same part of speech, so the model always links matching parts of speech together",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Exactly — attention weights aren't based on word order or grammar category, they're recomputed from context, and here \"big\" is the clue that makes \"trophy\" the sensible referent for \"it.\"",
  quizFeedbackIncorrect:
    "Not quite — attention isn't driven by word position or matching parts of speech; it's driven by context, and \"big\" is what tips the weights toward \"trophy\" as the thing \"it\" refers to.",
  takeaway:
    "Attention lets a model rebuild each word's meaning from its surrounding context every time, which is why the same pronoun can resolve to different things in nearly identical sentences.",
  nextUpLabel: "Fine-tuning + Dataset Quality",
};

export default content;
