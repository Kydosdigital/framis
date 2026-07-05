import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 4,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "Controlled inputs: keeping value and onChange in sync",
  minutes: 20,
  concept:
    "An <input> becomes a controlled input the moment its value comes from state instead of the DOM managing it independently: you set value={text} so the input always shows whatever state currently holds, and you set onChange={handleChange} so every keystroke reads event.target.value and feeds it back into the setter. That closes a loop — state drives what's on screen, typing drives what state becomes, and the next render shows the result — which is exactly the state-update pattern from earlier in this module, just triggered by a browser input event instead of a button click. The part worth noticing is that event.target.value is always the input's FULL current text, not just the character that was typed, so handling it is really just \"take whatever came through this event, and make that the new state.\" For a form with several fields, the same idea extends naturally: state becomes an object with one property per field, and a single onChange handler updates just the one field that changed, leaving the others exactly as they were. Without value+onChange wired together like this — an \"uncontrolled\" input — the DOM quietly manages the text on its own, and React has no way to know what's currently typed until it explicitly reads the DOM node.",
  conceptSimpler:
    "A controlled input is like a whiteboard where you're only allowed to write what's on your notepad — every time you touch the whiteboard, you first update the notepad, then copy the notepad onto the board. The board (the input) never has anything on it that isn't also written down (in state) first.",
  vizStages: [
    {
      label: "1. Wiring value and onChange together",
      body:
        "The input's value attribute is bound to a piece of state, and its onChange is a handler that will update that same state. Right now, on the very first render, text is an empty string, so the input starts out blank.",
      code: "function NameField() {\n  const [text, setText] = useState(\"\");\n  return (\n    <input\n      value={text}\n      onChange={(e) => setText(e.target.value)}\n    />\n  );\n}",
    },
    {
      label: "2. The user types a character",
      body:
        "Typing fires the onChange handler. The event object's target.value is the input's entire current text, not just the new character — so if the box already said \"A\" and the user types \"n\", event.target.value comes through as \"An\".",
      code: "onChange={(e) => setText(e.target.value)}\n// user had \"A\", types \"n\" -> e.target.value is \"An\"\n// this calls setText(\"An\")",
    },
    {
      label: "3. React re-renders with the new state",
      body:
        "Just like any other state update, calling setText schedules a re-render. NameField runs again, useState now returns \"An\", and the JSX it returns sets value={\"An\"} on the input.",
      code: "function NameField() {\n  const [text, setText] = useState(\"\"); // returns \"An\" this time\n  return <input value={text} onChange={...} />;\n}",
    },
    {
      label: "4. Many fields, one state object",
      body:
        "A form with several inputs usually keeps one state object, updating a single field at a time while leaving the rest exactly as they were — the same computed-key pattern from working with objects generally, just triggered by typing.",
      code: "const [form, setForm] = useState({ name: \"\", email: \"\" });\n\nfunction handleChange(field, value) {\n  setForm((prev) => {\n    const next = { name: prev.name, email: prev.email };\n    next[field] = value;\n    return next;\n  });\n}\n\n<input value={form.name} onChange={(e) => handleChange(\"name\", e.target.value)} />\n<input value={form.email} onChange={(e) => handleChange(\"email\", e.target.value)} />",
    },
  ],
  realWorldIntro:
    "A signup form validates as you type using exactly this pattern — every keystroke in the email field updates state with the latest text, and the component re-renders to show a live \"looks valid\" or \"missing @\" message without ever needing to explicitly ask the DOM what's currently typed.",
  realWorldCode:
    "function SignupEmail() {\n  const [email, setEmail] = useState(\"\");\n  const looksValid = email.includes(\"@\");\n  return (\n    <>\n      <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      {email.length > 0 && (looksValid ? <p>Looks good</p> : <p>Missing @</p>)}\n    </>\n  );\n}",
  sandbox: {
    kind: "code",
    language: "javascript",
    challenge:
      "Implement nextFormState(state, field, value), which models a single onChange handler shared across a two-field form (name and email): it should update only the field that changed and leave the other exactly as it was. Then simulate the user typing into each field, one onChange event at a time, printing the form state after every keystroke.",
    starterCode:
      "function nextFormState(state, field, value) {\n  const name = field === \"name\" ? value : state.name;\n  const email = field === \"email\" ? value : state.email;\n  return { name: name, email: email };\n}\n\n// Models the onChange handler: the DOM fires an event object whose\n// target.value is the input's FULL current text, not just the new key\nfunction handleChange(state, field, event) {\n  return nextFormState(state, field, event.target.value);\n}\n\nlet formState = { name: \"\", email: \"\" };\nconsole.log(\"initial:\", JSON.stringify(formState));\n\n// Typing \"Ana\" into the name input fires onChange once per keystroke;\n// each time, event.target.value is everything typed in that field so far\nconst nameKeystrokes = [\"A\", \"An\", \"Ana\"];\nfor (const typedSoFar of nameKeystrokes) {\n  const event = { target: { value: typedSoFar } };\n  formState = handleChange(formState, \"name\", event);\n  console.log(\"after typing '\" + typedSoFar + \"':\", JSON.stringify(formState));\n}\n\n// Now the user tabs to the email input and types there instead\nconst emailKeystrokes = [\"a\", \"an\", \"ana@x.com\"];\nfor (const typedSoFar of emailKeystrokes) {\n  const event = { target: { value: typedSoFar } };\n  formState = handleChange(formState, \"email\", event);\n  console.log(\"after typing '\" + typedSoFar + \"':\", JSON.stringify(formState));\n}\n\nconsole.log(\"final form state:\", JSON.stringify(formState));",
  },
  quizQuestion:
    "An input is written as <input value={text} /> with no onChange at all. What actually happens when the user tries to type into it?",
  quizCode:
    "function BrokenField() {\n  const [text, setText] = useState(\"\");\n  return <input value={text} />; // no onChange!\n}",
  quizOptions: [
    {
      key: "a",
      label:
        "Typing works exactly as normal — the browser manages the text in the box regardless of what React does",
      correct: false,
    },
    {
      key: "b",
      label:
        "The input effectively freezes: React keeps re-rendering it with value={text}, and since nothing ever calls setText, text never changes, so every keystroke gets immediately overwritten back to the old value",
      correct: true,
    },
    {
      key: "c",
      label:
        "React automatically generates a default onChange behind the scenes that stores whatever is typed, even though the component never defined one",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — once value is controlled by state, React enforces that value on every render no matter what the user just typed. Without an onChange to call setText, state never updates, so the input keeps snapping back to its old value and effectively refuses to accept new input.",
  quizFeedbackIncorrect:
    "Not quite — setting value from state hands control of the input's contents to React, not the browser. Without an onChange handler to update that state, there's nothing to make text change, so the input keeps re-rendering with its old value and appears frozen to anyone typing into it.",
  takeaway:
    "A controlled input keeps the DOM's value permanently in sync with state: value shows what state currently says, and onChange feeds whatever the user just typed back into that same state via a setter. The handler itself is just a state-update function — take the current state, the field that changed, and the new value, and return the next state — the same shape as every other state update in this module, just triggered by a browser event instead of a click.",
};

export default content;
