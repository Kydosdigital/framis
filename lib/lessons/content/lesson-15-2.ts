import type { LessonData } from "../types";

const content: LessonData = {
  num: 15,
  orderIndex: 2,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "The Contract: Writing a JSON Schema the Model Can't Ignore",
  minutes: 18,
  concept:
    "A JSON schema is a plain dict that names every field a response must contain and the exact type each one must be — string, number, boolean, list, or object. Instead of hoping the model happens to phrase its answer the same way every time, you attach a schema with \"type\": \"object\", a \"properties\" dict describing each field, and a \"required\" list naming which fields must always be present. Fields with a fixed set of valid values — a currency code, a status label — use \"enum\" so the model can only pick from options you actually offered, and \"additionalProperties\": false stops it from tacking on fields you never defined. This turns \"return something like a city and a temperature\" into a contract precise enough that your code can read result[\"temperature_c\"] and trust that it exists and is actually a number, not a guess extracted from a sentence.",
  conceptSimpler:
    "A JSON schema is a fill-in-the-blank form instead of a blank sheet of paper — the model can only write inside the blanks you drew, in the format you labeled each one with.",
  vizStages: [
    {
      label: "1. Freeform text is a guessing game",
      body:
        "Without a schema, the model answers in prose. Somewhere in that sentence is the number you need, but you have to parse English to find it, and the parsing breaks the moment the wording changes.",
      code:
        "# no schema, just a prompt\n\"Tell me the weather in Tokyo\"\n\n# model replies with prose:\n\"It's currently 22C and clear in Tokyo.\"",
    },
    {
      label: "2. A schema names the exact shape",
      body:
        "You write out every field the response must have, and the type each one must be. This dict is sent alongside the prompt as part of the request.",
      code:
        "weather_schema = {\n  \"type\": \"object\",\n  \"properties\": {\n    \"city\": {\"type\": \"string\"},\n    \"temperature_c\": {\"type\": \"number\"},\n    \"condition\": {\"type\": \"string\"}\n  },\n  \"required\": [\"city\", \"temperature_c\", \"condition\"]\n}",
    },
    {
      label: "3. The response comes back matching, field for field",
      body:
        "With the schema attached, the model no longer replies in prose — it replies in exactly the shape you asked for, which your code can read directly with no parsing at all.",
      code:
        "{\n  \"city\": \"Tokyo\",\n  \"temperature_c\": 22,\n  \"condition\": \"clear\"\n}",
    },
    {
      label: "4. enum and additionalProperties keep it inside the lines",
      body:
        "enum restricts a field to a fixed list of allowed values, so the model can't invent a new one. additionalProperties: false stops it from adding fields you never defined — together they make the shape exact, not just close.",
      code:
        "\"condition\": {\n  \"type\": \"string\",\n  \"enum\": [\"clear\", \"rain\", \"snow\", \"cloudy\"]\n},\n\"additionalProperties\": false",
    },
  ],
  realWorldIntro:
    "Both Anthropic's and OpenAI's structured-output modes accept a JSON schema alongside the prompt and constrain generation so the response validates against it — it's exactly how a booking assistant guarantees departure_date always comes back as a real date string instead of \"next Tuesday\" or \"the 14th.\"",
  realWorldCode:
    "{\n  \"name\": \"book_flight\",\n  \"description\": \"Books a one-way flight\",\n  \"input_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"origin\": {\"type\": \"string\"},\n      \"destination\": {\"type\": \"string\"},\n      \"date\": {\"type\": \"string\"}\n    },\n    \"required\": [\"origin\", \"destination\", \"date\"]\n  }\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each response and decide whether it actually satisfies the schema above it, or where exactly it breaks the contract.",
    stages: [
      {
        label: "The schema",
        body:
          "Every response to this expense-logging tool is supposed to match this exact shape: an amount that's a number, a category from a fixed list, and required means those two fields must always be present.",
        code:
          "schema = {\n  \"type\": \"object\",\n  \"properties\": {\n    \"amount\": {\"type\": \"number\"},\n    \"category\": {\n      \"type\": \"string\",\n      \"enum\": [\"food\", \"travel\", \"software\", \"other\"]\n    },\n    \"note\": {\"type\": \"string\"}\n  },\n  \"required\": [\"amount\", \"category\"]\n}",
      },
      {
        label: "A valid response",
        body:
          "Both required fields are present, amount is a real number, category is one of the four allowed strings, and the optional note is just a bonus string. This satisfies the schema completely.",
        code: "{\"amount\": 42.50, \"category\": \"food\", \"note\": \"team lunch\"}",
      },
      {
        label: "Missing a required field",
        body:
          "category never showed up in this response. The moment your dispatcher does args[\"category\"], it hits a KeyError — required isn't a suggestion, it's the one guarantee your code was relying on.",
        code: "{\"amount\": 42.50, \"note\": \"team lunch\"}",
      },
      {
        label: "Wrong type for a field",
        body:
          "amount is supposed to be a number, but this response sent the string \"19.99\" instead. It might print fine, but the instant you try to add it into a running total, it breaks or silently does string concatenation instead of math.",
        code: "{\"amount\": \"19.99\", \"category\": \"food\"}",
      },
      {
        label: "A value outside the enum",
        body:
          "The schema says category must be one of four exact strings, but this response invents a fifth. A strict validator rejects this outright — and even without one, \"entertainment\" won't match any branch of your dispatcher's if/elif logic.",
        code: "{\"amount\": 15, \"category\": \"entertainment\"}",
      },
    ],
  },
  quizQuestion:
    "Does this response actually satisfy the schema above it, and why?",
  quizCode:
    "schema = {\n  \"type\": \"object\",\n  \"properties\": {\n    \"city\": {\"type\": \"string\"},\n    \"temperature_c\": {\"type\": \"number\"}\n  },\n  \"required\": [\"city\", \"temperature_c\"]\n}\n\nresponse = {\"city\": \"Tokyo\", \"temperature_c\": \"22\"}",
  quizOptions: [
    {
      key: "a",
      label:
        "No — temperature_c is required to be a number, but the response sent the string \"22\" instead",
      correct: true,
    },
    {
      key: "b",
      label:
        "Yes — \"22\" and 22 are close enough that a schema treats them as the same value",
      correct: false,
    },
    {
      key: "c",
      label: "No — the response is missing the required city field",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — required only checks that a field is present at all; type is a separate rule, and a quoted \"22\" is a string, not a number, so this response fails validation even though a human would read it as basically the same thing.",
  quizFeedbackIncorrect:
    "Not quite — city is present and is a string, satisfying that property fine. The real problem is temperature_c: the schema requires it to be a number, but the response sent it as the string \"22\" instead.",
  takeaway:
    "A JSON schema turns \"return something like a city and a temperature\" into an enforceable contract — required lists which fields must exist, type constrains their shape, and enum plus additionalProperties close off values and fields you never defined, so your code can trust the response instead of parsing prose.",
};

export default content;
