import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 4,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "useEffect: running code when things change",
  minutes: 22,
  concept:
    "A component function's job is to return JSX describing the UI — it's not supposed to also fetch data, start a timer, or talk to a browser API while it's busy rendering. useEffect is React's way of saying \"run this code, but only after the render has finished and the screen is updated,\" which is exactly where side effects like data fetching, subscriptions, and manual DOM work belong. useEffect takes a function to run and a dependency array that controls when it reruns: an empty array [] means \"only run once, right after the first render\"; a list like [userId] means \"rerun whenever userId changes between renders\"; and leaving the array off entirely means \"rerun after every single render.\" If the effect sets something up that needs to be undone — like a timer or a subscription — the function can return a cleanup function, which React calls right before the effect runs again or before the component disappears from the screen entirely, so nothing keeps running after it's no longer needed.",
  conceptSimpler:
    "Think of rendering as writing a letter and useEffect as the errand you run right after you seal the envelope — the errand happens after the main task is done, and the dependency array is your note for how often to repeat that errand.",
  vizStages: [
    {
      label: "1. Component renders first",
      body:
        "React runs the component function and puts the returned JSX on screen. At this point, useEffect's callback has not run yet — rendering always finishes first.",
      code: "function Profile({ userId }) {\n  const [user, setUser] = useState(null);\n  // render happens here, user is still null\n  return <p>{user ? user.name : \"Loading...\"}</p>;\n}",
    },
    {
      label: "2. After paint, the effect runs",
      body:
        "Once the screen reflects the initial render, React calls the effect function. This is the safe place to kick off a fetch, since it happens outside of rendering.",
      code: "useEffect(() => {\n  fetchUser(userId).then(setUser);\n}, [userId]);",
    },
    {
      label: "3. The dependency array decides what triggers a rerun",
      body:
        "React compares each dependency to its value from the previous render. Because userId is in the array, the effect only reruns when userId itself actually changes — not on every unrelated re-render.",
      code: "// userId changes from 1 to 2 -> effect reruns\n// some other state changes -> effect is skipped",
    },
    {
      label: "4. Cleanup runs before the next effect or unmount",
      body:
        "If the effect returns a function, React calls that cleanup right before running the effect again, and one final time when the component is removed from the page — closing sockets, clearing timers, canceling subscriptions.",
      code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup\n}, []);",
    },
  ],
  realWorldIntro:
    "A live stock price widget uses useEffect to open a connection when it mounts, tying the subscription's lifetime to the component's — and to clean up that connection the moment the widget leaves the screen so the app doesn't keep listening for prices nobody is looking at.",
  realWorldCode:
    "useEffect(() => {\n  const socket = connectToPrices(ticker);\n  socket.on(\"update\", setPrice);\n  return () => socket.disconnect();\n}, [ticker]);",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see how the same useEffect call behaves differently depending on what's in its dependency array.",
    stages: [
      {
        label: "No dependency array: runs after every render",
        body:
          "Leaving off the array entirely means the effect has no condition to check, so React just reruns it after every single render — including ones caused by unrelated state changes. This is rarely what you want.",
        code: "useEffect(() => {\n  console.log(\"ran again\");\n}); // no array: logs after every render",
      },
      {
        label: "Empty array: runs once, on mount only",
        body:
          "An empty array [] has nothing that can ever change, so React treats the effect as having no dependencies to react to — it fires exactly once, right after the component first appears.",
        code: "useEffect(() => {\n  console.log(\"mounted\");\n}, []); // logs once, ever",
      },
      {
        label: "Array with a value: runs on mount, then again only when it changes",
        body:
          "With [userId] in the array, the effect fires once on mount, then compares userId on every later render — only rerunning fetchUser when that specific value is different from last time.",
        code: "useEffect(() => {\n  fetchUser(userId).then(setUser);\n}, [userId]);\n// userId: 1 -> 1 -> 2\n// effect runs: yes -> no -> yes",
      },
      {
        label: "Missing a dependency: a subtle bug",
        body:
          "If the effect uses query but query isn't listed in the array, the effect will keep using the stale value of query from whenever it last ran, instead of picking up the newest one.",
        code: "useEffect(() => {\n  search(query); // uses query...\n}, []); // ...but query isn't tracked, so it's always the first query",
      },
      {
        label: "Cleanup preventing a leak",
        body:
          "Without the returned cleanup function, every remount of this timer component would start a new interval that never stops, even after the component is gone — quietly piling up background work.",
        code: "useEffect(() => {\n  const id = setInterval(() => setCount(c => c + 1), 1000);\n  return () => clearInterval(id);\n}, []);",
      },
    ],
  },
  quizQuestion:
    "A component has this effect. What happens each time the userId prop changes to a new value?",
  quizCode:
    "useEffect(() => {\n  const subscription = subscribeToUser(userId);\n  return () => subscription.unsubscribe();\n}, [userId]);",
  quizOptions: [
    {
      key: "a",
      label:
        "Nothing — once the effect runs the first time, it's locked in and ignores any later changes to userId",
      correct: false,
    },
    {
      key: "b",
      label:
        "React calls the cleanup function to unsubscribe from the old userId, then runs the effect again to subscribe to the new one",
      correct: true,
    },
    {
      key: "c",
      label:
        "React runs the effect again for the new userId but keeps the old subscription open in the background too",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — because userId is in the dependency array, React tears down the previous effect by calling its cleanup, then runs the effect fresh with the new userId, so there's always exactly one active subscription.",
  quizFeedbackIncorrect:
    "Not quite — a dependency array with userId in it means the effect reruns whenever userId changes, and React always calls the previous cleanup first so old subscriptions don't pile up.",
  takeaway:
    "useEffect runs side effects after rendering finishes, and its dependency array controls exactly when it reruns — empty for once-on-mount, listing values to rerun when they change, or omitted entirely to run every time. A returned cleanup function keeps things tidy by undoing the effect before it runs again or the component disappears.",
};

export default content;
