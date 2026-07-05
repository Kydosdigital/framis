import type { LessonData } from "../types";

const content: LessonData = {
  num: 23,
  orderIndex: 2,
  phaseLabel: "OBSERVABILITY + COST CONTROLS",
  title: "One Request, Five Services, One Trace ID",
  minutes: 18,
  concept:
    "A single user action almost never touches just one piece of your system — it hits an API gateway, gets checked by an auth service, gets orchestrated by your application server, waits on a model API call, and finally gets logged to a database. A single \"total latency: 810ms\" number tells you the request was slow, but not which of those five stops actually caused it. Distributed tracing fixes this by stamping the request with one shared trace_id the instant it arrives, and passing that same ID along to every downstream call it makes. Each service records its own span — a start time, an end time, and the trace_id it belongs to — without needing to know anything about the other services in the chain. Only afterward, when a tracing backend collects every span that shares a trace_id, do those disconnected timings reassemble into one waterfall showing exactly which hop ate the time.",
  conceptSimpler:
    "It's like a package with one tracking number that gets scanned at every depot along its route — no single depot knows the whole journey, but once you look up that tracking number, every scan lines up into one timeline you can actually read.",
  vizStages: [
    {
      label: "1. A single number hides the journey",
      body:
        "The dashboard says this request took 810ms. That's true, but it's also useless for deciding what to fix — 810ms could be one slow hop or five medium ones.",
      code: "request abc123: total_latency = 810ms",
    },
    {
      label: "2. One request, several services",
      body:
        "Behind that number, the request actually passed through a gateway, an auth check, an application server, a model API call, and a database write — five separate services, each with its own clock.",
      code: "gateway -> auth -> app server -> model API -> database",
    },
    {
      label: "3. Every hop stamps the same trace_id",
      body:
        "As the request moves, each service reads the trace_id it was handed, records its own span with that same ID, and passes the ID along to whatever it calls next. No service needs to know the full chain — it only needs to forward the ID.",
      code:
        "span: {\"trace_id\": \"abc123\", \"service\": \"auth\", \"start_ms\": 6, \"end_ms\": 20}",
    },
    {
      label: "4. Collected together, it's a waterfall",
      body:
        "A tracing backend gathers every span sharing trace_id \"abc123\" and lines them up by time. Now the 810ms isn't a mystery — you can see that one hop, the model API call, ate nearly all of it.",
      code:
        "gateway     [==] 6ms\nauth        [====] 14ms\napp server  [======] 20ms\nmodel API   [==============================] 730ms\ndatabase    [=====] 18ms\n-> total: 810ms, 90% spent waiting on the model API",
    },
  ],
  realWorldIntro:
    "This is the exact waterfall view a distributed tracing tool like Datadog APM, Honeycomb, or Jaeger renders when you click into a single slow request — colored bars stacked by service, sized by duration, all sharing one trace ID.",
  realWorldCode:
    "trace_id: abc123\n  gateway     6ms\n  auth        14ms\n  app-server  20ms\n  model-api   730ms   <- longest bar in the waterfall\n  database    18ms",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each hop below to watch the same trace_id ride along with the request and see where the 398ms actually goes.",
    stages: [
      {
        label: "Hop 1 — API Gateway",
        body:
          "The request first hits the gateway, which generates a brand-new trace_id and attaches it before forwarding the request onward. This hop is just routing, so it's fast.",
        code: "trace_id \"req-9f2\" created\nspan: gateway   start=0ms  end=6ms   (6ms)",
      },
      {
        label: "Hop 2 — Auth Service",
        body:
          "The gateway forwards the request, trace_id and all, to the auth service, which validates the token. It records its own span under the same trace_id and hands the request back.",
        code: "span: auth      start=6ms  end=20ms  (14ms)",
      },
      {
        label: "Hop 3 — Application Server",
        body:
          "The app server receives the authenticated request and orchestrates the actual work: deciding to call the model API and, afterward, log the result. Its own overhead is small.",
        code: "span: app-server  start=20ms  end=40ms  (20ms)",
      },
      {
        label: "Hop 4 — Model API Call",
        body:
          "The app server calls out to the model API and waits for a response. This span dwarfs every other hop — it's where almost the entire 398ms is spent.",
        code: "span: model-api  start=40ms  end=380ms  (340ms)",
      },
      {
        label: "Hop 5 — Database Write",
        body:
          "Once the model responds, the app server logs the interaction (cost, latency, tokens) to the database before returning to the user. All five spans share trace_id \"req-9f2\", so a tracing tool can stitch them into one 398ms waterfall.",
        code:
          "span: database   start=380ms  end=398ms  (18ms)\n\ntotal: 398ms  |  model-api alone = 85% of it",
      },
    ],
  },
  quizQuestion:
    "Given the five spans traced above (gateway 6ms, auth 14ms, app-server 20ms, model-api 340ms, database 18ms, total 398ms), which service should the team investigate first to bring down latency?",
  quizCode:
    "gateway     6ms\nauth        14ms\napp-server  20ms\nmodel-api   340ms\ndatabase    18ms\ntotal       398ms",
  quizOptions: [
    {
      key: "a",
      label: "The auth service, since checking a token is extra work that could be skipped",
      correct: false,
    },
    {
      key: "b",
      label:
        "The model API call, since it accounts for roughly 85% of the total request time and shrinking it would move the total the most",
      correct: true,
    },
    {
      key: "c",
      label: "All five services equally, since the total is what matters and each hop contributed something to it",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a trace's whole value is showing you that time isn't spent evenly: model-api's 340ms is roughly 85% of the 398ms total, so even a large improvement to auth or the gateway would barely move the number, while shaving the model call helps immediately.",
  quizFeedbackIncorrect:
    "Not quite — the point of a trace waterfall is that hops rarely contribute equally; here model-api alone is 340 of the 398ms total, so it's overwhelmingly the place to focus rather than spreading effort evenly across all five spans.",
  takeaway:
    "A trace_id is what turns a pile of disconnected per-service logs into one coherent timeline — without it, every service only knows its own slice, and you're left guessing which of five hops actually caused the slow request.",
};

export default content;
