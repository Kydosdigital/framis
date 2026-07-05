import type { LessonData } from "../types";

const content: LessonData = {
  num: 6,
  orderIndex: 2,
  phaseLabel: "REACT BASICS + COMPONENTS",
  title: "Props, curly braces, and children: the syntax that runs JSX",
  minutes: 20,
  concept:
    "Props are how a parent component hands information to a child component, the same way arguments get passed into a regular function. Instead of a child reaching out and grabbing data itself, the parent writes it directly onto the JSX tag, like <ProfileCard name=\"Ava\" />, and React collects everything written that way into a single object the child receives as its one function argument. Props always flow one direction, parent to child, and a child is not allowed to change the props object it was given; if the data needs to change, that has to happen in the parent, which then re-renders and hands the child fresh props. Reading and writing that data inside JSX depends on a handful of syntax rules that are easy to use without ever naming: anything inside a pair of curly braces { } is a real JavaScript expression — a variable, a calculation, a function call, a ternary — dropped straight into the markup, though it can never be a statement like an if or a for loop. Curly braces are also how you render conditionally: {isLoggedIn && <Welcome />} shows something only when a value is truthy, and {isPremium ? <Badge /> : null} picks between two alternatives. A fragment, written <>...</>, lets a component return several sibling elements without wrapping them in an extra <div> that would otherwise clutter the actual DOM. And children — whatever gets nested between a component's opening and closing tag — arrives as just another prop, props.children, which is what makes wrapper components like Card or Modal possible: they render whatever content the caller placed inside them.",
  conceptSimpler:
    "Props are like a form a manager fills out and hands to an employee — the employee reads the instructions and does the work, but they don't get to scribble changes onto the manager's copy. The curly braces in JSX are the blanks on that form: whatever JavaScript expression you write there gets filled in, whether that's a name, a calculation, or a yes/no decision about whether to show something at all.",
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
        "ProfileCard destructures the fields it needs straight out of its props argument and uses them inside curly-brace expressions in the JSX it returns. It never sees where the values came from — it just displays them.",
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
    "Every product grid on a shopping site is one ProductCard component reused dozens of times — the layout and styling live in one place, and props like title, price, and image supply what's different about each item. A wrapper like ProductCard often uses a fragment internally, and a Layout component wrapping a whole page relies on props.children to display whatever page was placed inside it.",
  realWorldCode:
    "function ProductCard({ title, price, image, inStock }) {\n  return (\n    <>\n      <img src={image} alt={title} />\n      <h4>{title}</h4>\n      <span>${price}</span>\n      {inStock ? <p>In stock</p> : <p>Sold out</p>}\n    </>\n  );\n}",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each stage to see the actual JSX syntax rules in action — expressions in curly braces, conditional rendering with && and ternaries, fragments, and the children prop that makes composition possible. These snippets are real, accurate JSX; this sandbox can't execute JSX directly, so read each one closely rather than running it.",
    stages: [
      {
        label: "Curly braces hold any JS expression, not just a variable",
        body:
          "{ } isn't a template placeholder for text alone — whatever's inside is evaluated as a real JavaScript expression, so it can be a variable, a calculation, or a method call. It can never be a statement: {if (x) {...}} would be a syntax error, but {x > 0 ? \"positive\" : \"negative\"} works fine because it's an expression.",
        code: "<h3>{name.toUpperCase()}</h3>\n<p>{price * quantity}</p>\n<span>{items.length} items</span>",
      },
      {
        label: "Conditional rendering with &&",
        body:
          "{condition && <Something />} shows <Something /> only when condition is truthy. If condition is false, null, or undefined, React renders nothing at all for that expression — it simply skips it, leaving no trace in the output.",
        code: "function Inbox({ unreadCount }) {\n  return (\n    <>\n      <h2>Inbox</h2>\n      {unreadCount > 0 && <p>You have {unreadCount} unread messages</p>}\n    </>\n  );\n}",
      },
      {
        label: "The && gotcha: falsy numbers still render",
        body:
          "React renders nothing for false, null, and undefined — but 0 is falsy too, and React DOES render the number 0. So {count && <p>{count} items</p>} with count equal to 0 doesn't render nothing; it renders the literal text \"0\" on the page, which is rarely what anyone intended.",
        code: "// count = 0\n{count && <p>{count} items</p>}\n// renders the text \"0\", not nothing!\n\n// the safe fix: force a real boolean first\n{count > 0 && <p>{count} items</p>}",
      },
      {
        label: "Conditional rendering with a ternary",
        body:
          "&& can only show something or show nothing. When you need to choose between two different things to render, a ternary does the job: {condition ? <A /> : <B />}.",
        code: "function StatusBadge({ isOnline }) {\n  return isOnline\n    ? <span className=\"badge green\">Online</span>\n    : <span className=\"badge gray\">Offline</span>;\n}",
      },
      {
        label: "Fragments group elements without an extra div",
        body:
          "A component can only return one element, so returning two sibling elements side by side normally means wrapping them in a <div>. A fragment, written <>...</>, groups them for React without adding any extra node to the actual DOM.",
        code: "function NameTag({ first, last }) {\n  return (\n    <>\n      <h3>{first}</h3>\n      <p>{last}</p>\n    </>\n  );\n}\n// renders <h3> and <p> as siblings — no wrapping <div> in the DOM",
      },
      {
        label: "children: composition through nesting",
        body:
          "Whatever JSX is written between a component's opening and closing tag is passed to that component automatically as props.children. This is what lets a component like Card wrap arbitrary content without knowing in advance what that content will be.",
        code: "function Card({ children }) {\n  return <div className=\"card\">{children}</div>;\n}\n\n// usage — anything nested here becomes Card's props.children:\n<Card>\n  <h3>Ava</h3>\n  <p>Engineer</p>\n</Card>",
      },
    ],
  },
  quizQuestion:
    "unreadCount is 0. What actually appears on the page for the expression below?",
  quizCode:
    "<p>{unreadCount && \"You have \" + unreadCount + \" unread messages\"}</p>",
  quizOptions: [
    {
      key: "a",
      label:
        "Nothing renders inside the <p> — 0 is falsy, so React treats the whole expression as empty, same as false or null",
      correct: false,
    },
    {
      key: "b",
      label:
        "The literal text \"0\" appears — React skips rendering for false, null, and undefined, but 0 is a real value it still displays, so the && short-circuits to 0 and that 0 gets rendered",
      correct: true,
    },
    {
      key: "c",
      label:
        "A JavaScript error is thrown because unreadCount isn't a boolean",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Exactly — && evaluates unreadCount, finds it falsy, and short-circuits to that same value (0) rather than evaluating the right-hand side. Unlike false/null/undefined, React does render 0, so the page ends up showing a stray \"0\". The usual fix is to force a boolean, like {unreadCount > 0 && ...}.",
  quizFeedbackIncorrect:
    "Not quite — && short-circuits on the falsy value itself, which here is the number 0, not false. React skips rendering false/null/undefined, but it does render 0, so that number shows up literally on the page. This is a well-known React gotcha worth watching for.",
  takeaway:
    "Props flow one way, parent to child, arriving as a single read-only object. Everything JSX can do beyond plain markup comes from a small set of rules: curly braces hold real JS expressions, && and ternaries handle conditional rendering (with 0 as a classic gotcha for &&), fragments group elements without extra DOM nodes, and children is just another prop that makes wrapping and composition possible.",
};

export default content;
