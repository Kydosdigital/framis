export const TICKER_ITEMS = [
  "VARIABLES", "FUNCTIONS", "LOOPS", "APIS", "DATABASES", "AUTH", "REACT",
  "TESTING", "CI/CD", "EMBEDDINGS", "RAG", "TOKENS", "TOOL CALLING", "EVALS",
  "AGENTS", "FINE-TUNING",
];

export const PHASES = [
  { num: "1", delay: 0, weeks: "WEEKS 1–8", title: "Programming foundations", desc: "Terminal, Git, Python, data structures, debugging.", capstone: "Capstone: CLI expense tracker" },
  { num: "2", delay: 0.06, weeks: "WEEKS 9–16", title: "Web + full-stack basics", desc: "HTML/CSS/JS, React, APIs, Python backend + Postgres.", capstone: "Capstone: Notes app with login" },
  { num: "3", delay: 0.12, weeks: "WEEKS 17–32", title: "Data + classical ML", desc: "Pandas, feature engineering, decision trees, model evaluation.", capstone: "Capstone: Classical ML model comparison" },
  { num: "4", delay: 0.18, weeks: "WEEKS 33–40", title: "Engineering discipline", desc: "Testing, logging, security, CI/CD, Docker.", capstone: "Capstone: Tested app with CI pipeline" },
  { num: "5", delay: 0.24, weeks: "WEEKS 41–48", title: "AI application engineering", desc: "LLM APIs, RAG, tool calling, evals and guardrails.", capstone: "Capstone: AI Q&A system with citations" },
  { num: "6", delay: 0.30, weeks: "WEEKS 49–56", title: "ML fundamentals", desc: "Stats intuition, linear algebra, transformers, fine-tuning.", capstone: "Capstone: Train + deploy a classifier" },
  { num: "7", delay: 0.35, weeks: "WEEKS 57–64", title: "Production AI systems", desc: "Agents, human-in-the-loop, observability, cost control.", capstone: "Capstone: Production AI system" },
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
  { phase: 3, num: 9, title: "Pandas + Data Wrangling" },
  { phase: 3, num: 10, title: "Feature Engineering + Selection" },
  { phase: 3, num: 11, title: "Classical Machine Learning" },
  { phase: 3, num: 12, title: "Model Evaluation + Cross-Validation" },
  { phase: 4, num: 13, title: "Testing (unit/integration/e2e)" },
  { phase: 4, num: 14, title: "Debugging + Logging + Monitoring" },
  { phase: 4, num: 15, title: "Security + Auth Patterns" },
  { phase: 4, num: 16, title: "CI/CD + Docker + Deployment" },
  { phase: 5, num: 17, title: "LLM APIs + Tokens + Cost" },
  { phase: 5, num: 18, title: "Embeddings + RAG + Vector Search" },
  { phase: 5, num: 19, title: "Structured Outputs + Tool Calling" },
  { phase: 5, num: 20, title: "Evals + Safety + Guardrails" },
  { phase: 6, num: 21, title: "Probability + Statistics" },
  { phase: 6, num: 22, title: "Linear Algebra Basics" },
  { phase: 6, num: 23, title: "Transformers + Attention" },
  { phase: 6, num: 24, title: "Fine-tuning + Dataset Quality" },
  { phase: 7, num: 25, title: "Agents + Orchestration" },
  { phase: 7, num: 26, title: "Human-in-the-Loop + Guardrails" },
  { phase: 7, num: 27, title: "Observability + Cost Controls" },
  { phase: 7, num: 28, title: "AI Product Design + Edge Cases" },
];

// Modules with a real, built lesson. Everything else in ROADMAP_MODULES is
// browsable but shows an honest "not published yet" state when opened.
export const LESSON_CONTENT: Record<number, { key: "variables" | "rag"; title: string; minutes: number }> = {
  2: { key: "variables", title: "Variables — storing information", minutes: 25 },
  18: { key: "rag", title: "RAG — teaching an LLM to cite its sources", minutes: 25 },
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

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Is the curriculum really free forever?",
    answer:
      "Yes — every module, every lesson, every sandbox, and peer review are free, permanently. There's no paywall waiting further into the curriculum. The only paid option is an optional mentor at £150/month, and that's for people who want a dedicated person checking their work, not a requirement to keep learning.",
  },
  {
    question: "Do I need to be good at math or already know how to code?",
    answer:
      "No. Phase 1 assumes zero coding experience and starts with the terminal. If you already know the basics, the placement quiz during onboarding starts you further in so you're not re-doing things you've already learned.",
  },
  {
    question: "What happens when I get stuck?",
    answer:
      "Every lesson has a key-terms sidebar with plain-English definitions and real-world examples for anything jargon-heavy. Capstones get read by another learner before they count as shipped, so you get real feedback on real code, not just an automated check.",
  },
  {
    question: "How long does this actually take?",
    answer:
      "The full path is 64 weeks (7 phases, 28 modules) at roughly 10–15 hours a week. You're not locked to that pace — go faster or slower — but that's the range that keeps momentum without burning out.",
  },
  {
    question: "What's Phase 3 and why does everyone mention it?",
    answer:
      "Phase 3 is Data + Classical ML — Pandas, feature engineering, decision trees, model evaluation. It's a genuine jump in difficulty from the web-development phase before it, and most learners feel that. It's not a curriculum mistake; it's where the real understanding of how machine learning works actually happens.",
  },
  {
    question: "What do I actually get if I finish?",
    answer:
      "Seven shipped capstones — real, working, deployed projects, not tutorials — reviewed by other learners, plus whatever you built along the way. About 1 in 5 self-paced learners get hired within 6 months of finishing; with a mentor, that's closer to 1 in 2, at an average salary of £52,000.",
  },
  {
    question: "What does the mentor option actually include?",
    answer:
      "A dedicated mentor, one code review a week, Slack access with a 12-hour response window, and a monthly career coaching check-in — £150/month, cancel anytime. It's optional and doesn't unlock any curriculum that isn't already free.",
  },
  {
    question: "Can I use this on my phone or an old laptop?",
    answer:
      "Everything runs in the browser — the code sandboxes are built in, no local Python or Node install required to work through lessons. A laptop is more comfortable for actually writing code, but there's no special hardware requirement.",
  },
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
  phaseIndex: number; // 0-6, matches PHASES array index
  slug: string; // matches supabase projects.slug
  title: string;
  metaTags: string; // e.g. "INTERMEDIATE · 2-3 WEEKS · SOLO"
  templates?: boolean; // true = learner picks a domain from CAPSTONE_TEMPLATES first
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
    shippedHeadline: "Shipped. That’s project 2 of 7.",
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
    shippedHeadline: "Shipped. That’s project 1 of 7.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no secrets detected · 8/8 tests green.",
  },
  {
    phaseIndex: 5,
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
    shippedHeadline: "Shipped. That’s project 6 of 7.",
    autoCheckLine: "Auto-checks passed: repo public · README found · held-out test evaluation detected · API responds with valid predictions · no train/test leakage flagged.",
  },
  {
    phaseIndex: 3,
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
    shippedHeadline: "Shipped. That’s project 4 of 7.",
    autoCheckLine: "Auto-checks passed: repo public · README found · Dockerfile builds · CI pipeline green on latest commit · coverage 83% (≥80% threshold).",
  },
  {
    phaseIndex: 6,
    slug: "production-ai-system",
    title: "A production-grade AI system with a kill switch",
    metaTags: "ADVANCED · 3–4 WEEKS · SOLO OR PAIR",
    templates: true,
    description:
      "Pick a domain below — support agent, code assistant, document Q&A, whatever fits what you want to build — but whichever you choose, the bar is the same: not “it works,” it’s “it’s safe to actually ship.” Every request is logged and costed, an eval suite guards every prompt change, guardrails catch bad input before it reaches the model, and anything the system isn’t confident about lands in a human queue instead of going out the door. This is the project that pulls together everything from the six phases before it — auth and testing discipline, LLM tool calling, evals — plus the operational controls that separate a demo from something a real company would run.",
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
    shippedHeadline: "Shipped. That’s project 7 of 7 — the whole route, done.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no secrets detected · eval suite 47/50 passing · kill switch verified live.",
  },
  {
    phaseIndex: 4,
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
    shippedHeadline: "Shipped. That’s project 5 of 7.",
    autoCheckLine: "Auto-checks passed: repo public · README found · no hardcoded keys detected · 13/15 test questions answered with correct citations.",
  },
  {
    phaseIndex: 2,
    slug: "classical-ml-model-comparison",
    title: "Classical ML model comparison — pick the right tool, not just any tool",
    metaTags: "INTERMEDIATE · 2–3 WEEKS · SOLO",
    description:
      "You’re picking a real, messy dataset — a Kaggle competition, a UCI repository set, whatever you can defend — cleaning it, engineering features from it, and training three different classical models (a decision tree, a random forest, and a logistic regression or SVM) to solve the same classification problem. Instead of picking a winner by gut feeling, you compare all three with a proper train/validation/test split and more than one metric, document why the best one actually won, and publish it with a model card a stranger could read and trust.",
    criteria: [
      "Uses a real, non-synthetic dataset that required genuine cleaning (missing values, duplicates, or outliers handled and documented)",
      "Engineers at least 3 features beyond the raw columns (e.g. encodings, ratios, bucketed values) with a stated reason for each",
      "Trains at least 3 different classical algorithms on the same problem (e.g. decision tree, random forest, logistic regression or SVM)",
      "Splits data into train, validation, and test sets before any fitting happens — encoders and scalers fit on train only",
      "Compares all 3 models with more than accuracy (precision, recall, F1, or a confusion matrix)",
      "Documents which model won and why in a model card, including its weaknesses",
      "Deployed somewhere reachable — a Hugging Face Space, or an API endpoint — not just a local notebook",
      "README explains the dataset, the cleaning decisions, and the feature choices",
    ],
    hints: [
      "Do the messy, unglamorous data cleaning and exploration first — plot distributions, check for missing values and duplicates, and understand the class balance before you train anything.",
      "Fit every scaler, encoder, and imputer on the training set only, then apply (never re-fit) the same transformation to validation and test — fitting on the full dataset first is the single most common leakage bug in classical ML.",
      "Pick a naive baseline (always guess the majority class) before comparing your 3 real models — if a model can't beat the baseline by a meaningful margin, that's worth reporting honestly, not hiding.",
    ],
    repoBadgeLabel: "github.com/•••/ml-model-comparison",
    liveBadgeLabel: "ml-comparison.hf.space ✓ live",
    coverageLabel: "best model F1: 0.88",
    bugFilename: "prepare_data.py",
    bugCodeBefore: `scaler = StandardScaler()\n`,
    bugCodeLine: "X_scaled = scaler.fit_transform(X)",
    bugCodeAfter: `\n\nX_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)`,
    bugNote: "← scaled before the split?",
    reviewFlagCopy: "You flagged the scaler being fit on the full dataset before the train/test split — that's data leakage, since the test set's statistics quietly influenced the scaling of the training data. That’s exactly the judgment Framis is built to train.",
    shippedHeadline: "Shipped. That’s project 3 of 7.",
    autoCheckLine: "Auto-checks passed: repo public · README found · train/val/test split detected before fitting · model card present · deployed endpoint responds.",
  },
];

export type CapstoneTemplate = {
  slug: string;
  /** Font Awesome icon name (see components/Icon.tsx) — no emojis on the site. */
  icon: string;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  overview: string;
  stack: { backend: string; frontend: string; database: string; aiComponent: string; deployment: string };
  learningOutcomes: string[];
  architecture: string[];
  starterFolderStructure: string;
  starterCode: { filename: string; code: string }[];
  keyDecisions: string[];
};

export const CAPSTONE_TEMPLATES: CapstoneTemplate[] = [
  {
    slug: "support-chatbot",
    icon: "comments",
    name: "Customer Support Chatbot",
    difficulty: "Intermediate",
    timeEstimate: "3–4 weeks",
    overview:
      "Answers customer questions from your own documents (RAG), escalates to a human when it isn't confident, and tracks satisfaction.",
    stack: {
      backend: "FastAPI (Python)",
      frontend: "React (basic chat UI)",
      database: "PostgreSQL + pgvector",
      aiComponent: "Claude API + embeddings",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Retrieval-augmented generation end to end",
      "Conversation state management",
      "Human-in-the-loop escalation",
      "Cost tracking on a per-conversation basis",
    ],
    architecture: [
      "Customer sends a message",
      "Search your knowledge base (vector DB) for relevant chunks",
      "Claude generates a response using those chunks as context",
      "If confidence is low, escalate to a human queue instead of answering",
      "Track satisfaction (thumbs up/down) to see what's working",
    ],
    starterFolderStructure: "support-chatbot/\n  main.py\n  requirements.txt\n  .env.example\n  db/\n    schema.sql\n  app/\n    retrieval.py\n    chat.py\n  tests/\n    test_chat.py",
    starterCode: [
      {
        filename: "main.py",
        code: `from fastapi import FastAPI
from app.chat import handle_message

app = FastAPI()

@app.post("/chat")
async def chat(payload: dict):
    reply = await handle_message(payload["conversation_id"], payload["message"])
    return {"reply": reply.text, "escalated": reply.escalated}`,
      },
      {
        filename: "requirements.txt",
        code: "fastapi\nuvicorn\nanthropic\npsycopg2-binary\npgvector\npytest",
      },
    ],
    keyDecisions: [
      "RAG vs. fine-tuning: RAG is faster to stand up and doesn't need thousands of past conversations — start there.",
      "Escalation threshold: pick a confidence signal (a model self-rating, or simply \"no chunk scored above X similarity\") and escalate by default when unsure.",
      "Cost: Claude API is priced per token — log tokens per conversation from day one so you're not guessing at cost later.",
    ],
  },
  {
    slug: "code-assistant",
    icon: "bolt",
    name: "Code Generation Assistant",
    difficulty: "Advanced",
    timeEstimate: "3–4 weeks",
    overview:
      "Takes a plain-English description, generates code, explains it, and handles follow-up requests like \"make it faster\" or \"add tests.\"",
    stack: {
      backend: "FastAPI",
      frontend: "Next.js + a code editor component",
      database: "PostgreSQL",
      aiComponent: "Claude API (structured output)",
      deployment: "Vercel (frontend) + Railway (backend)",
    },
    learningOutcomes: [
      "Structured outputs (getting reliable, parseable responses from an LLM)",
      "Multi-turn conversation context",
      "Basic code validation without executing untrusted code",
    ],
    architecture: [
      'User describes what they want ("merge two sorted arrays")',
      "Claude returns code + explanation + a brief complexity note",
      "UI displays code in an editor with the explanation alongside it",
      "Follow-ups (\"make it faster\", \"explain this line\") reuse the conversation's context",
    ],
    starterFolderStructure: "code-assistant/\n  backend/\n    main.py\n    requirements.txt\n  frontend/\n    package.json\n    app/\n      page.tsx",
    starterCode: [
      {
        filename: "backend/main.py",
        code: `from fastapi import FastAPI
from anthropic import Anthropic

app = FastAPI()
client = Anthropic()

@app.post("/generate")
async def generate(payload: dict):
    msg = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": payload["prompt"]}],
    )
    return {"code": msg.content[0].text}`,
      },
    ],
    keyDecisions: [
      "Don't execute generated code server-side — that's a real security risk. Validate syntax only, let the user run it themselves.",
      "Start with Python + JavaScript before adding more languages.",
      "Model choice is a real tradeoff: better code quality costs more per request — measure before assuming you need the most expensive model.",
    ],
  },
  {
    slug: "doc-analyzer",
    icon: "file-lines",
    name: "Document Analyzer + Q&A",
    difficulty: "Intermediate",
    timeEstimate: "2–3 weeks",
    overview:
      "Upload a document (PDF or text), ask questions about it in plain English, and get answers with citations back to the source.",
    stack: {
      backend: "FastAPI",
      frontend: "React",
      database: "PostgreSQL + pgvector",
      aiComponent: "Claude API + embeddings",
      deployment: "Vercel + Railway",
    },
    learningOutcomes: [
      "File upload and PDF parsing",
      "Vector embeddings and similarity search",
      "Citing sources instead of just answering",
    ],
    architecture: [
      "User uploads a document",
      "Split it into chunks, embed each chunk, store in a vector DB",
      "User asks a question",
      "Retrieve the most relevant chunks, pass them to Claude with the question",
      "Return the answer along with which chunk(s) it came from",
    ],
    starterFolderStructure: "doc-analyzer/\n  main.py\n  requirements.txt\n  app/\n    ingest.py\n    query.py\n  tests/",
    starterCode: [
      {
        filename: "app/ingest.py",
        code: `def chunk_document(text: str, chunk_size: int = 500) -> list[str]:
    words = text.split()
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]`,
      },
    ],
    keyDecisions: [
      "Chunk size matters: too small loses context, too large wastes tokens and dilutes relevance — 300-500 words is a reasonable starting point.",
      "Always return which chunk an answer came from. An answer with no citation isn't verifiable.",
    ],
  },
  {
    slug: "recommendation-engine",
    icon: "bullseye",
    name: "Product Recommendation Engine",
    difficulty: "Intermediate",
    timeEstimate: "2–3 weeks",
    overview: "Given a user's past behavior, recommends items they're likely to want next — collaborative filtering, refined with an LLM.",
    stack: {
      backend: "FastAPI",
      frontend: "React",
      database: "PostgreSQL",
      aiComponent: "Collaborative filtering + Claude for re-ranking/explanations",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Collaborative filtering fundamentals",
      "Using an LLM to explain a recommendation, not just generate it",
      "Evaluating recommendation quality (not just accuracy)",
    ],
    architecture: [
      "Track user interactions (views, purchases, ratings)",
      "Compute similarity between users or items",
      "Generate a candidate list of recommendations",
      "Optionally, ask Claude to explain why each one was picked, in plain language",
    ],
    starterFolderStructure: "recommender/\n  main.py\n  requirements.txt\n  app/\n    similarity.py\n    recommend.py",
    starterCode: [
      {
        filename: "app/similarity.py",
        code: `def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(y * y for y in b) ** 0.5
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0`,
      },
    ],
    keyDecisions: [
      "Cold start problem: what do you recommend to a brand-new user with no history? Decide this explicitly, don't ignore it.",
      "Measure more than accuracy — a technically-correct but boring recommendation isn't actually useful.",
    ],
  },
  {
    slug: "sentiment-dashboard",
    icon: "chart-bar",
    name: "Sentiment Analysis Dashboard",
    difficulty: "Intermediate",
    timeEstimate: "2–3 weeks",
    overview: "Classifies text (reviews, social posts) as positive/negative/neutral and visualizes trends over time.",
    stack: {
      backend: "FastAPI",
      frontend: "React + a charting library",
      database: "PostgreSQL",
      aiComponent: "Claude API for classification",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Text classification with an LLM",
      "Aggregating and visualizing results over time",
      "Batch processing at reasonable cost",
    ],
    architecture: [
      "Ingest a batch of text (reviews, posts, tickets)",
      "Classify each item's sentiment via Claude",
      "Store results with a timestamp",
      "Dashboard shows trends: is sentiment improving or declining?",
    ],
    starterFolderStructure: "sentiment-dashboard/\n  main.py\n  requirements.txt\n  app/\n    classify.py",
    starterCode: [
      {
        filename: "app/classify.py",
        code: `VALID_LABELS = {"positive", "negative", "neutral"}

def parse_sentiment(model_output: str) -> str:
    label = model_output.strip().lower()
    return label if label in VALID_LABELS else "neutral"`,
      },
    ],
    keyDecisions: [
      "Batch your classification calls where you can — classifying 100 reviews one at a time is 100x the cost and latency of a smart batch design.",
      "Decide what happens when the model's output doesn't cleanly parse into one of your labels — don't let that crash the pipeline.",
    ],
  },
  {
    slug: "blog-generator",
    icon: "pen-nib",
    name: "Blog Post Generator",
    difficulty: "Intermediate",
    timeEstimate: "2–3 weeks",
    overview: "Takes a topic and outline, generates a full draft, and refines it over multiple turns based on feedback.",
    stack: {
      backend: "FastAPI",
      frontend: "React",
      database: "PostgreSQL",
      aiComponent: "Claude API (multi-turn)",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Multi-turn prompting for iterative refinement",
      "Structured content generation (headings, sections)",
      "Basic SEO-aware generation (titles, meta descriptions)",
    ],
    architecture: [
      "User provides a topic and rough outline",
      "Claude generates a first draft, section by section",
      "User gives feedback (\"make the intro punchier\")",
      "System regenerates just that section, keeping the rest intact",
    ],
    starterFolderStructure: "blog-generator/\n  main.py\n  requirements.txt\n  app/\n    draft.py",
    starterCode: [
      {
        filename: "app/draft.py",
        code: `def build_prompt(topic: str, outline: list[str]) -> str:
    sections = "\\n".join(f"- {s}" for s in outline)
    return f"Write a blog post about '{topic}' covering:\\n{sections}"`,
      },
    ],
    keyDecisions: [
      "Regenerate sections independently, not the whole post — otherwise every small edit costs a full re-generation and loses unrelated content the user liked.",
      "Decide how much creative control the user has vs. how much you automate — full automation reads as generic.",
    ],
  },
  {
    slug: "image-classifier",
    icon: "image",
    name: "Image Classification System",
    difficulty: "Advanced",
    timeEstimate: "3–4 weeks",
    overview: "Classifies uploaded images into categories with a confidence score and a plain-English explanation.",
    stack: {
      backend: "FastAPI",
      frontend: "React",
      database: "PostgreSQL",
      aiComponent: "A vision-capable model (Claude's vision API, or a trained classifier)",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Working with image inputs instead of text",
      "Confidence scores and when to say \"I'm not sure\"",
      "Image preprocessing and validation",
    ],
    architecture: [
      "User uploads an image",
      "Validate file type and size before processing",
      "Send to the vision model for classification",
      "Return the label, confidence, and a short explanation",
    ],
    starterFolderStructure: "image-classifier/\n  main.py\n  requirements.txt\n  app/\n    validate.py\n    classify.py",
    starterCode: [
      {
        filename: "app/validate.py",
        code: `ALLOWED_TYPES = {"image/jpeg", "image/png"}
MAX_SIZE_BYTES = 10 * 1024 * 1024

def validate_image(content_type: str, size: int) -> str | None:
    if content_type not in ALLOWED_TYPES:
        return "Unsupported file type"
    if size > MAX_SIZE_BYTES:
        return "File too large"
    return None`,
      },
    ],
    keyDecisions: [
      "Always validate file type and size before sending anything to a model — untrusted uploads are a real attack surface.",
      "Report confidence honestly. A wrong answer stated confidently is worse than a correct \"not sure.\"",
    ],
  },
  {
    slug: "data-cleaning-automation",
    icon: "broom",
    name: "Data Cleaning Automation",
    difficulty: "Intermediate",
    timeEstimate: "2–3 weeks",
    overview: "Takes a messy CSV, detects and fixes common data quality issues, and produces a report of what changed.",
    stack: {
      backend: "FastAPI",
      frontend: "React (upload + report view)",
      database: "PostgreSQL",
      aiComponent: "pandas for the mechanics, Claude for domain judgment calls",
      deployment: "Railway or Render",
    },
    learningOutcomes: [
      "Real-world data cleaning at scale (this is most of Module 9's skills, applied end to end)",
      "Using an LLM for judgment calls pandas can't make alone (\"is this a typo or a real value?\")",
      "Producing an audit trail of automated changes",
    ],
    architecture: [
      "User uploads a CSV",
      "Detect issues: missing values, duplicates, inconsistent formatting, outliers",
      "Apply fixes — some rule-based, some judgment calls sent to Claude",
      "Return the cleaned file plus a report of every change made",
    ],
    starterFolderStructure: "data-cleaning/\n  main.py\n  requirements.txt\n  app/\n    detect.py\n    clean.py",
    starterCode: [
      {
        filename: "app/detect.py",
        code: `def find_missing(rows: list[dict], column: str) -> list[int]:
    return [i for i, row in enumerate(rows) if not row.get(column)]`,
      },
    ],
    keyDecisions: [
      "Never silently drop or change data — every automated fix needs to show up in the report, or the user can't trust the output.",
      "Not every judgment call needs an LLM — reserve it for genuinely ambiguous cases, and use plain rules for the rest (cheaper, faster, more predictable).",
    ],
  },
];

export const CAPSTONE_CHECKLIST: { section: string; items: string[] }[] = [
  {
    section: "Code quality",
    items: [
      "Functions are documented and named clearly — no single-letter variables",
      "No commented-out code or dead ends left behind",
      "Tests cover the core logic, not just the happy path",
    ],
  },
  {
    section: "Deployment",
    items: [
      "Live at a public URL — not just running on your laptop",
      "API keys and secrets are in environment variables, never committed to the repo",
      "Database migrations are automated, not manual SQL you ran once",
    ],
  },
  {
    section: "Monitoring",
    items: [
      "You can see logs and errors without SSHing into a server",
      "Basic usage metrics exist (requests per day, error rate, cost if using paid APIs)",
    ],
  },
  {
    section: "Documentation",
    items: [
      "README explains what it does, how to run it, and why you made the key technical choices",
      "API endpoints are documented if you built one",
    ],
  },
  {
    section: "Security",
    items: [
      "User input is validated, not trusted blindly",
      "Nothing sensitive is logged (passwords, full API keys, personal data)",
    ],
  },
];

export const CAPSTONE_RUBRIC: { category: string; weight: string; excellent: string; poor: string }[] = [
  {
    category: "Code quality",
    weight: "20%",
    excellent: "Clean, documented, no duplication, passes a linter cleanly",
    poor: "Hard to read, undocumented, or doesn't run",
  },
  {
    category: "Production readiness",
    weight: "20%",
    excellent: "Deployed, stable for 2+ weeks, meaningful test coverage, proper error handling",
    poor: "Not deployed, or breaks frequently",
  },
  {
    category: "Documentation",
    weight: "15%",
    excellent: "README covers what/why/how; setup instructions actually work",
    poor: "Missing or too thin to be useful",
  },
  {
    category: "Architecture & decisions",
    weight: "20%",
    excellent: "Clear separation of concerns; tech choices are justified; edge cases considered",
    poor: "No discernible structure or reasoning",
  },
  {
    category: "Results & metrics",
    weight: "15%",
    excellent: "Real usage data, before/after comparisons, cost awareness",
    poor: "No measurement of whether it actually works well",
  },
  {
    category: "Creativity & polish",
    weight: "10%",
    excellent: "Goes beyond the brief; UX shows real care",
    poor: "Bare minimum, rough edges everywhere",
  },
];

export const FEEDBACK_FIELDS: { key: "well" | "improve" | "question" | "learned"; label: string; ph: string }[] = [
  { key: "well", label: "What worked well (1–2 things)", ph: "e.g. Clean separation between routes and db logic…" },
  { key: "improve", label: "One thing that could improve", ph: "e.g. Passwords are compared in plain text — try bcrypt…" },
  { key: "question", label: "One question I had", ph: "e.g. Why SQLite over Postgres here?" },
  { key: "learned", label: "One thing I learned from this code", ph: "e.g. Neat use of FastAPI dependencies for auth." },
];
