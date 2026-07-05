import type { LessonData } from "../types";

const content: LessonData = {
  num: 20,
  orderIndex: 2,
  phaseLabel: "FINE-TUNING + DATASET QUALITY",
  title: "Don't fine-tune a problem a better prompt can fix in an afternoon",
  minutes: 18,
  concept:
    "Fine-tuning changes the model's weights, which means it can fix problems no prompt ever could — it's the only lever for teaching a genuinely new output format the model resists, a domain-specific style it can't be talked into, or a task where you need lower latency by baking instructions into the weights instead of sending them every request. But fine-tuning costs real time and money: you need a curated dataset, a training run, an eval pass, and a redeploy every time the task definition changes even slightly. Most of what feels like \"the model isn't doing what I want\" is actually a prompt problem — vague instructions, missing examples, no clear output schema — and those are fixed in minutes by rewriting the prompt, not weeks by retraining. The rule of thumb: reach for better prompting, few-shot examples, and retrieval first, and only fine-tune once you've proven the model can already do the task when given a great prompt, but does it inconsistently or too slowly to use at scale. Fine-tuning on a badly-defined task doesn't clarify the task — it just bakes the confusion in more permanently.",
  conceptSimpler:
    "It's the difference between giving someone clearer instructions versus sending them back to school — school works for a real skill gap, but most performance problems are just unclear instructions, and no amount of schooling fixes those faster than just being clearer.",
  vizStages: [
    {
      label: "1. The cheap fix first",
      body:
        "A support-ticket classifier keeps mislabeling billing tickets as bugs. Before touching training data, the team rewrites the prompt to include the exact category definitions and three labeled examples.",
      code: "prompt = \"Classify as billing, bug, or question.\\n\" +\n  \"billing = anything about charges, refunds, or payment methods.\\n\" +\n  \"Example: 'charged twice' -> billing\\n\" +\n  \"Example: 'app crashes on open' -> bug\"",
    },
    {
      label: "2. When the cheap fix is enough",
      body:
        "Accuracy jumps from 71% to 95% just from clearer instructions and examples. There's no fine-tuning problem here — there was a prompt-clarity problem, and it's solved.",
      code: "// before: accuracy 71%\n// after adding definitions + examples: accuracy 95%\n// no training run needed",
    },
    {
      label: "3. When prompting hits a real wall",
      body:
        "A different team needs the model to output a rigid internal JSON schema with 40 fields, every time, with zero drift, at high volume and low latency. Even a great prompt gets the format right 90% of the time and occasionally adds a stray field or explanatory sentence.",
      code: "// best prompt achievable: 90% schema-valid, and slower\n// per-request cost of re-sending 40-field instructions every call: high",
    },
    {
      label: "4. That's the fine-tuning case",
      body:
        "This is a good fine-tuning candidate: the task is precisely defined, the failure is consistency and cost rather than confusion, and a curated set of correct examples can teach the exact format so it doesn't need to be re-explained every request.",
      code: "// fine-tuned on 300 correctly-formatted examples:\n// schema-valid: 99.6%, no instructions needed in the prompt at all",
    },
  ],
  realWorldIntro:
    "Teams that skip straight to fine-tuning often discover, after a training run, that the same gain was available from adding two few-shot examples to the prompt — which is why most fine-tuning guides insist on a documented prompt-engineering attempt first.",
  realWorldCode:
    "// before opening a training job, answer:\n// 1. does the best possible prompt already do this task correctly?\n// 2. if yes, is the only problem consistency, cost, or latency at scale?\n// only fine-tune if both checks point that way",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each scenario and decide whether it calls for a better prompt or an actual fine-tune before reading the verdict.",
    stages: [
      {
        label: "Scenario 1: the model ignores a rule you never wrote down",
        body:
          "A team wants replies under 50 words but never puts a word limit in the prompt, then plans a fine-tuning run to \"teach brevity.\" Verdict: prompt fix. Just add the constraint — the model was never told the rule it's being blamed for breaking.",
        code: "prompt = \"Reply to the customer.\"\n// missing: \"Keep the reply under 50 words.\"",
      },
      {
        label: "Scenario 2: the task needs a house style no instruction captures",
        body:
          "A legal team needs contract summaries written in their firm's exact phrasing conventions, built up over decades, that can't be reduced to a short rule list. Verdict: fine-tune candidate. This is a style-transfer problem where examples teach something instructions can't compactly describe.",
        code: "// hundreds of firm-authored summary pairs:\n// { contract_excerpt: ..., firm_style_summary: ... }",
      },
      {
        label: "Scenario 3: it works, but costs too much per call",
        body:
          "A prompt that works needs 1,200 tokens of instructions and examples resent on every single request, at huge volume. Verdict: fine-tune candidate, but for a cost reason, not a capability reason — bake the always-repeated instructions into the weights and cut the per-request prompt to almost nothing.",
        code: "// current: 1,200-token instruction prompt x 2M requests/month\n// fine-tuned: near-empty prompt, same behavior baked into the model",
      },
      {
        label: "Scenario 4: the examples in the prompt are just wrong",
        body:
          "A classifier prompt includes three few-shot examples, and one of them is mislabeled. The team is about to build a 5,000-row training set because \"the model still gets confused.\" Verdict: prompt fix. Fix the one wrong example first — fine-tuning on a dataset built to compensate for a prompt bug just launders the same bug into the weights.",
        code: "// few-shot example 3 (wrong):\n// { input: \"double charged\", label: \"bug\" }  // should be \"billing\"",
      },
      {
        label: "Scenario 5: it's inconsistent despite a genuinely good prompt",
        body:
          "The prompt is clear, well-tested, and includes solid examples, but the model still flips its answer on the same input across runs at a rate that hurts production reliability. Verdict: fine-tune candidate. When prompting is already good and the remaining gap is stability rather than confusion, training on curated examples locks in the behavior instructions alone can't guarantee.",
        code: "// same input, 5 runs with the best prompt found:\n// billing, billing, bug, billing, billing  <- 20% flip rate",
      },
    ],
  },
  quizQuestion:
    "A team's model mislabels tickets containing the word 'refund' as 'bug' about 30% of the time. They haven't yet added any examples or category definitions to their prompt. What should they try first?",
  quizOptions: [
    {
      key: "a",
      label: "Start collecting and labeling a training set for a fine-tune, since 30% is a large error rate",
      correct: false,
    },
    {
      key: "b",
      label: "Add clear category definitions and a few labeled examples to the prompt, then re-measure the error rate",
      correct: true,
    },
    {
      key: "c",
      label: "Switch to a larger base model, since bigger models make fewer classification errors",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a 30% error rate with no definitions or examples in the prompt is a strong sign the task was never clearly specified, and clarifying it costs minutes; fine-tuning should wait until a well-specified prompt still can't hit the needed accuracy or consistency.",
  quizFeedbackIncorrect:
    "Not quite — before spending days on a training set or swapping models, the prompt hasn't even been given category definitions or examples yet, and that cheap fix routinely closes gaps this size on its own.",
  takeaway:
    "Fine-tuning is for a well-defined task the model already does correctly with a great prompt but not consistently, quickly, or cheaply enough — not a shortcut around the harder work of writing a clear prompt in the first place.",
};

export default content;
