import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 7,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Logged in isn't the same as allowed: authorization and RBAC",
  minutes: 20,
  concept:
    "Authentication answers one question: who are you? A valid session cookie or a valid JWT proves the request is really coming from a specific, logged-in user. Authorization answers a completely different question: what is that specific user allowed to do? A huge number of real security bugs come from apps that only ever ask the first question — they check \"is this user logged in\" and stop there, treating any authenticated request as automatically permitted. That's how a perfectly valid, fully logged-in \"member\" account ends up able to hit an admin-only endpoint like deleting another user, viewing someone else's private order, or promoting themselves to admin — not because their login was fake, but because nothing ever checked whether their role or permissions actually covered that action. The common fix is role-based access control (RBAC): every user is assigned a role (member, moderator, admin, and so on), and every sensitive action is gated by a check that runs after authentication — \"now that I know who you are, does your role actually permit this?\" That second check is what turns a same, valid login into either a success or a 403 Forbidden, depending entirely on what the endpoint requires. One detail makes or breaks RBAC: the role has to come from data the server itself controls — a session record or a database row looked up server-side — never from a field the client included in the request body itself, because an attacker can set any field they want in a request they send. A field like { role: \"admin\" } arriving in a POST body proves nothing except that the attacker typed it. This same never-trust-the-client instinct extends to input validation generally: even when a frontend form already checks that an email looks valid or a password is long enough, that check is a UX nicety an attacker can skip completely by calling the API directly — so the server has to independently re-validate the type, length, and format of every field it receives, treating the frontend's validation as a convenience for honest users rather than a security boundary.",
  conceptSimpler:
    "Authentication is showing your ID at the door to prove who you are; authorization is the staff then checking a list to decide which rooms you're actually allowed into. A perfectly valid ID doesn't unlock the staff-only areas by itself.",
  vizStages: [
    {
      label: "1. Authentication only answers \"who are you\"",
      body:
        "A middleware like requireAuth checks that a valid session or token exists and attaches the resulting user to the request. That's identity — it says nothing yet about what this specific user should be allowed to do.",
      code:
        "function requireAuth(req, res, next) {\n  const user = getUserFromSession(req);\n  if (!user) return res.status(401).send(\"Not logged in\");\n  req.user = user;\n  next();\n}\n// user is now KNOWN — but not yet checked against what they're trying to do",
    },
    {
      label: "2. A valid login can still be the wrong login for this action",
      body:
        "Amy is completely, legitimately logged in. But this endpoint only checks requireAuth — it never asks whether Amy's role permits deleting a user account. Any authenticated user, admin or not, can call it.",
      code:
        "// req.user = { id: 12, email: \"amy@example.com\", role: \"member\" }\napp.delete(\"/api/users/:id\", requireAuth, (req, res) => {\n  deleteUser(req.params.id); // runs for ANY logged-in user\n});\n// Amy is 100% legitimately logged in — and can still delete anyone's account",
    },
    {
      label: "3. Authorization adds the second check",
      body:
        "requireRole runs after requireAuth and blocks the action unless the user's role grants it. Same identity as before, different outcome, because now the endpoint actually checks what that identity is permitted to do.",
      code:
        "function requireRole(role) {\n  return (req, res, next) => {\n    if (req.user.role !== role) return res.status(403).send(\"Forbidden\");\n    next();\n  };\n}\n\napp.delete(\"/api/users/:id\", requireAuth, requireRole(\"admin\"), (req, res) => {\n  deleteUser(req.params.id);\n});\n// now Amy (role: \"member\") gets 403 Forbidden — same valid login, blocked action",
    },
    {
      label: "4. Never trust a role the client claims to have",
      body:
        "The role used for an authorization check must come from the server's own trusted record — never from a field inside the request body, which an attacker can set to anything they like.",
      code:
        "// vulnerable: trusts a role the client itself sent in the request body\napp.post(\"/api/promote\", requireAuth, (req, res) => {\n  if (req.body.role === \"admin\") grantAdmin(req.user.id); // attacker just sends { role: \"admin\" }\n});\n\n// safe: role comes only from req.user, which was loaded server-side from the DB\napp.post(\"/api/promote\", requireAuth, requireRole(\"admin\"), (req, res) => {\n  grantAdmin(req.body.targetUserId);\n});",
    },
  ],
  realWorldIntro:
    "When OWASP re-ranked its Top 10 web vulnerabilities in 2021 using real incident data instead of expert opinion alone, Broken Access Control jumped all the way to #1, ahead of every injection-based category — the data showed that missing or incomplete authorization checks, not weak authentication, were the most commonly exploited flaw in real applications. That's exactly the \"logged in, but not supposed to be here\" bug this lesson is about.",
  realWorldCode:
    "// IDOR (Insecure Direct Object Reference): authenticated, but no ownership check\napp.get(\"/api/orders/:id\", requireAuth, (req, res) => {\n  res.json(getOrder(req.params.id)); // any logged-in user can read ANY order by guessing ids\n});\n\n// fixed: authorization narrows access to resources this user actually owns\napp.get(\"/api/orders/:id\", requireAuth, (req, res) => {\n  const order = getOrder(req.params.id);\n  if (order.userId !== req.user.id) return res.status(403).send(\"Forbidden\");\n  res.json(order);\n});",
  sandbox: {
    kind: "code",
    challenge:
      "Run this role-based authorization check for a few different users and actions. Notice that being a valid, logged-in user (having a user object at all) is never enough on its own — what matters is whether that user's specific role permits the specific action being attempted.",
    starterCode:
      'permissions = {"member": ["read"], "moderator": ["read", "edit"], "admin": ["read", "edit", "delete"]}\n\ndef is_authorized(user, action):\n    if user == None:\n        return False\n    role = user["role"]\n    allowed_actions = permissions[role]\n    for allowed in allowed_actions:\n        if allowed == action:\n            return True\n    return False\n\namy = {"name": "Amy", "role": "member"}\njordan = {"name": "Jordan", "role": "admin"}\n\nprint("Amy tries to read:", is_authorized(amy, "read"))\nprint("Amy tries to delete:", is_authorized(amy, "delete"))\nprint("Jordan tries to delete:", is_authorized(jordan, "delete"))\nprint("A logged-out visitor tries to read:", is_authorized(None, "read"))',
  },
  quizQuestion:
    "This endpoint requires a valid session before running. A regular \"member\" user, fully logged in with a completely valid session, sends a DELETE request and it succeeds. What's the bug?",
  quizCode:
    'app.delete("/api/users/:id", requireAuth, (req, res) => {\n  deleteUser(req.params.id);\n});\n// req.user = { id: 12, role: "member" } — a completely valid, logged-in session',
  quizOptions: [
    {
      key: "a",
      label: "There's no bug — since the user is authenticated, they're allowed to perform any action the API exposes",
      correct: false,
    },
    {
      key: "b",
      label: "requireAuth only checks authentication (who you are); there's no authorization check confirming the user's role actually permits deleting other accounts",
      correct: true,
    },
    {
      key: "c",
      label: "The real bug is that this endpoint uses sessions instead of JWTs, which are the only auth method that supports role checks",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — requireAuth proves identity, but nothing here checks whether that identity's role is allowed to delete users. Authentication and authorization are two separate checks, and skipping the second one is exactly the kind of bug that lets any logged-in user perform admin-level actions.",
  quizFeedbackIncorrect:
    "Not quite — the missing piece is an authorization check like requireRole(\"admin\") added after requireAuth. Being logged in (authenticated) never implies you're allowed to perform a given action (authorized) — those are two separate questions the code has to ask separately, and the auth mechanism (session or JWT) has nothing to do with it.",
  takeaway:
    "Authentication answers \"who are you\"; authorization answers \"what are you allowed to do\" — and a system is only secure once it checks both, on every sensitive action, using role or permission data the server itself controls rather than anything the client claims. Pair that with server-side input validation on every field you receive: a frontend check is a convenience for honest users, never a security boundary, since anyone can call your API directly and skip it entirely.",
};

export default content;
