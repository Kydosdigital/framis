import type { LessonData } from "../types";

const content: LessonData = {
  num: 15,
  orderIndex: 6,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "Trust But Verify: Validating Arguments Before You Call the Tool",
  minutes: 20,
  concept:
    "A JSON schema tells the model what shape its arguments are supposed to be, but naming the shape doesn't enforce it — nothing stops the model from returning a tool_call whose arguments dict is missing a required key, or whose value is a kind the tool simply doesn't support, even though it looks like a perfectly reasonable string or number. An earlier lesson showed catching the crash after the real tool already blew up on bad input; that's a safety net, not a filter. The better fix is a small validate_args function that checks the exact same rules the schema promised — every required key present, every value inside whatever set the tool actually handles — and raises one clear, specific error the instant something's off, before the real function ever runs. That ordering matters most when the real tool has side effects you can't undo: charging a card, sending an email, canceling a flight. Validating first means a bad call never reaches that code at all. And a rejection doesn't have to be a dead end — you can feed the validation error back into the conversation as if it were a tool result, ask the model to try again, and let it correct its own arguments. That's what a retry loop is: the same messages-list mechanism from before, just with a validation failure sitting in the tool result instead of a real one.",
  conceptSimpler:
    "validate_args is a bouncer checking IDs and the dress code at the door, instead of a bouncer standing inside who only notices a problem after a fight has already broken out.",
  vizStages: [
    {
      label: "1. A schema is a promise, not a guarantee",
      body:
        "The schema said currency must be one of a fixed list — but nothing forces the model's actual output to obey that at runtime. This call looks well-formed and still breaks the contract.",
      code:
        "call = {\"name\": \"convert_currency\", \"arguments\": {\"amount\": 100, \"currency\": \"JPY\"}}\nargs = call[\"arguments\"]\nprint(args[\"currency\"])",
    },
    {
      label: "2. validate_args checks the rules before anything real runs",
      body:
        "Required keys are checked with try/except around the lookup itself, and the allowed-values check is a loop, since there's no built-in \"is this in the list\" shortcut here — either failure raises the same kind of error: ValueError.",
      code:
        "def validate_args(args):\n    try:\n        amount = args[\"amount\"]\n        currency = args[\"currency\"]\n    except KeyError as e:\n        raise ValueError(f\"missing required argument: {e}\")\n    allowed = [\"USD\", \"EUR\", \"GBP\"]\n    ok = False\n    for c in allowed:\n        if c == currency:\n            ok = True\n    if not ok:\n        raise ValueError(f\"unsupported currency: {currency}\")",
    },
    {
      label: "3. A bad call is rejected before it ever touches the real tool",
      body:
        "convert_currency never even gets called here — validate_args raises first, so the rejection happens before any real work, real API call, or real side effect could start.",
      code:
        "args = {\"amount\": 100, \"currency\": \"JPY\"}\ntry:\n    validate_args(args)\n    print(\"arguments look valid\")\nexcept ValueError as e:\n    print(f\"rejected: {e}\")",
    },
    {
      label: "4. A rejection can become a retry instead of a dead end",
      body:
        "Instead of just giving up, package the validation error as a tool result the model can actually read, marked as failed. Sent back into the conversation, it gives the model a real chance to correct its own arguments on the next turn.",
      code:
        "messages.append({\"role\": \"tool\", \"ok\": False, \"content\": \"unsupported currency: JPY\"})\n# the next call to the model sees ok: False and can retry with a supported currency",
    },
  ],
  realWorldIntro:
    "Production tool-calling frameworks — and MCP servers in particular — commonly run every incoming tool_call's arguments through a JSON Schema validator before the tool's real code ever executes, precisely so a malformed call never reaches code with side effects. Many go a step further and automatically feed the validation error back to the model as the tool's result, giving it one or more chances to self-correct before the request is given up on entirely.",
  realWorldCode:
    "def call_tool_safely(name, args):\n    try:\n        validate_args(args)\n    except ValueError as e:\n        return {\"ok\": False, \"error\": str(e)}\n    amount = args[\"amount\"]\n    currency = args[\"currency\"]\n    result = convert_currency(amount, currency)\n    return {\"ok\": True, \"result\": result}",
  sandbox: {
    kind: "code",
    challenge:
      "Write validate_args(args) that requires \"amount\" and \"currency\" to both be present and requires currency to be one of \"USD\", \"EUR\", or \"GBP\", raising ValueError otherwise. Then run three attempts through it — one with an unsupported currency, one with a missing currency, and one that's actually valid — and print the outcome of each.",
    starterCode:
      "def convert_currency(amount, currency):\n    if currency == \"USD\":\n        return amount\n    elif currency == \"EUR\":\n        return amount * 0.92\n    elif currency == \"GBP\":\n        return amount * 0.79\n    else:\n        raise ValueError(f\"unsupported currency: {currency}\")\n\ndef validate_args(args):\n    try:\n        amount = args[\"amount\"]\n        currency = args[\"currency\"]\n    except KeyError as e:\n        raise ValueError(f\"missing required argument: {e}\")\n    allowed = [\"USD\", \"EUR\", \"GBP\"]\n    ok = False\n    for c in allowed:\n        if c == currency:\n            ok = True\n    if not ok:\n        raise ValueError(f\"unsupported currency: {currency}\")\n\ndef try_convert(args):\n    try:\n        validate_args(args)\n    except ValueError as e:\n        return {\"ok\": False, \"error\": e}\n    amount = args[\"amount\"]\n    currency = args[\"currency\"]\n    result = convert_currency(amount, currency)\n    return {\"ok\": True, \"result\": result}\n\nfirst_attempt = {\"amount\": 100, \"currency\": \"JPY\"}\noutcome1 = try_convert(first_attempt)\nif outcome1[\"ok\"]:\n    print(\"converted:\", outcome1[\"result\"])\nelse:\n    print(\"attempt 1 rejected:\", outcome1[\"error\"])\n\nsecond_attempt = {\"amount\": 50}\noutcome2 = try_convert(second_attempt)\nif outcome2[\"ok\"]:\n    print(\"converted:\", outcome2[\"result\"])\nelse:\n    print(\"attempt 2 rejected:\", outcome2[\"error\"])\n\nthird_attempt = {\"amount\": 100, \"currency\": \"EUR\"}\noutcome3 = try_convert(third_attempt)\nif outcome3[\"ok\"]:\n    print(\"converted:\", outcome3[\"result\"])\nelse:\n    print(\"attempt 3 rejected:\", outcome3[\"error\"])",
  },
  quizQuestion:
    "convert_currency prints \"contacting currency exchange for ...\" as its very first line, before doing any real conversion. This call validates first. Does that print statement run for a GBP request when validate_args only allows USD and EUR?",
  quizCode:
    "def convert_currency(amount, currency):\n    print(\"contacting currency exchange for\", currency)\n    if currency == \"USD\":\n        return amount\n    elif currency == \"EUR\":\n        return amount * 0.92\n    else:\n        raise ValueError(f\"unsupported currency: {currency}\")\n\ndef validate_args(args):\n    allowed = [\"USD\", \"EUR\"]\n    currency = args[\"currency\"]\n    ok = False\n    for c in allowed:\n        if c == currency:\n            ok = True\n    if not ok:\n        raise ValueError(f\"unsupported currency: {currency}\")\n\nargs = {\"amount\": 100, \"currency\": \"GBP\"}\n\ntry:\n    validate_args(args)\n    amount = args[\"amount\"]\n    currency = args[\"currency\"]\n    result = convert_currency(amount, currency)\n    print(\"result:\", result)\nexcept ValueError as e:\n    print(f\"rejected before calling the tool: {e}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "No — validate_args raises ValueError for GBP before convert_currency is ever called, so its print line never runs at all",
      correct: true,
    },
    {
      key: "b",
      label: "Yes — the print statement always runs first because Python evaluates function bodies before checking try/except",
      correct: false,
    },
    {
      key: "c",
      label: "Yes — validate_args only checks required keys, not which currencies are allowed, so convert_currency still gets called",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — validate_args loops over the allowed list, finds no match for \"GBP\", and raises ValueError right there. The try block stops at that line and jumps straight to except, so convert_currency — and its print side effect — never executes at all. That's the entire point of validating first: a rejected call never reaches code that does real work.",
  quizFeedbackIncorrect:
    "Not quite — validate_args's for-loop checks currency against the allowed list and finds no match for \"GBP\", so it raises ValueError immediately. That exception jumps straight out of the try block to except, which means convert_currency — including its print line — is never reached for this call.",
  takeaway:
    "A schema describes what the model's arguments should look like; validate_args is what actually enforces it, checking required keys and allowed values before the real tool runs at all. Validating first — instead of just catching the crash afterward — means a bad call never touches code with real side effects, and a validation failure can be handed back to the model as a chance to retry instead of a dead end.",
};

export default content;
