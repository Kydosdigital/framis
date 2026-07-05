import type { LessonData } from "../types";

const content: LessonData = {
  num: 26,
  orderIndex: 6,
  phaseLabel: "HUMAN-IN-THE-LOOP + GUARDRAILS",
  title: "The Last Checkpoint: Validating the Answer, Scoring the Risk",
  minutes: 20,
  concept:
    "An earlier module built a JSON schema to validate a tool call's arguments before a dispatcher ever ran the underlying function — checking that a required field was present, that its type matched (a number instead of a string), and that a value came from an allowed set. That check protects one specific moment: the request the model is about to send to a function. It says nothing at all about whether the model's own final answer — a risk assessment, an extracted total, a recommended action — actually makes sense before something acts on it. The exact same discipline applies one level higher: before a routing decision gets auto-approved, before an extracted number gets posted to a ledger, before a generated field gets saved to a database, check that the output has every field it's supposed to have, that each field is the right type, and that any numeric field actually falls inside the range it's allowed to have — a confidence score has to sit between 0 and 1, a risk level has to be one of a small set of recognized labels, not a phrase the model invented on the spot. Skipping this doesn't usually look like an obvious crash; it looks like a confidence of 1.4 quietly flowing into a display as \"140% confident,\" or an unrecognized risk label falling through every branch of a downstream if/elif with nothing catching it. A different, complementary guardrail runs alongside this one: a safety classifier. An earlier lesson's blocklist checked text for exact banned words — fast, cheap, and easy to evade with a synonym or a typo. A classifier is the step up: a smaller, cheaper model, or for teaching purposes a rule-based scorer, that assigns a numeric score to a piece of text along a spectrum — how toxic it reads, how far off-topic it drifts — instead of a plain yes/no match. That score plugs into the exact same three-lane threshold pattern this module already used for dollar amounts and for confidence: below a low floor, let it through; above a high bar, block outright; in between, send it to a human moderator instead of the real user or the raw output ever reaching them unfiltered.",
  conceptSimpler:
    "It's a proofreader plus a spam filter: the proofreader checks that a report actually has every required section with numbers that make sense, while the spam filter scores how suspicious a message feels instead of just checking it against one banned word.",
  vizStages: [
    {
      label: "1. Schema checks so far only cover the request to a tool",
      body:
        "A JSON schema validated that a tool call like book_flight's arguments had a real date string and a required destination field. That's the request going into a function -- it says nothing about whether the model's own conclusion, produced separately, is trustworthy.",
      code:
        'tool_call_schema = {\n  "type": "object",\n  "properties": {"destination": {"type": "string"}, "date": {"type": "string"}},\n  "required": ["destination", "date"]\n}',
    },
    {
      label: "2. The same checks, aimed at the model's final answer",
      body:
        "A model asked to triage a case might produce a structured risk assessment instead of a tool call. Before anything acts on it, the exact same three checks apply: required fields present, each field the right type, and any numeric field inside its allowed range.",
      code:
        'def validate_output(output):\n    try:\n        risk_level = output["risk_level"]\n        confidence = output["confidence"]\n    except KeyError as e:\n        return f"invalid: missing field {e}"\n\n    if risk_level != "low" and risk_level != "medium" and risk_level != "high":\n        return f"invalid: unrecognized risk_level \'{risk_level}\'"\n\n    if confidence < 0 or confidence > 1:\n        return f"invalid: confidence {confidence} is out of range"\n\n    return "valid"',
    },
    {
      label: "3. What skipping it actually looks like",
      body:
        "Without this check, a confidence of 1.4 doesn't crash anything -- it just quietly becomes \"140% confident\" on a screen somewhere, or an invented risk_level like \"extreme\" falls through every branch of a downstream if/elif and gets treated as whatever the last else happens to do. The failure is silent, not loud.",
      code:
        'bad_output = {"risk_level": "extreme", "confidence": 1.4}\n# neither field would ever raise an error on its own --\n# both just look like slightly odd, still-usable data',
    },
    {
      label: "4. From exact-match blocklist to a scored classifier",
      body:
        "A blocklist checks text against a fixed list of banned words -- cheap, but only catches the exact words someone thought to list. A classifier scores text along a spectrum instead, so a value like 0.83 for \"how toxic does this read\" can flag content a blocklist's plain equality check would sail right past.",
      code:
        'def toxicity_score(flagged_word_count, total_words):\n    if total_words == 0:\n        return 0.0\n    return flagged_word_count / total_words',
    },
    {
      label: "5. The score plugs into the same three-lane pattern",
      body:
        "This is the identical high-bar / low-floor shape used earlier in this module for dollar amounts and for confidence -- just pointed at a safety score instead, and running before content reaches a human reviewer or the real user rather than after.",
      code:
        'def route_by_safety_score(score):\n    if score >= 0.8:\n        return "block"\n    elif score >= 0.3:\n        return "send_to_human_moderator"\n    else:\n        return "allow"',
    },
  ],
  realWorldIntro:
    "Structured-extraction pipelines -- invoice processing, insurance-claim triage -- validate a model's final structured answer against a schema before writing a single field to a database, checking that dates actually parse and that amounts fall inside a sane range, which is the exact same discipline module 15 taught for tool-call arguments, just aimed at the answer instead of the request. Content-moderation systems run a lightweight classifier over both the incoming message and the outgoing reply for the same reason a plain blocklist isn't enough on its own: a classifier's score can catch a rephrased slur or an off-topic drift that no exact-match list was ever going to list in advance.",
  realWorldCode:
    'def process_model_output(output, score):\n    check = validate_output(output)\n    if check != "valid":\n        return f"rejected: {check}"\n    lane = route_by_safety_score(score)\n    return f"validated output, routed to: {lane}"',
  sandbox: {
    kind: "code",
    challenge:
      "Write validate_output(output), which checks that a model's structured answer has both required fields, that risk_level is one of three recognized labels, and that confidence falls between 0 and 1 -- then run it over a batch of outputs, including some that are malformed in different ways.",
    starterCode:
      'def validate_output(output):\n    try:\n        risk_level = output["risk_level"]\n        confidence = output["confidence"]\n    except KeyError as e:\n        return f"invalid: missing field {e}"\n\n    if risk_level != "low" and risk_level != "medium" and risk_level != "high":\n        return f"invalid: unrecognized risk_level \'{risk_level}\'"\n\n    if confidence < 0 or confidence > 1:\n        return f"invalid: confidence {confidence} is out of range"\n\n    return "valid"\n\noutputs = []\noutputs.append({"risk_level": "low", "confidence": 0.92})\noutputs.append({"risk_level": "high", "confidence": 0.4})\noutputs.append({"risk_level": "extreme", "confidence": 0.7})\noutputs.append({"confidence": 0.5})\noutputs.append({"risk_level": "medium", "confidence": 1.4})\n\nfor output in outputs:\n    result = validate_output(output)\n    print(output, "->", result)',
  },
  quizQuestion:
    "A team already validates every tool call's arguments with a JSON schema (module 15), so they skip validating the model's final structured answer separately. A risk assessment then comes back as {\"risk_level\": \"medium\", \"confidence\": 1.4}, and it flows straight downstream. What's the flaw in their reasoning?",
  quizCode:
    'def validate_output(output):\n    try:\n        risk_level = output["risk_level"]\n        confidence = output["confidence"]\n    except KeyError as e:\n        return f"invalid: missing field {e}"\n    if risk_level != "low" and risk_level != "medium" and risk_level != "high":\n        return f"invalid: unrecognized risk_level \'{risk_level}\'"\n    if confidence < 0 or confidence > 1:\n        return f"invalid: confidence {confidence} is out of range"\n    return "valid"\n\nmodel_output = {"risk_level": "medium", "confidence": 1.4}\nprint(validate_output(model_output))',
  quizOptions: [
    {
      key: "a",
      label:
        "Tool-call argument validation only checks the shape of a request going into a function -- it never looks at the model's own final answer at all, so an out-of-range or malformed final answer can slip through completely unless it gets its own separate check",
      correct: true,
    },
    {
      key: "b",
      label:
        "Nothing is wrong with skipping it -- a schema check anywhere in the pipeline automatically covers every piece of output the model ever produces",
      correct: false,
    },
    {
      key: "c",
      label:
        "The right fix is to silently clip any out-of-range confidence value to 1.0 so downstream code never has to see an invalid number",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right -- module 15's schema validated the arguments handed to a tool, a completely different moment from the model's own final answer. Those are two separate checkpoints, and skipping the second one is exactly how a confidence of 1.4 or an invented risk_level ends up flowing downstream unnoticed.",
  quizFeedbackIncorrect:
    "Not quite -- silently coercing the bad value hides the problem instead of catching it, and a schema check on tool-call arguments never touches the model's separate final answer in the first place. The fix is a distinct validation step aimed specifically at the answer itself, one that flags an invalid value instead of quietly patching it.",
  takeaway:
    "Validating a tool call's arguments and validating the model's own final answer are two different checkpoints -- required fields, correct types, and sane ranges have to be checked at both. A safety classifier extends the same idea from exact-match blocklists to a scored spectrum, and that score can reuse the same auto-allow / escalate-to-human / block threshold pattern this module already built for dollars and for confidence.",
};

export default content;
