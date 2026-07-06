import type { LessonData } from "../types";

const content: LessonData = {
  num: 14,
  orderIndex: 4,
  phaseLabel: "DEBUGGING + LOGGING + MONITORING",
  title: "Monitoring: Hearing the Alarm Before the Customer Complaint",
  minutes: 20,
  concept:
    "Monitoring means continuously watching signals about a system while it's running, instead of reading through logs after something already went wrong. Logs record what happened for one specific request, but metrics summarize the aggregate health across every request at once — things like error rate, requests per second, and p95 latency (the response time that 95% of requests are faster than). A monitoring system compares those metrics against thresholds in real time and fires an alert the moment one crosses the line, so a human gets paged automatically instead of finding out from an angry support ticket or a spike of one-star reviews. Dashboards make the trend visible before it becomes an emergency, and simple health checks — an automated ping to something like /health every 30 seconds — catch total outages that metrics based on request volume can miss entirely, since a fully-down service has no requests left to compute an error rate from.",
  conceptSimpler:
    "If logging is one security guard's notebook entries about a single incident, monitoring is the whole bank of camera feeds a control room watches at once, with an alarm that trips automatically the moment one camera shows something wrong.",
  vizStages: [
    {
      label: "1. Logs vs. metrics vs. traces",
      body:
        "Logs are the detailed record of one request; metrics are numbers aggregated over time across every request. Monitoring leans on metrics because nobody can read a million log lines in real time, but everybody can watch one number on a graph.",
      code: "error_rate = failed_requests / total_requests * 100\np95_latency_ms = 340",
    },
    {
      label: "2. A threshold turns a number into an alert",
      body:
        "Just like a logging level threshold, a monitoring rule compares a live metric against a configured limit, continuously, and pages someone the instant it's crossed.",
      code: "if error_rate > 5.0:\n    page_on_call(\"error rate spiked to \" + str(error_rate) + \"%\")",
    },
    {
      label: "3. Dashboards show the trend, not just the snapshot",
      body:
        "An error rate climbing from 0.2% to 4.8% over 20 minutes is visible on a dashboard well before it crosses a 5% alert threshold — giving an engineer who happens to glance at it a head start on the fix.",
      code: "09:00  0.2%\n09:10  0.8%\n09:20  2.1%\n09:30  4.8%   <- climbing toward the 5% alert line",
    },
    {
      label: "4. Health checks catch what error-rate metrics miss",
      body:
        "If a service is completely down, there's no request traffic left to compute an error rate from at all. A dumb, regular ping to a health endpoint catches that total-outage case that percentage-based metrics can't see.",
      code: "GET /health -> expected 200 OK\nGET /health -> timeout (3 in a row) -> page on-call",
    },
  ],
  realWorldIntro:
    "Tools like Datadog, Grafana, and PagerDuty exist specifically to turn a flood of production metrics into a small number of dashboards and alerts, so an on-call engineer finds out their checkout error rate spiked to 8% within a minute or two — not the next morning from a pile of angry emails.",
  realWorldCode:
    "// alert rule, evaluated every 60 seconds against live traffic\nif error_rate > 5.0 and duration_minutes >= 5:\n    page_on_call(\"checkout-service error rate sustained above 5%\")",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each monitoring signal below and figure out what it's telling you and what you'd check next.",
    stages: [
      {
        label: "Signal: error rate alert",
        body:
          "12.4% of checkout requests are failing, well above the 5% threshold, sustained for 6 minutes — not just a one-request blip. This is real and worth paging someone; the next step is checking recent deploys and error logs for the checkout service specifically.",
        code: "ALERT: checkout-service error_rate\ncurrent: 12.4%   threshold: 5%\nduration: 6 minutes",
      },
      {
        label: "Signal: p95 latency creeping up",
        body:
          "p95 means 95% of requests are faster than this number. Climbing from 180ms to 610ms over 45 minutes, with no alert firing yet, is an early warning — a slow query, a memory leak, or a struggling dependency — before it becomes a full outage.",
        code: "metric: api_latency_p95_ms\n08:00  180ms\n08:15  210ms\n08:30  340ms\n08:45  610ms",
      },
      {
        label: "Signal: health check failing",
        body:
          "Three consecutive timeouts on a basic health endpoint usually means the whole service is unreachable, not just slow for some users. This is the highest-urgency signal there is — if a service can't answer a health check, it can't answer real users either.",
        code:
          "GET https://api.framis.dev/health\n09:12:01  200 OK\n09:12:31  200 OK\n09:13:01  timeout\n09:13:31  timeout\n09:14:01  timeout",
      },
      {
        label: "Signal: CPU and memory look fine, but errors are up",
        body:
          "Healthy-looking infrastructure metrics alongside a spiking error rate points away from \"we need more servers\" and toward a logic bug or a broken dependency — a bad deploy, an expired API key, a third-party outage. Scaling up hardware won't fix this one; reading the actual error logs will.",
        code: "cpu_usage: 22%\nmemory_usage: 41%\nerror_rate: 9.8% (threshold 5%)",
      },
      {
        label: "Signal: an alert that fires every night at 2am",
        body:
          "An alert that fires constantly and gets acknowledged on autopilot without anyone investigating is exactly how real incidents get missed later. This is alert fatigue — the fix is resolving the underlying disk growth or adjusting the threshold, not muting the noise forever.",
        code: "ALERT: disk_usage > 80%\nfired: 14 nights in a row\nacknowledged: yes (14 times)   investigated: no",
      },
    ],
  },
  quizQuestion:
    "CPU and memory both look completely normal, but the error rate alert just fired well above threshold. What's the most likely next step?",
  quizCode: "cpu_usage: 18%\nmemory_usage: 35%\nerror_rate: 11.2% (threshold: 5%)",
  quizOptions: [
    {
      key: "a",
      label: "Scale up to more servers immediately, since a spike in errors usually means the servers are overloaded",
      correct: false,
    },
    {
      key: "b",
      label:
        "Check recent deploys and error logs for a logic bug or broken dependency, since the infrastructure itself looks healthy",
      correct: true,
    },
    {
      key: "c",
      label: "Ignore it — if CPU and memory are fine, the error rate metric is probably a false alarm",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — when the machines are healthy but requests are still failing, the cause is almost always in the code path or a dependency, like a bad deploy, an expired credential, or a third-party API outage, not a lack of hardware capacity.",
  quizFeedbackIncorrect:
    "Not quite — healthy CPU and memory rule out \"we're out of capacity,\" and a sustained error rate well above threshold is real, not noise; the next move is checking recent deploys and logs, not adding servers or dismissing the alert.",
  takeaway:
    "Monitoring watches the aggregate health of a live system — error rates, latency, uptime — and pages a human the moment one of those numbers crosses a threshold, so a team hears about a problem in minutes instead of from a customer complaint. Healthy infrastructure metrics next to a spiking error rate almost always point at a code or dependency problem, not a capacity problem.",
};

export default content;
