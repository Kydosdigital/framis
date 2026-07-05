import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 1,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "CREATE, INSERT, SELECT: your first real table",
  minutes: 20,
  concept:
    "Every relational database — Postgres included — starts from the same three moves. First, CREATE TABLE declares the shape of your data once: a name for the table and a name for every column it will ever have. Nothing is stored yet, only the promise of what a row will look like. Second, INSERT INTO adds one row at a time, supplying a value for each column in the exact order the table declared them — that's the entire mechanism for getting data into a database, no matter how large the table eventually grows. Third, SELECT reads rows back out: SELECT * FROM table asks for every column of every row, and adding WHERE narrows that down to only the rows matching a condition — the database checks that condition against each row and keeps only the ones that pass. Those three statements, in that order, are how data is born, and how you ask for it again.",
  conceptSimpler:
    "CREATE TABLE is drawing the blank form; INSERT INTO is filling out one copy of that form per person; SELECT ... WHERE is asking a filing clerk to hand you only the forms that match a rule you give them.",
  vizStages: [
    {
      label: "1. CREATE TABLE declares the shape",
      body:
        "Before any data exists, you name the table and list its columns. No rows are stored by this statement alone — it just fixes what every future row will have to look like.",
      code: "CREATE TABLE users (id, name, plan, age);",
    },
    {
      label: "2. INSERT INTO adds one row",
      body:
        "Each INSERT supplies a value for every column, in the same order the table declared them — the first value fills id, the second fills name, and so on. Run it once per row you want to add.",
      code:
        "INSERT INTO users VALUES (1, 'Ava', 'pro', 29);\nINSERT INTO users VALUES (2, 'Ben', 'free', 34);\nINSERT INTO users VALUES (3, 'Cy', 'pro', 22);",
    },
    {
      label: "3. SELECT * reads every column back",
      body:
        "SELECT * FROM users asks for all columns of every row that's been inserted so far — this is the plainest possible query, with nothing filtered out yet.",
      code: "SELECT * FROM users;\n\n-- id | name | plan | age\n-- 1  | Ava  | pro  | 29\n-- 2  | Ben  | free | 34\n-- 3  | Cy   | pro  | 22",
    },
    {
      label: "4. WHERE keeps only the rows that pass",
      body:
        "Adding WHERE tests every row against a condition and keeps only the ones that match — the database checks plan = 'pro' against each row in turn, the same way you'd flip through index cards pulling out only the ones that fit a rule.",
      code: "SELECT name, age FROM users WHERE plan = 'pro';\n\n-- name | age\n-- Ava  | 29\n-- Cy   | 22",
    },
  ],
  realWorldIntro:
    "The CREATE TABLE, INSERT INTO, and SELECT statements you just wrote are not a simulation of SQL — they're real SQL, and Postgres accepts this exact syntax. A production table adds two things this sandbox skips: column types (id is an INTEGER, name is TEXT) and a persistent disk file, so the data survives after the program exits instead of resetting every time you hit run.",
  realWorldCode:
    "-- what the same table looks like in real Postgres,\n-- with types and a primary key:\nCREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    name TEXT NOT NULL,\n    plan TEXT NOT NULL,\n    age INTEGER\n);",
  sandbox: {
    kind: "code",
    challenge:
      "Create a users table with columns id, name, plan, and age. Insert the five rows shown, then write a SELECT that returns just the name and age of every user on the \"pro\" plan.",
    starterCode:
      "CREATE TABLE users (id, name, plan, age);\n\nINSERT INTO users VALUES (1, 'Ava', 'pro', 29);\nINSERT INTO users VALUES (2, 'Ben', 'free', 34);\nINSERT INTO users VALUES (3, 'Cy', 'pro', 22);\nINSERT INTO users VALUES (4, 'Dee', 'free', 41);\nINSERT INTO users VALUES (5, 'Eli', 'pro', 31);\n\nSELECT name, age FROM users WHERE plan = 'pro';",
    language: "sql",
  },
  quizQuestion:
    "Given the same users table, how many rows does this query return?",
  quizCode:
    "CREATE TABLE users (id, name, plan, age);\n\nINSERT INTO users VALUES (1, 'Ava', 'pro', 29);\nINSERT INTO users VALUES (2, 'Ben', 'free', 34);\nINSERT INTO users VALUES (3, 'Cy', 'pro', 22);\nINSERT INTO users VALUES (4, 'Dee', 'free', 41);\nINSERT INTO users VALUES (5, 'Eli', 'pro', 31);\n\nSELECT name FROM users WHERE plan = 'pro' AND age > 25;",
  quizOptions: [
    { key: "a", label: "3 rows — every user on the pro plan", correct: false },
    { key: "b", label: "2 rows — only pro-plan users older than 25 (Ava and Eli; Cy is 22, too young)", correct: true },
    { key: "c", label: "0 rows — AND can't combine two different columns in one WHERE", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — AND requires both conditions to hold for the same row. Ava (pro, 29) and Eli (pro, 31) both pass; Cy is on the pro plan but is only 22, so the age check fails and that row is dropped.",
  quizFeedbackIncorrect:
    "Not quite — AND means both conditions must be true for a row to survive. Cy is pro but only 22, so age > 25 fails for that row; only Ava (29) and Eli (31) pass both checks, which makes it 2 rows.",
  takeaway:
    "CREATE TABLE fixes a table's columns once, INSERT INTO appends one row at a time in that column order, and SELECT ... WHERE reads rows back out, keeping only the ones that pass a condition. That loop — declare the shape, add rows, query them back — is the foundation everything else in SQL builds on.",
};

export default content;
