import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 3,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "The DOM and Events: Making a Page Listen",
  minutes: 22,
  concept:
    `When a browser downloads an HTML file, it doesn't just display the text — it builds a live, in-memory model of every tag as a nested object called the Document Object Model, or DOM. JavaScript reaches into this tree with "document.querySelector(selector)", which returns the first matching node as a real object you can read from or write to — setting its "textContent" changes what's on screen instantly, with no reload and no file ever touched on disk. To react to what a user does, you attach a listener: "element.addEventListener(\\"click\\", handler)" tells the browser to run handler the instant a click happens on that element, and the browser hands the handler an "event" object describing exactly what occurred — event.target is the element involved, event.target.value is what's typed in a field, event.key is which key was pressed. The function you pass to addEventListener is not a special DOM-only thing — it's an ordinary JavaScript function, and everything inside its body (counting, comparing, building a string) is the exact same JS from the last two lessons; only the outer plumbing (querySelector, addEventListener) is new. One more piece: some events carry a built-in default action — a form's submit reloads or navigates the page whether or not you've written a handler — and calling "event.preventDefault()" inside your handler is how you cancel that so your own code takes over instead.`,
  conceptSimpler:
    "The DOM is a stage set built from your HTML — JavaScript can walk on stage and move a prop (querySelector, textContent) without anyone rewriting the script. An event listener is a doorbell: it waits silently until pressed, and only then does the function behind it — plain JS you already know how to write — spring into action.",
  vizStages: [
    {
      label: "1. HTML becomes a tree",
      body:
        "The browser reads your tags and builds a nested structure in memory the instant the page loads. A list with two items becomes a 'ul' node holding two 'li' nodes, each holding its own text.",
      code: `<ul id="todos">\n  <li>Buy milk</li>\n  <li>Walk dog</li>\n</ul>`,
    },
    {
      label: "2. querySelector finds a node, textContent changes it",
      body:
        "querySelector searches the live tree for something matching a CSS-style selector and hands back that exact node. Reading textContent gets you a string; assigning to it replaces what's on screen immediately — no reload.",
      code: `const first = document.querySelector("li");\nconsole.log(first.textContent); // "Buy milk"\nfirst.textContent = "Buy oat milk";`,
    },
    {
      label: "3. addEventListener and the event object",
      body:
        "The function passed to addEventListener sits completely idle until a real click happens on this button — then it runs, and the event object it receives tells you exactly which element was clicked via event.target.",
      code: `button.addEventListener("click", (event) => {\n  console.log("clicked:", event.target.textContent);\n});`,
    },
    {
      label: "4. Some events have a default action — preventDefault cancels it",
      body:
        "Without any JavaScript, clicking submit on a form reloads or navigates the page — that happens whether or not a listener exists. Calling event.preventDefault() inside the handler cancels only that built-in behavior, so your own code decides what happens next.",
      code: `form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  console.log("Handling this ourselves, no reload.");\n});`,
    },
  ],
  realWorldIntro:
    "When you like a post and the counter jumps from \"104\" to \"105\" with no flash or reload, a click listener fired, ran a plain JS function to compute the new number, and wrote that number into one DOM node's textContent — the same increment logic you'd write and test with no DOM involved at all.",
  realWorldCode:
    `function incrementLikes(current) {\n  return current + 1;\n}\n\nconst counter = document.querySelector(".like-count");\ncounter.addEventListener("click", () => {\n  const next = incrementLikes(Number(counter.textContent));\n  counter.textContent = next;\n});`,
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how JavaScript finds elements, listens for events, and sometimes overrides the browser's default behavior. In each one, notice which part is new DOM plumbing (querySelector, addEventListener) and which part is just plain JS logic you already practiced in Lesson 5.2.",
    stages: [
      {
        label: "Selecting an element",
        body:
          "querySelector takes any CSS selector — a tag, class, or id — and returns the first matching node from the live tree, or null if nothing matches. Nothing on screen changes yet; this step only finds the node.",
        code: `const title = document.querySelector("h1.page-title");`,
      },
      {
        label: "Click: a counter, powered by a plain function",
        body:
          "Every click fires the handler once. The line that actually decides the new number — current + 1 — is ordinary JS with zero DOM in it; only display.textContent = count is the DOM part, writing that number to the screen.",
        code: `let count = 0;\nfunction incrementLikes(current) {\n  return current + 1;\n}\n\nbutton.addEventListener("click", () => {\n  count = incrementLikes(count);\n  display.textContent = count;\n});`,
      },
      {
        label: "Input: a live character count",
        body:
          "The 'input' event fires on every keystroke, handing back event.target.value — a plain string. Getting its length (value.length) is exactly the same string method you'd use anywhere else; here it just happens to feed a DOM update.",
        code: `function charCount(text) {\n  return text.length;\n}\n\ntextarea.addEventListener("input", (event) => {\n  charCountLabel.textContent = charCount(event.target.value);\n});`,
      },
      {
        label: "Submit without preventDefault",
        body:
          "This handler logs a message, but because preventDefault was never called, the browser still performs its default action right after — the page navigates or reloads, and that console log is gone before you could read it.",
        code: `form.addEventListener("submit", () => {\n  console.log("about to lose this page...");\n});`,
      },
      {
        label: "Submit with preventDefault and real validation logic",
        body:
          "preventDefault cancels the reload first. What runs after it — checking whether email is an empty string, choosing an error message — is the same if/else logic from Lesson 5.2, just triggered by a submit event instead of running top to bottom on its own.",
        code: `function validateEmail(value) {\n  if (value === "") {\n    return "Email is required";\n  }\n  return "";\n}\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const error = validateEmail(emailInput.value);\n  if (error !== "") {\n    errorText.textContent = error;\n    return;\n  }\n  submitToServer(emailInput.value);\n});`,
      },
    ],
  },
  quizQuestion:
    "A form has this submit handler, and it never calls event.preventDefault(). What happens when the user clicks the submit button?",
  quizCode: `form.addEventListener("submit", (event) => {\n  console.log("Form submitted, saving locally...");\n  saveDraft(event.target);\n});`,
  quizOptions: [
    { key: "a", label: "The handler runs, and then the browser still performs its default action of reloading or navigating the page", correct: true },
    { key: "b", label: "The form submission is automatically cancelled because JavaScript is handling the event", correct: false },
    { key: "c", label: "Nothing happens at all, because the handler is missing preventDefault", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — attaching a listener doesn't cancel the browser's built-in behavior on its own; the handler runs first, but the page still reloads or navigates afterward unless preventDefault() is called.",
  quizFeedbackIncorrect:
    "Not quite — the handler does run, but simply having a listener doesn't stop the browser's default submit behavior; only calling event.preventDefault() inside it cancels the reload or navigation.",
  takeaway:
    "The DOM is the live, in-memory copy of your page that querySelector and textContent read and write — changing it updates the screen instantly, with no file ever touched. addEventListener is how a page notices what a user did, and preventDefault is how you take over from the browser's built-in reaction — but the logic inside any handler is still just the plain JavaScript you already know how to write and test.",
};

export default content;
