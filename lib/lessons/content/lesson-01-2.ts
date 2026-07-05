import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 2,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Save points for your code: git init, add, and commit",
  minutes: 20,
  concept:
    "Git turns a folder into a project with memory by creating a hidden .git folder inside it — that's what git init does. From then on, Git can take \"snapshots\" of every file in that folder over time, called commits, and you can always come back to any of them later. But Git doesn't snapshot everything automatically — first you tell it which changes to include using git add, which moves them into a holding area called the staging area. Once the right changes are staged, git commit -m \"message\" locks them in as a permanent snapshot with a description of what changed. Two commands help you stay oriented: git status shows what's changed and what's staged right now, and git log shows the full history of snapshots you've already made.",
  conceptSimpler:
    "Think of committing like saving your progress in a video game — git add is choosing which items go in your backpack before you save, and git commit is actually hitting \"save,\" creating a checkpoint you can return to later.",
  vizStages: [
    {
      label: "1. Turn a folder into a repo",
      body:
        "You're in a project folder that Git doesn't know about yet. Running git init creates a hidden .git folder here — this is the one-time setup that turns an ordinary folder into a Git repository.",
      code: "$ git init\nInitialized empty Git repository in /Users/jordan/projects/framis-app/.git/",
    },
    {
      label: "2. Check what's changed",
      body:
        "You edit a file. Git notices, but hasn't saved anything yet. git status shows the file as \"modified\" and reminds you it isn't staged.",
      code:
        "$ git status\nOn branch main\nChanges not staged for commit:\n  modified:   index.html",
    },
    {
      label: "3. Stage the change",
      body:
        "git add moves index.html into the staging area — the list of changes that will go into your next snapshot. Nothing is saved permanently yet, it's just marked as \"ready.\"",
      code: "$ git add index.html\n$ git status\nChanges to be committed:\n  modified:   index.html",
    },
    {
      label: "4. Commit and check the history",
      body:
        "git commit -m \"...\" takes everything currently staged and locks it in as a permanent snapshot. git log then shows that snapshot in your project's history, complete with a unique ID, author, and timestamp.",
      code:
        "$ git commit -m \"Fix homepage heading\"\n[main a1b2c3d] Fix homepage heading\n 1 file changed, 1 insertion(+), 1 deletion(-)\n$ git log --oneline\na1b2c3d Fix homepage heading",
    },
  ],
  realWorldIntro:
    "Developers commit constantly throughout the day — a good rule of thumb is one commit per logical change, with a short message describing what and why, so git log reads like a diary of the project's progress.",
  realWorldCode:
    "$ git log --oneline\ne4f5a6b Add validation to signup form\nc3d4e5f Fix broken image on pricing page\na1b2c3d Fix homepage heading",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it does and when you'd reach for it in a real project.",
    stages: [
      {
        label: "git init",
        body:
          "Turns the current folder into a Git repository by creating a hidden .git folder that will store all future snapshots. You run this exactly once, when you start tracking a new project.",
        code: "$ git init\nInitialized empty Git repository in /Users/jordan/projects/framis-app/.git/",
      },
      {
        label: "git status",
        body:
          "Shows the current state of your project: which files are modified, which are staged and ready to commit, and which aren't tracked by Git at all yet. Run it constantly — it's the command you'll type most.",
        code:
          "$ git status\nOn branch main\nChanges not staged for commit:\n  modified:   app.js\nUntracked files:\n  notes.txt",
      },
      {
        label: "git add",
        body:
          "Stages a file (or files), marking it to be included in your next commit. You can stage one file at a time (git add app.js) or everything at once (git add .).",
        code: "$ git add app.js\n$ git status\nChanges to be committed:\n  modified:   app.js",
      },
      {
        label: "git commit -m \"message\"",
        body:
          "Saves everything currently staged as a permanent snapshot, along with a message describing the change. Only staged changes get included — anything you didn't git add is left out.",
        code:
          "$ git commit -m \"Add loading spinner to dashboard\"\n[main 7f8e9d0] Add loading spinner to dashboard\n 1 file changed, 12 insertions(+)",
      },
      {
        label: "git log",
        body:
          "Lists every commit ever made in this repository, newest first, with its ID, author, date, and message. Use it to review the project's history or find a specific past snapshot.",
        code:
          "$ git log --oneline\n7f8e9d0 Add loading spinner to dashboard\na1b2c3d Fix homepage heading",
      },
    ],
  },
  quizQuestion:
    "You edit two files, styles.css and app.js, but only run git add styles.css before committing. What happens to app.js?",
  quizCode: "$ git add styles.css\n$ git commit -m \"Update button colors\"",
  quizOptions: [
    { key: "a", label: "It gets committed too, since it was already changed", correct: false },
    { key: "b", label: "It stays modified and unstaged — it isn't part of this commit", correct: true },
    { key: "c", label: "Git refuses to commit until every changed file is staged", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — only files in the staging area are included in a commit, so app.js's changes are still sitting there, unstaged, waiting for a git add of its own.",
  quizFeedbackIncorrect:
    "Not quite — git commit only saves what's been staged with git add. Since app.js was never staged, its changes remain modified-but-uncommitted, untouched by this commit.",
  takeaway:
    "git init starts the history, git add chooses what goes into the next snapshot, and git commit locks it in — with git status and git log as your constant reality-check on what's saved and what isn't.",
  explainers: [
    {
      id: "what-is-repository",
      term: "What's a Repository (\"repo\")?",
      emoji: "🗂️",
      shortDef: "A repository is a project folder that Git is keeping a full history of, save by save.",
      longDef:
        "A repository — usually shortened to \"repo\" — is just a normal folder on your computer, plus a hidden .git folder inside it that Git uses to store every snapshot you've ever taken. Running git init is the one-time step that adds that hidden folder and turns an ordinary folder into a repo. Nothing about your actual files changes — you're just adding a history-tracking system alongside them.",
      whyMatters:
        "Once a folder is a repo, every meaningful change you make can become a permanent, recoverable checkpoint. Without it, deleting or breaking a file is often gone for good.",
      realWorldExample:
        "Think of it like turning on \"track changes\" in a Google Doc, except it also remembers every version forever, not just the last few edits.",
      relatedTerms: ["what-is-staging-area", "what-is-commit"],
      expandedByDefault: true,
    },
    {
      id: "what-is-staging-area",
      term: "What's the Staging Area?",
      emoji: "🗃️",
      shortDef: "The staging area is a holding zone for changes you're about to save — nothing lands there automatically.",
      longDef:
        "Editing a file doesn't save anything in Git — it just shows up as \"changed\" when you run git status. Running git add moves a specific change into the staging area, which is Git's way of saying \"yes, include this in the next save.\" You can edit ten files but only stage three of them, and only those three will end up in your next commit.",
      whyMatters:
        "This extra step means you get to choose exactly what goes into each save point, instead of accidentally bundling unrelated changes together.",
      realWorldExample:
        "It's like packing a bag before a trip: editing files is tossing clothes on the bed, and git add is actually putting specific items into the suitcase. Only what's in the suitcase travels with you.",
      relatedTerms: ["what-is-commit"],
    },
    {
      id: "what-is-commit",
      term: "What's a Commit?",
      emoji: "💾",
      shortDef: "A commit is a permanent snapshot of everything currently staged, saved with a short message describing it.",
      longDef:
        "Running git commit -m \"message\" takes whatever is sitting in the staging area and locks it in forever as a numbered, timestamped snapshot. Unlike a normal file save, a commit never gets overwritten — the version before it is still there, and you can always come back to it later with git log or older Git commands you'll learn soon.",
      whyMatters:
        "Commits are the \"undo history\" for your whole project, not just your last keystroke. A messy commit habit (or none at all) is one of the most common reasons beginners lose work they thought was safe.",
      realWorldExample:
        "It's exactly like a save point in a video game. You can keep playing after you save, and if things go badly later, you can always load back to that exact checkpoint.",
      relatedTerms: ["what-is-staging-area", "what-is-repository"],
    },
  ],
};

export default content;
