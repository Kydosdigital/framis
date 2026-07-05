import type { LessonData } from "../types";

const content: LessonData = {
  num: 23,
  orderIndex: 4,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "Which Feature Is Actually Burning the Budget",
  minutes: 20,
  concept:
    "Knowing your total spend for the day — $42.10 — tells you almost nothing about what to do next, because that single number blends together every feature your product offers into one blob. If your app has a chat feature, a summarize feature, and a search feature, each one is calling the model API for very different reasons and at very different costs, and the total hides which one is actually responsible. The fix is cost attribution: instead of one running total, keep a dict with one entry per feature, initialize every feature you expect to see to 0 before you start, and as you loop over the request list, add each request's cost into the entry matching its own feature label. The request's own \"feature\" field is what tells you which bucket in the dict to add to — you're not guessing or splitting the cost evenly, you're routing it to the exact feature that caused it. Do this and a flat, boring total cost can suddenly reveal that one feature with a fraction of your traffic is quietly responsible for most of the bill.",
  conceptSimpler:
    "It's like a shared restaurant tab where instead of one lump total, you keep a separate running subtotal for appetizers, entrees, and drinks — the grand total was true the whole time, but only the itemized breakdown tells you the drinks were somehow half the bill.",
  vizStages: [
    {
      label: "1. One total hides everything",
      body:
        "total_cost_today = 42.10 is accurate, but it's a dead end — it can't tell you whether that money is spread evenly or concentrated in one feature.",
      code: "total_cost_today = 42.10",
    },
    {
      label: "2. Each request already knows its own feature",
      body:
        "Every logged request carries a \"feature\" label alongside its cost, because it was chat, or summarize, or search that made the call — the information you need is already there, just not yet organized.",
      code: "{\"feature\": \"summarize\", \"cost\": 0.09}",
    },
    {
      label: "3. A dict accumulator keeps one running total per feature",
      body:
        "Start every feature you expect to see at 0, then loop over the requests, and for each one add its cost into the dict entry that matches its feature label — not the overall total.",
      code:
        "by_feature = {\"chat\": 0, \"summarize\": 0, \"search\": 0}\nfor req in requests:\n    feature = req[\"feature\"]\n    cost = req[\"cost\"]\n    by_feature[feature] = by_feature[feature] + cost",
    },
    {
      label: "4. Now the breakdown draws itself",
      body:
        "The same $42.10 total splits into chat: $6.00, summarize: $31.10, search: $5.00 — and suddenly it's obvious which feature to optimize or rate-limit first, even though the total alone never hinted at it.",
      code: "chat: 6.00\nsummarize: 31.10   <- most of the budget\nsearch: 5.00",
    },
  ],
  realWorldIntro:
    "This is the computation behind a \"cost by feature\" or \"cost by tag\" breakdown chart in a billing dashboard — group by a label, sum within each group, and a flat total turns into a bar chart showing exactly which feature to investigate.",
  realWorldCode:
    "def cost_by_feature(requests):\n    by_feature = {\"chat\": 0, \"summarize\": 0, \"search\": 0}\n    for req in requests:\n        feature = req[\"feature\"]\n        cost = req[\"cost\"]\n        by_feature[feature] = by_feature[feature] + cost\n    return by_feature",
  sandbox: {
    kind: "code",
    challenge:
      "Run cost_by_feature over the sample requests and see which feature is actually responsible for most of the spend.",
    starterCode:
      "def cost_by_feature(requests):\n    by_feature = {\"chat\": 0, \"summarize\": 0, \"search\": 0}\n    for req in requests:\n        feature = req[\"feature\"]\n        cost = req[\"cost_cents\"]\n        by_feature[feature] = by_feature[feature] + cost\n    return by_feature\n\nrequests = [{\"feature\": \"chat\", \"cost_cents\": 2}, {\"feature\": \"summarize\", \"cost_cents\": 9}, {\"feature\": \"chat\", \"cost_cents\": 3}, {\"feature\": \"search\", \"cost_cents\": 5}, {\"feature\": \"summarize\", \"cost_cents\": 11}, {\"feature\": \"chat\", \"cost_cents\": 1}]\n\ntotals = cost_by_feature(requests)\nprint(\"chat total (cents):\", totals[\"chat\"])\nprint(\"summarize total (cents):\", totals[\"summarize\"])\nprint(\"search total (cents):\", totals[\"search\"])",
  },
  quizQuestion:
    "A new feature called \"image_gen\" ships, and requests start arriving as {\"feature\": \"image_gen\", \"cost_cents\": 8}, but nobody updates the by_feature dict shown below. What happens when cost_by_feature runs on a request list that includes one of those?",
  quizCode:
    "def cost_by_feature(requests):\n    by_feature = {\"chat\": 0, \"summarize\": 0, \"search\": 0}\n    for req in requests:\n        feature = req[\"feature\"]\n        cost = req[\"cost_cents\"]\n        by_feature[feature] = by_feature[feature] + cost\n    return by_feature",
  quizOptions: [
    {
      key: "a",
      label:
        "It raises a KeyError, because by_feature has no \"image_gen\" entry to read from when computing the new total",
      correct: true,
    },
    {
      key: "b",
      label: "It silently adds a new \"image_gen\" key to the dict with the correct running total",
      correct: false,
    },
    { key: "c", label: "It skips that request and keeps summing the rest without any error", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — by_feature[feature] on the right-hand side of the addition is a read before it's a write, and reading a key that was never initialized raises a KeyError; every feature you expect to see needs its 0 entry set up before the loop runs, or one unlisted feature crashes the whole aggregation.",
  quizFeedbackIncorrect:
    "Not quite — dicts don't invent missing keys or quietly skip past them; the line by_feature[feature] + cost has to read the existing total first, and reading a feature that was never added to the initial dict raises a KeyError instead of defaulting to 0.",
  takeaway:
    "A total is only as useful as its breakdown — initializing a dict with every feature you expect and accumulating each request's cost into the right bucket turns one flat number into the answer to \"which feature is actually burning the budget.\"",
};

export default content;
