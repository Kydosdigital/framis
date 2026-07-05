import type { LessonData } from "../types";

const content: LessonData = {
  num: 27,
  orderIndex: 1,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "The Two-Line Function Standing Between You and a Surprise Bill",
  minutes: 20,
  concept:
    "Every request your AI feature makes to a model API can be logged as one dict: something like {\"latency_ms\": 340, \"cost\": 0.004}, capturing how long the call took and what it cost. On its own, one log entry tells you almost nothing — a single slow request could just be a fluke. What matters is aggregating the whole list: loop over every request, add up the cost field into a running total, add up the latency field into a running total, and divide that latency total by the number of requests to get an average. Those two numbers — total cost and average latency — are the two questions every AI product eventually has to answer: \"are we burning too much money\" and \"are users waiting too long.\" They're deliberately kept separate rather than combined into one score, because they move independently — a prompt change can slow every response down without touching cost, and a traffic spike can multiply your bill without any single request getting slower.",
  conceptSimpler:
    "It's like a taxi dispatcher who logs every trip's fare and duration, then at the end of the day adds up total fuel spend separately from average trip time — one number tells you if you're profitable, the other tells you if riders are having a bad experience, and neither one substitutes for the other.",
  vizStages: [
    {
      label: "1. Each request is one log entry",
      body:
        "A production AI feature logs one dict per model call. Nothing here is aggregated yet — it's just the raw material.",
      code:
        "requests = [\n  {\"latency_ms\": 120, \"cost\": 0.002},\n  {\"latency_ms\": 340, \"cost\": 0.004},\n  {\"latency_ms\": 610, \"cost\": 0.006}\n]",
    },
    {
      label: "2. Loop and accumulate",
      body:
        "A for loop walks the list once, adding each request's cost into total_cost and each request's latency into total_latency as it goes.",
      code:
        "total_cost = 0\ntotal_latency = 0\ncount = 0\nfor req in requests:\n    total_cost = total_cost + req[\"cost\"]\n    total_latency = total_latency + req[\"latency_ms\"]\n    count = count + 1",
    },
    {
      label: "3. Divide once, at the end",
      body:
        "Total cost is already the number you want — money spent is money spent, so it's never divided. Latency is different: total_latency only becomes meaningful once you divide by count, turning \"sum of every wait time\" into \"typical wait time.\"",
      code:
        "avg_latency = total_latency / count\nprint(\"total cost:\", total_cost)\nprint(\"avg latency ms:\", avg_latency)",
    },
    {
      label: "4. The two numbers tell different stories",
      body:
        "Total cost flat but avg latency climbing means the model (or a slow downstream call) got slower without costing more — a UX problem. Avg latency flat but total cost climbing means traffic (or per-call cost) went up without anyone waiting longer — a budget problem. Tracking only one hides the other.",
      code:
        "day1: total_cost=4.10  avg_latency=280ms\nday2: total_cost=4.05  avg_latency=790ms   <- latency regression, cost looks fine",
    },
  ],
  realWorldIntro:
    "This is exactly what the top tiles of an LLM observability dashboard (Datadog, Grafana, LangSmith, or a homegrown one) are computing every few minutes behind the scenes — pulling the latest window of request logs and running the same sum-and-divide over them to render \"avg latency: 340ms\" and \"spend today: $12.40\" as two separate numbers, not one blended score.",
  realWorldCode:
    "def analyze_requests(requests):\n    total_cost = 0\n    total_latency = 0\n    count = 0\n    for req in requests:\n        total_cost = total_cost + req[\"cost\"]\n        total_latency = total_latency + req[\"latency_ms\"]\n        count = count + 1\n    avg_latency = total_latency / count\n    return [total_cost, avg_latency]",
  sandbox: {
    kind: "code",
    challenge:
      "Run analyze_requests over the sample logs, then read off which alert fires and notice that the other metric stays healthy at the same time.",
    starterCode:
      "def analyze_requests(requests):\n    total_cost = 0\n    total_latency = 0\n    count = 0\n    for req in requests:\n        total_cost = total_cost + req[\"cost\"]\n        total_latency = total_latency + req[\"latency_ms\"]\n        count = count + 1\n    avg_latency = total_latency / count\n    return [total_cost, avg_latency]\n\nrequests = [{\"latency_ms\": 120, \"cost\": 0.002}, {\"latency_ms\": 340, \"cost\": 0.004}, {\"latency_ms\": 95, \"cost\": 0.0015}, {\"latency_ms\": 610, \"cost\": 0.006}, {\"latency_ms\": 900, \"cost\": 0.006}]\n\nstats = analyze_requests(requests)\ntotal_cost = stats[0]\navg_latency = stats[1]\n\nprint(\"total cost:\", total_cost)\nprint(\"avg latency ms:\", avg_latency)\n\nif avg_latency > 300:\n    print(\"ALERT: average latency is above 300ms\")\nelse:\n    print(\"latency looks healthy\")\n\nif total_cost > 0.05:\n    print(\"ALERT: total cost is above budget\")\nelse:\n    print(\"cost looks healthy\")",
  },
  quizQuestion:
    "A dashboard only tracks total_cost per day, and it's been flat and unremarkable for a week. Based on the function below, what could still be quietly going wrong that this single metric would never catch?",
  quizCode:
    "def analyze_requests(requests):\n    total_cost = 0\n    for req in requests:\n        total_cost = total_cost + req[\"cost\"]\n    return total_cost\n\nrequests = [{\"latency_ms\": 120, \"cost\": 0.01}, {\"latency_ms\": 890, \"cost\": 0.01}, {\"latency_ms\": 910, \"cost\": 0.01}]\nprint(\"total cost:\", analyze_requests(requests))",
  quizOptions: [
    {
      key: "a",
      label:
        "Requests could be getting much slower (rising latency) while cost per request stays exactly the same, and nothing here would show it",
      correct: true,
    },
    {
      key: "b",
      label: "Nothing — if total cost is flat and normal, every other aspect of the requests must also be fine",
      correct: false,
    },
    {
      key: "c",
      label: "Total cost would automatically rise on its own if latency rose, so tracking cost alone always catches both problems",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — cost and latency are computed from completely separate fields and move independently, so a function that only sums cost (like this one) can look perfectly calm while avg latency quietly triples in the background.",
  quizFeedbackIncorrect:
    "Not quite — cost and latency don't move together automatically; they're separate fields summed separately, which is exactly why a slow-but-not-more-expensive regression can hide behind a flat cost number.",
  takeaway:
    "Sum cost, sum-then-divide latency, and keep the two numbers separate — total cost tells you if you're overspending, average latency tells you if users are waiting too long, and a system that only watches one of them will miss regressions in the other.",
  nextUpLabel: "AI Product Design + Edge Cases",
};

export default content;
