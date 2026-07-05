import type { LessonData } from "../types";

const content: LessonData = {
  num: 12,
  orderIndex: 2,
  phaseLabel: "CI/CD + DOCKER + DEPLOYMENT",
  title: "Containers: why \"it works on my machine\" stops being an excuse",
  minutes: 20,
  concept:
    "A container packages your application together with the exact runtime, libraries, and system dependencies it needs to run, sealed into one artifact called an image. That image is built once from a Dockerfile — a list of instructions like \"start from Node 20, copy in these files, install these exact dependency versions\" — and then that same, unchanging image is what runs on your laptop, in CI, and in production. This is different from a virtual machine, which emulates entire hardware and boots a full separate operating system; a container instead shares the host machine's kernel and just isolates the process, its filesystem, and its dependencies, which is why containers start in milliseconds instead of minutes. Because the image is frozen at build time, there's no longer a gap between \"the version of Node/Python/OpenSSL installed on my laptop\" and \"the version installed on the server\" — the image carries its own copy of all of that, so it behaves identically no matter where it's run. That's the whole point: bugs caused by environment drift, like a library version mismatch, simply can't happen anymore, because everyone is running the literal same bytes. Under the hood, an image is built as a stack of layers, one per instruction in the Dockerfile, and Docker caches each layer so an unchanged instruction is reused instead of re-run on every rebuild — which means the order instructions appear in matters just as much as what they say. A multi-stage build takes this further: one throwaway image with compilers and build tools produces the app, and a second, minimal image ships only the finished result, so build-time tooling never bloats what actually runs in production.",
  conceptSimpler:
    "A container is like a shipping container for your code: it doesn't matter what's packed inside or which ship, crane, or truck moves it — the container's fixed shape means every piece of infrastructure handles it exactly the same way.",
  vizStages: [
    {
      label: "1. The classic bug",
      body:
        "A developer's laptop has Node 18 installed globally. Their code runs perfectly. A teammate with Node 20 pulls the same commit and gets a crash — same code, different environment, different result.",
      code: "# Dev A's machine\n$ node -v\nv18.19.0\n$ npm start\n> Server running on port 3000\n\n# Dev B's machine\n$ node -v\nv20.11.0\n$ npm start\n> TypeError: structuredClone is not a function",
    },
    {
      label: "2. What was actually different",
      body:
        "Nothing in the source code changed. What differed was the installed Node version, some OS-level library, and possibly a global package version — none of which are tracked by git, so nobody noticed the drift until it broke.",
      code: "// same file, same commit hash\n// different Node version underneath it\n// = different behavior at runtime",
    },
    {
      label: "3. A Dockerfile freezes the environment",
      body:
        "The Dockerfile pins the exact base image and installs dependencies from a lockfile, so the runtime is no longer \"whatever happens to be on this machine\" — it's specified, in writing, as part of the codebase. Notice it copies package.json and runs the install before copying the rest of the source: Docker caches each instruction as its own layer, so that (usually slow) install step is reused on every rebuild unless package.json itself changes, instead of reinstalling every dependency just because a source file was edited.",
      code: "FROM node:20.11.0-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD [\"npm\", \"start\"]",
    },
    {
      label: "4. Build once, run anywhere",
      body:
        "docker build turns that Dockerfile into an image. Every machine — a laptop, a CI runner, a production server — runs that exact image instead of installing things fresh, so \"it works on my machine\" is no longer a meaningful distinction.",
      code: "$ docker build -t framis-api:a1b2c3 .\n$ docker run framis-api:a1b2c3\n> Server running on port 3000\n# identical result, any host",
    },
    {
      label: "5. More than one container: docker-compose",
      body:
        "A single Dockerfile packages one container, but a real app is rarely just one — this API also needs a Postgres database running alongside it. docker-compose describes every service and how they connect in one YAML file, so the whole stack comes up together with a single command instead of hand-running a separate docker run for each piece.",
      code: "# docker-compose.yml\nservices:\n  api:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      DATABASE_URL: postgres://db:5432/app\n    depends_on:\n      - db\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: devpassword\n\n$ docker compose up\n> Creating framis_db_1 ... done\n> Creating framis_api_1 ... done",
    },
  ],
  realWorldIntro:
    "Framis keeps a single Dockerfile in the repo root, and CI builds one image from it that gets deployed unchanged to staging and then to production — nobody re-installs dependencies by hand on a server ever again.",
  realWorldCode:
    "FROM node:20.11.0-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nRUN npm run build\nCMD [\"npm\", \"run\", \"start\"]",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see the same bug appear locally, then get eliminated once the app is containerized.",
    stages: [
      {
        label: "Local machine, no container",
        body:
          "A developer installs a package globally and writes code that depends on a specific patch version of a system library. It runs fine for them, because their machine happens to already have what's needed.",
        code: "$ npm install -g sharp@0.32.0\n$ node resize.js\n> resized image: ok",
      },
      {
        label: "A teammate's machine, no container",
        body:
          "A second developer pulls the same commit onto a machine with a different OS and a different globally installed version of the same library. The exact same source file now fails.",
        code: "$ node resize.js\n> Error: libvips version mismatch (needs 8.14, found 8.9)",
      },
      {
        label: "Writing the Dockerfile",
        body:
          "Instead of relying on whatever happens to be installed on a given machine, the Dockerfile specifies the base image and installs dependencies inside the container itself, as a repeatable, scripted step.",
        code: "FROM node:20-slim\nRUN apt-get update && apt-get install -y libvips-dev\nCOPY package*.json ./\nRUN npm ci",
      },
      {
        label: "Building the image",
        body:
          "docker build executes every instruction in the Dockerfile in order and produces a single image containing the app plus the correct library versions, already installed and verified to work together.",
        code: "$ docker build -t resize-tool .\n> Successfully built 7f3e9c1\n> Successfully tagged resize-tool:latest",
      },
      {
        label: "Running the container anywhere",
        body:
          "Both developers now run the same image instead of running node directly on their own machines. The library version question is settled inside the image, so the bug can't resurface on either laptop.",
        code: "$ docker run resize-tool node resize.js\n> resized image: ok\n# same result on both machines",
      },
    ],
  },
  quizQuestion:
    "Two engineers pull the exact same commit and get different behavior — one's code works, the other's crashes. What's the most likely cause, and how does a container actually fix it?",
  quizOptions: [
    {
      key: "a",
      label:
        "Their machines have different installed runtime/library versions; a container bakes the exact runtime and dependencies into an image so both engineers run identical bytes instead of relying on what's installed locally",
      correct: true,
    },
    {
      key: "b",
      label:
        "Git must have silently applied the commit differently on each machine, so re-cloning the repository on both machines will resolve it",
      correct: false,
    },
    {
      key: "c",
      label:
        "Containers only change behavior in production, so this local discrepancy would exist with or without Docker",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the code was identical, so the difference had to be environmental (Node version, OS library, global package); a container removes that variable entirely by shipping the exact runtime and dependencies as part of the artifact both engineers run.",
  quizFeedbackIncorrect:
    "Not quite — git tracks source code, not what's installed on a machine, so an identical commit can still behave differently across machines with different runtimes; a container fixes exactly this by freezing the runtime and dependencies into one image both machines run unchanged.",
  takeaway:
    "A container turns \"make sure your machine matches mine\" into \"run this image\" — the runtime, libraries, and OS dependencies are frozen inside the artifact itself, so environment drift stops being a source of bugs.",
};

export default content;
