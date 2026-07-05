import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 1,
  phaseLabel: "APIS + HTTP + JSON",
  title: "The response is just a dict",
  minutes: 20,
  concept:
    "When your code asks another system for data — 'give me this user' or 'place this order' — it doesn't get back magic, it gets back a plain response with a predictable shape, usually with a \"status\" field and a \"data\" field. In this lesson we simulate that with a function that returns a dict, so you can see the shape without needing a real network call. \"status\" tells you whether the request succeeded (like \"ok\" or \"error\"), and \"data\" holds the actual payload you asked for — but only when things went well. The critical habit is: always check status before you trust anything inside data, because reaching into data on a failed response is one of the most common bugs in API code. Once you check status, reading a field is just dict indexing, exactly like any dict you've built yourself.",
  conceptSimpler:
    "An API response is like a delivery box with a shipping label on the outside — the label (status) tells you if the package arrived intact before you ever open the box (data) to see what's inside.",
  vizStages: [
    {
      label: "1. Call the \"API\"",
      body:
        "We write a function that pretends to be an API — it takes a user id and returns a dict shaped exactly like a real JSON response would be.",
      code:
        "def fetch_user(user_id):\n    if user_id == 1:\n        return {\"status\": \"ok\", \"data\": {\"name\": \"Priya\", \"age\": 29}}\n    return {\"status\": \"error\", \"data\": None}",
    },
    {
      label: "2. Store the response",
      body:
        "Calling the function gives back a single dict. Nothing has been \"read\" yet — we just have the raw response sitting in a variable, same as any dict.",
      code: "response = fetch_user(1)\nprint(response)",
    },
    {
      label: "3. Check status first",
      body:
        "Before touching data, we check the status field. This is the gate that protects the rest of the code from crashing on missing or broken data.",
      code:
        "if response[\"status\"] == \"ok\":\n    print(\"request succeeded\")\nelse:\n    print(\"request failed\")",
    },
    {
      label: "4. Only then read data",
      body:
        "With status confirmed as \"ok\", it's safe to dig into data and pull out the fields you actually want.",
      code:
        "if response[\"status\"] == \"ok\":\n    user = response[\"data\"]\n    print(user[\"name\"], user[\"age\"])",
    },
  ],
  realWorldIntro:
    "Every JavaScript fetch() call to a real API resolves to JSON that looks exactly like this — a status or ok field plus a data or payload field — and frontend code checks it the same way before rendering anything on screen.",
  realWorldCode:
    "response = call_payments_api(order_id)\nif response[\"status\"] == \"ok\":\n    charge = response[\"data\"]\n    print(f\"charged ${charge['amount']}\")\nelse:\n    print(\"payment failed, do not ship order\")",
  sandbox: {
    kind: "code",
    challenge:
      "Write fetch_order(order_id) that returns {\"status\": \"ok\", \"data\": {...}} for order id 100 and {\"status\": \"error\", \"data\": None} otherwise, then check status before printing the total.",
    starterCode:
      "def fetch_order(order_id):\n    if order_id == 100:\n        return {\"status\": \"ok\", \"data\": {\"item\": \"keyboard\", \"total\": 79}}\n    return {\"status\": \"error\", \"data\": None}\n\nresponse = fetch_order(100)\nif response[\"status\"] == \"ok\":\n    order = response[\"data\"]\n    print(f\"order: {order['item']} for ${order['total']}\")\nelse:\n    print(\"could not fetch order\")\n\nmissing_response = fetch_order(404)\nif missing_response[\"status\"] == \"ok\":\n    print(missing_response[\"data\"][\"item\"])\nelse:\n    print(\"could not fetch order\")",
  },
  quizQuestion:
    "response comes back as {\"status\": \"error\", \"data\": None}. What happens if your code skips checking status and immediately runs response[\"data\"][\"name\"]?",
  quizCode: "response = {\"status\": \"error\", \"data\": None}\nprint(response[\"data\"][\"name\"])",
  quizOptions: [
    { key: "a", label: "It crashes, because you can't index into None with [\"name\"]", correct: true },
    { key: "b", label: "It prints None, since data is None", correct: false },
    { key: "c", label: "It prints an empty string as a safe default", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — data is None on an error response, and None has no fields, so indexing it with [\"name\"] blows up; checking status first is what prevents this crash.",
  quizFeedbackIncorrect:
    "Not quite — data is None here, and None isn't a dict, so trying to index it with [\"name\"] raises an error instead of silently returning something safe.",
  takeaway:
    "Treat every API response as a dict with a status field and a data field: check status before you ever touch data, because that one habit is what stands between your code and a crash on every failed request.",
  nextUpLabel: "Backend: Python + Postgres",
};

export default content;
