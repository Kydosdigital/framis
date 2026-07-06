import type { LessonData } from "../types";

const content: LessonData = {
  num: 26,
  orderIndex: 4,
  phaseLabel: "HUMAN-IN-THE-LOOP + GUARDRAILS",
  title: "The Review Screen Is Part of the Guardrail, Not an Afterthought",
  minutes: 18,
  concept:
    "All the careful work of deciding when to escalate and to whom falls apart if the screen a human actually sees is a wall of raw logs with an 'approve' button at the bottom. A well-designed review UI puts the model's recommended action and its stated confidence front and center — not buried under everything the model considered — because a reviewer's first job is to judge one specific recommendation, not to re-derive the whole decision from scratch. Right below that recommendation belongs the evidence that actually matters: the specific order, the account history, the flagged pattern — not a full transcript of every tool call the model made along the way, most of which is noise to a human under time pressure. Overriding a recommendation should be fast and structured — a small set of buttons like approve, modify, or reject with a required reason code — rather than a blank text box, both because free text is slower to act on and because structured reasons are the only kind of feedback that can be fed back into improving the thresholds and the model later. And because a reviewer only has so much attention in a shift, the UI should actively fight decision fatigue: batching similar low-stakes cases together, and making sure the cases that truly need careful judgment don't get rubber-stamped just because they arrived case #47 in a long queue.",
  conceptSimpler:
    "It's like the difference between an ER doctor getting a one-page chart with vitals, the suspected diagnosis, and relevant history highlighted, versus getting handed the patient's entire decade of medical records and being told to find what matters themselves — both technically give the doctor 'the information,' but only one lets them actually do their job well.",
  vizStages: [
    {
      label: "The wrong way: dump the model's raw output",
      body:
        "A review screen that just pastes the model's full reasoning trace and every tool call it made forces the human to read through all of it before finding the one thing they're actually being asked to decide. Under time pressure, most reviewers will skim past the parts that matter along with the noise.",
      code:
        "[raw log]\nstep 1: fetched order #48213\nstep 2: checked refund policy table\nstep 3: computed risk score 0.71\nstep 4: checked prior refund count: 3\nstep 5: recommendation: escalate\n[approve] [reject]",
    },
    {
      label: "The right way: recommendation first, evidence right beneath it",
      body:
        "The same case, redesigned: the recommended action and confidence are the first thing on the screen, in large type, followed immediately by only the two or three facts that actually drove the recommendation — order details and refund history — with everything else collapsed unless the reviewer chooses to dig deeper.",
      code:
        "RECOMMENDATION: escalate_to_human  (confidence 0.71)\nWHY: amount above auto-approve ceiling, no fraud signals\nEVIDENCE: order #48213 · 3 prior refunds, all approved\n[show full reasoning trace ▾]",
    },
    {
      label: "Structured overrides, not free-text essays",
      body:
        "Instead of one open text box for the reviewer's decision, the UI offers a small set of buttons — approve, modify, reject — each of which requires picking a reason code from a short list rather than typing a paragraph. This is faster for the human in the moment, and it produces data that's actually usable later.",
      code:
        "[Approve]  [Modify]  [Reject]\nreason (required): \"policy_match_incorrect\" | \"amount_miscalculated\" | \"other\"",
    },
    {
      label: "Every override becomes a data point, not just a decision",
      body:
        "When a reviewer rejects or modifies a recommendation, the structured reason code gets logged alongside the case and fed back into the system — this is exactly the signal that later gets used to recalibrate confidence thresholds or retrain the model, closing the loop between 'a human disagreed' and 'the system gets better.'",
      code:
        "override_log.append({\"case_id\": \"req-101\", \"model_action\": \"escalate\", \"human_action\": \"reject\", \"reason\": \"amount_miscalculated\"})",
    },
    {
      label: "Fighting decision fatigue on purpose",
      body:
        "A reviewer who approves 200 similar low-stakes cases in a row is prone to rubber-stamping case 201 too, even if it's actually different. Good review UIs batch near-identical low-stakes cases together for fast bulk handling, while visually distinguishing the rare, high-stakes case so it doesn't get the same one-click treatment as everything around it.",
      code:
        "batch: 40 cases, all \"amount < $20, exact policy match\" -> bulk-approve view\nflagged: 1 case, \"amount $18,000, ambiguous reason\" -> full detail view, no bulk action",
    },
  ],
  realWorldIntro:
    "Content-moderation tools like the review queues built on top of systems from companies such as Sift or internal trust-and-safety tooling at large platforms follow this exact pattern: the flagged content and the model's stated reason sit at the top of the screen, a fixed set of action buttons with required reason codes sits right below it, and every human decision is logged in a structured format specifically so it can be used to audit and retrain the model later.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each version of the same review case to see how the same underlying decision gets easier or harder to review well depending on how the screen is built.",
    stages: [
      {
        label: "Version 1: everything, in the order the model produced it",
        body:
          "The screen shows the model's entire chain of steps top to bottom, ending in an approve/reject button. There's no visual distinction between the two facts that actually mattered and the eight that didn't, so the reviewer has to read the whole thing every time just to find the recommendation.",
      },
      {
        label: "Version 2: the recommendation is the headline",
        body:
          "The same case, but now 'escalate_to_human, confidence 0.71' is the first thing visible, in large text, with the full reasoning trace collapsed behind a 'show more' toggle. A reviewer can act on the headline alone for most cases and only expand the details when something looks off — this cuts review time without hiding information, since it's still one click away.",
      },
      {
        label: "A free-text box versus reason-coded buttons",
        body:
          "One version asks the reviewer to type why they're overriding a recommendation. Another gives them three buttons — approve, modify, reject — each requiring a pick from a short list of reason codes. The second version is faster for the reviewer in the moment, and unlike free text, every one of those reasons can be counted, grouped, and used later to see whether the model is consistently wrong in one particular way.",
      },
      {
        label: "200 routine approvals in a row, then one that isn't routine",
        body:
          "A reviewer has approved 200 near-identical low-dollar cases this shift. Case 201 looks the same at a glance but actually involves ten times the dollar amount. A UI that renders every case identically invites the reviewer to click through it the same way as the last 200 — a well-designed screen visually flags anything that breaks the pattern (different color, a warning badge, no bulk-action button) specifically so it doesn't get the autopilot treatment.",
      },
      {
        label: "What happens to a rejected recommendation",
        body:
          "A reviewer rejects the model's recommendation and picks the reason 'amount_miscalculated.' If the UI just closes the case, that signal is lost. If the UI logs the model's original action, the human's action, and the reason code together, that record becomes exactly the input needed to check whether the model's math is systematically off in some category of case — turning one override into an improvement for every future case like it.",
      },
    ],
  },
  quizQuestion:
    "Two review UIs show the same escalated refund case. One lets the reviewer type a free-text explanation if they disagree with the model. The other requires picking a reason code from a short fixed list. Why might the fixed list actually be the better design, even though it gives the reviewer less freedom?",
  quizOptions: [
    {
      key: "a",
      label:
        "Structured reason codes can be counted and grouped across many cases, which makes it possible to later detect patterns like 'the model keeps getting one specific thing wrong' — free text can't be aggregated the same way without extra work",
      correct: true,
    },
    {
      key: "b",
      label:
        "Free text should never be allowed anywhere in a review UI, since reviewers can't be trusted to describe their reasoning",
      correct: false,
    },
    {
      key: "c",
      label:
        "It doesn't actually matter which one is used, since the model's original recommendation is the only thing that gets logged either way",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the point isn't to restrict the reviewer for its own sake, it's that a fixed set of reason codes turns every override into structured, countable data, which is what actually lets a team later notice patterns like recurring miscalculations and feed that back into the system.",
  quizFeedbackIncorrect:
    "Not quite — this isn't about whether reviewers can be trusted, and the human's decision absolutely gets logged too. The real advantage of a fixed reason-code list is that it produces data that can be aggregated across many cases, which free text makes much harder to do without extra processing.",
  takeaway:
    "The review screen is a guardrail in its own right: surface the recommendation before the raw reasoning, make overrides fast and structured instead of free-form, and design deliberately against the fatigue that turns careful review into rubber-stamping.",
};

export default content;
