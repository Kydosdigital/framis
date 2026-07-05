import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 4,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "ORDER BY + LIMIT: putting it all together",
  minutes: 22,
  concept:
    "Two clauses control what shape a result comes back in, independent of what rows are in it. ORDER BY sorts the result by a column — ascending by default, or descending with ORDER BY column DESC — and it's the only thing that guarantees an order at all; without it, a database is free to hand rows back in whatever order happens to be convenient. LIMIT n then keeps only the first n rows of whatever order the result is already in, which is why LIMIT almost always follows an ORDER BY — LIMIT on its own just chops off however many rows happened to come out, but LIMIT after an ORDER BY reliably gets you \"the top n\" or \"the bottom n\" by whatever you sorted on. Put every clause you've learned together — JOIN to link tables, WHERE to filter rows, GROUP BY to bucket them, an aggregate to summarize each bucket, ORDER BY to rank the buckets, and LIMIT to cut it down to a top-N list — and you get one of the most common real queries a backend ever runs: \"who are our top 3 customers by total spend?\"",
  conceptSimpler:
    "ORDER BY is like sorting a stack of graded tests from highest score to lowest; LIMIT 3 is then just paperclipping only the top three off that sorted stack — sort first, then cut, and you reliably get \"the top 3\" instead of whichever three happened to be on top already.",
  vizStages: [
    {
      label: "1. ORDER BY sorts the result",
      body:
        "By default ORDER BY sorts ascending (smallest or earliest first). Adding DESC flips it to descending — here, the priciest product comes first instead of last.",
      code:
        "CREATE TABLE products (id, name, price);\nINSERT INTO products VALUES (1, 'Keyboard', 42);\nINSERT INTO products VALUES (2, 'Monitor', 199);\nINSERT INTO products VALUES (3, 'Mouse', 15);\nINSERT INTO products VALUES (4, 'Desk', 250);\n\nSELECT name, price FROM products ORDER BY price DESC;\n\n-- name     | price\n-- Desk     | 250\n-- Monitor  | 199\n-- Keyboard | 42\n-- Mouse    | 15",
    },
    {
      label: "2. LIMIT cuts the result down",
      body:
        "LIMIT 2 keeps only the first two rows of whatever order the result is already in — combined with ORDER BY price DESC, that reliably means \"the 2 most expensive products,\" not just any two rows.",
      code:
        "SELECT name, price FROM products ORDER BY price DESC LIMIT 2;\n\n-- name    | price\n-- Desk    | 250\n-- Monitor | 199",
    },
    {
      label: "3. Order matters: sort, then cut",
      body:
        "LIMIT always applies to whatever order the rows are already in when it runs. That's why ORDER BY has to come before LIMIT in the query — sort first, so the first n rows LIMIT keeps are actually the top n by whatever you sorted on.",
      code:
        "-- correct: sorts, THEN keeps the top 2\nSELECT name, price FROM products ORDER BY price DESC LIMIT 2;\n\n-- if you only ever wrote LIMIT with no ORDER BY,\n-- you'd get whichever 2 rows came out first — not necessarily the biggest",
    },
    {
      label: "4. Every clause, together: top customers by spend",
      body:
        "JOIN links orders to their customers, GROUP BY buckets the joined rows by customer, SUM adds up each bucket, ORDER BY ranks the buckets biggest-first, and LIMIT keeps only the top 3 — six lessons' worth of ideas, one query.",
      code:
        "SELECT name, SUM(amount) AS total_spent\nFROM users\nJOIN orders ON users.id = orders.user_id\nGROUP BY name\nORDER BY total_spent DESC\nLIMIT 3;",
    },
  ],
  realWorldIntro:
    "Everything you've written across these four lessons is real, runnable Postgres SQL — the only thing missing from this sandbox is the plumbing that gets a Python backend talking to an actual Postgres server. A real app wires up a library like psycopg2 (or an ORM like SQLAlchemy on top of it) to open a connection to Postgres, sends this exact query as a string, and gets real rows back as Python data — then a web framework like FastAPI or Flask wraps that in a route so a browser or mobile app can request it over HTTP.",
  realWorldCode:
    "# a FastAPI route running this exact query against a real Postgres database:\nfrom fastapi import FastAPI\nimport psycopg2\n\napp = FastAPI()\n\n@app.get(\"/top-customers\")\ndef top_customers():\n    conn = psycopg2.connect(\"dbname=shop user=app\")\n    cur = conn.cursor()\n    cur.execute(\"\"\"\n        SELECT name, SUM(amount) AS total_spent\n        FROM users\n        JOIN orders ON users.id = orders.user_id\n        GROUP BY name\n        ORDER BY total_spent DESC\n        LIMIT 3;\n    \"\"\")\n    rows = cur.fetchall()\n    return [{\"name\": r[0], \"total_spent\": r[1]} for r in rows]",
  sandbox: {
    kind: "code",
    challenge:
      "Create users and orders tables, insert the rows shown, then write one query — JOIN, GROUP BY, ORDER BY, and LIMIT together — that finds the top 3 customers by total amount spent.",
    starterCode:
      "CREATE TABLE users (id, name);\nCREATE TABLE orders (id, user_id, amount);\n\nINSERT INTO users VALUES (1, 'Ava');\nINSERT INTO users VALUES (2, 'Ben');\nINSERT INTO users VALUES (3, 'Cy');\nINSERT INTO users VALUES (4, 'Dee');\n\nINSERT INTO orders VALUES (101, 1, 42);\nINSERT INTO orders VALUES (102, 1, 33);\nINSERT INTO orders VALUES (103, 2, 8);\nINSERT INTO orders VALUES (104, 3, 250);\nINSERT INTO orders VALUES (105, 3, 60);\nINSERT INTO orders VALUES (106, 4, 15);\nINSERT INTO orders VALUES (107, 2, 62);\n\nSELECT name, SUM(amount) AS total_spent\nFROM users\nJOIN orders ON users.id = orders.user_id\nGROUP BY name\nORDER BY total_spent DESC\nLIMIT 3;",
    language: "sql",
  },
  quizQuestion:
    "Running the query below, which customer's row appears first in the result, and why?",
  quizCode:
    "CREATE TABLE users (id, name);\nCREATE TABLE orders (id, user_id, amount);\n\nINSERT INTO users VALUES (1, 'Ava');\nINSERT INTO users VALUES (2, 'Ben');\nINSERT INTO users VALUES (3, 'Cy');\nINSERT INTO users VALUES (4, 'Dee');\n\nINSERT INTO orders VALUES (101, 1, 42);\nINSERT INTO orders VALUES (102, 1, 33);\nINSERT INTO orders VALUES (103, 2, 8);\nINSERT INTO orders VALUES (104, 3, 250);\nINSERT INTO orders VALUES (105, 3, 60);\nINSERT INTO orders VALUES (106, 4, 15);\nINSERT INTO orders VALUES (107, 2, 62);\n\nSELECT name, SUM(amount) AS total_spent\nFROM users\nJOIN orders ON users.id = orders.user_id\nGROUP BY name\nORDER BY total_spent DESC\nLIMIT 3;",
  quizOptions: [
    { key: "a", label: "Cy — because ORDER BY total_spent DESC sorts the highest total first, and Cy's 250 + 60 = 310 is the biggest", correct: true },
    { key: "b", label: "Cy — because Cy's rows happened to be inserted before Ava's and Ben's totals were computed", correct: false },
    { key: "c", label: "Ava — because GROUP BY always lists groups in the order users were inserted", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — GROUP BY itself doesn't guarantee any particular order; it's ORDER BY total_spent DESC that ranks the groups by their summed total, and Cy's orders add up to 310, the highest of any customer, so Cy's row comes first. Also notice Dee (15 total) doesn't appear at all — LIMIT 3 cuts the sorted list down to just the top three.",
  quizFeedbackIncorrect:
    "Not quite — insertion order and GROUP BY have no bearing on the result's order at all; only ORDER BY total_spent DESC decides the ranking. Cy's orders sum to 250 + 60 = 310, higher than any other customer's total, which is why Cy's row is ranked first.",
  takeaway:
    "ORDER BY decides the ranking and LIMIT cuts the list down to size — put after GROUP BY and an aggregate, that's exactly how a \"top N\" report gets built. You now have every core piece of real SQL: CREATE TABLE and INSERT to build data, SELECT and WHERE to read it back, JOIN to link tables, GROUP BY and aggregates to summarize it, and ORDER BY plus LIMIT to rank and trim it — the same statements a real Python backend sends straight to a real Postgres database.",
};

export default content;
