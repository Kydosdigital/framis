import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 2,
  phaseLabel: "APIS + HTTP + JSON",
  title: "Four verbs, one address: GET, POST, PUT, DELETE",
  minutes: 18,
  concept:
    "Every HTTP request has two parts that matter most: the URL you're pointing at, and the verb that says what you want to do to it. The same URL, like /orders/17, can mean four completely different things depending on the verb attached — GET fetches it, POST creates something new, PUT replaces it entirely, and DELETE removes it. This is a convention, not a law the internet enforces automatically — a server's own code decides what each verb actually does, but every well-built API follows it so client code can be predictable. GET is special: it's meant to be safe and repeatable, meaning calling it a hundred times never changes anything on the server, while POST, PUT, and DELETE are all expected to change something. Once you know the verb, you already know the shape of the response to expect before you've read a single line of the body.",
  conceptSimpler:
    "Think of the verb like the difference between reading a shared document, adding a new page, replacing a page, and tearing a page out — same document, four very different actions.",
  vizStages: [
    {
      label: "1. One address, many meanings",
      body:
        "The endpoint /orders/17 doesn't do anything by itself — it's just a name. What actually happens depends entirely on which verb rides along with the request.",
      code:
        "GET    /orders/17   -> fetch order 17\nPOST   /orders      -> create a brand-new order\nPUT    /orders/17   -> replace order 17 entirely\nDELETE /orders/17   -> remove order 17",
    },
    {
      label: "2. GET: read, never write",
      body:
        "GET asks for data and is not supposed to change anything on the server. Refresh a GET a hundred times and the server's state stays exactly the same — that's what makes it safe to retry without worrying.",
      code:
        "GET /orders/17\n\nresponse:\n{\"status\": 200, \"data\": {\"id\": 17, \"item\": \"desk lamp\", \"total\": 42}}",
    },
    {
      label: "3. POST: create something new",
      body:
        "POST hands the server a body of data and asks it to create a new thing from it. Because it's creating something, POST usually targets the collection (/orders), not one specific item — the server decides the new id.",
      code:
        "POST /orders\nbody: {\"item\": \"desk lamp\", \"total\": 42}\n\nresponse:\n{\"status\": 201, \"data\": {\"id\": 18, \"item\": \"desk lamp\", \"total\": 42}}",
    },
    {
      label: "4. PUT replaces, DELETE removes",
      body:
        "PUT targets one specific resource and replaces its entire contents with the new body you send. DELETE targets that same kind of specific resource but needs no body at all — it just tells the server to make that resource gone.",
      code:
        "PUT /orders/17\nbody: {\"item\": \"desk lamp\", \"total\": 39}\n\nDELETE /orders/17\n(no body needed)",
    },
  ],
  realWorldIntro:
    "A social app uses exactly this pattern for a single post: GET /posts/9 loads it for viewing, POST /posts creates a new one when you hit \"post\", PUT /posts/9 saves an edit, and DELETE /posts/9 runs when you tap the trash icon.",
  realWorldCode:
    "// same resource, four different verbs\nGET /posts/9\nPOST /posts     body: { text: \"hello world\" }\nPUT /posts/9    body: { text: \"hello world (edited)\" }\nDELETE /posts/9",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each verb below to see what it does to the same /orders/17 resource and what its response looks like.",
    stages: [
      {
        label: "GET — fetch it",
        body:
          "GET /orders/17 asks the server to hand back the current state of order 17 without changing anything. If it exists you get a 200 and the order's data; call it again right after and you'll get the identical response.",
        code:
          "GET /orders/17\n\nresponse:\n{\"status\": 200, \"data\": {\"id\": 17, \"item\": \"desk lamp\", \"total\": 42}}",
      },
      {
        label: "POST — create a new one",
        body:
          "POST /orders sends a request body describing a brand-new order. The server assigns it a fresh id and returns 201 Created along with the new resource, including the id you didn't get to choose.",
        code:
          "POST /orders\nbody: {\"item\": \"keyboard\", \"total\": 79}\n\nresponse:\n{\"status\": 201, \"data\": {\"id\": 18, \"item\": \"keyboard\", \"total\": 79}}",
      },
      {
        label: "PUT — replace it entirely",
        body:
          "PUT /orders/17 sends a full replacement body for that exact order. Whatever fields you leave out are gone in most implementations, because PUT means \"this is now the whole resource,\" not \"merge these changes in.\"",
        code:
          "PUT /orders/17\nbody: {\"item\": \"desk lamp\", \"total\": 39}\n\nresponse:\n{\"status\": 200, \"data\": {\"id\": 17, \"item\": \"desk lamp\", \"total\": 39}}",
      },
      {
        label: "DELETE — remove it",
        body:
          "DELETE /orders/17 asks the server to get rid of that resource. There's no body to send, and a second DELETE on the same id typically comes back 404, because by then there's nothing left to delete.",
        code:
          "DELETE /orders/17\n(no body)\n\nresponse:\n{\"status\": 204, \"data\": None}",
      },
    ],
  },
  quizQuestion:
    "You need to update the shipping address on order 500 by sending its complete new data. Which HTTP verb matches what you're doing?",
  quizCode:
    "?? /orders/500\nbody: {\"item\": \"desk lamp\", \"total\": 42, \"address\": \"221B Baker St\"}",
  quizOptions: [
    { key: "a", label: "POST — because you're sending a body of data", correct: false },
    { key: "b", label: "PUT — because you're replacing the resource at a known id with new data", correct: true },
    { key: "c", label: "DELETE — because you're changing something about the order", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — you already know the specific resource's id (500) and you're sending its complete new state, which is exactly what PUT means; POST is for creating new resources and DELETE removes them entirely.",
  quizFeedbackIncorrect:
    "Not quite — POST is for creating a brand-new resource (like a new order), and DELETE removes one entirely; updating an existing, identified resource with a full new body is what PUT is for.",
  takeaway:
    "The verb is a promise about intent: GET never changes anything, POST creates, PUT replaces, and DELETE removes — learn to read the verb first and you'll know what an API call does before you ever look at its body.",
};

export default content;
