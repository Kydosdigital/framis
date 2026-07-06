import type { LessonData } from "../types";

const content: LessonData = {
  num: 20,
  orderIndex: 2,
  phaseLabel: "EVALS + SAFETY + GUARDRAILS",
  title: "In and out: a guardrail that checks both ends of the conversation",
  minutes: 18,
  concept:
    "A guardrail is a plain function that runs alongside the model, not inside it — it checks a piece of text against a list of things you've decided are unsafe, and returns whether that text is allowed through. The same guardrail typically runs twice: once on the user's input before it ever reaches the model, and once on the model's output before it ever reaches the user, because a bad response can show up even from a completely innocent-looking prompt. The simplest version of this check is a blocklist: a list of exact words or phrases you consider unsafe, compared one at a time against every word in the text you're checking, with a flag that flips the moment any match is found. Because this comparison is exact matching rather than any real understanding of meaning, a blocklist guardrail is fast, cheap, and completely predictable — but it only catches the specific words you thought to list, so a synonym, a typo, or a clever rephrasing slides right through untouched. That's why guardrails get described as a floor, not a ceiling: they catch the obvious, known-bad cases for almost no cost, and everything subtler still needs a smarter classifier, a real eval, or a human.",
  conceptSimpler:
    "It's the metal detector at a stadium gate: fast, and great at catching the exact things it was built to detect, but it does nothing at all against a threat it wasn't designed to recognize.",
  vizStages: [
    {
      label: "1. Two checkpoints, not one",
      body:
        "A guardrail sits at both ends of the pipeline — once between the user and the model, and once between the model and the user — because unsafe text can originate from either side.",
      code:
        "# user_input -> [guardrail] -> model -> [guardrail] -> user\nblocked_terms = [\"malware\", \"bomb\", \"ssn\"]",
    },
    {
      label: "2. The blocklist is just a list",
      body:
        "There's no cleverness here on purpose — it's a list of exact strings someone decided are never acceptable, kept separate from the checking logic so it can be updated without touching any code.",
      code: "blocked_terms = [\"malware\", \"bomb\", \"ssn\", \"creditcard\"]",
    },
    {
      label: "3. Checking word by word with a flag",
      body:
        "The checker walks every word in the text and compares it against every entry in the blocklist. The moment one matches, a boolean flag flips to unsafe — there's no partial credit and no early exit needed for correctness.",
      code:
        "def is_safe(words, blocked):\n    safe = True\n    for w in words:\n        for term in blocked:\n            if w == term:\n                safe = False\n    return safe",
    },
    {
      label: "4. Allow or block, nothing in between",
      body:
        "The final decision is binary: if is_safe comes back True, the text moves on to the next stage of the pipeline; if it comes back False, it gets rejected or rewritten before it goes any further.",
      code:
        "if is_safe(reply_words, blocked_terms):\n    send_to_user(reply_words)\nelse:\n    print(\"BLOCKED: response withheld\")",
    },
  ],
  realWorldIntro:
    "Many production assistants run a moderation check as a required pipeline step on every single request and every single response, rejecting or rewriting anything that trips it regardless of how the model itself would have handled it left alone.",
  realWorldCode:
    "if not is_safe(user_words, blocked_terms):\n    print(\"request blocked before reaching the model\")\nelif not is_safe(model_words, blocked_terms):\n    print(\"response blocked before reaching the user\")\nelse:\n    print(\"delivered\")",
  sandbox: {
    kind: "code",
    challenge:
      "Trace the guardrail below: it checks a user message and a model reply against a shared blocklist and prints ALLOWED or BLOCKED for each.",
    starterCode:
      "blocked_terms = [\"bomb\", \"malware\", \"ssn\", \"creditcard\"]\n\ndef is_safe(words, blocked):\n    safe = True\n    for w in words:\n        for term in blocked:\n            if w == term:\n                safe = False\n    return safe\n\ndef check_and_report(label, words, blocked):\n    if is_safe(words, blocked):\n        print(f\"{label}: ALLOWED\", words)\n    else:\n        print(f\"{label}: BLOCKED\", words)\n\nuser_input = [\"explain\", \"how\", \"photosynthesis\", \"works\"]\nrisky_input = [\"give\", \"me\", \"a\", \"customer\", \"ssn\"]\n\nmodel_output = [\"the\", \"sun\", \"provides\", \"energy\"]\nrisky_output = [\"here\", \"is\", \"malware\", \"code\"]\n\ncheck_and_report(\"user_input\", user_input, blocked_terms)\ncheck_and_report(\"risky_input\", risky_input, blocked_terms)\ncheck_and_report(\"model_output\", model_output, blocked_terms)\ncheck_and_report(\"risky_output\", risky_output, blocked_terms)",
  },
  quizQuestion:
    "A team only runs their blocklist guardrail on the user's input, never on the model's output. Which scenario slips through anyway?",
  quizCode:
    "def is_safe(words, blocked):\n    safe = True\n    for w in words:\n        for term in blocked:\n            if w == term:\n                safe = False\n    return safe\n\nblocked_terms = [\"malware\"]\nuser_message = [\"please\", \"explain\", \"encryption\"]\nmodel_reply = [\"here\", \"is\", \"malware\", \"code\"]\n\nif is_safe(user_message, blocked_terms):\n    print(\"input check: ALLOWED - forwarding model reply to user\")\nprint(model_reply)",
  quizOptions: [
    {
      key: "a",
      label:
        "The model generates unsafe content in response to a totally benign-looking prompt, so nothing about the input would have tripped the filter — only checking the output would catch it",
      correct: true,
    },
    {
      key: "b",
      label: "The blocklist doesn't have enough words in it, which is the only reason anything unsafe could ever get through",
      correct: false,
    },
    {
      key: "c",
      label: "Checking input alone is always sufficient, since a model can never produce unsafe text on its own",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the quiz code shows exactly this: user_message passes the input check easily, but model_reply contains \"malware\" and is never checked at all, so it goes straight to the user unfiltered.",
  quizFeedbackIncorrect:
    "Not quite — the list length isn't the issue here; even a perfect blocklist can't catch anything if it's only ever applied to the input side, and the model's own output was never run through it.",
  takeaway:
    "Guardrails are exact-match filters that should run on both the input reaching the model and the output leaving it, since an unsafe result can appear on either side — but because they only catch what's on the list, they're a cheap first line of defense, not a substitute for real evals or human review.",
};

export default content;
