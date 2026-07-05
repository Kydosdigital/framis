import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 2,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "One quote breaks everything: SQL injection and string concatenation",
  minutes: 20,
  concept:
    "SQL injection happens when you build a database query by gluing user input directly into a string instead of treating it as data. If your code writes \"SELECT * FROM users WHERE username = '\" + username + \"'\", the database can't tell the difference between the username you meant to insert and actual SQL commands hidden inside it. An attacker who types something like ' OR '1'='1 as their username turns your intended query into one that's always true, and one who types '; DROP TABLE users; -- can append an entirely new command that deletes your data. The fix is to never build queries by concatenating strings at all — instead you use parameterized queries (also called prepared statements), where the query structure is sent to the database separately from the values, so user input is always treated as a literal value and never as executable SQL, no matter what characters it contains. Every mainstream database driver and ORM (pg, Prisma, Sequelize, Knex) supports this natively — there is essentially never a good reason to hand-build a SQL string from user input.",
  conceptSimpler:
    "Concatenating user input into SQL is like faxing someone a form letter where the reader typed their own paragraph into the middle of your instructions — if they're clever, their paragraph can rewrite what the rest of the letter says to do.",
  vizStages: [
    {
      label: "1. A normal, well-behaved login",
      body:
        "Your app builds a query by inserting the username someone typed into a template string. For an honest username like \"amy\", this works exactly as intended.",
      code: "const username = \"amy\";\nconst query = \"SELECT * FROM users WHERE username = '\" + username + \"'\";\n// query = SELECT * FROM users WHERE username = 'amy'",
    },
    {
      label: "2. An attacker changes the shape of the input",
      body:
        "Instead of a name, the attacker submits text containing a stray quote and SQL syntax. Your concatenation code has no idea this input is \"special\" — it just glues it in like any other string.",
      code: "const username = \"' OR '1'='1\";\nconst query = \"SELECT * FROM users WHERE username = '\" + username + \"'\";",
    },
    {
      label: "3. The database sees a different query entirely",
      body:
        "Once concatenated, the extra quote closes the string early and '1'='1' adds a condition that's always true — so the WHERE clause matches every row in the table, not just one user.",
      code: "// query is now:\nSELECT * FROM users WHERE username = '' OR '1'='1'\n// returns EVERY user — often the app just logs in as the first row",
    },
    {
      label: "4. Parameterized queries close the door",
      body:
        "A parameterized query sends the SQL structure and the user's value as two separate things. The database driver treats the placeholder as a literal value no matter what's inside it — quotes, semicolons, whole SQL statements — none of it is ever interpreted as code.",
      code: "const query = \"SELECT * FROM users WHERE username = $1\";\nawait db.query(query, [username]);\n// even username = \"' OR '1'='1\" is matched literally — zero rows returned",
    },
  ],
  realWorldIntro:
    "In the 2015 TalkTalk breach, attackers used a SQL injection vulnerability in a legacy webpage to pull personal data on hundreds of thousands of customers, costing the UK telecom a record regulatory fine at the time — years after SQL injection had already been a well-known, well-solved problem, the app just hadn't been fixed.",
  realWorldCode:
    "// the vulnerable pattern behind countless breaches:\nconst query = \"SELECT * FROM accounts WHERE id = \" + req.params.id;\n// req.params.id = \"1; DROP TABLE accounts; --\" is catastrophic if this ever runs",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how the same input is handled by a vulnerable, concatenated query versus a safe, parameterized one.",
    stages: [
      {
        label: "Vulnerable: string concatenation",
        body:
          "The query is assembled by joining strings together. Whatever the user typed becomes a literal part of the SQL text the database executes — there's no boundary between \"code\" and \"data.\"",
        code: "const query = \"SELECT * FROM users WHERE email = '\" + email + \"' AND password = '\" + password + \"'\";",
      },
      {
        label: "Classic auth-bypass payload",
        body:
          "Typing admin@example.com'-- as the email comments out the rest of the query, including the password check entirely — the attacker logs in as admin without knowing the password.",
        code: "email = \"admin@example.com'--\"\n// resulting query:\nSELECT * FROM users WHERE email = 'admin@example.com'--' AND password = ''\n// everything after -- is a SQL comment and is ignored",
      },
      {
        label: "Data exfiltration with UNION",
        body:
          "Injection isn't only about bypassing logins — a UNION SELECT payload can append a second query that pulls data from a completely different table, like a passwords or credit_cards table the input field was never meant to touch.",
        code: "email = \"x' UNION SELECT card_number, cvv FROM credit_cards --\"\n// the app's search results page now silently displays stolen card data",
      },
      {
        label: "Destructive payload",
        body:
          "Some database drivers allow \"stacked\" queries, where a semicolon starts a brand-new statement. That turns a simple lookup field into a way to modify or destroy data outright.",
        code: "id = \"7; DROP TABLE orders; --\"\n// resulting query:\nSELECT * FROM orders WHERE id = 7; DROP TABLE orders; --",
      },
      {
        label: "Safe: parameterized query",
        body:
          "The placeholder ($1, $2, or ? depending on the library) is filled in by the database driver itself, after the query plan is already fixed. The user's text is bound as a value, never spliced into the SQL — so quotes, semicolons, and comment markers all lose their special meaning.",
        code: "const query = \"SELECT * FROM users WHERE email = $1 AND password_hash = $2\";\nawait db.query(query, [email, passwordHash]);\n// any of the payloads above just fail to match a row — no exploit possible",
      },
    ],
  },
  quizQuestion:
    "A login form builds its query like this. What's the safest fix, and why?",
  quizCode:
    "const query = \"SELECT * FROM users WHERE username = '\" + username + \"'\";\ndb.raw(query);",
  quizOptions: [
    {
      key: "a",
      label: "Strip out single quote characters from the username before concatenating it",
      correct: false,
    },
    {
      key: "b",
      label: "Switch to a parameterized query so the value is bound separately from the SQL structure",
      correct: true,
    },
    {
      key: "c",
      label: "Keep concatenation but only allow it on the login page, since that's the highest-risk query",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — parameterized queries eliminate the entire class of attack by never letting user input be interpreted as SQL syntax, regardless of what characters it contains.",
  quizFeedbackIncorrect:
    "Not quite — blocklisting characters like quotes is a losing game (attackers find encodings and edge cases you didn't block), and every concatenated query is equally exploitable, not just the login one; parameterized queries are the only reliable fix.",
  takeaway:
    "Never build a SQL query by gluing strings together — use parameterized queries so user input is always treated as a value, never as code the database might execute.",
};

export default content;
