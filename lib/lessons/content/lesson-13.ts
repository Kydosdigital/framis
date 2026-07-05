import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  phaseLabel: "LLM APIS + TOKENS + COST",
  title: "The Meter That's Always Running: Tokens and Cost",
  minutes: 20,
  concept:
    "Large language models don't read your prompt as words — they break it into small chunks called tokens, and every token you send or receive costs money. You don't need a real tokenizer to get the idea across: a common rule of thumb is that one token is roughly four characters of English text, so you can estimate tokens with a tiny function like len(text) // 4. Once you know roughly how many tokens a request uses, cost is just multiplication — take the token count, divide by 1000, and multiply by whatever price the provider charges per 1000 tokens. Providers almost always price input tokens (what you send) and output tokens (what the model generates) separately, with output usually costing several times more, so a full estimate adds both pieces together. Modeling this as plain functions — text in, tokens out; tokens in, cents out — makes it obvious why a longer prompt or a longer answer directly increases the bill.",
  conceptSimpler:
    "Tokens are like the minutes on a phone plan: the call itself doesn't cost anything until you multiply the number of minutes by the price per minute, and every extra minute — or token — adds straight to the bill.",
  vizStages: [
    {
      label: "1. Characters become tokens",
      body:
        "We can't run a real tokenizer here, but the classic estimate — about 4 characters per token — is close enough to reason about cost. A single function turns any string into an estimated token count.",
      code: "def estimate_tokens(text):\n    return len(text) // 4",
    },
    {
      label: "2. Tokens have a price tag",
      body:
        "Providers charge per 1000 tokens, not per token, so the cost function divides by 1000 before multiplying by the price. Using integer division and prices in cents keeps every result a whole, exact number.",
      code: "def cost_in_cents(tokens, price_per_1000):\n    return tokens * price_per_1000 // 1000",
    },
    {
      label: "3. Run a real prompt through it",
      body:
        "A prompt is just a string. Feed it to estimate_tokens and you get a number you can immediately reason about before ever calling a real API.",
      code:
        "prompt = \"Summarize this support ticket in two sentences.\"\ntokens = estimate_tokens(prompt)\nprint(tokens)",
    },
    {
      label: "4. Same tokens, different price",
      body:
        "The token count doesn't change based on which model you call — only the price per 1000 tokens does. That's why picking a cheaper model can cut your bill without changing the prompt at all.",
      code: "cheap = cost_in_cents(tokens, 2)\npremium = cost_in_cents(tokens, 30)\nprint(cheap, premium)",
    },
  ],
  realWorldIntro:
    "Every real LLM API — OpenAI, Anthropic, and others — bills using exactly this input-tokens-times-price-plus-output-tokens-times-price formula, and output tokens are almost always priced several times higher than input tokens because generating text costs more than reading it.",
  realWorldCode:
    "def total_cost_cents(input_tokens, output_tokens, input_price, output_price):\n    input_cost = input_tokens * input_price // 1000\n    output_cost = output_tokens * output_price // 1000\n    return input_cost + output_cost",
  sandbox: {
    kind: "code",
    challenge:
      "Estimate input and output tokens for a prompt/reply pair, then print the total cost in cents under both a budget model price and a premium model price.",
    starterCode:
      "def estimate_tokens(text):\n    return len(text) // 4\n\ndef cost_in_cents(tokens, price_per_1000):\n    return tokens * price_per_1000 // 1000\n\nprompt = \"Write a short product description for a wireless keyboard with a long battery life.\"\nreply = \"The wireless keyboard delivers a full year of battery life, reliable Bluetooth pairing, and a compact design that fits any desk.\"\n\ninput_tokens = estimate_tokens(prompt)\noutput_tokens = estimate_tokens(reply)\ntotal_tokens = input_tokens + output_tokens\n\nprint(\"input tokens:\", input_tokens)\nprint(\"output tokens:\", output_tokens)\n\nbudget_price = 2\npremium_price = 30\n\nbudget_cost = cost_in_cents(total_tokens, budget_price)\npremium_cost = cost_in_cents(total_tokens, premium_price)\n\nprint(\"budget model cost (cents):\", budget_cost)\nprint(\"premium model cost (cents):\", premium_cost)\n\nif premium_cost > budget_cost * 5:\n    print(\"premium model costs more than 5x the budget model here\")\nelse:\n    print(\"premium model is not that much pricier here\")",
  },
  quizQuestion:
    "cost_in_cents(999, 5) returns 4, not 4.995. Why?",
  quizCode:
    "def cost_in_cents(tokens, price_per_1000):\n    return tokens * price_per_1000 // 1000\n\nresult = cost_in_cents(999, 5)\nprint(result)",
  quizOptions: [
    {
      key: "a",
      label: "Because // is floor division, so it drops the fractional part of the result",
      correct: true,
    },
    {
      key: "b",
      label: "Because 999 tokens automatically rounds up to 1000 before the math runs",
      correct: false,
    },
    {
      key: "c",
      label: "Because price_per_1000 must always be a whole number of cents",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — // is floor division, so 999 * 5 = 4995, and 4995 // 1000 floors to 4, throwing away the .995 remainder instead of rounding it.",
  quizFeedbackIncorrect:
    "Not quite — nothing rounds the token count itself; 999 * 5 = 4995, and // floors that to 4, discarding the .995 fraction rather than rounding it or requiring whole-cent prices.",
  takeaway:
    "Token counting and cost are just arithmetic: estimate tokens from character count, then multiply by a price-per-1000 rate for both input and output — do that, and you can predict an API bill before you ever make the call.",
  nextUpLabel: "Embeddings + RAG + Vector Search",
};

export default content;
