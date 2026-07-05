import type { LessonData } from "../types";

const content: LessonData = {
  num: 26,
  orderIndex: 3,
  phaseLabel: "HUMAN-IN-THE-LOOP + GUARDRAILS",
  title: "Escalating to 'a Human' Isn't a Plan — It's a Missing Design",
  minutes: 18,
  concept:
    "'Escalate to a human' sounds like a complete answer, but by itself it's just a to-do list item — it doesn't say which human, with what authority, seeing what context, or under what deadline. A refund request that needs a $50,000 sign-off shouldn't land in the same queue as a $12 shipping question, because the first-shift support agent who can approve the second one usually doesn't have the authority to approve the first, no matter how quickly they pick up the case. Good escalation design routes by two things at once: the domain of the problem (billing versus security versus legal versus a plain product question) and the severity or authority level required (a routine review versus something that needs a manager's sign-off versus something that needs a specialist who's trained to spot fraud patterns). The handoff itself matters as much as the destination — dumping a bare request into someone's queue with no context forces them to reconstruct everything the model already figured out, while a good handoff carries the model's reasoning, the specific evidence it used, and relevant history along with it. Finally, escalation needs a clock: if nobody acts within a set window, the case should automatically move to someone else with the right authority — not sit forever, and not get silently reassigned to whoever's next in line regardless of whether they can actually handle it.",
  conceptSimpler:
    "It's like a hospital triage desk: a sprained ankle and a chest pain patient don't go in the same line just because both need 'a doctor' — they go to different specialists, with different urgency, and the ankle case doesn't get the cardiologist just because she happened to be free first.",
  vizStages: [
    {
      label: "One queue for everything",
      body:
        "The naive setup: every escalated case — big or small, billing or security — lands in a single 'needs human review' queue, sorted only by the order it arrived. A $40,000 fraud case waits behind a dozen routine $15 questions simply because they got there first, and whoever happens to be free picks up whatever's on top, regardless of whether they're the right person for it.",
      code:
        "review_queue = [{\"ticket\": \"shipping-question\", \"amount\": 12}, {\"ticket\": \"account-takeover\", \"amount\": 40000}, {\"ticket\": \"pricing-typo\", \"amount\": 8}]\n# next reviewer just takes whatever's first in line",
    },
    {
      label: "Route by domain and by authority level",
      body:
        "A better setup sorts on two axes at once: what kind of problem this is (billing, security, legal, product), and how much authority is required to act on it (routine review vs. manager sign-off vs. specialist judgment). A support agent handles routine billing questions; a fraud analyst — not just any agent — handles anything with account-takeover signals; and only someone with sign-off authority above a dollar ceiling ever sees the largest cases, no matter how confident the model's recommendation is.",
      code:
        "def route(domain, amount):\n    if domain == \"security\":\n        return \"fraud_specialist_queue\"\n    elif amount > 10000:\n        return \"manager_signoff_queue\"\n    else:\n        return \"l1_support_queue\"",
    },
    {
      label: "Hand off context, not just a request",
      body:
        "The escalation package is the difference between a five-minute review and a twenty-minute investigation. Instead of forwarding a bare request, a good handoff attaches the model's recommendation, the specific evidence and account history it based that on, and why it didn't just handle the case itself — so the human starts from the model's work instead of redoing it from scratch.",
      code:
        "escalation = {\"recommended_action\": \"escalate\", \"reason\": \"amount above policy ceiling, no fraud signals\", \"evidence\": [\"order #48213\", \"3 prior refunds, all approved\"], \"model_confidence\": 0.71}",
    },
    {
      label: "Escalation needs a clock, and re-routing needs the same rules",
      body:
        "If a case sits untouched past its SLA — say 30 minutes for a fraud flag, 4 hours for a routine billing question — it shouldn't just wait indefinitely or get silently reassigned to whoever's next in the general pool. It should re-route using the same domain-and-authority rules that placed it originally, often escalating one level up (a specialist's manager, not a random second agent), so the case never ends up with someone less qualified than the first person it was sent to.",
      code:
        "if time_waiting_minutes > sla_minutes:\n    action = \"reroute_to_next_tier\"",
    },
    {
      label: "Authority has to be real, not assumed",
      body:
        "A queue label like 'manager review' is worthless if the system doesn't actually check that the person picking up the case holds manager-level sign-off — otherwise a case requiring $50,000 authority can get approved by whoever happens to have the right job title in their profile but not the actual permission. Routing logic and permission checks have to agree, or the escalation path is really just theater.",
      code:
        "if reviewer_signoff_limit < ticket_amount:\n    action = \"deny_reviewer_lacks_authority\"",
    },
  ],
  realWorldIntro:
    "Payment platforms like Stripe route disputed-charge cases this way in production: a routine chargeback goes to a general risk-ops queue, anything flagged for possible account compromise goes straight to a security-trained specialist, and cases above a dollar ceiling require a reviewer who actually holds sign-off authority at that level — the ticket's domain and size decide the destination, not just whoever's free.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each escalation scenario and decide who it should actually route to, then read why.",
    stages: [
      {
        label: "$30 billing question, no risk signals",
        body:
          "A customer asks why they were charged twice for the same order. It's a routine billing pattern with a clear paper trail and no fraud indicators. This belongs in the general L1 support queue — no specialist skill or elevated authority is needed, and routing it anywhere heavier just adds delay without adding safety.",
      },
      {
        label: "Login from a new device, followed by a large withdrawal request",
        body:
          "The pattern — unfamiliar device, then an immediate request to move money — is a classic account-takeover signature, regardless of the dollar amount involved. This should route to a fraud/security specialist queue, not general support, because a generalist agent isn't trained to recognize the pattern or to take the right containment steps (like freezing the account) while investigating.",
      },
      {
        label: "$75,000 refund request, textbook policy match",
        body:
          "The policy clearly covers this refund and there's nothing suspicious about the request — but the dollar amount alone puts it above what almost any individual agent is authorized to approve. This should route to whoever holds sign-off authority at that dollar tier, which is a question of permission level, not of how confident the model is or how clean the policy match looks.",
      },
      {
        label: "A billing case that's waited 6 hours past its SLA",
        body:
          "The case was correctly routed to L1 support, but nobody has picked it up. Rather than let it sit indefinitely or get quietly dumped into an unrelated agent's queue, the SLA breach should trigger a re-route within the same domain — for example, up to a shift lead in support — so it still lands with someone equipped to handle it, just with more urgency attached.",
      },
      {
        label: "A model recommends 'escalate' but attaches almost no context",
        body:
          "Technically the case reached a human, but the escalation just says 'needs review' with no evidence, no reasoning, and no history attached. Even though the routing (queue and person) might be correct, the handoff itself has failed — the reviewer now has to reconstruct everything from scratch, which defeats much of the point of having the model triage the case in the first place. Good escalation design treats the context package as seriously as the destination.",
      },
    ],
  },
  quizQuestion:
    "A refund case requiring $80,000 of authority gets auto-routed to 'manager_signoff_queue,' and the first available manager approves it. Later it turns out that manager's actual sign-off limit was only $25,000. What went wrong?",
  quizOptions: [
    {
      key: "a",
      label:
        "The routing logic assumed the queue label matched real permissions, but never checked the reviewer's actual authority against the case's dollar amount before letting them act",
      correct: true,
    },
    {
      key: "b",
      label:
        "Nothing went wrong — as long as a case reaches any human in a queue named for the right domain, the escalation design has done its job",
      correct: false,
    },
    {
      key: "c",
      label:
        "The model's confidence score must have been miscalibrated, since that's the only thing that determines whether an approval is valid",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a queue name is just a label; the system has to actually check that the person taking the action holds sign-off authority for that specific amount, or the routing design is enforcing nothing real, no matter how correctly the case was categorized on paper.",
  quizFeedbackIncorrect:
    "Not quite — this isn't a confidence-calibration issue at all. The case was routed to a queue with the right name, but nothing verified that the specific reviewer who picked it up actually held that level of sign-off authority — routing and permissions have to be checked together.",
  takeaway:
    "Routing a case to 'a human' is not the same as routing it to the right human — domain, authority level, context handoff, and a real permission check all have to line up, or the escalation path is safety theater with an extra step in the middle.",
};

export default content;
