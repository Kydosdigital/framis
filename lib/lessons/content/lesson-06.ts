import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 1,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "One click, one re-render: how state updates a component",
  minutes: 20,
  concept:
    "A React component is just a function that returns some JSX describing what the screen should look like right now. State is a special piece of memory a component holds onto between renders, created with useState, and it's the only thing that's allowed to change after the component first shows up. When you call the setter function returned by useState, React doesn't reach into the page and tweak a number — it throws away the old JSX, re-runs your component function from top to bottom with the new state value baked in, and swaps in the new JSX. That's why clicking a button doesn't \"edit\" text on screen; it triggers an entirely fresh render where the count variable simply starts out as a different number. Nothing on the page changes until the component function runs again and returns something different.",
  conceptSimpler:
    "Think of a component like a photograph being retaken every time something changes — state is the pose, and instead of touching up the old photo, React just takes a brand new one whenever the pose changes.",
  vizStages: [
    {
      label: "1. First render",
      body:
        "The Counter component runs for the first time. useState(0) gives it a count variable starting at 0, and the JSX it returns shows that value on screen.",
      code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>;\n}",
    },
    {
      label: "2. Click fires the setter",
      body:
        "The user clicks the button. The onClick handler runs and calls setCount(count + 1), which tells React \"this component's state should now be 1.\"",
      code: "onClick={() => setCount(count + 1)}\n// count was 0, so this calls setCount(1)",
    },
    {
      label: "3. React re-runs the function",
      body:
        "React schedules a re-render: it calls the Counter function again from scratch. This time useState hands back 1 instead of 0, because React remembered the update.",
      code: "function Counter() {\n  const [count, setCount] = useState(0); // returns 1 this time\n  return <button onClick={...}>Count: {count}</button>;\n}",
    },
    {
      label: "4. New JSX replaces the old",
      body:
        "The function returns new JSX containing 1 instead of 0. React compares it to what was on screen and updates only the text that actually changed — the button itself never unmounts.",
      code: "<button onClick={...}>Count: 1</button>",
    },
  ],
  realWorldIntro:
    "This exact pattern powers the \"like\" counter on a post — clicking the heart icon updates a count variable in state, and the whole like button re-renders to show the new total instantly.",
  realWorldCode:
    "function LikeButton() {\n  const [likes, setLikes] = useState(42);\n  return <button onClick={() => setLikes(likes + 1)}>\n    ❤️ {likes}\n  </button>;\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how the Counter component's state and rendered output change together, one click at a time.",
    stages: [
      {
        label: "Before any clicks",
        body:
          "count starts at 0 because that's the initial value passed to useState(0). The button renders showing that starting number.",
        code: "// state: count = 0\n<button onClick={...}>Count: 0</button>",
      },
      {
        label: "After 1 click",
        body:
          "Clicking called setCount(0 + 1). React re-ran Counter with count now equal to 1, so the button's text updated to match.",
        code: "// state: count = 1\n<button onClick={...}>Count: 1</button>",
      },
      {
        label: "After 2 clicks",
        body:
          "Another click called setCount(1 + 1). Each click always uses whatever count currently is, so the value climbs by one every time.",
        code: "// state: count = 2\n<button onClick={...}>Count: 2</button>",
      },
      {
        label: "After 5 clicks",
        body:
          "The pattern keeps repeating — five clicks means five re-renders, and count has climbed to 5. The button component itself never changed, only the number inside it.",
        code: "// state: count = 5\n<button onClick={...}>Count: 5</button>",
      },
      {
        label: "Resetting",
        body:
          "If a reset button called setCount(0), React would re-render once more with count back at 0 — proof that the UI only ever reflects whatever state currently says.",
        code: "// state: count = 0\n<button onClick={...}>Count: 0</button>",
      },
    ],
  },
  quizQuestion:
    "In the Counter component below, what actually causes the number on screen to change from 0 to 1 after a click?",
  quizCode:
    "function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>;\n}",
  quizOptions: [
    {
      key: "a",
      label:
        "React directly edits the text node in the browser to say 1 without re-running any code",
      correct: false,
    },
    {
      key: "b",
      label:
        "Calling setCount triggers React to re-run the Counter function with the new state, producing new JSX that replaces the old",
      correct: true,
    },
    {
      key: "c",
      label:
        "The button element keeps its own internal counter that increments automatically on every click",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Exactly — setCount tells React the state changed, so React re-runs the whole component function and uses the fresh JSX it returns to update the screen.",
  quizFeedbackIncorrect:
    "Not quite — React doesn't hand-edit the page or let elements track their own data; it re-runs the component function with the new state and generates new JSX to display.",
  takeaway:
    "State is memory a component owns between renders, and calling its setter never edits the page directly — it makes React re-run the component and render fresh JSX from the new value. Every UI update you see is really just a function running again with different inputs.",
  nextUpLabel: "APIs + HTTP + JSON",
};

export default content;
