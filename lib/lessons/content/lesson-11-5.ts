import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 5,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Not from around here: CORS and the same-origin policy",
  minutes: 18,
  concept:
    "An \"origin\" is the combination of protocol, domain, and port a request is made from — https://app.framis.dev and https://api.framis.dev are different origins because the domain differs, https://app.framis.dev and http://app.framis.dev are different origins because the protocol differs, and https://app.framis.dev and https://app.framis.dev:8080 are different origins because the port differs. Every one of those has to match exactly for two URLs to count as the same origin. Browsers enforce something called the same-origin policy: by default, JavaScript running on one origin is not allowed to read the response of a request made to a different origin, even though the request itself often still reaches the server and gets processed. This exists to protect users — without it, any malicious website you happened to visit could quietly use your browser to call your bank's API, your email provider, or any other site you're logged into, and read back whatever came out, all riding on cookies your browser sends automatically. CORS (Cross-Origin Resource Sharing) is the mechanism a server uses to loosen that default: by sending an Access-Control-Allow-Origin response header naming an allowed origin (or * for any origin), the server explicitly tells the browser \"it's fine for JavaScript running on that origin to read this response.\" Without that header, the browser withholds the response from the calling script and the developer sees a CORS error in the console — even though, for a simple GET request, the server may have already run the request and sent data back over the wire. CORS is enforced entirely by the browser, which is also why non-browser tools like curl or Postman are never affected by it — they have no same-origin policy to enforce in the first place.",
  conceptSimpler:
    "The same-origin policy is a librarian who will only ever hand your notes back to you at your own desk — CORS is a different desk explicitly signing a slip that tells the librarian it's fine to bring a copy over there too.",
  vizStages: [
    {
      label: "1. What counts as the same origin",
      body:
        "Origin means protocol + domain + port, all three. Change any one of them and the browser treats it as a completely different origin, no matter how similar the URL looks.",
      code:
        "https://app.framis.dev        (protocol: https, domain: app.framis.dev, port: 443)\nhttps://api.framis.dev        -> different domain -> different origin\nhttp://app.framis.dev         -> different protocol -> different origin\nhttps://app.framis.dev:8080   -> different port -> different origin",
    },
    {
      label: "2. Same-origin requests just work",
      body:
        "When the frontend JavaScript and the API it's calling are served from the exact same origin, the browser lets the script read the response with no special headers involved at all.",
      code:
        "// page served from https://app.framis.dev, calling its own origin\nfetch(\"https://app.framis.dev/api/profile\")\n  .then((res) => res.json())\n  .then((data) => console.log(data));\n// succeeds — same-origin requests need no CORS headers",
    },
    {
      label: "3. A cross-origin call gets blocked by default",
      body:
        "The same frontend now calls a different origin. The request may well reach the server and the server may well respond — but without permission, the browser refuses to let the calling script see that response at all.",
      code:
        "// same page, now calling a different origin\nfetch(\"https://api.framis.dev/profile\")\n  .then((res) => res.json())\n  .catch((err) => console.error(err));\n\n// browser console:\n// Access to fetch at 'https://api.framis.dev/profile' from origin\n// 'https://app.framis.dev' has been blocked by CORS policy:\n// No 'Access-Control-Allow-Origin' header is present on the requested resource.",
    },
    {
      label: "4. The server opts in, and the exact same call succeeds",
      body:
        "Nothing changes on the frontend. The server just starts sending one header naming the trusted origin, and the browser now allows the script to read the response.",
      code:
        "// api.framis.dev's response now includes:\nAccess-Control-Allow-Origin: https://app.framis.dev\n\n// the identical fetch() call from stage 3 now resolves normally:\nfetch(\"https://api.framis.dev/profile\")\n  .then((res) => res.json())\n  .then((data) => console.log(data)); // works",
    },
  ],
  realWorldIntro:
    "One of the most common real-world CORS mistakes is a server that reflects back whatever Origin header the browser sent as the value of Access-Control-Allow-Origin — instead of checking it against a real allowlist — combined with Access-Control-Allow-Credentials: true. That pairing effectively tells every browser \"any website may read this response using the visitor's own cookies,\" which defeats the entire purpose of the same-origin policy, and security researchers have repeatedly found and reported exactly this misconfiguration as a critical vulnerability in production APIs.",
  realWorldCode:
    "// vulnerable: reflects any origin back with no allowlist check\nres.setHeader(\"Access-Control-Allow-Origin\", req.headers.origin);\nres.setHeader(\"Access-Control-Allow-Credentials\", \"true\");\n\n// safe: only ever allow specific, trusted origins\nconst allowedOrigins = [\"https://app.framis.dev\"];\nif (allowedOrigins.includes(req.headers.origin)) {\n  res.setHeader(\"Access-Control-Allow-Origin\", req.headers.origin);\n  res.setHeader(\"Access-Control-Allow-Credentials\", \"true\");\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how a \"non-simple\" cross-origin request — one using a custom header, JSON body, or a method like PUT or DELETE — has to clear an extra round trip called a preflight before the real request is even sent.",
    stages: [
      {
        label: "A simple request skips the preflight",
        body:
          "A plain GET with no custom headers is considered \"simple.\" The browser sends it directly — the only thing CORS controls here is whether the script is allowed to read the response afterward.",
        code:
          "GET /profile HTTP/1.1\nHost: api.framis.dev\nOrigin: https://app.framis.dev\n// sent immediately — no preflight needed for a simple GET",
      },
      {
        label: "A non-simple request triggers a preflight first",
        body:
          "Calling fetch() with a JSON body, a custom header like Authorization, or a method like PUT/DELETE makes the browser first ask permission with an automatic OPTIONS request — before your actual request goes out at all.",
        code:
          "OPTIONS /profile HTTP/1.1\nHost: api.framis.dev\nOrigin: https://app.framis.dev\nAccess-Control-Request-Method: PUT\nAccess-Control-Request-Headers: authorization, content-type",
      },
      {
        label: "The server answers the preflight",
        body:
          "The server responds to the OPTIONS request listing exactly which origin, methods, and headers it permits. No request body is exchanged yet — this is purely a permission check.",
        code:
          "HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.framis.dev\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: authorization, content-type",
      },
      {
        label: "Only then does the real request go out",
        body:
          "If the preflight response allows it, the browser finally sends the actual PUT request. If the preflight response had refused it, the real request would never be sent at all — unlike a simple GET, where the request goes out but the response just gets withheld.",
        code:
          "PUT /profile HTTP/1.1\nHost: api.framis.dev\nOrigin: https://app.framis.dev\nAuthorization: Bearer eyJhbGciOi...\nContent-Type: application/json\n\n{\"name\": \"Amy\"}",
      },
    ],
  },
  quizQuestion:
    "A frontend at https://app.framis.dev calls fetch(\"https://api.framis.dev/data\") and the browser console shows a CORS error. Hitting the exact same URL from Postman returns the data with no problem. What's actually going on?",
  quizCode:
    "// browser console:\n// Access to fetch at 'https://api.framis.dev/data' from origin\n// 'https://app.framis.dev' has been blocked by CORS policy",
  quizOptions: [
    {
      key: "a",
      label: "api.framis.dev's response didn't include an Access-Control-Allow-Origin header permitting app.framis.dev, so the browser withheld the response from JavaScript — CORS is enforced by the browser, and Postman isn't a browser",
      correct: true,
    },
    {
      key: "b",
      label: "The server detected that the request came from a browser and deliberately rejected it before processing anything",
      correct: false,
    },
    {
      key: "c",
      label: "app.framis.dev and api.framis.dev must be on different IP addresses, so the network connection itself is failing",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — CORS is a restriction the browser enforces on behalf of the page's JavaScript, not a network failure or a server-side rejection. The server can process the request and send a perfectly good response; if it doesn't include the right Access-Control-Allow-Origin header, the browser simply refuses to let your script read that response. Postman has no same-origin policy to enforce, so it just gets the data.",
  quizFeedbackIncorrect:
    "Not quite — nothing about the network connection or the server's willingness to respond has failed here. The server can (and often does) still process the request; the browser is the one blocking your script from reading the response, because the server never sent an Access-Control-Allow-Origin header naming app.framis.dev. That's also exactly why a non-browser tool like Postman is unaffected — it isn't enforcing a same-origin policy at all.",
  takeaway:
    "Origin means protocol + domain + port, and browsers block JavaScript from reading cross-origin responses by default to protect users from malicious sites quietly using their logged-in sessions. CORS is how a server opts back in, one trusted origin (or *) at a time, via the Access-Control-Allow-Origin header — and because it's a browser-side restriction, it only ever affects requests made from a browser page, never server-to-server calls or tools like curl.",
};

export default content;
