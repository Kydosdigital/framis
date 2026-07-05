import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 2,
  phaseLabel: "PANDAS + DATA WRANGLING",
  title: "Cleaning messy data: handling missing values",
  minutes: 22,
  concept:
    "Once you've looked at a real dataset, you'll find gaps: a field that should hold a number or a string instead holds nothing. We model that gap as Python's None, the same way pandas models it as NaN. A missing value isn't just an annoyance — it actively breaks arithmetic, since you can't add None to a running total or compare it the way you compare a real number. So before you can compute anything across a column, you have to decide what to do about its gaps, and there are two standard strategies. The first is to drop any row that's missing the field you care about — simple and safe, but it throws away every other field on that row too, and if enough rows have gaps you can lose a lot of data. The second is to fill the gap with a stand-in value — often a fixed default like 0, or a computed one like the column's mean — which keeps every row, but quietly injects a made-up number into your data, which changes any aggregate you compute afterward. Neither strategy is \"correct\" in general; which one is right depends on the dataset and the question you're asking, but you always have to pick one on purpose. Real pandas gives you both as one-liners: df.dropna() removes any row with a gap, and df.fillna(value) fills every gap with a value (df.fillna(df.mean()) fills with the column's average). Underneath both, the mechanism is the same loop you're about to write yourself.",
  conceptSimpler:
    "A missing value is a blank cell — you can either throw away the whole row that has a blank in it, or pencil something in to fill the blank — but either way, someone has to decide which move to make, and that decision changes your numbers.",
  vizStages: [
    {
      label: "1. Spotting one missing value",
      body:
        "A missing value shows up as None sitting where a real value should be. Checking for it is a plain equality check.",
      code:
        'row = {"name": "Ben", "age": None}\nif row["age"] == None:\n    print("age is missing on this row")\nelse:\n    print(f"age is {row[\'age\']}")',
    },
    {
      label: "2. Counting how many rows are affected",
      body:
        "Before choosing a strategy, find out how bad the problem is — loop over every row and count how many are missing the field you care about.",
      code:
        'rows = []\nrows.append({"name": "Ava", "age": 29})\nrows.append({"name": "Ben", "age": None})\nrows.append({"name": "Cy", "age": 41})\nrows.append({"name": "Dee", "age": None})\n\nmissing_count = 0\nfor row in rows:\n    if row["age"] == None:\n        missing_count = missing_count + 1\nprint(f"missing age values: {missing_count} of {len(rows)} rows")',
    },
    {
      label: "3. Strategy one: drop the incomplete rows",
      body:
        "Build a new list that only keeps rows where the field isn't missing. This is exactly what df.dropna(subset=[\"age\"]) does in real pandas — same idea, one line instead of a loop.",
      code:
        'def drop_missing(rows, column):\n    clean = []\n    for row in rows:\n        if row[column] != None:\n            clean.append(row)\n    return clean\n\nrows = []\nrows.append({"name": "Ava", "age": 29})\nrows.append({"name": "Ben", "age": None})\nrows.append({"name": "Cy", "age": 41})\n\ndropped = drop_missing(rows, "age")\nprint(f"kept {len(dropped)} of {len(rows)} rows")',
    },
    {
      label: "4. Strategy two: fill the gap instead",
      body:
        "Instead of throwing rows away, replace each missing value with a stand-in — a fixed default, or a computed value like the column's mean. Notice the row count doesn't change, but the aggregate you compute afterward will, depending on what you filled in with.",
      code:
        'def mean_of(rows, column):\n    total = 0\n    count = 0\n    for row in rows:\n        if row[column] != None:\n            total = total + row[column]\n            count = count + 1\n    return total / count\n\ndef fill_missing(rows, column, fill_value):\n    filled = []\n    for row in rows:\n        value = row[column]\n        if value == None:\n            value = fill_value\n        filled.append({"name": row["name"], column: value})\n    return filled\n\nrows = []\nrows.append({"name": "Ava", "age": 29})\nrows.append({"name": "Ben", "age": None})\n\nfilled = fill_missing(rows, "age", 0)\nprint(filled)',
    },
  ],
  realWorldIntro:
    "Real pandas makes both strategies one-liners: df.dropna(subset=[\"age\"]) drops any row missing an age, df.fillna({\"age\": 0}) fills every gap with a fixed default, and df.fillna({\"age\": df[\"age\"].mean()}) fills with the column's own average instead. Which one you reach for matters — filling every gap with 0 will drag a numeric average down hard, while filling with the mean at least keeps the average unchanged, which is why \"fill with the mean\" is the far more common default in practice.",
  realWorldCode:
    '# real pandas — same two strategies as one-liners:\n# clean = df.dropna(subset=["age"])\n# filled_default = df.fillna({"age": 0})\n# filled_mean = df.fillna({"age": df["age"].mean()})',
  sandbox: {
    kind: "code",
    challenge:
      "Using the 5 rows below (2 have a missing age), implement drop_missing and fill_missing, then compare all three: the average age after dropping, the average age after filling gaps with 0, and the average age after filling gaps with the column's own mean. Notice which of these actually changes the average.",
    starterCode:
      'def mean_of(rows, column):\n    total = 0\n    count = 0\n    for row in rows:\n        if row[column] != None:\n            total = total + row[column]\n            count = count + 1\n    return total / count\n\ndef drop_missing(rows, column):\n    clean = []\n    for row in rows:\n        if row[column] != None:\n            clean.append(row)\n    return clean\n\ndef fill_missing(rows, column, fill_value):\n    filled = []\n    for row in rows:\n        value = row[column]\n        if value == None:\n            value = fill_value\n        filled.append({"name": row["name"], column: value})\n    return filled\n\nrows = []\nrows.append({"name": "Ava", "age": 29})\nrows.append({"name": "Ben", "age": None})\nrows.append({"name": "Cy", "age": 41})\nrows.append({"name": "Dee", "age": None})\nrows.append({"name": "Eli", "age": 35})\n\ndropped = drop_missing(rows, "age")\nprint(f"drop: kept {len(dropped)} of {len(rows)} rows")\nprint(f"drop: average age = {mean_of(dropped, \'age\')}")\n\nfilled_zero = fill_missing(rows, "age", 0)\nprint(f"fill-with-0: kept {len(filled_zero)} of {len(rows)} rows")\nprint(f"fill-with-0: average age = {mean_of(filled_zero, \'age\')}")\n\nfill_value = mean_of(rows, "age")\nfilled_mean = fill_missing(rows, "age", fill_value)\nprint(f"fill-with-mean: average age = {mean_of(filled_mean, \'age\')}")',
  },
  quizQuestion:
    "In the code above, dropping the 2 missing rows gives an average age of 35, but filling those same 2 gaps with 0 gives an average age of 21. Why do the two strategies disagree so much?",
  quizCode:
    'def mean_of(rows, column):\n    total = 0\n    count = 0\n    for row in rows:\n        if row[column] != None:\n            total = total + row[column]\n            count = count + 1\n    return total / count\n\ndef drop_missing(rows, column):\n    clean = []\n    for row in rows:\n        if row[column] != None:\n            clean.append(row)\n    return clean\n\ndef fill_missing(rows, column, fill_value):\n    filled = []\n    for row in rows:\n        value = row[column]\n        if value == None:\n            value = fill_value\n        filled.append({"name": row["name"], column: value})\n    return filled\n\nrows = []\nrows.append({"name": "Ava", "age": 29})\nrows.append({"name": "Ben", "age": None})\nrows.append({"name": "Cy", "age": 41})\nrows.append({"name": "Dee", "age": None})\nrows.append({"name": "Eli", "age": 35})\n\ndropped = drop_missing(rows, "age")\nprint(f"drop: average age = {mean_of(dropped, \'age\')}")\n\nfilled_zero = fill_missing(rows, "age", 0)\nprint(f"fill-with-0: average age = {mean_of(filled_zero, \'age\')}")',
  quizOptions: [
    {
      key: "a",
      label:
        "Filling with 0 keeps all 5 rows but adds two artificial zeros into the sum, dragging the average down; dropping just averages the 3 real values",
      correct: true,
    },
    {
      key: "b",
      label: "The dropped version is wrong because it changes the row count, so its average can't be trusted",
      correct: false,
    },
    {
      key: "c",
      label: "There's a bug — both strategies should always produce the exact same average no matter what",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — dropping removes Ben and Dee entirely, so the average is just over Ava, Cy, and Eli's real ages (29+41+35)/3 = 35. Filling with 0 keeps all 5 rows but treats Ben and Dee as if they were age 0, so the sum includes two fake zeros: (29+0+41+0+35)/5 = 21. Neither number is \"wrong\" exactly, but 0 was a bad choice of fill value here — it invented data that pulls the average sharply toward zero.",
  quizFeedbackIncorrect:
    "Not quite — nothing here is a bug, and the two strategies are supposed to disagree since they make different choices. Dropping removes Ben and Dee, averaging only the 3 rows with real ages. Filling with 0 keeps all 5 rows but treats the 2 missing ages as literally 0, which drags the average down hard — that's exactly why filling with a fixed default like 0 needs to be a deliberate, considered choice, not a reflex.",
  takeaway:
    "A missing value (None here, NaN in real pandas) breaks arithmetic until you deal with it. Dropping rows with gaps keeps your numbers honest but shrinks your dataset; filling gaps keeps every row but injects a value you chose — and a badly chosen fill value like 0 can distort an aggregate far more than simply dropping the row would have.",
};

export default content;
