import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 3,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "One Model, Many Tools: Routing Between Three or More",
  minutes: 20,
  concept:
    "Real agents rarely get just one tool — you might hand the model a weather lookup, a web search, and a currency converter all at once, and let it decide which ones actually fit the user's request. A single response can come back with just one tool call, or several at once (e.g. get_weather for Tokyo and get_weather for Paris in the same turn) — either way, each individual call is still its own \"name\" and \"arguments\" dict. Your dispatcher's job barely changes from the one-tool case — it just needs one elif branch per tool you offered, and it loops over however many calls came back, dispatching each one independently. Because if/elif is exclusive, only the branch whose condition actually matches runs for a given call; the moment one condition is true, every other elif and the final else are skipped entirely, so there's no risk of two tools accidentally firing for the same call. The real discipline is bookkeeping: every tool you describe to the model needs a matching elif in your dispatcher, or a call the model was told it could make has nowhere real to go.",
  conceptSimpler:
    "Giving a model three tools instead of one is like adding more drawers to the same filing cabinet — the clerk still only reads one label at a time and walks to exactly one drawer, it's just that now there are more drawers to keep labeled correctly.",
  vizStages: [
    {
      label: "1. The model can be offered many tools at once",
      body:
        "You describe three separate tools to the model in one request: get_weather, search_web, and convert_currency. It's free to pick whichever one actually matches what the user asked for.",
      code:
        "tools_offered = [\"get_weather\", \"search_web\", \"convert_currency\"]\nprint(f\"model was offered {len(tools_offered)} tools\")",
    },
    {
      label: "2. Each call is still one name, one arguments dict",
      body:
        "Whether the model comes back with one tool call or three in the same turn, every individual call has the same shape: one name, one arguments object. Here it chose convert_currency because the user asked about money.",
      code:
        "tool_call = {\"name\": \"convert_currency\", \"arguments\": {\"amount\": 100, \"currency\": \"EUR\"}}\nprint(tool_call[\"name\"])",
    },
    {
      label: "3. if/elif routes to exactly one branch",
      body:
        "Each tool gets its own elif, checking name against that tool's exact string. As soon as one matches, its body runs and every remaining elif is skipped — there's no fallthrough.",
      code:
        "def dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    elif name == \"search_web\":\n        return search_web(args[\"query\"])\n    elif name == \"convert_currency\":\n        return convert_currency(args[\"amount\"], args[\"currency\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")",
    },
    {
      label: "4. Each tool still only gets its own arguments",
      body:
        "get_weather never sees amount or currency, and convert_currency never sees city — each branch reaches into args for only the keys that specific tool actually needs.",
      code:
        "result = dispatch(tool_call)\nprint(result)",
    },
  ],
  realWorldIntro:
    "A customer-support agent might be offered look_up_order, issue_refund, and search_faq in the same request — the model picks exactly one per turn based on what the customer just typed, and your dispatcher needs a ready branch for every single one you declared to it.",
  realWorldCode:
    "def dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"look_up_order\":\n        return look_up_order(args[\"order_id\"])\n    elif name == \"issue_refund\":\n        return issue_refund(args[\"order_id\"], args[\"amount\"])\n    elif name == \"search_faq\":\n        return search_faq(args[\"query\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")",
  sandbox: {
    kind: "code",
    challenge:
      "Add a third tool, convert_currency(amount, currency), to a dispatcher that already knows get_weather and search_web, then route a batch of three different tool calls through it and print each tool's name next to its result.",
    starterCode:
      "def get_weather(city):\n    if city == \"Tokyo\":\n        return \"22C and clear\"\n    elif city == \"Paris\":\n        return \"15C and rainy\"\n    else:\n        return \"unknown city\"\n\ndef search_web(query):\n    return f\"3 results for {query}\"\n\ndef convert_currency(amount, currency):\n    if currency == \"EUR\":\n        return amount * 0.92\n    elif currency == \"GBP\":\n        return amount * 0.79\n    else:\n        return amount\n\ndef dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    elif name == \"search_web\":\n        return search_web(args[\"query\"])\n    elif name == \"convert_currency\":\n        return convert_currency(args[\"amount\"], args[\"currency\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")\n\ncalls = []\ncalls.append({\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}})\ncalls.append({\"name\": \"search_web\", \"arguments\": {\"query\": \"best ramen in Tokyo\"}})\ncalls.append({\"name\": \"convert_currency\", \"arguments\": {\"amount\": 100, \"currency\": \"EUR\"}})\n\nfor call in calls:\n    result = dispatch(call)\n    print(call[\"name\"], \"->\", result)",
  },
  quizQuestion:
    "Which branch of this if/elif chain actually runs for this call, and what happens to the other two?",
  quizCode:
    "def get_weather(city):\n    return f\"{city}: 22C\"\n\ndef convert_currency(amount, currency):\n    return amount * 0.92\n\ndef search_web(query):\n    return f\"3 results for {query}\"\n\ndef dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    elif name == \"convert_currency\":\n        return convert_currency(args[\"amount\"], args[\"currency\"])\n    elif name == \"search_web\":\n        return search_web(args[\"query\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")\n\ncall = {\"name\": \"search_web\", \"arguments\": {\"query\": \"best ramen\"}}\nresult = dispatch(call)\nprint(result)",
  quizOptions: [
    {
      key: "a",
      label:
        "Only the search_web branch runs and returns; get_weather and convert_currency never execute at all for this call",
      correct: true,
    },
    {
      key: "b",
      label: "All three branches run in order, but only the last one's return value is kept",
      correct: false,
    },
    {
      key: "c",
      label: "None of the branches run, since search_web is checked last, so it falls through to else and raises",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — an if/elif chain stops at the first branch whose condition is true. name == \"search_web\" matches the third branch, so only search_web(...) runs; get_weather and convert_currency are never reached at all for this particular call.",
  quizFeedbackIncorrect:
    "Not quite — if/elif is exclusive, not run-everything-in-sequence: as soon as one branch's condition matches, its body runs and every remaining elif and the else are skipped, so only the search_web branch executes here.",
  takeaway:
    "Offering the model more tools doesn't change the shape of what comes back — it's still one name and one arguments dict per call. Scaling to many tools just means one elif per tool, each reaching into arguments for only the keys that tool needs.",
};

export default content;
