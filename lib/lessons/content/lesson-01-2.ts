import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 2,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Save points for your code: git init, add, and commit",
  minutes: 20,
  concept:
    "Your computer doesn't automatically keep a history of every version of your files — unless you set up a save system. That's what Git is: a save system for your code.\n\nA terminal is an app where you type commands to talk to your computer (you saw this in Lesson 1). You'll use it now to switch Git on inside a folder, turning that folder into a repository — a folder with a full memory of everything you've ever saved.\n\nHere's how saving works in Git. Think of it like a video game where you press Save after each level.\n\ngit init — run this once, in the folder you want to track. It switches the save system on. From this point on, Git quietly watches that folder.\n\ngit add — queues up the changes you want to include in your next save. You're picking which progress gets stored in this particular save slot.\n\ngit commit — actually takes the snapshot and stores it permanently, along with a short message you write describing what changed. Like naming your save slot 'Finished level 3'.\n\nTwo extra commands help you stay aware: git status shows what's changed and what's queued up for the next save, and git log shows your full save history, newest first.",
  conceptSimpler:
    "Imagine a video game where you press Save after each mission, and the game asks you to name the save slot — like 'finished the boss fight'. That's git commit. Before you press Save, you pick which progress gets included in this slot — that's git add. And the very first time you play, you create the save file at all — that's git init.",
  vizStages: [
    {
      label: "1. Switch on Git for a folder",
      body:
        "You've got a folder called homework on your computer, and you want Git to start tracking it. git init runs once and creates a hidden .git folder inside it — that's where Git stores all your save history from this point on.",
      code: "$ git init\nInitialized empty Git repository in /Users/yourname/homework/.git/",
    },
    {
      label: "2. Check what's changed",
      body:
        "You've typed some answers into maths.txt. Git noticed the change, but hasn't saved anything yet. git status shows what's changed and reminds you: nothing will be saved until you run git add.",
      code:
        "$ git status\nOn branch main\nChanges not staged for commit:\n  modified:   maths.txt",
    },
    {
      label: "3. Queue up the change",
      body:
        "git add maths.txt marks that file as ready to include in the next save. Nothing is permanently stored yet — it's just in the queue. You can add one file at a time, or use git add . to queue everything at once.",
      code: "$ git add maths.txt\n$ git status\nChanges to be committed:\n  modified:   maths.txt",
    },
    {
      label: "4. Take the snapshot",
      body:
        "git commit -m '...' saves everything in the queue as a permanent snapshot, with your message attached. git log shows it in your save history — a unique ID and the label you wrote.",
      code:
        "$ git commit -m \"Finished maths questions\"\n[main a1b2c3d] Finished maths questions\n 1 file changed, 3 insertions(+)\n$ git log --oneline\na1b2c3d Finished maths questions",
    },
  ],
  realWorldIntro:
    "When someone builds an app — like a game or a streaming service — they use git add and git commit throughout the day, exactly like this. Each commit is a checkpoint they can come back to if something breaks. A project like Instagram has hundreds of thousands of commits in its history, one for every change the team ever made.",
  realWorldCode:
    "$ git log --oneline\nc3d4e5f Add animated loading screen\nb2c3d4e Fix crash when going back\na1b2c3d First working version",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it does and when you'd reach for it.",
    stages: [
      {
        label: "git init",
        body:
          "Turns the current folder into a Git repository by creating a hidden .git folder inside it. That folder stores all your future saves. Run this exactly once, when you first want Git to start tracking a folder.",
        code: "$ git init\nInitialized empty Git repository in /Users/yourname/homework/.git/",
      },
      {
        label: "git status",
        body:
          "Shows the current state of your folder: which files have changed, which are queued up ready to save, and which Git isn't tracking at all yet. This is the command you'll type most — run it constantly.",
        code:
          "$ git status\nOn branch main\nChanges not staged for commit:\n  modified:   maths.txt\nUntracked files:\n  ideas.txt",
      },
      {
        label: "git add",
        body:
          "Queues up a file to be included in your next save. You can add one file at a time (git add maths.txt) or everything at once (git add .).",
        code: "$ git add maths.txt\n$ git status\nChanges to be committed:\n  modified:   maths.txt",
      },
      {
        label: "git commit -m \"message\"",
        body:
          "Saves everything currently queued as a permanent snapshot, with your message attached. Only queued files get included — anything you didn't git add is left out.",
        code:
          "$ git commit -m \"Add chapter 2 notes\"\n[main 7f8e9d0] Add chapter 2 notes\n 1 file changed, 12 insertions(+)",
      },
      {
        label: "git log",
        body:
          "Shows every save ever made in this repository, newest first — each with its unique ID, author, date, and message. Use it to review your history or find a specific past snapshot.",
        code:
          "$ git log --oneline\n7f8e9d0 Add chapter 2 notes\na1b2c3d Finished maths questions",
      },
    ],
  },
  quizQuestion:
    "You edit two files, maths.txt and essay.txt, but only run git add maths.txt before committing. What happens to essay.txt?",
  quizCode: "$ git add maths.txt\n$ git commit -m \"Update maths answers\"",
  quizOptions: [
    { key: "a", label: "It gets saved too, since it was already changed", correct: false },
    { key: "b", label: "It stays changed but not saved — it won't be part of this commit", correct: true },
    { key: "c", label: "Git refuses to commit until every changed file is queued up", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — only files you've queued up with git add are included in a commit. essay.txt was changed but never added, so it stays there, unsaved, waiting for the next git add.",
  quizFeedbackIncorrect:
    "Not quite — git commit only saves what you've queued with git add. Since essay.txt was never added, its changes stay there, uncommitted — waiting for you to queue it up.",
  takeaway:
    "git init turns on Git's save system for a folder — run it once. git add queues up the changes you want to save next. git commit takes the snapshot with a message. git status shows what's queued, and git log shows your full save history.",
  explainers: [
    {
      id: "what-is-repository",
      term: "What's a Repository (\"repo\")?",
      emoji: "🗂️",
      shortDef: "A repository is a folder that Git has been set up to track — it keeps a full history of every save you've ever made.",
      longDef:
        "Running git init in a folder creates a hidden .git folder inside it. That's what turns an ordinary folder into a repository. Git uses it to store every snapshot you've ever taken, so you can look back at or restore any of them later. Your actual files look and work exactly the same — Git just quietly keeps a history of everything alongside them.",
      whyMatters:
        "Without a repository, every change you make is permanent with no way back. With one, every commit stays in the history forever, so you can always get back to a version that worked.",
      realWorldExample:
        "It's like a video game save file that keeps every checkpoint you've ever reached, not just the last one. You can reload any of them at any point.",
      relatedTerms: ["what-is-staging-area", "what-is-commit"],
      expandedByDefault: true,
    },
    {
      id: "what-is-staging-area",
      term: "What's the Staging Area?",
      emoji: "🗃️",
      shortDef: "The staging area is a holding zone for changes you've chosen to include in the next save — nothing gets in there automatically.",
      longDef:
        "Editing a file doesn't save anything in Git — it just shows up as 'changed' when you run git status. Running git add moves a specific change into the staging area, which is Git's way of saying 'yes, put this in the next snapshot.' You can edit ten files and only stage three of them, and only those three end up in the next commit.",
      whyMatters:
        "This extra step gives you control over exactly what gets saved together. You can make a small, focused save instead of accidentally bundling unrelated changes all at once.",
      realWorldExample:
        "It's like choosing which items to lock in before pressing Save in a video game. Only the items you pick actually get stored in the save slot — the rest stay where they are, waiting.",
      relatedTerms: ["what-is-commit"],
    },
    {
      id: "what-is-commit",
      term: "What's a Commit?",
      emoji: "💾",
      shortDef: "A commit is a permanent snapshot of everything you've queued up, saved with a short message describing what changed.",
      longDef:
        "Running git commit -m \"message\" takes whatever is in the staging area and locks it in as a numbered, timestamped snapshot with your label on it. That snapshot stays in the history forever — you can view it anytime with git log, and even restore your whole folder to that exact state later on.",
      whyMatters:
        "A commit is the undo history for your whole project, not just your last keypress. The habit of committing often — after every small, working change — is what makes Git actually useful when something breaks.",
      realWorldExample:
        "It's exactly like pressing Save in a video game after you clear a level. If something goes wrong later, you reload that checkpoint instead of starting the whole thing over.",
      relatedTerms: ["what-is-staging-area", "what-is-repository"],
    },
  ],
};

export default content;
