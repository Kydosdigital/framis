import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 5,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Working in parallel: branches, merges, and conflicts",
  minutes: 22,
  concept:
    "What if your whole team is working on the same project at the same time? If everyone saves changes on the same line, they'll keep overwriting each other.\n\nBranches solve this. A branch is your own separate save line inside the same project. You can commit to it as many times as you like without touching anyone else's work — and when you're done, you bring those changes back into the main line.\n\nThink of it like a group essay. Each person makes their own draft copy to work on freely. When everyone's happy with their part, you combine all the drafts into the final version.\n\ngit branch — lists all the branches in your project (the one with * is where you currently are).\n\ngit checkout -b name — creates a new branch and jumps onto it in one step.\n\ngit merge branchname — brings a branch's commits into the one you're currently on.\n\nMost merges happen automatically. But if two branches both changed the exact same line of a file differently, Git can't guess which version to keep — so it stops and marks the spot inside the file with special lines called conflict markers:\n\n<<<<<<< HEAD (your current branch's version)\n======= (the divider)\n>>>>>>> branchname (the incoming version)\n\nYou fix it by opening the file, choosing which version to keep or writing something new, deleting all three marker lines, then running git add and git commit.",
  conceptSimpler:
    "Imagine you and a friend are each writing your own draft of the same essay at the same time — so you don't keep overwriting each other. That's what branches are. When you're both done, you combine your drafts into one final version — that's the merge. A conflict just means you both rewrote the same sentence differently, and someone (you) needs to decide which version makes the final cut.",
  vizStages: [
    {
      label: "1. Create your own branch to work on",
      body:
        "You're about to try adding a new ending to your essay but aren't sure it'll work. git checkout -b creates a new branch called 'my-draft' and switches you onto it. The main save line is completely untouched.",
      code:
        "$ git branch\n* main\n$ git checkout -b my-draft\nSwitched to a new branch 'my-draft'\n$ git branch\n  main\n* my-draft",
    },
    {
      label: "2. Save on your branch — main stays the same",
      body:
        "You edit essay.txt and save on your branch. Switch back to main, and essay.txt looks exactly as it did before you started — your edits only exist on your branch.",
      code:
        "$ git add essay.txt\n$ git commit -m \"Add new conclusion\"\n[my-draft 7a1b2c3] Add new conclusion\n$ git checkout main\nSwitched to branch 'main'\n$ cat essay.txt\nIn conclusion, keep practising.",
    },
    {
      label: "3. Merge — and hit a conflict",
      body:
        "While you were on your branch, a friend also edited the same line of essay.txt on main. When you try to merge, Git can't decide which version to keep — so it stops and puts markers inside the file showing both versions.",
      code:
        "$ git merge my-draft\nCONFLICT (content): Merge conflict in essay.txt\nAutomatic merge failed; fix conflicts and then commit.\n$ cat essay.txt\n<<<<<<< HEAD\nIn conclusion, keep practising.\n=======\nIn conclusion, never stop learning.\n>>>>>>> my-draft",
    },
    {
      label: "4. Fix the conflict and finish the merge",
      body:
        "You open essay.txt, pick the version you want (or combine them), delete the <<<<<<, ======, and >>>>>> marker lines, then git add and git commit to tell Git you've resolved it and the merge is complete.",
      code:
        "$ cat essay.txt\nIn conclusion, keep practising and never stop learning.\n$ git add essay.txt\n$ git commit -m \"Merge my-draft, combine conclusions\"\n[main 9f0e1d2] Merge my-draft, combine conclusions",
    },
  ],
  realWorldIntro:
    "Every developer working on an app — from a simple game to something like YouTube — uses branches every single day. Each new feature or bug fix gets its own branch so the whole team can work at the same time without breaking the main version. Merging is how all those separate pieces come back together into the finished app.",
  realWorldCode:
    "$ git log --oneline --graph\n*   9f0e1d2 Merge my-draft, combine conclusions\n|\\  \n| * 7a1b2c3 Add new conclusion\n* | 4c5d6e7 Update introduction\n|/  \n* a1b2c3d First draft",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see how branches and merges fit together.",
    stages: [
      {
        label: "git branch",
        body:
          "Lists every branch in your project, with a * next to the one you're currently on. Running it with a name, like git branch new-ending, creates a new branch without switching to it.",
        code: "$ git branch\n* main\n  my-draft",
      },
      {
        label: "git checkout -b name",
        body:
          "Creates a new branch and switches to it immediately — the shortcut almost everyone uses instead of running two separate commands.",
        code: "$ git checkout -b add-photos\nSwitched to a new branch 'add-photos'",
      },
      {
        label: "git merge branchname",
        body:
          "Brings another branch's commits into the branch you're currently on. If the two branches didn't touch the same lines of the same files, Git combines everything automatically with no extra work from you.",
        code:
          "$ git checkout main\n$ git merge add-photos\nUpdating 4c5d6e7..8b9c0d1\nFast-forward\n photos.txt | 4 +++-",
      },
      {
        label: "Resolving a merge conflict",
        body:
          "When both branches changed the same lines, Git leaves conflict markers in the file. <<<<<<< HEAD is your current branch's version, ======= divides the two, and >>>>>>> branchname is the incoming version. Edit the file down to what you actually want, delete all three marker lines, then git add and git commit.",
        code:
          "$ cat essay.txt\n<<<<<<< HEAD\nIn conclusion, keep practising.\n=======\nIn conclusion, never stop learning.\n>>>>>>> my-draft\n$ # after editing by hand:\n$ cat essay.txt\nIn conclusion, keep practising and never stop learning.\n$ git add essay.txt\n$ git commit -m \"Merge my-draft\"\n[main 2b3c4d5] Merge my-draft",
      },
    ],
  },
  quizQuestion:
    "You run git merge and Git stops with a conflict in essay.txt. What do the <<<<<<< HEAD and >>>>>>> my-draft markers mean?",
  quizCode:
    "$ cat essay.txt\n<<<<<<< HEAD\nIn conclusion, keep practising.\n=======\nIn conclusion, never stop learning.\n>>>>>>> my-draft",
  quizOptions: [
    {
      key: "a",
      label:
        "The top section is your current branch's version and the bottom is the incoming branch's version — you edit the file to keep what you want, then git add and git commit",
      correct: true,
    },
    {
      key: "b",
      label: "Git already picked the winning version automatically, and the markers are just a note for you",
      correct: false,
    },
    { key: "c", label: "The file is broken and you need to re-download the project to fix it", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — HEAD marks your current branch's version, the name after >>>>>>> marks the incoming branch's version, and ======= divides them. You decide what the file should actually say, delete all three marker lines, then git add and git commit to finish the merge.",
  quizFeedbackIncorrect:
    "Not quite — Git hasn't picked anything and nothing is broken. HEAD marks your current branch's version and the name after >>>>>>> marks the incoming version. You resolve it by editing the file down to what you actually want, deleting the markers, then git add and git commit.",
  takeaway:
    "git branch and git checkout -b let you work on a separate save line without touching main. git merge brings that work back together. A conflict just means two branches changed the same line differently — fix it by editing the file, deleting the markers, then git add and git commit.",
  explainers: [
    {
      id: "what-is-branch",
      term: "What's a Branch?",
      emoji: "🌿",
      shortDef:
        "A branch is your own independent save line inside the same project, so you can commit freely without affecting main until you're ready.",
      longDef:
        "Every project starts with one branch, usually called main. Creating a new branch with git checkout -b gives you a separate line to commit to — you can save as many times as you like, and none of those commits appear on main until you deliberately merge them in. Multiple branches can exist side by side, each moving forward independently.",
      whyMatters:
        "Branches are what let a whole team work on different things at the same time without constantly overwriting each other's in-progress work on main.",
      realWorldExample:
        "It's like making your own draft copy of a group essay — you can edit it freely without touching the shared original, and only add your changes to the group version when you're happy with them.",
      relatedTerms: ["what-is-merge-conflict"],
      expandedByDefault: true,
    },
    {
      id: "what-is-merge-conflict",
      term: "What's a Merge Conflict?",
      emoji: "⚡",
      shortDef:
        "A merge conflict happens when two branches changed the exact same lines of a file differently, and Git needs a person to decide which version is correct.",
      longDef:
        "Most merges happen automatically because the two branches touched different parts of the project. A conflict only occurs when both branches edited the same lines — Git has no way to guess which edit should win, so it pauses the merge and inserts conflict markers directly into the file, showing both versions side by side for you to sort out.",
      whyMatters:
        "Conflicts look intimidating at first, but they happen all the time on teams that are actively working. Knowing that a conflict just means 'pick a version, or write a new one' takes all the fear out of it.",
      realWorldExample:
        "It's like two classmates both rewriting the same sentence in a shared essay at the same time. Someone has to look at both versions and decide — or combine them — before the essay makes sense again.",
      relatedTerms: ["what-is-branch", "what-is-conflict-markers"],
    },
    {
      id: "what-is-conflict-markers",
      term: "What Do the <<<<<<< Markers Mean?",
      emoji: "🔀",
      shortDef:
        "<<<<<<< HEAD marks the start of your current branch's version, ======= separates it from the incoming version, and >>>>>>> branchname marks where the incoming version ends.",
      longDef:
        "When Git can't auto-merge a section of a file, it leaves both versions inside the file itself, wrapped in markers. Everything between <<<<<<< HEAD and ======= is what your current branch has. Everything between ======= and >>>>>>> branchname is what the other branch has. Resolving the conflict means editing that section down to what the file should actually say — keeping one side, the other, a mix, or something entirely new — and deleting all three marker lines.",
      whyMatters:
        "If you forget to remove a marker line, it becomes literal text in your file and often breaks things — so always double-check the file looks normal before committing.",
      realWorldExample:
        "It's like two people leaving sticky notes on the same sentence in a shared doc: one says 'use my version' and the other says 'use mine.' You read both, decide what the sentence should say, and peel off both sticky notes before you're done.",
      relatedTerms: ["what-is-merge-conflict"],
    },
  ],
};

export default content;
