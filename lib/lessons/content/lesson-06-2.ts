import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 2,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "Props: passing data down to child components",
  minutes: 18,
  concept:
    "Props are how a parent component hands information to a child component, the same way arguments get passed into a regular function. Instead of a child reaching out and grabbing data itself, the parent writes it directly onto the JSX tag, like <ProfileCard name=\"Ava\" />, and React collects everything written that way into a single object the child receives as its one function argument. The child then reads whatever fields it needs off that props object — props.name, props.age, and so on — to decide what to render. Props always flow one direction, parent to child, and a child is not allowed to change the props object it was given; if the data needs to change, that has to happen in the parent, which then re-renders and hands the child fresh props. This one-way flow is what makes React apps predictable: you can always trace a piece of data back up to wherever it was first set.",
  conceptSimpler:
    "Props are like a form a manager fills out and hands to an employee — the employee reads the instructions and does the work, but they don't get to scribble changes onto the manager's copy.",
  vizStages: [
    {
      label: "1. Parent renders a child with props",
      body:
        "The parent component writes JSX for ProfileCard, attaching name and role as attributes. React reads these attributes off the tag and bundles them together.",
      code: "function App() {\n  return <ProfileCard name=\"Ava\" role=\"Engineer\" />;\n}",
    },
    {
      label: "2. React builds the props object",
      body:
        "Behind the scenes, React collects every attribute on the tag into a single object: { name: \"Ava\", role: \"Engineer\" }. That object is the one and only argument the child function receives.",
      code: "// what React actually passes in:\nProfileCard({ name: \"Ava\", role: \"Engineer\" })",
    },
    {
      label: "3. The child reads props to render",
      body:
        "ProfileCard destructures the fields it needs straight out of its props argument and uses them inside the JSX it returns. It never sees where the values came from — it just displays them.",
      code: "function ProfileCard({ name, role }) {\n  return <div>\n    <h3>{name}</h3>\n    <p>{role}</p>\n  </div>;\n}",
    },
    {
      label: "4. Same component, different props",
      body:
        "Because ProfileCard only depends on its props, the parent can render it again with different values and get a completely different card, with zero changes to ProfileCard itself.",
      code: "<ProfileCard name=\"Ava\" role=\"Engineer\" />\n<ProfileCard name=\"Marco\" role=\"Designer\" />",
    },
  ],
  realWorldIntro:
    "Every product grid on a shopping site is one ProductCard component reused dozens of times — the layout and styling live in one place, and props like title, price, and image supply what's different about each item.",
  realWorldCode:
    "function ProductCard({ title, price, image }) {\n  return <div className=\"card\">\n    <img src={image} alt={title} />\n    <h4>{title}</h4>\n    <span>${price}</span>\n  </div>;\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see the same Greeting component render differently depending on what props it's handed.",
    stages: [
      {
        label: "Passing a single prop",
        body:
          "Greeting is given one prop, name, set to \"Sam\". Inside the component, props.name reads that value straight through into the JSX.",
        code: "<Greeting name=\"Sam\" />\n// renders: Hello, Sam!",
      },
      {
        label: "Changing just the prop value",
        body:
          "The component's code hasn't changed at all — only the value passed in has. Swapping \"Sam\" for \"Priya\" produces a different result automatically.",
        code: "<Greeting name=\"Priya\" />\n// renders: Hello, Priya!",
      },
      {
        label: "Passing multiple props",
        body:
          "A component can accept as many props as it needs. Here Greeting also receives an excited flag, and it uses that second value to decide whether to add an exclamation mark.",
        code: "<Greeting name=\"Priya\" excited={true} />\n// renders: Hello, Priya!!!",
      },
      {
        label: "Forgetting a prop entirely",
        body:
          "If a prop is never passed, it comes through as undefined inside the component. Without a fallback, that gap shows up directly in the rendered output.",
        code: "<Greeting />\n// renders: Hello, undefined!",
      },
      {
        label: "Giving props a default value",
        body:
          "Destructuring with a default, like { name = \"friend\" }, catches the missing-prop case gracefully instead of showing undefined on screen.",
        code: "function Greeting({ name = \"friend\" }) {\n  return <p>Hello, {name}!</p>;\n}\n// <Greeting /> renders: Hello, friend!",
      },
    ],
  },
  quizQuestion:
    "A child component receives a title prop from its parent. What happens if the child tries to reassign it, like props.title = \"New Title\"?",
  quizCode:
    "function Header(props) {\n  props.title = \"New Title\"; // is this allowed?\n  return <h1>{props.title}</h1>;\n}",
  quizOptions: [
    {
      key: "a",
      label:
        "It works fine — the child can freely edit its own props object and the change stays local to that render",
      correct: false,
    },
    {
      key: "b",
      label:
        "Props are meant to be read-only in the child; if the value needs to change, the parent should update its own data and pass down new props instead",
      correct: true,
    },
    {
      key: "c",
      label:
        "It automatically updates the parent's data too, since props are a live two-way link between parent and child",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — props flow one way, parent to child, so a child should treat them as read-only and let the parent be the source of truth for any changes.",
  quizFeedbackIncorrect:
    "Not quite — mutating props directly breaks React's one-way data flow; the parent owns the data, and it needs to re-render the child with new props whenever something changes.",
  takeaway:
    "Props are how parents pass read-only data into children, arriving as a single object argument that the child never modifies. Reusable components work because they render purely based on whatever props they're handed, nothing more.",
};

export default content;
