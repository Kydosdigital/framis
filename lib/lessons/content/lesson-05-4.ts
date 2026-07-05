import type { LessonData } from "../types";

const content: LessonData = {
  num: 5,
  orderIndex: 4,
  phaseLabel: "HTML, CSS, JAVASCRIPT",
  title: "Events: teaching your page to listen",
  minutes: 20,
  concept:
    `Browsers constantly fire "events" as the user interacts with a page — a click, typing a character, submitting a form, pressing a key — and JavaScript can attach a listener to any element with "addEventListener" to run code the instant one of those events happens. Every listener receives an "event" object describing exactly what happened: which element was involved ("event.target"), what was typed ("event.target.value"), or which key was pressed ("event.key"). Some events have a default browser action baked in — clicking a submit button reloads the page, clicking a link navigates away — and calling "event.preventDefault()" inside your handler is how you cancel that default so your own JavaScript can take over instead. This combination — listen, inspect, sometimes prevent — is the entire mechanism behind every interactive page: nothing "just happens" without an event firing and a listener responding to it.`,
  conceptSimpler:
    "An event listener is like a doorbell — it waits silently and does nothing until someone presses it, and only then does your code (the person answering the door) spring into action.",
  vizStages: [
    {
      label: "1. A click event",
      body:
        "addEventListener attaches a function to a button that only runs when a 'click' event fires on it — the function sits idle the rest of the time.",
      code: `button.addEventListener("click", () => {\n  console.log("Clicked!");\n});`,
    },
    {
      label: "2. An input event, firing on every keystroke",
      body:
        "The 'input' event fires every single time the text inside a field changes, letting you react live as someone types rather than waiting for them to finish.",
      code: `input.addEventListener("input", (event) => {\n  console.log(event.target.value);\n});`,
    },
    {
      label: "3. A form's default action",
      body:
        "Without any JavaScript, clicking submit on a form does one built-in thing: it sends the data and reloads (or navigates) the page — this happens whether or not you've written a listener.",
      code: `<form>\n  <input name="email" />\n  <button type="submit">Sign up</button>\n</form>`,
    },
    {
      label: "4. Overriding it with preventDefault",
      body:
        "Calling event.preventDefault() inside the submit handler cancels that built-in reload, so your own code — validating the email, sending it with fetch — is fully in charge of what happens next.",
      code: `form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  console.log("Handling this ourselves.");\n});`,
    },
  ],
  realWorldIntro:
    "The instant search suggestions that pop up under Amazon or Google's search box as you type are built on the 'input' event — a listener fires on every keystroke and fetches fresh results before you've even finished the word.",
  realWorldCode:
    `searchBox.addEventListener("input", (event) => {\n  fetchSuggestions(event.target.value);\n});`,
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare how different events fire and what handling them looks like.",
    stages: [
      {
        label: "Click: a simple counter",
        body:
          "Each click fires the 'click' event once, and the handler increments a number and writes it back into the page — a click is a single, discrete moment in time.",
        code: `let count = 0;\nbutton.addEventListener("click", () => {\n  count++;\n  display.textContent = count;\n});`,
      },
      {
        label: "Input: a live character count",
        body:
          "The 'input' event fires continuously as someone types or deletes, so a character counter can update in real time instead of only checking once at the end.",
        code: `textarea.addEventListener("input", (event) => {\n  charCount.textContent = event.target.value.length;\n});`,
      },
      {
        label: "Submit without preventDefault",
        body:
          "This handler logs a message, but because preventDefault was never called, the browser still performs its default action right after — the page navigates or reloads, wiping out that console log.",
        code: `form.addEventListener("submit", () => {\n  console.log("about to lose this page...");\n});`,
      },
      {
        label: "Submit with preventDefault and validation",
        body:
          "Here the default reload is cancelled first, so the code can check the input, show an error message if it's empty, and only move on when the data actually looks valid — all without leaving the page.",
        code: `form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  if (email.value === "") {\n    errorText.textContent = "Email is required";\n    return;\n  }\n  submitToServer(email.value);\n});`,
      },
      {
        label: "Keydown: reacting to a specific key",
        body:
          "The 'keydown' event fires for every key press and includes which key it was, letting you trigger an action — like submitting a search — only when Enter specifically was pressed.",
        code: `input.addEventListener("keydown", (event) => {\n  if (event.key === "Enter") {\n    runSearch(input.value);\n  }\n});`,
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
    "Events are how JavaScript finds out what a user just did, and preventDefault is how you take over from the browser's built-in reaction — together they're what makes clicks, typing, and form submissions feel instant instead of triggering a page reload.",
};

export default content;
