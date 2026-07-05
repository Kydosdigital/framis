import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 2,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "The Filing Cabinet: Reading and Writing Files Without a Disk",
  minutes: 18,
  concept:
    "Every real program eventually needs to save information so it survives after the program stops running, and read it back later — that's what reading and writing files means. Under the hood, a filesystem is really just a big lookup table: a name like \"notes.txt\" maps to whatever content is stored under that name, so opening a file to read it works a lot like looking up a key in a dictionary. Since this playground has no real disk, we'll simulate one with a plain dictionary — files = {\"notes.txt\": \"hello world\"} — where the keys are filenames and the values are their contents. A read_file(name) function does a dictionary lookup and, exactly like inventory[\"cherries\"] in the last lesson, raises a KeyError the instant you ask for a file that was never created. A write_file(name, content) function does a dictionary assignment instead, which behaves very differently: it never raises an error, it just stores the content under that key — creating a brand-new file if the name doesn't exist yet, or silently replacing everything that used to be there if it does.",
  conceptSimpler:
    "Think of the dictionary as a filing cabinet — every folder tab is a filename, reading is pulling a folder out (empty-handed and alarmed if it isn't there), and writing is either dropping in a new folder or dumping out an old one and refilling it, no questions asked.",
  vizStages: [
    {
      label: "1. The filing cabinet",
      body:
        "files stands in for the whole disk: every key is a filename, every value is that file's contents. There's no real hard drive here — just a dictionary we agree to treat like one.",
      code:
        'files = {"notes.txt": "hello world", "todo.txt": "buy milk"}\nprint(files)\n\n{\'notes.txt\': \'hello world\', \'todo.txt\': \'buy milk\'}',
    },
    {
      label: "2. read_file does a lookup",
      body:
        "read_file(name) simply returns files[name]. Asking for a file that exists just hands back whatever string is stored there — no different from any other dictionary lookup you've already seen.",
      code:
        'def read_file(name):\n    return files[name]\n\nprint(read_file("notes.txt"))\n\nhello world',
    },
    {
      label: "3. A missing file raises KeyError",
      body:
        "Asking for a filename that was never added crashes exactly the way a missing dictionary key always has. This is the simulated version of a real filesystem's \"file not found\" error.",
      code: 'print(read_file("diary.txt"))\n\nKeyError: diary.txt',
    },
    {
      label: "4. write_file creates or overwrites",
      body:
        "write_file(name, content) just assigns files[name] = content. If the name is new, this creates a fresh entry; if the name already exists, this replaces its old content completely — and unlike read_file, it never raises an error either way.",
      code:
        'def write_file(name, content):\n    files[name] = content\n\nwrite_file("diary.txt", "dear diary...")\nwrite_file("notes.txt", "updated notes")\nprint(read_file("diary.txt"))\nprint(read_file("notes.txt"))\n\ndear diary...\nupdated notes',
    },
  ],
  realWorldIntro:
    "This dictionary-of-filenames model isn't just a teaching trick — cloud storage systems like Amazon S3 are literally a giant key-value store where a \"file\" is just a key such as users/42/avatar.png mapped to its bytes, and reading a key that was never uploaded fails exactly the way a missing dictionary key does.",
  realWorldCode:
    'photo = bucket["users/42/avatar.png"]\n\nKeyError: users/42/avatar.png',
  sandbox: {
    kind: "code",
    challenge:
      "write_file is supposed to update the grocery list, but read_file(\"todo.txt\") still prints the old \"buy milk\" — find the typo'd filename that's silently creating a brand-new file instead of overwriting the real one, and fix it.",
    starterCode:
      'files = {"notes.txt": "hello world", "todo.txt": "buy milk"}\n\ndef read_file(name):\n    return files[name]\n\ndef write_file(name, content):\n    files[name] = content\n\nwrite_file("todo.txtt", "buy milk, eggs, bread")\nprint(read_file("todo.txt"))',
  },
  quizQuestion: "What does this code print?",
  quizCode:
    'files = {"a.txt": "one"}\n\ndef write_file(name, content):\n    files[name] = content\n\nwrite_file("a.txt", "two")\nwrite_file("a.txt", "three")\nprint(files["a.txt"])',
  quizOptions: [
    { key: "a", label: "three", correct: true },
    { key: "b", label: "onetwothree", correct: false },
    { key: "c", label: "two", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — write_file replaces whatever was stored under that key entirely; each call overwrites the previous content, so only the most recent write, \"three\", survives.",
  quizFeedbackIncorrect:
    "Not quite — write_file doesn't append to existing content, it replaces the dictionary's value at that key outright. The last call, write_file(\"a.txt\", \"three\"), is the one that determines what's stored.",
  takeaway:
    "Reading a file is a lookup that fails loudly the moment a name doesn't exist; writing a file is an assignment that never complains — it either creates a new entry or silently replaces an old one. That asymmetry matters: a single typo'd filename in a write_file call won't raise any error at all, it'll just quietly create a stray file while the one you meant to update sits untouched.",
};

export default content;
