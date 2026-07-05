import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 3,
  phaseLabel: "CI/CD + DOCKER + DEPLOYMENT",
  title: "Environment variables and secrets: configuration without hardcoding",
  minutes: 18,
  concept:
    "An environment variable is a named value that lives outside your source code and gets read in at runtime, which lets the exact same built artifact behave differently depending on where it's running — a different database URL in staging than in production, for example, with zero code changes between them. Config values that just vary by environment, like a feature flag or an API base URL, are fine to keep as plain environment variables. Secrets — API keys, database passwords, signing keys — are a stricter category: they must never be written directly into source code, because anything committed to git stays in that repository's history forever, even if you delete the line in a later commit. Instead, secrets get injected at deploy time from a dedicated secrets store or your CI/CD platform's encrypted vault, so the value exists in the running process's memory but never touches a file that gets committed. In a Next.js app this distinction also matters for a second reason: variables prefixed with NEXT_PUBLIC_ get bundled into the JavaScript sent to the browser, so putting a secret behind that prefix by mistake doesn't just risk a leaked git commit — it ships the secret to every visitor's browser directly.",
  conceptSimpler:
    "Environment variables are like a fill-in-the-blank form: you write and ship one template, then hand a different filled-in sheet to each office so the same paperwork produces the right result in each location — and you'd never print a bank password directly onto the template where anyone photocopying it could read it.",
  vizStages: [
    {
      label: "1. The hardcoded trap",
      body:
        "A database URL, or worse, an API key, gets typed directly into a source file so the app \"just works\" on the first try. It's now permanently tied to one environment and sitting in plain text in version control.",
      code: "// db.ts\nconst connection = connect(\n  \"postgres://admin:hunter2@prod-db.internal:5432/app\"\n);",
    },
    {
      label: "2. Why that's a real problem",
      body:
        "That file gets committed. Even if the line is deleted in a later commit, the password is still readable in the git history forever, and if the repo is ever made public or a collaborator's account is compromised, so is the database.",
      code: "$ git log -p -- db.ts\n# commit a1b2c3d still shows:\n# - \"postgres://admin:hunter2@prod-db.internal:5432/app\"",
    },
    {
      label: "3. Move it to an environment variable",
      body:
        "The code now reads process.env.DATABASE_URL instead of a literal string. The actual value lives in a .env file that's excluded from git via .gitignore, so the source code carries no secret at all.",
      code: "// db.ts\nconst connection = connect(process.env.DATABASE_URL);\n\n// .gitignore\n.env.local",
    },
    {
      label: "4. Different values, injected per environment",
      body:
        "The same built image reads a different DATABASE_URL depending on where it's deployed — a local dev database, a staging database, a production database — all supplied by the platform at deploy time, never baked into the code.",
      code: "# local: .env.local\nDATABASE_URL=postgres://localhost:5432/dev\n\n# production: injected by the platform's secrets manager\nDATABASE_URL=postgres://prod-db.internal:5432/app",
    },
  ],
  realWorldIntro:
    "A Next.js app reads process.env.DATABASE_URL and process.env.STRIPE_SECRET_KEY at runtime, while the actual values sit in an encrypted secrets store on the hosting platform and get injected into the container only at startup — the same Docker image can run against a test Stripe key locally and a live key in production.",
  realWorldCode:
    "// next.config.js never needs the real value\n// app code just reads it:\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\n\n// vercel.json / platform dashboard holds the actual secret,\n// encrypted at rest, injected as an env var at deploy time",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see a hardcoded secret get discovered, exposed in history, and finally handled correctly.",
    stages: [
      {
        label: "A secret gets hardcoded",
        body:
          "Under deadline pressure, a developer pastes a live Stripe secret key directly into a payment file to get something working quickly, intending to \"clean it up later.\"",
        code: "// payments.ts\nconst stripe = new Stripe(\"sk_live_51H8x...redacted...\");",
      },
      {
        label: "It gets committed and pushed",
        body:
          "The file is committed and pushed to the shared repository. From this point on, that exact key exists in the git history of every clone of the repo, whether or not the line is ever edited again.",
        code: "$ git add payments.ts\n$ git commit -m \"wire up stripe\"\n$ git push origin main",
      },
      {
        label: "\"Fixing\" it doesn't remove it",
        body:
          "A later commit swaps the key for an environment variable, which looks like a fix. But the original commit is still reachable in the repository's history, so the leaked key is still fully exposed.",
        code: "$ git log -p --all -- payments.ts\n# earlier commit still shows:\n# - const stripe = new Stripe(\"sk_live_51H8x...redacted...\");",
      },
      {
        label: "The correct response: rotate, don't just edit",
        body:
          "Once a secret has been committed, the only safe fix is to treat it as compromised: revoke the key in Stripe's dashboard, generate a new one, and store the new one only as an environment variable, never in a file that gets committed.",
        code: "// payments.ts\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\n// old key sk_live_51H8x... revoked in Stripe dashboard",
      },
      {
        label: "Same code, different key per environment",
        body:
          "With the key out of the code, the identical file works against a test key locally and a live key in production, with each platform supplying its own value through its secrets manager.",
        code: "# local .env.local (gitignored)\nSTRIPE_SECRET_KEY=sk_test_...\n\n# production, injected by the platform\nSTRIPE_SECRET_KEY=sk_live_(new, rotated)",
      },
    ],
  },
  quizQuestion:
    "A developer accidentally commits a hardcoded API key to a public GitHub repo, then deletes that line in the very next commit. Is the key safe now?",
  quizCode:
    "// commit 1\nconst apiKey = \"sk_live_abc123\";\n\n// commit 2 (the \"fix\")\nconst apiKey = process.env.API_KEY;",
  quizOptions: [
    {
      key: "a",
      label:
        "No — the key is still visible in the repository's git history in commit 1, so it must be treated as compromised and rotated immediately",
      correct: true,
    },
    {
      key: "b",
      label: "Yes — once a line is deleted in a later commit, it's permanently gone from the repository",
      correct: false,
    },
    {
      key: "c",
      label:
        "Yes, as long as a .gitignore rule for .env is added afterward, since that retroactively protects any secrets already committed",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — git preserves every prior commit, so the key is still readable by anyone who looks at the file's history, regardless of what later commits changed; the only real fix is revoking and rotating the key.",
  quizFeedbackIncorrect:
    "Not quite — deleting a line in a new commit doesn't erase the old commit where the secret still appears, and .gitignore only prevents future commits from including a file, it does nothing to history that's already there; a leaked secret has to be rotated, not just removed.",
  takeaway:
    "Treat any secret that ever touched a commit as burned — rotate it immediately, because git history keeps it forever. Going forward, secrets belong in environment variables injected at deploy time, never typed directly into source code.",
};

export default content;
