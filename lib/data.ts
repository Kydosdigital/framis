export const TICKER_ITEMS = [
  "VARIABLES", "FUNCTIONS", "LOOPS", "APIS", "DATABASES", "AUTH", "REACT",
  "TESTING", "CI/CD", "EMBEDDINGS", "RAG", "TOKENS", "TOOL CALLING", "EVALS",
  "AGENTS", "FINE-TUNING",
];

export const PHASES = [
  { num: "1", delay: 0, weeks: "WEEKS 1–8", title: "Programming foundations", desc: "Terminal, Git, Python, data structures, debugging.", capstone: "Capstone: CLI expense tracker" },
  { num: "2", delay: 0.07, weeks: "WEEKS 9–16", title: "Web + full-stack basics", desc: "HTML/CSS/JS, React, APIs, Python backend + Postgres.", capstone: "Capstone: Notes app with login" },
  { num: "3", delay: 0.14, weeks: "WEEKS 17–24", title: "Engineering discipline", desc: "Testing, logging, security, CI/CD, Docker.", capstone: "Capstone: Tested app with CI pipeline" },
  { num: "4", delay: 0.21, weeks: "WEEKS 25–32", title: "AI application engineering", desc: "LLM APIs, RAG, tool calling, evals and guardrails.", capstone: "Capstone: AI Q&A system with citations" },
  { num: "5", delay: 0.28, weeks: "WEEKS 33–40", title: "ML fundamentals", desc: "Stats intuition, linear algebra, transformers, fine-tuning.", capstone: "Capstone: Train + deploy a classifier" },
  { num: "6", delay: 0.35, weeks: "WEEKS 41–48", title: "Production AI systems", desc: "Agents, human-in-the-loop, observability, cost control.", capstone: "Capstone: Production AI system" },
];

export const ROADMAP_MODULES: { phase: number; num: number; title: string }[] = [
  { phase: 1, num: 1, title: "Setup + Terminal + Git" },
  { phase: 1, num: 2, title: "Python Syntax, Variables, Functions" },
  { phase: 1, num: 3, title: "Data Structures + Control Flow" },
  { phase: 1, num: 4, title: "File I/O + Errors + Debugging" },
  { phase: 2, num: 5, title: "HTML, CSS, JavaScript" },
  { phase: 2, num: 6, title: "React Basics + Components" },
  { phase: 2, num: 7, title: "APIs + HTTP + JSON" },
  { phase: 2, num: 8, title: "Backend: Python + Postgres" },
  { phase: 3, num: 9, title: "Testing (unit/integration/e2e)" },
  { phase: 3, num: 10, title: "Debugging + Logging + Monitoring" },
  { phase: 3, num: 11, title: "Security + Auth Patterns" },
  { phase: 3, num: 12, title: "CI/CD + Docker + Deployment" },
  { phase: 4, num: 13, title: "LLM APIs + Tokens + Cost" },
  { phase: 4, num: 14, title: "Embeddings + RAG + Vector Search" },
  { phase: 4, num: 15, title: "Structured Outputs + Tool Calling" },
  { phase: 4, num: 16, title: "Evals + Safety + Guardrails" },
  { phase: 5, num: 17, title: "Probability + Statistics" },
  { phase: 5, num: 18, title: "Linear Algebra Basics" },
  { phase: 5, num: 19, title: "Transformers + Attention" },
  { phase: 5, num: 20, title: "Fine-tuning + Dataset Quality" },
  { phase: 6, num: 21, title: "Agents + Orchestration" },
  { phase: 6, num: 22, title: "Human-in-the-Loop + Guardrails" },
  { phase: 6, num: 23, title: "Observability + Cost Controls" },
  { phase: 6, num: 24, title: "AI Product Design + Edge Cases" },
];

// Modules with a real, built lesson. Everything else in ROADMAP_MODULES is
// browsable but shows an honest "not published yet" state when opened.
export const LESSON_CONTENT: Record<number, { key: "variables" | "rag"; title: string; minutes: number }> = {
  2: { key: "variables", title: "Variables — storing information", minutes: 25 },
  14: { key: "rag", title: "RAG — teaching an LLM to cite its sources", minutes: 25 },
};

export const OB_QUESTIONS: {
  key: "q1" | "q2" | "q3";
  label: string;
  opts: string[];
}[] = [
  { key: "q1", label: "How comfortable are you in a terminal?", opts: ["Never used it", "I can cd around", "I live in it"] },
  { key: "q2", label: "Have you built and shared a project?", opts: ["Not yet", "Tutorials only", "Yes, something real"] },
  { key: "q3", label: "Do you use AI coding tools (Claude, Copilot)?", opts: ["No", "Sometimes", "Daily"] },
];

export const SETUP_ITEMS: { key: "py" | "vsc" | "git"; label: string }[] = [
  { key: "py", label: "Python 3.12" },
  { key: "vsc", label: "VS Code" },
  { key: "git", label: "Git + GitHub account" },
];

export const WEEK_TASKS: {
  label: string;
  meta: string;
  cta: string;
  tab: "lesson" | "capstone";
}[] = [
  { label: "Lesson: Variables — storing information", meta: "25 min · Module 2", cta: "open", tab: "lesson" },
  { label: "Lesson: Mocking & fixtures", meta: "30 min · due tomorrow", cta: "open", tab: "lesson" },
  { label: "Sandbox: unit tests for expense tracker", meta: "1 hr", cta: "open", tab: "lesson" },
  { label: "Capstone: submit Notes App", meta: "2–3 wks", cta: "open", tab: "capstone" },
];

export const VIZ_CAPTIONS = [
  "Press play to see what really happens when you create a variable.",
  'Python reads the right side first: the value "Alex".',
  "The value moves into a labelled box in memory. The label is “name”.",
  "Stored. From now on, “name” points at that box.",
  "print(name) opens the box, takes the value out, and shows it.",
];

export const QUIZ_ANSWERS: { key: "a" | "b" | "c"; label: string; correct: boolean }[] = [
  { key: "a", label: "x changes to 8", correct: false },
  { key: "b", label: "y becomes 8", correct: true },
  { key: "c", label: "both stay the same", correct: false },
];

export const CRITERIA_LABELS = [
  "User can create an account with email + password",
  "User can log in and see only their own notes",
  "User can create, edit and delete notes",
  "Logging out clears the auth token",
  "Backend tests cover the main flows (70%+)",
  "No hardcoded secrets anywhere in the repo",
  "Deployed and working at a public URL",
];

export const HINT_TEXTS = [
  "Start with the database schema: a users table and a notes table with a user_id foreign key.",
  "Never store raw passwords — hash them with bcrypt before they touch the database.",
  "Attach a JWT to each request; the backend checks it before returning any notes.",
];

export const REVIEW_ROWS: { key: "crit" | "read" | "tests" | "deploy" | "readme"; label: string; weight: string }[] = [
  { key: "crit", label: "Meets all acceptance criteria", weight: "40%" },
  { key: "read", label: "Code is readable and well-structured", weight: "20%" },
  { key: "tests", label: "Has 70%+ test coverage", weight: "20%" },
  { key: "deploy", label: "Deployment works without errors", weight: "10%" },
  { key: "readme", label: "README is clear for someone new", weight: "10%" },
];

export type CapstoneData = {
  phaseIndex: number; // 0-5, matches PHASES array index
  slug: string; // matches supabase projects.slug
  title: string;
  metaTags: string; // e.g. "INTERMEDIATE · 2-3 WEEKS · SOLO"
  description: string;
  criteria: string[];
  hints: string[];
  repoBadgeLabel: string;
  liveBadgeLabel: string;
  coverageLabel: string;
  bugFilename: string;
  bugCodeBefore: string;
  bugCodeLine: string;
  bugCodeAfter: string;
  bugNote: string;
  reviewFlagCopy: string;
  shippedHeadline: string;
  autoCheckLine: string;
};

export const CAPSTONES: CapstoneData[] = [
  {
    phaseIndex: 1,
    slug: "notes-app-with-login",
    title: "Full-stack notes app with login",
    metaTags: "INTERMEDIATE · 2–3 WEEKS · SOLO",
    description:
      "You’re building an MVP where users sign up, log in, and manage private notes. React frontend, FastAPI + SQLite backend, deployed on Vercel + Railway, 70%+ test coverage.",
    criteria: [
      "User can create an account with email + password",
      "User can log in and see only their own notes",
      "User can create, edit and delete notes",
      "Logging out clears the auth token",
      "Backend tests cover the main flows (70%+)",
      "No hardcoded secrets anywhere in the repo",
      "Deployed and working at a public URL",
    ],
    hints: [
      "Start with the database schema: a users table and a notes table with a user_id foreign key.",
      "Never store raw passwords — hash them with bcrypt before they touch the database.",
      "Attach a JWT to each request; the backend checks it before returning any notes.",
    ],
    repoBadgeLabel: "github.com/•••/notes-app",
    liveBadgeLabel: "notes-app.vercel.app ✓ live",
    coverageLabel: "coverage 74%",
    bugFilename: "auth.py",
    bugCodeBefore: `def login(email, password):\n    user = db.get_user(email)\n    `,
    bugCodeLine: "if user.password == password:",
    bugCodeAfter: `\n        return make_token(user)\n    return None`,
    bugNote: "← plain-text compare?",
    reviewFlagCopy: "You flagged the plain-text password compare. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 2 of 6.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no secrets detected · 12/12 tests green.",
  },
  {
    phaseIndex: 0,
    slug: "cli-expense-tracker",
    title: "Command-line expense tracker with category summaries",
    metaTags: "BEGINNER · 1–2 WEEKS · SOLO",
    description:
      "You’re building a command-line tool that logs everyday expenses — amount, category, date, and an optional note — to a CSV or JSON file so the data survives between runs. A simple argparse interface (or menu loop) lets you add expenses and query them: total spent by category, total by month, and a full list. No framework, no database, no UI — just Python, file I/O, and clean data structures.",
    criteria: [
      "Can add an expense with an amount, category, date, and optional note from the command line",
      "Data persists between runs — saved to a CSV or JSON file, not just kept in memory",
      "Can list all logged expenses in a readable format",
      "Can view total spending grouped by category",
      "Can view total spending grouped by month",
      "Handles invalid input (e.g. a non-numeric amount or malformed date) without crashing",
      "Has at least one automated test covering the summary logic",
      "README explains how to run it and what commands are available",
    ],
    hints: [
      "Store each expense as a dictionary (or a small class) with amount, category, date, and note — read the file into a list of these before you do anything else with the data.",
      "CSV and JSON both hand you strings back, even for numbers — cast amount to float and parse the date the moment you load a row, not every time you use it later.",
      "Write and test the parsing/validation logic on its own in the terminal before wiring it up to argparse or a menu loop — much easier to debug in isolation than through a CLI.",
    ],
    repoBadgeLabel: "github.com/•••/expense-tracker",
    liveBadgeLabel: "CLI tool · run locally",
    coverageLabel: "coverage 68%",
    bugFilename: "summary.py",
    bugCodeBefore: `def total_for_category(rows, category):\n    total = 0\n    for row in rows:\n        if row["category"] == category:\n            `,
    bugCodeLine: `total += row["amount"]`,
    bugCodeAfter: `\n    return round(total, 2)`,
    bugNote: "← still a string?",
    reviewFlagCopy: "You flagged the amount getting summed as a raw string instead of a float. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 1 of 6.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no secrets detected · 8/8 tests green.",
  },
  {
    phaseIndex: 4,
    slug: "train-deploy-classifier",
    title: "Spam-or-not classifier, trained and deployed for real",
    metaTags: "ADVANCED · 2–3 WEEKS · SOLO",
    description:
      "You’re picking a real dataset — a spam/ham email corpus, product reviews, whatever text or tabular data you can defend — and training a classifier to sort it, with a proper train/validation/test split instead of eyeballing accuracy on the same rows you trained on. You compare it against a naive baseline (e.g. always guessing the majority class) so the improvement means something, then wrap the trained model in a small API endpoint that takes a new example and returns a prediction.",
    criteria: [
      "Data is split into train, validation, and test sets before any model training happens",
      "Reports precision, recall, and F1 — not just accuracy",
      "Beats a naive baseline (e.g. always-predict-majority-class) by a meaningful margin",
      "Model is deployed behind an API endpoint that accepts real input and returns a prediction",
      "Includes a confusion matrix or equivalent error analysis",
      "No test-set leakage into training, documented and verified",
      "README explains the dataset, model choice, and evaluation results",
    ],
    hints: [
      "Split your data before you touch it with anything else — including preprocessing. Fit vectorizers, scalers, and encoders on the training set only, then apply (never re-fit) them to validation and test.",
      "Accuracy lies when classes are imbalanced — 99% \"not spam\" in your data means guessing \"not spam\" every time already scores 99%. Check precision, recall, and F1 against a dumb baseline before you believe your number.",
      "Your test set exists to answer one question: how will this model do on data it's never seen? The moment you use it to pick hyperparameters or features, it stops answering that question — that's what the validation set is for.",
    ],
    repoBadgeLabel: "github.com/•••/spam-classifier",
    liveBadgeLabel: "spam-classifier-api.up.railway.app ✓ live",
    coverageLabel: "F1: 0.91 on test set",
    bugFilename: "train.py",
    bugCodeBefore: `model = LogisticRegression()\nmodel.fit(X_train, y_train)\n\naccuracy = `,
    bugCodeLine: "model.score(X_train, y_train)",
    bugCodeAfter: `\nprint(f"Model accuracy: {accuracy:.2%}")`,
    bugNote: "← same data it trained on?",
    reviewFlagCopy: "You flagged the model being scored on the same data it trained on instead of the held-out test set. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 5 of 6.",
    autoCheckLine: "Auto-checks passed: repo public · README found · held-out test evaluation detected · API responds with valid predictions · no train/test leakage flagged.",
  },
  {
    phaseIndex: 2,
    slug: "tested-app-with-ci",
    title: "A URL shortener with a real CI pipeline",
    metaTags: "INTERMEDIATE · 2–3 WEEKS · SOLO",
    description:
      "You’re taking a URL shortener — create short links, redirect to the original, track click counts — and giving it the engineering rigor a real team would expect. You write a full unit + integration test suite (Pytest, 80%+ coverage), wire up a GitHub Actions pipeline that runs on every push and blocks merges on red, and ship it as a Dockerized FastAPI + Postgres service.",
    criteria: [
      "Unit tests cover all core business logic (slug generation, collision handling, link expiry)",
      "Integration tests exercise at least 2 full request/response flows (e.g. POST /shorten → GET /:slug redirect)",
      "GitHub Actions runs the full test suite on every push and pull request",
      "CI fails, and blocks merge, if any test fails or coverage drops below 80%",
      "App is fully containerized — docker build && docker run works locally with no extra setup",
      "No hardcoded secrets — database URL and config are loaded from environment variables",
      "README documents how to run tests locally and how the CI pipeline works",
    ],
    hints: [
      "Use a separate test database (or a fresh in-memory/SQLite fixture) so tests never touch real data, and reset it between tests for isolation.",
      "Mock outbound calls, like analytics pings or email notifications, in your unit tests. Save the real network calls for a small number of integration tests.",
      "Order your CI steps to fail fast: lint, then unit tests, then integration tests, then the coverage check — so a broken pipeline tells you what broke without waiting on the slow steps.",
    ],
    repoBadgeLabel: "github.com/•••/url-shortener",
    liveBadgeLabel: "url-shortener.up.railway.app ✓ live",
    coverageLabel: "coverage 83%",
    bugFilename: ".github/workflows/ci.yml",
    bugCodeBefore: `name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: pip install -r requirements.txt\n      - name: Run tests\n        `,
    bugCodeLine: "run: pytest --cov=app --cov-fail-under=80 || true",
    bugCodeAfter: `\n      - run: docker build -t url-shortener .`,
    bugNote: "← always exits 0, even when tests fail",
    reviewFlagCopy: "You flagged the `|| true` that lets the pipeline pass even when tests fail. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 3 of 6.",
    autoCheckLine: "Auto-checks passed: repo public · README found · Dockerfile builds · CI pipeline green on latest commit · coverage 83% (≥80% threshold).",
  },
  {
    phaseIndex: 5,
    slug: "production-ai-system",
    title: "A production-grade support agent with a kill switch",
    metaTags: "ADVANCED · 3–4 WEEKS · SOLO OR PAIR",
    description:
      "You’re building an AI support agent — it reads incoming tickets, calls tools (order lookup, refund status, docs search) and drafts or sends a reply — but the bar here isn’t “it works,” it’s “it’s safe to actually ship.” Every request is logged and costed, an eval suite guards every prompt change, guardrails catch bad input before it reaches the model, and anything the agent isn’t confident about lands in a human queue instead of going out the door. This is the project that pulls together everything from the five phases before it — auth and testing discipline, LLM tool calling, evals — plus the operational controls that separate a demo from something a real company would run.",
    criteria: [
      "Every request is logged with latency and cost",
      "There's an automated eval suite (at least 20 cases) that runs before any prompt or config change ships",
      "Guardrails reject or flag unsafe, off-topic, or malformed input before it reaches the model",
      "Low-confidence or high-risk cases escalate to a human review queue instead of auto-acting",
      "There's a tested kill switch / feature flag that can disable the AI feature instantly, without a deploy",
      "Cost per request is tracked and a runaway-cost alert exists",
      "Handles at least 5 documented edge cases explicitly (empty input, hostile/prompt-injection input, ambiguous input, tool failure, non-English input)",
      "README documents the incident-response plan if something goes wrong in production",
    ],
    hints: [
      "Design the kill switch as a config read on every request (a DB row, a feature-flag service, even a file you re-check each time) — not an env var read once at import. If flipping it requires a redeploy, it isn't a kill switch.",
      "Decide up front what \"low confidence\" means for your agent — a model self-rating, a missing tool result, an ambiguous ticket category — and route that case to a human queue by default. Auto-acting on a guess is the failure mode this whole project is designed to catch.",
      "Log cost per request from day one, even while you're testing with ten tickets a day — the alert threshold and the dashboard are useless if you bolt them on after the first real cost spike, not before.",
    ],
    repoBadgeLabel: "github.com/•••/production-agent",
    liveBadgeLabel: "support-agent.fly.dev ✓ live",
    coverageLabel: "47/50 eval cases passing",
    bugFilename: "kill_switch.py",
    bugCodeBefore: `import os\n\n`,
    bugCodeLine: `AI_ENABLED = os.getenv("AI_AGENT_ENABLED", "true") == "true"`,
    bugCodeAfter: `\n\ndef handle_ticket(ticket):\n    if not AI_ENABLED:\n        return route_to_human(ticket)\n    response = agent.run(ticket)\n    return response`,
    bugNote: "← cached at import — flipping this in prod does nothing until restart",
    reviewFlagCopy: "You flagged the kill switch reading its config once at import instead of on every request. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 6 of 6 — the whole route, done.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no secrets detected · eval suite 47/50 passing · kill switch verified live.",
  },
  {
    phaseIndex: 3,
    slug: "ai-qa-with-citations",
    title: "Ask-your-docs Q&A bot with real citations",
    metaTags: "INTERMEDIATE · 2–3 WEEKS · SOLO OR PAIR",
    description:
      "You’re building a Q&A bot over a real set of documents — product docs, a policy handbook, a set of research papers, whatever you choose — that chunks and embeds the text, retrieves the most relevant chunks for each question, and has an LLM answer using only that retrieved context. Every answer has to cite exactly which chunk and source document it came from, and the bot has to admit when it doesn’t know rather than filling the gap from its own training data.",
    criteria: [
      "Ingests at least 20 pages of real documents into a knowledge base, chunked and embedded into a retrievable vector index",
      "Every answer cites which source chunk and document it came from",
      "Says “I don’t know” instead of guessing when no chunk clears a similarity threshold",
      "Answers at least 10 real test questions with correct citations",
      "Tracks and displays estimated token cost per query",
      "No hardcoded API keys anywhere in the repo — loaded from environment variables",
      "README explains the chunking, embedding, and retrieval pipeline",
    ],
    hints: [
      "Chunk size is a tradeoff: too small and you lose the context around the answer, too large and irrelevant text dilutes the embedding and blows your token budget — start around 300–500 tokens per chunk with a little overlap between chunks.",
      "Pick a similarity threshold before you trust a chunk enough to answer with it — a query that falls below that cutoff against every chunk should trigger an “I don’t know,” not a confident guess.",
      "Structure the prompt so the retrieved chunks are the only source of truth: paste them in as labeled, numbered context, then explicitly instruct the model to answer only from that context and say so if the answer isn’t in it.",
    ],
    repoBadgeLabel: "github.com/•••/docs-qa-bot",
    liveBadgeLabel: "docs-qa-bot.vercel.app ✓ live",
    coverageLabel: "13/15 test questions correct",
    bugFilename: "answer.py",
    bugCodeBefore: `def answer_question(query):\n    chunks = retrieve(query, k=4)\n    `,
    bugCodeLine: `prompt = f"Answer the question: {query}"`,
    bugCodeAfter: `\n    response = llm.chat(prompt)\n    return response`,
    bugNote: "← where’d chunks go?",
    reviewFlagCopy: "You flagged the prompt that never includes the retrieved chunks — the model was answering from its own training data, not your documents. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 4 of 6.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no hardcoded keys detected · 13/15 test questions answered with correct citations.",
  },
];

export const FEEDBACK_FIELDS: { key: "well" | "improve" | "question" | "learned"; label: string; ph: string }[] = [
  { key: "well", label: "What worked well (1–2 things)", ph: "e.g. Clean separation between routes and db logic…" },
  { key: "improve", label: "One thing that could improve", ph: "e.g. Passwords are compared in plain text — try bcrypt…" },
  { key: "question", label: "One question I had", ph: "e.g. Why SQLite over Postgres here?" },
  { key: "learned", label: "One thing I learned from this code", ph: "e.g. Neat use of FastAPI dependencies for auth." },
];
