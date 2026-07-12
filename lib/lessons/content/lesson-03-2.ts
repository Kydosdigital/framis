import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 2,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "Dictionaries: looking things up by name, not position",
  minutes: 18,
  concept:
    "In the last lesson you saw a list as a row of numbered lockers — you reach a value by its position, like scores[0]. That's perfect when order is all you care about. But most real information isn't \"the third thing\" — it's a named thing. A person has an age and an email, not a slot 0 and a slot 1.\n\n" +
    "A dictionary solves that. It's a row of lockers with name tags instead of numbers: you find \"Maria's locker\" by her name, not by counting down the hall. In a dictionary, that name tag is called a key, and the thing inside the locker is its value.\n\n" +
    "You write a dictionary with curly braces { }, listing pairs of key: value. You read a value back with square brackets and the key — user[\"age\"] — instead of counting positions. It means \"give me whatever is stored under the key age\".\n\n" +
    "Writing works the same way. Assigning to a brand-new key adds it. Assigning to a key that already exists overwrites its value — a dictionary can only ever hold one value per key.\n\n" +
    "One thing to watch: asking for a key that was never added doesn't give you a blank. It stops the program with an error called a KeyError. So for now, only read keys you know are there — a safe way to handle keys that might be missing comes in a later lesson.",
  conceptSimpler:
    "A list is a row of numbered lockers — you open one by its number.\n\n" +
    "A dictionary is a row of lockers with name tags. You open one by its name (its key) and get what's inside (its value). Write it with curly braces as key: value pairs, and read it with name[\"key\"].\n\n" +
    "Look things up by name, not by counting positions.",
  vizStages: [
    {
      label: "1. Curly braces, and key: value pairs",
      body:
        "A dictionary is built with { }, and each entry is a key paired with a value, separated by a colon. This user dictionary has three name tags — \"name\", \"age\", and \"active\" — each with a value behind it.",
      code: 'user = {"name": "Priya", "age": 29, "active": True}',
    },
    {
      label: "2. Read a value: give the key, get the value",
      body:
        "Square brackets after the name look up a value by key, not by position. user[\"name\"] doesn't mean \"the name-th item\" — it means \"the value behind the name tag 'name'\". So this prints Priya, then 29.",
      code: 'print(user["name"])\nprint(user["age"])',
    },
    {
      label: "3. Writing: a new key adds, an existing key replaces",
      body:
        "Assigning to user[\"age\"] again doesn't make a second \"age\" — it overwrites the one value behind that tag. Assigning to a brand-new key, user[\"city\"], adds a new locker. After this, the dictionary has four entries, with age now 30.",
      code: 'user["age"] = 30\nuser["city"] = "Austin"\nprint(user)',
    },
    {
      label: "4. A missing key stops the program",
      body:
        "There's no \"email\" key here, so asking for user[\"email\"] doesn't return a blank — it stops with a KeyError, telling you that tag doesn't exist. Read only keys you know are there; a safe way to handle maybe-missing keys comes later.",
      code: 'print(user["email"])',
    },
  ],
  realWorldIntro:
    "Every profile you see in an app — a name, a photo, a follower count — is stored as a dictionary of named fields. The app reads profile[\"followers\"] by name, which is far clearer (and safer) than hoping the follower count happens to be the fourth thing in some list.",
  realWorldCode: 'user = {"id": 501, "plan": "pro"}\nif user["plan"] == "pro":\n    print("full access")',
  sandbox: {
    kind: "code",
    challenge:
      "Add a new key \"in_stock\" set to True to the product dictionary, then print the whole product dictionary to confirm the new key is there.",
    starterCode:
      'product = {"name": "Desk Lamp", "price": 24, "category": "lighting"}\nprint(product["name"], "costs", product["price"])\nprint(product)',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'car = {"make": "Honda", "year": 2019}\ncar["year"] = 2022\ncar["color"] = "blue"\nprint(car)',
  quizOptions: [
    { key: "a", label: "{'make': 'Honda', 'year': 2022, 'color': 'blue'}", correct: true },
    { key: "b", label: "{'make': 'Honda', 'year': 2019, 'year': 2022, 'color': 'blue'}", correct: false },
    { key: "c", label: "{'make': 'Honda', 'year': 2019, 'color': 'blue'}", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — assigning to car[\"year\"] again overwrites the existing value (2019 becomes 2022) rather than adding a duplicate, and car[\"color\"] adds a brand-new key since it didn't exist before.",
  quizFeedbackIncorrect:
    "Not quite — a dictionary can't hold two values under the same key. car[\"year\"] = 2022 replaces the old 2019, it doesn't add a second \"year\", so the final dictionary has exactly one value per key.",
  takeaway:
    "A dictionary stores values by name, not by position — like lockers with name tags. Write it with curly braces as key: value pairs, and read it with name[\"key\"]. Reach for one whenever your data is described by named fields instead of an ordered sequence.",
  explainers: [
    {
      id: "what-is-dictionary",
      term: "What's a Dictionary?",
      emoji: "🏷️",
      shortDef: "A dictionary stores values under names you choose (keys), so you look things up by name instead of by position.",
      longDef:
        "Where a list keeps values in numbered order, a dictionary keeps them under labels. You write it with curly braces and key: value pairs, like {\"name\": \"Priya\", \"age\": 29}. Then user[\"name\"] fetches the value stored under \"name\". The keys have no position or order you rely on — you always reach a value by its name.",
      whyMatters:
        "Real data is almost always a set of named fields — a user's name, email, and age; a product's title and price. A dictionary matches that shape exactly, so your code reads by meaningful names instead of fragile position numbers.",
      realWorldExample:
        "A row of lockers with name tags. You don't count to the fourth locker — you walk to the one labelled \"Maria\" and open it. The name tag is the key; what's inside is the value.",
      relatedTerms: ["key-vs-value", "what-is-keyerror"],
      expandedByDefault: true,
    },
    {
      id: "key-vs-value",
      term: "Key vs. Value",
      emoji: "🔑",
      shortDef: "The key is the name you look something up by; the value is what's stored under it.",
      longDef:
        "In {\"age\": 29}, \"age\" is the key and 29 is the value. You choose the keys yourself when you build the dictionary. Keys are usually short text labels; values can be anything — a number, some text, True/False, even another list or dictionary. You always give the key to get the value back.",
      whyMatters:
        "Keeping the two straight is what makes dictionaries click: you search by key, you receive a value. Mixing them up (looking something up by its value) is a common early tangle.",
      realWorldExample:
        "The name on the locker's tag is the key; the coat hanging inside is the value. You use the name to reach the coat, never the other way round.",
      relatedTerms: ["what-is-dictionary"],
    },
    {
      id: "add-vs-overwrite",
      term: "Adding vs. Overwriting a Key",
      emoji: "✍️",
      shortDef: "Assigning to a new key adds an entry; assigning to a key that already exists replaces its value.",
      longDef:
        "user[\"city\"] = \"Austin\" on a key that isn't there yet adds a new name-tagged locker. user[\"age\"] = 30 on a key that already exists doesn't make a second \"age\" — it swaps out the value behind that tag. A dictionary always holds exactly one value per key.",
      whyMatters:
        "This is how you keep a record up to date — change someone's status, bump a count — without ever ending up with two conflicting copies of the same field.",
      realWorldExample:
        "Sticking a fresh name tag on an empty locker adds one to the row. Swapping what's inside a locker that already has a tag replaces the contents — the tag itself stays single.",
      relatedTerms: ["what-is-dictionary"],
    },
    {
      id: "what-is-keyerror",
      term: "What's a KeyError?",
      emoji: "🚫",
      shortDef: "A KeyError is the error Python raises when you ask for a key that isn't in the dictionary.",
      longDef:
        "Asking for user[\"email\"] when there's no \"email\" key doesn't quietly return a blank — Python stops and reports a KeyError. For now, the fix is simply to read only keys you know are present. A dedicated way to handle keys that might be missing is coming in the Errors lesson later.",
      whyMatters:
        "A surprise KeyError is one of the most common early crashes. Knowing it just means \"that name tag isn't here\" turns a scary red error into an obvious, easy fix.",
      realWorldExample:
        "Walking up to the row of lockers and asking for \"Sam's locker\" when there's no Sam tag — you don't get an empty locker, you get told no such locker exists.",
      relatedTerms: ["what-is-dictionary"],
    },
  ],
};

export default content;
