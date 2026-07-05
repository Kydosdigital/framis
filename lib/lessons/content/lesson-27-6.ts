import type { LessonData } from "../types";

const content: LessonData = {
  num: 27,
  orderIndex: 6,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "One Meter, Every User: Tracking Cost Per Person",
  minutes: 20,
  concept:
    "Module 13 built the formula every LLM bill runs on: estimate input and output tokens, multiply each by its own per-1000-token price (output almost always costs more than input), and add the two pieces together for one request's cost. That formula doesn't change here — what changes is scale. A real system doesn't run it once; it runs it for every request in a day, adding each result into a running total_cost_cents the same way this module's very first lesson summed latency and cost. The more interesting move is grouping that same per-request cost by user_id instead of only accumulating one grand total, because a flat daily total can hide a single user quietly running up most of the bill. That grouping looks like the cost_by_feature dict from earlier in this module, with one twist: features come from a small, known set you can list in advance, but user IDs don't — new users sign up constantly, so you can't pre-initialize a 0 entry for every one of them before the loop runs. Instead of initializing ahead of time, you let each user's entry get created the moment their first request shows up: try to add the cost to their existing total, and if reading that entry raises a KeyError because it's their first appearance, catch it and create the entry with this cost as their starting total. Same underlying dict-accumulator idea as before, adapted for a key space that grows on its own.",
  conceptSimpler:
    "It's like a tab at a bar that only opens a page for a customer the first time they order — the bartender doesn't pre-print a blank page for every person who might walk in tonight; the first drink someone orders is what creates their page, and every drink after that just adds to it.",
  vizStages: [
    {
      label: "1. The same per-request formula from module 13, unchanged",
      body:
        "Input tokens times input price, plus output tokens times output price, both per 1000 tokens — this is exactly total_cost_cents from the tokens-and-cost lesson, just renamed so it doesn't collide with the running total you're about to build.",
      code:
        "def request_cost_cents(input_tokens, output_tokens, input_price, output_price):\n    input_cost = input_tokens * input_price // 1000\n    output_cost = output_tokens * output_price // 1000\n    return input_cost + output_cost",
    },
    {
      label: "2. Run it over a full day of requests, not just one",
      body:
        "A day of traffic is just a list of request dicts. Loop over every one, compute its cost with the same function, and add that cost into a running total_cost_cents — identical in shape to how this module's first lesson accumulated cost and latency.",
      code:
        "total_cost_cents = 0\nfor req in requests:\n    cost = request_cost_cents(req[\"input_tokens\"], req[\"output_tokens\"], input_price, output_price)\n    total_cost_cents = total_cost_cents + cost",
    },
    {
      label: "3. User IDs aren't a small fixed set like features were",
      body:
        "cost_by_feature could pre-initialize {\"chat\": 0, \"summarize\": 0, \"search\": 0} because every feature name was already known. User IDs aren't like that — you can't list every user who might show up today before the loop runs, so a dict entry has to be created the first time, not ahead of time.",
      code: "by_user = {}   # starts empty -- no user IDs known in advance",
    },
    {
      label: "4. try/except lets each user's entry create itself on first sight",
      body:
        "Reading by_user[user_id] before it exists raises a KeyError — the same error the cost_by_feature lesson warned about. Instead of avoiding that error by pre-initializing, this time you catch it: if the read fails because it's a brand-new user, the except block creates their entry with this request's cost as the starting total.",
      code:
        "def add_user_cost(by_user, user_id, cost):\n    try:\n        by_user[user_id] = by_user[user_id] + cost\n    except KeyError:\n        by_user[user_id] = cost\n    return by_user",
    },
  ],
  realWorldIntro:
    "This is the same computation behind a \"cost per user\" or \"top spenders today\" table in a billing dashboard — the kind of view that catches one runaway integration or one power user quietly accounting for most of a day's LLM spend, exactly the visibility a flat total_cost_cents number can never provide on its own.",
  realWorldCode:
    "def request_cost_cents(input_tokens, output_tokens, input_price, output_price):\n    input_cost = input_tokens * input_price // 1000\n    output_cost = output_tokens * output_price // 1000\n    return input_cost + output_cost\n\ndef add_user_cost(by_user, user_id, cost):\n    try:\n        by_user[user_id] = by_user[user_id] + cost\n    except KeyError:\n        by_user[user_id] = cost\n    return by_user",
  sandbox: {
    kind: "code",
    challenge:
      "Run a day of requests through request_cost_cents and add_user_cost together, printing the grand total alongside each user's own total to see who's actually driving the bill.",
    starterCode:
      "def request_cost_cents(input_tokens, output_tokens, input_price, output_price):\n    input_cost = input_tokens * input_price // 1000\n    output_cost = output_tokens * output_price // 1000\n    return input_cost + output_cost\n\ndef add_user_cost(by_user, user_id, cost):\n    try:\n        by_user[user_id] = by_user[user_id] + cost\n    except KeyError:\n        by_user[user_id] = cost\n    return by_user\n\nrequests = [{\"user_id\": \"u1\", \"input_tokens\": 1200, \"output_tokens\": 600}, {\"user_id\": \"u2\", \"input_tokens\": 3000, \"output_tokens\": 1800}, {\"user_id\": \"u1\", \"input_tokens\": 900, \"output_tokens\": 400}, {\"user_id\": \"u3\", \"input_tokens\": 5000, \"output_tokens\": 3200}, {\"user_id\": \"u1\", \"input_tokens\": 2000, \"output_tokens\": 1100}, {\"user_id\": \"u2\", \"input_tokens\": 1000, \"output_tokens\": 700}]\n\ninput_price = 3\noutput_price = 15\n\ntotal_cost_cents = 0\nby_user = {}\n\nfor req in requests:\n    cost = request_cost_cents(req[\"input_tokens\"], req[\"output_tokens\"], input_price, output_price)\n    total_cost_cents = total_cost_cents + cost\n    by_user = add_user_cost(by_user, req[\"user_id\"], cost)\n\nprint(\"total cost today (cents):\", total_cost_cents)\nprint(\"u1 total (cents):\", by_user[\"u1\"])\nprint(\"u2 total (cents):\", by_user[\"u2\"])\nprint(\"u3 total (cents):\", by_user[\"u3\"])\n\nif by_user[\"u3\"] > by_user[\"u1\"] and by_user[\"u3\"] > by_user[\"u2\"]:\n    print(\"u3 is the top spender today, despite sending only 1 request\")\nelif by_user[\"u2\"] > by_user[\"u1\"]:\n    print(\"u2 is the top spender today\")\nelse:\n    print(\"u1 is the top spender today\")",
  },
  quizQuestion:
    "Why does add_user_cost reach for try/except instead of pre-initializing by_user with every known key the way cost_by_feature pre-initialized {\"chat\": 0, \"summarize\": 0, \"search\": 0} earlier in this module?",
  quizCode:
    "def add_user_cost(by_user, user_id, cost):\n    try:\n        by_user[user_id] = by_user[user_id] + cost\n    except KeyError:\n        by_user[user_id] = cost\n    return by_user\n\nby_user = {}\nby_user = add_user_cost(by_user, \"new_user\", 12)\nprint(by_user[\"new_user\"])",
  quizOptions: [
    {
      key: "a",
      label:
        "Because features are a small, known set you can list ahead of time, but new user IDs keep showing up over time and can't all be listed in advance -- so each entry has to be created on first sight instead",
      correct: true,
    },
    {
      key: "b",
      label: "Because try/except is required any time a dict is used, regardless of whether the keys are known ahead of time",
      correct: false,
    },
    {
      key: "c",
      label: "Because pre-initializing a dict with 0 for every key is slower than catching a KeyError, so try/except is only a performance optimization here",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — cost_by_feature could safely pre-initialize because \"chat\", \"summarize\", and \"search\" were the whole known set; user IDs aren't bounded like that, so add_user_cost instead lets the KeyError from a first-time read trigger the except block, which creates that user's entry with this cost as their starting total.",
  quizFeedbackIncorrect:
    "Not quite — the reason isn't dicts in general or performance, it's that the set of possible user IDs isn't known in advance the way three fixed feature names were; try/except lets a brand-new user's entry get created the moment their first request appears, rather than needing every user pre-listed before the loop runs.",
  takeaway:
    "Per-request cost is the same input-tokens/output-tokens formula from module 13, just run in a loop and accumulated into both a grand total and a per-user dict — and when the grouping key is open-ended (like user IDs) rather than a small known set (like feature names), try/except around a KeyError is what lets each new key's entry create itself on first sight.",
};

export default content;
