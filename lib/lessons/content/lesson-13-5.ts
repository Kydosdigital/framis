import type { LessonData } from "../types";

const content: LessonData = {
  num: 13,
  orderIndex: 5,
  phaseLabel: "TESTING (UNIT/INTEGRATION/E2E)",
  title: "The Last Mile: Test Coverage and Real End-to-End Tests",
  minutes: 24,
  concept:
    "Every test so far has checked one function, or a couple of functions wired together, but a whole project might have thousands of lines of code. Test coverage is the metric that answers a different question: of all the lines in the codebase, how many of them actually ran while the test suite executed? A coverage tool like pytest-cov instruments the code, watches which lines run during a test session, and reports a percentage — 80% coverage means 80 out of every 100 measured lines were touched by at least one test, while the other 20% never ran at all. That number is a useful floor, not a ceiling: a line the tests happened to execute but never actually checked the result of — say, a test that calls a function and just prints the answer instead of asserting on it — still counts as \"covered,\" even though it proves nothing. So 100% coverage is not the same claim as 100% correctness. What coverage is genuinely good at is catching the opposite failure: if a module sits at 12% coverage, that means 88% of its logic has never once run during any test, which means whole branches, error paths, and edge cases could be silently broken right now and nothing would tell you.\n\nCoverage also can't answer whether the finished application actually works for a real user, because unit and integration tests never touch the real running app at all — they call functions directly, in-process, with no server started and no page rendered. An end-to-end (e2e) test closes that gap by driving the actual running application through its real interface, the same way a user would: a real browser opens a real page, clicks a real button, and types into a real input field, and the test asserts on what actually appears on screen afterward. Tools like Playwright and Cypress are built specifically for this — they launch a real (often invisible, \"headless\") browser, script it to interact with your app, and let you assert against the rendered page. That's a fundamentally different claim than a unit test can make: a unit test proves create_account(email) returns the right dictionary, but only an e2e test proves that loading the actual signup page, typing a real email into the real input, and clicking the real submit button genuinely results in a welcome message showing up on screen — exercising the server, the database, the frontend, and every network call between them, together, exactly as a real user would experience it.",
  conceptSimpler:
    "Coverage is a highlighter dragged across every line the tests actually ran — a mostly blank page is a real red flag, but a fully highlighted page still doesn't prove any of it was checked carefully. An end-to-end test is the difference between inspecting a car's engine on a workbench and actually turning the key, backing out of the driveway, and driving it around the block.",
  vizStages: [
    {
      label: "1. What a coverage report actually measures",
      body:
        "A coverage tool watches which lines execute while the test suite runs, then reports the percentage that were touched at least once, file by file.",
      code:
        "$ pytest --cov=app tests/\n---------- coverage: platform linux ----------\nName              Stmts   Miss  Cover\n-------------------------------------\napp/pricing.py       40      8    80%\napp/shipping.py      25     25     0%\n-------------------------------------\nTOTAL                65     33    49%",
    },
    {
      label: "2. Covered isn't the same as checked",
      body:
        "A line counts as \"covered\" the moment any test runs it — even if that test never actually checks the result. A test that calls calculate_total and just prints the answer covers that line while proving nothing about whether the answer is correct.",
      code:
        "def test_calculate_total_runs():\n    result = calculate_total(25, 3)\n    print(result)\n    # no assert at all — this line is now \"covered\",\n    # but the test can never fail, no matter what result comes back",
    },
    {
      label: "3. So 100% coverage can still ship a bug",
      body:
        "Coverage only asks whether a line ran, never whether a test checked it thoroughly. A broken function can be fully executed by a test that forgets to assert on its output, and coverage will report a perfect number anyway.",
      code:
        "# apply_discount runs at 100% coverage...\ndef apply_discount(price, percent):\n    return price - percent  # bug: skips the percentage math entirely\n\ndef test_apply_discount_runs():\n    apply_discount(200, 10)  # this line executes, so it's \"covered\"...\n    # ...but nothing here asserted the result should be 180",
    },
    {
      label: "4. Very low coverage is the loudest red flag",
      body:
        "app/shipping.py sitting at 0% coverage doesn't mean it's bug-free — it means not one line of it has ever been exercised by any test, so any bug already sitting in there, however obvious, sails straight through CI completely undetected.",
      code:
        "app/shipping.py     25     25     0%\n# every branch and edge case in this file is completely unverified",
    },
  ],
  realWorldIntro:
    "Most real CI pipelines run pytest --cov and fail the build if coverage drops below a set threshold like 80%, treating a coverage regression almost as seriously as a failing test — because a shrinking number usually means new code just shipped with no tests behind it at all.",
  realWorldCode:
    "# .github/workflows/ci.yml\n# - run: pytest --cov=app --cov-fail-under=80 tests/\n#   (the build fails if coverage drops below 80%, even when every test passes)",
  sandbox: {
    kind: "explore",
    instructions:
      "Step through what actually changes when the exact same signup feature is tested at the unit level versus tested end-to-end.",
    stages: [
      {
        label: "The feature: user signup",
        body:
          "A signup page has an email field and a submit button. Behind the scenes, clicking submit calls create_account(email), which is supposed to result in a welcome message appearing on the page.",
        code:
          "def create_account(email):\n    # saves a new user record\n    return {\"email\": email, \"status\": \"created\"}",
      },
      {
        label: "The unit-level version of this test",
        body:
          "A unit test calls create_account(\"new@user.com\") directly and checks the dictionary it returns. It never opens a browser, never loads the signup page, and never clicks anything — it's fast, but it can't prove a real user actually sees a welcome message.",
        code:
          "def test_create_account_returns_created_status():\n    result = create_account(\"new@user.com\")\n    assert result[\"status\"] == \"created\"",
      },
      {
        label: "What makes a test end-to-end",
        body:
          "An end-to-end (e2e) test drives the real, running application through its real interface instead of calling a function directly — a real browser loads the real page and interacts with it the way an actual user would, and the test asserts on what actually renders on screen.",
        code:
          "e2e test steps:\n1. open a real (often headless) browser\n2. navigate to https://app.example.com/signup\n3. type \"new@user.com\" into the email input\n4. click the \"Sign Up\" button\n5. wait for the page to update\n6. assert the text \"Welcome!\" appears somewhere on the page",
      },
      {
        label: "The real tools: Playwright and Cypress",
        body:
          "Playwright and Cypress are the two tools most web teams reach for to write exactly this kind of test — both launch a browser, script clicks and typing, and let you assert against the rendered page, from a script you write once and run automatically in CI.",
        code:
          "// signup.spec.ts (Playwright)\ntest(\"signup shows a welcome message\", async ({ page }) => {\n  await page.goto(\"https://app.example.com/signup\");\n  await page.fill(\"#email\", \"new@user.com\");\n  await page.click(\"text=Sign Up\");\n  await expect(page.locator(\"text=Welcome!\")).toBeVisible();\n});",
      },
      {
        label: "Same feature, two very different guarantees",
        body:
          "The unit test proves create_account returns the right dictionary, in milliseconds. The e2e test proves the whole system — frontend, server, database, and the wiring between them — actually shows a real user a welcome message after a real signup. Neither replaces the other.",
        code:
          "unit test:  create_account(\"new@user.com\")[\"status\"] == \"created\"   (milliseconds, logic only)\ne2e test:   load page -> type email -> click submit -> \"Welcome!\" visible   (seconds, whole app)",
      },
    ],
  },
  quizQuestion:
    "A team's unit tests all pass, including one that calls create_account(\"new@user.com\") directly and checks that it returns {\"status\": \"created\"}. But real users report that after signing up on the actual website, the page just hangs with no welcome message ever appearing. What kind of test would have caught this, and why didn't the unit test?",
  quizOptions: [
    {
      key: "a",
      label:
        "An end-to-end test, because it drives a real browser through the real signup page and interface, exercising the frontend rendering and wiring that a unit test — which only calls create_account directly — never touches at all",
      correct: true,
    },
    {
      key: "b",
      label:
        "A second unit test with a different email address would have caught it, since unit tests can verify literally everything about an application as long as you write enough of them",
      correct: false,
    },
    {
      key: "c",
      label:
        "Nothing could have caught this in advance — a hanging page after signup isn't something any automated test is able to detect",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — the unit test only proves create_account returns the correct dictionary; it never opens a browser or renders the signup page, so it can't catch a bug in the frontend. An e2e test built with something like Playwright or Cypress drives the actual page — loading it, typing the email, clicking submit — and would have caught the missing welcome message immediately.",
  quizFeedbackIncorrect:
    "Not quite — more unit tests with different inputs still never touch the real page or a real browser, so they can't catch a frontend rendering bug, and this is exactly the kind of bug an e2e test (using a tool like Playwright or Cypress) is built to catch, by driving a real browser through the real signup flow.",
  takeaway:
    "Coverage tells you how much of your code the test suite actually exercises — a useful floor (very low coverage is a genuine red flag) but never proof of correctness on its own, since a line can run without ever being properly checked. End-to-end tests close the gap unit and integration tests can't: by driving the real, running app through its real interface with a tool like Playwright or Cypress, they're the only kind of test that proves the whole system actually works the way a real user experiences it.",
};

export default content;
