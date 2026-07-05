import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 4,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "One Button, Three Real Languages",
  minutes: 20,
  concept:
    "A single button on a webpage is built from three separate layers, each written in a different language. HTML gives it structure — it says \"there is a button here\" and nothing more. CSS gives it style — colors, size, spacing, rounded corners, how children are arranged with tools like display: flex. JavaScript gives it behavior, and after the last three lessons you know that \"behavior\" isn't magic glue — it's real code: variables, functions, arrays and objects, if/else, all wired to the page through addEventListener. These three layers stay separate on purpose: you can restyle a button without touching what it does, and you can change what it does without touching how it looks. What makes JavaScript different from the other two is that it's a full programming language underneath the DOM plumbing — the same functions you write and test with plain console.log calls are exactly what a click handler calls when a real user clicks a real button.",
  conceptSimpler:
    "HTML is the skeleton, CSS is the skin and clothes, and JavaScript is the muscles and the brain — and you've now learned enough of that \"brain\" language (variables, functions, arrays, objects, control flow) to write real logic, not just watch it happen.",
  vizStages: [
    {
      label: "1. HTML — structure only",
      body:
        "A button element with a label. Plain gray, default font, no reaction to clicks. It exists, that's all — no CSS or JS have touched it yet.",
      code: "<button>Add to Cart</button>",
    },
    {
      label: "2. CSS — now it has a look",
      body:
        "A style rule gives it color, padding, and rounded corners. If this button lived inside a row of controls, display: flex on its container is what would line them all up evenly — CSS handles look and layout, but clicking still does nothing.",
      code: "button {\n  background: #2563eb;\n  color: white;\n  padding: 10px 18px;\n  border-radius: 8px;\n  border: none;\n}\n\n.toolbar {\n  display: flex;\n  justify-content: space-between;\n}",
    },
    {
      label: "3. JavaScript — real logic, not just glue",
      body:
        "cartTotal is an ordinary function — no DOM in it at all — that adds up prices. You could call it and console.log the result with no button anywhere. The click handler below just calls that same function at the right moment.",
      code: "function cartTotal(items) {\n  let total = 0;\n  for (const item of items) {\n    total += item.price;\n  }\n  return total;\n}\n\nbutton.addEventListener(\"click\", () => {\n  cart.push({ name: \"Mug\", price: 9 });\n  totalDisplay.textContent = cartTotal(cart);\n});",
    },
    {
      label: "4. All three, together",
      body:
        "The final button is the sum of all three files acting on the same element: HTML defines it, CSS decorates it, and JavaScript — a real function plus an event listener — decides what happens when it's clicked. Remove any one layer and the others still exist, just missing that piece.",
      code: "<!-- HTML -->\n<button id=\"add-btn\">Add to Cart</button>\n<span id=\"total\">$0</span>\n\n/* CSS */\n#add-btn { background: #2563eb; color: white; border-radius: 8px; }\n\n// JavaScript\nfunction cartTotal(items) {\n  let total = 0;\n  for (const item of items) total += item.price;\n  return total;\n}\n\nlet cart = [];\ndocument.getElementById(\"add-btn\").addEventListener(\"click\", () => {\n  cart.push({ name: \"Mug\", price: 9 });\n  document.getElementById(\"total\").textContent = `$${cartTotal(cart)}`;\n});",
    },
  ],
  realWorldIntro:
    "Every \"Add to Cart\" button on an online store works this way: HTML places it, CSS makes it stand out, and JavaScript runs real functions — computing a total, formatting a price — that you could write and test on their own, with no button in sight, exactly like the sandbox challenge below.",
  realWorldCode:
    "function addToCart(cart, item) {\n  cart.push(item);\n  return cart;\n}\n\nlet cart = [\"Notebook\"];\ncart = addToCart(cart, \"Pen Set\");\nconsole.log(cart);",
  sandbox: {
    kind: "code",
    challenge:
      "This is the real logic behind an \"Add to Cart\" button — the same functions a click handler would call, testable with zero DOM required. Add a function formatCartLine(item) that returns a template-literal string shaped like \"Notebook — $4\", use .map() to build an array of those lines from cart after the new item is added, and console.log the result.",
    starterCode:
      "const cart = [\n  { name: \"Notebook\", price: 4 },\n  { name: \"Pen Set\", price: 6 },\n];\n\nfunction cartTotal(items) {\n  let total = 0;\n  for (const item of items) {\n    total += item.price;\n  }\n  return total;\n}\n\nfunction addItem(items, newItem) {\n  items.push(newItem);\n  return items;\n}\n\nconsole.log(`Cart total: $${cartTotal(cart)}`);\n\naddItem(cart, { name: \"Sticky Notes\", price: 3 });\nconsole.log(`After adding an item, cart total: $${cartTotal(cart)}`);",
    language: "javascript",
  },
  quizQuestion:
    "Only one of these three blocks actually runs any logic and produces console output. What does it print?",
  quizCode:
    "<button class=\"add-btn\">Add to Cart</button>\n\n.add-btn { background: orange; }\n\nfunction cartTotal(items) {\n  let total = 0;\n  for (const item of items) {\n    total += item.price;\n  }\n  return total;\n}\n\nconst cart = [{ name: \"Mug\", price: 9 }, { name: \"Sticker\", price: 2 }];\nconsole.log(`Total: $${cartTotal(cart)}`);",
  quizOptions: [
    { key: "a", label: "The HTML and CSS blocks together produce \"Total: $0\", since the button starts empty", correct: false },
    { key: "b", label: "Total: $11 — produced entirely by the JavaScript block; HTML and CSS never run logic or log anything on their own", correct: true },
    { key: "c", label: "Nothing prints, because a <button> and a JS function can't exist in the same file", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — HTML only describes structure and CSS only describes style; neither one runs code or produces console output. Only the JavaScript executes, and cartTotal adds 9 + 2 to log \"Total: $11\".",
  quizFeedbackIncorrect:
    "Not quite — HTML and CSS are never executed as logic; they just describe structure and appearance. The JavaScript block is what actually runs, and cartTotal(cart) adds 9 + 2, so the real output is \"Total: $11\".",
  takeaway:
    "Every interactive element on the web is three layers stacked together: HTML for structure, CSS for style, and JavaScript for behavior. What's changed now is that you know JavaScript is a real, full language — the same variables, functions, arrays, objects, and control flow you practiced in this module are exactly what run inside every event handler on every page you'll ever build.",
};

export default content;
