import type { LessonData } from "../types";

const content: LessonData = {
  num: 15,
  orderIndex: 1,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "The Dispatcher: Turning a Tool Call Into a Function Call",
  minutes: 20,
  concept:
    "When an LLM \"calls a tool,\" it isn't actually running any code — it's producing structured output: a dict with a fixed shape, usually a \"name\" field and an \"arguments\" field, like {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}. Your program is the one that turns that dict into a real function call, and the piece of code that does this is called a dispatcher. A dispatcher reads the \"name\" field and uses an if/elif chain to decide which real function to run, then passes along the \"arguments\" dict as the parameters that function actually needs. The last branch should always be an else that raises an error for any name it doesn't recognize — if you let unknown tool names fall through silently, the model can \"call\" a tool that quietly does nothing, and you won't find out until something downstream is missing. This pattern — name plus arguments in, routed by if/elif, unknown names rejected loudly — is the entire mechanism behind every LLM tool-calling feature you've seen.",
  conceptSimpler:
    "A tool call is like a note that says \"go do task #3 with these inputs\" — the dispatcher is the clerk who reads the number, walks to the right filing cabinet, and refuses the note if the number doesn't match anything on file.",
  vizStages: [
    {
      label: "1. A tool call is just a dict",
      body:
        "This is what \"the model decided to call a tool\" looks like under the hood — not magic, just a dict with a name and an arguments dict.",
      code:
        "tool_call = {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}\nprint(tool_call[\"name\"])\nprint(tool_call[\"arguments\"][\"city\"])",
    },
    {
      label: "2. Real functions do the actual work",
      body:
        "Behind every tool name sits an ordinary function. The model never sees this code — it only ever sees the name string.",
      code:
        "def get_weather(city):\n    if city == \"Tokyo\":\n        return \"22C and clear\"\n    else:\n        return \"unknown city\"",
    },
    {
      label: "3. Dispatch reads the name, routes with if/elif",
      body:
        "The dispatcher takes the whole call dict, pulls out name and arguments, and matches name against each tool it knows how to run.",
      code:
        "def dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    else:\n        raise ValueError(\"unknown tool\")",
    },
    {
      label: "4. Run it end to end",
      body:
        "Build the call dict, hand it to dispatch, and the right function runs — this is the full loop an LLM tool-calling framework runs every time.",
      code:
        "tool_call = {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}\nresult = dispatch(tool_call)\nprint(result)",
    },
  ],
  realWorldIntro:
    "When you give an LLM a weather tool and a booking tool, the API response comes back with a tool_calls list where each entry is exactly this shape — a name and an arguments object — and your backend runs a dispatcher like this one to actually fetch the weather or book the flight.",
  realWorldCode:
    "def dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    elif name == \"book_flight\":\n        return book_flight(args[\"origin\"], args[\"destination\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")",
  sandbox: {
    kind: "code",
    challenge:
      "Write add(a, b) and square(n), then write dispatch(call) that routes to the right one based on call[\"name\"] and raises ValueError for any other name.",
    starterCode:
      "def add(a, b):\n    return a + b\n\ndef square(n):\n    return n * n\n\ndef dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"add\":\n        return add(args[\"a\"], args[\"b\"])\n    elif name == \"square\":\n        return square(args[\"n\"])\n    else:\n        raise ValueError(\"unknown tool\")\n\ncall1 = {\"name\": \"add\", \"arguments\": {\"a\": 3, \"b\": 4}}\nprint(dispatch(call1))\n\ncall2 = {\"name\": \"square\", \"arguments\": {\"n\": 5}}\nprint(dispatch(call2))\n\ntry:\n    call3 = {\"name\": \"delete_everything\", \"arguments\": {}}\n    print(dispatch(call3))\nexcept ValueError as e:\n    print(f\"blocked: {e}\")",
  },
  quizQuestion:
    "This dispatch function has no else branch. What happens when the model asks to call \"cancel_flight\", a name that matches neither if nor elif?",
  quizCode:
    "def dispatch(call):\n    name = call[\"name\"]\n    if name == \"get_weather\":\n        return get_weather(call[\"arguments\"][\"city\"])\n    elif name == \"get_time\":\n        return get_time(call[\"arguments\"][\"zone\"])\n\ncall = {\"name\": \"cancel_flight\", \"arguments\": {\"flight_id\": 42}}\nresult = dispatch(call)\nprint(result)",
  quizOptions: [
    {
      key: "a",
      label: "It falls through every branch, returns None, and prints None with no error at all",
      correct: true,
    },
    {
      key: "b",
      label: "Python automatically raises an error because no branch matched",
      correct: false,
    },
    {
      key: "c",
      label: "It runs the get_weather branch anyway since that's listed first",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — with no matching if/elif and no else, the function body just ends, so dispatch implicitly returns None; the flight never gets canceled and nothing tells you that, which is exactly why a missing else is dangerous.",
  quizFeedbackIncorrect:
    "Not quite — Python doesn't raise anything on its own here; without an else branch the function simply finishes without hitting a return, so it silently returns None instead of running any tool or telling you the name was unrecognized.",
  takeaway:
    "A tool call is nothing more than a dict with a name and arguments field; a dispatcher reads name, routes with if/elif to the real function, and must end in an else that raises loudly — because a silent fallthrough on an unknown tool is a bug you won't discover until it's too late.",
  nextUpLabel: "Evals + Safety + Guardrails",
};

export default content;
