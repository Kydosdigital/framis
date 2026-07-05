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
};

export default content;
