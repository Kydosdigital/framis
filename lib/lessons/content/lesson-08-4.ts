import type { LessonData } from "../types";

const content: LessonData = {
  num: 8,
  orderIndex: 4,
  phaseLabel: "BACKEND: PYTHON + POSTGRES",
  title: "INSERT is append, UPDATE is find-and-modify",
  minutes: 22,
  concept:
    "Writing data to a table only ever takes two basic shapes. INSERT adds a brand-new row to the table — mechanically, that's just appending a new dict to the list, with nothing existing being touched. UPDATE instead finds one or more rows that already exist, using a condition, and changes some of their fields in place — the row count stays the same, only the values inside change. The moment you need more than one write to happen together — like moving money by decreasing one account's balance and increasing another's — you need a transaction: a wrapper that says these writes either all take effect, or none of them do. Without that guarantee, a crash or error between the two writes could leave one account debited and the other never credited, silently corrupting the data; a transaction makes that half-finished state impossible.",
  conceptSimpler:
    "INSERT is like adding a brand-new index card to a box; UPDATE is like pulling an existing card out, crossing out one line, and writing a new value in its place — and a transaction is stapling two card-edits together so either both happen or neither does, no half-finished pile.",
  vizStages: [
    {
      label: "1. INSERT is just append",
      body:
        "Adding a new row means creating a new dict with every column filled in and appending it to the table's list. The rest of the table is completely untouched.",
      code:
        "accounts = [{\"id\": 1, \"name\": \"Ava\", \"balance\": 100}]\naccounts.append({\"id\": 2, \"name\": \"Ben\", \"balance\": 50})\nprint(len(accounts), \"accounts now\")",
    },
    {
      label: "2. UPDATE is find, then modify",
      body:
        "Updating means looping until you find the row matching a condition, then reassigning one of its fields directly — no new row is created, and every other row is left alone.",
      code:
        "for account in accounts:\n    if account[\"id\"] == 1:\n        account[\"balance\"] = account[\"balance\"] - 20",
    },
    {
      label: "3. Two writes, one all-or-nothing unit",
      body:
        "Moving money is really two UPDATEs — subtract from one account, add to another. If only the first one ran and the program crashed before the second, the money would just vanish. A transaction groups both writes so the database guarantees they succeed or fail together.",
      code:
        "# conceptually, inside one transaction:\n# UPDATE accounts SET balance = balance - 20 WHERE id = 1;\n# UPDATE accounts SET balance = balance + 20 WHERE id = 2;\n# both happen, or neither does",
    },
    {
      label: "4. Commit or rollback",
      body:
        "A transaction ends one of two ways: COMMIT locks in every write inside it permanently, or ROLLBACK discards every write inside it as if none of them had ever happened — there's no in-between state where only some of the writes stuck.",
      code:
        "BEGIN;\nUPDATE accounts SET balance = balance - 20 WHERE id = 1;\nUPDATE accounts SET balance = balance + 20 WHERE id = 2;\nCOMMIT;",
    },
  ],
  realWorldIntro:
    "In Postgres, INSERT INTO adds rows and UPDATE ... WHERE modifies existing ones, and wrapping several statements in BEGIN ... COMMIT — or letting a framework's ORM do it for you, like Django's atomic() or a SQLAlchemy session — is exactly how real apps protect multi-step writes like money transfers or checkout flows from ending up half-done.",
  realWorldCode:
    "BEGIN;\nUPDATE accounts SET balance = balance - 20 WHERE id = 1;\nUPDATE accounts SET balance = balance + 20 WHERE id = 2;\nCOMMIT;",
  sandbox: {
    kind: "code",
    challenge:
      "Simulate an INSERT (a new account) and two UPDATEs (moving a balance between two existing accounts) on a list-of-dicts table.",
    starterCode:
      "accounts = [{\"id\": 1, \"name\": \"Ava\", \"balance\": 100}, {\"id\": 2, \"name\": \"Ben\", \"balance\": 50}]\n\ndef insert_account(accounts, new_account):\n    accounts.append(new_account)\n    return accounts\n\ndef update_balance(accounts, account_id, amount):\n    for account in accounts:\n        if account[\"id\"] == account_id:\n            account[\"balance\"] = account[\"balance\"] + amount\n    return accounts\n\naccounts = insert_account(accounts, {\"id\": 3, \"name\": \"Cy\", \"balance\": 0})\naccounts = update_balance(accounts, 1, -20)\naccounts = update_balance(accounts, 3, 20)\n\nfor account in accounts:\n    print(account[\"name\"], account[\"balance\"])",
  },
  quizQuestion:
    "Two UPDATEs move money between accounts — subtract 20 from one, add 20 to the other. Why would a real backend wrap both in a single transaction?",
  quizCode:
    "BEGIN;\nUPDATE accounts SET balance = balance - 20 WHERE id = 1;\nUPDATE accounts SET balance = balance + 20 WHERE id = 2;\nCOMMIT;",
  quizOptions: [
    { key: "a", label: "So both UPDATEs run faster than they would separately", correct: false },
    { key: "b", label: "So either both UPDATEs take effect or neither does, even if something fails in between", correct: true },
    { key: "c", label: "So Postgres skips checking permissions on the second UPDATE", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — that's the whole point of a transaction: if the process crashes or errors out after the first UPDATE but before the second, the transaction gets rolled back and the first UPDATE is undone too, so the money is never stuck half-moved.",
  quizFeedbackIncorrect:
    "Not quite — transactions aren't about speed or permissions; they exist so that a group of writes either all succeed together or all get rolled back, which is exactly what prevents money from being deducted in one account without ever landing in the other.",
  takeaway:
    "INSERT appends a new row, UPDATE finds and modifies an existing one, and neither operation knows or cares what else is happening around it — that's precisely why transactions exist, to bundle related writes into one all-or-nothing unit instead of leaving data half-changed.",
};

export default content;
