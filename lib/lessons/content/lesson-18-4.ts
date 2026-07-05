import type { LessonData } from "../types";

const content: LessonData = {
  num: 18,
  orderIndex: 4,
  phaseLabel: "EMBEDDINGS + RAG",
  title: "Finding a needle in a billion vectors: how vector databases search",
  minutes: 20,
  concept:
    "A vector database stores embeddings alongside their original text and metadata, and its whole job is answering one question fast: which stored vectors are closest to this query vector? Comparing the query to every single stored vector one at a time works fine for a few thousand chunks, but that brute-force scan gets too slow once a collection reaches millions or billions of entries. To avoid scanning everything, vector databases build approximate nearest neighbor (ANN) indexes — structures like HNSW, a layered graph connecting each vector to its nearby neighbors, or IVF, which pre-sorts vectors into clusters — so a search only has to inspect a small, promising subset instead of the whole collection. This is a deliberate tradeoff: ANN search might occasionally miss the single mathematically closest vector in exchange for search times that stay fast no matter how large the collection grows, and most systems expose a tuning knob to shift that tradeoff back toward more accuracy or more speed. Because retrieval quality depends on getting the right few chunks back quickly, the index type and its tuning directly shape both the speed and the quality of every RAG answer built on top of it.",
  conceptSimpler:
    "Brute-force search is like checking every house on Earth to find your friend's address by comparing it digit by digit. A vector database is more like a well-organized map with clearly marked neighborhoods — it jumps straight to the right neighborhood instead of checking every house.",
  vizStages: [
    {
      label: "1. Brute force: compare against everything",
      body:
        "The simplest possible search computes a similarity score between the query vector and every single stored vector, then keeps the best matches. It's exact, but the cost grows in direct proportion to the number of stored vectors.",
      code: "for doc in all_documents:      # 1,000,000 documents\n    score = dot(query_vector, doc.vector)\n# 1,000,000 comparisons, every single search",
    },
    {
      label: "2. ANN indexes skip most of the collection",
      body:
        "An approximate nearest neighbor (ANN) index pre-organizes vectors ahead of time so a search only has to touch a small fraction of them. HNSW builds a graph where each vector links to its nearby neighbors, and a search hops through a handful of well-chosen links instead of checking every vector.",
    },
    {
      label: "3. The speed/accuracy dial",
      body:
        "ANN search is called 'approximate' because it can occasionally miss the single closest vector in exchange for enormous speed gains. Tuning knobs like ef_search (HNSW) or nprobe (IVF) let you inspect more candidates for better accuracy, or fewer for more speed.",
    },
    {
      label: "4. A stored entry is more than just a vector",
      body:
        "Alongside each embedding, a vector database stores the original chunk of text and metadata like source, page, or user ID — and supports filtering that search, so a query can mean 'find the nearest vectors, but only among this user's own documents.'",
      code: 'results = index.search(query_vector, top_k=3, filter={"user_id": 42})',
    },
    {
      label: "5. Retrieval's whole job is feeding generation",
      body:
        "Every HNSW hop and every IVF cluster lookup exists for one reason: to hand the model a small, relevant slice of text before it answers. The retrieved chunks get formatted into a context section of the prompt, right alongside the user's question, with the model instructed to answer only from what's in front of it. That's the 'generation' half of retrieval-augmented generation — the payoff the entire search pipeline was built to deliver.",
      code:
        'def build_prompt(question, chunks):\n    context = ""\n    for chunk in chunks:\n        context = context + "[" + chunk["source"] + "] " + chunk["text"] + "\\n"\n    prompt = "Answer using only this context:\\n" + context + "\\nQuestion: " + question\n    return prompt',
    },
    {
      label: "6. The model answers — and cites its source",
      body:
        "The prompt built above goes straight into an ordinary LLM chat call. Because the actual policy text is sitting right there in the prompt, the model can quote it directly and name exactly which retrieved chunk it came from, instead of answering from memory and hoping it's right.",
      code:
        'prompt = build_prompt(\n    "How long do refunds take?",\n    [{"source": "refund-policy.pdf", "text": "Refunds are processed within 5-7 business days after the return is received."}],\n)\nanswer = llm.chat(prompt)\nprint(answer)\n\n"Refunds are processed within 5-7 business days after the return is received. [source: refund-policy.pdf]"',
    },
  ],
  realWorldIntro:
    "Production RAG systems reach for purpose-built vector databases — Pinecone, Weaviate, or pgvector as a Postgres extension — instead of hand-rolling similarity search, because these systems have already solved indexing, filtering, and scaling for embeddings numbering in the millions. But the search result is never the end of the road: those retrieved chunks get stitched into the prompt and handed to the LLM for the generation step, which is what actually produces the grounded, citable answer every piece of retrieval machinery in this module was built to support.",
  realWorldCode:
    'results = index.query(vector=query_embedding, top_k=3, filter={"doc_type": "policy"})\n\ncontext = ""\nfor r in results:\n    context = context + "[" + r.metadata["source"] + "] " + r.text + "\\n"\n\nprompt = "Answer using only this context:\\n" + context + "\\nQuestion: " + question\nanswer = llm.chat(prompt)\n# the model can now quote its answer and cite exactly which retrieved chunk it used',
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see why searching millions of embeddings needs more than comparing a query vector against every single one.",
    stages: [
      {
        label: "A small collection: brute force is fine",
        body:
          "With 3,000 support-ticket embeddings, comparing a query vector against every single one takes a few thousand dot products — a modern computer does that in a blink, so there's no need for anything fancier yet.",
        code: "3,000 vectors x 1 comparison each = 3,000 dot products per search\n# fast enough to not matter",
      },
      {
        label: "The same approach at real scale",
        body:
          "Now scale that same knowledge base up to 50 million embeddings — a realistic size for a large company's documents, emails, and tickets. Brute force still works, but now every single search means 50 million dot products, and latency balloons.",
        code: "50,000,000 vectors x 1 comparison each = 50,000,000 dot products per search\n# too slow for a live chat response",
      },
      {
        label: "HNSW: search by hopping through a graph",
        body:
          "HNSW pre-builds a graph connecting each vector to a handful of its nearest neighbors, organized in layers — sparse long-range links on top, dense short-range links below. A search starts at the top layer and repeatedly hops toward better matches, touching a tiny fraction of the full 50 million vectors.",
        code: "start at a top-layer node\nhop to a neighbor closer to the query -> repeat\ndrop down a layer, repeat again\n# ~a few hundred comparisons, not 50 million",
      },
      {
        label: "IVF: search by narrowing to the right clusters",
        body:
          "IVF (inverted file index) takes a different route: it groups all 50 million vectors into, say, 1,000 clusters ahead of time. A search first finds the handful of clusters whose centers are closest to the query, then only compares against the vectors inside those few clusters, skipping the rest entirely.",
        code: "step 1: find nearest 8 of 1,000 cluster centers\nstep 2: compare only against vectors inside those 8 clusters",
      },
      {
        label: "The tradeoff, made visible",
        body:
          "Both HNSW and IVF can occasionally miss the single truest closest vector, since they never look at every vector directly — that's the 'approximate' in approximate nearest neighbor. In exchange, search latency stays roughly flat even as the collection grows from 3,000 vectors to 300 million.",
      },
      {
        label: "Closing the loop: retrieval feeds generation",
        body:
          "Every index, cluster, and similarity score above exists to answer one question: which chunks belong in the prompt? Once the top matches come back, they're formatted into the context section of the prompt sent to the LLM, and the model is told to answer only from that context — so it can point to exactly which chunk backs up its answer, instead of guessing from memory.",
        code:
          'question = "How long do refunds take?"\nchunks = [{"source": "refund-policy.pdf", "text": "Refunds are processed within 5-7 business days after the return is received."}]\n\ncontext = ""\nfor chunk in chunks:\n    context = context + "[" + chunk["source"] + "] " + chunk["text"] + "\\n"\n\nprompt = "Answer using only this context:\\n" + context + "\\nQuestion: " + question\nanswer = llm.chat(prompt)\nprint(answer)\n\n"Refunds are processed within 5-7 business days after the return is received. [source: refund-policy.pdf]"',
      },
    ],
  },
  quizQuestion:
    "Why do vector databases use approximate nearest neighbor (ANN) indexes like HNSW instead of comparing the query to every single stored vector?",
  quizOptions: [
    {
      key: "a",
      label:
        "Because comparing against every vector one by one becomes too slow once a collection reaches millions of entries, so ANN indexes trade a little accuracy for far more speed",
      correct: true,
    },
    {
      key: "b",
      label: "Because brute-force comparison isn't mathematically possible once vectors have more than a few dimensions",
      correct: false,
    },
    {
      key: "c",
      label: "Because an ANN index is required to convert text into embeddings in the first place",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — brute-force comparison is simple and exact but too slow at scale; ANN indexes like HNSW or IVF pre-organize vectors so a search only inspects a small, promising subset, trading a tiny amount of guaranteed accuracy for search speeds that stay fast even across millions of vectors.",
  quizFeedbackIncorrect:
    "Not quite — brute-force comparison works fine at any number of dimensions, it's just too slow once a collection reaches millions of vectors. ANN indexes exist purely for speed, trading a small amount of guaranteed accuracy for search that stays fast at scale.",
  takeaway:
    "A vector database's core job is fast nearest-neighbor search at scale, using ANN indexes like HNSW or IVF so lookups stay fast even across millions of embeddings. The tradeoff in the search itself is baked into the name — approximate, not exact — and it's usually invisible to users but very visible in your latency graphs. But retrieval was only ever half the job: the retrieved chunks get stitched into a prompt and handed to the LLM for the generation step, which is what actually produces the grounded, citable answer the whole RAG pipeline — chunk, embed, retrieve, generate — was built to deliver.",
};

export default content;
