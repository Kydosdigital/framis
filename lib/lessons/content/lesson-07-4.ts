import type { LessonData } from "../types";

const content: LessonData = {
  num: 7,
  orderIndex: 4,
  phaseLabel: "APIS + HTTP + JSON",
  title: "Putting it together: fetch, transform, and send back",
  minutes: 24,
  concept:
    "A real frontend-to-backend flow is rarely a single fetch — it's usually fetch, then reshape what comes back into what the screen (or the next request) actually needs. .filter() narrows a list down to what matters, .map() reshapes each item, and .reduce() collapses a list into one number, and all three read naturally right after an await response.json(). Sending data back the other way follows the same JSON bridge from lesson one: build a plain JS object shaped like what the server expects, then JSON.stringify it into the text a POST request actually carries as its body. Chaining all of this together — await fetch, await .json(), filter/map/reduce, JSON.stringify a new payload, await a second fetch — is the real shape of what a button click in a real app triggers: load data, transform it, act on it.",
  conceptSimpler:
    "Think of it like receiving a shipment, unpacking only the boxes you actually need, relabeling them for the next leg of the trip, and handing that new, smaller shipment off to the next courier — fetch gets the shipment, filter/map repack it, and the next fetch sends it onward.",
  vizStages: [
    {
      label: "1. fetch, then unwrap the list",
      body:
        "The same two-await pattern from before, just with an array on the other end instead of a single object — response.json() resolves to a whole list you can immediately work with.",
      code:
        "const response = await fetch(\"/api/products\", productsMock);\nconst products = await response.json();\nconsole.log(products.length);",
    },
    {
      label: "2. filter narrows, map reshapes",
      body:
        ".filter() keeps only the items matching some condition; .map() turns each surviving item into something new. Chaining them is one of the most common patterns in real frontend code.",
      code:
        "const available = products.filter(p => p.inStock);\nconst names = available.map(p => p.name);",
    },
    {
      label: "3. reduce collapses a list into one value",
      body:
        "reduce walks the list carrying an accumulator forward, which is exactly how you'd total up prices, count matches, or build up any single summary value from a list.",
      code: "const total = available.reduce((sum, p) => sum + p.price, 0);",
    },
    {
      label: "4. Build a payload, stringify it, send it onward",
      body:
        "Sending data is the mirror image of receiving it: build a plain object shaped the way the server expects, JSON.stringify it into request-body text, and fetch again — this time to create something.",
      code:
        "const newOrder = { items: available.map(p => p.id), total: total };\nconst payload = JSON.stringify(newOrder);\nawait fetch(\"/api/orders\", confirmationMock);",
    },
  ],
  realWorldIntro:
    "This is the exact rhythm behind a real \"place order\" button: fetch the cart contents, filter out anything unavailable, map it into the shape the checkout API wants, JSON.stringify it as the POST body, and fetch again to submit it — load, transform, act, in that order.",
  realWorldCode:
    "async function checkout(cartItems) {\n  const inStock = cartItems.filter(item => item.inStock);\n  const total = inStock.reduce((sum, item) => sum + item.price, 0);\n\n  const response = await fetch(\"/api/orders\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify({ items: inStock.map(i => i.id), total }),\n  });\n\n  return await response.json();\n}",
  sandbox: {
    kind: "code",
    challenge:
      "Fetch a mock product list, filter it down to in-stock items, map + reduce them into a names list and a total, JSON.stringify a new order payload from that, then fetch a second mock endpoint to confirm the order.",
    starterCode:
      "async function fetchProducts() {\n  const response = await fetch(\"/api/products\", [\n    { id: 1, name: \"Keyboard\", price: 79, inStock: true },\n    { id: 2, name: \"Monitor\", price: 210, inStock: false },\n    { id: 3, name: \"Mouse\", price: 25, inStock: true }\n  ]);\n  return await response.json();\n}\n\nasync function buildOrderSummary() {\n  const products = await fetchProducts();\n\n  const available = products.filter(p => p.inStock);\n  const names = available.map(p => p.name);\n  const total = available.reduce((sum, p) => sum + p.price, 0);\n\n  console.log(\"in stock:\", names.join(\", \"));\n  console.log(\"total if you bought all in-stock items: $\" + total);\n\n  const newOrder = {\n    items: available.map(p => p.id),\n    total: total\n  };\n\n  const payload = JSON.stringify(newOrder);\n  console.log(\"POST body:\", payload);\n\n  const response = await fetch(\"/api/orders\", { id: 501, status: \"created\" });\n  const confirmation = await response.json();\n  console.log(\"order \" + confirmation.id + \" status: \" + confirmation.status);\n}\n\nbuildOrderSummary();",
    language: "javascript",
  },
  quizQuestion:
    "available.reduce((sum, p) => sum + p.price, 0) runs on [{price:79},{price:25}]. What does the second argument, 0, actually do?",
  quizCode:
    "const available = [{ price: 79 }, { price: 25 }];\nconst total = available.reduce((sum, p) => sum + p.price, 0);\nconsole.log(total);",
  quizOptions: [
    {
      key: "a",
      label: "It's the starting value of sum before the first item is added in — without it, sum would start as the first item itself",
      correct: true,
    },
    { key: "b", label: "It's ignored — reduce always starts counting from the first array element", correct: false },
    { key: "c", label: "It sets the number of items reduce is allowed to process", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — that second argument is reduce's initial accumulator value; sum starts at 0 and each item's price gets added on top, giving 104 here. Leave it out and sum would start as the first item itself instead of 0.",
  quizFeedbackIncorrect:
    "Not quite — the second argument to reduce sets the starting value of the accumulator (sum here). It isn't a limit on how many items get processed, and it does matter: without it, sum would default to the array's first element instead of 0.",
  takeaway:
    "A real feature is rarely one fetch — it's fetch, reshape the result with filter/map/reduce, build a new JSON payload with JSON.stringify, and fetch again to act on it. That load-transform-act rhythm is exactly what real frontend code does every time a user clicks something.",
};

export default content;
