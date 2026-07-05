import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 2,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "A table is just rows that all have the same shape",
  minutes: 20,
  concept:
    "A relational database like Postgres stores everything in tables, and a table is really just a spreadsheet with rules. Every column is declared up front with a name and a type — id is always a number, email is always text — and every single row must have a value in every one of those columns, even if it's empty or null. A row represents exactly one instance of the thing the table is about: one user, one order, one product, never a mix. Almost every table also has a primary key, a column (often called id) whose value is unique across every row and never changes once it's set, so any other part of the database can reliably point at that exact row using just that one value. That combination — fixed columns, one row per thing, and a stable unique key — is what lets a database index, search, and cross-reference millions of rows without ever getting confused about which row is which.",
  conceptSimpler:
    "Think of a table as one labeled folder in a filing cabinet — every sheet of paper inside follows the same form with the same blanks to fill in, and every sheet gets a unique file number stapled to the corner so you can always find that exact sheet again.",
  vizStages: [
    {
      label: "1. Columns are decided up front",
      body:
        "Before any data goes in, a table's columns are fixed: their names and what kind of value they hold. This is the table's schema, and every row that ever gets added has to fit it.",
      code:
        "# the \"users\" table's shape, as columns:\n# id     -> number, unique\n# name   -> text\n# email  -> text\n# plan   -> text (\"free\" or \"pro\")",
    },
    {
      label: "2. A row is one instance of the thing",
      body:
        "Each row fills in a value for every column, and represents exactly one user — never two users squeezed into one row, and never a user's data split across rows.",
      code:
        "users = [\n    {\"id\": 1, \"name\": \"Ava\", \"email\": \"ava@example.com\", \"plan\": \"pro\"},\n    {\"id\": 2, \"name\": \"Ben\", \"email\": \"ben@example.com\", \"plan\": \"free\"},\n]",
    },
    {
      label: "3. The primary key makes a row findable",
      body:
        "The id column is the primary key: its value is unique across every row in the table and never changes, even if the user renames their account or changes their email. Anywhere else in the database that needs to reference \"this exact user\" stores that id, not the name.",
      code:
        "# Ava changes her name, but her id stays 1 forever:\nusers[0][\"name\"] = \"Ava R.\"\nprint(users[0][\"id\"])",
    },
    {
      label: "4. Same shape, many rows",
      body:
        "A real users table might hold millions of rows, but every single one has the exact same columns as the first. That uniformity is what makes it possible to ask a question like \"give me every row where plan is pro\" and get a reliable answer instantly, instead of having to guess what shape each row might be in.",
      code: "for row in users:\n    print(row[\"id\"], row[\"name\"], row[\"plan\"])",
    },
  ],
  realWorldIntro:
    "In Postgres, you lock in that shape with a CREATE TABLE statement — the columns and their types are declared once, and the PRIMARY KEY constraint is what makes the database itself refuse to ever store two rows with the same id.",
  realWorldCode:
    "CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    name TEXT NOT NULL,\n    email TEXT NOT NULL,\n    plan TEXT NOT NULL\n);",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each idea below to see how a table's structure — its columns, its rows, and its keys — actually holds together.",
    stages: [
      {
        label: "The schema is a promise",
        body:
          "Every row in a table promises to have the same columns as every other row. A users table can't have one row with a phone column and another without it — the schema is decided once, for the whole table.",
        code:
          "# valid: every row has id, name, plan\n{\"id\": 1, \"name\": \"Ava\", \"plan\": \"pro\"}\n{\"id\": 2, \"name\": \"Ben\", \"plan\": \"free\"}",
      },
      {
        label: "One row = one real-world thing",
        body:
          "A row in an orders table is one order — not a customer, not a product, just that single order and the facts about it. If you find yourself wanting to cram two different kinds of things into one row, you probably need two tables instead.",
        code: "{\"order_id\": 501, \"user_id\": 1, \"total\": 42.50, \"status\": \"shipped\"}",
      },
      {
        label: "The primary key never means anything on its own",
        body:
          "A primary key like id 7 isn't a meaningful number — it's not a rank or a count of anything. Its only job is to be different from every other row's id, forever, so it can act as a permanent handle for that row.",
        code:
          "# these ids carry no meaning on their own — they just have to be unique\n{\"id\": 7, \"name\": \"Cy\"}\n{\"id\": 8, \"name\": \"Dee\"}",
      },
      {
        label: "Foreign keys point at another table's key",
        body:
          "A column can hold another table's primary key as its value — that's called a foreign key. An orders row's user_id of 1 doesn't repeat that user's whole name and email, it just stores the id, pointing back at the one row in users that has it.",
        code:
          "users  = [{\"id\": 1, \"name\": \"Ava\"}]\norders = [{\"order_id\": 501, \"user_id\": 1, \"total\": 42.50}]\n# order 501's user_id (1) points at the users row with id 1",
      },
      {
        label: "Why not just one big table?",
        body:
          "You could try to stuff every order's user info directly into the orders table, but then Ava's name is copied onto every order she's ever placed — rename her once and you'd have to fix it in hundreds of rows. Splitting into users and orders, linked by id, means her name lives in exactly one place.",
        code:
          "# repeated and fragile:\n{\"order_id\": 501, \"user_name\": \"Ava\", \"user_email\": \"ava@example.com\", \"total\": 42.50}\n\n# linked and solid:\n{\"order_id\": 501, \"user_id\": 1, \"total\": 42.50}",
      },
    ],
  },
  quizQuestion:
    "In the orders row below, which column is a foreign key — a value that points at a row in a different table?",
  quizCode: "{\"order_id\": 501, \"user_id\": 1, \"total\": 42.50, \"status\": \"shipped\"}",
  quizOptions: [
    { key: "a", label: "order_id — it uniquely identifies this row", correct: false },
    { key: "b", label: "user_id — it references a row in the users table", correct: true },
    { key: "c", label: "total — it's the dollar amount for the order", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — order_id is this row's own primary key, and total/status are just data about the order, but user_id holds someone else's primary key value, which is exactly what makes it a foreign key.",
  quizFeedbackIncorrect:
    "Not quite — order_id and total both describe this row itself; user_id is the one column whose value is actually another table's primary key, which is what makes it a foreign key.",
  takeaway:
    "A table is nothing more than rows that all share the same columns, each row standing for one real thing, with a primary key giving every row a permanent, unique handle — and foreign keys are how one row points at another table's row instead of copying its data. That structure is exactly what makes joins possible, which is next.",
};

export default content;
