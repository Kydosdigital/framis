import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 4,
  phaseLabel: "CI/CD + DOCKER + DEPLOYMENT",
  title: "Rollbacks: what happens when a deploy goes wrong",
  minutes: 20,
  concept:
    "This lesson's examples run on Kubernetes, so it's worth pinning down what that word actually means before diving in: Kubernetes is an orchestrator — a system that runs your containers across a whole fleet of machines instead of just one, automatically restarting a container that crashes and rescheduling containers onto healthy machines as things come and go. The smallest unit Kubernetes actually runs is a pod: one or more containers bundled together that always live on the same machine and share a network address and storage, so in practice a pod is just \"one running copy of your app, as far as Kubernetes is concerned.\" You talk to a cluster through kubectl, its command-line tool, and a deployment is the object that tells Kubernetes \"keep this many pods of this version running at all times\" — which is exactly what makes a rollback possible. A rollback reverts production to the last version that was known to work, instead of trying to fix a broken deploy while it's actively live and hurting users. This is possible because CI/CD already builds and tags an immutable image for every deploy, so the previous version is still sitting in the registry, fully built and ready to run — a rollback doesn't rebuild anything, it just repoints traffic at an image that already exists, which is why it can happen in seconds rather than the minutes a fresh build and test cycle would take. Monitoring is what makes this fast: health checks, error-rate dashboards, and crash-loop detection are what actually notice a bad deploy, often before a human does, and many pipelines trigger an automatic rollback the moment a new version fails its own health check. The key judgment call for a team is that rolling back is not the same as fixing the bug — it's a stop-the-bleeding move that restores a safe, known state for users while the actual root cause gets diagnosed calmly, offline, without the pressure of live errors piling up. Only after that diagnosis and a real fix does the team deploy forward again, as a new version.",
  conceptSimpler:
    "A rollback is like restoring your last saved game instead of trying to un-break the level you just broke while still playing it live — you go back to the checkpoint you know was fine, and figure out what went wrong afterward, with no pressure.",
  vizStages: [
    {
      label: "1. A deploy goes out",
      body:
        "A new image, built and tested by the pipeline, gets rolled out to replace the currently running version. Everything about the build process looked fine — no failing tests, no failed image build.",
      code: "$ kubectl set image deployment/api api=framis-api:v42\n> deployment \"api\" successfully rolled out",
    },
    {
      label: "2. Monitoring catches the problem",
      body:
        "Within minutes, error rates spike and Kubernetes' readiness probe — a health check it repeatedly runs against each pod to confirm it can actually handle traffic — starts failing on the new pods. This is the kind of problem that only shows up under real production traffic and data, not in the test suite.",
      code: "ALERT: error_rate > 5% for 3m\nAPI /checkout returning 500\npod api-7f4c9-x2j failed readiness probe (3/3)",
    },
    {
      label: "3. Roll back, don't debug live",
      body:
        "Instead of trying to patch the bug in production, the on-call engineer reverts to the previous image — v41 — which is already built, tagged, and sitting in the registry, ready to run immediately.",
      code: "$ kubectl rollout undo deployment/api\n> deployment \"api\" rolled back to revision 41",
    },
    {
      label: "4. Safe again, now diagnose",
      body:
        "Traffic is served by the known-good version again and the error rate drops back to normal. Only now, without users actively affected, does the team dig into what v42 actually broke.",
      code: "error_rate: 5.2% -> 0.1%\nstatus: stable on framis-api:v41\nnext: root-cause v42 offline before redeploying",
    },
  ],
  realWorldIntro:
    "On Kubernetes this is a single command, kubectl rollout undo, and on platforms like Vercel or Heroku it's a \"revert to previous deployment\" button — both work because the previous Docker image, tagged by commit SHA, was never deleted from the registry.",
  realWorldCode:
    "$ kubectl rollout history deployment/api\nREVISION  CHANGE-CAUSE\n40        deploy framis-api:v40\n41        deploy framis-api:v41\n42        deploy framis-api:v42\n\n$ kubectl rollout undo deployment/api --to-revision=41",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see a bad deploy get caught, rolled back, and properly fixed afterward.",
    stages: [
      {
        label: "New version deploys",
        body:
          "Version 42 passed every pipeline gate — build, test, package — and rolls out to production. Nothing in CI could have caught this next problem, because it only appears under real production load.",
        code: "$ kubectl set image deployment/api api=framis-api:v42\n> deployment \"api\" successfully rolled out",
      },
      {
        label: "Production starts failing",
        body:
          "A connection pool setting that was fine in testing gets exhausted under real traffic volume, and requests start timing out. This is a class of bug that tests alone often can't catch.",
        code: "ERROR: connection pool exhausted (max 10, requested 47)\nrequests timing out after 30s\nerror_rate climbing: 1% -> 4% -> 9%",
      },
      {
        label: "Alerting fires",
        body:
          "A monitoring rule crosses its threshold and pages the on-call engineer automatically, rather than waiting for a customer to report it.",
        code: "PagerDuty: [API] error_rate 9.2% exceeds 5% threshold for 3 minutes\nassigned to: on-call engineer",
      },
      {
        label: "Rollback, not a live patch",
        body:
          "The on-call engineer chooses to roll back to v41 rather than push a hotfix, because v41 is already built and verified, and reverting takes seconds versus writing, testing, and shipping a fix under pressure.",
        code: "$ kubectl rollout undo deployment/api\n> deployment \"api\" rolled back to revision 41\nerror_rate: 9.2% -> 0.2%",
      },
      {
        label: "Root cause fixed forward",
        body:
          "With production stable again, the team investigates offline, finds the pool size was misconfigured for the new traffic pattern, fixes it, and ships it through the full pipeline as v43 — not as a rushed patch to v42.",
        code: "// config fix, tested, built, deployed as a new version\nconst pool = new Pool({ max: 50 }); // was 10\n$ kubectl set image deployment/api api=framis-api:v43",
      },
    ],
  },
  quizQuestion:
    "A new deploy starts causing 500 errors for 10% of users. The on-call engineer immediately rolls back to the previous version instead of trying to patch the bug live in production. Why is rolling back usually the safer first move?",
  quizOptions: [
    {
      key: "a",
      label:
        "The previous version is already a built, tested image sitting in the registry, so reverting to it restores a known-good state almost instantly, buying time to diagnose the real bug without users actively suffering",
      correct: true,
    },
    {
      key: "b",
      label:
        "Rolling back permanently fixes the underlying bug, so no further investigation or fix is needed afterward",
      correct: false,
    },
    {
      key: "c",
      label:
        "A rollback works by rebuilding the previous version from source on the fly, which is inherently more reliable than patching the current code",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the previous image never needs to be rebuilt, it already exists and already passed its own build and test gates, which is exactly why reverting to it is fast and low-risk compared to writing and shipping a fix under live pressure.",
  quizFeedbackIncorrect:
    "Not quite — a rollback doesn't fix the bug in v42 or rebuild anything; it works precisely because the previous image is already built and verified, so it can be restored instantly while the real fix gets made calmly, offline, and shipped forward as a new version.",
  takeaway:
    "Rolling back isn't fixing the bug — it's restoring safety fast by returning to an image that's already proven to work, which buys the team time to diagnose and fix the real problem without users paying the cost of that investigation.",
};

export default content;
