import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 2,
  phaseLabel: "APIS + HTTP + JSON",
  title: "fetch, await, and the real shape of a network call",
  minutes: 22,
  concept:
    "fetch(url) is the real, built-in JavaScript function for making an HTTP request, and it returns a Promise — a placeholder for a value that isn't ready yet. Rather than chaining .then() everywhere, modern JS lets you write async/await: mark a function async, and inside it you can write await someCall() to pause that line until the promise resolves, with the code underneath running only once it does. fetch's promise resolves to a Response object, which has an ok flag, a status number, and its own async method, .json(), that parses the response body and returns another promise — so a full real fetch is two awaits: one for the response, one for its parsed body. In this sandbox there's no real network, so fetch(url, mockData) is a stand-in you control directly: pass whatever JSON-able payload you want as the second argument, and it resolves instantly to a response whose .json() resolves to that exact data — same shape, same await pattern, just no waiting.",
  conceptSimpler:
    "await is like ordering at a counter and stepping aside until your number is called — the rest of your code just waits at that line, then keeps going the moment the value you asked for is actually ready.",
  vizStages: [
    {
      label: "1. async marks a function as awaitable",
      body:
        "Putting async in front of a function lets you use await anywhere inside it. Without async, await isn't allowed in that function at all.",
      code: "async function loadUser() {\n  // await is only legal in here\n}",
    },
    {
      label: "2. await pauses for the response",
      body:
        "fetch(url) returns a promise immediately. await unwraps it into the actual Response object — that's where ok and status live, before you've even looked at the data.",
      code:
        "const response = await fetch(\"/api/users/1\");\nconsole.log(response.ok);     // true\nconsole.log(response.status); // 200",
    },
    {
      label: "3. .json() is itself async",
      body:
        "The response body isn't parsed yet after the first await — calling .json() kicks off its own promise, so it needs a second await before you have real, usable data.",
      code:
        "const data = await response.json();\nconsole.log(data.name); // now it's a real value",
    },
    {
      label: "4. In this sandbox, you control the mock",
      body:
        "There's no real server here, so fetch's second argument is the mock payload you supply — whatever you pass becomes exactly what .json() resolves to, letting you rehearse the real await/await pattern against data you chose.",
      code:
        "const response = await fetch(\"/api/users/1\", { id: 1, name: \"Priya\" });\nconst data = await response.json();\nconsole.log(data.name); // Priya",
    },
  ],
  realWorldIntro:
    "This exact two-await shape is what every real frontend uses to talk to a backend — a React component calling your own API, a script hitting a public API, all of it starts with await fetch(url) and ends with await response.json() before the data is usable.",
  realWorldCode:
    "async function loadProfile(id) {\n  const response = await fetch(`/api/users/${id}`);\n  if (!response.ok) throw new Error(\"failed to load profile\");\n  const profile = await response.json();\n  return profile;\n}",
  sandbox: {
    kind: "code",
    challenge:
      "Write an async function that awaits fetch() with a mock user payload, awaits .json() to unwrap the data, and logs response.ok, response.status, and a couple of the parsed fields. Then call it.",
    starterCode:
      "async function getUser() {\n  const response = await fetch(\"/api/users/1\", { id: 1, name: \"Priya\", age: 29 });\n\n  console.log(\"ok:\", response.ok);\n  console.log(\"status:\", response.status);\n\n  const data = await response.json();\n  console.log(\"name:\", data.name);\n  console.log(\"age:\", data.age);\n}\n\ngetUser();",
    language: "javascript",
  },
  quizQuestion:
    "You write: const data = await fetch(url, mockPayload); console.log(data.name); — without a second await on .json(). What's wrong?",
  quizCode:
    "async function getUser() {\n  const data = await fetch(\"/api/users/1\", { name: \"Priya\" });\n  console.log(data.name);\n}\n\ngetUser(); // logs: undefined",
  quizOptions: [
    {
      key: "a",
      label: "data is the Response object, not the parsed body — data.name is undefined until you also await response.json()",
      correct: true,
    },
    { key: "b", label: "Nothing is wrong, fetch's payload is already unwrapped by the first await", correct: false },
    { key: "c", label: "It throws a syntax error because await can't be used twice in one function", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the first await only unwraps the Response object itself (ok, status, and the .json() method live there); the actual body only becomes usable data after a second await on response.json().",
  quizFeedbackIncorrect:
    "Not quite — await fetch(...) resolves to the Response object, not the parsed data. Response has ok, status, and a .json() method, but reading .name off the Response itself gives you undefined — you need a second await, on response.json(), to get real fields.",
  takeaway:
    "A real fetch is always two steps: await fetch(url) to get the Response (ok, status), then await response.json() to get the actual data — skip the second await and you're reading fields off the wrong object.",
};

export default content;
