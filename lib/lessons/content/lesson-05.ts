import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "One button, three languages",
  minutes: 20,
  concept:
    "A single button on a webpage is actually built from three separate layers, each written in a different language. HTML gives it structure — it says \"there is a button here\" and nothing more. CSS gives it style — colors, size, spacing, rounded corners, what it looks like when you hover over it. JavaScript gives it behavior — code that runs when something happens to it, like a click. These three layers stack on top of each other and stay separate on purpose: you can restyle a button without touching what it does, and you can change what it does without touching how it looks. The browser reads all three, glues them together for that one element, and shows you the result.",
  conceptSimpler:
    "Think of a button like a person: HTML is the skeleton (it exists and has a shape), CSS is the skin and clothes (how it looks), and JavaScript is the muscles (what it actually does when poked).",
  vizStages: [
    {
      label: "1. HTML — structure only",
      body:
        "You write a button element with a label. The browser renders it, but it's plain — default gray, default font, no reaction to clicks yet. It exists, that's all.",
      code: "<button>Subscribe</button>",
    },
    {
      label: "2. CSS — now it has a look",
      body:
        "You add a style rule targeting the button. Now it's got a blue background, white text, rounded corners, and padding. It looks clickable, but clicking it still does nothing.",
      code: "button {\n  background: #2563eb;\n  color: white;\n  padding: 10px 18px;\n  border-radius: 8px;\n  border: none;\n}",
    },
    {
      label: "3. JavaScript — now it does something",
      body:
        "You attach a click handler. The browser now listens for a click on this exact element and runs your function when it happens — here, swapping the label and disabling further clicks.",
      code: "const btn = document.querySelector(\"button\");\nbtn.addEventListener(\"click\", () => {\n  btn.textContent = \"Subscribed!\";\n  btn.disabled = true;\n});",
    },
    {
      label: "4. All three, together",
      body:
        "The final button is the sum of all three files working on the same element at once: HTML defines it, CSS decorates it, JS animates its behavior. Remove any one layer and the button is still there, just missing that piece.",
      code: "<!-- HTML -->\n<button id=\"sub\">Subscribe</button>\n\n/* CSS */\n#sub { background: #2563eb; color: white; border-radius: 8px; }\n\n// JavaScript\ndocument.getElementById(\"sub\").addEventListener(\"click\", () => {\n  alert(\"Thanks for subscribing!\");\n});",
    },
  ],
  realWorldIntro:
    "Every \"Add to Cart\" button on an online store works this way — HTML places it on the page, CSS makes it stand out in bright orange, and JavaScript is what actually adds the item to your cart and updates the little counter icon without reloading the page.",
  realWorldCode:
    "<button class=\"add-to-cart\">Add to Cart</button>\n\n.add-to-cart { background: orange; font-weight: bold; }\n\ncartButton.addEventListener(\"click\", () => {\n  cartCount += 1;\n  cartBadge.textContent = cartCount;\n});",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage below to watch the same button gain structure, then style, then behavior.",
    stages: [
      {
        label: "Just HTML",
        body:
          "This is the raw element with no styling and no behavior. The browser applies its own default appearance — a plain gray box — and clicking it does absolutely nothing.",
        code: "<button>Save</button>",
      },
      {
        label: "HTML + CSS",
        body:
          "A stylesheet now targets this button by its class. It's visually transformed — green, rounded, bigger padding — but it is still functionally dead. Style is purely cosmetic; it never adds behavior.",
        code: "<button class=\"save-btn\">Save</button>\n\n.save-btn {\n  background: #16a34a;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n  border: none;\n  font-size: 16px;\n}",
      },
      {
        label: "HTML + CSS + JavaScript",
        body:
          "Now a script grabs this button and listens for clicks. On click, it changes the button's own text to confirm the save happened. The look didn't change — the CSS rule still applies exactly as before.",
        code: "document.querySelector(\".save-btn\")\n  .addEventListener(\"click\", (event) => {\n    event.target.textContent = \"Saved!\";\n  });",
      },
      {
        label: "Swap the CSS, keep the JS",
        body:
          "Here the button is restyled to a dark theme by changing only the CSS rule. The click handler from before still works exactly the same, untouched — proof the layers are independent.",
        code: ".save-btn {\n  background: #1f2937;\n  color: #f3f4f6;\n  padding: 8px 16px;\n  border-radius: 6px;\n  border: 1px solid #374151;\n}",
      },
    ],
  },
  quizQuestion:
    "You have this button and you want it to turn purple when clicked. Which file do you need to change?",
  quizCode:
    "<button id=\"theme-btn\">Toggle Theme</button>\n\n#theme-btn { background: gray; color: white; }\n\ndocument.getElementById(\"theme-btn\").addEventListener(\"click\", () => {\n  // nothing changes the color yet\n});",
  quizOptions: [
    { key: "a", label: "The HTML file, by adding the word \"purple\" inside the button tag", correct: false },
    { key: "b", label: "The JavaScript, by having the click handler change the button's background color style", correct: true },
    { key: "c", label: "It's impossible without a full page reload", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — HTML and CSS only describe the button's starting appearance; making the color change happen in response to a click requires JavaScript code that runs when that event fires.",
  quizFeedbackIncorrect:
    "Not quite — HTML just labels the button and CSS only sets its default look, neither reacts to a click on its own; you need a JavaScript event handler to change a style in response to something happening.",
  takeaway:
    "Every interactive element on the web is really three layers stacked together: HTML for structure, CSS for style, and JavaScript for behavior. Learning to tell them apart is the key to debugging anything on a page — first ask which layer is actually responsible for the problem you're seeing.",
  nextUpLabel: "React Basics + Components",
};

export default content;
