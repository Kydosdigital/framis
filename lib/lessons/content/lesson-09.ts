import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 1,
  phaseLabel: "PANDAS + DATA WRANGLING",
  title: "Tables as rows: loading and exploring data",
  minutes: 20,
  concept:
    "Real-world data almost always shows up as a table — rows and columns, like a spreadsheet or a database export. In Python, the standard tool for working with tables is pandas, and its core object is the DataFrame. But strip away the library and a DataFrame is just a list of rows, where each row is a record with the same set of fields. That's exactly how we'll model it here: a table is a list of dicts, and each dict is one row — {\"name\": \"Ava\", \"age\": 29, \"city\": \"NYC\"} is a row, and its keys (\"name\", \"age\", \"city\") are its columns. This isn't a dumbed-down stand-in for pandas — it's precisely what you get back from a real DataFrame if you call df.to_dict(\"records\"). Before you clean or transform any dataset, the first move is always to get oriented: how many rows are there (its \"shape\"), what columns exist, and what do a handful of actual rows look like? Real pandas answers these with one-liners — df.shape, df.columns, df.head() — but the mechanism behind all three is the same: loop over the rows and look.",
  conceptSimpler:
    "A table is just a list of index cards, one card per row, where every card has the same labeled fields — checking a table's \"shape\" is counting the cards and reading a few of them to see what's written on each.",
  vizStages: [
    {
      label: "1. A table is a list of dicts",
      body:
        "Nothing fancy here — a row is a dict, a table is a list of those dicts. rows[0] is the first row; rows[0][\"name\"] reads the name field off of it.",
      code:
        'rows = []\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Ben", "age": None, "city": "LA"})\nrows.append({"name": "Cy", "age": 41, "city": "NYC"})\n\nprint(rows[0])\nprint(rows[0]["name"])\nprint(rows[1]["age"])',
    },
    {
      label: "2. Checking the \"shape\": how many rows?",
      body:
        "Real pandas has df.shape, which reports (num_rows, num_columns) instantly. Without it, the row count is just len(rows) — the same number, computed by hand.",
      code:
        'rows = []\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Ben", "age": None, "city": "LA"})\nrows.append({"name": "Cy", "age": 41, "city": "NYC"})\n\nprint(f"row count: {len(rows)}")',
    },
    {
      label: "3. What columns actually exist?",
      body:
        "Real pandas has df.columns, which lists every column name in one call. This sandbox's dicts don't support that lookup, so instead we check a known list of candidate column names against a row one at a time, catching KeyError for any that aren't actually there.",
      code:
        'row = {"name": "Ava", "age": 29, "city": "NYC"}\nknown_columns = ["name", "age", "city", "email"]\nfor col in known_columns:\n    try:\n        value = row[col]\n        print(f"{col}: {value}")\n    except KeyError:\n        print(f"{col}: (this column doesn\'t exist on this row)")',
    },
    {
      label: "4. Spotting issues by eye",
      body:
        "Before writing a single cleaning function, just print a sample and look. Here, Ben's age is None (missing) and Cy's city is lowercase \"nyc\" instead of \"NYC\" — a real DataFrame would show you the exact same two problems if you called df.head() on it.",
      code:
        'rows = []\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Ben", "age": None, "city": "LA"})\nrows.append({"name": "Cy", "age": 41, "city": "nyc"})\n\nfor row in rows:\n    print(row)',
    },
  ],
  realWorldIntro:
    "In real pandas, this whole lesson is three method calls: df = pd.read_csv(\"customers.csv\") loads the table, df.shape reports (rows, columns), and df.head() prints the first few rows so you can eyeball them for problems. Every one of those does exactly what our hand-written loops do underneath — pandas just hides the loop behind a method name and runs it in fast, compiled C instead of a Python for-loop.",
  realWorldCode:
    '# real pandas — same ideas as above, as one-liners:\n# df = pd.read_csv("customers.csv")\n# print(df.shape)              # (num_rows, num_columns)\n# print(df.columns.tolist())   # column names\n# print(df.head(3))            # first 3 rows, for a quick look',
  sandbox: {
    kind: "code",
    challenge:
      "Write unique_values(rows, column), which returns a list of every distinct value seen in that column (each value listed once, in the order it first appears). Then write explore(rows, column), which prints the row count and the unique values for that column, using unique_values. Try it on both \"city\" and \"age\".",
    starterCode:
      'def unique_values(rows, column):\n    seen = []\n    for row in rows:\n        value = row[column]\n        already_seen = False\n        for v in seen:\n            if v == value:\n                already_seen = True\n        if already_seen == False:\n            seen.append(value)\n    return seen\n\ndef explore(rows, column):\n    row_count = len(rows)\n    values = unique_values(rows, column)\n    print(f"rows: {row_count}")\n    print(f"unique {column} values: {values}")\n    return values\n\nrows = []\nrows.append({"name": "Ava", "city": "NYC", "age": 29})\nrows.append({"name": "Ben", "city": "LA", "age": 34})\nrows.append({"name": "Cy", "city": "NYC", "age": 41})\nrows.append({"name": "Dee", "city": "LA", "age": 29})\n\nexplore(rows, "city")\nexplore(rows, "age")',
  },
  quizQuestion:
    "unique_values walks the rows in order and only appends a value to seen the first time it shows up. Given these three rows, what does unique_values(rows, \"city\") return?",
  quizCode:
    'rows = []\nrows.append({"name": "Ava", "city": "NYC"})\nrows.append({"name": "Ben", "city": "LA"})\nrows.append({"name": "Cy", "city": "NYC"})\n\ndef unique_values(rows, column):\n    seen = []\n    for row in rows:\n        value = row[column]\n        already_seen = False\n        for v in seen:\n            if v == value:\n                already_seen = True\n        if already_seen == False:\n            seen.append(value)\n    return seen\n\nprint(unique_values(rows, "city"))',
  quizOptions: [
    { key: "a", label: "['NYC', 'LA']", correct: true },
    { key: "b", label: "['NYC', 'LA', 'NYC']", correct: false },
    { key: "c", label: "['LA', 'NYC']", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — Ava's \"NYC\" is new, so it's appended. Ben's \"LA\" is new, so it's appended. Cy's \"NYC\" has already been seen (the inner loop finds a match), so already_seen becomes True and nothing gets appended a second time. The result keeps first-seen order: NYC, then LA.",
  quizFeedbackIncorrect:
    "Not quite — walk it row by row: NYC is new (appended), LA is new (appended), and the second NYC matches something already in seen, so the inner loop sets already_seen to True and it's skipped. That leaves ['NYC', 'LA'] — two entries, in the order each first appeared.",
  takeaway:
    "A table is a list of rows, and a row is a dict — that's all a DataFrame really is underneath. Before touching a dataset, get its shape (row count), its columns (field names), and a printed sample of actual rows, so you know what you're dealing with before you try to clean or transform any of it.",
  explainers: [
    {
      id: "what-is-dataframe",
      term: "What's a DataFrame?",
      emoji: "🧮",
      shortDef:
        "A DataFrame is pandas' name for a table of data — rows and columns, like a spreadsheet, held in memory so Python code can work with it.",
      longDef:
        "pandas is the standard Python library for working with tabular data, and DataFrame is its core object. Internally a DataFrame stores data column-by-column for speed, but if you ask it for df.to_dict(\"records\") you get back exactly the shape we use in this module: a list of dicts, one per row. Learning the loop-based mechanics here transfers directly — every pandas method you'll ever call is doing this same row-by-row work, just written in fast compiled code instead of a Python for-loop.",
      whyMatters:
        "Almost every real data science or analytics task starts with loading a file into a DataFrame. If you understand what's actually happening to each row, pandas methods stop being magic incantations and start being obviously-correct shortcuts for logic you could write yourself.",
      realWorldExample:
        "pd.read_csv(\"sales.csv\") reads a spreadsheet file off disk and hands you back a DataFrame — the in-memory version of that same spreadsheet, ready for Python to filter, group, and summarize.",
      relatedTerms: ["what-is-row", "what-is-column"],
      expandedByDefault: true,
    },
    {
      id: "what-is-row",
      term: "What's a Row?",
      emoji: "📇",
      shortDef: "One row is one record — a single observation, like one customer or one order.",
      longDef:
        "In this module, a row is modeled as a Python dict, like {\"name\": \"Ava\", \"age\": 29, \"city\": \"NYC\"}. Every row in the same table shares the same set of keys, even if some values are missing — that consistent shape is what makes it a \"table\" instead of just a pile of unrelated dicts.",
      whyMatters:
        "Almost every operation in this module — filtering, deduplicating, grouping — is really \"do something once per row, in a loop.\" Getting comfortable thinking one-row-at-a-time is the whole foundation for what's ahead.",
      realWorldExample:
        "In a spreadsheet of orders, row 47 might be \"order #1042, placed by Ava, for $58.\" That's one row: one order, with several fields describing it.",
      relatedTerms: ["what-is-dataframe", "what-is-column"],
    },
    {
      id: "what-is-column",
      term: "What's a Column?",
      emoji: "🏷️",
      shortDef: "A column is one field that every row shares — like \"age\" or \"city\" — and the key you use to read it out of each row's dict.",
      longDef:
        "If a row is a dict, a column is one of its keys. \"Every row has an age column\" just means every row's dict has an \"age\" key. In real pandas, df[\"age\"] pulls that one field out of every row at once and hands you back a fast column of values; here, we get the same effect by looping over rows and reading row[\"age\"] one at a time.",
      whyMatters:
        "Most data-cleaning decisions are made per-column: \"drop rows where age is missing,\" \"group by city.\" Knowing that a column is just a shared key across every row's dict demystifies exactly what those operations touch.",
      realWorldExample:
        "In a table of customers, \"city\" is a column — every single row has some value under that key, even if that value happens to be missing on some rows.",
      relatedTerms: ["what-is-row", "what-is-missing-value"],
    },
    {
      id: "what-is-missing-value",
      term: "What's a Missing Value?",
      emoji: "❓",
      shortDef: "A missing value is a field that should have data but doesn't — modeled here as Python's None.",
      longDef:
        "Real-world data is never perfectly complete — a sensor drops a reading, a form field gets left blank, a merge doesn't find a match. pandas represents that gap with a special marker called NaN (\"Not a Number\"); in this module's plain-dict rows, we model that exact same gap with Python's None. Either way, the meaning is identical: this row exists, but this particular field's value is unknown.",
      whyMatters:
        "Missing values silently break arithmetic — you can't average a None the way you average a number — so the very first step of cleaning any dataset is finding out which fields have gaps, and deciding a deliberate strategy for handling them, which is exactly what the next lesson covers.",
      realWorldExample:
        "A signup form that doesn't require a phone number will produce rows where phone is missing for anyone who skipped it. Those rows are still real, valid signups — just incomplete ones.",
      relatedTerms: ["what-is-column"],
    },
  ],
};

export default content;
