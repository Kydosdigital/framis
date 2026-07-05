import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 1,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "One click, one re-render: how state updates a component",
  minutes: 22,
  concept:
    "A React component is just a function that returns some JSX describing what the screen should look like right now. State is a special piece of memory a component holds onto between renders, created with useState, and it's the only thing that's allowed to change after the component first shows up. When you call the setter function returned by useState, React doesn't reach into the page and tweak a number — it throws away the old JSX, re-runs your component function from top to bottom with the new state value baked in, and swaps in the new JSX. That's why clicking a button doesn't \"edit\" text on screen; it triggers an entirely fresh render where the count variable simply starts out as a different number. Underneath that setter call is a simple, nameable idea: take the current state and an action describing what happened, and produce the next state. That's exactly what you'll write and run in this lesson's sandbox — a plain JavaScript function, nextState(state, action), that decides what a Counter's state becomes after an increment, a decrement, or a reset. It's real, runnable logic, and it's the same shape real React reducers and setter callbacks use everywhere.",
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
    kind: "code",
    language: "javascript",
    challenge:
      "Implement nextState(state, action) so it models how a Counter component's state changes for three kinds of clicks — increment, decrement, and reset. Then run a sequence of simulated clicks through it and print the state after each one, exactly like React re-rendering after every setCount call.",
    starterCode:
      "function nextState(state, action) {\n  if (action.type === \"increment\") {\n    return { count: state.count + 1 };\n  } else if (action.type === \"decrement\") {\n    return { count: state.count - 1 };\n  } else if (action.type === \"reset\") {\n    return { count: 0 };\n  }\n  return state;\n}\n\nlet state = { count: 0 };\nconsole.log(\"start:\", state.count);\n\nconst clicks = [\n  { type: \"increment\" },\n  { type: \"increment\" },\n  { type: \"increment\" },\n  { type: \"decrement\" },\n  { type: \"reset\" },\n  { type: \"increment\" },\n];\n\nfor (const action of clicks) {\n  state = nextState(state, action);\n  console.log(action.type, \"-> count is now\", state.count);\n}",
  },
  quizQuestion:
    "nextState is called with an action.type of \"double\", which none of the if/else branches handle. What does state.count end up being, and why?",
  quizCode:
    "function nextState(state, action) {\n  if (action.type === \"increment\") {\n    return { count: state.count + 1 };\n  } else if (action.type === \"decrement\") {\n    return { count: state.count - 1 };\n  }\n  return state;\n}\n\nlet state = { count: 5 };\nstate = nextState(state, { type: \"double\" });\nconsole.log(state.count);",
  quizOptions: [
    {
      key: "a",
      label:
        "5 — the function falls through every condition and hits the final \"return state\", leaving the state completely unchanged, exactly like a reducer ignoring an action type it doesn't recognize",
      correct: true,
    },
    {
      key: "b",
      label:
        "undefined — because state.count doesn't exist until a matching action has run at least once",
      correct: false,
    },
    {
      key: "c",
      label:
        "10 — because an unrecognized action type is treated as a request to double the current count",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — with no matching branch, execution falls all the way through to \"return state\", so the state object comes back exactly as it went in. Unhandled actions are silent no-ops, the same way a well-written real reducer ignores action types it wasn't built to handle.",
  quizFeedbackIncorrect:
    "Not quite — trace the if/else chain: \"double\" doesn't match \"increment\" or \"decrement\", so neither branch runs, and the function reaches the final \"return state\" untouched. The count stays 5.",
  takeaway:
    "State is memory a component owns between renders, and calling its setter never edits the page directly — it makes React re-run the component and render fresh JSX from the new value. The logic that decides what the next state should be is just a plain function of the current state and what happened, which is exactly what nextState(state, action) makes real and runnable here.",
};

export default content;
