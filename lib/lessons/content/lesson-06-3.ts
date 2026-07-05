import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 3,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "Lists and keys: rendering many components from an array",
  minutes: 20,
  concept:
    "Real apps rarely render just one of something — a feed has many posts, an inbox has many messages — and React handles this by letting you map an array of data straight into an array of JSX elements using .map(). Each item in the data array gets transformed into one component, so a list of 50 comments becomes 50 <Comment> elements returned side by side inside something like a <ul>. React requires every element produced this way to carry a special key prop, a stable, unique identifier for that item, usually an id from the data rather than the item's position in the array. React uses these keys behind the scenes to match up old elements with new ones across re-renders, so it can tell \"this is the same comment, just moved\" instead of tearing everything down and rebuilding it from scratch. Without good keys, React falls back to guessing based on order, which can scramble input state, animations, and focus when the list is reordered, filtered, or has items inserted in the middle.",
  conceptSimpler:
    "Keys are like name tags at a conference — without them, if people shuffle seats, the room organizer can only guess who's who by chair position; with name tags, they can tell exactly who moved where.",
  vizStages: [
    {
      label: "1. Start with an array of data",
      body:
        "The data lives as a plain JavaScript array, completely separate from any JSX. Each object has a unique id along with whatever fields the UI needs.",
      code: "const todos = [\n  { id: 1, text: \"Buy milk\" },\n  { id: 2, text: \"Walk dog\" },\n];",
    },
    {
      label: "2. .map() turns data into elements",
      body:
        "Calling .map() on the array runs a function once per item and returns a brand new array — this time full of JSX elements instead of plain objects.",
      code: "todos.map((todo) => (\n  <li key={todo.id}>{todo.text}</li>\n))",
    },
    {
      label: "3. The key prop rides along on each element",
      body:
        "Every element in that new array gets a key set to something stable and unique, here todo.id. React reads this key but doesn't pass it into the component as a normal prop — it's reserved for React's own bookkeeping.",
      code: "// resulting array:\n[\n  <li key={1}>Buy milk</li>,\n  <li key={2}>Walk dog</li>,\n]",
    },
    {
      label: "4. React uses keys to match elements across renders",
      body:
        "When the list re-renders — say a todo gets deleted — React compares the old keys to the new keys to figure out exactly which DOM nodes to remove, reuse, or reorder, instead of rebuilding the whole list.",
      code: "// before: keys [1, 2, 3]\n// after deleting id 2: keys [1, 3]\n// React removes only the <li key={2}> node",
    },
  ],
  realWorldIntro:
    "A social feed renders exactly this way — an array of post objects from the server gets mapped into an array of <Post> components, each keyed by its post id so likes, scroll position, and expanded comments stay attached to the right post even as new items load in above.",
  realWorldCode:
    "function Feed({ posts }) {\n  return (\n    <div>\n      {posts.map((post) => (\n        <Post key={post.id} data={post} />\n      ))}\n    </div>\n  );\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to compare rendering a list with stable id keys versus rendering the same list with array-index keys.",
    stages: [
      {
        label: "A simple mapped list",
        body:
          "Three fruits become three <li> elements. Each key is the fruit's own id field, something that belongs to the data itself and won't change if the list is reordered.",
        code: "const fruits = [\n  { id: \"a\", name: \"Apple\" },\n  { id: \"b\", name: \"Banana\" },\n  { id: \"c\", name: \"Cherry\" },\n];\nfruits.map((f) => <li key={f.id}>{f.name}</li>);",
      },
      {
        label: "Using array index as the key instead",
        body:
          "This also runs without errors — index is unique per render, so React won't complain. But the index isn't tied to the data; it's just \"where the item happens to sit right now.\"",
        code: "fruits.map((f, index) => <li key={index}>{f.name}</li>);\n// keys: 0, 1, 2",
      },
      {
        label: "Reordering with id keys: input state follows the item",
        body:
          "Suppose each <li> holds a text input the user typed into. If Cherry moves to the front and keys are still the stable ids, React matches key=\"c\" to the same DOM node wherever it lands — the typed text stays with Cherry.",
        code: "// new order: Cherry, Apple, Banana\n<li key=\"c\">Cherry <input /></li>\n<li key=\"a\">Apple <input /></li>\n<li key=\"b\">Banana <input /></li>",
      },
      {
        label: "Reordering with index keys: input state jumps to the wrong item",
        body:
          "With index keys, position 0 is always key=0 no matter what's there now. React thinks the item at position 0 is unchanged, so it reuses that input's DOM node and leftover typed text now appears next to Cherry instead of Apple.",
        code: "// new order, but keys are still by position:\n<li key={0}>Cherry <input /></li>  // had Apple's leftover text!\n<li key={1}>Apple <input /></li>\n<li key={2}>Banana <input /></li>",
      },
      {
        label: "The fix: always prefer a stable, unique id",
        body:
          "Array-index keys are only safe for lists that never reorder, filter, or have items added/removed in the middle. Whenever items are an id from a database or generated once, use that as the key instead.",
        code: "// safest default:\nitems.map((item) => <Row key={item.id} {...item} />);",
      },
    ],
  },
  quizQuestion:
    "A todo list re-renders after the user deletes the second item out of three. Why does React need a key on each <li> to handle this well?",
  quizCode:
    "todos.map((todo) => <li key={todo.id}>{todo.text}</li>)",
  quizOptions: [
    {
      key: "a",
      label:
        "Keys let React match old elements to new ones by identity, so it only removes the deleted item's DOM node instead of re-rendering the whole list from scratch",
      correct: true,
    },
    {
      key: "b",
      label:
        "Keys are required purely to silence a console warning and have no effect on how React updates the actual DOM",
      correct: false,
    },
    {
      key: "c",
      label:
        "Keys tell the browser which CSS class to apply to each list item",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Exactly — stable keys let React see \"item 2 disappeared, items 1 and 3 are unchanged,\" so it can make a surgical update instead of tearing down and rebuilding every list item.",
  quizFeedbackIncorrect:
    "Not quite — keys aren't styling and aren't just cosmetic; they're the identity React uses to match elements across renders, which is what makes efficient, correct list updates possible.",
  takeaway:
    "Use .map() to turn an array of data into an array of components, and give each one a key that's a stable, unique id from the data itself. Good keys let React track which items actually changed; index-based keys can silently mix up state when a list reorders.",
};

export default content;
