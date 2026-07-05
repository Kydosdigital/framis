import type { LessonData } from "../types";

const content: LessonData = {
  num: 17,
  orderIndex: 3,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "10% vs. 20%: is that a real lift, or just luck?",
  minutes: 20,
  concept:
    "An A/B test splits people randomly into two groups — a control that sees the current version and a variant that sees the new one — then compares a metric like conversion rate between them. The catch is that even if the two versions were truly, identically effective, two random groups will almost never produce the exact same rate; some group will always come out a little ahead purely by chance, the same way flipping a fair coin 20 times doesn't always land exactly 10 heads. This means an observed gap between control and variant can't be judged by its size alone — a 3-point lift on 40 users and a 3-point lift on 40,000 users are not remotely the same kind of evidence, even though the raw numbers look identical. The sample size sets how much random noise you should expect: small samples swing wildly on their own, so a gap has to be large to stand out from that noise, while large samples settle down, so even a modest, consistent gap becomes meaningful. Reading an A/B test well means asking not just \"which bar is taller?\" but \"is this gap bigger than random chance alone would typically produce at this sample size?\"",
  conceptSimpler:
    "It's like flipping two coins 10 times each and getting 6 heads versus 4 heads — nobody would call one coin \"better\"; but 6,000 heads versus 4,000 heads out of 10,000 flips each is an entirely different, much more convincing story.",
  vizStages: [
    {
      label: "1. A button color test, 100 users per group",
      body:
        "Control (blue button): 100 users, 12 conversions. Variant (green button): 100 users, 15 conversions. The variant looks 3 points better — but is that a real effect, or the kind of wobble you'd expect from any two random groups of 100?",
      code:
        "control = { \"users\": 100, \"conversions\": 12 }\nvariant = { \"users\": 100, \"conversions\": 15 }\n# 12% vs 15%",
    },
    {
      label: "2. Identical coins can still land differently",
      body:
        "Imagine control and variant were secretly running the exact same button. Splitting 100 people into two random groups would still rarely produce identical conversion counts — some noise is baked into random sampling no matter what.",
      code:
        "# same true rate, two random samples of 100:\n# sample 1: 11 conversions\n# sample 2: 14 conversions\n# the gap alone doesn't prove a real difference",
    },
    {
      label: "3. The same 3-point gap, but with 10,000 users each",
      body:
        "Control: 10,000 users, 1,200 conversions (12%). Variant: 10,000 users, 1,500 conversions (15%). The percentage gap is identical to stage 1, but now it's anchored by 100x the data — random noise this large, this consistently, is far less likely.",
      code:
        "control = { \"users\": 10000, \"conversions\": 1200 }\nvariant = { \"users\": 10000, \"conversions\": 1500 }\n# 12% vs 15%, same gap as before",
    },
    {
      label: "4. Same gap, opposite conclusions",
      body:
        "A 3-point lift on 100 users per group is easy to get from noise alone. That same 3-point lift on 10,000 users per group is very hard to get from noise alone. The lesson: judge a gap relative to its sample size, never in isolation.",
      code:
        "# 100 users/group: 3-point gap -> weak evidence\n# 10,000 users/group: 3-point gap -> strong evidence",
    },
  ],
  realWorldIntro:
    "This exact judgment call happens every time a team ships a new checkout flow, a new prompt template, or a new ranking model: they split traffic randomly between old and new, watch a metric move, and have to decide — often under pressure to ship fast — whether that movement is a genuine win or a statistical mirage that will vanish on the next batch of users.",
  realWorldCode:
    'control_conversions = 60\ncontrol_users = 500\nvariant_conversions = 75\nvariant_users = 500\n\ncontrol_rate = control_conversions * 100 / control_users\nvariant_rate = variant_conversions * 100 / variant_users\n\nprint(f"control: {control_rate}%")\nprint(f"variant: {variant_rate}%")',
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each scenario and judge whether the observed gap between control and variant looks like a real effect or like ordinary sampling noise.",
    stages: [
      {
        label: "Scenario 1: tiny sample, big-looking gap",
        body:
          "Control: 20 users, 2 conversions (10%). Variant: 20 users, 4 conversions (20%). Variant looks twice as good — but with only 20 users per group, a single extra conversion swings the rate by 5 whole points. Two conversions vs. four is barely any data at all; this gap could easily flip on the next 20 users.",
        code:
          "control = { \"users\": 20, \"conversions\": 2 }\nvariant = { \"users\": 20, \"conversions\": 4 }\n# looks real, is almost certainly noise",
      },
      {
        label: "Scenario 2: the same gap, backed by thousands of users",
        body:
          "Control: 5,000 users, 500 conversions (10%). Variant: 5,000 users, 1,000 conversions (20%). Same 10-point gap as Scenario 1, but now each group is 250x bigger. A gap this large, holding steady across thousands of users each, is very unlikely to be chance — this reads as a genuinely stronger variant.",
        code:
          "control = { \"users\": 5000, \"conversions\": 500 }\nvariant = { \"users\": 5000, \"conversions\": 1000 }\n# looks real, and actually is real",
      },
      {
        label: "Scenario 3: huge sample, razor-thin gap",
        body:
          "Control: 50,000 users, 5,000 conversions (10.0%). Variant: 50,000 users, 5,050 conversions (10.1%). The sample is enormous, but the gap is tiny. This is the genuinely hard case — you can't eyeball it either way; you'd need a formal significance calculation to know if even this small a gap, at this scale, is more than noise.",
        code:
          "control = { \"users\": 50000, \"conversions\": 5000 }\nvariant = { \"users\": 50000, \"conversions\": 5050 }\n# too close to call by eye - needs a real significance test",
      },
      {
        label: "Scenario 4: small sample, no visible gap at all",
        body:
          "Control: 30 users, 3 conversions (10%). Variant: 30 users, 3 conversions (10%) — identical results. It's tempting to call this \"proven no difference,\" but 30 users per group is too small a sample to detect anything short of a giant effect. Absence of a gap here isn't proof of no effect — it's simply not enough data yet.",
        code:
          "control = { \"users\": 30, \"conversions\": 3 }\nvariant = { \"users\": 30, \"conversions\": 3 }\n# no visible gap, but the sample is too small to conclude much either way",
      },
      {
        label: "Scenario 5: the actual playbook",
        body:
          "Responsible teams decide the required sample size before looking at results, let the test run until each group hits that size, and only trust the outcome once the gap holds up at that scale (usually backed by a formal significance test). Peeking early and shipping on a 20-user sample is how \"wins\" quietly disappear a week later.",
        code:
          "# decide sample size in advance\n# run the test to completion\n# only then compare rates and decide",
      },
    ],
  },
  quizQuestion:
    "Control converts at 10% out of 30 users. Variant converts at 20% out of 30 users. What's the most responsible conclusion?",
  quizCode:
    "control = { \"users\": 30, \"conversions\": 3 }\nvariant = { \"users\": 30, \"conversions\": 6 }",
  quizOptions: [
    {
      key: "a",
      label:
        "The sample is too small to trust a 10-point gap — the test should keep running until each group has a much larger sample before deciding anything",
      correct: true,
    },
    {
      key: "b",
      label:
        "Since variant converted at double the rate of control, variant should be shipped as the winner immediately",
      correct: false,
    },
    {
      key: "c",
      label:
        "A 10-point percentage gap is never meaningful, no matter how large the sample size eventually gets",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — with only 30 users per group, a difference of just two or three conversions swings the rate by roughly 10 points purely by chance, so this gap needs a much larger sample (and ideally a formal significance check) before it can be trusted.",
  quizFeedbackIncorrect:
    "Not quite — with only 30 users per group, one or two extra conversions can swing the rate by 10 points on pure chance alone; the size of a percentage gap only becomes trustworthy once it's backed by a large enough sample.",
  takeaway:
    "The same size gap can be meaningless noise at a small sample size or a highly reliable signal at a large one. Never judge an A/B test by which bar looks taller — judge it by whether the gap is bigger than random sampling alone would typically produce at that sample size.",
};

export default content;
