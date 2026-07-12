import type { LessonData } from "../types";

const content: LessonData = {
  num: 4,
  orderIndex: 2,
  phaseLabel: "FILE I/O + ERRORS + DEBUGGING",
  title: "Saving your work: reading and writing files",
  minutes: 18,
  concept:
    "Every real program eventually needs to save information so it survives after the program stops, and read it back later. That's what reading and writing files is for. Behind the scenes, the place your files live is really just a big set of names paired with contents — the name \"notes.txt\" points to whatever text is stored under it. That should sound familiar: it works almost exactly like a dictionary.\n\n" +
    "Picture a wall of labelled mailboxes. Each mailbox has a name on it (the filename) and holds some contents (the file's text). Reading a file is opening the mailbox with that name and taking out what's inside. Writing a file is putting contents into the mailbox with that name.\n\n" +
    "This playground has no real disk, so we'll stand one in with a plain dictionary — files = {\"notes.txt\": \"hello world\"} — where the keys are filenames and the values are their contents.\n\n" +
    "Reading and writing behave very differently, and the difference matters. read_file(name) does a dictionary lookup, so — exactly like asking a dictionary for a missing key — asking for a mailbox that was never set up raises a KeyError. write_file(name, content) does a dictionary assignment, and assignment never complains: a new name creates a fresh mailbox, while a name that already exists has its old contents silently wiped and replaced.\n\n" +
    "That asymmetry is the whole lesson: reading a missing file fails loudly, but writing to the wrong name fails silently — it just makes a stray mailbox while the one you meant to update sits untouched.",
  conceptSimpler:
    "Picture a wall of labelled mailboxes.\n\n" +
    "The label is the filename; what's inside is the file's contents. Reading opens the mailbox and takes out what's there — and if there's no mailbox with that name, it complains (a KeyError).\n\n" +
    "Writing drops contents into the mailbox with that name — quietly. A new name makes a new mailbox; a name that already exists gets emptied and refilled. Writing never complains, even when you aim at the wrong name.",
  vizStages: [
    {
      label: "1. The wall of mailboxes",
      body:
        "files stands in for the whole disk: every key is a filename, every value is that file's contents. There's no real hard drive here — just a dictionary we agree to treat like one. This prints both entries.",
      code: 'files = {"notes.txt": "hello world", "todo.txt": "buy milk"}\nprint(files)',
    },
    {
      label: "2. Reading is a lookup",
      body:
        "read_file(name) just returns files[name]. Asking for a mailbox that exists hands back whatever's stored there — this prints \"hello world\", no different from any dictionary lookup you've already done.",
      code: 'def read_file(name):\n    return files[name]\n\nprint(read_file("notes.txt"))',
    },
    {
      label: "3. A missing file complains (KeyError)",
      body:
        "Asking for a filename that was never added crashes exactly the way a missing dictionary key does — a KeyError. This is the stand-in for a real \"file not found\".",
      code: 'print(read_file("diary.txt"))',
    },
    {
      label: "4. Writing creates or replaces — quietly",
      body:
        "write_file(name, content) just assigns files[name] = content. A new name creates a fresh mailbox; a name that already exists has its old contents wiped and replaced. Unlike reading, it never raises an error. After this, diary.txt exists and notes.txt has been overwritten.",
      code: 'def write_file(name, content):\n    files[name] = content\n\nwrite_file("diary.txt", "dear diary")\nwrite_file("notes.txt", "updated notes")\nprint(read_file("diary.txt"))\nprint(read_file("notes.txt"))',
    },
  ],
  realWorldIntro:
    "This save-under-a-name idea is how a notes app keeps your notes after you close it, and how a game remembers your progress — each thing is stored under a name, written when you save and read back when you open it again. And the quiet-overwrite catch is real: save to a slightly wrong name and your work lands in a stray file while the one you wanted sits unchanged.",
  realWorldCode: 'files["settings.txt"] = "dark mode: on"\nprint(files["settings.txt"])',
  sandbox: {
    kind: "code",
    challenge:
      "write_file is meant to update the to-do list, but read_file(\"todo.txt\") still prints the old \"buy milk\". Find the typo'd filename that's silently creating a brand-new mailbox instead of overwriting the real one, and fix it.",
    starterCode:
      'files = {"notes.txt": "hello world", "todo.txt": "buy milk"}\n\ndef read_file(name):\n    return files[name]\n\ndef write_file(name, content):\n    files[name] = content\n\nwrite_file("todo.txtt", "buy milk, eggs, bread")\nprint(read_file("todo.txt"))',
    language: "python",
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
    "Right — writing replaces whatever was stored under that name entirely; each call overwrites the previous contents, so only the most recent write, \"three\", survives.",
  quizFeedbackIncorrect:
    "Not quite — writing doesn't add onto the old contents, it replaces them outright. The last call, write_file(\"a.txt\", \"three\"), is the one that decides what's stored.",
  takeaway:
    "Reading a file is a lookup that fails loudly the moment a name doesn't exist; writing a file is an assignment that never complains — it creates a new mailbox or silently replaces an old one. That gap matters: a single typo in a filename you write to raises no error at all, it just stashes your data in a stray mailbox while the one you meant to update sits untouched.",
  explainers: [
    {
      id: "what-is-file",
      term: "What's a File (Here)?",
      emoji: "🗳️",
      shortDef: "A file is contents stored under a name, so it survives after the program stops and can be read back later.",
      longDef:
        "Real files live on a disk, but the idea is simple: a name (the filename) paired with some contents. In this lesson we model that with a dictionary — filenames as keys, contents as values — because reading and writing files really does behave like looking things up and storing them in a dictionary.",
      whyMatters:
        "Variables vanish the moment a program ends. Files are how anything is remembered between runs — your saved game, your notes, your settings. Almost every useful program reads or writes them.",
      realWorldExample:
        "A wall of labelled mailboxes: each has a name, each holds contents, and it stays there after you walk away — ready to open again next time.",
      relatedTerms: ["read-vs-write", "silent-overwrite"],
      expandedByDefault: true,
    },
    {
      id: "read-vs-write",
      term: "Reading vs. Writing",
      emoji: "🔁",
      shortDef: "Reading is a lookup that can fail if the name isn't there; writing is an assignment that always succeeds.",
      longDef:
        "read_file(name) returns files[name] — a lookup, which raises a KeyError if that name was never created. write_file(name, content) runs files[name] = content — an assignment, which never errors: it creates the name if it's new, or replaces its contents if it already exists. Same two mailbox actions you'd expect: look inside, or put something in.",
      whyMatters:
        "Knowing reading can fail (and writing can't) tells you where to expect a crash and where to expect a silent surprise — which is exactly what the next idea is about.",
      realWorldExample:
        "Opening a mailbox that isn't on the wall gets you nothing but confusion (reading fails). Dropping a letter into a mailbox always works — even if it's the wrong one (writing succeeds).",
      relatedTerms: ["what-is-file", "silent-overwrite"],
    },
    {
      id: "silent-overwrite",
      term: "Why Writing Fails Silently",
      emoji: "⚠️",
      shortDef: "Writing to a name that already exists replaces its contents with no warning — and a typo just makes a stray file.",
      longDef:
        "Because writing never errors, two things happen quietly. Writing to an existing name wipes its old contents and stores the new ones. And writing to a mistyped name doesn't complain — it simply creates a new, unwanted file, while the one you meant to update stays exactly as it was. Nothing turns red; the data just isn't where you expect.",
      whyMatters:
        "This is one of the sneakiest bugs there is: no error, no crash, just a file that quietly didn't change. Knowing writes are silent tells you to double-check filenames carefully.",
      realWorldExample:
        "Posting an important letter into the mailbox one door down from the right one. Nobody stops you, nothing looks wrong — the letter just ends up in the wrong box while the right one stays empty.",
      relatedTerms: ["read-vs-write"],
    },
  ],
};

export default content;
