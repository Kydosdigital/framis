import type { LessonData } from "../types";

const content: LessonData = {
  num: 14,
  orderIndex: 2,
  phaseLabel: "EMBEDDINGS + RAG",
  title: "Meaning as coordinates: how embeddings turn words into vectors",
  minutes: 20,
  concept:
    "An embedding is a list of numbers — a vector — assigned to a piece of text, where the numbers together stand in for its meaning. Real embedding models produce hundreds or thousands of these numbers per bit of text, learned automatically from patterns across huge amounts of writing, but the core idea shows up perfectly with just a handful of hand-picked numbers per word. Words with related meanings end up with similar vectors: \"cat\" and \"kitten\" land close together, while \"cat\" and \"car\" land far apart, even though they're spelled similarly. \"Similar\" here is a mathematical statement, not a vibe — comparing two vectors number by number, for example with a dot product, gives a higher score when the vectors share the same pattern of large and small values in the same positions. This is the piece that every semantic search, recommendation system, and retrieval step sits on top of: before you can find \"the most similar chunk of text,\" you first need a way to turn text into numbers where similar things actually land near each other.",
  conceptSimpler:
    "Imagine giving every word a spot on a map, but instead of latitude and longitude, the axes are things like \"animal-ness\" and \"size.\" Words with related meanings end up as neighboring dots on that map.",
  vizStages: [
    {
      label: "1. A vector is just a list of numbers",
      body:
        "Here each word gets 3 hand-picked numbers along made-up axes: [animal-ness, size, vehicle-ness]. \"cat\" scores high on animal-ness, medium on size, and zero on vehicle-ness.",
      code: 'cat = [8, 2, 0]\n# axes: [animal-ness, size, vehicle-ness]',
    },
    {
      label: "2. Similar meaning, similar numbers",
      body:
        "\"kitten\" and \"dog\" score high on animal-ness too, so their vectors sit close to cat's. \"car\" scores zero on animal-ness and high on vehicle-ness instead — its vector points in a totally different direction.",
      code: 'kitten = [7, 3, 0]\ndog    = [6, 2, 0]\ncar    = [0, 0, 9]',
    },
    {
      label: "3. Measuring closeness with a dot product",
      body:
        "A dot product multiplies each matching pair of numbers and adds the results. Vectors that are large in the same positions produce a big dot product; vectors pointing in unrelated directions produce a small one, near zero.",
      code:
        "def dot(a, b):\n    total = 0\n    for i in range(len(a)):\n        total = total + a[i] * b[i]\n    return total\n\nprint(dot(cat, kitten))\nprint(dot(cat, car))\n\n62\n0",
    },
    {
      label: "4. Real embeddings: same idea, far more numbers",
      body:
        "Production models like OpenAI's text-embedding-3 output over a thousand numbers per piece of text, and nobody hand-picks what each number means — the model learns them from patterns in language. But comparing two of those vectors uses the exact same dot-product-style math shown above.",
    },
  ],
  realWorldIntro:
    "Search engines, recommendation feeds, and the retrieval step of RAG all call an embedding model — like OpenAI's text-embedding-3-small — to turn any sentence into a vector, so \"search by meaning\" really just means \"find the nearest vectors.\"",
  realWorldCode:
    'embedding = embed_text("How do I reset my password?")\n# embedding is a list of 1536 numbers\nbest_match = most_similar(embedding, document_embeddings)',
  sandbox: {
    kind: "code",
    challenge:
      'Add a line that compares dot(vectors["cat"], vectors["kitten"]) to dot(vectors["cat"], vectors["car"]) and prints which word is more similar to "cat".',
    starterCode:
      'vectors = {"cat": [8, 2, 0], "kitten": [7, 3, 0], "dog": [6, 2, 0], "car": [0, 0, 9]}\n\ndef dot(a, b):\n    total = 0\n    for i in range(len(a)):\n        total = total + a[i] * b[i]\n    return total\n\nprint("cat . kitten =", dot(vectors["cat"], vectors["kitten"]))\nprint("cat . car =", dot(vectors["cat"], vectors["car"]))\nprint("cat . dog =", dot(vectors["cat"], vectors["dog"]))',
  },
  quizQuestion:
    "Given the vectors and dot function below, is b or c more similar to a?",
  quizCode:
    "a = [4, 0, 0]\nb = [3, 1, 0]\nc = [0, 0, 5]\n\ndef dot(x, y):\n    total = 0\n    for i in range(len(x)):\n        total = total + x[i] * y[i]\n    return total\n\nprint(dot(a, b))\nprint(dot(a, c))",
  quizOptions: [
    {
      key: "a",
      label: "b, because dot(a, b) is 12, higher than dot(a, c), which is 0",
      correct: true,
    },
    {
      key: "b",
      label: "c, because dot(a, c) equals 0, which counts as the strongest match",
      correct: false,
    },
    {
      key: "c",
      label: "They're equally similar, since a, b, and c are all 3-number vectors",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — dot(a, b) works out to 4*3 + 0*1 + 0*0 = 12, while dot(a, c) is 4*0 + 0*0 + 0*5 = 0. A higher dot product means the vectors share more of the same large-value positions, so b is the closer match.",
  quizFeedbackIncorrect:
    "Not quite — a higher dot product means more shared direction, not less. dot(a, b) comes out to 12 while dot(a, c) comes out to 0, so b is the vector that's actually similar to a, and c is essentially unrelated.",
  takeaway:
    "Embeddings turn meaning into numbers, and something like a dot product turns \"similar meaning\" into a comparable score. Every semantic search, recommendation system, and RAG retriever is built on exactly this idea — just with far more dimensions, learned automatically instead of hand-picked.",
};

export default content;
