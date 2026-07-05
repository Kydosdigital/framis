import type { LessonData } from "../types";

const content: LessonData = {
  num: 15,
  orderIndex: 4,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Why the padlock matters: HTTPS and the case against plaintext requests",
  minutes: 18,
  concept:
    "Plain HTTP sends every request and response as readable plaintext across the network — anyone positioned between your browser and the server (a shared WiFi network, a compromised router, an ISP) can read exactly what you sent, including form fields, cookies, and session tokens, and can even modify it in transit. HTTPS fixes this by wrapping HTTP inside TLS (Transport Layer Security), which does two things before a single byte of your actual request is sent: it verifies the server's identity using a certificate signed by a trusted certificate authority, and it negotiates an encryption key that only your browser and that server know. From that point on, everything exchanged is ciphertext to anyone watching the wire — an eavesdropper sees scrambled bytes instead of your password, your session cookie, or the page content itself. This matters for every request, not just login forms, because a session cookie sniffed from any single unencrypted request is enough to hijack the entire logged-in session, and because a network attacker can inject or alter content in an unencrypted response before it ever reaches your browser. Modern servers reinforce this with HSTS (HTTP Strict Transport Security), a header that tells browsers \"never even attempt plain HTTP with this domain again,\" closing the gap where a first request might slip through unencrypted.",
  conceptSimpler:
    "HTTP is like mailing a postcard — anyone who handles it along the way can read every word. HTTPS is like sealing that same message in a tamper-evident envelope that only the intended recipient can open, and that visibly shows if anyone tried to open it in transit.",
  vizStages: [
    {
      label: "1. A request over plain HTTP",
      body:
        "The browser sends the request exactly as written — headers, cookies, and body all travel as readable text across every network hop between you and the server.",
      code: "GET /account HTTP/1.1\nHost: framis.dev\nCookie: sid=8f2a9c1e7b4d...\n\n// visible in full to anyone on the network path",
    },
    {
      label: "2. Anyone on the path can read it",
      body:
        "On a shared network — coffee shop WiFi, an airport hotspot, a compromised link — a packet sniffer captures this traffic in full. The session cookie alone is enough to impersonate the logged-in user without ever needing a password.",
      code: "// attacker's packet capture:\nGET /account HTTP/1.1\nCookie: sid=8f2a9c1e7b4d...\n// attacker copies this cookie into their own browser -> instantly logged in as the victim",
    },
    {
      label: "3. TLS negotiates a private channel first",
      body:
        "Before any HTTP data is sent, the browser and server perform a TLS handshake: the server presents a certificate proving its identity, and both sides agree on an encryption key that never travels across the network in the clear.",
      code: "Client Hello  ->\n             <- Server Hello + Certificate\nKey exchange completes; both sides now share a secret key\n// only after this handshake does the actual HTTP request get sent",
    },
    {
      label: "4. The same request, now unreadable in transit",
      body:
        "Once TLS is established, the identical HTTP request is encrypted before it leaves the browser. An eavesdropper on the exact same network sees only ciphertext — the cookie, the URL path, and the body are all unreadable without the negotiated key.",
      code: "// what the attacker's packet capture shows instead:\n17 03 03 00 a4 3f 8e 2c d1 90 7b ... (encrypted bytes)\n// the cookie and request contents are cryptographically hidden",
    },
  ],
  realWorldIntro:
    "In 2010, a tool called Firesheep made this concrete for millions of people: it sat on public WiFi and hijacked Facebook and Twitter sessions in one click, because those sites encrypted the login page but served everything afterward over plain HTTP, leaving session cookies exposed on every subsequent request — the incident is widely credited with pushing the industry toward \"HTTPS everywhere\" instead of encrypting only the login form.",
  realWorldCode:
    "// the mistake Firesheep exploited:\napp.post(\"/login\", https, handleLogin);       // encrypted\napp.get(\"/timeline\", http, showTimeline);      // NOT encrypted — cookie leaks here too",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare what an attacker sitting on the same network sees under HTTP versus HTTPS, and what HSTS adds on top.",
    stages: [
      {
        label: "HTTP: the request in the clear",
        body:
          "Every header and cookie is sent as plain text. A packet sniffer on the same WiFi network, or a malicious router, reads the entire request without needing to break any encryption at all.",
        code: "GET /dashboard HTTP/1.1\nHost: framis.dev\nCookie: sid=8f2a9c1e7b4d...\nAuthorization: Bearer eyJhbGciOi...",
      },
      {
        label: "HTTPS: the request encrypted",
        body:
          "The same request is wrapped in TLS before it leaves the device. The attacker still sees packets flowing across the network, but the contents are ciphertext — undecipherable without the session key negotiated during the handshake.",
        code: "// wire capture of an HTTPS request:\n\\x17\\x03\\x03\\x00\\x9a\\x2f\\xc1\\x8e...\n// cookie, headers, and body are all inside this encrypted blob",
      },
      {
        label: "Certificate validation stops impersonation",
        body:
          "TLS isn't only about encryption — the certificate proves you're actually talking to framis.dev and not an attacker's server pretending to be it. A mismatched or expired certificate triggers a browser warning instead of silently connecting.",
        code: "// browser checks:\n// 1. Is this certificate signed by a trusted CA?\n// 2. Does it match the domain \"framis.dev\"?\n// 3. Has it expired?\n// any failure -> \"Your connection is not private\" warning, page blocked by default",
      },
      {
        label: "The gap HSTS closes",
        body:
          "Without HSTS, a user's very first visit (or a link typed as http://) can go out over plain HTTP for a moment before any redirect to HTTPS happens — and that single unencrypted request is enough to leak a cookie. HSTS tells the browser to never attempt plain HTTP for this domain again, for a set period of time.",
        code: "Strict-Transport-Security: max-age=63072000; includeSubDomains\n// browser now rewrites http://framis.dev requests to https:// BEFORE sending anything over the network",
      },
    ],
  },
  quizQuestion:
    "A site encrypts its login form with HTTPS but serves the rest of the logged-in app over plain HTTP. What's the actual risk?",
  quizCode:
    "app.post(\"/login\", requireHttps, handleLogin);\napp.get(\"/feed\", handleFeed); // no HTTPS enforced here",
  quizOptions: [
    {
      key: "a",
      label: "None — the password was already protected during login, which is the only sensitive data",
      correct: false,
    },
    {
      key: "b",
      label: "The session cookie sent with every /feed request is readable in plaintext, letting anyone on the network hijack the logged-in session",
      correct: true,
    },
    {
      key: "c",
      label: "The risk is purely theoretical since most attackers can't access the same network as their target",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — this is exactly the Firesheep scenario: the password was protected once at login, but the session cookie riding along on every later unencrypted request is just as valuable and just as exposed to anyone sniffing the same network.",
  quizFeedbackIncorrect:
    "Not quite — a session cookie is enough to fully impersonate a logged-in user without ever knowing the password, and shared networks (coffee shops, airports, conference WiFi) are common enough that this isn't theoretical — it's how Firesheep hijacked real sessions in 2010.",
  takeaway:
    "Encrypt every request, not just the login form — a session cookie sniffed off one unprotected page is just as damaging as a stolen password, which is why HTTPS (and HSTS to enforce it) needs to cover the whole app.",
};

export default content;
