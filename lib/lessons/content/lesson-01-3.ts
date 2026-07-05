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
  explainers: [
    {
      id: "what-is-uncommitted-changes",
      term: "What Are \"Uncommitted Changes\"?",
      emoji: "✏️",
      shortDef: "Uncommitted changes are edits Git has noticed but hasn't saved as a permanent snapshot yet.",
      longDef:
        "The moment you edit a tracked file, Git notices — git status will call it \"modified.\" But nothing is actually saved until you stage it and commit it. Until then, it's just sitting there as an uncommitted change: easy to review, easy to throw away, and not yet part of your project's permanent history.",
      whyMatters:
        "Knowing whether a change is committed or not tells you how safe it is. Uncommitted work can be undone with a single command and no trace left behind — committed work takes a deliberate rewind instead.",
      realWorldExample:
        "It's like a sentence you just typed in a document but haven't saved yet — still easy to delete completely, versus a paragraph you already saved and would now have to deliberately go back and remove.",
      relatedTerms: ["what-is-git-diff", "what-is-checkout"],
      expandedByDefault: true,
    },
    {
      id: "what-is-git-diff",
      term: "What Does git diff Show You?",
      emoji: "🔍",
      shortDef: "git diff shows the exact lines you've changed but haven't committed yet — additions and deletions, side by side.",
      longDef:
        "Run git diff and Git prints every uncommitted change line by line: lines you removed marked with a minus sign, lines you added marked with a plus sign. Nothing is modified by running it — it's purely a preview, so you can catch a typo or an accidental edit before it becomes a permanent part of your history.",
      whyMatters:
        "Committing a mistake is far more annoying to undo than catching it before you commit. A quick git diff habit before every commit catches most of those mistakes for free.",
      realWorldExample:
        "It's proofreading a text message before you hit send — a quick look at exactly what changed, while you can still easily fix it.",
      relatedTerms: ["what-is-uncommitted-changes"],
    },
    {
      id: "what-is-checkout",
      term: "checkout vs. reset — What's the Difference?",
      emoji: "↩️",
      shortDef: "git checkout -- file throws away uncommitted edits to one file. git reset rewinds your branch past commits you've already made.",
      longDef:
        "These two solve different problems. git checkout -- filename only works on uncommitted changes — it restores one file to how it looked at your last commit, discarding whatever you'd typed since. git reset works on commits themselves — it moves your branch backward in history, undoing one or more commits you already made. If your mistake hasn't been committed yet, reach for checkout. If it already got committed, you need reset.",
      whyMatters:
        "Reaching for the wrong one wastes time — checkout won't touch a commit that already happened, and reset is overkill (and riskier) for a change you haven't even saved yet.",
      realWorldExample:
        "checkout is crumpling up a draft page you haven't handed in. reset is going back through pages you've already turned in and pulling some of them back out.",
      relatedTerms: ["what-is-uncommitted-changes", "what-is-hard-reset"],
    },
    {
      id: "what-is-hard-reset",
      term: "Why Is --hard the Scary One?",
      emoji: "⚠️",
      shortDef: "--soft and plain reset keep your changes around after rewinding; --hard deletes them completely, with no undo.",
      longDef:
        "All three reset modes move your branch back to an earlier commit — they differ only in what happens to the work in between. --soft keeps it staged, ready to re-commit. Plain reset (the default, \"mixed\") unstages it but leaves it sitting in your files, editable. --hard throws it away entirely, as if it never happened, and there's no simple command to bring it back.",
      whyMatters:
        "Of the three, --hard is the one genuinely destructive command in this lesson. It's worth a two-second pause before running it — everything else here is easy to recover from if you get it wrong.",
      realWorldExample:
        "--soft and mixed reset are like tearing pages out of a notebook but keeping them in a pile on your desk. --hard is shredding them on the spot.",
      relatedTerms: ["what-is-checkout"],
    },
  ],
};

export default content;
