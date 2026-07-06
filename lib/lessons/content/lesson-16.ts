import type { LessonData } from "../types";

const content: LessonData = {
  num: 16,
  orderIndex: 1,
  phaseLabel: "CI/CD + DOCKER + DEPLOYMENT",
  title: "Four gates between your commit and production",
  minutes: 20,
  concept:
    "A CI/CD pipeline is a fixed sequence of automated gates that your code has to pass through before it ever reaches real users: build, test, package, deploy. Build takes your source code and turns it into something runnable, catching things like missing files or syntax errors immediately. Test runs your automated test suite against that build, and if a single test fails, the pipeline stops right there — nothing broken moves forward. Package takes a build that passed its tests and seals it into a Docker image, a self-contained snapshot with your code plus every dependency and system library it needs, so it behaves identically on your laptop and on the server. Only after all three gates are green does deploy push that exact image out to production, which is why a passing pipeline feels boring — boring is the entire point, because it means a human didn't have to eyeball each step and hope nothing was missed.",
  conceptSimpler:
    "It's an assembly line for your code: each station checks one thing and bolts on one part, and if a part fails inspection the line stops before a broken product reaches the loading dock.",
  vizStages: [
    {
      label: "1. Build",
      body:
        "The pipeline pulls your latest commit and compiles or bundles it. A typo, a missing import, or a broken config file gets caught here — before anyone even runs a test.",
      code: "$ npm run build\n> compiling TypeScript...\n> build succeeded (12.3s)",
    },
    {
      label: "2. Test",
      body:
        "The freshly built code is run against your automated test suite. One failing test halts the entire pipeline — a broken feature never gets a chance to move further down the line.",
      code: "$ npm test\n> 214 passed, 0 failed\n> test suite: PASS",
    },
    {
      label: "3. Package",
      body:
        "A build that passed its tests gets sealed into a Docker image — your code plus its exact runtime, libraries, and OS dependencies, frozen into one artifact that behaves the same everywhere.",
      code: "$ docker build -t framis-api:a1b2c3 .\n> Successfully built a1b2c3\n> Successfully tagged framis-api:a1b2c3",
    },
    {
      label: "4. Deploy",
      body:
        "The tagged image is pushed to a registry and rolled out to production servers, replacing the old version. Because it's the exact image that already passed build and test, there are no surprises left to find.",
      code: "$ kubectl set image deployment/api api=framis-api:a1b2c3\n> deployment \"api\" successfully rolled out",
    },
  ],
  realWorldIntro:
    "A GitHub Actions or GitLab CI config file lists these stages explicitly, and a merge to main triggers all of them automatically, in order, with no human clicking anything.",
  realWorldCode:
    "jobs:\n  build:\n    run: npm run build\n  test:\n    needs: build\n    run: npm test\n  package:\n    needs: test\n    run: docker build -t framis-api:$SHA .\n  deploy:\n    needs: package\n    run: kubectl set image deployment/api api=framis-api:$SHA",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each pipeline stage below to see what runs there and what it would look like for that stage to fail.",
    stages: [
      {
        label: "Build",
        body:
          "Source code is compiled or bundled into a runnable artifact. If a file won't parse or an import points to something that doesn't exist, the build fails immediately and nothing downstream even starts.",
        code: "$ npm run build\n> ERROR: Cannot find module './utils/formatDate'\n> build failed",
      },
      {
        label: "Test",
        body:
          "The automated test suite runs against the build. A single failing assertion — say, a checkout total calculated wrong — stops the pipeline so that bug can never reach a real customer.",
        code: "$ npm test\n> FAIL src/cart.test.ts\n> expect(total).toBe(29.99) — received 27.99\n> test suite: FAILED",
      },
      {
        label: "Package",
        body:
          "A passing build+test combo gets containerized into a Docker image with all its dependencies baked in. This step fails if the Dockerfile references a package version that no longer exists or a base image that can't be pulled.",
        code: "$ docker build -t framis-api:a1b2c3 .\n> ERROR: failed to solve: node:18.9.2-slim: not found",
      },
      {
        label: "Deploy",
        body:
          "The finished image is rolled out to production. This step fails if the server can't pull the image, runs out of resources, or the new container crashes on startup — triggering an automatic rollback to the last known-good version.",
        code: "$ kubectl set image deployment/api api=framis-api:a1b2c3\n> Error: ImagePullBackOff\n> rolling back to framis-api:9f8e7d6",
      },
    ],
  },
  quizQuestion:
    "Your test suite has one failing test, but the packaging and deploy stages still successfully build a Docker image and ship it to production. What went wrong with the pipeline?",
  quizOptions: [
    {
      key: "a",
      label:
        "The pipeline isn't actually configured to stop on test failure — each stage is running independently instead of depending on the previous stage passing",
      correct: true,
    },
    {
      key: "b",
      label: "Docker images can't contain failing tests, so the test failure was automatically ignored",
      correct: false,
    },
    {
      key: "c",
      label: "This is expected — deploy stages always run regardless of test results, as a safety net",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a properly wired pipeline makes package and deploy depend on test passing first, so a failing test should have blocked everything after it; if broken code still shipped, the stages were running independently instead of gated in sequence.",
  quizFeedbackIncorrect:
    "Not quite — the whole reason pipeline stages are ordered is so a failure early on (like a failing test) blocks every stage after it; if a broken build still deployed, the stages weren't actually gated on each other.",
  takeaway:
    "A CI/CD pipeline is only as useful as its gates: build, test, package, and deploy each have to depend on the previous one succeeding, so that a single failure anywhere stops broken code before it reaches users.",
  nextUpLabel: "LLM APIs + Tokens + Cost",
};

export default content;
