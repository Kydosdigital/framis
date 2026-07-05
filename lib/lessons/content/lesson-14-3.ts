import type { LessonData } from "../types";

const content: LessonData = {
  num: 14,
  orderIndex: 3,
  phaseLabel: "EMBEDDINGS + RAG",
  title: "Cutting documents down to size: why chunking makes retrieval work",
  minutes: 18,
  concept:
    "Before a document can be embedded and retrieved, it has to be split into pieces — that step is called chunking, and getting it wrong quietly breaks everything downstream. Embed an entire 60-page manual as a single vector and you get one blurry average of everything in it, so a question about page 2 and a question about page 45 both match the same undifferentiated chunk. Go too far the other way — one chunk per sentence — and each piece becomes too small to carry context on its own, so retrieval can find a technically related sentence with no surrounding information to actually answer the question. The fix real systems use is a middle ground: chunks of a few hundred tokens, often sliced with a sliding window that overlaps the previous chunk slightly, so a sentence sitting right on a chunk boundary still appears whole in at least one chunk instead of getting cut in half. Better splitters go further and respect the document's own structure — paragraph breaks, headings, list items — instead of blindly cutting every N characters regardless of what idea gets sliced through.",
  conceptSimpler:
    "Chunking is like making index cards from a textbook: one card per idea, not one card per book and not one card per word. Cards that are too big blur every topic together; cards that are too small lose the sentence they came from.",
  vizStages: [
    {
      label: "1. Chunking happens before anything else",
      body:
        "A document ingestion pipeline breaks raw text into chunks first, before embedding or storage ever happen. Everything downstream — every embedding, every search — operates on those pieces, never on the whole document at once.",
      code: "raw_text -> chunks -> embeddings -> vector database",
    },
    {
      label: "2. A search returns whole chunks, not snippets",
      body:
        "Retrieval hands back entire chunks, never a hand-picked excerpt from the middle of one. That means whatever size you chunked into becomes the smallest and largest unit that can ever come back as an answer.",
    },
    {
      label: "3. Overlap protects information near the edges",
      body:
        "A sliding window that overlaps the previous chunk means a sentence sitting right at a boundary still appears fully intact in at least one chunk, instead of being severed between two chunks that each only have half of it.",
      code: "chunk 1: \"...refunds are processed within 5-7\"\nchunk 2: \"within 5-7 business days of the return being received...\"",
    },
    {
      label: "4. There's no single 'right' chunk size",
      body:
        "A legal contract's dense clauses often need larger chunks to preserve their meaning, while a FAQ's short question-answer pairs work better as small, tightly-scoped chunks. Real systems tune chunk size per document type rather than picking one number for everything.",
    },
  ],
  realWorldIntro:
    "Libraries like LangChain and LlamaIndex ship built-in \"text splitters\" that implement exactly this overlap-and-boundary logic, because getting chunk size wrong is one of the most common reasons a RAG system gives confident, wrong-sounding answers.",
  realWorldCode:
    "splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)\nchunks = splitter.split_text(document_text)",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see what happens to retrieval quality as the same document gets split a different way.",
    stages: [
      {
        label: "1. One giant chunk: too coarse",
        body:
          "Embedding an entire 40-page manual as a single vector produces one averaged-out representation of everything in it. A question about page 30 and a question about page 2 both match that same lone chunk, so retrieval can't tell you which part is actually relevant.",
        code: 'chunk = read_whole_file("manual.pdf")\n# 40 pages -> one single vector',
      },
      {
        label: "2. One chunk per sentence: too fine",
        body:
          "Splitting on every period keeps each chunk razor-sharp but shreds the context around it. \"It requires the API key.\" on its own doesn't say which feature it belongs to, so retrieval can surface a technically matching sentence that has no way to actually answer the question.",
        code:
          'chunks = split_by_sentence(document)\n# chunk 47: "It requires the API key."\n# chunk 48: "This step is optional for free-tier accounts."',
      },
      {
        label: "3. Fixed-size windows with overlap",
        body:
          "Most real systems settle on chunks of a few hundred tokens — roughly a few paragraphs — sliced with a window that overlaps the previous chunk by 10-20%. That overlap means a sentence that would otherwise get cut in half between two chunks still shows up whole in at least one of them.",
        code:
          "chunk_size = 400  # tokens\noverlap = 50      # tokens\n# chunk 1: tokens 0-400\n# chunk 2: tokens 350-750  <- overlaps chunk 1 by 50 tokens",
      },
      {
        label: "4. Splitting on natural boundaries",
        body:
          "Instead of blindly cutting every N characters, boundary-aware chunking respects the document's own structure — paragraph breaks, headings, list items — so a chunk never ends mid-thought just because a character counter happened to hit its limit.",
        code:
          "# naive: cut every 400 characters, ignoring structure\n# boundary-aware: cut at the nearest paragraph break before 400 characters",
      },
      {
        label: "5. Every chunk carries its own metadata",
        body:
          "A stored chunk isn't just raw text — it's tagged with metadata like the source document, section title, and page number. When it's retrieved later, that metadata is what lets the system (and the user) trace the answer back to exactly where it came from.",
        code:
          '{"text": "Refunds are processed within 5-7 business days.", "source": "refund-policy.pdf", "page": 2}',
      },
    ],
  },
  quizQuestion:
    "A support team embeds their entire 60-page product manual as a single chunk. A user then asks a specific question about something on page 45. What's most likely to happen at retrieval time?",
  quizOptions: [
    {
      key: "a",
      label:
        "Retrieval works fine — the whole manual is retrieved and the model reads through it to find page 45",
      correct: false,
    },
    {
      key: "b",
      label:
        "Retrieval keeps returning the same all-purpose chunk for nearly every question, since one vector for 60 pages can't distinguish what's on page 2 from what's on page 45",
      correct: true,
    },
    {
      key: "c",
      label: "Retrieval fails outright with an error, because a document that large can't be embedded",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a single embedding for 60 pages averages together everything the document contains, so it isn't distinctive enough to tell a question about page 2 apart from one about page 45; nearly every query ends up matching that same blurry chunk.",
  quizFeedbackIncorrect:
    "Not quite — embedding models can technically accept long text without erroring, but the resulting vector is too averaged-out to be useful for retrieval: it can't tell a question about page 2 from one about page 45, so nearly every query retrieves the same undifferentiated chunk.",
  takeaway:
    "Chunk size is a tradeoff between too coarse (loses precision) and too fine (loses context) — overlap and boundary-aware splitting are how real systems land in between. Get chunking wrong, and no amount of embedding or search sophistication downstream can fix it.",
};

export default content;
