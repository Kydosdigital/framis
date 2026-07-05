import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 4,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "Nested Data: Lists of Dicts, Dicts of Lists",
  minutes: 22,
  concept:
    "Lists and dictionaries don't have to hold plain numbers and strings — a list can hold dictionaries, and a dictionary can hold lists, and that's how real-world records actually get represented. A \"list of dicts\" is the shape of a table: each dictionary is one row with named fields, and the list is the collection of all the rows, so users[0] gives you one whole user record as a dictionary. A \"dict of lists\" flips that around: each key points to a whole list of values, like a roster where team[\"forwards\"] is an entire list of every forward's name, not just one name. To reach a value two levels deep, work outside-in one step at a time: pull the first layer out into its own named variable, then index into that variable for the next layer. That habit — name what each step gives you before going deeper — is what keeps nested data readable instead of confusing.",
  conceptSimpler:
    "Think of a filing cabinet: a list of dicts is a drawer full of folders where every folder has the same labeled tabs (name, age, email), while a dict of lists is one folder per category with a full list of names inside each — same information, organized from a different direction.",
  vizStages: [
    {
      label: "1. A list of dicts: each item is a full record",
      body:
        "users is a list, and every item inside it is a dictionary with the same set of keys. users[0] gives you the whole first dictionary — not a single value yet.",
      code: "users = [{\"name\": \"Priya\", \"age\": 29}, {\"name\": \"Sam\", \"age\": 34}]\nprint(users[0])\n\n{'name': 'Priya', 'age': 29}",
    },
    {
      label: "2. Reach one field: grab the record, then index into it",
      body:
        "users[0] hands you the first dictionary as a whole. Save it as row, and now row[\"name\"] reaches one value inside it — one step at a time instead of guessing at the whole path in one go.",
      code: "row = users[0]\nprint(row[\"name\"])\n\nPriya",
    },
    {
      label: "3. Looping over a list of dicts",
      body:
        "A for loop hands you one whole dictionary per iteration, so u is a full record each time through — that's why u[\"name\"] and u[\"age\"] both work directly inside the loop body.",
      code: "for u in users:\n    print(u[\"name\"], \"is\", u[\"age\"])\n\nPriya is 29\nSam is 34",
    },
    {
      label: "4. Flip it around: a dict of lists",
      body:
        "Here the outer container is a dictionary, and each key points to a whole list. team[\"forwards\"] gives you the entire list of forwards — save that as forwards, then forwards[0] reaches the first name inside it.",
      code: "team = {\"forwards\": [\"Nia\", \"Ola\"], \"defense\": [\"Kim\"]}\nforwards = team[\"forwards\"]\nprint(forwards)\nprint(forwards[0])\n\n['Nia', 'Ola']\nNia",
    },
  ],
  realWorldIntro:
    "This is exactly what a JSON API response looks like in practice — an endpoint like /orders returns a list of dicts (one dict per order, each with an id and a total), and a dashboard endpoint might return a dict of lists (one key per category, each holding a list of matching records).",
  realWorldCode:
    "orders = [{\"id\": 1, \"total\": 42}, {\"id\": 2, \"total\": 88}]\nfor order in orders:\n    print(\"Order\", order[\"id\"], \"total $\" + str(order[\"total\"]))",
  sandbox: {
    kind: "code",
    challenge:
      "Inside the loop, pull each student's grades list out into its own variable, then print their name alongside their first grade.",
    starterCode:
      "students = [{\"name\": \"Alex\", \"grades\": [88, 92, 79]}, {\"name\": \"Bianca\", \"grades\": [95, 91, 100]}]\nfor student in students:\n    print(student[\"name\"])",
  },
  quizQuestion: "What does the following code print?",
  quizCode:
    "inventory = {\"fruit\": [\"apple\", \"pear\"], \"veg\": [\"carrot\"]}\nfruit_list = inventory[\"fruit\"]\nprint(fruit_list[1])",
  quizOptions: [
    { key: "a", label: "pear", correct: true },
    { key: "b", label: "apple", correct: false },
    { key: "c", label: "['apple', 'pear']", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — inventory[\"fruit\"] first reaches the list [\"apple\", \"pear\"] and stores it as fruit_list, and then fruit_list[1] indexes into that list to get its second item, \"pear\".",
  quizFeedbackIncorrect:
    "Not quite — work outside-in: inventory[\"fruit\"] gives you the list [\"apple\", \"pear\"] first, stored as fruit_list, and only then does fruit_list[1] index into that list, landing on \"pear\" (position 1, the second item).",
  takeaway:
    "Containers can nest — a list of dicts is a collection of full records, and a dict of lists is a set of categories each holding many values — and you reach a specific value by working outside-in, naming each layer as you unwrap it. Most real data you'll ever load from a file or an API is shaped this way.",
};

export default content;
