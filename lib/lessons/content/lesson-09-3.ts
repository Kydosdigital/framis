import type { LessonData } from "../types";

const content: LessonData = {
  num: 9,
  orderIndex: 3,
  phaseLabel: "TESTING (UNIT/INTEGRATION/E2E)",
  title: "Fixtures and Mocks: Faking What a Test Shouldn't Need",
  minutes: 22,
  concept:
    "Real functions rarely operate on bare numbers — they work on a user account, a shopping cart, or a document, and testing them means first building that starting data. If ten different tests each need a sample user account, copying the same few lines of setup into every single test is repetitive, and the moment that shape changes — a new required field, say — you have to hunt down and fix it in ten places. A fixture solves this by moving that setup into its own function, written once, that any test can call to get a ready-made piece of test data. Crucially, a fixture has to build a brand-new copy every time it's called, not hand out one shared object — if two tests fought over the same object, a change one test makes would leak into the next test and make results depend on the order the tests happened to run in. So a good fixture is really just an ordinary function that constructs and returns fresh data, called at the start of every test that needs it.\n\nA fixture fakes the data a function starts with. Mocking fakes a dependency a function reaches out to while it runs. Say get_welcome_message(user_id) needs the user's name, so it calls get_user_from_db(user_id) — a function that, in a real app, opens a network connection and runs a SQL query against an actual database. Testing get_welcome_message shouldn't require a real, running, seeded database just to check one line of string formatting — that's slow, and it can fail for reasons that have nothing to do with get_welcome_message, like the network hiccuping. Mocking solves this by defining a fake get_user_from_db for the test that skips the database entirely and just returns a fixed, made-up user immediately. get_welcome_message calls it exactly the same way either way and has no idea the real database was never touched — but now the test runs instantly, needs no real infrastructure, and can't fail because of some unrelated outage.",
  conceptSimpler:
    "A fixture is a recipe card for a test's starting ingredients — you follow it fresh for every dish instead of ladling out of one shared pot that every test's spoon has already been in. A mock is a stunt double: the scene calls for a real database, but a stand-in that says the right lines is faster and safer than doing the real stunt on every single take.",
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
    {
      label: "5. A function that depends on a real database",
      body:
        "get_welcome_message needs a user's name, so it calls get_user_from_db(user_id). In a real app that function opens a connection and runs a query — infrastructure a test shouldn't need just to check a greeting string.",
      code:
        "def get_user_from_db(user_id):\n    # in a real app: opens a connection, runs a SQL query, returns a row\n    ...\n\ndef get_welcome_message(user_id):\n    user = get_user_from_db(user_id)\n    return f\"Welcome back, {user['name']}\"",
    },
    {
      label: "6. Mock it: swap in a fake for the test",
      body:
        "For the test, define a version of get_user_from_db that returns a fixed fake user instead of touching a database. get_welcome_message calls it exactly the same way as before — it has no way of knowing it's not real.",
      code:
        'def get_user_from_db(user_id):\n    return {"id": user_id, "name": "Alex", "verified": True}\n\nmessage = get_welcome_message(42)\nassert message == "Welcome back, Alex", "should greet the mocked user by name"\nprint(message)\n# no real database was ever opened, queried, or even reachable',
    },
  ],
  realWorldIntro:
    "Testing frameworks like pytest have fixtures built in — the @pytest.fixture decorator marks a setup function that pytest automatically re-runs fresh before every test that asks for it. For mocking, Python's built-in unittest.mock (or pytest's own monkeypatch fixture) swaps a real function or object out for a fake one for the duration of a single test, then automatically puts the original back afterward.",
  realWorldCode:
    '# tests/test_users.py\nimport pytest\n\n@pytest.fixture\ndef test_user():\n    return {"name": "Alex", "age": 30, "verified": True}\n\ndef test_default_age(test_user):\n    assert test_user["age"] == 30\n\ndef test_can_update_age(test_user):\n    test_user["age"] = 31\n    assert test_user["age"] == 31\n# pytest calls test_user() fresh for each test function above\n\n# tests/test_welcome.py\ndef test_welcome_message_uses_mocked_user(monkeypatch):\n    def fake_get_user_from_db(user_id):\n        return {"id": user_id, "name": "Alex", "verified": True}\n\n    monkeypatch.setattr("app.db.get_user_from_db", fake_get_user_from_db)\n    assert get_welcome_message(42) == "Welcome back, Alex"\n    # no real database connection was ever made',
  sandbox: {
    kind: "code",
    challenge:
      "get_welcome_message is being tested with a mocked get_user_from_db, but the mock's fake user doesn't match the shape the real function is supposed to return, causing a KeyError. Fix the mock's dict so it has the right key, without changing get_welcome_message itself.",
    starterCode:
      'def get_user_from_db(user_id):\n    return {"id": user_id, "username": "Alex", "verified": True}\n\ndef get_welcome_message(user_id):\n    user = get_user_from_db(user_id)\n    return f"Welcome back, {user[\'name\']}"\n\nmessage = get_welcome_message(42)\nassert message == "Welcome back, Alex", "should greet the mocked user by name"\nprint(message)',
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
    "A fixture removes repeated setup by moving it into one function, but it only works if that function is called fresh for every test. Hand out a shared object instead, and one test's changes silently become another test's wrong starting point. Mocking takes the same idea further: instead of faking a function's starting data, you fake a whole dependency — a database call, an API call — so a test can run fast and deterministically without any real infrastructure behind it, as long as the fake matches the shape the real thing would have returned.",
};

export default content;
