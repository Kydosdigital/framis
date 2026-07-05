import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 3,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "The undo button: git diff, checkout, and reset",
  minutes: 22,
  concept:
    "Mistakes are normal in Git, and there's almost always a way back. git diff shows you the exact lines that changed but haven't been committed yet — every added line marked with a +, every removed line marked with a -, so you know precisely what you're about to save before you save it. If you've edited a file and want to throw those uncommitted edits away entirely, git checkout -- filename restores it to how it looked at your last commit, as if you'd never touched it. If the mistake already made it into a commit, git reset moves your branch back to an earlier point in history — but how much it undoes depends on the flag: --soft keeps your changes staged, plain reset (called --mixed, the default) unstages them but leaves them in your files, and --hard throws them away completely. Because --hard permanently deletes uncommitted work, it's the one command in this trio worth pausing before you run.",
  conceptSimpler:
    "git diff is proofreading a letter before you mail it, git checkout is crumpling up a draft and starting that page over, and git reset is tearing pages out of a notebook you've already written in — gently if you keep the torn-out pages, violently if you shred them.",
  vizStages: [
    {
      label: "1. Review before you commit",
      body:
        "You've edited config.js but haven't committed. git diff shows exactly what changed, line by line, so you can catch a typo or an accidental edit before it becomes part of your history.",
      code:
        "$ git diff\n--- a/config.js\n+++ b/config.js\n- const timeout = 3000;\n+ const timeout = 30000;",
    },
    {
      label: "2. Discard an uncommitted mistake",
      body:
        "You decide that edit was wrong and you'd rather start from scratch. git checkout -- config.js throws away the uncommitted change and restores the file to exactly how it was in your last commit.",
      code: "$ git checkout -- config.js\n$ git diff\n(nothing — file matches the last commit)",
    },
    {
      label: "3. Undo a commit, keep the changes staged",
      body:
        "This time the mistake was already committed. git reset --soft HEAD~1 moves your branch back one commit but leaves all those changes staged, ready to be edited slightly and recommitted.",
      code:
        "$ git reset --soft HEAD~1\n$ git status\nChanges to be committed:\n  modified:   config.js",
    },
    {
      label: "4. Undo a commit completely",
      body:
        "Sometimes you want the commit and its changes gone entirely — for example, a commit that added a temporary debug file you never meant to keep. git reset --hard HEAD~1 rewinds the branch and wipes out the file changes too, with no trace left.",
      code: "$ git reset --hard HEAD~1\n$ git status\nnothing to commit, working tree clean",
    },
  ],
  realWorldIntro:
    "Developers run git diff constantly right before committing as a final review, reach for git checkout to bail out of a small experiment that didn't work, and use git reset to clean up local commit history before sharing it with teammates.",
  realWorldCode:
    "$ git diff\n--- a/Header.tsx\n+++ b/Header.tsx\n- <h1>Welcom</h1>\n+ <h1>Welcome</h1>",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it undoes, and how much damage (or safety) it comes with.",
    stages: [
      {
        label: "git diff",
        body:
          "Shows uncommitted changes line by line — nothing is undone here, it's purely a preview. Run it before every commit as a habit, so you never commit something you didn't mean to.",
        code:
          "$ git diff\n--- a/app.js\n+++ b/app.js\n- console.log(\"debug\");\n+ // removed debug log",
      },
      {
        label: "git diff --staged",
        body:
          "Same idea as git diff, but shows what's already staged with git add instead of what's still unstaged. Use it right before committing to double-check exactly what's about to be saved.",
        code: "$ git diff --staged\n+++ b/app.js\n+ function validateEmail(input) { ... }",
      },
      {
        label: "git checkout -- filename",
        body:
          "Discards uncommitted changes to a single file, reverting it to the last commit. Reach for this when you've made edits you no longer want and there's nothing worth keeping.",
        code: "$ git checkout -- app.js\n$ git status\nnothing to commit, working tree clean",
      },
      {
        label: "git reset --soft HEAD~1",
        body:
          "Undoes the most recent commit but keeps all its changes staged. Use this when you committed too early and want to add a bit more before recommitting, without losing any work.",
        code: "$ git reset --soft HEAD~1\n$ git status\nChanges to be committed:\n  modified:   app.js",
      },
      {
        label: "git reset --hard HEAD~1",
        body:
          "Undoes the most recent commit and permanently deletes its changes from your files too — there's no recovering them afterward. Only use this when you're certain you never want that commit's work back.",
        code: "$ git reset --hard HEAD~1\n$ git status\nnothing to commit, working tree clean",
      },
    ],
  },
  quizQuestion:
    "You want to undo your last commit, but keep the changes sitting in your files, unstaged, so you can rework them before committing again. Which command does that?",
  quizOptions: [
    { key: "a", label: "git reset --soft HEAD~1", correct: false },
    { key: "b", label: "git reset HEAD~1", correct: true },
    { key: "c", label: "git reset --hard HEAD~1", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — plain git reset HEAD~1 uses the default \"mixed\" mode, which undoes the commit and unstages the changes, but leaves them in your files exactly as they were, ready to edit.",
  quizFeedbackIncorrect:
    "Not quite — --soft undoes the commit but leaves changes staged (not unstaged), while --hard undoes the commit and deletes the changes entirely. Plain git reset (the default \"mixed\" mode) is the middle ground: unstaged, but still in your files.",
  takeaway:
    "git diff lets you preview before you commit, git checkout throws away uncommitted mistakes, and git reset rewinds committed ones — with --soft, --mixed, and --hard trading off how much of your work survives the rewind.",
};

export default content;
