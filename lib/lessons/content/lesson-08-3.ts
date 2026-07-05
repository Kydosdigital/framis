import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 3,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "GROUP BY: summarizing rows instead of listing them",
  minutes: 20,
  concept:
    "So far every query has returned one output row per input row. GROUP BY changes that: it collapses many rows sharing the same value in a column down into a single summary row per group — GROUP BY customer takes every order row and buckets them by who placed them, one bucket per distinct customer. On its own, GROUP BY isn't useful yet; it needs an aggregate function in the SELECT list to say what to compute across each bucket. COUNT(*) counts how many rows landed in the group, SUM(amount) adds up a column across the group, AVG(amount) averages it, and MIN/MAX(amount) find the smallest and largest value in the group. One subtlety trips people up constantly: COUNT(*) counts every row in the group regardless of what's in it, but COUNT(some_column) only counts rows where that column isn't NULL — so COUNT(*) and COUNT(coupon_code) can return different numbers from the exact same rows, if some orders have no coupon at all.",
  conceptSimpler:
    "Imagine dumping every receipt from the year onto a table and then sorting them into one pile per customer — GROUP BY is the sorting into piles, and COUNT/SUM/AVG/MIN/MAX are what you do to each pile afterward: count the receipts in it, add up the totals, or find the smallest and biggest.",
  vizStages: [
    {
      label: "1. COUNT(*) with no GROUP BY: one number for everything",
      body:
        "Without a GROUP BY, an aggregate treats the entire table as a single group — COUNT(*) here just answers \"how many orders exist in total,\" collapsing every row into one summary row.",
      code:
        "CREATE TABLE orders (id, customer, amount);\nINSERT INTO orders VALUES (1, 'Ava', 42);\nINSERT INTO orders VALUES (2, 'Ava', 15);\nINSERT INTO orders VALUES (3, 'Ben', 8);\n\nSELECT COUNT(*) FROM orders;\n\n-- count(*)\n-- 3",
    },
    {
      label: "2. GROUP BY splits that one bucket into many",
      body:
        "Adding GROUP BY customer changes the question to \"how many orders per customer\" — now there's one output row per distinct customer value instead of one row for the whole table.",
      code:
        "SELECT customer, COUNT(*) AS num_orders\nFROM orders\nGROUP BY customer;\n\n-- customer | num_orders\n-- Ava      | 2\n-- Ben      | 1",
    },
    {
      label: "3. SUM and AVG summarize a column per group",
      body:
        "Any aggregate can ride along in the same query — SUM(amount) adds up every order's amount within each customer's group, and AVG(amount) divides that sum by how many orders were in the group.",
      code:
        "SELECT customer, SUM(amount) AS total_spent, AVG(amount) AS avg_order\nFROM orders\nGROUP BY customer;\n\n-- customer | total_spent | avg_order\n-- Ava      | 57          | 28.5\n-- Ben      | 8           | 8",
    },
    {
      label: "4. COUNT(*) vs COUNT(column): NULLs are skipped",
      body:
        "COUNT(*) counts rows no matter what. COUNT(coupon) only counts rows where coupon isn't NULL — two orders here have no coupon at all, so COUNT(coupon) comes back much smaller than COUNT(*), even scanning the exact same three rows.",
      code:
        "CREATE TABLE orders (id, customer, amount, coupon);\nINSERT INTO orders VALUES (1, 'Ava', 42, 'SAVE10');\nINSERT INTO orders VALUES (2, 'Ben', 15, null);\nINSERT INTO orders VALUES (3, 'Cy', 8, null);\n\nSELECT COUNT(*) AS all_rows, COUNT(coupon) AS rows_with_coupon FROM orders;\n\n-- all_rows | rows_with_coupon\n-- 3        | 1",
    },
  ],
  realWorldIntro:
    "This is exactly how a real analytics dashboard is built — \"orders per day,\" \"average order value per region,\" \"signups per plan\" are all just GROUP BY plus an aggregate, run directly against Postgres by a backend endpoint. Real SQL also has a HAVING clause, which filters groups after aggregating (e.g. only customers with more than 5 orders) the way WHERE filters rows before aggregating — a good thing to know exists, even though this sandbox's SQL engine doesn't support it.",
  realWorldCode:
    "-- HAVING filters *groups*, the way WHERE filters *rows* — real Postgres only:\nSELECT customer, SUM(amount) AS total_spent\nFROM orders\nGROUP BY customer\nHAVING SUM(amount) > 100;",
  sandbox: {
    kind: "code",
    challenge:
      "Insert the six orders shown, then write a single GROUP BY query that reports each customer's number of orders, total spent, and average order size.",
    starterCode:
      "CREATE TABLE orders (id, customer, amount);\n\nINSERT INTO orders VALUES (1, 'Ava', 42);\nINSERT INTO orders VALUES (2, 'Ava', 15);\nINSERT INTO orders VALUES (3, 'Ben', 8);\nINSERT INTO orders VALUES (4, 'Cy', 250);\nINSERT INTO orders VALUES (5, 'Ava', 33);\nINSERT INTO orders VALUES (6, 'Ben', 62);\n\nSELECT customer, COUNT(*) AS num_orders, SUM(amount) AS total_spent, AVG(amount) AS avg_order\nFROM orders\nGROUP BY customer;",
    language: "sql",
  },
  quizQuestion:
    "In the query below, COUNT(*) returns 3 but COUNT(coupon) returns 1 for the exact same three rows. Why?",
  quizCode:
    "CREATE TABLE orders (id, customer, amount, coupon);\nINSERT INTO orders VALUES (1, 'Ava', 42, 'SAVE10');\nINSERT INTO orders VALUES (2, 'Ben', 15, null);\nINSERT INTO orders VALUES (3, 'Cy', 8, null);\n\nSELECT COUNT(*) AS all_rows, COUNT(coupon) AS rows_with_coupon FROM orders;",
  quizOptions: [
    { key: "a", label: "COUNT(*) counts every row; COUNT(coupon) only counts rows where coupon is not NULL", correct: true },
    { key: "b", label: "COUNT(coupon) only counts distinct coupon codes, and two of them happen to repeat", correct: false },
    { key: "c", label: "COUNT(*) is a rough estimate and COUNT(column) is the exact, correct count", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — COUNT(*) counts rows unconditionally, so all 3 orders count. COUNT(coupon) skips any row where that column is NULL, and 2 of the 3 orders have no coupon at all, leaving just 1 row counted.",
  quizFeedbackIncorrect:
    "Not quite — neither COUNT is an estimate, and this has nothing to do with distinct values. COUNT(*) counts every row no matter what; COUNT(coupon) only counts rows where coupon isn't NULL, and 2 of the 3 rows here have a NULL coupon.",
  takeaway:
    "GROUP BY collapses rows that share a column's value into one summary row per group, and an aggregate — COUNT, SUM, AVG, MIN, or MAX — decides what that summary row reports. Watch NULLs closely: COUNT(*) counts rows regardless of content, while COUNT(some_column) silently skips any row where that column is empty.",
};

export default content;
