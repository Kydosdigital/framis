import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 3,
  phaseLabel: "TESTING",
  title: "Same Setup, Every Time: Building a Test Fixture",
  minutes: 20,
  concept:
    "Real functions rarely operate on bare numbers — they work on a user account, a shopping cart, or a document, and testing them means first building that starting data. If ten different tests each need a sample user account, copying the same few lines of setup into every single test is repetitive, and the moment that shape changes — a new required field, say — you have to hunt down and fix it in ten places. A fixture solves this by moving that setup into its own function, written once, that any test can call to get a ready-made piece of test data. Crucially, a fixture has to build a brand-new copy every time it's called, not hand out one shared object — if two tests fought over the same object, a change one test makes would leak into the next test and make results depend on the order the tests happened to run in. So a good fixture is really just an ordinary function that constructs and returns fresh data, called at the start of every test that needs it.",
  conceptSimpler:
    "A fixture is a recipe card for a test's starting ingredients — you follow it fresh for every dish instead of ladling out of one shared pot that every test's spoon has already been in.",
  vizStages: [
    {
      label: "1. The repeated setup problem",
      body:
        "Two tests both need a sample user account, so both build one from scratch. It's only three lines, but copy it into ten tests and one small change to the user's shape means editing all ten.",
      code:
        'test1_user = {"name": "Alex", "age": 30, "verified": True}\nassert test1_user["age"] == 30\n\ntest2_user = {"name": "Alex", "age": 30, "verified": True}\ntest2_user["age"] = 31\nassert test2_user["age"] == 31',
    },
    {
      label: "2. Extract the setup into a fixture",
      body:
        "Instead of repeating those lines, wrap them in a function that builds and returns a fresh user account. Now the setup lives in exactly one place.",
      code:
        'def make_test_user():\n    user = {"name": "Alex", "age": 30, "verified": True}\n    return user',
    },
    {
      label: "3. Call it fresh, once per test",
      body:
        "Each test calls make_test_user() to get its own account, and can change it however it needs to without worrying about any other test.",
      code:
        'user1 = make_test_user()\nassert user1["age"] == 30\n\nuser2 = make_test_user()\nuser2["age"] = 31\nassert user2["age"] == 31',
    },
    {
      label: "4. Why it has to be fresh, not shared",
      body:
        "If a test grabs the same already-built object instead of calling the fixture again, another test's changes are still sitting on it. The fixture function itself was never broken — reusing its output instead of recalling it was.",
      code:
        'shared_user = make_test_user()\n\nuser1 = shared_user\nuser1["age"] = 31\n\nuser2 = shared_user\nassert user2["age"] == 30\n# AssertionError: user2["age"] is 31, not 30 — user1 and user2\n# are literally the same object, so user1\'s change leaked in',
    },
  ],
  realWorldIntro:
    "Testing frameworks like pytest have fixtures built in — the @pytest.fixture decorator marks a setup function that pytest automatically re-runs fresh before every test that asks for it, so nobody has to remember to call it by hand.",
  realWorldCode:
    '# tests/test_users.py\nimport pytest\n\n@pytest.fixture\ndef test_user():\n    return {"name": "Alex", "age": 30, "verified": True}\n\ndef test_default_age(test_user):\n    assert test_user["age"] == 30\n\ndef test_can_update_age(test_user):\n    test_user["age"] = 31\n    assert test_user["age"] == 31\n# pytest calls test_user() fresh for each test function above',
  sandbox: {
    kind: "code",
    challenge:
      "Fix the test below so user2 gets a completely fresh account from the fixture instead of reusing user1's already-modified object.",
    starterCode:
      'def make_test_user():\n    user = {"name": "Alex", "age": 30, "verified": True}\n    return user\n\nshared_user = make_test_user()\n\nuser1 = shared_user\nuser1["age"] = 31\nassert user1["age"] == 31, "user1 should be able to update its own age to 31"\n\nuser2 = shared_user\nassert user2["age"] == 30, "user2 should start fresh at age 30, untouched by user1\'s change"\n\nprint("Fixture isolation test passed:", user1["age"], user2["age"])',
  },
  quizQuestion:
    "Why must a fixture function return a brand-new object every time it's called, rather than one shared object reused across tests?",
  quizCode:
    'shared_user = make_test_user()\nuser1 = shared_user\nuser1["age"] = 31\nuser2 = shared_user\nassert user2["age"] == 30  # fails — user2 is the same object as user1',
  quizOptions: [
    {
      key: "a",
      label:
        "So mutations one test makes can't leak into another test's starting data and make results depend on the order tests happen to run in",
      correct: true,
    },
    {
      key: "b",
      label:
        "Because a function is only allowed to return a given dict value one time before it must build a different one",
      correct: false,
    },
    {
      key: "c",
      label:
        "Because a test file is only allowed to define a single fixture function per file",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — when two tests share the exact same object, one test's edits are still sitting there when the next test runs, so the fresh-copy-per-call is what keeps tests independent of each other and of run order.",
  quizFeedbackIncorrect:
    "Not quite — there's no such restriction on functions or files; the real reason is isolation: a shared object lets one test's mutations bleed into the next, which is exactly what a fixture is supposed to prevent.",
  takeaway:
    "A fixture removes repeated setup by moving it into one function, but it only works if that function is called fresh for every test. Hand out a shared object instead, and one test's changes silently become another test's wrong starting point.",
};

export default content;
