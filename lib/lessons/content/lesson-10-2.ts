import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 2,
  phaseLabel: "FEATURE ENGINEERING + SELECTION",
  title: "One-Hot vs. Label Encoding: Turning Categories Into Numbers",
  minutes: 22,
  concept:
    "Most models expect every input to be a number, but plenty of real columns are categories — strings like \"NYC\", \"LA\", \"SF\" that have no inherent numeric value. One-hot encoding solves this by giving each category its own 0/1 column: city_NYC, city_LA, city_SF, where exactly one of the three is 1 (the row's actual city) and the rest are 0. You build this by hand with two nested loops — for each row, loop over every known category and check whether it matches — no library needed, though a real pipeline would call pd.get_dummies(df['city']) or scikit-learn's OneHotEncoder() to do the identical thing across a whole column at once. Label encoding is the other common option: instead of one column per category, you assign each category a single arbitrary integer (NYC=0, LA=1, SF=2) using an if/elif chain. It's more compact, but it silently invents an ordering and a distance between categories that don't actually exist — a model doing arithmetic on that number now \"sees\" SF (2) as twice NYC (0), and LA (1) sitting exactly halfway between them, which is meaningless for city names. That's why one-hot is the safer default for nominal categories — ones with no real order, like city, color, or payment method — while label encoding is genuinely fine for ordinal categories where the order is real and meaningful, like a size of small/medium/large or a rating of low/medium/high.",
  conceptSimpler:
    "One-hot encoding is like giving each category its own yes/no checkbox — only one gets checked per row. Label encoding is writing a single number instead, which is compact but accidentally implies a ranking (\"SF is more than LA is more than NYC\") that doesn't actually exist for names like these.",
  vizStages: [
    {
      label: "1. The raw problem: strings, not numbers",
      body:
        "Each row's city is a plain string. A model can't multiply or compare \"NYC\" the way it compares numbers — before this column is useful, it has to become numeric.",
      code:
        "rows = []\nrows.append({\"city\": \"NYC\"})\nrows.append({\"city\": \"LA\"})\nrows.append({\"city\": \"SF\"})\nfor row in rows:\n    print(row[\"city\"])",
    },
    {
      label: "2. One-hot: a 0/1 column per category",
      body:
        "For a fixed list of known categories, loop through each one and check if it matches this row's city — set that category's column to 1, and every other category's column to 0.",
      code:
        "categories = [\"NYC\", \"LA\", \"SF\"]\nrow = {\"city\": \"LA\"}\nfor category in categories:\n    if row[\"city\"] == category:\n        row[f\"city_{category}\"] = 1\n    else:\n        row[f\"city_{category}\"] = 0\nprint(row)",
    },
    {
      label: "3. Label encoding: one number per category",
      body:
        "Instead of three columns, assign each category a single integer with an if/elif chain. Compact — but keep reading before reaching for this by default.",
      code:
        "row = {\"city\": \"SF\"}\nif row[\"city\"] == \"NYC\":\n    row[\"city_code\"] = 0\nelif row[\"city\"] == \"LA\":\n    row[\"city_code\"] = 1\nelif row[\"city\"] == \"SF\":\n    row[\"city_code\"] = 2\nprint(row[\"city_code\"])",
    },
    {
      label: "4. Why label encoding can mislead a model",
      body:
        "NYC=0 and SF=2 average to 1 — which happens to be LA's code. A model doing arithmetic on this column now \"sees\" LA as numerically halfway between NYC and SF, an invented relationship that has nothing to do with real cities. One-hot encoding never creates this problem, because each category gets its own independent 0/1 column with no shared number line.",
      code:
        "nyc_code = 0\nsf_code = 2\ncode_sum = nyc_code + sf_code\naverage = code_sum / 2\nprint(average)",
    },
  ],
  realWorldIntro:
    "In real pandas/scikit-learn code, one-hot encoding is one line: pd.get_dummies(df, columns=['city']) builds exactly the city_NYC/city_LA/city_SF columns you just built by hand, and scikit-learn's OneHotEncoder() does the same thing inside a training pipeline. Label encoding is similarly one line — scikit-learn's LabelEncoder().fit_transform(df['city']) — but library or not, the false-ordering risk is identical; the library doesn't protect you from using label encoding on the wrong kind of column.",
  realWorldCode:
    "# hand-built one-hot (single category check):\nfor category in categories:\n    if row[\"city\"] == category:\n        row[f\"city_{category}\"] = 1\n    else:\n        row[f\"city_{category}\"] = 0\n\n# real pandas (whole dataframe at once):\n# encoded = pd.get_dummies(df, columns=[\"city\"])\n\n# real scikit-learn label encoding (use only for real order, e.g. shirt size):\n# from sklearn.preprocessing import LabelEncoder\n# df[\"size_code\"] = LabelEncoder().fit_transform(df[\"size\"])",
  sandbox: {
    kind: "code",
    challenge:
      "Given a list of rows with a city field and a fixed categories list, use nested loops to add one-hot columns (city_NYC, city_LA, city_SF) to every row. Then, on a single separate row, use an if/elif chain to compute a label-encoded city_code (NYC=0, LA=1, SF=2) so you can compare the two approaches side by side.",
    starterCode:
      "rows = []\nrows.append({\"city\": \"NYC\"})\nrows.append({\"city\": \"LA\"})\nrows.append({\"city\": \"SF\"})\nrows.append({\"city\": \"NYC\"})\ncategories = [\"NYC\", \"LA\", \"SF\"]\n\nfor row in rows:\n    for category in categories:\n        if row[\"city\"] == category:\n            row[f\"city_{category}\"] = 1\n        else:\n            row[f\"city_{category}\"] = 0\n\nfor row in rows:\n    print(row)\n\nsingle_row = {\"city\": \"SF\"}\nif single_row[\"city\"] == \"NYC\":\n    single_row[\"city_code\"] = 0\nelif single_row[\"city\"] == \"LA\":\n    single_row[\"city_code\"] = 1\nelif single_row[\"city\"] == \"SF\":\n    single_row[\"city_code\"] = 2\nprint(single_row[\"city_code\"])",
  },
  quizQuestion:
    "This code encodes NYC=0 and SF=2, then averages the two codes. What does it print, and what does that reveal about label-encoding non-ordinal categories like city names?",
  quizCode:
    "nyc_code = 0\nsf_code = 2\ncode_sum = nyc_code + sf_code\naverage = code_sum / 2\nprint(average)",
  quizOptions: [
    {
      key: "a",
      label:
        "It prints 1 — which is exactly LA's code, even though averaging NYC and SF has no real meaning; label encoding invented a number line where none exists",
      correct: true,
    },
    {
      key: "b",
      label: "It prints 1 — confirming LA genuinely sits halfway between NYC and SF",
      correct: false,
    },
    {
      key: "c",
      label: "It raises a TypeError, since you can't do arithmetic on encoded categories",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the math runs fine, since label codes are just integers, and that's exactly the danger: the average of NYC's and SF's codes lands on LA's code purely by coincidence of assignment order, tempting a model (or a person) to read a relationship into it that isn't real.",
  quizFeedbackIncorrect:
    "Not quite — arithmetic on label-encoded integers always \"works\" in the sense that it runs without error. The real problem is that it produces a result (1, matching LA's code) that looks meaningful but reflects nothing about actual cities — that's the core risk of label-encoding a nominal category.",
  takeaway:
    "One-hot encoding gives every category its own independent 0/1 column, so a model never mistakes categories for having size or order; label encoding is a compact stand-in that's genuinely fine for truly ordinal categories (small/medium/large) but risks inventing a false numeric ordering for anything else, like city or color.",
  explainers: [
    {
      id: "what-is-one-hot-encoding",
      term: "What's One-Hot Encoding?",
      emoji: "☑️",
      shortDef:
        "One-hot encoding turns one category column into several 0/1 columns, one per possible category, with exactly one \"hot\" (1) per row.",
      longDef:
        "If a city column has three possible values, one-hot encoding replaces it with three new columns — city_NYC, city_LA, city_SF — each holding 0 or 1. For any given row, exactly one of the three is 1 (whichever city that row actually is) and the rest are 0. Every category gets equal footing: none of them is \"bigger\" or \"smaller\" than another, because they live in separate columns rather than sharing one number line.",
      whyMatters:
        "It's the safe default for categories with no real order — city, color, payment method, device type. Because each category is independent, a model can't accidentally learn a false ranking between them.",
      realWorldExample:
        "Think of it like a row of light switches, one per city. Flip on the switch for whichever city this row actually is, leave every other switch off. No switch is \"more\" than another switch — they're just on or off.",
      relatedTerms: ["what-is-label-encoding", "what-is-ordinal"],
      expandedByDefault: true,
    },
    {
      id: "what-is-label-encoding",
      term: "What's Label Encoding?",
      emoji: "🔢",
      shortDef:
        "Label encoding assigns each category a single arbitrary integer instead of building a column per category.",
      longDef:
        "Instead of city_NYC/city_LA/city_SF, label encoding stores one column, city_code, where NYC=0, LA=1, SF=2 (or any other assignment). It's more compact than one-hot encoding, but it packs every category onto a single number line, which only makes sense if the categories have a genuine order.",
      whyMatters:
        "Used on the wrong kind of column, label encoding quietly invents a fake ordering and a fake distance between categories — a model doing math on that number believes those relationships are real, even though they're just an artifact of which integer you happened to assign.",
      realWorldExample:
        "Label encoding a shirt size as small=0, medium=1, large=2 is fine — medium genuinely sits between small and large. Label encoding city as NYC=0, LA=1, SF=2 is not fine — there's no real sense in which LA is \"between\" NYC and SF.",
      relatedTerms: ["what-is-one-hot-encoding", "what-is-ordinal"],
    },
    {
      id: "what-is-ordinal",
      term: "Ordinal vs. Nominal Categories",
      emoji: "📏",
      shortDef:
        "Ordinal categories have a real order (small/medium/large). Nominal categories don't (NYC/LA/SF).",
      longDef:
        "A category is ordinal when its values have a genuine, meaningful order — low/medium/high, small/medium/large, first/second/third place. A category is nominal when the values are just distinct labels with no inherent ranking — city names, colors, payment methods. The distinction is exactly what decides whether label encoding is safe: it's fine for ordinal data, because the numbers you assign can match the real order, but it's risky for nominal data, because any order you assign is arbitrary and invented.",
      whyMatters:
        "Before encoding any category column, ask: \"is there a real order here, or am I about to invent one?\" That one question tells you whether label encoding or one-hot encoding is the right tool.",
      realWorldExample:
        "\"Small, medium, large\" is ordinal — 0, 1, 2 correctly reflects that medium is bigger than small and smaller than large. \"NYC, LA, SF\" is nominal — any numbers you assign are just labels wearing a disguise.",
      relatedTerms: ["what-is-label-encoding", "what-is-one-hot-encoding"],
    },
  ],
};

export default content;
