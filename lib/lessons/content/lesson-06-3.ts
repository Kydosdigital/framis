import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 3,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "Lists and keys: rendering many components from an array",
  minutes: 22,
  concept:
    "Real apps rarely render just one of something — a feed has many posts, an inbox has many messages — and React handles this by letting you map an array of data straight into an array of JSX elements using .map(). Each item in the data array gets transformed into one component, so a list of 50 comments becomes 50 <Comment> elements returned side by side inside something like a <ul>. React requires every element produced this way to carry a special key prop, a stable, unique identifier for that item, usually an id from the data rather than the item's position in the array. React uses these keys behind the scenes to match up old elements with new ones across re-renders, so it can tell \"this is the same comment, just moved\" instead of tearing everything down and rebuilding it from scratch. The transformation itself — .map() over an array of objects, producing a new array shaped for display, plus .filter() to drop items and another .map() to update just one — is completely ordinary JavaScript with nothing React-specific about it, and that's exactly what this lesson's sandbox has you write and run for real.",
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
    kind: "code",
    language: "javascript",
    challenge:
      "Model exactly what a todo list's JSX does structurally, minus the JSX itself: write renderRows to .map() todos into { key, label } rows, toggleTodo to flip one todo's done flag by returning a new array, and removeTodo to drop one todo with .filter(). Run all three and print the rows before and after each change.",
    starterCode:
      "const todos = [\n  { id: 1, text: \"Buy milk\", done: false },\n  { id: 2, text: \"Walk dog\", done: true },\n  { id: 3, text: \"Write code\", done: false },\n];\n\n// Models: todos.map(todo => <li key={todo.id}>{todo.text}</li>)\nfunction renderRows(list) {\n  return list.map(function (todo) {\n    const mark = todo.done ? \"[x]\" : \"[ ]\";\n    return { key: todo.id, label: mark + \" \" + todo.text };\n  });\n}\n\nconst rows = renderRows(todos);\nfor (const row of rows) {\n  console.log(row.key, row.label);\n}\n\n// Toggling returns a brand-new array — React re-renders the list from\n// this new array, matching each element up to the old one by key\nfunction toggleTodo(list, id) {\n  return list.map(function (todo) {\n    if (todo.id === id) {\n      return { id: todo.id, text: todo.text, done: !todo.done };\n    }\n    return todo;\n  });\n}\n\nconst afterToggle = toggleTodo(todos, 2);\nconsole.log(\"---after toggling id 2---\");\nfor (const row of renderRows(afterToggle)) {\n  console.log(row.key, row.label);\n}\n\n// Removing a todo is just filtering it out of the array — its key\n// disappears too, which is exactly how React knows to remove that one\n// <li> and leave the others completely untouched\nfunction removeTodo(list, id) {\n  return list.filter(function (todo) {\n    return todo.id !== id;\n  });\n}\n\nconst afterRemove = removeTodo(afterToggle, 1);\nconsole.log(\"---after removing id 1---\");\nfor (const row of renderRows(afterRemove)) {\n  console.log(row.key, row.label);\n}",
  },
  quizQuestion:
    "After removing \"Banana\" from the array, \"Cherry\"'s index-based key changes from 2 to 1. Why is that a real problem for React, even though the app still technically works?",
  quizCode:
    "const fruits = [\"Apple\", \"Banana\", \"Cherry\"];\nconst keyed = fruits.map((f, i) => ({ key: i, name: f }));\n// keys: 0, 1, 2\n\nconst afterRemoval = fruits.filter((f) => f !== \"Banana\");\nconst reKeyed = afterRemoval.map((f, i) => ({ key: i, name: f }));\n// keys: 0, 1 -- Cherry is now key 1, not key 2",
  quizOptions: [
    {
      key: "a",
      label:
        "It isn't really a problem — keys are just numbers, so which number ends up on which item doesn't affect anything React does",
      correct: false,
    },
    {
      key: "b",
      label:
        "React uses key to match each old rendered element to a new one; if Cherry's key silently shifts from 2 to 1, React can think whatever was at key 1 before (Banana) is still there, and may reuse Banana's old DOM node — and any state or focus it held — for Cherry instead",
      correct: true,
    },
    {
      key: "c",
      label:
        "React throws a runtime error any time two different renders produce different keys for what is conceptually the same list",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — index-based keys are only stable if the list itself never reorders, filters, or has items inserted in the middle. The moment an item is removed, every item after it shifts to a new index/key, and React can't tell that shift apart from those items actually being different data, which is exactly how leftover input state or focus ends up attached to the wrong row.",
  quizFeedbackIncorrect:
    "Not quite — the risk isn't a thrown error, it's silent misattribution: React matches elements old-to-new purely by key, so when Cherry's key changes from 2 to 1 just because Banana was removed, React can mistake it for whatever used to be at key 1, potentially carrying over that item's DOM state.",
  takeaway:
    "Use .map() to turn an array of data into an array of components, and give each one a key that's a stable, unique id from the data itself, never its position. Good keys let React track which items actually changed across .map()/.filter() updates; index-based keys can silently mix up state whenever the list reorders, filters, or grows in the middle.",
};

export default content;
