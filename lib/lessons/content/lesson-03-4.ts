import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 4,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "Nested data: lists of dictionaries, dictionaries of lists",
  minutes: 22,
  concept:
    "Lists and dictionaries don't only hold plain numbers and text — a list can hold dictionaries, and a dictionary can hold lists. That's how real records are actually shaped, and it's simpler than it sounds once you have the right picture.\n\n" +
    "Think of a filing cabinet. A \"list of dictionaries\" is a drawer full of folders, where every folder has the same labelled tabs — name, age, email. The drawer is the list; each folder is one record (a dictionary). So users[0] hands you one whole folder — a full record — not a single value yet.\n\n" +
    "A \"dictionary of lists\" flips that around: one folder per category, with a whole list of things inside each. team[\"forwards\"] isn't one name — it's the entire list of every forward.\n\n" +
    "To reach a value that's two layers deep, work from the outside in, one step at a time. Pull the outer layer into its own named variable first, then reach into that variable for the next layer. Naming each step as you go — \"this is one user\", \"these are their grades\" — is what keeps nested data readable instead of a confusing pile of brackets.",
  conceptSimpler:
    "Picture a filing cabinet.\n\n" +
    "A list of dictionaries is a drawer full of folders, where every folder has the same labelled tabs (name, age). The drawer is the list; each folder is one record.\n\n" +
    "A dictionary of lists is the other way round: one folder per category, each holding a whole list inside.\n\n" +
    "To reach something deep, open one layer at a time — grab the folder, then look inside it — naming each step as you go.",
  vizStages: [
    {
      label: "1. A list of dictionaries: each item is a full record",
      body:
        "users is a list, and every item inside it is a dictionary with the same keys. users[0] hands you the whole first folder — {'name': 'Priya', 'age': 29} — not a single value yet.",
      code: 'users = [{"name": "Priya", "age": 29}, {"name": "Sam", "age": 34}]\nprint(users[0])',
    },
    {
      label: "2. Reach one field: grab the folder, then look inside",
      body:
        "users[0] gives you the first folder. Save it as row, and now row[\"name\"] reaches one value inside it — Priya. Two easy steps instead of one confusing jump.",
      code: 'row = users[0]\nprint(row["name"])',
    },
    {
      label: "3. Looping over a list of dictionaries",
      body:
        "A for loop hands you one whole folder per pass, so u is a full record each time round — which is why u[\"name\"] and u[\"age\"] both work directly inside the loop. This prints \"Priya is 29\", then \"Sam is 34\".",
      code: 'for u in users:\n    print(u["name"], "is", u["age"])',
    },
    {
      label: "4. Flip it round: a dictionary of lists",
      body:
        "Now the outer container is a dictionary, and each key holds a whole list. team[\"forwards\"] gives you the entire list [\"Nia\", \"Ola\"]. Save it as forwards, and forwards[0] reaches the first name, Nia.",
      code: 'team = {"forwards": ["Nia", "Ola"], "defense": ["Kim"]}\nforwards = team["forwards"]\nprint(forwards)\nprint(forwards[0])',
    },
  ],
  realWorldIntro:
    "This is the shape almost all real app data takes. A social feed is a list of posts, where each post is a record (a dictionary) with a caption, a like-count, and a list of comments inside it. Reaching one comment means opening those layers one at a time, exactly like here.",
  realWorldCode:
    'orders = [{"id": 1, "total": 42}, {"id": 2, "total": 88}]\nfor order in orders:\n    print("Order", order["id"], "total", order["total"])',
  sandbox: {
    kind: "code",
    challenge:
      "Each student is a dictionary with a \"grades\" list inside it. Inside the loop, pull each student's grades list out into its own variable, then print their name alongside their first grade.",
    starterCode:
      'students = [{"name": "Alex", "grades": [88, 92, 79]}, {"name": "Bianca", "grades": [95, 91, 100]}]\nfor student in students:\n    print(student["name"])',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'inventory = {"fruit": ["apple", "pear"], "veg": ["carrot"]}\nfruit_list = inventory["fruit"]\nprint(fruit_list[1])',
  quizOptions: [
    { key: "a", label: "pear", correct: true },
    { key: "b", label: "apple", correct: false },
    { key: "c", label: "['apple', 'pear']", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — inventory[\"fruit\"] first reaches the list [\"apple\", \"pear\"] and stores it as fruit_list, then fruit_list[1] indexes into that list to get its second item, \"pear\".",
  quizFeedbackIncorrect:
    "Not quite — work outside-in: inventory[\"fruit\"] gives you the list [\"apple\", \"pear\"] first, stored as fruit_list, and only then does fruit_list[1] index into it, landing on \"pear\" (position 1, the second item).",
  takeaway:
    "Containers nest: a list of dictionaries is a drawer of folders (records), and a dictionary of lists is folders that each hold a whole list. Reach a deep value by working outside-in, naming each layer as you open it. Almost all real data you load is shaped this way.",
  explainers: [
    {
      id: "what-is-nested",
      term: "What's \"Nested\" Data?",
      emoji: "🗂️",
      shortDef: "Nested data means containers inside containers — a list holding dictionaries, or a dictionary holding lists.",
      longDef:
        "A list's items don't have to be single values; they can be whole dictionaries. A dictionary's values don't have to be single values either; they can be whole lists. Combining them is how one variable can hold a rich, structured record instead of a flat pile of numbers. There's no new syntax — it's the same lists and dictionaries you know, placed inside each other.",
      whyMatters:
        "Real information is layered — a person has several orders, each order has several items. Nesting lets your data match that real shape, which is why nearly everything you load from a file or a site is nested.",
      realWorldExample:
        "A filing cabinet: a drawer (the outer container) holds folders, and each folder can hold many pages. Containers within containers — that's nesting.",
      relatedTerms: ["list-of-dicts", "reaching-deep"],
      expandedByDefault: true,
    },
    {
      id: "list-of-dicts",
      term: "A List of Dictionaries (a Table)",
      emoji: "📇",
      shortDef: "A list where every item is a dictionary — one record per item, all with the same keys.",
      longDef:
        "This is the single most common data shape you'll meet. The list is the collection of records; each dictionary is one record with named fields. users[0] gives you a whole record (a dictionary), and only a second step — users[0][\"name\"], or saving it as row first — reaches a single field inside it.",
      whyMatters:
        "A list of user records, order records, or message records is what almost every real dataset looks like. Recognising \"this is a list of dictionaries\" tells you instantly how to loop it and how to read a field.",
      realWorldExample:
        "One drawer of the filing cabinet, full of folders that all have the same labelled tabs. The drawer is the list; each folder is one record.",
      relatedTerms: ["what-is-nested", "dict-of-lists"],
    },
    {
      id: "dict-of-lists",
      term: "A Dictionary of Lists (Categories)",
      emoji: "🗃️",
      shortDef: "A dictionary where each value is a whole list — one category per key, each holding many items.",
      longDef:
        "Instead of one record per item, you group items by a named category. team[\"forwards\"] isn't a single name — it's the entire list of forwards. Reaching one name is two steps: pull the list out under its key, then index into that list.",
      whyMatters:
        "Whenever data is naturally grouped — players by position, tasks by day, products by aisle — a dictionary of lists holds each group under a clear name, ready to loop over one group at a time.",
      realWorldExample:
        "One folder per category in the cabinet — a \"forwards\" folder, a \"defense\" folder — and each folder holds a whole list of names, not just one.",
      relatedTerms: ["list-of-dicts"],
    },
    {
      id: "reaching-deep",
      term: "Reaching a Deep Value: One Layer at a Time",
      emoji: "🔎",
      shortDef: "Unwrap nested data outside-in — pull each layer into a named variable before reaching into the next.",
      longDef:
        "Rather than writing one long chain of brackets and hoping, take it step by step: save the outer item (row = users[0]), then read from that (row[\"name\"]). Each step gives you something you can name and check, so a mistake is easy to spot. Once it's second nature, you can chain the steps — but naming layers is how you get it right while learning.",
      whyMatters:
        "Long bracket chains like users[0][\"grades\"][2] are where beginners get lost. Naming each layer turns one confusing line into a few obvious ones, and makes wrong answers easy to trace.",
      realWorldExample:
        "You don't grab a single page from the cabinet in one motion — you open the drawer, pull the right folder, then find the page. Same order, every time.",
      relatedTerms: ["what-is-nested", "list-of-dicts"],
    },
  ],
};

export default content;
