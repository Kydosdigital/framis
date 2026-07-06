import type { LessonData } from "../types";

const content: LessonData = {
  num: 20,
  orderIndex: 4,
  phaseLabel: "EVALS + SAFETY + GUARDRAILS",
  title: "The eval can't tell: when a person has to make the call",
  minutes: 18,
  concept:
    "Automated evals are excellent at answering questions with a clear right answer — did the SQL query run, does the output contain the required disclaimer, is the JSON valid — but plenty of real quality problems aren't yes/no at all. Whether a reply sounds condescending, whether a joke landed as funny rather than offensive, whether a summary captured the actually important point instead of a technically-true but irrelevant one — these are judgment calls that even a carefully written eval script, or a second model grading the first one, can get systematically wrong without anyone noticing. Human review closes that gap by routing a sample of real outputs to a person who reads them the way an actual user would and rates them against criteria evals can't operationalize, like tone, trustworthiness, or whether an edge case was handled with good judgment rather than just technically-defensible logic. Because reviewing every single output doesn't scale, teams typically sample: a random slice of everyday traffic to catch slow, quiet drift, plus a mandatory full review of anything flagged as high-risk, like refunds, medical topics, or anything a guardrail already hesitated on. The review process only stays trustworthy if multiple reviewers are checked against each other for agreement — if two people shown the same output rate it differently half the time, the rubric is too vague to rely on yet, and that's a signal to fix before the review scores mean anything.",
  conceptSimpler:
    "Automated evals are a spell-checker — instant and great at catching clear-cut errors; human review is an editor who actually reads the piece and asks whether it's any good.",
  vizStages: [
    {
      label: "1. What automated evals are good at",
      body:
        "Crisp, checkable properties — exact string matches, valid formats, required fields present — run fast, cost nothing per check, and never disagree with themselves.",
      code:
        "if response_json[\"status\"] in [\"ok\", \"error\"]:\n    passed = passed + 1\n# fast, cheap, unambiguous",
    },
    {
      label: "2. Where they fall apart",
      body:
        "Two candidate replies to a sensitive question can both pass every automated check — no banned words, correct format, right facts — while one reads as warm and the other reads as cold and dismissive. No blocklist or exact-match test sees that difference.",
      code:
        "reply_a = \"That's not covered, sorry.\"\nreply_b = \"I hear you — unfortunately that's outside what we cover, but here's what I can do instead.\"\n# both pass every automated check identically",
    },
    {
      label: "3. Sampling: reviewing everything doesn't scale",
      body:
        "Instead of reading every output, teams review a random slice of ordinary traffic to catch slow drift, and treat anything flagged as high-risk — refunds, health topics, anything a guardrail hesitated on — as mandatory, 100% reviewed.",
      code:
        "if is_high_risk(conversation):\n    queue_for_review(conversation)  # always\nelif random_sample_hit():\n    queue_for_review(conversation)  # sometimes",
    },
    {
      label: "4. Reviewer agreement closes the loop back to evals",
      body:
        "If two reviewers rate the same output differently, the rubric needs tightening before its scores mean anything. Patterns that keep surfacing in review often get turned into brand-new automated test cases — human judgment feeding the eval suite for next time.",
      code:
        "if reviewer_a_score != reviewer_b_score:\n    print(\"rubric unclear — reconcile before trusting scores\")\n# confirmed bad case -> becomes a new test_case in the eval suite",
    },
  ],
  realWorldIntro:
    "Teams shipping a customer-facing assistant commonly route a random 2-5% of daily conversations plus every conversation touching refunds or account closure into a review queue, where a human rates tone and judgment on a rubric — separate from, and in addition to, the automated eval suite that already ran on the same prompt.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see why some outputs need a person's judgment call, and how a review queue samples production traffic instead of reading every response.",
    stages: [
      {
        label: "A perfect automated score",
        body:
          "The eval suite runs 40 test cases against the new prompt and every single one passes: correct facts, valid format, no blocked words. On paper, this looks like a clean ship.",
        code: "run_eval(new_prompt, test_cases)\n# result: 40/40 passed",
      },
      {
        label: "The human spot-check disagrees",
        body:
          "A reviewer reads 20 real conversations that used the new prompt and flags several as \"technically correct but rude.\" Nothing in the eval suite was testing for rudeness, so the perfect score never had a chance of catching it.",
        code:
          "# reviewer notes on ticket #4821:\n# \"factually right, but the tone would upset a customer\"",
      },
      {
        label: "The review queue: sampling, not reading everything",
        body:
          "With thousands of conversations a day, reading all of them isn't realistic. A random sample catches issues that appear broadly across ordinary traffic; a mandatory full review on flagged, high-stakes conversations catches issues that would be most costly to miss.",
        code:
          "sample_rate = 0.03  # 3% of ordinary traffic, at random\n# plus: 100% of anything tagged high_risk = True",
      },
      {
        label: "Checking reviewers against each other",
        body:
          "The same conversation gets shown to two reviewers without either seeing the other's rating. If their scores mostly agree, the rubric is doing its job; if they routinely disagree, the criteria are too subjective to trust yet, and that gets fixed first.",
        code:
          "if reviewer_1_rating != reviewer_2_rating:\n    disagreements = disagreements + 1\nprint(f\"agreement rate: {agreed}/{total}\")",
      },
      {
        label: "Feeding findings back into the eval suite",
        body:
          "A tone problem a reviewer catches repeatedly stops being a one-off — it gets written up as a new labeled test case with an expected better answer, so future prompt changes get checked against it automatically, without needing a human to catch it again.",
        code:
          "test_cases.append({\n  \"input\": \"declining a refund politely\",\n  \"expected\": \"acknowledges the request before declining\"\n})",
      },
    ],
  },
  quizQuestion:
    "A team's automated eval suite gives a new prompt a perfect 40/40, but a human reviewer's spot-check finds several replies are technically correct yet come across as rude. What does this reveal?",
  quizCode:
    "run_eval(new_prompt, test_cases)\n# result: 40/40 passed\n# reviewer notes: \"factually right, but rude tone\"",
  quizOptions: [
    {
      key: "a",
      label:
        "A pass rate only measures what the eval's checks actually test for — tone and rudeness weren't part of those checks, so a perfect score says nothing about qualities the eval was never built to catch",
      correct: true,
    },
    {
      key: "b",
      label: "The eval suite must be broken, since a real 40/40 score could never coexist with any quality problem",
      correct: false,
    },
    {
      key: "c",
      label:
        "The human reviewer must be mistaken, since a passing automated score always overrides a subjective human impression",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the eval suite was testing facts and format, never tone, so 40/40 only proves the model got those specific things right; it was never capable of catching rudeness because nothing in it measured for that.",
  quizFeedbackIncorrect:
    "Not quite — the eval isn't broken and the reviewer isn't wrong; the two are measuring different things entirely, and a perfect score on one tells you nothing about a quality the eval was never designed to check.",
  takeaway:
    "A perfect eval score only proves the model passed the specific checks you wrote — tone, judgment, and nuance often aren't in those checks at all, so human review stays necessary for exactly the qualities automated grading can't operationalize, and the patterns humans find are what turn into next quarter's new eval cases.",
};

export default content;
