import type { LessonData } from "../types";

const content: LessonData = {
  num: 23,
  orderIndex: 3,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "The Function That Decides Whether to Wake Someone Up",
  minutes: 18,
  concept:
    "A metric by itself — latency is 610ms, cost today is $9.40 — doesn't do anything. It just sits there until something compares it to a number that matters and turns that comparison into a decision. That's all an alert is: a function that takes a current value and a threshold, checks whether the value has crossed it, and returns a status like \"OK\" or \"PAGE.\" Real alerting systems usually add a middle tier — a WARN state that fires before the hard threshold is crossed — so a human sees a trend forming instead of only ever getting paged after it's already a crisis. The exact comparison you choose matters more than it looks: a check using > treats hitting the threshold exactly as still fine, while >= treats touching the line as already a breach, and that single character decides whether someone's phone buzzes at 3am.",
  conceptSimpler:
    "It's like a smoke detector: the sensor reading smoke particles per cubic foot is meaningless on its own, but the moment that reading crosses a wired-in threshold, the exact same circuit that was silent a second ago decides to scream.",
  vizStages: [
    {
      label: "1. A metric alone is just a number",
      body:
        "avg_latency_ms = 610 doesn't tell anyone whether to worry. It's just a fact sitting in memory until something gives it meaning.",
      code: "avg_latency_ms = 610",
    },
    {
      label: "2. A threshold turns it into a decision",
      body:
        "Compare that number to a threshold — say 500ms — and it stops being a fact and becomes a verdict: breached or not breached.",
      code: "threshold = 500\nis_breached = avg_latency_ms > threshold   # True",
    },
    {
      label: "3. Tiers turn one verdict into a response plan",
      body:
        "Most real systems don't jump straight from \"fine\" to \"page someone\" — a WARN tier below the hard threshold gives an early signal a trend is forming before it becomes an emergency.",
      code:
        "if avg_latency_ms >= threshold:\n    status = \"PAGE\"\nelif avg_latency_ms >= threshold * 0.8:\n    status = \"WARN\"\nelse:\n    status = \"OK\"",
    },
    {
      label: "4. This check runs continuously, not once",
      body:
        "In production this function runs against every fresh batch of metrics — often every minute — so \"OK\" this minute says nothing about the next. The moment a reading crosses the line, the exact same check that's been quiet for days fires instantly.",
      code: "minute 1: 340ms -> OK\nminute 2: 410ms -> WARN\nminute 3: 520ms -> PAGE",
    },
  ],
  realWorldIntro:
    "This is what sits behind every red \"1 alert firing\" banner in Datadog or Grafana — a monitor definition that's really just this threshold check, re-evaluated on a schedule against the latest metric value.",
  realWorldCode:
    "def check_alert(metric_value, threshold):\n    if metric_value >= threshold:\n        return \"PAGE\"\n    elif metric_value >= threshold * 0.8:\n        return \"WARN\"\n    else:\n        return \"OK\"",
  sandbox: {
    kind: "code",
    challenge:
      "Run check_alert against a list of recent latency readings and count how many of them would actually page an on-call engineer.",
    starterCode:
      "def check_alert(metric_value, threshold):\n    if metric_value >= threshold:\n        return \"PAGE\"\n    elif metric_value >= threshold * 0.8:\n        return \"WARN\"\n    else:\n        return \"OK\"\n\nlatencies = [220, 340, 480, 610, 900]\nthreshold = 500\n\nfor latency in latencies:\n    status = check_alert(latency, threshold)\n    print(f\"latency {latency}ms -> {status}\")\n\npage_count = 0\nfor latency in latencies:\n    status = check_alert(latency, threshold)\n    if status == \"PAGE\":\n        page_count = page_count + 1\n\nprint(\"total pages fired:\", page_count)",
  },
  quizQuestion: "Given check_alert below, what does check_alert(500, 500) return?",
  quizCode:
    "def check_alert(metric_value, threshold):\n    if metric_value >= threshold:\n        return \"PAGE\"\n    elif metric_value >= threshold * 0.8:\n        return \"WARN\"\n    else:\n        return \"OK\"\n\nprint(check_alert(500, 500))",
  quizOptions: [
    {
      key: "a",
      label: "\"PAGE\", because the condition is metric_value >= threshold, and 500 is equal to 500",
      correct: true,
    },
    {
      key: "b",
      label: "\"WARN\", because the metric hasn't technically gone over the threshold, only reached it",
      correct: false,
    },
    { key: "c", label: "\"OK\", because equal values never count as a breach in an alert check", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the PAGE branch checks metric_value >= threshold, and 500 >= 500 is true, so equality alone is enough; that's a deliberate choice for a hard cap like a budget or SLA, where you want the page to fire the instant you touch the limit, not only after you've gone over it.",
  quizFeedbackIncorrect:
    "Not quite — the first branch is metric_value >= threshold, not >, so a value sitting exactly on the threshold already satisfies it and check_alert(500, 500) returns \"PAGE\"; if the function had used > instead, hitting the line exactly would have fallen through to WARN.",
  takeaway:
    "An alert is a function that turns a number and a threshold into a decision, and the operator you pick — > versus >= — along with the tiers you define, are product choices as much as code: they decide exactly when, and how loudly, someone gets woken up.",
};

export default content;
