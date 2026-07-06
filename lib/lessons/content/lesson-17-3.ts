import type { LessonData } from "../types";

const content: LessonData = {
  num: 17,
  orderIndex: 3,
  phaseLabel: "LLM APIS + TOKENS + COST",
  title: "The Randomness Dial: Temperature and Sampling",
  minutes: 16,
  concept:
    "A model doesn't generate the \"one correct\" next word — for every position in its reply, it computes a probability for every possible next token, and then has to pick one. Temperature controls how that pick is made. At temperature 0, the model always takes the single highest-probability token, which makes its output deterministic: the same prompt tends to produce the same reply every time you run it. Raise the temperature and the probabilities get flattened out, so lower-ranked tokens get a real chance of being chosen too — the model starts \"sampling\" instead of always taking the top pick, which is why the exact same prompt can come back worded differently on two separate calls. Push temperature high enough and that variety tips into incoherence, since the model is now willing to pick tokens it originally rated as unlikely. There's no single right setting — it's a knob you choose based on whether you want a reliable, repeatable answer or a wider spread of possible ones.",
  conceptSimpler:
    "Temperature is like asking someone to pick a restaurant: at temperature 0 they always name their usual favorite, and as you turn the dial up they get more willing to suggest something further down their list, even a weird pick they'd normally never choose.",
  vizStages: [
    {
      label: "1. Every next word is a ranked list, not a single answer",
      body:
        "Before picking anything, the model scores every possible next token. Imagine three candidate words for finishing a coffee shop tagline, each with a probability.",
      code: "{\"Great\": 0.62, \"Bold\": 0.24, \"Weird\": 0.02}",
    },
    {
      label: "2. Temperature reshapes those odds",
      body:
        "Temperature doesn't change the ranking — Great is still the top pick either way — it changes how sharply the model favors the top pick versus giving the others a real shot.",
      code: "temperature 0.2 -> {\"Great\": 0.91, \"Bold\": 0.08, \"Weird\": 0.01}\ntemperature 1.2 -> {\"Great\": 0.40, \"Bold\": 0.35, \"Weird\": 0.25}",
    },
    {
      label: "3. Temperature 0: always the top pick",
      body:
        "At temperature 0 the model always takes the single most likely token, position after position — no sampling at all. That's why the same prompt gives the same reply run after run.",
      code: "run 1: \"Wake Up To Great Coffee.\"\nrun 2: \"Wake Up To Great Coffee.\"\nrun 3: \"Wake Up To Great Coffee.\"",
    },
    {
      label: "4. Higher temperature: real variety, real risk",
      body:
        "At higher temperature, lower-ranked tokens sometimes win, so the wording changes between runs — and past a point, the model starts picking tokens it originally rated as unlikely for a reason.",
      code: "run 1: \"Great Coffee, Bold Mornings.\"\nrun 2: \"Coffee So Good It's Basically A Personality.\"\nrun 3: \"Bean There, Brewed That, Weird But True.\"",
    },
  ],
  realWorldIntro:
    "Every major LLM API exposes a temperature parameter (often 0 to 2) right alongside the prompt, and production teams routinely set it to 0 for tasks like data extraction or classification, while turning it up for brainstorming or creative copywriting.",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each temperature setting to see how the exact same prompt produces different completions.",
    stages: [
      {
        label: "Temperature 0 — deterministic",
        body:
          "The model always takes the highest-probability token, so calling the API three times with the identical prompt produces the identical tagline every time. This is what you want when repeatability matters more than variety.",
        code:
          "prompt: \"Write a one-line tagline for a coffee shop.\"\ntemperature: 0\n\nrun 1: \"Wake Up To Great Coffee.\"\nrun 2: \"Wake Up To Great Coffee.\"\nrun 3: \"Wake Up To Great Coffee.\"",
      },
      {
        label: "Temperature 0.3 — mostly stable",
        body:
          "A little randomness creeps in — small wording differences appear, but the core idea barely moves. Good middle ground for things like rephrasing customer emails, where you want natural variation but not surprises.",
        code:
          "temperature: 0.3\n\nrun 1: \"Wake Up To Great Coffee.\"\nrun 2: \"Start Your Day With Great Coffee.\"\nrun 3: \"Wake Up To Really Great Coffee.\"",
      },
      {
        label: "Temperature 0.7 — noticeably different phrasing",
        body:
          "Now the model is genuinely sampling — each run picks a meaningfully different path through the possible wordings, even though every result still reads as a plausible tagline.",
        code:
          "temperature: 0.7\n\nrun 1: \"Great Coffee, Bold Mornings.\"\nrun 2: \"Your New Favorite Reason To Get Up.\"\nrun 3: \"Small Shop, Big Coffee Energy.\"",
      },
      {
        label: "Temperature 1.2 — high variance, occasional nonsense",
        body:
          "At this setting the model is willing to pick tokens it originally rated as unlikely. Output is more surprising and creative, but also more likely to drift off-topic or stop making sense.",
        code:
          "temperature: 1.2\n\nrun 1: \"Coffee So Good It's Basically A Personality.\"\nrun 2: \"Bean There, Brewed That, Weird But True.\"\nrun 3: \"Espresso Yourself Into The Sunset Forever.\"",
      },
      {
        label: "Choosing temperature for the task",
        body:
          "Structured, factual, or repeatable work — extracting fields, writing code, classifying a ticket — belongs near temperature 0. Open-ended writing where variety is the point — taglines, brainstorming, naming — benefits from 0.7 or higher.",
        code:
          "extract order ID from an email -> temperature 0\nbrainstorm 5 product names -> temperature 0.8",
      },
    ],
  },
  quizQuestion:
    "You're building a feature that extracts a JSON object of fields from user-submitted text, and the same input must always produce the same structured output. What temperature should you use, and why?",
  quizOptions: [
    {
      key: "a",
      label:
        "Temperature 0 — it always selects the single highest-probability token at every step, making the output deterministic and repeatable",
      correct: true,
    },
    {
      key: "b",
      label: "Temperature 1.5 — a higher temperature makes the model more confident, which produces more consistent answers",
      correct: false,
    },
    {
      key: "c",
      label: "Temperature doesn't affect determinism at all — it only controls how long the response is",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — temperature 0 removes sampling entirely, so the model always takes the top-ranked token at each step; the same input reliably produces the same output, which is exactly what a structured extraction task needs.",
  quizFeedbackIncorrect:
    "Not quite — higher temperature increases randomness, not confidence, which makes output less repeatable, and temperature affects word choice at every step, not response length; temperature 0 is what gives you deterministic, repeatable output.",
  takeaway:
    "Temperature controls how much randomness gets mixed into token selection: 0 always takes the top-ranked token for repeatable output, and higher values let the model sample further down the list for variety — pick the setting based on whether the task needs consistency or creativity.",
};

export default content;
