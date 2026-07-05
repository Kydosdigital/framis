import type { LessonData } from "../types";

const content: LessonData = {
  num: 27,
  orderIndex: 3,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "The Function That Decides Whether to Wake Someone Up",
  minutes: 18,
  concept:
    "A metric by itself — latency is 610ms, cost today is $9.40 — doesn't do anything. It just sits there until something compares it to a number that matters and turns that comparison into a decision. That's all an alert is: a function that takes a current value and a threshold, checks whether the value has crossed it, and returns a status like \"OK\" or \"PAGE.\" Real alerting systems usually add a middle tier — a WARN state that fires before the hard threshold is crossed — so a human sees a trend forming instead of only ever getting paged after it's already a crisis. The exact comparison you choose matters more than it looks: a check using > treats hitting the threshold exactly as still fine, while >= treats touching the line as already a breach, and that single character decides whether someone's phone buzzes at 3am. PAGE and WARN are built for judgment calls — a slow response might recover on its own, so waking a human to look is proportionate. A hard budget cap is different: once a user's spend for the day reaches their limit, there's no ambiguity left to weigh, so it doesn't make sense to wait for a human to see a page and manually cut them off. That's the difference between alerting and enforcement — alerting notifies, enforcement acts on its own. The fix is the same kind of function as check_alert, just wired into the request path itself instead of a dashboard: before any request is allowed to proceed, a check like allow_request compares the user's running cost for the day against their budget, and the moment that comparison flips, every further request for that user is blocked automatically until the tracking window resets — no page, no waiting, no human in the loop at all.",
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
    {
      label: "5. Alerting notifies a human; enforcement acts on its own",
      body:
        "PAGE and WARN are the right shape for judgment calls, where a human deciding what to do adds real value. A daily cost budget isn't a judgment call — once a user's spend reaches their limit, the answer is always the same, so it's wired straight into the request path as a gate: a function that returns True or False for whether the next request is even allowed to start, checked before every single request rather than reviewed after the fact.",
      code:
        "def allow_request(user_daily_cost, daily_budget):\n    if user_daily_cost >= daily_budget:\n        return False\n    return True",
    },
  ],
  realWorldIntro:
    "This is what sits behind every red \"1 alert firing\" banner in Datadog or Grafana — a monitor definition that's really just this threshold check, re-evaluated on a schedule against the latest metric value. The enforcement version of the same idea is what powers a rate limiter or a kill switch: a per-user or per-API-key budget gate that a request has to pass before the model API is ever called, so a runaway loop or a compromised key gets cut off automatically instead of waiting for someone to notice the page.",
  realWorldCode:
    "def check_alert(metric_value, threshold):\n    if metric_value >= threshold:\n        return \"PAGE\"\n    elif metric_value >= threshold * 0.8:\n        return \"WARN\"\n    else:\n        return \"OK\"\n\ndef allow_request(user_daily_cost, daily_budget):\n    if user_daily_cost >= daily_budget:\n        return False\n    return True",
  sandbox: {
    kind: "code",
    challenge:
      "Run a user's requests through allow_request one at a time, tracking their running daily cost, and see exactly where the kill switch starts blocking them for the rest of the day.",
    starterCode:
      "def allow_request(user_daily_cost, daily_budget):\n    if user_daily_cost >= daily_budget:\n        return False\n    return True\n\nrequest_costs = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]\ndaily_budget = 3\nuser_daily_cost = 0\nallowed_count = 0\nblocked_count = 0\n\nfor cost in request_costs:\n    if allow_request(user_daily_cost, daily_budget):\n        user_daily_cost = user_daily_cost + cost\n        allowed_count = allowed_count + 1\n        print(f\"request allowed, running total: {user_daily_cost}\")\n    else:\n        blocked_count = blocked_count + 1\n        print(\"request BLOCKED: daily budget reached\")\n\nprint(\"allowed:\", allowed_count)\nprint(\"blocked:\", blocked_count)",
  },
  quizQuestion: "Given allow_request below, what does allow_request(3, 3) return, and what does that mean for the user?",
  quizCode:
    "def allow_request(user_daily_cost, daily_budget):\n    if user_daily_cost >= daily_budget:\n        return False\n    return True\n\nprint(allow_request(3, 3))",
  quizOptions: [
    {
      key: "a",
      label:
        "False — the check is >=, so reaching the daily budget exactly is already enough to block the next request, not just exceeding it",
      correct: true,
    },
    {
      key: "b",
      label: "True, because the user hasn't gone over their budget, only reached it exactly",
      correct: false,
    },
    {
      key: "c",
      label: "False, but only because of a bug — the check should use > instead of >= so hitting the limit exactly still allows one more request",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — allow_request uses >=, so the instant user_daily_cost reaches daily_budget exactly, 3 >= 3 is true and the function returns False: the next request is blocked. That's the deliberate design for a hard cap — the cutoff triggers the moment the line is touched, not only after it's crossed, the same way check_alert's PAGE tier fires on equality rather than waiting to exceed the threshold.",
  quizFeedbackIncorrect:
    "Not quite — the check is user_daily_cost >= daily_budget, so 3 >= 3 evaluates to true and allow_request(3, 3) returns False, blocking the request the moment cost reaches the cap exactly. That's not a bug; it mirrors check_alert's own PAGE condition, which also treats touching the threshold as already a breach rather than requiring it to be exceeded.",
  takeaway:
    "An alert is a function that turns a number and a threshold into a decision, and the operator you pick — > versus >= — along with the tiers you define, are product choices as much as code: they decide exactly when, and how loudly, someone gets woken up. For a hard budget cap, the same comparison goes one step further into enforcement: a gate function like allow_request runs before every request and blocks it outright once the limit is reached, so overspend gets cut off automatically instead of waiting for a human to react to a page.",
};

export default content;
