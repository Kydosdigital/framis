import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 2,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "Dictionaries: Looking Things Up by Key Instead of Position",
  minutes: 18,
  concept:
    "A list stores values in order and you reach them by position — item[0], item[1], and so on. A dictionary stores values by name instead: you make up a label called a key, and Python remembers which value belongs to that key. You write a dictionary with curly braces as pairs of \"key\": value, and you read a value back out with square brackets, like user[\"age\"], instead of counting positions. This matters because real data is usually described by named fields, not by \"the third thing in the list\" — a user has an email and an age, not a slot 0 and a slot 1. Writing to a new key adds it, and writing to an existing key overwrites its value, but asking for a key that was never added crashes with a KeyError.",
  conceptSimpler:
    "A list is like a row of unlabeled lockers you open by number; a dictionary is like a row of lockers with name tags on them, so you find \"Maria's locker\" by her name, not by counting down the hall.",
  vizStages: [
    {
      label: "1. Curly braces, not square brackets",
      body:
        "A dictionary is built with { }, and each entry is a key paired with a value, separated by a colon. This user dictionary has three keys: \"name\", \"age\", and \"active\".",
      code: "user = {\"name\": \"Priya\", \"age\": 29, \"active\": True}",
    },
    {
      label: "2. Reading a value: give the key, get the value",
      body:
        "Square brackets after a dictionary name look up a value by key, not by position. user[\"name\"] doesn't mean \"the name-th item\" — it means \"whatever value is stored under the key 'name'\".",
      code: "print(user[\"name\"])\nprint(user[\"age\"])\n\nPriya\n29",
    },
    {
      label: "3. Writing: new key adds it, existing key replaces it",
      body:
        "Assigning to user[\"age\"] again doesn't create a duplicate — it overwrites the one value already stored under that key. Assigning to a brand-new key, like user[\"city\"], adds a new entry to the dictionary.",
      code: "user[\"age\"] = 30\nuser[\"city\"] = \"Austin\"\nprint(user)\n\n{'name': 'Priya', 'age': 30, 'active': True, 'city': 'Austin'}",
    },
    {
      label: "4. A missing key crashes — unless you check first",
      body:
        "Looking up a key that was never set raises a KeyError, just like a list index that's out of range. If a key might not exist, you either test with if before reading it, or wrap the read in try/except.",
      code: "print(user[\"email\"])\n\nKeyError: email",
    },
  ],
  realWorldIntro:
    "Every JSON response from a web API — a user profile, a product listing, a weather forecast — arrives as nested dictionaries, so reading response[\"temperature\"] instead of response[3] is exactly how real backend and frontend code pulls named fields out of real data.",
  realWorldCode: "user = {\"id\": 501, \"plan\": \"pro\", \"trial_used\": False}\nif user[\"plan\"] == \"pro\":\n    print(\"full access\")",
  sandbox: {
    kind: "code",
    challenge:
      "Add a \"in_stock\" key set to True to the product dictionary, then print a message using the product's \"name\" and \"price\" keys.",
    starterCode:
      "product = {\"name\": \"Desk Lamp\", \"price\": 24, \"category\": \"lighting\"}\nprint(product[\"name\"], \"costs $\" + str(product[\"price\"]))\nprint(product)",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "car = {\"make\": \"Honda\", \"year\": 2019}\ncar[\"year\"] = 2022\ncar[\"color\"] = \"blue\"\nprint(car)",
  quizOptions: [
    { key: "a", label: "{'make': 'Honda', 'year': 2022, 'color': 'blue'}", correct: true },
    { key: "b", label: "{'make': 'Honda', 'year': 2019, 'year': 2022, 'color': 'blue'}", correct: false },
    { key: "c", label: "{'make': 'Honda', 'year': 2019, 'color': 'blue'}", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — assigning to car[\"year\"] again overwrites the existing value (2019 becomes 2022) rather than adding a duplicate entry, and car[\"color\"] adds a brand-new key since it didn't exist before.",
  quizFeedbackIncorrect:
    "Not quite — a dictionary can't hold two values under the same key. Assigning car[\"year\"] = 2022 replaces the old 2019, it doesn't add a second \"year\" entry, so the final dictionary has exactly one value per key.",
  takeaway:
    "Dictionaries store values by key instead of by position, so you read and write them with name[\"key\"] rather than counting index positions. Reach for a dictionary whenever your data is naturally described by named fields instead of an ordered sequence.",
};

export default content;
