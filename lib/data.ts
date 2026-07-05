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
];

export const FEEDBACK_FIELDS: { key: "well" | "improve" | "question" | "learned"; label: string; ph: string }[] = [
  { key: "well", label: "What worked well (1–2 things)", ph: "e.g. Clean separation between routes and db logic…" },
  { key: "improve", label: "One thing that could improve", ph: "e.g. Passwords are compared in plain text — try bcrypt…" },
  { key: "question", label: "One question I had", ph: "e.g. Why SQLite over Postgres here?" },
  { key: "learned", label: "One thing I learned from this code", ph: "e.g. Neat use of FastAPI dependencies for auth." },
];
