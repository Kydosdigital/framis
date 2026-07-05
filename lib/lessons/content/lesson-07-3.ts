import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 3,
  phaseLabel: "APIS + HTTP + JSON",
  title: "Three digits, three stories: reading status codes",
  minutes: 18,
  concept:
    "Every HTTP response starts with a three-digit status code, and the first digit alone tells you which of three stories you're in. Codes starting with 2 mean success — the request was understood and the server did what you asked. Codes starting with 4 mean the client made a mistake — you asked for something that doesn't exist, sent bad data, or weren't allowed to do it, and the fix is on your end. Codes starting with 5 mean the server broke while trying to handle a perfectly reasonable request, so the fix is on their end and retrying the exact same request usually won't help. Knowing just the first digit — even before reading the specific number or the response body — already tells you who needs to act and roughly what happened.",
  conceptSimpler:
    "A status code is like a waiter coming back from the kitchen: \"2xx\" means your food's on the way, \"4xx\" means you ordered something not on the menu, and \"5xx\" means the kitchen caught fire and it's not your fault.",
  vizStages: [
    {
      label: "1. Read the first digit first",
      body:
        "Before worrying about the exact number, glance at the leading digit — it instantly sorts every possible response into one of three buckets.",
      code:
        "2xx -> success\n4xx -> you (the client) made a mistake\n5xx -> the server made a mistake",
    },
    {
      label: "2. 2xx: it worked",
      body:
        "200 means a plain success — here's your data. 201 means success and something new was created. Either way, the body can be trusted.",
      code:
        "200 OK      -> GET succeeded, here's the data\n201 Created -> POST succeeded, here's the new thing",
    },
    {
      label: "3. 4xx: check your request",
      body:
        "404 means the thing you asked for doesn't exist at that address. 400 means the data you sent was malformed or invalid. Neither gets fixed by retrying the exact same request — the request itself needs to change.",
      code:
        "400 Bad Request -> your request body or params were invalid\n404 Not Found    -> that resource doesn't exist",
    },
    {
      label: "4. 5xx: not your fault, but still your problem",
      body:
        "500 means the server hit an unexpected error while handling your perfectly valid request. Your job here is usually to show the user a generic error and maybe retry later, not to \"fix\" your request — there's nothing wrong with it.",
      code: "500 Internal Server Error -> server crashed handling a valid request",
    },
  ],
  realWorldIntro:
    "Browsers surface this constantly: a broken link renders the classic \"404 Page Not Found\", while a site that's down entirely — misconfigured or crashed — often serves a \"500 Internal Server Error\" page instead.",
  realWorldCode:
    "fetch(\"/api/profile\")\n  .then(res => {\n    if (res.status === 404) return showNotFoundPage();\n    if (res.status >= 500) return showServerErrorPage();\n    return res.json();\n  });",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each status code below to see what it means and what a response carrying it typically looks like.",
    stages: [
      {
        label: "200 OK",
        body:
          "The most common success code. It means the request was understood, processed, and here's the data you asked for — nothing more needs to happen.",
        code:
          "GET /users/42\n\nresponse:\n{\"status\": 200, \"data\": {\"id\": 42, \"name\": \"Priya\"}}",
      },
      {
        label: "201 Created",
        body:
          "A success code specific to creation. It tells you not just \"it worked\" but \"a new resource now exists,\" and the body usually includes that new resource's id.",
        code:
          "POST /users\nbody: {\"name\": \"Sam\"}\n\nresponse:\n{\"status\": 201, \"data\": {\"id\": 43, \"name\": \"Sam\"}}",
      },
      {
        label: "400 Bad Request",
        body:
          "The server understood you were making a request, but the data you sent doesn't make sense — missing a required field, wrong type, invalid format. Fix the request; don't just resend it as-is.",
        code:
          "POST /users\nbody: {\"name\": \"\"}\n\nresponse:\n{\"status\": 400, \"data\": None, \"error\": \"name is required\"}",
      },
      {
        label: "404 Not Found",
        body:
          "Nothing was wrong with how the request was formed — the specific thing you asked for simply isn't there, whether it was deleted, never existed, or you mistyped the id.",
        code:
          "GET /users/9999\n\nresponse:\n{\"status\": 404, \"data\": None, \"error\": \"user not found\"}",
      },
      {
        label: "500 Internal Server Error",
        body:
          "Something broke on the server's side while trying to handle a request that looked completely fine. The client did nothing wrong; there's a bug or outage on the other end.",
        code:
          "GET /users/42\n\nresponse:\n{\"status\": 500, \"data\": None, \"error\": \"unexpected server error\"}",
      },
    ],
  },
  quizQuestion:
    "Your code sends a perfectly well-formed request and gets back status 500. What should you conclude?",
  quizCode: "response = call_api(\"/orders/17\")\nprint(response[\"status\"])  # 500",
  quizOptions: [
    { key: "a", label: "The request was malformed and needs to be fixed before retrying", correct: false },
    {
      key: "b",
      label: "The server itself failed while handling the request — it isn't something wrong with your request",
      correct: true,
    },
    { key: "c", label: "The resource you asked for doesn't exist", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — a 5xx code means the failure happened on the server's side; a well-formed request can still get a 500 if the server hits a bug, so retrying the same request won't necessarily fix anything.",
  quizFeedbackIncorrect:
    "Not quite — 500 is a server-side error, meaning the problem isn't with how the request was made; that's what separates it from 400 (bad request) or 404 (not found), which both point back at the client.",
  takeaway:
    "Status codes group into three stories by their first digit: 2xx it worked, 4xx you need to fix something about the request, 5xx the server broke on its own. Reading that one digit first tells you who owns the next move before you even look at the data.",
};

export default content;
