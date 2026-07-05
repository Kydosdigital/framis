import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 3,
  phaseLabel: "PANDAS + DATA WRANGLING",
  title: "Cleaning messy data: duplicates and outliers",
  minutes: 22,
  concept:
    "Missing values aren't the only way data goes bad. Two more common problems: duplicate rows, where the exact same record got entered or merged into your table twice, and outliers, where a value is technically present but wildly outside what's normal — a typo that turns an age of 29 into 290, or a sensor glitch that reports a temperature of 9000. Detecting a duplicate means comparing two rows field by field: same name, same age, same city, on every field you care about, not just one. There's no shortcut around this — you have to write the comparison yourself, checking every field, because two rows only count as duplicates if all of them match. Detecting an outlier means picking a \"normal\" reference point (usually the column's mean) and flagging any value whose distance from that reference crosses some threshold you choose. Both of these are judgment calls with real consequences: dedupe too aggressively and you might merge two different people who happen to share a name; set an outlier threshold too tight and you'll flag legitimate extreme values as errors. Real pandas gives you both as near one-liners — df.duplicated() flags repeated rows across every column, and a z-score or IQR check flags outliers — but the logic underneath is exactly the field-by-field comparison and threshold check you're about to build.",
  conceptSimpler:
    "A duplicate is two index cards that say the exact same thing on every line — you have to actually check every line to be sure, not just glance at one field. An outlier is a card whose number is way off from what all the other cards say, further than some line you draw ahead of time.",
  vizStages: [
    {
      label: "1. Comparing two rows field by field",
      body:
        "There's no built-in \"are these dicts equal\" you can rely on here — write the comparison by hand, checking every field you care about. Two rows only count as the same if all of them match.",
      code:
        'def rows_equal(a, b):\n    if a["name"] != b["name"]:\n        return False\n    if a["age"] != b["age"]:\n        return False\n    if a["city"] != b["city"]:\n        return False\n    return True\n\nrow1 = {"name": "Ava", "age": 29, "city": "NYC"}\nrow2 = {"name": "Ava", "age": 29, "city": "NYC"}\nrow3 = {"name": "Ava", "age": 30, "city": "NYC"}\nprint(rows_equal(row1, row2))\nprint(rows_equal(row1, row3))',
    },
    {
      label: "2. Removing duplicates from a whole table",
      body:
        "Keep a running list of rows already kept, and for each new row check it against every row already in that list using rows_equal. Only append it if nothing already there matches. This is exactly what df.drop_duplicates() does under the hood.",
      code:
        'def rows_equal(a, b):\n    if a["name"] != b["name"]:\n        return False\n    if a["age"] != b["age"]:\n        return False\n    if a["city"] != b["city"]:\n        return False\n    return True\n\ndef drop_duplicates(rows):\n    unique_rows = []\n    for row in rows:\n        is_duplicate = False\n        for kept in unique_rows:\n            if rows_equal(row, kept):\n                is_duplicate = True\n        if is_duplicate == False:\n            unique_rows.append(row)\n    return unique_rows\n\nrows = []\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Ben", "age": 34, "city": "LA"})\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Cy", "age": 41, "city": "SF"})\n\ndeduped = drop_duplicates(rows)\nprint(f"before: {len(rows)} rows, after dedup: {len(deduped)} rows")',
    },
    {
      label: "3. Building \"how far from the average\" by hand",
      body:
        "There's no abs() in this sandbox, so a distance-from-average calculation needs to flip a negative difference by hand: if the difference is negative, negate it.",
      code:
        'avg = 58.5\nvalue = 29\ndiff = value - avg\nif diff < 0:\n    diff = 0 - diff\nprint(f"distance from average: {diff}")',
    },
    {
      label: "4. Flagging outliers with a threshold",
      body:
        "Compute the mean, then flag any row whose distance from that mean crosses a threshold you pick. Real pandas would compute this same distance across an entire column at once, but the logic — mean, distance, threshold — is identical.",
      code:
        'def mean_of(rows, column):\n    total = 0\n    count = 0\n    for row in rows:\n        total = total + row[column]\n        count = count + 1\n    return total / count\n\ndef find_outliers(rows, column, threshold):\n    avg = mean_of(rows, column)\n    outliers = []\n    for row in rows:\n        diff = row[column] - avg\n        if diff < 0:\n            diff = 0 - diff\n        if diff > threshold:\n            outliers.append(row)\n    return outliers\n\nages = []\nages.append({"name": "Ava", "age": 29})\nages.append({"name": "Ben", "age": 34})\nages.append({"name": "Cy", "age": 41})\nages.append({"name": "Dee", "age": 130})\n\nprint(f"average age: {mean_of(ages, \'age\')}")\noutliers = find_outliers(ages, "age", 30)\nfor o in outliers:\n    print(f"outlier: {o}")',
    },
  ],
  realWorldIntro:
    "Real pandas collapses the deduplication loop into df.drop_duplicates(), which compares every column across every row for you, and duplicated() to just flag them without removing anything. Outlier detection usually goes one step further than a raw distance-from-mean — a common real version uses the standard deviation to compute a \"z-score\" (how many standard deviations away a value is) so the threshold adapts to how spread out the data naturally is, instead of using one fixed number for every column.",
  realWorldCode:
    '# real pandas — same two checks as near one-liners:\n# deduped = df.drop_duplicates()\n# is_dup = df.duplicated()                 # True/False per row, without dropping\n# z_scores = (df["age"] - df["age"].mean()) / df["age"].std()\n# outliers = df[z_scores.abs() > 3]         # more than 3 standard deviations away',
  sandbox: {
    kind: "code",
    challenge:
      "Write rows_equal(a, b) comparing name, age, and city, then drop_duplicates(rows) using it. Separately, write mean_of(rows, column) and find_outliers(rows, column, threshold) that flags any row whose age is more than `threshold` away from the average. Run both on the sample data below.",
    starterCode:
      'def rows_equal(a, b):\n    if a["name"] != b["name"]:\n        return False\n    if a["age"] != b["age"]:\n        return False\n    if a["city"] != b["city"]:\n        return False\n    return True\n\ndef drop_duplicates(rows):\n    unique_rows = []\n    for row in rows:\n        is_duplicate = False\n        for kept in unique_rows:\n            if rows_equal(row, kept):\n                is_duplicate = True\n        if is_duplicate == False:\n            unique_rows.append(row)\n    return unique_rows\n\ndef mean_of(rows, column):\n    total = 0\n    count = 0\n    for row in rows:\n        total = total + row[column]\n        count = count + 1\n    return total / count\n\ndef find_outliers(rows, column, threshold):\n    avg = mean_of(rows, column)\n    outliers = []\n    for row in rows:\n        diff = row[column] - avg\n        if diff < 0:\n            diff = 0 - diff\n        if diff > threshold:\n            outliers.append(row)\n    return outliers\n\nrows = []\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Ben", "age": 34, "city": "LA"})\nrows.append({"name": "Ava", "age": 29, "city": "NYC"})\nrows.append({"name": "Cy", "age": 41, "city": "SF"})\nrows.append({"name": "Dee", "age": 130, "city": "LA"})\n\ndeduped = drop_duplicates(rows)\nprint(f"before dedup: {len(rows)} rows, after dedup: {len(deduped)} rows")\n\nprint(f"average age (deduped): {mean_of(deduped, \'age\')}")\noutliers = find_outliers(deduped, "age", 30)\nfor o in outliers:\n    print(f"outlier: {o}")',
  },
  quizQuestion:
    "This rows_equal was written in a hurry and forgot to compare the age field. What does it print for these two rows, and why is that a problem for deduplication?",
  quizCode:
    'def rows_equal(a, b):\n    if a["name"] != b["name"]:\n        return False\n    if a["city"] != b["city"]:\n        return False\n    return True\n\nrow1 = {"name": "Ava", "age": 29, "city": "NYC"}\nrow2 = {"name": "Ava", "age": 31, "city": "NYC"}\nprint(rows_equal(row1, row2))',
  quizOptions: [
    {
      key: "a",
      label: "True — it treats two different people (or two real, different-aged records) as duplicates, since age is never checked",
      correct: true,
    },
    {
      key: "b",
      label: "False — Python automatically compares every field even if the function only checks two of them",
      correct: false,
    },
    {
      key: "c",
      label: "It raises a KeyError because age is missing from the comparison",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — rows_equal only checks name and city, so it never even looks at age. Both checks it does perform pass (same name, same city), so it returns True and drop_duplicates would silently discard one of these rows — even though they might be two genuinely different records (or a real data point next to a typo) that just happen to share a name and city.",
  quizFeedbackIncorrect:
    "Not quite — Python doesn't add field comparisons on its own; a function only checks exactly what you write inside it. Since rows_equal here never looks at age, it doesn't matter that 29 and 31 differ — it returns True because name and city both matched, meaning drop_duplicates would treat these as duplicates and quietly drop one, even if they were two different records that share a name and city by coincidence.",
  takeaway:
    "A duplicate row is only a duplicate if every field you care about matches — comparing just one or two fields risks collapsing genuinely different records together. An outlier is a value farther from the average than some threshold you choose; both duplicate-detection and outlier-detection are judgment calls, and being explicit about exactly which fields and which threshold you used is what makes that judgment call reviewable later.",
};

export default content;
