import type { LessonData } from "../types";

const content: LessonData = {
  num: 23,
  orderIndex: 1,
  phaseLabel: "TRANSFORMERS + ATTENTION",
  title: "Order isn't free: telling the model what came first",
  minutes: 18,
  concept:
    "Over the next several lessons you'll learn how a transformer uses attention to let every word absorb information from every other word in a sentence. That mechanism has a blind spot worth fixing before we go any further: attention scores measure how relevant two tokens are to each other, not which one came first, so if a model only saw a pile of tokens with no notion of sequence, \"the dog bit the man\" and \"the man bit the dog\" would be built from exactly the same ingredients — same words, same set, same inputs to every score. Since those two sentences describe opposite events, a transformer needs a way to inject \"where in the sentence am I\" into every token before attention (or anything else) gets to run. Positional encoding is that fix: a pattern of numbers generated purely from a token's index in the sequence — position 1 gets one pattern, position 2 a different one, position 3 different again — added directly onto that token's own vector. Real transformers generate this pattern from sine and cosine waves at different frequencies (which gives useful mathematical properties for very long sequences), but the mechanism to internalize is simpler than the formula: whatever the exact pattern is, it gets added to the word's vector before anything else happens, so every later computation — including attention — automatically has access to both \"what is this token\" and \"where does it sit,\" with no special-cased logic for order bolted on afterward.",
  conceptSimpler:
    "It's like handing out numbered tickets to people in a line — without the tickets everyone looks like an interchangeable crowd, but with a ticket stapled to each person, you can finally tell who was first, second, and third.",
  vizStages: [
    {
      label: "1. A preview problem: relevance without order",
      body:
        "Attention, which you're about to learn starting in the next lesson, scores how relevant two tokens are to each other — left to itself, it has no way to know which token came first. Feed it the same set of words in any order and it would score them identically.",
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
        "Before attention (or anything else) runs, each token's vector gets a positional encoding added to it — a pattern of numbers generated from its index in the sequence. Position 1's pattern differs from position 2's, which differs from position 3's.",
      code:
        "token(\"dog\", position 2) = word_vector(\"dog\") + position_vector(2)\ntoken(\"dog\", position 5) = word_vector(\"dog\") + position_vector(5)  -- different!",
    },
    {
      label: "4. Now the same word carries different information by position",
      body:
        "\"Dog\" at position 2 (the subject, before \"bit\") and \"dog\" at position 5 (the object, after \"bit\") now arrive as distinguishable vectors, so whatever runs next — attention included — can tell the sentences apart.",
      code: "\"The dog bit the man\":   dog@2, bit@3, man@5\n\"The man bit the dog\":   man@2, bit@3, dog@5",
    },
  ],
  realWorldIntro:
    "This is exactly why models can tell \"turn left then right\" apart from \"turn right then left,\" and why longer context windows require extending or redesigning positional encoding schemes. It's also why this step has to happen first in this course: attention just consumes whatever vector arrives at its input, position baked in or not — it has no way to fix a missing position signal after the fact.",
  sandbox: {
    kind: "code",
    challenge:
      "Write add_vectors(vec_a, vec_b) and a position_pattern(position) function, then show that the exact same word produces a different vector depending on where it sits in the sentence.",
    starterCode:
      "def add_vectors(vec_a, vec_b):\n    result = []\n    for i in range(len(vec_a)):\n        result.append(vec_a[i] + vec_b[i])\n    return result\n\n# a simplified stand-in for the sine/cosine pattern real transformers use --\n# the real formula needs trig functions our sandbox doesn't have, but this\n# captures the same idea: a pattern that's different at every position.\ndef position_pattern(position):\n    return [position, position * 2, position * 3, position * 4]\n\nword_dog = [3, 5, 0, 0]\n\ntoken_dog_at_2 = add_vectors(word_dog, position_pattern(2))\ntoken_dog_at_5 = add_vectors(word_dog, position_pattern(5))\n\nprint(f\"'dog' alone:         {word_dog}\")\nprint(f\"'dog' at position 2: {token_dog_at_2}\")\nprint(f\"'dog' at position 5: {token_dog_at_5}\")\n\nif token_dog_at_2 == token_dog_at_5:\n    print(\"same vector regardless of position -- order would be invisible\")\nelse:\n    print(\"different vectors -- position is now baked into the representation\")",
  },
  quizQuestion:
    "word_cat = [4, 1, 0, 0] and position_pattern(3) returns [3, 6, 9, 12]. What does add_vectors(word_cat, position_pattern(3)) produce, and why does that matter?",
  quizCode:
    "word_cat = [4, 1, 0, 0]\npos_3 = position_pattern(3)\ntoken_cat_at_3 = add_vectors(word_cat, pos_3)\nprint(pos_3)\nprint(token_cat_at_3)",
  quizOptions: [
    {
      key: "a",
      label:
        "[7, 7, 9, 12] — each entry of the position pattern gets added to the matching entry of the word vector, so \"cat\" at position 3 is a distinguishable vector from \"cat\" anywhere else",
      correct: true,
    },
    {
      key: "b",
      label: "[12, 6, 0, 0] — the position pattern replaces the word vector's entries instead of adding to them",
      correct: false,
    },
    {
      key: "c",
      label: "[4, 1, 0, 0] — position information doesn't actually change the vector, it's tracked separately",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — 4+3, 1+6, 0+9, 0+12 gives [7, 7, 9, 12]. The position pattern is added entry-by-entry directly into the word's own vector, so the vector itself now carries positional information, not a separate side channel.",
  quizFeedbackIncorrect:
    "Not quite — positional encoding adds to the word vector rather than replacing or ignoring it: 4+3, 1+6, 0+9, 0+12 gives [7, 7, 9, 12], a vector that's now different from \"cat\" at any other position.",
  takeaway:
    "Positional encoding stamps each token with where it sits in the sequence before any other computation happens, which is exactly what the attention mechanism in the next lesson needs already baked in if it's going to have any hope of respecting word order.",
};

export default content;
