import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 1,
  phaseLabel: "FEATURE ENGINEERING + SELECTION",
  title: "Feature Engineering: Turning Raw Columns Into Signal",
  minutes: 20,
  concept:
    "A machine learning model never sees your raw data the way you do — it only sees numbers, and it treats every number purely as a number, with no idea what it \"means.\" A raw timestamp like minute 510 of the day is technically a number, but it's nearly useless to a simple model on its own: the model has to somehow discover, from scratch, that minutes 480-539 cluster into a meaningful \"morning\" pattern, or that day-of-week matters for some things but not others. Feature engineering is the practice of doing some of that translation yourself before the data ever reaches the model — deriving new columns like hour_of_day (a simple integer division) or is_weekend (a boolean flag) that put a pattern you already know is there into a form the model can use directly, instead of forcing it to reverse-engineer that pattern from raw numbers. The same idea applies to ratios (pages viewed per minute tells you more about engagement than either raw count alone) and bucketed categories (grouping a continuous score into \"low/medium/high\" bands). None of this is exotic math — it's loops and conditionals computing new values from old ones, one row at a time — but it's often the single biggest lever you have over a model's accuracy, more so than which algorithm you pick.",
  conceptSimpler:
    "Raw data is like a fact sheet with no summary — feature engineering is writing the summary yourself (the busy hour, whether it's a weekend, whether this row looks \"engaged\") so the model doesn't have to guess it from a wall of raw numbers.",
  vizStages: [
    {
      label: "1. Raw data, no obvious pattern",
      body:
        "Here's a single row of raw session data. minute_of_day is just a number from 0 to 1439 — nothing about the number 510 by itself tells a model \"this is morning\" or \"this is a weekday.\"",
      code:
        "row = {\"minute_of_day\": 510, \"day_of_week\": 0, \"pages_viewed\": 8, \"minutes_on_site\": 4}\nprint(row)",
    },
    {
      label: "2. Derive hour_of_day with integer division",
      body:
        "// (floor division) turns minute-of-day into a 0-23 hour bucket. \"Morning vs. evening\" is now a small, learnable category instead of one of 1440 possible raw values.",
      code:
        "row = {\"minute_of_day\": 510}\nprint(row[\"minute_of_day\"] // 60)",
    },
    {
      label: "3. Derive is_weekend as a boolean flag",
      body:
        "day_of_week runs 0-6; using a Monday-first convention, Saturday and Sunday are 5 and 6. A single or comparison turns that into a clean True/False flag.",
      code:
        "row = {\"day_of_week\": 5}\nis_weekend = row[\"day_of_week\"] == 5 or row[\"day_of_week\"] == 6\nprint(is_weekend)",
    },
    {
      label: "4. Derive a ratio, then bucket it",
      body:
        "pages_viewed / minutes_on_site — a ratio feature — is more informative than either raw number alone. Bucketing it into low/medium/high with if/elif turns a continuous ratio into a simple category a model, or a human reading a dashboard, can reason about.",
      code:
        "pages_viewed = 3\nminutes_on_site = 6\npages_per_minute = pages_viewed / minutes_on_site\nprint(pages_per_minute)\nif pages_per_minute < 1:\n    bucket = \"low\"\nelif pages_per_minute < 3:\n    bucket = \"medium\"\nelse:\n    bucket = \"high\"\nprint(bucket)",
    },
  ],
  realWorldIntro:
    "This exact translation is why feature engineering is often called the highest-leverage step in a modeling pipeline — you're injecting domain knowledge the model has no way to discover on its own. In real pandas code you'd do this across an entire column at once instead of looping row by row: df['hour_of_day'] = df['minute_of_day'] // 60, df['is_weekend'] = df['day_of_week'].isin([5, 6]), and df['engagement_bucket'] = pd.cut(df['pages_per_minute'], bins=[0, 1, 3, float('inf')], labels=['low', 'medium', 'high']). The engineered features are identical — pandas just vectorizes the loop you're about to write by hand.",
  realWorldCode:
    "# hand-built (one row at a time):\nrow[\"hour_of_day\"] = row[\"minute_of_day\"] // 60\nrow[\"is_weekend\"] = row[\"day_of_week\"] == 5 or row[\"day_of_week\"] == 6\n\n# real pandas (whole column at once):\n# df[\"hour_of_day\"] = df[\"minute_of_day\"] // 60\n# df[\"is_weekend\"] = df[\"day_of_week\"].isin([5, 6])",
  sandbox: {
    kind: "code",
    challenge:
      "Given a list of raw session rows, derive three new features on each row: hour_of_day (an integer hour from minute_of_day), is_weekend (a boolean from day_of_week), and engagement_bucket (\"low\"/\"medium\"/\"high\" from the pages_viewed-per-minute ratio). Print a summary line per row.",
    starterCode:
      "rows = []\nrows.append({\"minute_of_day\": 510, \"day_of_week\": 0, \"pages_viewed\": 8, \"minutes_on_site\": 4})\nrows.append({\"minute_of_day\": 1330, \"day_of_week\": 5, \"pages_viewed\": 3, \"minutes_on_site\": 6})\nrows.append({\"minute_of_day\": 60, \"day_of_week\": 6, \"pages_viewed\": 12, \"minutes_on_site\": 3})\nrows.append({\"minute_of_day\": 720, \"day_of_week\": 2, \"pages_viewed\": 5, \"minutes_on_site\": 5})\n\nfor row in rows:\n    row[\"hour_of_day\"] = row[\"minute_of_day\"] // 60\n    row[\"is_weekend\"] = row[\"day_of_week\"] == 5 or row[\"day_of_week\"] == 6\n    pages_per_minute = row[\"pages_viewed\"] / row[\"minutes_on_site\"]\n    if pages_per_minute < 1:\n        row[\"engagement_bucket\"] = \"low\"\n    elif pages_per_minute < 3:\n        row[\"engagement_bucket\"] = \"medium\"\n    else:\n        row[\"engagement_bucket\"] = \"high\"\n    print(f\"hour={row['hour_of_day']} weekend={row['is_weekend']} bucket={row['engagement_bucket']}\")",
  },
  quizQuestion:
    "row = {\"minute_of_day\": 845, \"day_of_week\": 3}. You derive hour_of_day with // 60 and is_weekend by checking day_of_week against 5 and 6. What do the two prints show?",
  quizCode:
    "row = {\"minute_of_day\": 845, \"day_of_week\": 3}\nrow[\"hour_of_day\"] = row[\"minute_of_day\"] // 60\nrow[\"is_weekend\"] = row[\"day_of_week\"] == 5 or row[\"day_of_week\"] == 6\nprint(row[\"hour_of_day\"], row[\"is_weekend\"])",
  quizOptions: [
    { key: "a", label: "14 False", correct: true },
    { key: "b", label: "14 True", correct: false },
    { key: "c", label: "13 False", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — 845 // 60 floors down to 14 (14 * 60 = 840, with 5 minutes left over), and day_of_week 3 is Thursday, which matches neither 5 nor 6, so is_weekend evaluates to False.",
  quizFeedbackIncorrect:
    "Not quite — // is floor (integer) division, so 845 // 60 rounds down to 14 rather than up to 15; and since day_of_week is 3 (Thursday), it doesn't equal 5 or 6, so is_weekend is False.",
  takeaway:
    "A model only ever sees numbers, not meaning — feature engineering is the loop-and-conditional work of deriving columns (hour_of_day, is_weekend, a ratio, a bucketed category) that put a pattern you already know exists into a form the model can actually use, and it's frequently a bigger accuracy lever than the choice of algorithm itself.",
  explainers: [
    {
      id: "what-is-feature",
      term: "What's a Feature?",
      emoji: "🧩",
      shortDef:
        "A feature is just one input column a model looks at — age, income, hour_of_day, is_weekend. \"Feature\" is the ML word for \"column used as input.\"",
      longDef:
        "Every column you feed into a model is called a feature. Some features come straight from your raw data (a column your database already has); others are engineered — computed from one or more raw columns, like hour_of_day computed from minute_of_day. A model doesn't distinguish between the two once training starts; it just sees a list of numbers per row. The difference matters entirely to you, the person deciding what those numbers should contain.",
      whyMatters:
        "The features you hand a model set a hard ceiling on what it can possibly learn. A model can't discover a pattern that isn't representable in some feature you gave it — no algorithm, however powerful, can invent hour_of_day out of a raw minute count on its own.",
      realWorldExample:
        "If you're predicting whether someone will finish an order, \"minutes since they added the last item to their cart\" is a feature you'd have to build — it isn't sitting in any raw column, it's computed from two timestamps that are.",
      relatedTerms: ["what-is-feature-engineering"],
      expandedByDefault: true,
    },
    {
      id: "what-is-feature-engineering",
      term: "What's Feature Engineering?",
      emoji: "🛠️",
      shortDef:
        "Feature engineering is creating new, more useful columns out of the raw columns you already have.",
      longDef:
        "Feature engineering covers any transformation you apply to raw data before a model sees it: deriving hour_of_day from a timestamp, computing a ratio like pages_per_minute, bucketing a continuous score into low/medium/high, or one-hot encoding a category. It's called \"engineering\" because it's deliberate design work — you're using what you know about the problem to hand the model a head start, instead of making it discover everything from raw numbers alone.",
      whyMatters:
        "In practice, good feature engineering often improves a model's accuracy more than switching to a fancier algorithm does. A simple model with well-engineered features regularly beats a complex model fed only raw columns.",
      realWorldExample:
        "A raw \"account_created_at\" timestamp is nearly useless to most models. \"account_age_in_days\" (a single subtraction) turns that same timestamp into one of the most predictive features in a typical churn model.",
      relatedTerms: ["what-is-feature"],
    },
  ],
};

export default content;
