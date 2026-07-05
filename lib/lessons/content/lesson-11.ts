import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 1,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Never store the password: hashing vs. plaintext",
  minutes: 20,
  concept:
    "When a user signs up, your database should never contain their actual password — not encrypted, not obfuscated, never. Instead you run the password through a one-way hashing function like bcrypt, which turns \"hunter2\" into something like \"$2b$12$KIXQ...\" and cannot be reversed back into the original text. At login you don't \"decrypt\" the stored value and compare strings; you hash the password the user just typed and check whether the two hashes match. This matters because databases get stolen constantly — misconfigured servers, SQL injection, leaked backups — and when that happens, plaintext passwords hand an attacker instant access to every account, while properly hashed passwords hand them a wall of unreadable noise they'd need years of computing time to crack, one password at a time. A good hashing function is also deliberately slow and includes a random \"salt\" per user, so even two people with the identical password \"password123\" end up with completely different stored hashes.",
  conceptSimpler:
    "Hashing a password is like shredding a document before throwing it away — even if someone steals the trash bag, all they get is confetti, not the original page.",
  vizStages: [
    {
      label: "1. User signs up",
      body:
        "The user submits a plaintext password over HTTPS. This is the only moment the raw password ever exists in memory on your server.",
      code: "const rawPassword = \"hunter2\";",
    },
    {
      label: "2. Hash it before saving",
      body:
        "bcrypt.hash mixes in a random salt and runs many rounds of a slow one-way function. The result is what actually gets written to the database — the raw password is discarded immediately after.",
      code: "const passwordHash = await bcrypt.hash(rawPassword, 12);\n// passwordHash = \"$2b$12$KIXQx7m9s...T5eYh6\"\nawait db.users.create({ email, passwordHash });",
    },
    {
      label: "3. Login compares hashes, not text",
      body:
        "When the user logs in later, you hash their typed password again and let bcrypt.compare check it against the stored hash — the plaintext they typed is never looked up or matched directly.",
      code: "const ok = await bcrypt.compare(typedPassword, user.passwordHash);\nif (ok) { /* log them in */ }",
    },
    {
      label: "4. A breach reveals the difference",
      body:
        "If the users table leaks, an attacker who stored plaintext gets working logins instantly. An attacker who only got hashes has to brute-force each one individually — and bcrypt's slowness makes that expensive at scale.",
      code: "// leaked plaintext row: { email, password: \"hunter2\" }        -> instant account takeover\n// leaked hashed row:    { email, passwordHash: \"$2b$12$...\" }  -> must crack per-password",
    },
  ],
  realWorldIntro:
    "In 2012, LinkedIn had 6.5 million password hashes leaked, but because they'd used an unsalted, fast SHA-1 hash instead of a slow salted one like bcrypt, attackers cracked the vast majority of them within days — the lesson the industry took away was that hashing alone isn't enough, it has to be slow and salted.",
  realWorldCode:
    "// weak: fast, unsalted hash — crackable at billions of guesses per second\nconst weakHash = sha1(password);\n\n// strong: slow, salted, tunable cost factor\nconst strongHash = await bcrypt.hash(password, 12);",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare what an attacker actually gains from a database breach under three different storage strategies.",
    stages: [
      {
        label: "Storing plaintext",
        body:
          "The password column holds the exact text the user typed. Anyone with read access to the table — a developer, an attacker, a backup file left on an open S3 bucket — can log in as any user immediately.",
        code: "{ email: \"amy@example.com\", password: \"Sunshine!22\" }\n// attacker just copies this value and logs in — done",
      },
      {
        label: "Storing a fast, unsalted hash",
        body:
          "Better than plaintext, but a fast hash like plain MD5 or SHA-1 can be brute-forced at billions of attempts per second on modern GPUs, and precomputed \"rainbow tables\" already contain hashes for every common password.",
        code: "{ email: \"amy@example.com\", passwordHash: sha1(\"Sunshine!22\") }\n// = \"d1a5f4c2b8e9...\"\n// attacker looks this hash up in a rainbow table in seconds",
      },
      {
        label: "Storing a slow, salted hash (bcrypt)",
        body:
          "bcrypt adds a random salt per user (so identical passwords produce different hashes) and is intentionally slow, so even with the database in hand, an attacker can only test a small number of guesses per second per password.",
        code: "{ email: \"amy@example.com\", passwordHash: \"$2b$12$Rk9x...Qh2fL\" }\n// salt is embedded in the hash string itself\n// cracking one password could take years of GPU time",
      },
      {
        label: "Two users, same password",
        body:
          "Because each hash includes its own random salt, two accounts that both chose \"password123\" end up with completely different stored values — an attacker can't spot repeated passwords just by scanning the table.",
        code: "// user A: passwordHash = \"$2b$12$aG7f...\"\n// user B: passwordHash = \"$2b$12$Zq1r...\"\n// same input password, unrelated-looking output hashes",
      },
      {
        label: "What login actually checks",
        body:
          "Login never reverses the hash back into a password. It hashes the freshly typed attempt (using the salt already stored in the hash) and compares the two hash strings for equality.",
        code: "const match = await bcrypt.compare(\"password123\", user.passwordHash);\n// true only if hashing the input reproduces the exact stored hash",
      },
    ],
  },
  quizQuestion:
    "Your users table is stolen by an attacker. Which storage approach limits the damage the most, and why?",
  quizCode:
    "// A: password: \"Sunshine!22\"\n// B: passwordHash: sha1(\"Sunshine!22\")\n// C: passwordHash: bcrypt.hash(\"Sunshine!22\", 12)",
  quizOptions: [
    {
      key: "a",
      label: "Plaintext, because at least there's no risk of a bug in the hashing library",
      correct: false,
    },
    {
      key: "b",
      label: "A fast unsalted hash like SHA-1, because it's still not the original password",
      correct: false,
    },
    {
      key: "c",
      label: "A slow, salted hash like bcrypt, because it's both individually salted and computationally expensive to brute-force at scale",
      correct: true,
    },
  ],
  quizFeedbackCorrect:
    "Right — bcrypt's per-user salt stops attackers from cracking all matching passwords at once, and its deliberate slowness means even a stolen database only yields a trickle of cracked accounts instead of an instant dump.",
  quizFeedbackIncorrect:
    "Not quite — plaintext hands over every account instantly, and a fast unsalted hash like SHA-1 falls to rainbow tables and GPU brute-forcing in hours; bcrypt's salt and deliberate slowness are what actually blunt a breach.",
  takeaway:
    "Never store a password you can read back — store a slow, salted hash instead, so a stolen database gives an attacker a cracking problem measured in years rather than a login page measured in seconds.",
  nextUpLabel: "CI/CD + Docker + Deployment",
};

export default content;
