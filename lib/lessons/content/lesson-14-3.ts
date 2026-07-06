import type { LessonData } from "../types";

const content: LessonData = {
  num: 14,
  orderIndex: 3,
  phaseLabel: "DEBUGGING + LOGGING + MONITORING",
  title: "Stack Traces: Reading the Crime Scene, Not the Headline",
  minutes: 18,
  concept:
    "A stack trace is not a wall of noise to skim past — it's an ordered map of exactly which function called which other function, all the way down to the line that actually failed. The first line is the headline: the error's type and message, telling you what kind of failure happened, like a null reference, a bad type conversion, or a timeout. Below that, each frame is one function call in the chain, listed most-recent-call-first, and every frame names a file and a line number, which is the single most useful piece of information on the entire trace. Most of those frames belong to libraries and frameworks you didn't write — React, Next.js, node_modules — so the real skill is scanning down until you hit the first frame that points at a file inside your own project; that's almost always where the fix belongs, even though the error technically surfaced a few frames higher, inside someone else's code.",
  conceptSimpler:
    "A stack trace is like a chain of phone calls that ended in someone yelling — instead of panicking at the yelling, you trace the call back caller by caller until you find the person who actually caused the problem, who is rarely the last person who happened to be on the line.",
  vizStages: [
    {
      label: "1. Start at the very top line",
      body:
        "The first line names the error type and message. Read this first — it tells you the category of failure before you've even looked at where it happened.",
      code: "TypeError: Cannot read properties of undefined (reading 'email')",
    },
    {
      label: "2. Scan down through the frames",
      body:
        "Each \"at ...\" line below is one function call, most recent first. Several of these point straight into libraries you didn't write.",
      code:
        "    at sendWelcomeEmail (/app/lib/mailer.ts:14:22)\n    at createUser (/app/lib/users.ts:41:9)\n    at async POST (/app/app/api/signup/route.ts:23:5)\n    at async node_modules/next/dist/server/route-handler.js:132:18",
    },
    {
      label: "3. Find the first frame that's actually yours",
      body:
        "Skip past the next/dist frame — that's just the framework routing the request — and stop at the first line pointing into your own project folder. Here, that's mailer.ts:14.",
      code: "at sendWelcomeEmail (/app/lib/mailer.ts:14:22)   <- your code, start here",
    },
    {
      label: "4. Go read that exact line",
      body:
        "Line 14 of mailer.ts is where the crash actually happened: some user object was undefined and the code tried to read .email off it. Everything above that frame is context, not the culprit.",
      code: "// mailer.ts, line 14\nconst subject = `Welcome, ${user.email}`;",
    },
  ],
  realWorldIntro:
    "Error-tracking tools like Sentry and Rollbar exist because reading raw stack traces at 2am is hard — they group thousands of crashes by their trace signature and jump straight to the first frame inside your own repository, saving an on-call engineer from having to scroll past dozens of framework frames by hand.",
  realWorldCode:
    "// Sentry groups these two crashes as \"the same issue\" because\n// they share the same first-party frame: mailer.ts:14",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each real-looking stack trace and figure out which single frame you'd open first to start debugging.",
    stages: [
      {
        label: "A classic null/undefined crash",
        body:
          "The react-dom frame is a red herring — it's just the framework rendering the page. The actual bug is in cart.ts line 9, where cart turned out to be null before .items was read off it.",
        code:
          "TypeError: Cannot read properties of null (reading 'items')\n    at calculateCartTotal (/app/lib/cart.ts:9:18)\n    at CheckoutPage (/app/app/checkout/page.tsx:31:24)\n    at node_modules/react-dom/cjs/react-dom-server.node.development.js:2113:7",
      },
      {
        label: "An error thrown three layers deep",
        body:
          "All three frames here belong to your own project, so read the topmost one first — parseDiscountCode at line 52 is exactly where the bad string-to-number conversion happens. applyDiscount and the route handler are just callers that eventually asked for this.",
        code:
          "ValueError: invalid literal for int() with base 10: 'N/A'\n    at parseDiscountCode (/app/lib/pricing.ts:52:11)\n    at applyDiscount (/app/lib/pricing.ts:18:9)\n    at POST (/app/app/api/checkout/route.ts:44:16)",
      },
      {
        label: "Async stack traces skip around",
        body:
          "Async/await stacks include synthetic bookkeeping frames like \"async Promise.all (index 1)\" that don't map to any line in your code. Skip those and keep scanning for real file:line frames — here, payments.ts:77 is the one that matters.",
        code:
          "Error: Payment provider timed out\n    at chargeCard (/app/lib/payments.ts:77:13)\n    at async Promise.all (index 1)\n    at async processOrder (/app/lib/orders.ts:29:3)",
      },
      {
        label: "When the message is generic but the location is specific",
        body:
          "\"Reading 'toFixed'\" alone doesn't say which product broke, but the file and line do: format.ts:6 is where a missing number caused the crash, and ProductCard.tsx:15 is the caller that passed it in without checking.",
        code:
          "TypeError: Cannot read properties of undefined (reading 'toFixed')\n    at formatPrice (/app/lib/format.ts:6:24)\n    at ProductCard (/app/components/ProductCard.tsx:15:19)",
      },
      {
        label: "In production, minified code can hide the trail",
        body:
          "A minified build renames functions to single letters and collapses everything onto one line, so file:line alone stops being enough to find real bugs. This is exactly why teams upload source maps to tools like Sentry — so a trace like this one gets translated back into real file and function names automatically.",
        code:
          "TypeError: Cannot read properties of undefined (reading 'a')\n    at t (/app/.next/static/chunks/847.a1b2c3.js:1:4821)",
      },
    ],
  },
  quizQuestion: "Given this stack trace, which frame should you open first to start debugging?",
  quizCode:
    "TypeError: Cannot read properties of undefined (reading 'total')\n    at printReceipt (/app/lib/receipt.ts:11:29)\n    at checkoutOrder (/app/lib/checkout.ts:47:5)\n    at node_modules/next/dist/server/api-utils/node.js:88:14",
  quizOptions: [
    {
      key: "a",
      label: "The node_modules/next/dist frame, since that's the framework code actually running the request",
      correct: false,
    },
    {
      key: "b",
      label: "printReceipt at /app/lib/receipt.ts:11, since it's the first frame that points into your own project's code",
      correct: true,
    },
    {
      key: "c",
      label: "checkoutOrder at /app/lib/checkout.ts:47, since it's listed lower and therefore closer to the true root cause",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — printReceipt is the topmost frame that points at a file inside your own project, and that's exactly the line where the undefined value was accessed; the next/dist frame beneath it is just framework machinery that eventually called your code.",
  quizFeedbackIncorrect:
    "Not quite — the crash happened inside printReceipt at receipt.ts:11, the first frame that's part of your own project; checkoutOrder just happened to call it, and the next/dist frame is framework internals, not a bug you wrote.",
  takeaway:
    "Read a stack trace top-down: the first line names what broke, and the fix almost always lives at the first frame below it that points into your own project's files, not into a library or framework you didn't write. Everything else in the trace is context for how execution got there, not the culprit itself.",
};

export default content;
