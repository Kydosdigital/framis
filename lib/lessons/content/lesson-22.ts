import type { LessonData } from "../types";

const content: LessonData = {
  num: 22,
  phaseLabel: "HUMAN-IN-THE-LOOP + GUARDRAILS",
  title: "The Refund Bot's Three Lanes: Auto-Approve, Ask, or Block",
  minutes: 20,
  concept:
    "An AI agent that can take real-world actions — like approving a customer refund — should not treat every request the same way. The right design sorts each request into one of three lanes: auto-approve for cases that are low-risk and match a clear policy, ask-a-human for cases that are ambiguous or carry real financial or reputational risk, and block for cases that look abusive or fraudulent. The lane isn't decided by the agent's confidence alone — it's decided by a combination of dollar amount, policy clarity, and the cost of being wrong. A $4 refund for a late pizza delivery costs almost nothing to get wrong, so autonomy is fine; a $2,000 refund with a vague reason costs a lot to get wrong, so a human should see it before money moves. This three-lane split is the core pattern behind almost every production agent that's allowed to touch money, data, or anything irreversible.",
  conceptSimpler:
    "It's like a new employee at a return counter: small, obvious returns they can just handle; confusing or expensive ones they bring to a manager; and anything that smells like a scam, they refuse and flag security — they never guess on the expensive or shady ones.",
  vizStages: [
    {
      label: "1. Every request starts with the same signals",
      body:
        "Before deciding anything, the agent gathers three facts about the request: how much money is involved, how clearly it matches an existing policy, and whether anything about it looks suspicious.",
      code:
        "request = {\n    \"amount\": 480,\n    \"reason\": \"item arrived damaged\",\n    \"policy_match\": \"unclear\",\n    \"fraud_signals\": [],\n}",
    },
    {
      label: "2. Low risk + clear policy -> auto-approve",
      body:
        "When the amount is small and the reason matches a documented policy exactly, the agent can act on its own — a human reviewing every $6 late-delivery credit doesn't make anyone safer, it just makes support slower.",
      code:
        "if request[\"amount\"] <= 25 and request[\"policy_match\"] == \"exact\":\n    action = \"auto_approve\"",
    },
    {
      label: "3. High risk or unclear -> ask a human",
      body:
        "Once the dollar amount climbs, or the reason doesn't cleanly match a written policy, the cost of a wrong autonomous call goes up. The agent should pause, draft its recommendation, and route it to a human instead of deciding alone.",
      code:
        "elif request[\"amount\"] > 25 or request[\"policy_match\"] == \"unclear\":\n    action = \"escalate_to_human\"",
    },
    {
      label: "4. Suspicious pattern -> block, don't ask, don't approve",
      body:
        "Fraud signals are a different category entirely — asking a human to double check still leaves a window open, and auto-approving is obviously wrong. The safest move is to block the action immediately and flag the account for investigation.",
      code:
        "if request[\"fraud_signals\"]:\n    action = \"block_and_flag\"",
    },
  ],
  realWorldIntro:
    "Support platforms like Zendesk and Intercom are shipping AI agents that draft or execute refunds directly, and every serious deployment ships with an approval-threshold policy — a dollar cutoff and a set of trigger conditions above which the agent must stop and hand the case to a human rather than act.",
  realWorldCode:
    "def route_refund(amount, policy_match, fraud_signals):\n    if fraud_signals:\n        return \"block_and_flag\"\n    if amount <= 25 and policy_match == \"exact\":\n        return \"auto_approve\"\n    return \"escalate_to_human\"",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each refund scenario and decide which lane it belongs in before reading the explanation.",
    stages: [
      {
        label: "$5 refund, clear policy match",
        body:
          "A customer's coffee order arrived cold and the receipt confirms the order and timestamp. Amount is trivial and the policy for 'order quality issue under $10' is written down and unambiguous. This should auto-approve — the downside of being wrong is a few dollars, and requiring a human here just adds delay for no safety benefit.",
      },
      {
        label: "$500 refund, ambiguous reason",
        body:
          "A customer wants $500 back for a 'service that didn't meet expectations,' with no specific policy covering that phrasing and no clear evidence either way. The amount is high enough that an error is costly, and the reason doesn't map cleanly to any rule the agent was given. This should escalate to a human — the agent can pre-fill the case with its recommendation, but a person should make the final call.",
      },
      {
        label: "Refund request that looks like fraud",
        body:
          "Five refund requests hit the same account in ten minutes, each just under the auto-approve threshold, from a shipping address that doesn't match the billing address. The pattern (amount hovering just below a known limit, rapid repetition) is a classic signal of someone probing for a threshold to exploit. This should block and flag — not escalate, not approve — because the right response is to freeze the action and alert a fraud reviewer, not simply ask someone to rubber-stamp it.",
      },
      {
        label: "$40 refund, policy match but first-time customer",
        body:
          "A brand-new customer requests a $40 refund for a listed defect that policy clearly covers. It's slightly above a strict low-dollar cutoff, but the policy match is exact and there are no risk signals — just newness. Many teams still auto-approve here, since 'first-time customer' alone isn't a risk signal; the amount and policy clarity are what matter, not account tenure. This shows that a lane decision should be based on defined risk criteria, not on hunches like account age.",
      },
      {
        label: "$50,000 refund, exact policy match",
        body:
          "A large enterprise client requests a refund for a canceled annual contract, and the cancellation policy exactly and unambiguously covers it. Even though the policy match is perfect, the dollar amount alone is enough to warrant human sign-off — some organizations set an absolute ceiling above which nothing auto-approves, regardless of how clean the match is, because the blast radius of a mistake is too large. This should escalate to a human, showing that amount can override a clean policy match on its own.",
      },
    ],
  },
  quizQuestion:
    "A refund request is for $18, matches a written policy exactly, and shows no fraud signals — but the agent notices the customer has filed six refund requests this month. Under the auto-approve / escalate / block framework, what's the right lane, and why?",
  quizOptions: [
    {
      key: "a",
      label:
        "Escalate to a human — the repeated-requests pattern is itself a risk signal worth a person's judgment, even though amount and policy match look clean",
      correct: true,
    },
    {
      key: "b",
      label:
        "Auto-approve, since amount and policy match are the only two factors that ever matter",
      correct: false,
    },
    {
      key: "c",
      label:
        "Block and flag immediately, since repeated requests always mean fraud",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Correct — a low amount and exact policy match usually mean auto-approve, but an unusual pattern like repeated requests is a risk signal the simple rule didn't account for, so the safer move is to route it to a human rather than silently approve or overreact by blocking on a pattern that could still be innocent.",
  quizFeedbackIncorrect:
    "Not quite — amount and policy match are the baseline signals, but they're not the only ones; a pattern like six requests in a month is exactly the kind of signal that should push a case out of auto-approve and into human review, even though it's not damning enough to block outright.",
  takeaway:
    "Not every AI action deserves the same amount of trust: sort requests into auto-approve, ask-a-human, and block based on dollar amount, policy clarity, and risk signals together — never let a single clean signal like 'policy matches' override everything else the agent has noticed.",
  nextUpLabel: "Observability + Cost Controls",
};

export default content;
