import type { LessonData } from "../types";

const content: LessonData = {
  num: 27,
  orderIndex: 5,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "The 5% of Requests Your Average Never Mentions",
  minutes: 22,
  concept:
    "None of the aggregation earlier in this module works without one habit: logging every request as a structured event — a dict with named fields like {\"timestamp\": ..., \"user_id\": ..., \"latency_ms\": ..., \"cost\": ..., \"status\": ...} — instead of a free-text sentence like \"request took 610ms for user 42.\" A dict lets any future computation reach in and read req[\"latency_ms\"] directly; a log sentence has to be re-parsed by hand every time, and a small wording change silently breaks that parsing. Once your logs are structured, you can compute more than an average — and you need to, because average latency is specifically bad at describing the edges of your data. Averaging dilutes outliers: a system that spends 9ms on 999 requests and 9 seconds on one unlucky request reports an average that looks perfectly calm, because dividing that one huge number by 1000 flattens it into the noise. A percentile asks a different question than \"what's typical\": p95 is the value below which 95% of your observations fall — equivalently, it's the value the worst 5% of requests are at or above. To compute it you can't just do arithmetic on the raw list the way you sum for a total; you first have to sort the values from smallest to largest, then walk to the position that percentage of the way into that sorted list. Since sorting isn't handed to you for free here, you write one yourself with a classic bubble sort — repeatedly stepping through the list and swapping any adjacent pair that's out of order, one pass at a time, until nothing is left to swap — and then compute the index to read by multiplying the sorted list's length by 0.95 (or 0.99 for the more extreme p99) and truncating to a whole number.",
  conceptSimpler:
    "It's like grading a class using only the average score: a 78% average sounds fine and hides the fact that one real student flunked outright. A percentile is the teacher actually sorting every score from lowest to highest and looking at where the bottom slice of students land — a completely different, more honest question than \"what's the mean.\"",
  vizStages: [
    {
      label: "1. Structured logs are what make any of this possible",
      body:
        "A dict logged per request — with the same field names every time — is what lets code reach in and grab exactly the value it needs, whether that's computing an average, a percentile, or (coming up next) a per-user cost total. A free-text log line can't be aggregated without re-parsing it first.",
      code:
        "log_entry = {\"timestamp\": \"2026-07-05T14:02:11\", \"user_id\": \"u1\", \"latency_ms\": 610, \"cost\": 0.006, \"status\": \"ok\"}",
    },
    {
      label: "2. An average can look calm while one request cooks",
      body:
        "Nine requests come back in 100ms and one comes back in 3000ms. The average — 390ms — sounds mediocre, not alarming. But that's not what any single user experienced: 9 of them waited 100ms, and 1 of them waited 3000ms. The average describes neither.",
      code:
        "latencies = [100, 100, 100, 100, 100, 100, 100, 100, 100, 3000]\n# avg_latency = 390ms -- describes nobody's actual wait",
    },
    {
      label: "3. What p95 actually means",
      body:
        "p95 is the value below which 95% of your observations fall. Flip that around: it's the value the worst 5% of requests are at or above. It answers \"how bad is the tail,\" which is a different question than the average's \"what's typical\" — and it's the question that maps to how many real users are having a bad time.",
      code: "p95 of 100 requests = the value the worst 5 of them are at or above",
    },
    {
      label: "4. Sort first — there's no built-in sort here, so bubble sort",
      body:
        "Bubble sort repeatedly walks the list comparing each pair of neighbors, swapping them if they're out of order, so the largest unsorted value \"bubbles\" to the end of the list on each pass. Doing this once for every position guarantees the whole list ends up sorted.",
      code:
        "def bubble_sort(values):\n    n = len(values)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if values[j] > values[j + 1]:\n                temp = values[j]\n                values[j] = values[j + 1]\n                values[j + 1] = temp\n    return values",
    },
    {
      label: "5. Index into the sorted list at the percentile position",
      body:
        "Multiply the sorted list's length by 0.95, truncate to a whole number with int(), and that's the index to read. Reuse the exact same function with 0.99 instead of 0.95 to get p99 — it just points further into the tail, and needs more samples than p95 does before the two numbers actually diverge.",
      code:
        "def percentile(values, p):\n    sorted_values = bubble_sort(values)\n    index = int(len(sorted_values) * p)\n    if index >= len(sorted_values):\n        index = len(sorted_values) - 1\n    return sorted_values[index]",
    },
  ],
  realWorldIntro:
    "This is exactly what \"p95 latency\" and \"p99 latency\" mean on a Datadog or Grafana dashboard, and why they sit right next to (not instead of) the average — real SLAs are almost always written in terms of a percentile (\"p95 under 500ms\") precisely because a fast average can coexist with a painful tail.",
  realWorldCode:
    "def bubble_sort(values):\n    n = len(values)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if values[j] > values[j + 1]:\n                temp = values[j]\n                values[j] = values[j + 1]\n                values[j + 1] = temp\n    return values\n\ndef percentile(values, p):\n    sorted_values = bubble_sort(values)\n    index = int(len(sorted_values) * p)\n    if index >= len(sorted_values):\n        index = len(sorted_values) - 1\n    return sorted_values[index]",
  sandbox: {
    kind: "code",
    challenge:
      "Build a day of 100 latencies (95 ordinary ones plus 5 real outliers), compute the average, then compute p95 and p99 with your own bubble sort and percentile functions, and see how far the tail strays from the average.",
    starterCode:
      "def bubble_sort(values):\n    n = len(values)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if values[j] > values[j + 1]:\n                temp = values[j]\n                values[j] = values[j + 1]\n                values[j + 1] = temp\n    return values\n\ndef percentile(values, p):\n    sorted_values = bubble_sort(values)\n    index = int(len(sorted_values) * p)\n    if index >= len(sorted_values):\n        index = len(sorted_values) - 1\n    return sorted_values[index]\n\nlatencies = []\nfor i in range(95):\n    latencies.append(150 + i % 50)\nfor i in range(5):\n    latencies.append(1200 + i * 200)\n\ntotal_latency = 0\ncount = 0\nfor latency in latencies:\n    total_latency = total_latency + latency\n    count = count + 1\navg_latency = total_latency / count\n\np95 = percentile(latencies, 0.95)\np99 = percentile(latencies, 0.99)\n\nprint(\"count:\", count)\nprint(\"avg latency ms:\", avg_latency)\nprint(\"p95 latency ms:\", p95)\nprint(\"p99 latency ms:\", p99)\n\nif p95 > avg_latency * 3:\n    print(\"ALERT: p95 is more than 3x the average -- a real slice of users is having a much worse time than the average admits\")\nelse:\n    print(\"p95 is in line with the average\")",
  },
  quizQuestion:
    "Given the percentile function above, what does percentile([300, 80, 950, 100, 200, 90, 210, 110], 0.95) return, and why?",
  quizCode:
    "def bubble_sort(values):\n    n = len(values)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if values[j] > values[j + 1]:\n                temp = values[j]\n                values[j] = values[j + 1]\n                values[j + 1] = temp\n    return values\n\ndef percentile(values, p):\n    sorted_values = bubble_sort(values)\n    index = int(len(sorted_values) * p)\n    if index >= len(sorted_values):\n        index = len(sorted_values) - 1\n    return sorted_values[index]\n\nlatencies = [300, 80, 950, 100, 200, 90, 210, 110]\nprint(percentile(latencies, 0.95))",
  quizOptions: [
    {
      key: "a",
      label:
        "950 -- with 8 values, int(8 * 0.95) truncates 7.6 down to index 7, which is the last (largest) value once the list is sorted",
      correct: true,
    },
    {
      key: "b",
      label: "300, because that's the value physically first in the unsorted list passed in",
      correct: false,
    },
    {
      key: "c",
      label: "An error, because a list of only 8 values is too small to have a p95 at all",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — bubble_sort first turns the list into [80, 90, 100, 110, 200, 210, 300, 950], then index = int(8 * 0.95) = int(7.6) = 7, and index 7 of that 8-item sorted list is the last slot: 950. With only 8 samples, \"the worst 5%\" rounds down to just the single highest value.",
  quizFeedbackIncorrect:
    "Not quite — percentile always sorts first, turning the list into [80, 90, 100, 110, 200, 210, 300, 950], then computes index = int(8 * 0.95) = int(7.6), and int() truncates rather than rounds, giving index 7 — the last slot in an 8-item list, which holds 950.",
  takeaway:
    "Percentiles exist because averages dilute outliers into invisibility — p95 tells you what the worst 5% of requests actually experienced, and computing it takes two concrete skills: sorting the data yourself (bubble sort works fine for teaching-sized lists) and indexing into that sorted list at the right fractional position. None of it works without structured, field-based logs to aggregate over in the first place.",
};

export default content;
