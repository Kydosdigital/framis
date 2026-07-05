import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 2,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "JOIN: pulling two tables together",
  minutes: 20,
  concept:
    "Real data almost never lives in one table. A users table holds accounts, an orders table holds purchases, and the two are linked by a shared value — a user_id column on orders that points back at a user's id. A JOIN is how you ask a database to stitch those two tables together in a single query: FROM orders JOIN users ON orders.user_id = users.id walks every row of orders, finds the one row in users whose id matches, and glues the two rows into one combined row so you can select columns from either side — an order's amount sitting right next to that customer's name. When a column name could mean either table (or just for clarity), qualify it as table.column, like users.name or orders.amount — or give the table a short alias with FROM users u, and write u.name instead. If an order's user_id doesn't match any row in users, that order is simply left out of the result — a JOIN only returns pairs that actually matched on both sides.",
  conceptSimpler:
    "Picture two card catalogs — one of customers, one of receipts — and JOIN is asking a clerk to walk through every receipt, find the matching customer card by account number, and staple the two together before handing you the stack; any receipt with no matching customer card just doesn't make it into the stack.",
  vizStages: [
    {
      label: "1. Two tables, linked by an id",
      body:
        "users has one row per account. orders has one row per purchase, and its user_id column stores the id of whichever user placed that order — that shared value is the only thing connecting the two tables.",
      code:
        "CREATE TABLE users (id, name);\nCREATE TABLE orders (id, user_id, item, amount);\n\nINSERT INTO users VALUES (1, 'Ava');\nINSERT INTO users VALUES (2, 'Ben');\n\nINSERT INTO orders VALUES (101, 1, 'Keyboard', 42);\nINSERT INTO orders VALUES (102, 2, 'Mouse', 15);",
    },
    {
      label: "2. JOIN ... ON names the matching columns",
      body:
        "The ON clause spells out exactly which two columns have to be equal for a users row and an orders row to be paired together — here, orders.user_id has to equal users.id.",
      code:
        "SELECT users.name, orders.item\nFROM users\nJOIN orders ON users.id = orders.user_id;",
    },
    {
      label: "3. Aliases shorten the qualified names",
      body:
        "Writing users.name and orders.item everywhere gets verbose fast. Giving each table a short alias right after its name lets you write u.name and o.item instead — same query, less typing.",
      code:
        "SELECT u.name, o.item, o.amount\nFROM users u\nJOIN orders o ON u.id = o.user_id;",
    },
    {
      label: "4. Unmatched rows disappear",
      body:
        "If an order's user_id doesn't match any row in users — say the user was deleted, or the id is just wrong — that order has no partner to pair with, so it's dropped from the result entirely. A JOIN only ever returns pairs that matched.",
      code:
        "-- orders has a row with user_id 9, but no user has id 9\nINSERT INTO orders VALUES (103, 9, 'Ghost Order', 500);\n\nSELECT u.name, o.item FROM users u JOIN orders o ON u.id = o.user_id;\n-- the Ghost Order row never shows up — nothing in users matches user_id 9",
    },
  ],
  realWorldIntro:
    "This is exactly the SQL Postgres runs for a JOIN — the difference in production is speed, not syntax: with an index on users.id and orders.user_id, Postgres can find each match almost instantly instead of scanning every row. ORMs like Django's or SQLAlchemy's generate this same JOIN under the hood when you write something like user.orders or a relationship lookup in Python — the ORM is just a translator, not a different mechanism.",
  realWorldCode:
    "# Python + an ORM, generating the same JOIN behind the scenes:\n# orders = session.query(Order).join(User).filter(User.id == order.user_id)\n#\n# ...compiles down to essentially:\n# SELECT orders.*, users.name FROM orders JOIN users ON orders.user_id = users.id;",
  sandbox: {
    kind: "code",
    challenge:
      "Create a users table and an orders table linked by user_id, insert the rows shown, then JOIN them to list each order's item and amount next to the customer's name — but only for orders over $40.",
    starterCode:
      "CREATE TABLE users (id, name);\nCREATE TABLE orders (id, user_id, item, amount);\n\nINSERT INTO users VALUES (1, 'Ava');\nINSERT INTO users VALUES (2, 'Ben');\nINSERT INTO users VALUES (3, 'Cy');\n\nINSERT INTO orders VALUES (101, 1, 'Keyboard', 42);\nINSERT INTO orders VALUES (102, 2, 'Mouse', 15);\nINSERT INTO orders VALUES (103, 1, 'Monitor', 199);\nINSERT INTO orders VALUES (104, 3, 'Desk', 250);\n\nSELECT u.name, o.item, o.amount\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.amount > 40;",
    language: "sql",
  },
  quizQuestion:
    "The orders table below has a row with user_id 9, but no user in the users table has id 9. What happens when you run this JOIN?",
  quizCode:
    "CREATE TABLE users (id, name);\nCREATE TABLE orders (id, user_id, item, amount);\n\nINSERT INTO users VALUES (1, 'Ava');\nINSERT INTO users VALUES (2, 'Ben');\n\nINSERT INTO orders VALUES (101, 1, 'Keyboard', 42);\nINSERT INTO orders VALUES (102, 2, 'Mouse', 15);\nINSERT INTO orders VALUES (103, 9, 'Ghost Order', 500);\n\nSELECT u.name, o.item\nFROM users u\nJOIN orders o ON u.id = o.user_id;",
  quizOptions: [
    { key: "a", label: "The Ghost Order row appears with name set to NULL", correct: false },
    { key: "b", label: "The query errors out because every order must have a matching user", correct: false },
    { key: "c", label: "The Ghost Order row is silently left out — only orders 101 and 102 appear, 2 rows total", correct: true },
  ],
  quizFeedbackCorrect:
    "Right — a JOIN only returns rows that matched on both sides. Order 103's user_id of 9 matches nothing in users, so that pairing never forms and the row just doesn't appear in the result — no error, no NULL placeholder, it's simply excluded.",
  quizFeedbackIncorrect:
    "Not quite — a JOIN doesn't error and doesn't fill in NULLs for unmatched rows; it only returns pairs that actually matched. Since no user has id 9, order 103 has no partner and is left out entirely, leaving just the 2 rows for Ava and Ben.",
  takeaway:
    "A JOIN combines two tables on a shared key — usually a foreign key on one side matching a primary key on the other — gluing matching rows into one combined row so you can select columns from both. Only pairs that actually match make it into the result; qualify column names with the table (or a short alias) whenever both sides could have a column of the same name.",
};

export default content;
