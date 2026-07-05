import type { LessonData } from "../types";

const content: LessonData = {
  num: 14,
  orderIndex: 2,
  phaseLabel: "EMBEDDINGS + RAG",
  title: "Meaning as coordinates: how embeddings turn words into vectors",
  minutes: 22,
  concept:
    "An embedding is a list of numbers — a vector — assigned to a piece of text, where the numbers together stand in for its meaning. Real embedding models produce hundreds or thousands of these numbers per bit of text, learned automatically from patterns across huge amounts of writing, but the core idea shows up perfectly with just a handful of hand-picked numbers per word. Words with related meanings end up with similar vectors: \"cat\" and \"kitten\" land close together, while \"cat\" and \"car\" land far apart, even though they're spelled similarly. \"Similar\" here is a mathematical statement, not a vibe — comparing two vectors number by number, for example with a dot product, gives a higher score when the vectors share the same pattern of large and small values in the same positions. But a raw dot product has a blind spot: a longer or more repetitive piece of text tends to produce a vector with bigger numbers across the board, and those bigger numbers inflate its dot product with almost anything, whether or not the two pieces of text are actually about the same thing. The fix is cosine similarity — the exact same dot product, divided by the length (magnitude) of each vector — which cancels out size and leaves only the angle between them, i.e. how aligned their direction is. This is the piece that every semantic search, recommendation system, and retrieval step sits on top of: before you can find \"the most similar chunk of text,\" you first need a way to turn text into numbers where similar things actually land near each other, and a way to compare them that isn't secretly just measuring which one is longer.",
  conceptSimpler:
    "Imagine giving every word a spot on a map, but instead of latitude and longitude, the axes are things like \"animal-ness\" and \"size.\" Words with related meanings end up as neighboring dots on that map. But a long-winded note can rack up a big raw score just by being wordy — dividing by each note's own length (that's cosine similarity) keeps the comparison fair, so it measures direction, not size.",
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
      label: "4. A raw dot product can be fooled by length",
      body:
        "dot() only adds up matching products — it has no idea whether a big total means \"genuinely similar\" or just \"a long, wordy vector.\" verbose_doc = [10, 10, 10] scores high on every axis, including vehicle-ness, which cat has nothing to do with. Even so, its raw dot product with cat (100) beats kitten's (62), even though kitten is obviously the closer match in direction. A longer or more repetitive chunk of text can produce bigger embedding numbers across the board, and a plain dot product rewards that size difference whether or not it reflects real similarity.",
      code:
        "verbose_doc = [10, 10, 10]\n# a long, rambling chunk that touches every axis a little, just by being wordy\n\nprint(dot(cat, kitten))\nprint(dot(cat, verbose_doc))\n\n62\n100",
    },
    {
      label: "5. Cosine similarity divides out the length",
      body:
        "The fix: divide the dot product by the magnitude (length) of each vector — magnitude is just the square root of a vector's dot product with itself. That division rescales every vector down to the same effective length first, so what's left measures only the angle between them — direction, not size. Once you correct for length, kitten (cosine ≈ 0.99) is clearly the closer match to cat, and verbose_doc (cosine ≈ 0.70) drops back down where it belongs, reversing what the raw dot product said.",
      code:
        "import math\n\ndef magnitude(v):\n    return math.sqrt(dot(v, v))\n\ndef cosine(a, b):\n    return dot(a, b) / (magnitude(a) * magnitude(b))\n\nprint(cosine(cat, kitten))\nprint(cosine(cat, verbose_doc))\n\n0.987\n0.7",
    },
    {
      label: "6. Real embeddings: same idea, far more numbers",
      body:
        "Production models like OpenAI's text-embedding-3 output over a thousand numbers per piece of text, and nobody hand-picks what each number means — the model learns them from patterns in language. But comparing two of those vectors uses the exact same math shown above: almost always cosine similarity, or a plain dot product against vectors the provider has already normalized to unit length, so the length bias never has a chance to sneak in.",
    },
  ],
  realWorldIntro:
    "Search engines, recommendation feeds, and the retrieval step of RAG all call an embedding model — like OpenAI's text-embedding-3-small — to turn any sentence into a vector. Almost all of them default to cosine similarity rather than a raw dot product, or store every embedding pre-normalized to unit length so an ordinary dot product already behaves like one — specifically to avoid the length bias a raw dot product has.",
  realWorldCode:
    'embedding = embed_text("How do I reset my password?")\n# embedding is a list of 1536 numbers\nbest_match = most_similar(embedding, document_embeddings, metric="cosine")',
  sandbox: {
    kind: "code",
    challenge:
      "Raw dot product says verbose_doc (100) is a closer match to cat than kitten (62) — but verbose_doc is just a long, rambling vector with big numbers everywhere. Add an if/else below the existing prints that compares cosine(cat, kitten) to cosine(cat, verbose_doc) and prints which one is genuinely the closer match once vector length is divided out. (Our mini sandbox has no math module, so sqrt_approx below stands in for math.sqrt using a few rounds of Newton's method.)",
    starterCode:
      'def dot(a, b):\n    total = 0\n    for i in range(len(a)):\n        total = total + a[i] * b[i]\n    return total\n\ndef sqrt_approx(n):\n    if n == 0:\n        return 0\n    guess = n\n    for i in range(20):\n        step = n / guess\n        sum_val = guess + step\n        guess = sum_val / 2\n    return guess\n\ndef magnitude(v):\n    return sqrt_approx(dot(v, v))\n\ndef cosine(a, b):\n    d = dot(a, b)\n    m = magnitude(a) * magnitude(b)\n    return d / m\n\ndef round3(x):\n    scaled = x * 1000\n    return int(scaled) / 1000\n\ncat = [8, 2, 0]\nkitten = [7, 3, 0]\nverbose_doc = [10, 10, 10]\n\nprint("raw dot product (bigger number wins, no correction for length):")\nprint("cat . kitten =", dot(cat, kitten))\nprint("cat . verbose_doc =", dot(cat, verbose_doc))\n\nprint("cosine similarity (corrected for length, 1.0 = same direction):")\nprint("cosine(cat, kitten) =", round3(cosine(cat, kitten)))\nprint("cosine(cat, verbose_doc) =", round3(cosine(cat, verbose_doc)))',
  },
  quizQuestion:
    "a = [5, 0, 0], b = [4, 1, 0], c = [6, 6, 6]. The code below shows dot(a, b) = 20 and dot(a, c) = 30, so the raw dot product says c is the closer match to a. Once you divide out each vector's length — cosine(a, b) ≈ 0.97, cosine(a, c) ≈ 0.58 — which one is actually more similar in direction to a?",
  quizCode:
    "a = [5, 0, 0]\nb = [4, 1, 0]\nc = [6, 6, 6]\n\ndef dot(x, y):\n    total = 0\n    for i in range(len(x)):\n        total = total + x[i] * y[i]\n    return total\n\nprint(dot(a, b))\nprint(dot(a, c))",
  quizOptions: [
    {
      key: "a",
      label: "c, because a higher raw dot product always means a better match, regardless of vector length",
      correct: false,
    },
    {
      key: "b",
      label:
        "b, because cosine similarity divides out each vector's magnitude — c's dot product was only bigger because c is a much longer vector, not because it points in a more similar direction",
      correct: true,
    },
    {
      key: "c",
      label: "They're equally similar, since both b and c share at least one large value with a",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — c = [6, 6, 6] has a bigger raw dot product with a purely because it's a much longer vector (magnitude ≈ 10.39, versus b's ≈ 4.12), not because it points in a more similar direction. Cosine similarity divides the dot product by both magnitudes, which is why cosine(a, b) ≈ 0.97 — nearly parallel — correctly beats cosine(a, c) ≈ 0.58, even though the raw dot product ranking said the opposite.",
  quizFeedbackIncorrect:
    "Not quite — dot(a, c) = 30 beats dot(a, b) = 20 only because c = [6, 6, 6] is a much longer vector; its direction is actually less aligned with a. Dividing out each vector's magnitude reveals cosine(a, b) ≈ 0.97 versus cosine(a, c) ≈ 0.58 — b is the real closer match, and this exact bias is why real embedding comparisons use cosine similarity, or pre-normalize every vector, instead of trusting a raw dot product.",
  takeaway:
    "Embeddings turn meaning into numbers, and cosine similarity — a dot product divided by both vectors' magnitudes — turns \"similar meaning\" into a comparable score that isn't skewed by how long or repetitive a piece of text happens to be. Every semantic search, recommendation system, and RAG retriever is built on exactly this idea — just with far more dimensions, learned automatically instead of hand-picked, and usually pre-normalized so the length bias never even comes up.",
};

export default content;
