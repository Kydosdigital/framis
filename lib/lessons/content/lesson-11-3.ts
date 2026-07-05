import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 3,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Cookies, sessions, and JWTs: how the server remembers you're logged in",
  minutes: 20,
  concept:
    "HTTP is stateless — every request arrives with no memory of the last one, so \"staying logged in\" has to be engineered on top of it. The classic approach is session-based auth: after login, the server creates a session record (in memory, Redis, or a database) containing the user's id, and sends the browser a random session id in a cookie; every later request includes that cookie, and the server looks up the matching session to know who's asking. The newer alternative is token-based auth, most commonly JSON Web Tokens (JWTs): instead of storing anything server-side, the server encodes the user's id and other claims directly into a signed token and hands the whole thing to the client, which sends it back on every request — the server just verifies the signature to trust the contents, with no database lookup required. That difference is the whole trade-off: sessions are easy to revoke (delete the row and the user is instantly logged out everywhere) but require server-side storage and a lookup on every request; JWTs scale beautifully across multiple servers with zero shared storage, but a JWT issued before you \"logged the user out\" is still valid and usable until it naturally expires, because there's no row to delete.",
  conceptSimpler:
    "A session is like a coat-check ticket — the numbered stub means nothing on its own, but the coat check counter has a record of exactly whose coat it points to, and can throw that record away anytime. A JWT is more like a sealed, signed ID badge — anyone who reads it can verify who issued it and what it says, but there's no front desk to revoke it early.",
  vizStages: [
    {
      label: "1. Login creates a session",
      body:
        "The server verifies the password, then creates a session record in its own storage (Redis, a sessions table, etc.) keyed by a random, unguessable id, and sends that id to the browser as a cookie.",
      code: "const sessionId = randomId();\nawait redis.set(sessionId, { userId: user.id }, { ex: 60 * 60 * 24 });\nres.cookie(\"sid\", sessionId, { httpOnly: true, secure: true });",
    },
    {
      label: "2. Every request proves who you are",
      body:
        "The browser automatically attaches the cookie to every subsequent request. The server takes that id, looks it up in storage, and finds the associated user — no password is re-sent.",
      code: "const sessionId = req.cookies.sid;\nconst session = await redis.get(sessionId);\nconst user = session ? await db.users.findById(session.userId) : null;",
    },
    {
      label: "3. A token carries its own proof",
      body:
        "With JWTs, login instead signs a payload containing the user's id and an expiry, using a secret only the server knows. The token is handed to the client and stored there — the server keeps no record of having issued it.",
      code: "const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: \"1h\" });\n// client stores this token and sends it as: Authorization: Bearer <token>",
    },
    {
      label: "4. Verifying a token needs no database at all",
      body:
        "To check a request, the server just re-verifies the signature with its secret — if it's valid and unexpired, the claims inside are trusted as-is. This is what makes JWTs attractive for APIs spread across many servers with no shared session store.",
      code: "const payload = jwt.verify(token, SECRET);\n// payload = { userId: 482, exp: 1735689600 }\n// no lookup needed — the signature IS the proof",
    },
  ],
  realWorldIntro:
    "A recurring class of real-world JWT bugs comes from implementations that trust the token's own header — including the notorious \"alg: none\" attack, where a token claiming to use no signature algorithm was accepted as valid by careless libraries, letting anyone forge arbitrary claims; it's a reminder that a token's power is only as strong as how strictly the server verifies it.",
  realWorldCode:
    "// vulnerable verification some libraries historically allowed:\nconst payload = jwt.decode(token); // decodes WITHOUT checking the signature at all\n// safe verification actually checks the signature and rejects tampered tokens:\nconst payload = jwt.verify(token, SECRET);",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare how sessions and JWTs behave for the same three situations: logging in, making a request, and logging out.",
    stages: [
      {
        label: "Session: where the truth lives",
        body:
          "The session id in the cookie is meaningless by itself — it's just a lookup key. The actual truth about who's logged in lives in server-side storage, which the server fully controls.",
        code: "// cookie sent to browser:\nsid=8f2a9c1e...\n// server-side record it points to:\n{ userId: 482, createdAt: \"2026-07-01T10:00:00Z\" }",
      },
      {
        label: "JWT: where the truth lives",
        body:
          "The JWT itself contains the claims (who the user is) plus a cryptographic signature. Anyone can read the payload (it's just base64, not encrypted), but only the server's secret can produce a signature that verifies as valid.",
        code: "// header.payload.signature, decoded payload:\n{ \"userId\": 482, \"role\": \"member\", \"exp\": 1735689600 }\n// signature proves the server issued it unmodified — it does not hide the contents",
      },
      {
        label: "Revoking access: sessions",
        body:
          "To force a logout — say, a user reports their account stolen — you delete the session record. The very next request with that cookie fails the lookup and is rejected immediately.",
        code: "await redis.del(sessionId);\n// any request using this session id from now on gets: 401 Unauthorized",
      },
      {
        label: "Revoking access: JWTs",
        body:
          "There's no row to delete — the token is self-contained and valid until it expires. Real systems work around this with short expiries plus a small server-side \"blocklist\" of revoked token ids, which brings back some of the lookup cost JWTs were meant to avoid.",
        code: "// even after you \"log the user out\" client-side, this JWT verifies as valid\n// until its exp timestamp passes, unless you check a revocation list on every request",
      },
      {
        label: "Where each is stored on the client",
        body:
          "Session cookies are typically set httpOnly, so client-side JavaScript can't read them at all, which blunts token theft via XSS. JWTs are often stored in localStorage for convenience, but that makes them directly readable by any script running on the page — including an injected malicious one.",
        code: "// session cookie: inaccessible to JS\ndocument.cookie // does not include httpOnly cookies\n\n// JWT in localStorage: fully readable by any script on the page\nlocalStorage.getItem(\"token\") // \"eyJhbGciOiJIUzI1NiIs...\"",
      },
    ],
  },
  quizQuestion:
    "A user reports their account was compromised and you need to immediately invalidate their current login, everywhere, right now. Which auth approach makes this trivial by default?",
  quizOptions: [
    {
      key: "a",
      label: "Session-based auth, because deleting the server-side session record instantly invalidates the cookie",
      correct: true,
    },
    {
      key: "b",
      label: "JWT-based auth, because the token can be recalled from the client the moment you decide to log them out",
      correct: false,
    },
    {
      key: "c",
      label: "Both are equally instant, since the server always controls whether a login is valid",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — because a session's truth lives entirely in server-side storage, deleting that one record instantly invalidates it on the very next request, no matter how many devices or tabs are using it.",
  quizFeedbackIncorrect:
    "Not quite — a JWT is self-contained and stays valid until it expires, since there's no server-side record to delete; sessions are the approach where revocation is a simple, instant delete.",
  takeaway:
    "Sessions store the truth on the server and can be revoked instantly by deleting a record; JWTs carry the truth with them and scale without lookups, but that same portability makes early revocation hard — pick based on which trade-off your app can live with.",
};

export default content;
