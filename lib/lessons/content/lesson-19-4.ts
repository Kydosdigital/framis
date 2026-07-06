import type { LessonData } from "../types";

const content: LessonData = {
  num: 19,
  orderIndex: 4,
  phaseLabel: "STRUCTURED OUTPUTS + TOOL CALLING",
  title: "The Safety Net: Surviving a Bad Tool Call",
  minutes: 20,
  concept:
    "A tool call can fail for reasons that have nothing to do with your dispatcher's routing logic: the model might leave out an argument the real function needs, pass a value the function flat-out rejects, or name a city, currency, or record that simply doesn't exist. Each of those failure modes raises a different kind of error — a missing dict key raises KeyError, a value your function explicitly rejects raises ValueError — and if nothing catches it, that one bad call crashes the entire program, not just the one request that triggered it. Wrapping the risky step in try/except lets you catch specific error types by name and respond to each one on purpose, instead of letting any exception take down everything after it. The except block doesn't need to fix the underlying problem — its job is to produce a graceful fallback, like a message saying the action couldn't be completed, so the rest of the program, and the conversation, can keep going. This is what separates a demo from something you'd actually put in front of users: demos assume every tool call is well-formed, production code assumes some of them won't be.",
  conceptSimpler:
    "A try/except around a tool call is like a spotter under a trapeze artist — you're not trying to prevent every fall, you're making sure that when one happens, it ends in a safety net instead of the whole show stopping.",
  vizStages: [
    {
      label: "1. A tool call that looks fine but isn't",
      body:
        "The dict has the right shape — a name and an arguments dict — but arguments is missing a key the real function actually needs. Nothing about the shape looks wrong until you try to use it.",
      code: "call = {\"name\": \"convert_currency\", \"arguments\": {\"amount\": 50}}",
    },
    {
      label: "2. Without a safety net, one bad call takes down the batch",
      body:
        "dispatch reaches for args[\"currency\"], which was never there. That raises a KeyError, and with nothing catching it, the program stops right there — any calls still waiting never get a chance to run.",
      code:
        "result = dispatch(call)\n# KeyError: currency\n# program halts here — nothing after this line runs",
    },
    {
      label: "3. Wrap the risky step in try/except",
      body:
        "Moving the call inside a try, with a matching except for each error type you expect, catches the failure right where it happens and gives you a chance to respond to it on purpose.",
      code:
        "try:\n    result = dispatch(call)\nexcept KeyError as e:\n    result = f\"missing argument: {e}\"\nexcept ValueError as e:\n    result = f\"couldn't complete: {e}\"",
    },
    {
      label: "4. The rest of the batch survives",
      body:
        "One call fails and gets a fallback message instead of a crash. Every other call in the batch still runs normally, exactly as if nothing had gone wrong.",
      code:
        "print(result)\n# missing argument: currency\n# ...and the loop moves on to the next call",
    },
  ],
  realWorldIntro:
    "In a live agent, one malformed tool call — the model forgetting to include \"city\", or asking to refund an order_id that doesn't exist — shouldn't end the conversation; catching the error and replying with something like \"I wasn't able to complete that\" keeps the session alive so the user can just try again.",
  realWorldCode:
    "try:\n    result = dispatch(call)\nexcept KeyError as e:\n    result = \"Sorry, that request was missing some required information.\"\nexcept ValueError as e:\n    result = f\"Sorry, I couldn't do that: {e}\"",
  sandbox: {
    kind: "code",
    challenge:
      "Wrap each dispatch(call) in a try/except that catches both KeyError and ValueError, so a batch of tool calls keeps running even when one call is missing an argument or asks for something a tool can't handle.",
    starterCode:
      "def get_weather(city):\n    if city == \"Tokyo\":\n        return \"22C and clear\"\n    elif city == \"Paris\":\n        return \"15C and rainy\"\n    else:\n        raise ValueError(f\"no weather data for {city}\")\n\ndef convert_currency(amount, currency):\n    if currency == \"EUR\":\n        return amount * 0.92\n    elif currency == \"GBP\":\n        return amount * 0.79\n    else:\n        raise ValueError(f\"unsupported currency: {currency}\")\n\ndef dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"get_weather\":\n        return get_weather(args[\"city\"])\n    elif name == \"convert_currency\":\n        return convert_currency(args[\"amount\"], args[\"currency\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")\n\ncalls = []\ncalls.append({\"name\": \"get_weather\", \"arguments\": {\"city\": \"Tokyo\"}})\ncalls.append({\"name\": \"convert_currency\", \"arguments\": {\"currency\": \"EUR\"}})\ncalls.append({\"name\": \"get_weather\", \"arguments\": {\"city\": \"Cairo\"}})\n\nfor call in calls:\n    try:\n        result = dispatch(call)\n        print(call[\"name\"], \"succeeded:\", result)\n    except KeyError as e:\n        print(call[\"name\"], \"failed, missing argument:\", e)\n    except ValueError as e:\n        print(call[\"name\"], \"failed:\", e)",
  },
  quizQuestion:
    "This dispatch call is missing the \"currency\" argument, which raises a KeyError. There's an except ValueError clause listed first and an except KeyError clause listed second — which one actually runs?",
  quizCode:
    "def convert_currency(amount, currency):\n    if currency == \"EUR\":\n        return amount * 0.92\n    else:\n        return amount\n\ndef dispatch(call):\n    name = call[\"name\"]\n    args = call[\"arguments\"]\n    if name == \"convert_currency\":\n        return convert_currency(args[\"amount\"], args[\"currency\"])\n    else:\n        raise ValueError(f\"unknown tool: {name}\")\n\ncall = {\"name\": \"convert_currency\", \"arguments\": {\"amount\": 50}}\n\ntry:\n    result = dispatch(call)\n    print(result)\nexcept ValueError as e:\n    print(f\"blocked: {e}\")\nexcept KeyError as e:\n    print(f\"missing field: {e}\")",
  quizOptions: [
    {
      key: "a",
      label:
        "The except KeyError clause — it matches by the exception's actual type, not by which except is listed first",
      correct: true,
    },
    {
      key: "b",
      label: "The except ValueError clause, since it's listed first and catches whatever error comes along",
      correct: false,
    },
    {
      key: "c",
      label: "Neither — once one except clause fails to match, the whole try/except is skipped and the error crashes the program",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — each except clause only handles the type it names. The interpreter checks them in order and runs whichever one actually matches the raised type, skipping past ones that don't, so this KeyError lands in except KeyError even though it's listed second.",
  quizFeedbackIncorrect:
    "Not quite — listing except ValueError first doesn't make it a catch-all for every error. The raised type is checked against each except clause in order until one matches, so this KeyError skips straight past except ValueError and into except KeyError.",
  takeaway:
    "A tool call can fail in ways your dispatcher's routing never anticipated — missing arguments, rejected values, unknown records. Wrapping the call in try/except with one clause per expected error type turns a program-ending crash into a graceful fallback, which is what makes a tool-calling agent survivable in production.",
};

export default content;
