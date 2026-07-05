import type { LessonData } from "../types";

const content: LessonData = {
  num: 15,
  orderIndex: 5,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "Closing the Loop: Sending the Tool's Result Back to the Model",
  minutes: 22,
  concept:
    "Every dispatcher you've built so far stops the instant it returns a Python value — but that return value never actually reaches the user, because the user never talks to your dispatcher, they talk to the model. A real tool-calling exchange is a loop, and the loop isn't done once you have a result; it's done once the model has seen that result and written a reply. Real chat APIs track the whole exchange as a growing list of messages, where each message is a dict with at least a \"role\" — \"user\" for what the human typed, \"assistant\" for what the model said, and \"tool\" for a result your code is handing back. The sequence looks like this: you send the messages list to the model; instead of replying in prose, the model's message asks to call a specific tool with specific arguments; your code actually runs that tool and gets a real result; you package that result as a brand-new message with role \"tool\" and append it to the same list — this is the step a plain dispatch() call never performs; then you send the whole list, now including the tool's result, back to the model one more time, and only now does it have enough information to write the natural-language answer the user actually asked for. Skip that middle step — forget to append the tool's result and call the model again — and the loop never closes: you're left holding a Python value nobody ever sees.",
  conceptSimpler:
    "It's a game of telephone with a receipt taped to the message: you ask a question, get handed instructions to go check something, actually go check it, tape the receipt onto the conversation so far, and hand the whole stack back — only then does the person on the other end have enough to give you a real answer.",
  vizStages: [
    {
      label: "1. A conversation is just a growing list",
      body:
        "Nothing fancy here — messages starts as an empty list, and the user's turn is the first dict appended to it. role and content are the only two fields a plain message needs.",
      code:
        "messages = []\nmessages.append({\"role\": \"user\", \"content\": \"What's the weather in Tokyo?\"})\nprint(messages)",
    },
    {
      label: "2. The model's first reply isn't an answer — it's a request",
      body:
        "Instead of content with prose, this message carries a tool_call: a name and arguments, exactly like every dispatch() call you've built. Nothing has actually run yet.",
      code:
        "response = {\"role\": \"assistant\", \"tool_call\": {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}}\nmessages.append(response)\ncall = response[\"tool_call\"]\nprint(call[\"name\"])",
    },
    {
      label: "3. Your code runs the real tool and gets a real result",
      body:
        "This is the part every earlier lesson already covered — pull the arguments out and call the actual function. The new part is what happens to this result next.",
      code:
        "def get_weather(city):\n    if city == \"Tokyo\":\n        return \"22C and clear\"\n    else:\n        return \"unknown city\"\n\nargs = call[\"arguments\"]\nresult = get_weather(args[\"city\"])\nprint(result)",
    },
    {
      label: "4. The result becomes a new message — only then does the model answer",
      body:
        "Append the result as a \"tool\" message, then hand the whole conversation back to the model. Now it has the number it needed, and it can finally write the reply the user is waiting for.",
      code:
        "messages.append({\"role\": \"tool\", \"content\": result})\nfinal = {\"role\": \"assistant\", \"content\": f\"It's {result} in Tokyo right now.\"}\nmessages.append(final)\nprint(final[\"content\"])",
    },
  ],
  realWorldIntro:
    "OpenAI's chat completions API represents exactly this with a message whose role is \"tool\", tied back to the assistant's tool_call by an id; Anthropic's Messages API does the same thing with a tool_result content block tied to the tool_use id from the model's previous turn. Either way, the API will not produce a final answer until you send a new request whose message list includes that tool result — homemade tool-calling code that looks like it \"hangs\" waiting for a real answer has almost always just skipped this step.",
  realWorldCode:
    "conversation = [\n  {\"role\": \"user\", \"content\": \"What's the weather in Tokyo?\"},\n  {\"role\": \"assistant\", \"tool_call\": {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}},\n  {\"role\": \"tool\", \"content\": \"22C and clear\"},\n  {\"role\": \"assistant\", \"content\": \"It's 22C and clear in Tokyo right now.\"}\n]",
  sandbox: {
    kind: "code",
    challenge:
      "There's no real model available here, so write fake_model(messages), a stand-in that looks at the role of the last message in the list: on a \"user\" message it returns a tool_call for get_weather; on a \"tool\" message it returns a final natural-language answer built from that result. Then drive the full loop by hand — send the user's message, get the tool_call, run the real tool, send the result back, and print the model's final answer.",
    starterCode:
      "def get_weather(city):\n    if city == \"Tokyo\":\n        return \"22C and clear\"\n    else:\n        return \"unknown city\"\n\ndef fake_model(messages):\n    last_index = len(messages) - 1\n    last = messages[last_index]\n    role = last[\"role\"]\n    if role == \"user\":\n        return {\"role\": \"assistant\", \"tool_call\": {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}}\n    elif role == \"tool\":\n        result_text = last[\"content\"]\n        return {\"role\": \"assistant\", \"content\": f\"It's {result_text} in Tokyo right now.\"}\n    else:\n        return {\"role\": \"assistant\", \"content\": \"I'm not sure what to do next.\"}\n\nmessages = []\nmessages.append({\"role\": \"user\", \"content\": \"What's the weather in Tokyo?\"})\n\nresponse = fake_model(messages)\nmessages.append(response)\n\ntry:\n    call = response[\"tool_call\"]\n    is_tool_call = True\nexcept KeyError:\n    is_tool_call = False\n\nif is_tool_call:\n    args = call[\"arguments\"]\n    city = args[\"city\"]\n    result = get_weather(city)\n    messages.append({\"role\": \"tool\", \"content\": result})\n\n    final = fake_model(messages)\n    messages.append(final)\n    print(final[\"content\"])\nelse:\n    print(response[\"content\"])\n\nprint(\"total messages in conversation:\", len(messages))",
  },
  quizQuestion:
    "This second call to fake_model happens right after appending the assistant's tool_call message — but before running the real tool or appending a \"tool\" message. What does it print?",
  quizCode:
    "def fake_model(messages):\n    last_index = len(messages) - 1\n    last = messages[last_index]\n    role = last[\"role\"]\n    if role == \"user\":\n        return {\"role\": \"assistant\", \"tool_call\": {\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}}}\n    elif role == \"tool\":\n        result_text = last[\"content\"]\n        return {\"role\": \"assistant\", \"content\": f\"It's {result_text} in Tokyo right now.\"}\n    else:\n        return {\"role\": \"assistant\", \"content\": \"I'm not sure what to do next.\"}\n\nmessages = []\nmessages.append({\"role\": \"user\", \"content\": \"What's the weather in Tokyo?\"})\n\nresponse = fake_model(messages)\nmessages.append(response)\n\n# oops — forgot to run the tool and append its result here\n\nfinal = fake_model(messages)\nprint(final[\"content\"])",
  quizOptions: [
    {
      key: "a",
      label:
        "\"I'm not sure what to do next.\" — the last message's role is still \"assistant\" (the tool_call itself), not \"tool\", so neither of fake_model's real branches matches",
      correct: true,
    },
    {
      key: "b",
      label: "\"It's 22C and clear in Tokyo right now.\" — fake_model already knows the weather from the first call",
      correct: false,
    },
    {
      key: "c",
      label: "A KeyError, because messages has no \"content\" field on its last entry",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — fake_model only ever looks at the role of the last message in the list. After appending the tool_call, that last message's role is still \"assistant\", not \"tool\", so it falls to the else branch. Nothing about calling fake_model a second time magically runs the tool or supplies a result — that only happens once a \"tool\" message with the real result is actually appended.",
  quizFeedbackIncorrect:
    "Not quite — fake_model doesn't remember anything between calls except what's sitting in the messages list. Since no \"tool\" message was ever appended, the last message's role is still \"assistant\" (the tool_call itself), which matches neither the \"user\" branch nor the \"tool\" branch, so it falls through to the else case instead.",
  takeaway:
    "dispatch() returning a value is only half the loop. The other half is packaging that value as a new \"tool\" message, appending it to the conversation, and sending the whole thing back to the model so it can read the result and write the answer the user is actually waiting for — skip that step and the tool call happened for nothing.",
};

export default content;
