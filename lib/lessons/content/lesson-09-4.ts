import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 4,
  phaseLabel: "PANDAS + DATA WRANGLING",
  title: "Transforming data: group-by and aggregation",
  minutes: 25,
  concept:
    "This is the single most important operation in data wrangling, and you've actually already learned it — just wearing a different outfit. SQL's GROUP BY collapses many rows sharing the same value in a column down into one summary row per group, and pandas' df.groupby(\"city\").sum() does the exact same thing on a DataFrame. Underneath both is one mechanism: loop over every row, look at its group key (the city, the customer, whatever you're grouping by), and keep a running total keyed by that group. The trick that makes this work is a dict used as a lookup table: totals[\"NYC\"] holds the running sum for NYC, totals[\"LA\"] holds a separate running sum for LA, and so on, all accumulated in a single pass over the data. The very first time you see a new group key, you have to initialize its entry (start its total at 0) before you can add to it — skip that step, or run it on every row instead of just the first, and your \"running total\" quietly resets instead of accumulating, which is one of the most common real bugs in hand-rolled aggregation code. Once you have per-group totals and counts, an average per group is just total divided by count — the same COUNT, SUM, and AVG you already used with SQL's GROUP BY, just computed by hand instead of by a query engine.",
  conceptSimpler:
    "Group-by is sorting a pile of receipts into one stack per customer, then adding up each stack separately — a dict keyed by customer name is how the code keeps each stack's running total apart from every other stack's, all while making just one pass through the receipts.",
  vizStages: [
    {
      label: "1. Without grouping, everything collapses into one number",
      body:
        "A plain running total treats the whole table as a single bucket — useful for \"what's the grand total,\" useless for \"what's the total per city.\"",
      code:
        'rows = []\nrows.append({"city": "NYC", "amount": 40})\nrows.append({"city": "LA", "amount": 15})\nrows.append({"city": "NYC", "amount": 10})\n\ntotal = 0\nfor row in rows:\n    total = total + row["amount"]\nprint(f"total amount across ALL rows: {total}")',
    },
    {
      label: "2. A dict turns one bucket into many",
      body:
        "Instead of one total variable, use a dict keyed by city: totals[\"NYC\"] and totals[\"LA\"] are two completely separate running sums, both built in the same single loop over the rows. known_keys tracks which cities we've already set up, since the first time we see a new city we must initialize its total to 0 before adding to it.",
      code:
        'rows = []\nrows.append({"city": "NYC", "amount": 40})\nrows.append({"city": "LA", "amount": 15})\nrows.append({"city": "NYC", "amount": 10})\n\ntotals = {}\ncounts = {}\nknown_keys = []\nfor row in rows:\n    key = row["city"]\n    already_known = False\n    for k in known_keys:\n        if k == key:\n            already_known = True\n    if already_known == False:\n        known_keys.append(key)\n        totals[key] = 0\n        counts[key] = 0\n    totals[key] = totals[key] + row["amount"]\n    counts[key] = counts[key] + 1\n\nfor key in known_keys:\n    print(f"{key}: total={totals[key]}, count={counts[key]}")',
    },
    {
      label: "3. Average per group: total divided by count",
      body:
        "Once you're tracking a running total and a running count per group, the average per group falls right out — exactly the relationship between SQL's SUM(amount), COUNT(*), and AVG(amount) in the same GROUP BY query.",
      code:
        'totals = {"NYC": 50, "LA": 15}\ncounts = {"NYC": 2, "LA": 1}\nfor city in ["NYC", "LA"]:\n    avg = totals[city] / counts[city]\n    print(f"{city}: avg={avg}")',
    },
    {
      label: "4. The bug: forgetting to guard initialization",
      body:
        "If you initialize a group's total on every row instead of just the first time you see that key, you erase the running total right before adding the current row — so the \"total\" ends up being just the last row's value, not a real sum at all.",
      code:
        'rows = []\nrows.append({"city": "NYC", "amount": 40})\nrows.append({"city": "NYC", "amount": 10})\n\n# BUG: no already_known check, so this resets to 0 every single row\ntotals = {}\nfor row in rows:\n    key = row["city"]\n    totals[key] = 0\n    totals[key] = totals[key] + row["amount"]\nprint(f"NYC total (buggy): {totals[\'NYC\']}")   # should be 50, not 10',
    },
  ],
  realWorldIntro:
    "This is exactly the mechanism a database engine runs when you write SQL's GROUP BY, and exactly what df.groupby(\"city\")[\"amount\"].sum() runs in pandas — both loop over every row once, bucket it by its group key, and keep a running aggregate per bucket. pandas can also aggregate several columns and several functions at once (.agg({\"amount\": [\"sum\", \"mean\"], \"order_id\": \"count\"})), but that's the same per-group accumulation repeated for each column and function you ask for, not a different mechanism.",
  realWorldCode:
    '# real pandas — same mechanism, one line:\n# city_totals = df.groupby("city")["amount"].sum()\n# city_avgs   = df.groupby("city")["amount"].mean()\n# both_at_once = df.groupby("city")["amount"].agg(["sum", "mean", "count"])\n\n# real SQL — the same operation you already learned:\n# SELECT city, SUM(amount), AVG(amount), COUNT(*) FROM orders GROUP BY city;',
  sandbox: {
    kind: "code",
    challenge:
      "Write group_by_sum_count(rows, group_col, value_col) that returns [totals, counts, known_keys] — a dict of running sums, a dict of running counts, and the list of group keys seen, all built in a single pass over rows. Then loop over the keys and print each group's total, count, and average.",
    starterCode:
      'def group_by_sum_count(rows, group_col, value_col):\n    totals = {}\n    counts = {}\n    known_keys = []\n    for row in rows:\n        key = row[group_col]\n        already_known = False\n        for k in known_keys:\n            if k == key:\n                already_known = True\n        if already_known == False:\n            known_keys.append(key)\n            totals[key] = 0\n            counts[key] = 0\n        totals[key] = totals[key] + row[value_col]\n        counts[key] = counts[key] + 1\n    result = [totals, counts, known_keys]\n    return result\n\nrows = []\nrows.append({"city": "NYC", "amount": 40})\nrows.append({"city": "LA", "amount": 15})\nrows.append({"city": "NYC", "amount": 10})\nrows.append({"city": "SF", "amount": 100})\nrows.append({"city": "LA", "amount": 25})\nrows.append({"city": "NYC", "amount": 10})\n\nresult = group_by_sum_count(rows, "city", "amount")\ntotals = result[0]\ncounts = result[1]\nkeys = result[2]\n\nfor key in keys:\n    total = totals[key]\n    count = counts[key]\n    avg = total / count\n    print(f"{key}: total={total}, count={count}, avg={avg}")',
  },
  quizQuestion:
    "This version of the group-by loop resets totals[key] to 0 on every row instead of only the first time a key is seen. What does it print for totals[\"NYC\"]?",
  quizCode:
    'rows = []\nrows.append({"city": "NYC", "amount": 40})\nrows.append({"city": "LA", "amount": 15})\nrows.append({"city": "NYC", "amount": 10})\n\ntotals = {}\nfor row in rows:\n    key = row["city"]\n    totals[key] = 0\n    totals[key] = totals[key] + row["amount"]\n\nprint(totals["NYC"])',
  quizOptions: [
    {
      key: "a",
      label: "10 — the total gets wiped back to 0 right before every add, so only the last NYC row's amount survives",
      correct: true,
    },
    {
      key: "b",
      label: "50 — Python is smart enough to add up every row that shares the same city, regardless of the reset",
      correct: false,
    },
    {
      key: "c",
      label: "It raises a KeyError the second time \"NYC\" is used as a key",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — because totals[key] = 0 runs on every single row with no guard, each NYC row wipes out whatever was accumulated before adding its own amount. The first NYC row (40) sets totals[\"NYC\"] to 0 then adds 40, giving 40 — but the second NYC row (10) resets it to 0 again before adding 10, leaving a final value of 10. The real sum, 50, is lost because nothing protected the running total between rows.",
  quizFeedbackIncorrect:
    "Not quite — Python doesn't know these two rows are \"the same group\" unless your code tracks that itself. Here, totals[key] = 0 runs unconditionally on every row, so the second NYC row wipes out the 40 from the first NYC row before adding its own 10 — leaving totals[\"NYC\"] equal to 10, not the true sum of 50.",
  takeaway:
    "Group-by is one loop plus a dict: walk the rows once, and keep a running total (and count) per group key, initializing each new key's entry exactly once, the first time you see it. That single guarded pattern is the real mechanism behind SQL's GROUP BY and pandas' df.groupby(...).sum() alike — everything else (average, min, max, multiple aggregates at once) is a small variation on the same accumulate-per-key idea.",
};

export default content;
