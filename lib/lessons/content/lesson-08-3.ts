import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 3,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "A join is just two loops looking for a match",
  minutes: 20,
  concept:
    "A join combines rows from two tables based on a shared value — almost always a foreign key on one side matching a primary key on the other. Mechanically, that's exactly what a nested loop does: for every row in the outer table, loop through every row in the inner table and check whether the key columns are equal. When they match, you build a combined result that carries fields from both original rows — an order's total sitting right next to the customer's name, even though that name never lived in the orders table. Nothing about a join is magic: it's a comparison of two values, repeated for every possible pairing of rows, keeping only the pairs where the shared key lines up.",
  conceptSimpler:
    "Imagine two stacks of paper — invoices and customer folders — and for every invoice, you flip through the customer folders until you find the one whose customer number matches; that's a join, just done by hand.",
  vizStages: [
    {
      label: "1. Two separate tables",
      body:
        "A join starts with two tables that live independently, connected only by a shared key value — here, user_id on orders matches id on users.",
      code:
        "users  = [{\"id\": 1, \"name\": \"Ava\"}, {\"id\": 2, \"name\": \"Ben\"}]\norders = [{\"order_id\": 101, \"user_id\": 1, \"total\": 42}, {\"order_id\": 102, \"user_id\": 2, \"total\": 15}]",
    },
    {
      label: "2. Outer loop: one order at a time",
      body:
        "The outer for-loop picks one order. For that single order, we now need to find whichever user it belongs to.",
      code:
        "for order in orders:\n    # order is one order dict, e.g. {\"order_id\": 101, \"user_id\": 1, \"total\": 42}\n    print(order[\"order_id\"])",
    },
    {
      label: "3. Inner loop: search for the matching row",
      body:
        "Inside that, a second for-loop scans every user, testing each one against the order's user_id. This nested loop — one inside the other — is the entire mechanism of a join.",
      code:
        "for order in orders:\n    for user in users:\n        if order[\"user_id\"] == user[\"id\"]:\n            print(order[\"order_id\"], \"belongs to\", user[\"name\"])",
    },
    {
      label: "4. Combine the matched fields",
      body:
        "Once a match is found, build one combined dict pulling whichever fields you want from both sides — this merged row is what a JOIN query actually hands back to your application.",
      code:
        "joined = []\nfor order in orders:\n    for user in users:\n        if order[\"user_id\"] == user[\"id\"]:\n            joined.append({\"order_id\": order[\"order_id\"], \"customer\": user[\"name\"], \"total\": order[\"total\"]})\nprint(len(joined), \"orders joined to their customers\")",
    },
  ],
  realWorldIntro:
    "Postgres runs this same nested comparison under the hood for a JOIN, though its query planner usually replaces the brute-force nested loop with a faster strategy — like a hash join or a merge join — once an index exists on the key columns.",
  realWorldCode:
    "SELECT orders.order_id, users.name AS customer, orders.total\nFROM orders\nJOIN users ON orders.user_id = users.id;",
  sandbox: {
    kind: "code",
    challenge:
      "Write nested loops that join the orders table to the users table on user_id, then print each order's id, its customer's name, and its total.",
    starterCode:
      "users = [{\"id\": 1, \"name\": \"Ava\"}, {\"id\": 2, \"name\": \"Ben\"}, {\"id\": 3, \"name\": \"Cy\"}]\norders = [{\"order_id\": 101, \"user_id\": 1, \"total\": 42}, {\"order_id\": 102, \"user_id\": 2, \"total\": 15}, {\"order_id\": 103, \"user_id\": 1, \"total\": 8}]\n\ndef join_orders_to_users(orders, users):\n    joined = []\n    for order in orders:\n        for user in users:\n            if order[\"user_id\"] == user[\"id\"]:\n                row = {\"order_id\": order[\"order_id\"], \"customer\": user[\"name\"], \"total\": order[\"total\"]}\n                joined.append(row)\n    return joined\n\nresult = join_orders_to_users(orders, users)\nfor row in result:\n    print(row[\"order_id\"], row[\"customer\"], row[\"total\"])\nprint(\"total joined rows:\", len(result))",
  },
  quizQuestion:
    "In the nested loop below, what actually decides whether an order and a user get joined together?",
  quizCode:
    "for order in orders:\n    for user in users:\n        if order[\"user_id\"] == user[\"id\"]:\n            print(order[\"order_id\"], user[\"name\"])",
  quizOptions: [
    { key: "a", label: "Whether they appear at the same index position in their lists", correct: false },
    { key: "b", label: "Whether order[\"user_id\"] equals user[\"id\"]", correct: true },
    { key: "c", label: "Whether the inner loop happens to run before the outer loop finishes", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the if-check comparing order[\"user_id\"] to user[\"id\"] is the entire join condition; position in the list and loop order don't matter at all, only that one equality test.",
  quizFeedbackIncorrect:
    "Not quite — list position and loop order have nothing to do with it; the only thing that decides a match is the if-check comparing order[\"user_id\"] to user[\"id\"].",
  takeaway:
    "A join is a nested loop plus an equality test on a shared key — for every row on one side, scan the other side for a row whose key matches, and combine the two when it does. Real databases speed this up with indexes and smarter algorithms, but that nested comparison is the logical operation every join performs.",
};

export default content;
