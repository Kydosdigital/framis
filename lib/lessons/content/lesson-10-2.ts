import type { LessonData } from "../types";

const content: LessonData = {
  num: 10,
  orderIndex: 2,
  phaseLabel: "DEBUGGING + LOGGING + MONITORING",
  title: "Logging Levels: A Volume Knob for Your Print Statements",
  minutes: 20,
  concept:
    "Every log line has a severity attached to it, not just a message: DEBUG is granular detail useful only while you're actively chasing a bug, INFO is normal expected activity like \"user logged in\" or \"order placed\", WARNING is something surprising that the system noticed but recovered from on its own, and ERROR is something that actually failed. Instead of printing every single line all the time, real logging systems compare each line's severity against one configured threshold — usually called LOG_LEVEL — and only let messages at or above that threshold through. Set the threshold to INFO in production and the flood of DEBUG chatter disappears while you still see every login, checkout, and failure; drop it to DEBUG on your own machine while hunting a bug and every detail reappears, with zero code changes. This is the entire reason logging levels exist: the print statements stay in the code forever, and turning the noise up or down is just flipping one setting.",
  conceptSimpler:
    "It's like a smoke detector with a sensitivity dial — crank it all the way up and it beeps at burnt toast, turn it down and it only goes off for an actual fire, but it's the exact same detector wired the exact same way the whole time.",
  vizStages: [
    {
      label: "1. Four severities, four situations",
      body:
        "The same four calls exist in the code no matter what environment it runs in — DEBUG for step-by-step detail, INFO for routine events, WARNING for recovered hiccups, ERROR for real failures.",
      code:
        "log(\"DEBUG\", \"cache miss for user 42\")\nlog(\"INFO\", \"user 42 logged in\")\nlog(\"WARNING\", \"payment retry attempt 2 of 3\")\nlog(\"ERROR\", \"payment gateway timeout\")",
    },
    {
      label: "2. Every level gets a numeric rank",
      body:
        "To compare severities, each level name is mapped to a number. Higher number means more severe, so ERROR outranks WARNING, which outranks INFO, which outranks DEBUG.",
      code: "LEVELS = {\"DEBUG\": 1, \"INFO\": 2, \"WARNING\": 3, \"ERROR\": 4}",
    },
    {
      label: "3. The threshold decides what survives",
      body:
        "log() looks up the rank of the message's level and the rank of the configured LOG_LEVEL, and only prints if the message's rank is at or above the threshold's rank.",
      code:
        "LOG_LEVEL = \"INFO\"\nthreshold = LEVELS[LOG_LEVEL]\n\ndef log(level, message):\n    if LEVELS[level] >= threshold:\n        print(f\"[{level}] {message}\")",
    },
    {
      label: "4. Same four calls, different output per threshold",
      body:
        "With LOG_LEVEL set to \"INFO\", the DEBUG line is silently dropped while INFO, WARNING, and ERROR all print. Raise it to \"ERROR\" and only the ERROR line survives — nothing else about the code changed.",
      code:
        "# LOG_LEVEL = \"INFO\"  -> prints INFO, WARNING, ERROR\n# LOG_LEVEL = \"ERROR\" -> prints only ERROR",
    },
  ],
  realWorldIntro:
    "Python's built-in logging module and Node's pino both work exactly this way: engineers sprinkle debug(), info(), warning(), and error() calls throughout the codebase once, and a single LOG_LEVEL environment variable — often DEBUG on a laptop, WARNING or ERROR in production — decides which of those calls actually reach the terminal or a log aggregator like Datadog.",
  realWorldCode:
    "LOG_LEVEL = \"WARNING\"  # DEBUG locally while developing, WARNING or ERROR once deployed",
  sandbox: {
    kind: "code",
    challenge:
      "This log() function should only print messages at or above the configured LOG_LEVEL threshold, but the comparison is backwards — find and fix the bug so DEBUG and INFO stop leaking through while ERROR stops getting swallowed.",
    starterCode:
      "LEVELS = {\"DEBUG\": 1, \"INFO\": 2, \"WARNING\": 3, \"ERROR\": 4}\nLOG_LEVEL = \"WARNING\"\n\ndef log(level, message):\n    threshold = LEVELS[LOG_LEVEL]\n    level_rank = LEVELS[level]\n    if level_rank <= threshold:\n        print(f\"[{level}] {message}\")\n\nlog(\"DEBUG\", \"cache miss for user 42\")\nlog(\"INFO\", \"user 42 logged in\")\nlog(\"WARNING\", \"payment retry attempt 2 of 3\")\nlog(\"ERROR\", \"payment gateway timeout\")",
  },
  quizQuestion:
    "With LOG_LEVEL set to \"ERROR\", what happens when this line runs?",
  quizCode:
    "LEVELS = {\"DEBUG\": 1, \"INFO\": 2, \"WARNING\": 3, \"ERROR\": 4}\nLOG_LEVEL = \"ERROR\"\nthreshold = LEVELS[LOG_LEVEL]\n\ndef log(level, message):\n    if LEVELS[level] >= threshold:\n        print(f\"[{level}] {message}\")\n\nlog(\"WARNING\", \"disk usage at 85%\")",
  quizOptions: [
    {
      key: "a",
      label: "It prints, because WARNING is still a real problem worth surfacing no matter the threshold",
      correct: false,
    },
    {
      key: "b",
      label:
        "Nothing prints, because WARNING's rank (3) is lower than ERROR's rank (4), so it doesn't meet the threshold",
      correct: true,
    },
    {
      key: "c",
      label: "It crashes, because WARNING was never defined as a valid log level",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the threshold is the rank of ERROR (4), and WARNING only ranks 3, so 3 >= 4 is false and the message never reaches the print.",
  quizFeedbackIncorrect:
    "Not quite — WARNING is right there in the LEVELS dict, so nothing crashes; the actual outcome comes down to rank comparison: WARNING's rank (3) is less than the ERROR threshold's rank (4), so the >= check fails and it never prints.",
  takeaway:
    "Logging levels turn one static print() into a volume knob: rank every severity, compare it against one configured threshold, and the exact same code produces a quiet production log or a noisy debugging session depending on a single setting. Never delete your DEBUG logs — just raise the threshold and they go silent until the next time you need them.",
};

export default content;
