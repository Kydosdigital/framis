import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 3,
  phaseLabel: "APIS + HTTP + JSON",
  title: "When the request fails: try, catch, throw",
  minutes: 20,
  concept:
    "A network call can fail in ways a normal function call can't — the resource doesn't exist, the server rejects your input, the connection just breaks — and code that assumes every fetch succeeds will eventually crash in production. The real tool for this is try/catch: you wrap risky code in a try block, and if anything inside it throws, execution jumps straight to catch instead of continuing line by line or crashing the whole program. You can trigger that jump yourself with throw new Error(\"message\") — this is exactly how you signal \"this API call failed\" from inside a function, and the caller's catch (e) block can read e.message to find out what went wrong. Because there's no real network in this sandbox, fetch() itself never fails on its own — a real failure has to come from your own code checking something (a status field, a lookup that came back empty) and explicitly throwing when it should. That's not a workaround, either — it's exactly what real code does too, since a fetch that technically succeeds can still carry a failure status like 404 inside its response.",
  conceptSimpler:
    "try/catch is like a safety net under a tightrope walker: the walk (try) is the risky part, and if a foot ever slips (throw), the net (catch) is what stops the fall from becoming a total collapse — the show goes on instead of ending right there.",
  vizStages: [
    {
      label: "1. try wraps the risky code",
      body:
        "Anything that might fail — a lookup that might come back empty, a call that might reject — goes inside try. If it all succeeds, catch never runs at all.",
      code: "try {\n  // risky code goes here\n} catch (e) {\n  // only runs if something above threw\n}",
    },
    {
      label: "2. throw new Error(...) signals failure on purpose",
      body:
        "throw is how you hand control straight to the nearest catch. new Error(\"message\") builds an object with a .message field, which is exactly what shows up in the catch block.",
      code: "if (!order) {\n  throw new Error(\"order not found\");\n}",
    },
    {
      label: "3. catch reads e.message and recovers",
      body:
        "Once caught, you decide what \"recovering\" looks like — log something useful, show a fallback, or just move on — instead of letting one bad request take down everything after it.",
      code:
        "try {\n  throw new Error(\"order not found\");\n} catch (e) {\n  console.log(\"could not load order:\", e.message);\n}",
    },
    {
      label: "4. real failures live inside the response, not the mock",
      body:
        "This sandbox's fetch always technically succeeds, so a simulated failure has to come from data you check yourself — a status field in the payload, or a lookup you run before ever calling fetch — and then throw explicitly when it looks bad.",
      code:
        "const body = { status: 404, data: null };\nif (body.status !== 200) {\n  throw new Error(\"request failed with status \" + body.status);\n}",
    },
  ],
  realWorldIntro:
    "Real production code wraps almost every fetch in exactly this pattern — try/catch around the await, checking response.ok or response.status, and throwing (or handling) explicitly on failure — because an unhandled rejected request is one of the most common ways a real app crashes or shows a blank screen.",
  realWorldCode:
    "async function loadOrder(id) {\n  try {\n    const response = await fetch(`/api/orders/${id}`);\n    if (!response.ok) {\n      throw new Error(`order request failed with status ${response.status}`);\n    }\n    return await response.json();\n  } catch (e) {\n    console.error(\"could not load order:\", e.message);\n    return null;\n  }\n}",
  sandbox: {
    kind: "code",
    challenge:
      "Write an async fetchWeather(city) that mocks a 404 for unknown cities by putting a status field in the payload, throws when that status isn't 200, and a printWeather(city) that calls it inside try/catch so a failure never crashes the program.",
    starterCode:
      "async function fetchWeather(city) {\n  const knownCities = [\"Austin\", \"Denver\"];\n  const isKnown = knownCities.includes(city);\n\n  const mockPayload = isKnown\n    ? { status: 200, data: { city: city, tempF: 72 } }\n    : { status: 404, data: null };\n\n  const response = await fetch(\"/api/weather?city=\" + city, mockPayload);\n  const body = await response.json();\n\n  if (body.status !== 200) {\n    throw new Error(\"weather lookup failed with status \" + body.status);\n  }\n  return body.data;\n}\n\nasync function printWeather(city) {\n  try {\n    const weather = await fetchWeather(city);\n    console.log(weather.city + \": \" + weather.tempF + \"F\");\n  } catch (e) {\n    console.log(\"error:\", e.message);\n  }\n}\n\nprintWeather(\"Austin\");\nprintWeather(\"Nowhere\");",
    language: "javascript",
  },
  quizQuestion:
    "fetchWeather(\"Nowhere\") throws new Error(\"weather lookup failed with status 404\") from inside the try block below. What happens next?",
  quizCode:
    "async function fetchWeather(city) {\n  const isKnown = city === \"Austin\";\n  const body = isKnown ? { status: 200, data: { city } } : { status: 404, data: null };\n  if (body.status !== 200) {\n    throw new Error(\"weather lookup failed with status \" + body.status);\n  }\n  return body.data;\n}\n\ntry {\n  const weather = await fetchWeather(\"Nowhere\");\n  console.log(weather.city);\n} catch (e) {\n  console.log(\"error:\", e.message);\n}",
  quizOptions: [
    {
      key: "a",
      label: "The program crashes immediately, because throw always stops execution completely",
      correct: false,
    },
    {
      key: "b",
      label: "console.log(weather.city) is skipped, and control jumps straight to the catch block, printing the error message",
      correct: true,
    },
    { key: "c", label: "weather.city runs anyway with weather set to null", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — throwing inside a try block immediately abandons the rest of that block (weather.city never gets a chance to run) and jumps straight to catch, where e.message holds the thrown Error's message.",
  quizFeedbackIncorrect:
    "Not quite — a throw inside try doesn't crash the whole program by itself, and it doesn't let later lines in that same try block run either; it jumps straight to catch, skipping everything left in try.",
  takeaway:
    "try/catch is how you handle a request that fails on purpose instead of by accident: wrap the risky call in try, throw new Error(...) explicitly when your own check says something's wrong, and catch (e) gives you e.message to recover gracefully instead of crashing.",
};

export default content;
