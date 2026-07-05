import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 2,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "The model never sees a word — it sees pieces of one",
  minutes: 18,
  concept:
    "Before a transformer can pay attention to anything, the raw text has to be chopped into tokens — small chunks, each mapped to a number the model actually computes with. Tokenizers don't usually split on whole words; they split on frequently-occurring chunks of characters, so common words like \"the\" or \"cat\" often become a single token, while rarer or longer words get broken into a few sub-word pieces. This is why a made-up or unusual word like \"unbelievably\" might come back as three tokens — \"un\", \"believ\", and \"ably\" — instead of one: the tokenizer never learned \"unbelievably\" as its own chunk, but it did learn those smaller pieces from thousands of other words that share them. Spaces, punctuation, and even capitalization can each nudge a word into a different token or set of tokens, which is why \"Hello\" and \" hello\" (with a leading space) are frequently two entirely different token IDs to the model. Everything downstream — attention, positional encoding, every layer of the network — operates on this list of token IDs, not on the letters or words a human would recognize.",
  conceptSimpler:
    "It's like a shipping company that only has boxes in a few standard sizes — a large item gets packed whole, but an oddly-shaped one gets broken into several boxes that fit the sizes on hand.",
  vizStages: [
    {
      label: "1. Text starts as plain characters",
      body:
        "Before tokenization, a sentence is just a string of characters to the computer — no notion of \"words\" the model can compute with yet.",
      code: "raw text: \"I can't believe how unbelievably fast that was!\"",
    },
    {
      label: "2. The tokenizer chops it into learned chunks",
      body:
        "A tokenizer that was trained on huge amounts of text has a fixed vocabulary of common chunks. It greedily matches the longest chunks it recognizes, splitting whatever's left over into smaller pieces.",
      code: "\"I\", \" can\", \"'t\", \" believe\", \" how\", \" un\", \"believ\", \"ably\", \" fast\", \" that\", \" was\", \"!\"",
    },
    {
      label: "3. Each chunk becomes a number",
      body:
        "Every chunk in the tokenizer's vocabulary has a fixed ID. The sentence is now a list of integers — this is the actual input the model's math operates on.",
      code: "tokens:  [\"I\", \" can\", \"'t\", \" believe\", \" how\", \" un\", \"believ\", \"ably\", ...]\nIDs:     [   40,   460,     83,    1975,        995,     555,      6667,   4270, ...]",
    },
    {
      label: "4. Common words survive whole, rare words get split",
      body:
        "\"believe\" is common enough to be its own token, but \"unbelievably\" isn't — it gets carved into pieces the tokenizer does recognize. The model reconstructs the meaning of the whole word from how those pieces attend to each other.",
      code: "\"believe\"      -> 1 token\n\"unbelievably\" -> 3 tokens: \"un\" + \"believ\" + \"ably\"",
    },
  ],
  realWorldIntro:
    "Every limit you've heard about with LLMs — context window size, cost per request, why typos or rare jargon sometimes confuse a model — traces back to tokenization, since models are billed and bounded by token count, not word or character count.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each example to see how the same tokenizer handles common words, tricky ones, and a made-up word differently.",
    stages: [
      {
        label: "A short, common sentence",
        body:
          "\"The cat sat on the mat.\" is made almost entirely of frequent words, so the tokenizer barely has to split anything — nearly every word is its own token.",
        code: "\"The\", \" cat\", \" sat\", \" on\", \" the\", \" mat\", \".\"\n-> 7 tokens for 6 words",
      },
      {
        label: "\"Unbelievable\" gets carved up",
        body:
          "\"Unbelievable\" isn't common enough to earn its own slot in the vocabulary, so it splits into pieces the tokenizer does know — a prefix, a root, and a suffix.",
        code: "\"un\" + \"believ\" + \"able\"\n-> 3 tokens for 1 word",
      },
      {
        label: "A made-up word: \"blorptastic\"",
        body:
          "A word that's never appeared in any training text still gets tokenized — the tokenizer has no choice but to fall back to small, familiar fragments, sometimes down to individual letters.",
        code: "\"bl\" + \"orp\" + \"tastic\"\n-> 3 tokens, none of which mean anything alone",
      },
      {
        label: "Leading spaces change the token",
        body:
          "Most modern tokenizers bake the leading space into the token itself, so a word at the start of a sentence and the same word mid-sentence can map to two completely different token IDs.",
        code: "\"Hello world\" -> [\"Hello\", \" world\"]\ntoken for \"Hello\" (id 15496) != token for \" Hello\" (id 18435)",
      },
      {
        label: "Numbers split in surprising ways",
        body:
          "Long numbers often get chopped into two- or three-digit chunks rather than staying whole, which is part of why models can be unreliable at exact arithmetic on large numbers — they're not seeing the number as one unit.",
        code: "\"48192\" -> [\"481\", \"92\"]  (or some other chunking, rarely one clean token)",
      },
    ],
  },
  quizQuestion:
    "Why does the word \"unbelievably\" typically get split into multiple tokens instead of staying as one?",
  quizOptions: [
    {
      key: "a",
      label:
        "The tokenizer's vocabulary is built from frequently-occurring chunks, and \"unbelievably\" isn't common enough to have earned its own single-token slot",
      correct: true,
    },
    {
      key: "b",
      label:
        "The model can only process words that are 8 letters or shorter, so anything longer is automatically split in half",
      correct: false,
    },
    {
      key: "c",
      label:
        "Tokenizers always split words at syllable boundaries, the same way a dictionary shows pronunciation",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — tokenizers learn their vocabulary from what chunks show up often in training text, and rarer or longer words get decomposed into smaller pieces that were common enough to make the cut.",
  quizFeedbackIncorrect:
    "Not quite — it isn't about letter count or syllables; it's about frequency. Tokenizers keep common chunks whole and fall back to smaller fragments for anything too rare to have its own token.",
  takeaway:
    "A transformer never reads words — it reads a sequence of learned sub-word chunks, and everything the model \"knows\" is built up from how those chunks combine, not from a human notion of what a word is.",
};

export default content;
