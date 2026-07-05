import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 3,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "Boxes all the way down: the box model and flexbox",
  minutes: 20,
  concept:
    `Every single element on a webpage — a button, a paragraph, an image — is rendered as a rectangular box, and CSS controls that box with four nested layers: content in the middle, padding around it as breathing room, a border around the padding, and margin as empty space outside the border separating it from other boxes. By default a box's declared width only measures its content, so adding padding or a border makes the box grow larger than the number you typed — a common source of "why is my layout broken" bugs, usually fixed with "box-sizing: border-box" so width includes padding and border. Once you understand every element as one of these boxes, layout becomes a question of "how do I arrange these boxes," and that's exactly what flexbox answers: setting "display: flex" on a container turns its direct children into a flexible row (or column) that you can space out, align, and reorder with a handful of properties like "justify-content" and "align-items", instead of fighting with manual positioning.`,
  conceptSimpler:
    "The box model is a picture frame: the photo is your content, the mat around it is padding, the wood is the border, and the gap to the next frame on the wall is margin. Flexbox is the shelf that automatically arranges all those frames in a neat row for you.",
  vizStages: [
    {
      label: "1. Content only",
      body:
        "A box with just a width and background color. The blue area is exactly 200px wide — nothing else is added yet.",
      code: `.box {\n  width: 200px;\n  background: #2563eb;\n}`,
    },
    {
      label: "2. Add padding and border",
      body:
        "With default box-sizing, padding and border are added on top of the 200px, so this box now actually renders 250px wide (200 content + 20px padding on each side + 5px border on each side).",
      code: `.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #1e3a8a;\n}`,
    },
    {
      label: "3. box-sizing: border-box fixes the math",
      body:
        "Switching to border-box makes width mean the total rendered size — padding and border now shrink the content area to fit inside 200px, instead of growing the box past it.",
      code: `.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #1e3a8a;\n}`,
    },
    {
      label: "4. flexbox arranges the boxes",
      body:
        "display: flex turns three stacked boxes into a row, and justify-content: space-between spreads them evenly across the container's full width — no manual margins required.",
      code: `.row {\n  display: flex;\n  justify-content: space-between;\n}`,
    },
  ],
  realWorldIntro:
    "That header bar you see on almost every site — logo on the left, nav links on the right, all lined up on one row no matter the screen width — is almost always just one flex container with \"justify-content: space-between\".",
  realWorldCode:
    `<header class="nav">\n  <span class="logo">Framis</span>\n  <nav><a href="#">Docs</a><a href="#">Pricing</a></nav>\n</header>\n\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare how boxes behave with different box-model and flexbox settings.",
    stages: [
      {
        label: "Default stacking (no flexbox)",
        body:
          "Block-level elements like div stack vertically by default, each taking its own full-width row, one below the other — this is the browser's built-in layout before you touch flexbox at all.",
        code: `<div class="item">One</div>\n<div class="item">Two</div>\n<div class="item">Three</div>`,
      },
      {
        label: "display: flex turns them into a row",
        body:
          "Adding display: flex to their shared parent is enough on its own — no other changes — to lay all three children out side by side in a single horizontal row.",
        code: `.container {\n  display: flex;\n}`,
      },
      {
        label: "justify-content controls horizontal spacing",
        body:
          "With extra room in the row, justify-content decides what happens to it: 'center' bunches items in the middle, 'space-between' pushes the first and last to the edges and splits the rest evenly, 'flex-end' pushes everything right.",
        code: `.container {\n  display: flex;\n  justify-content: center; /* or space-between, flex-end, space-around */\n}`,
      },
      {
        label: "align-items controls vertical alignment",
        body:
          "When items are different heights, align-items: center vertically centers each one within the row instead of leaving them lined up along the top edge, which is the default.",
        code: `.container {\n  display: flex;\n  align-items: center;\n  height: 100px;\n}`,
      },
      {
        label: "flex-direction: column",
        body:
          "Flexbox isn't only for rows — flex-direction: column keeps all the same alignment tools (justify-content, align-items) but stacks children vertically instead of horizontally.",
        code: `.sidebar {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}`,
      },
    ],
  },
  quizQuestion:
    "With the CSS below, using the default box-sizing (content-box), how wide is the rendered box from its outer left edge to its outer right edge, not counting margin?",
  quizCode: `.card {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n  box-sizing: content-box;\n}`,
  quizOptions: [
    { key: "a", label: "200px, because that's the width that was declared", correct: false },
    { key: "b", label: "250px, because padding and border are added on top of the declared width on each side", correct: true },
    { key: "c", label: "225px, because only the border adds to the width", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — with content-box, the 200px only measures the content; the browser adds 20px of padding and 5px of border on both the left and right (2 x 20 + 2 x 5 = 50), giving a total of 250px.",
  quizFeedbackIncorrect:
    "Not quite — with content-box, width only measures the content itself, so both the padding (20px x 2 sides) and the border (5px x 2 sides) get added on top, bringing the total to 250px.",
  takeaway:
    "Every element is a box made of content, padding, border, and margin, and flexbox is how you arrange a group of those boxes into rows or columns without hand-calculating positions.",
};

export default content;
