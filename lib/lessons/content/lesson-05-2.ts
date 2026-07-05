import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 2,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "The DOM: your page as a living tree",
  minutes: 20,
  concept:
    `When your browser downloads an HTML file, it doesn't just show you the text — it builds a live, in-memory model of every tag as a nested object, called the Document Object Model, or DOM. Each element becomes a node in a tree: a "div" node can contain "button" and "p" nodes, which can contain text nodes, and so on, mirroring the nesting of your HTML tags. JavaScript never edits the original HTML file on the server; instead it reaches into this tree with methods like "document.querySelector" and reads or changes nodes directly. When JavaScript changes a node — its text, its style, whether it exists at all — the browser instantly repaints the screen to match, with no reload and no new file being downloaded. This is why a page can feel alive: everything you see update after a click, a timer, or new data arriving is really just JavaScript rearranging this tree.`,
  conceptSimpler:
    "The DOM is like a stage set built from the script (your HTML) — actors (JavaScript) can move the furniture, swap props, or add new ones mid-show without anyone rewriting the original script.",
  vizStages: [
    {
      label: "1. HTML becomes a tree",
      body:
        "The browser reads your tags and builds a nested structure in memory. A list with three items becomes a 'ul' node holding three 'li' nodes, each holding a text node.",
      code: `<ul id="todos">\n  <li>Buy milk</li>\n  <li>Walk dog</li>\n</ul>`,
    },
    {
      label: "2. JavaScript finds a node",
      body:
        "querySelector searches the tree for something matching a CSS-style selector and hands back that exact node as a JavaScript object you can inspect or change.",
      code: `const list = document.querySelector("#todos");\nconsole.log(list.children.length); // 2`,
    },
    {
      label: "3. Changing the node changes the screen",
      body:
        "Setting a property on the node — like its text content — updates the tree in memory, and the browser repaints instantly. No file was edited, no page reloaded.",
      code: `const first = document.querySelector("li");\nfirst.textContent = "Buy oat milk";`,
    },
    {
      label: "4. The source file never moved",
      body:
        "If you view the page's original source, it still says 'Buy milk' — that's the file as downloaded. Inspecting the live element shows 'Buy oat milk' — that's the DOM, after JavaScript ran.",
      code: `// View Source: <li>Buy milk</li>\n// Inspect Element: <li>Buy oat milk</li>`,
    },
  ],
  realWorldIntro:
    "When you like a post and the counter jumps from \"104\" to \"105\" without the page flashing or reloading, the app didn't rewrite any HTML file — a script found that one number's DOM node and changed its text.",
  realWorldCode:
    `const counter = document.querySelector(".like-count");\ncounter.textContent = Number(counter.textContent) + 1;`,
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see the different ways JavaScript can reach into and reshape the DOM.",
    stages: [
      {
        label: "Selecting an element",
        body:
          "querySelector takes any CSS selector — a tag, class, or id — and returns the first matching node from the live tree, or null if nothing matches.",
        code: `const title = document.querySelector("h1.page-title");`,
      },
      {
        label: "Reading vs. writing text",
        body:
          "textContent both reads and writes the plain text inside a node. Reading it gets you a string; assigning to it replaces everything inside, instantly, on screen.",
        code: `console.log(title.textContent); // "Welcome"\ntitle.textContent = "Welcome back!";`,
      },
      {
        label: "innerHTML vs. textContent",
        body:
          "innerHTML parses the string as HTML, so it can insert new tags — but that also makes it risky with untrusted input. textContent always treats the string as plain text, safely.",
        code: `card.innerHTML = "<strong>Featured</strong>";\n// vs.\ncard.textContent = "<strong>Featured</strong>"; // shows the literal tags as text`,
      },
      {
        label: "Creating a brand-new node",
        body:
          "createElement builds a node that exists only in memory until you attach it somewhere with appendChild. Nothing appears on screen until that second step.",
        code: `const li = document.createElement("li");\nli.textContent = "Read a book";\ndocument.querySelector("#todos").appendChild(li);`,
      },
      {
        label: "Removing a node",
        body:
          "remove() deletes a node from the tree entirely. The browser repaints immediately, and the element is gone from the DOM — though the string that built it is still sitting in the original HTML file, untouched.",
        code: `document.querySelector("li").remove();`,
      },
    ],
  },
  quizQuestion:
    "A script runs `document.querySelector(\"h1\").textContent = \"Hello!\";`. You then use the browser's 'View Page Source' feature. What does it show for that h1?",
  quizCode: `<h1>Original Title</h1>\n\n<script>\n  document.querySelector("h1").textContent = "Hello!";\n</script>`,
  quizOptions: [
    { key: "a", label: "\"Hello!\" — View Source always reflects the latest DOM state", correct: false },
    { key: "b", label: "\"Original Title\" — View Source shows the file as downloaded, not the live DOM", correct: true },
    { key: "c", label: "An error, because the HTML file can't be viewed once JavaScript has run", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — View Source (and the original HTML file on the server) never change; only the in-memory DOM does, which is why you need 'Inspect Element' to see live changes JavaScript made.",
  quizFeedbackIncorrect:
    "Not quite — View Source always shows the raw file exactly as it was downloaded; JavaScript only ever edits the separate, in-memory DOM, which you'd need 'Inspect Element' to see.",
  takeaway:
    "The DOM is the live, editable copy of your page that JavaScript works with — changing it updates the screen instantly, but the original HTML file it was built from never gets touched.",
};

export default content;
