import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 5,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Working in parallel: branches, merges, and conflicts",
  minutes: 22,
  concept:
    "A branch is a separate, parallel line of work inside the same repository — when you create one, you get an independent copy of the project's current state that you can commit to without touching main until you're ready. git branch lists your existing branches (the one marked with a * is where you currently are) or, given a name, creates a new one without switching to it. git checkout -b name is the shortcut most people actually use: it creates a new branch and switches you onto it in one step, so you can start committing right away. Once you're happy with the work on a branch, git merge brings its commits back into another branch — usually main — combining both histories into one. Most merges happen automatically, but if the same lines of a file were changed differently on both sides, Git can't guess which version you want, so it stops and marks the conflict directly inside the file with <<<<<<<, =======, and >>>>>>> markers. You resolve it by hand-editing the file down to what it should actually say, deleting the markers, then git add and git commit to tell Git the conflict is settled and the merge is complete. Separately, a .gitignore file lists patterns of files Git should never track in the first place — things like dependency folders or secret keys — so they never show up in git status or get committed by accident.",
  conceptSimpler:
    "A branch is like working on a photocopy of a document so you can't mess up the original — merge is stapling your photocopy's changes back into the original, and a conflict is what happens when someone else edited the exact same sentence on the original while you were away, so Git makes you pick which version wins by hand.",
  vizStages: [
    {
      label: "1. Create and switch to a branch",
      body:
        "You're about to try something experimental — redesigning the homepage header — and don't want to touch main until it's done. git checkout -b creates a new branch called feature/new-header and switches you onto it in one step.",
      code:
        "$ git branch\n* main\n$ git checkout -b feature/new-header\nSwitched to a new branch 'feature/new-header'\n$ git branch\n  main\n* feature/new-header",
    },
    {
      label: "2. Commit on the branch, then switch back",
      body:
        "You edit header.html and commit right on the new branch — main is completely untouched. Switching back to main with git checkout main shows the file exactly as it was before you started.",
      code:
        "$ git add header.html\n$ git commit -m \"Redesign header\"\n[feature/new-header 7a1b2c3] Redesign header\n$ git checkout main\nSwitched to branch 'main'\n$ cat header.html\n<h1>Framis</h1>",
    },
    {
      label: "3. Merge — and hit a conflict",
      body:
        "While you were on your branch, a teammate committed a change to that exact same line of header.html on main. When you run git merge feature/new-header, Git can't automatically decide whose edit should win, so it stops and marks the conflict directly inside the file.",
      code:
        "$ git merge feature/new-header\nAuto-merging header.html\nCONFLICT (content): Merge conflict in header.html\nAutomatic merge failed; fix conflicts and then commit the result.\n$ cat header.html\n<<<<<<< HEAD\n<h1>Framis - Team Dashboard</h1>\n=======\n<h1>Welcome to Framis</h1>\n>>>>>>> feature/new-header",
    },
    {
      label: "4. Resolve it and finish the merge",
      body:
        "You open header.html, decide which version (or combination) is actually correct, delete the conflict markers by hand, then stage and commit to tell Git the merge is done.",
      code:
        "$ cat header.html\n<h1>Welcome to Framis - Team Dashboard</h1>\n$ git add header.html\n$ git commit -m \"Merge feature/new-header, resolve header conflict\"\n[main 9f0e1d2] Merge feature/new-header, resolve header conflict",
    },
  ],
  realWorldIntro:
    "Branches are how real teams work in parallel without stepping on each other — everyone builds their feature on their own branch and merges into main only once it's reviewed and ready. Conflicts aren't a sign you did something wrong; they happen constantly on active teams, and resolving them calmly, one marker at a time, is a completely normal part of the job.",
  realWorldCode:
    "$ git log --oneline --graph\n*   9f0e1d2 Merge feature/new-header, resolve header conflict\n|\\  \n| * 7a1b2c3 Redesign header\n* | 4c5d6e7 Update dashboard title\n|/  \n* a1b2c3d Fix homepage heading",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see how branches, merges, and .gitignore fit into a real workflow.",
    stages: [
      {
        label: "git branch",
        body:
          "Lists every branch in your repo, with a * marking the one you're currently on. Run it with a name, like git branch fix-typo, to create a new branch without switching to it.",
        code: "$ git branch\n* main\n  feature/new-header",
      },
      {
        label: "git checkout -b name",
        body:
          "Creates a new branch and switches to it immediately — the shortcut almost everyone uses instead of running git branch and git checkout separately.",
        code: "$ git checkout -b bugfix/login-error\nSwitched to a new branch 'bugfix/login-error'",
      },
      {
        label: "git merge branchname",
        body:
          "Brings another branch's commits into the branch you're currently on. If the two branches didn't touch the same lines, Git combines the histories automatically with no extra work from you.",
        code:
          "$ git checkout main\n$ git merge bugfix/login-error\nUpdating 4c5d6e7..8b9c0d1\nFast-forward\n login.js | 4 +++-",
      },
      {
        label: "Resolving a merge conflict",
        body:
          "When both branches changed the same lines, Git leaves conflict markers in the file for you to sort out by hand: <<<<<<< HEAD is your current branch's version, ======= divides the two, and >>>>>>> branchname is the incoming version. Delete the markers and whichever lines you don't want, then git add and git commit.",
        code:
          "$ cat login.js\n<<<<<<< HEAD\nconst maxAttempts = 5;\n=======\nconst maxAttempts = 3;\n>>>>>>> bugfix/login-error\n$ # after editing by hand:\n$ cat login.js\nconst maxAttempts = 3;\n$ git add login.js\n$ git commit -m \"Merge bugfix/login-error\"\n[main 2b3c4d5] Merge bugfix/login-error",
      },
      {
        label: ".gitignore",
        body:
          "A plain text file listing patterns of files Git should never track — things like installed dependencies or secret keys that don't belong in your history. Anything matching a line in .gitignore is skipped by git status and git add entirely.",
        code:
          "$ cat .gitignore\nnode_modules/\n.env\n*.log\n$ git status\nOn branch main\nnothing to commit, working tree clean",
      },
    ],
  },
  quizQuestion:
    "You run git merge and Git stops with a conflict in styles.css. What do the <<<<<<< HEAD and >>>>>>> feature-branch markers mean?",
  quizCode:
    "$ cat styles.css\n<<<<<<< HEAD\ncolor: blue;\n=======\ncolor: green;\n>>>>>>> feature-branch",
  quizOptions: [
    {
      key: "a",
      label:
        "The top section is your current branch's version and the bottom is the incoming branch's version — you edit the file to keep what you want, then git add and git commit",
      correct: true,
    },
    {
      key: "b",
      label: "Git already picked the winning version automatically, and these markers are just a log for reference",
      correct: false,
    },
    { key: "c", label: "The file is corrupted and needs to be deleted and re-cloned from the remote", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — HEAD marks your current branch's version, the name after >>>>>>> marks the incoming branch's version, and ======= divides them. You decide what the file should actually say, delete all three marker lines, then git add and git commit to finish the merge.",
  quizFeedbackIncorrect:
    "Not quite — nothing is picked automatically and nothing is broken. HEAD marks your current branch's version, the name after >>>>>>> marks the incoming branch's version, and you resolve it by editing the file down to what you actually want, deleting the markers, then git add and git commit.",
  takeaway:
    "git branch and git checkout -b let you work on parallel lines of history without disturbing main, git merge brings that work back together, and a merge conflict just means Git needs your judgment on lines both branches touched — resolve it by editing the file, deleting the markers, then git add and git commit. .gitignore keeps files that were never meant to be tracked out of the picture entirely.",
  explainers: [
    {
      id: "what-is-branch",
      term: "What's a Branch?",
      emoji: "🌿",
      shortDef:
        "A branch is an independent line of commits inside the same repo, letting you work without affecting main until you're ready.",
      longDef:
        "Every repo starts with one branch, usually called main. Creating a new branch with git checkout -b gives you a separate pointer into your project's history — you can commit to it freely, and none of those commits appear on main until you deliberately merge them in. Multiple branches can exist side by side, each moving forward independently.",
      whyMatters:
        "Branches are what let a team of developers work on different features at the same time without constantly overwriting each other's in-progress work on main.",
      realWorldExample:
        "It's like each teammate getting their own copy of a shared document to draft changes in, instead of everyone typing directly into the one master copy at the same time.",
      relatedTerms: ["what-is-merge-conflict"],
      expandedByDefault: true,
    },
    {
      id: "what-is-merge-conflict",
      term: "What's a Merge Conflict?",
      emoji: "⚡",
      shortDef:
        "A merge conflict happens when two branches changed the exact same lines of a file differently, and Git needs a human to decide which version is correct.",
      longDef:
        "Most merges happen automatically because the two branches touched different parts of the codebase. A conflict only occurs when both branches edited the same lines — Git has no way to guess which edit should win, so it pauses the merge and inserts conflict markers directly into the file, showing both versions side by side for you to sort out.",
      whyMatters:
        "Conflicts are one of the most intimidating-looking things for beginners, but they're routine on active teams. Knowing that a conflict just means \"pick a version, or write a new one\" takes the fear out of it.",
      realWorldExample:
        "It's like two people editing the same paragraph of a shared document at the same time — someone has to look at both versions and decide, or combine them, before the document makes sense again.",
      relatedTerms: ["what-is-branch", "what-is-conflict-markers"],
    },
    {
      id: "what-is-conflict-markers",
      term: "What Do the <<<<<<< Markers Mean?",
      emoji: "🔀",
      shortDef:
        "<<<<<<< HEAD marks the start of your current branch's version, ======= separates it from the incoming version, and >>>>>>> branchname marks where the incoming version ends.",
      longDef:
        "When Git can't auto-merge a section of a file, it leaves both conflicting versions inside the file itself, wrapped in markers: everything between <<<<<<< HEAD and ======= is what your current branch has, and everything between ======= and >>>>>>> branchname is what the other branch has. Resolving the conflict means editing that section down to what the file should actually say — keeping one side, the other, a combination, or something new entirely — and deleting all three marker lines.",
      whyMatters:
        "If you forget to remove a marker line, it becomes literal text in your file (and often breaks your code), so always double check the file looks normal again before committing.",
      realWorldExample:
        "It's like a document with two tracked-change suggestions stacked on top of each other for the same sentence — you read both, decide what the sentence should really say, and delete the suggestion markers before moving on.",
      relatedTerms: ["what-is-merge-conflict"],
    },
    {
      id: "what-is-gitignore",
      term: "What's a .gitignore File?",
      emoji: "🚫",
      shortDef:
        "A .gitignore file lists file and folder patterns Git should never track, so they never show up in git status or get committed by accident.",
      longDef:
        "Some files don't belong in your project's history at all — installed dependencies that can be reinstalled anytime, log files, or secret keys and passwords. Listing a pattern like node_modules/ or .env in a file named .gitignore tells Git to ignore anything matching it completely, so it never appears as \"untracked\" and can't be swept up by an accidental git add.",
      whyMatters:
        "Committing dependency folders bloats your repo for no reason, and committing a secret key can leak it publicly forever once it's pushed — .gitignore prevents both by stopping the file from ever being tracked in the first place.",
      realWorldExample:
        "It's like a standing note on a shared filing cabinet saying \"never file anything from this drawer\" — so nobody has to remember to leave it out each time, it's just automatically skipped.",
      relatedTerms: ["what-is-branch"],
    },
  ],
};

export default content;
