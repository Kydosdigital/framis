import type { LessonData } from "../types";

const content: LessonData = {
  num: 23,
  orderIndex: 5,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "Attention is one ingredient: residuals, layer norm, feed-forward, and masking",
  minutes: 20,
  concept:
    "Everything in the last three lessons happens inside a single sublayer of a single transformer block, and a real transformer wraps that sublayer in a few more pieces of machinery that are just as essential, even though they don't get the same spotlight. First, a residual connection: the block doesn't replace a token's incoming vector with attention's output, it adds them together — output = input + attention(input) — so the original signal always survives even if a particular layer's attention doesn't have much useful to contribute, which makes very deep stacks of layers dramatically easier to train. Second, layer normalization: right after that addition, every vector gets rescaled so its values sit in a consistent, well-behaved range, which keeps numbers from exploding or shrinking to nothing as they flow through dozens of stacked layers. Third, a feed-forward sublayer: after attention (and its own residual connection and layer norm) comes a small two-layer network applied independently to each token's vector — attention is the only place tokens exchange information with each other, so the feed-forward step is where the model gets extra, purely per-token nonlinear processing on whatever attention just handed it, wrapped in its own residual connection and layer norm too. Stack several of these blocks and you get a transformer's encoder — but not every transformer stack works the same way. An encoder (used for understanding a whole input at once, like translating a finished sentence) lets every position attend to every other position, forward and backward, since the entire input is already available. A decoder (used for generating text one token at a time) can only be allowed to attend to positions at or before the current one, because at real generation time the tokens after the current one don't exist yet. That restriction is enforced with causal masking: before softmax runs, every score for a \"future\" position gets forced down to a number so negative that exp() of it rounds to essentially zero, so those positions receive zero attention weight no matter what their Query/Key dot product said. Without causal masking, a decoder being trained to predict the next word could technically cheat by peeking at the answer sitting right there later in the same training sequence.",
  conceptSimpler:
    "Think of a transformer block as a paragraph that gets edited by attention, but every edit is added as a note in the margin rather than overwriting the original (residual), the page gets re-leveled after every edit so it doesn't spiral out of control (layer norm), each sentence then gets its own independent proofread (feed-forward) — and if you're drafting the paragraph one sentence at a time, you're not allowed to peek at sentences you haven't written yet (causal masking).",
  vizStages: [
    {
      label: "1. Residual connections: never fully overwrite the input",
      body:
        "If a token's incoming vector is [4, 2] and attention's output for it is [-1, 3], the block doesn't just keep [-1, 3] — it adds the two together, so the sublayer only has to learn a useful adjustment on top of what was already there, not reinvent the whole vector from scratch.",
      code: "input = [4, 2]\nattention_output = [-1, 3]\nblock_output = input + attention_output = [3, 5]",
    },
    {
      label: "2. Layer norm: keeping numbers from spiraling",
      body:
        "Stack enough layers without any correction and vectors can drift toward huge or tiny numbers purely from repeated addition, which makes training unstable. Layer norm re-centers and re-scales each vector right after the residual addition, so every layer's output starts from a similar, predictable range before it heads into the next block.",
      code: "[3, 5]  --layer norm-->  re-centered, re-scaled version of [3, 5]\n(the shape survives; the raw scale gets standardized)",
    },
    {
      label: "3. The feed-forward sublayer: per-token, not per-sentence",
      body:
        "Attention is the only place in a transformer block where tokens exchange information with each other. The feed-forward sublayer runs on each token's vector completely independently — it's extra nonlinear processing power, applied identically to every position, with no cross-token mixing at all.",
      code: "feed_forward(token_vector)  -- runs once per position, never looks at any other position",
    },
    {
      label: "4. Encoder vs. decoder, and the causal mask that separates them",
      body:
        "An encoder block lets every position see every other position — past and future — because the whole input is available at once (useful for tasks like translating an already-complete sentence). A decoder block masks out future positions before softmax, forcing each position to build its representation only from what came before it, which is what makes autoregressive text generation possible without cheating.",
      code:
        "encoder: position 2 can attend to positions 1, 2, 3, 4 (everything)\ndecoder: position 2 can only attend to positions 1, 2 (itself and the past)",
    },
  ],
  realWorldIntro:
    "GPT-style models are decoder-only: every block uses causal masking, which is exactly why they generate text left-to-right one token at a time. Models built for translation or classification often use an encoder (full visibility) whose output then feeds a decoder that generates the translated text with causal masking — the same attention math from this module, just wired up with a different masking rule depending on the job.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how a full transformer block fits together, and how causal masking changes which positions are allowed to see which.",
    stages: [
      {
        label: "The full block, in order",
        body:
          "A real transformer block runs: attention -> add the residual -> layer norm -> feed-forward -> add that residual too -> layer norm again. Everything from the last three lessons (Query/Key/Value, scaling, softmax, weighted sum) is just the \"attention\" box in this chain.",
        code:
          "x -> attention(x) -> add residual -> layer norm -> feed-forward -> add residual -> layer norm -> next block",
      },
      {
        label: "Residual connections in a deeper stack",
        body:
          "With 12, 24, or 96 stacked blocks (real model depths vary widely), residual connections give the original input a direct path all the way through the network. Even if one block's attention or feed-forward step learns something close to useless for a given token, that token's information isn't lost — it just passes through mostly unchanged.",
        code: "block_1_output = x + sublayer_1(x)\nblock_2_output = block_1_output + sublayer_2(block_1_output)\n...",
      },
      {
        label: "Encoder: full visibility",
        body:
          "In an encoder, position 2 (\"cat\" in \"the cat sat down\") can attend to every position in the sentence, including \"sat\" and \"down\" which come after it. This is fine because the encoder's job is to understand a complete input that's entirely available up front.",
        code:
          "sentence: the(1) cat(2) sat(3) down(4)\nposition 2 (\"cat\") attends to: 1, 2, 3, 4  -- everything, no restriction",
      },
      {
        label: "Decoder: causal masking blocks the future",
        body:
          "In a decoder generating that same sentence one word at a time, position 2 (\"cat\") is only allowed to attend to positions 1 and 2. Positions 3 and 4 get their attention scores forced down to a huge negative number before softmax, so softmax turns them into a weight of essentially 0 — as if they weren't there at all.",
        code:
          "sentence: the(1) cat(2) sat(3) down(4)\nposition 2 (\"cat\") attends to: 1, 2\nposition 2's scores toward 3, 4: forced to -infinity-equivalent  -->  softmax weight ~= 0",
      },
      {
        label: "Why this makes autoregressive generation honest",
        body:
          "During training, a decoder sees the whole sentence at once for efficiency, but causal masking makes sure position 2's prediction never actually uses information from positions 3 or 4 — the same restriction it will face later at real generation time, one token at a time, when those future tokens genuinely don't exist yet.",
        code: "training: predict word 3 using only words 1-2, even though word 3 is sitting right there in the batch",
      },
    ],
  },
  quizQuestion:
    "In a decoder generating text one token at a time, why must position 2 be prevented from attending to position 4, even during training when position 4's word is already sitting right there in the training sentence?",
  quizOptions: [
    {
      key: "a",
      label:
        "Causal masking forces those future-position scores down to essentially -infinity before softmax, giving them ~0 weight, so training matches the real constraint that future tokens don't exist yet at generation time",
      correct: true,
    },
    {
      key: "b",
      label: "It's a hardware limitation — GPUs can only process a fixed number of positions per attention head",
      correct: false,
    },
    {
      key: "c",
      label: "The encoder already removed those future tokens from the sequence before the decoder ever sees it",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — causal masking pushes the raw scores toward future positions down so far that softmax assigns them essentially zero weight, so the model is trained under the exact same information constraint it will face during real one-token-at-a-time generation.",
  quizFeedbackIncorrect:
    "Not quite — this isn't a hardware limit, and the encoder (when one exists at all) doesn't remove or alter the decoder's own sequence. The real reason is causal masking: it zeroes out attention to future positions before softmax so training never lets the model use information it wouldn't actually have yet during generation.",
  takeaway:
    "Attention is only one sublayer inside a transformer block — residual connections preserve the original signal, layer norm keeps the numbers well-behaved, a feed-forward step gives each token extra per-token processing, and causal masking is what turns a bidirectional encoder into an autoregressive decoder that can't peek at its own future output.",
  nextUpLabel: "Fine-tuning + Dataset Quality",
};

export default content;
