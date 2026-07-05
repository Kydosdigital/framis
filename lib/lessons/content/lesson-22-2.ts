import type { LessonData } from "../types";

const content: LessonData = {
  num: 22,
  orderIndex: 2,
  phaseLabel: "HUMAN-IN-THE-LOOP + GUARDRAILS",
  title: "Trust the Number, Not the Vibe: Routing on Confidence",
  minutes: 20,
  concept:
    "A model can attach a confidence score to almost any decision it makes — how sure it is a support ticket matches a known issue, how sure an extracted invoice total is correct, how sure a moderation call is right. The simplest guardrail turns that single number into a routing decision using two thresholds instead of one: a high bar above which the model is right often enough that acting alone is safe, and a low floor below which the model essentially has no useful signal at all. Confidence sitting between those two lines is the 'ask a human' zone — not so low the model is guessing, but not so high you'd bet money on it unsupervised. Two things make this harder than it sounds: a model's stated confidence is not automatically a calibrated probability — a model can say '95% confident' and still be wrong far more than 5% of the time if nobody has ever checked that number against real outcomes. And the floor is not just a weaker version of escalation — below it, the signal is so unreliable that dressing up a low-confidence guess as an 'AI recommendation' for a human to review can do more harm than good, so the safer move is to block the action outright and treat it as a raw exception instead.",
  conceptSimpler:
    "It's like a weather forecast: above 90% chance of rain you just grab an umbrella without asking anyone, below 10% you basically ignore the forecast because it's noise, and anywhere in between you check a second source before deciding.",
  vizStages: [
    {
      label: "1. Every decision comes with a confidence number",
      body:
        "Before routing anything, the model attaches a single number between 0 and 1 to its own output — how sure it is about the call it just made.",
      code: "request = {\"id\": \"req-101\", \"confidence\": 0.96}",
    },
    {
      label: "2. Two thresholds carve out three lanes",
      body:
        "A high bar marks 'confident enough to act alone,' and a low floor marks 'too uncertain to trust at all.' Everything between those two lines becomes the human-review zone.",
      code: "high = 0.9\nfloor = 0.35",
    },
    {
      label: "3. The routing function, in full",
      body:
        "The three lanes fall out of a single if/elif/else: at or above the high bar, auto-approve; at or above the floor but below the bar, escalate; below the floor, block outright.",
      code:
        "def route_by_confidence(confidence):\n    if confidence >= high:\n        return \"auto_approve\"\n    elif confidence >= floor:\n        return \"escalate_to_human\"\n    else:\n        return \"block_and_flag\"",
    },
    {
      label: "4. Running it against real requests",
      body:
        "A 0.96 sails through automatically. A 0.71 and a 0.5 both land in the human queue, even though one is much closer to the auto-approve bar than the other. A 0.2 gets blocked, not escalated — the model has nothing worth showing a reviewer.",
      code:
        "0.96 -> auto_approve\n0.71 -> escalate_to_human\n0.50 -> escalate_to_human\n0.20 -> block_and_flag",
    },
  ],
  realWorldIntro:
    "Invoice-processing tools like the ones behind Bill.com and Ramp attach a confidence score to every field an extraction model reads off a scanned document, and the same three-lane pattern shows up again: high-confidence fields post straight to the ledger, mid-confidence fields go to a human reviewer's queue, and low-confidence fields get rejected back for a rescan instead of asking a person to rubber-stamp a guess.",
  realWorldCode:
    "def route_invoice_field(field_name, confidence):\n    if confidence >= 0.92:\n        return \"post_to_ledger\"\n    elif confidence >= 0.4:\n        return \"send_to_reviewer\"\n    else:\n        return \"reject_rescan\"",
  sandbox: {
    kind: "code",
    challenge:
      "Write a function that routes a request to auto-approve, escalate-to-human, or block-and-flag based on how its confidence score compares to a high threshold and a low floor, then run it over a batch of requests and tally the outcomes.",
    starterCode:
      "def route_by_confidence(confidence):\n    assert confidence >= 0 and confidence <= 1, \"confidence must be between 0 and 1\"\n    high = 0.9\n    floor = 0.35\n    if confidence >= high:\n        return \"auto_approve\"\n    elif confidence >= floor:\n        return \"escalate_to_human\"\n    else:\n        return \"block_and_flag\"\n\nrequests = [{\"id\": \"req-101\", \"confidence\": 0.96}, {\"id\": \"req-102\", \"confidence\": 0.71}, {\"id\": \"req-103\", \"confidence\": 0.5}, {\"id\": \"req-104\", \"confidence\": 0.2}]\n\napproved = 0\nescalated = 0\nblocked = 0\n\nfor req in requests:\n    action = route_by_confidence(req[\"confidence\"])\n    print(f\"{req['id']}: confidence {req['confidence']} -> {action}\")\n    if action == \"auto_approve\":\n        approved = approved + 1\n    elif action == \"escalate_to_human\":\n        escalated = escalated + 1\n    else:\n        blocked = blocked + 1\n\nprint(f\"auto-approved: {approved}, escalated: {escalated}, blocked: {blocked}\")",
  },
  quizQuestion:
    "A fraud model reports 92% confidence that a transaction is legitimate — above the auto-approve threshold — and auto-approves it. The transaction turns out to be fraudulent. What does this actually suggest about confidence thresholds?",
  quizCode:
    "def route_by_confidence(confidence):\n    if confidence >= 0.9:\n        return \"auto_approve\"\n    elif confidence >= 0.35:\n        return \"escalate_to_human\"\n    else:\n        return \"block_and_flag\"\n\naction = route_by_confidence(0.92)\nprint(action)",
  quizOptions: [
    {
      key: "a",
      label:
        "A confidence score is only useful once it's calibrated against real outcomes — a 90% threshold is meaningless if the model's '90% confident' calls aren't actually right about 90% of the time, so teams need to audit calibration, not just trust the raw number",
      correct: true,
    },
    {
      key: "b",
      label:
        "This proves confidence thresholds don't work at all, so every transaction should be escalated to a human regardless of confidence",
      correct: false,
    },
    {
      key: "c",
      label:
        "The fix is simply to raise the auto-approve threshold from 0.9 to something higher, which would have caught this case",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — one wrong call at 92% doesn't disprove thresholds, but it's a signal to check calibration: if 92%-confidence predictions are wrong noticeably more than 8% of the time across many cases, the number itself is untrustworthy and no threshold built on top of it will behave the way it looks like it should.",
  quizFeedbackIncorrect:
    "Not quite — the problem isn't that thresholds are useless or that the bar was in the wrong place; it's that the confidence number itself might not be calibrated. A threshold is only as good as the probability estimate feeding it, so the real fix is checking whether '92% confident' predictions are actually right 92% of the time.",
  takeaway:
    "A confidence score only earns trust once it's been checked against real outcomes. Thresholds carve that score into auto-approve, escalate, and block lanes — but the floor isn't a weaker form of escalation, it's the point where there's no signal left worth acting on at all.",
};

export default content;
