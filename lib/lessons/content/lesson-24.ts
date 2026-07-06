import type { LessonData } from "../types";

const content: LessonData = {
  num: 24,
  orderIndex: 1,
  phaseLabel: "FINE-TUNING + DATASET QUALITY",
  title: "100 clean examples beat 10,000 messy ones",
  minutes: 20,
  concept:
    "When you fine-tune a model, it doesn't learn the task you meant to teach — it learns the exact pattern sitting in your training examples, including every inconsistency, contradiction, and mislabeled row. A dataset of 10,000 examples where the formatting wanders, the tone shifts, and a chunk of the labels are just wrong will teach the model to be inconsistent, because \"sometimes do it this way, sometimes do it that way\" is a real pattern it will faithfully reproduce. A dataset of 100 examples that are consistently formatted, cover a genuinely diverse set of real cases, and are correctly labeled gives the model one clear signal to lock onto, and it will generalize from that signal far better than it generalizes from noise. Size only helps once quality is already high — piling more messy examples on top of a messy dataset just teaches the model to be confidently wrong at a larger scale. This is why experienced teams spend most of their fine-tuning time auditing and cleaning examples by hand, not scraping more data.",
  conceptSimpler:
    "Training a model on a messy dataset is like a student studying from lecture notes where half the definitions contradict each other — more pages of contradictory notes don't help them learn faster, they just learn to be unsure.",
  vizStages: [
    {
      label: "1. Same task, two datasets",
      body:
        "Imagine fine-tuning a model to classify support tickets as \"billing\", \"bug\", or \"question\". Dataset A has 10,000 rows scraped from old support logs. Dataset B has 150 rows a human carefully reviewed.",
      code: "datasetA.length; // 10,000 (scraped, unreviewed)\ndatasetB.length; // 150   (hand-audited)",
    },
    {
      label: "2. What's actually inside dataset A",
      body:
        "Some rows label the same kind of ticket differently depending on who wrote it, some completions include stray notes like \"(check with Dana)\" that leaked in from an internal tool, and formatting ranges from full sentences to one-word answers.",
      code: "{ prompt: \"Card was charged twice\", completion: \"billing\" }\n{ prompt: \"Charged twice for one order\", completion: \"bug\" } // contradicts above\n{ prompt: \"App crashes on login\", completion: \"Bug - (check with Dana)\" }",
    },
    {
      label: "3. What's inside dataset B",
      body:
        "Every row follows the same label set and format, edge cases are represented on purpose (ambiguous tickets, short tickets, angry-tone tickets), and a human double-checked every label before it went in.",
      code: "{ prompt: \"Card was charged twice\", completion: \"billing\" }\n{ prompt: \"Charged twice for one order\", completion: \"billing\" }\n{ prompt: \"App crashes on login\", completion: \"bug\" }",
    },
    {
      label: "4. The model trained on each",
      body:
        "The model fine-tuned on the 10,000 messy rows learns that ticket categories are fuzzy and interchangeable, so its predictions on new tickets are inconsistent. The model fine-tuned on the 150 clean rows learns a crisp boundary between categories and applies it reliably to tickets it has never seen.",
      code: "// messy-trained model on a new ticket:\nclassify(\"Charged for canceled plan\"); // \"bug\" one run, \"billing\" the next\n\n// clean-trained model on the same ticket:\nclassify(\"Charged for canceled plan\"); // \"billing\", consistently",
    },
  ],
  realWorldIntro:
    "OpenAI's own fine-tuning guidance explicitly recommends starting with a small set of 50-100 carefully reviewed examples rather than dumping in every log you have, because a handful of clean examples exposes bad patterns you can fix before they get baked into thousands of rows.",
  realWorldCode:
    "// before scaling up, audit a small batch by hand:\nconst sample = trainingSet.slice(0, 50);\n// check: same label schema? same output format? any wrong labels?\n// fix the pattern here first — then decide if you even need more rows",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each training example pair and decide what makes it good or bad before reading the explanation.",
    stages: [
      {
        label: "Example 1: inconsistent format",
        body:
          "The completion format doesn't match the rest of the dataset — some rows return a bare word, this one returns a full sentence with extra punctuation. A model trained on a mix of formats will randomly pick one at inference time.",
        code: "{ prompt: \"Refund never arrived\", completion: \"This is definitely a billing issue!!\" }\n// rest of dataset uses: completion: \"billing\"",
      },
      {
        label: "Example 2: contradictory label",
        body:
          "This prompt is nearly identical to another example elsewhere in the set, but labeled differently with no clear reason why. The model can't learn a rule from two contradictory data points — it just learns that the rule doesn't matter.",
        code: "{ prompt: \"I was billed twice for my subscription\", completion: \"bug\" }\n// elsewhere: { prompt: \"Billed twice this month\", completion: \"billing\" }",
      },
      {
        label: "Example 3: leaked internal note",
        body:
          "The completion contains text that only makes sense inside the original support tool (a reminder to check with a coworker) and was never meant to be a category label. Training on this teaches the model to output junk alongside real answers.",
        code: "{ prompt: \"Payment method declined\", completion: \"billing (check with Dana before closing)\" }",
      },
      {
        label: "Example 4: a genuinely good example",
        body:
          "Consistent format, correct label, and a realistic phrasing a real user would type. This is the kind of row that, repeated with real variety across edge cases, actually teaches the model the boundary you want.",
        code: "{ prompt: \"My card got charged twice for the same order\", completion: \"billing\" }",
      },
      {
        label: "Example 5: good example, harder edge case",
        body:
          "Same clean format and correct label as example 4, but this one covers an ambiguous case on purpose — a ticket that could sound like a bug but is actually about being charged, which is exactly the kind of edge case a small, deliberate dataset should include.",
        code: "{ prompt: \"App shows I was charged but my order says pending\", completion: \"billing\" }",
      },
    ],
  },
  quizQuestion:
    "You have two options for your next fine-tuning run: add 5,000 more scraped, unreviewed rows to your existing dataset, or spend a day fixing label errors and format inconsistencies in your current 300 rows. Which improves the model more?",
  quizOptions: [
    {
      key: "a",
      label: "Add the 5,000 scraped rows — more data always helps a model generalize better",
      correct: false,
    },
    {
      key: "b",
      label: "Fix the label errors and inconsistencies in the existing 300 rows first",
      correct: true,
    },
    {
      key: "c",
      label: "Neither will matter much — fine-tuning results depend only on the base model, not the data",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Correct — adding more unreviewed rows on top of existing label errors and format drift just teaches the model a bigger, more confident version of the same inconsistency; cleaning the 300 rows first gives it a clear pattern to generalize from.",
  quizFeedbackIncorrect:
    "Not quite — piling scraped, unreviewed rows onto a dataset that already has contradictory labels and inconsistent formatting reinforces the noise rather than fixing it, and fine-tuning results are highly sensitive to exactly this kind of data quality.",
  takeaway:
    "A fine-tuning dataset teaches the model exactly what's in it, contradictions included — so a small, consistently formatted, correctly labeled set of examples will outperform a huge pile of messy ones every time.",
  nextUpLabel: "Agents + Orchestration",
};

export default content;
