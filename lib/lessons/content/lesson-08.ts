import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 1,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "The WHERE clause is just a loop and an if",
  minutes: 20,
  concept:
    "When your app asks a database for \"users where plan equals pro,\" something very unglamorous is happening underneath: the database walks through rows one at a time and keeps only the ones that pass a test. You can simulate that exact process yourself with plain code, before you ever touch real SQL. Represent a table as a list of dictionaries, where each dictionary is one row and each key is a column — a \"users\" table becomes a list of {\"id\": ..., \"name\": ..., \"plan\": ...} objects. To run a query, loop over that list with a for-loop, and inside the loop, test the condition you care about with an if-statement. Every row that passes the if-check gets appended to a brand-new list, and that new list is your query result — same shape as what a real database would hand back. There's no magic \"database\" behavior involved: it's a list, a loop, and a condition, and that's the mental model underneath every WHERE clause you'll ever write.",
  conceptSimpler:
    "Think of a bouncer flipping through a stack of ID cards one at a time and only pulling the ones where the birthdate matches the rule they were given — the WHERE clause is just the bouncer's rule for which cards get pulled aside.",
  vizStages: [
    {
      label: "1. The \"table\" is a list of dicts",
      body:
        "Before any querying happens, the data has to exist somewhere. Here it's a plain Python list, and each row is a dictionary — the keys are column names, the values are that row's data for each column.",
      code: "users = [\n    {\"id\": 1, \"name\": \"Ava\", \"plan\": \"pro\"},\n    {\"id\": 2, \"name\": \"Ben\", \"plan\": \"free\"},\n    {\"id\": 3, \"name\": \"Cy\", \"plan\": \"pro\"},\n]",
    },
    {
      label: "2. Looping is the table scan",
      body:
        "A for-loop visits every single row in order, one at a time, with nothing skipped. This is exactly what a database does when it can't use an index — it's called a \"sequential scan,\" and it's the brute-force way to check every row.",
      code: "for row in users:\n    # row is now one dict at a time:\n    # {\"id\": 1, \"name\": \"Ava\", \"plan\": \"pro\"}\n    print(row[\"name\"])",
    },
    {
      label: "3. The if-check is the WHERE clause",
      body:
        "Inside the loop, an if-statement tests one row against a condition. This single line is the entire WHERE clause — everything else in the function is just plumbing to get here and to collect what passes.",
      code: "for row in users:\n    if row[\"plan\"] == \"pro\":\n        # this row matches the WHERE clause\n        print(row[\"name\"], \"is a match\")",
    },
    {
      label: "4. Appending builds the result set",
      body:
        "Every row that passes the if-check gets appended to a fresh, empty list. When the loop finishes, that list holds exactly the rows a database would return — this is the SELECT result.",
      code: "matches = []\nfor row in users:\n    if row[\"plan\"] == \"pro\":\n        matches.append(row)\n\nprint(len(matches), \"rows matched\")",
    },
  ],
  realWorldIntro:
    "In a real backend, calling something like User.objects.filter(plan=\"pro\") in an ORM, or sending raw SQL straight to Postgres, triggers this same scan-and-check logic inside the database engine — the difference is Postgres can use an index to skip most of the scanning instead of checking every single row.",
  realWorldCode: "SELECT * FROM users WHERE plan = 'pro';",
  sandbox: {
    kind: "code",
    challenge:
      "Write a function that scans a list of user rows and returns only the ones on the \"pro\" plan, mimicking a SQL WHERE clause — then print how many matched and each of their names.",
    starterCode:
      "users = [{\"id\": 1, \"name\": \"Ava\", \"plan\": \"pro\"}, {\"id\": 2, \"name\": \"Ben\", \"plan\": \"free\"}, {\"id\": 3, \"name\": \"Cy\", \"plan\": \"pro\"}, {\"id\": 4, \"name\": \"Dee\", \"plan\": \"free\"}]\n\ndef find_by_plan(rows, plan):\n    matches = []\n    for row in rows:\n        if row[\"plan\"] == plan:\n            matches.append(row)\n    return matches\n\npro_users = find_by_plan(users, \"pro\")\nprint(\"pro users found:\", len(pro_users))\nfor row in pro_users:\n    print(row[\"name\"])",
  },
  quizQuestion:
    "In the function below, which line is doing the actual filtering — the direct equivalent of a SQL WHERE clause?",
  quizCode:
    "def find_active_admins(rows):\n    matches = []\n    for row in rows:\n        if row[\"role\"] == \"admin\" and row[\"active\"] == True:\n            matches.append(row)\n    return matches\n\nrows = [{\"name\": \"Ava\", \"role\": \"admin\", \"active\": True}, {\"name\": \"Ben\", \"role\": \"admin\", \"active\": False}]\nresult = find_active_admins(rows)\nprint(len(result))",
  quizOptions: [
    { key: "a", label: "for row in rows: — it's what visits every row in the table", correct: false },
    { key: "b", label: "if row[\"role\"] == \"admin\" and row[\"active\"] == True: — it's the condition each row must pass", correct: true },
    { key: "c", label: "matches.append(row) — it's what builds the returned result set", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the for-loop just walks every row (like scanning the whole table) and append just collects whatever survives, but the if-statement is the one place that decides pass or fail, which is exactly what a WHERE clause does.",
  quizFeedbackIncorrect:
    "Not quite — the for-loop only visits rows and append only saves rows that already passed, neither one decides anything; the if-statement is the single line making the pass-or-fail decision, which is what a WHERE clause actually is.",
  takeaway:
    "Any WHERE clause, at its core, is a scan plus a condition: visit every row, test it, keep the ones that pass. Real databases add indexes and query planners to skip work, but the logical shape never changes — a loop and an if is the whole idea.",
  nextUpLabel: "Testing (unit/integration/e2e)",
};

export default content;
