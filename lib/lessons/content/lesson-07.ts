import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 1,
  phaseLabel: "APIS + HTTP + JSON",
  title: "JSON: the text format everything speaks",
  minutes: 20,
  concept:
    "JSON (JavaScript Object Notation) is plain text — a string — that follows a small set of rules for describing data, and it's the format almost every API sends and receives. It only allows a handful of value types: objects ({...}), arrays ([...]), strings (always double-quoted, never single), numbers, true/false, and null. Every key in a JSON object must be a double-quoted string, and there's no trailing comma allowed after the last item — both are common reasons a \"valid-looking\" blob of JSON actually fails to parse. In JavaScript, two built-in functions cross the bridge between real JS values and JSON text: JSON.stringify(value) turns a JS value into JSON text, and JSON.parse(text) turns JSON text back into a real JS value you can use. Once you internalize that JSON is just text with strict rules — not a JS object itself — reading API code stops feeling like magic.",
  conceptSimpler:
    "JSON is like a shipping form with a fixed set of boxes to check — only certain kinds of items (text, numbers, true/false, nothing, lists, and other forms) are allowed on it, and every box has to be filled out exactly the way the form expects or it gets rejected.",
  vizStages: [
    {
      label: "1. What's actually valid JSON",
      body:
        "Only these types exist in JSON: object, array, string (double-quoted), number, boolean, and null. Keys are always double-quoted strings, and a trailing comma after the last item breaks the whole thing.",
      code:
        "{\n  \"name\": \"Priya\",\n  \"age\": 29,\n  \"isActive\": true,\n  \"hobbies\": [\"chess\", \"climbing\"],\n  \"nickname\": null\n}",
    },
    {
      label: "2. JS value -> JSON text",
      body:
        "JSON.stringify takes a real JavaScript value — an object, array, whatever — and turns it into a single JSON-formatted string, ready to send over the network.",
      code:
        "const user = { name: \"Priya\", age: 29 };\nconst text = JSON.stringify(user);\nconsole.log(text); // '{\"name\":\"Priya\",\"age\":29}'",
    },
    {
      label: "3. JSON text -> JS value",
      body:
        "JSON.parse does the reverse: feed it a JSON string and you get back a real JavaScript object or array you can index, loop over, and use like anything else you built yourself.",
      code:
        "const text = '{\"name\":\"Priya\",\"age\":29}';\nconst user = JSON.parse(text);\nconsole.log(user.name, user.age); // Priya 29",
    },
    {
      label: "4. Not everything survives the trip",
      body:
        "JSON has no concept of a function, so stringifying one gives you back undefined instead of real JSON. undefined itself isn't a JSON value either — inside an array, it gets quietly rewritten to null rather than staying undefined.",
      code:
        "function greet() { return \"hi\"; }\nconsole.log(JSON.stringify(greet)); // undefined\n\nconsole.log(JSON.stringify([1, undefined, 3])); // [1,null,3]",
    },
  ],
  realWorldIntro:
    "Every fetch() call to a real API sends and receives JSON text under the hood — request bodies get JSON.stringify'd before they go out over the network, and response bodies get JSON.parse'd (usually via response.json()) before your code ever touches them as real objects.",
  realWorldCode:
    "const body = JSON.stringify({ title: \"New post\", published: true });\n\nfetch(\"/api/posts\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/json\" },\n  body: body,\n});",
  sandbox: {
    kind: "code",
    challenge:
      "Build a user object, stringify it to JSON text, parse it back, and confirm two known gotchas: stringifying a function and stringifying an array that contains undefined.",
    starterCode:
      "const user = {\n  name: \"Priya\",\n  age: 29,\n  isActive: true,\n  hobbies: [\"chess\", \"climbing\"]\n};\n\nconst jsonText = JSON.stringify(user);\nconsole.log(\"as JSON text:\", jsonText);\n\nconst parsedBack = JSON.parse(jsonText);\nconsole.log(\"parsed name:\", parsedBack.name);\nconsole.log(\"parsed hobbies:\", parsedBack.hobbies.join(\", \"));\n\nfunction sayHi() {\n  return \"hi\";\n}\nconsole.log(\"stringifying a function:\", JSON.stringify(sayHi));\n\nconst readings = [72, undefined, 68];\nconsole.log(\"undefined in an array becomes:\", JSON.stringify(readings));",
    language: "javascript",
  },
  quizQuestion:
    "const data = { count: 3, label: undefined }; console.log(JSON.stringify(data)); — what actually prints?",
  quizCode: "const data = { count: 3, label: undefined };\nconsole.log(JSON.stringify(data));",
  quizOptions: [
    { key: "a", label: "{\"count\":3} — the label key disappears entirely", correct: false },
    { key: "b", label: "{\"count\":3,\"label\":null} — the undefined value is rewritten to null", correct: true },
    { key: "c", label: "It throws an error, because undefined can't be stringified at all", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — undefined isn't a valid JSON value, so stringify doesn't leave it as-is; it gets rewritten to null (the same thing happens to undefined entries inside arrays) rather than crashing or vanishing.",
  quizFeedbackIncorrect:
    "Not quite — undefined isn't a valid JSON value, so JSON.stringify doesn't silently drop the key or crash; it rewrites the value to null, the closest valid JSON has to \"nothing here.\"",
  takeaway:
    "JSON is text with strict rules — double-quoted keys and strings, no trailing commas, and only objects/arrays/strings/numbers/booleans/null as values. JSON.stringify and JSON.parse are the two functions that cross the bridge between that text and real JavaScript values, and knowing what doesn't survive the trip (functions, undefined) keeps you from being surprised by a response.",
};

export default content;
