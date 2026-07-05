import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 4,
  phaseLabel: "APIS + HTTP + JSON",
  title: "Build the endpoint yourself: request in, response out",
  minutes: 22,
  concept:
    "An API endpoint, underneath all the routing and middleware, is really just a function: it takes a request and returns a response. The request is a dict-like bundle of whatever the caller sent — an id to look up, a body to save — and the endpoint's job is to turn that into a response dict with a status code and either data or an error. Good endpoint design means checking the input before trusting it, deciding which status code accurately describes what happened, and never sending back data for a request that actually failed. The same function shape — take a request dict in, return a response dict out — works whether you're looking something up, creating it, or rejecting it outright, which is exactly why frameworks like Express and Next.js model routes as literal functions with this signature.",
  conceptSimpler:
    "Designing an endpoint is like working a returns counter: you take in whatever the customer hands you, decide if it's valid, and hand back either the refund or a clear reason why not — every case gets an answer, never silence.",
  vizStages: [
    {
      label: "1. Start from the shape",
      body:
        "Before writing any logic, decide the two things every endpoint needs: what shape the incoming request takes, and what shape the response will always have — status plus data.",
      code: "def handle_request(request):\n    # request = {\"user_id\": 3}\n    # response = {\"status\": ..., \"data\": ...}\n    return None",
    },
    {
      label: "2. Validate before doing anything else",
      body:
        "A real endpoint checks whether the request even makes sense before it does anything else. If a required field is missing, there's no point running further logic — bail out immediately with a 400.",
      code:
        "def handle_request(request):\n    try:\n        user_id = request[\"user_id\"]\n    except KeyError:\n        return {\"status\": 400, \"data\": None}",
    },
    {
      label: "3. Do the actual work",
      body:
        "Once the input looks valid, the endpoint does its real job — here, searching a list of users for a matching id. This part almost never builds the response directly; it just finds the answer.",
      code:
        "def find_user(user_id):\n    for user in users:\n        if user[\"id\"] == user_id:\n            return user\n    return None",
    },
    {
      label: "4. Turn the outcome into a status code",
      body:
        "The last step translates whatever happened into an honest status code: found it, 200. Didn't find it, 404. The response is never guessed — it's built directly from what actually occurred.",
      code:
        "user = find_user(request[\"user_id\"])\nif user == None:\n    return {\"status\": 404, \"data\": None}\nreturn {\"status\": 200, \"data\": user}",
    },
  ],
  realWorldIntro:
    "This is exactly what a route handler looks like in a real framework — a Next.js API route or an Express handler receives a request object, checks it, looks something up, and calls res.status(...).json(...) with exactly the status and data it decided on.",
  realWorldCode:
    "// Next.js API route\nexport default function handler(req, res) {\n  const userId = req.query.id;\n  const user = users.find(u => u.id === Number(userId));\n  if (!user) {\n    return res.status(404).json({ error: \"user not found\" });\n  }\n  return res.status(200).json({ data: user });\n}",
  sandbox: {
    kind: "code",
    challenge:
      "Write get_user_endpoint(request) that reads request[\"user_id\"], looks it up in the users list, and returns {\"status\": 200, \"data\": user} if found or {\"status\": 404, \"data\": None} if not.",
    starterCode:
      "users = [{\"id\": 1, \"name\": \"Priya\"}, {\"id\": 2, \"name\": \"Sam\"}, {\"id\": 3, \"name\": \"Marco\"}]\n\ndef find_user(user_id):\n    for user in users:\n        if user[\"id\"] == user_id:\n            return user\n    return None\n\ndef get_user_endpoint(request):\n    user_id = request[\"user_id\"]\n    user = find_user(user_id)\n    if user == None:\n        return {\"status\": 404, \"data\": None}\n    return {\"status\": 200, \"data\": user}\n\nresponse = get_user_endpoint({\"user_id\": 2})\nprint(response)\n\nmissing = get_user_endpoint({\"user_id\": 99})\nprint(missing)",
  },
  quizQuestion:
    "get_user_endpoint({}) is called — an empty dict with no \"user_id\" key at all. Given the code below, what happens?",
  quizCode:
    "def get_user_endpoint(request):\n    user_id = request[\"user_id\"]\n    user = find_user(user_id)\n    if user == None:\n        return {\"status\": 404, \"data\": None}\n    return {\"status\": 200, \"data\": user}\n\nget_user_endpoint({})",
  quizOptions: [
    {
      key: "a",
      label: "It crashes with a KeyError before ever reaching the 404 logic, because request[\"user_id\"] fails on a missing key",
      correct: true,
    },
    {
      key: "b",
      label: "It returns {\"status\": 404, \"data\": None}, treating the missing field like a not-found user",
      correct: false,
    },
    { key: "c", label: "It returns {\"status\": 200, \"data\": None}", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — indexing a dict with a missing key raises a KeyError immediately, before the function ever gets to decide between 200 and 404; a well-designed endpoint checks for the key's presence first and returns 400, rather than crashing on a request it should have rejected cleanly.",
  quizFeedbackIncorrect:
    "Not quite — request[\"user_id\"] raises a KeyError the instant the key doesn't exist, so the function crashes right there; it never reaches the found/not-found logic at all. That's exactly why real endpoints validate the request shape before using any of its fields.",
  takeaway:
    "An endpoint is a function that turns a request dict into a response dict, and a well-designed one validates its input, does its actual work, and only then picks the status code that honestly matches what happened — never assumes, never crashes on a missing field.",
};

export default content;
