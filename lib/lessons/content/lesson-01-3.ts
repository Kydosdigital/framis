import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 3,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "The undo button: git diff, checkout, and reset",
  minutes: 22,
  concept:
    "Mistakes happen. Git gives you ways to undo almost anything — as long as you pick the right type of undo.\n\ngit diff shows you exactly what's changed in a file since your last save, line by line. Lines you added show up with a + in front, lines you removed show with a -. Think of it as rereading a text message draft before you hit Send — a quick check while you can still easily fix it.\n\nIf you decide you don't like those changes, git checkout -- filename throws them away and restores that file to how it looked in your last commit. Like clearing a draft you never sent.\n\nOnce a commit is already made, git checkout won't touch it. That's when you need git reset, which rewinds your save history back one step.\n\ngit reset --soft HEAD~1 rewinds the commit but keeps your changes queued up, ready to save again — like unsending a message but keeping a copy in drafts.\n\nPlain git reset HEAD~1 (the default) rewinds the commit and removes changes from the queue, but leaves them in your files — like unsending it but leaving the text in your inbox.\n\ngit reset --hard HEAD~1 rewinds the commit and deletes the changes completely — like unsending the message and deleting it from both sides. There's no getting it back.",
  conceptSimpler:
    "Think about texting a friend. git diff is rereading your unsent draft before you press Send — catching a mistake while you still can. git checkout is deleting the draft because you changed your mind. And git reset is like being able to 'unsend' a message you already sent: one version keeps a draft copy for you, one just un-sends it, and one deletes it completely from both sides.",
  vizStages: [
    {
      label: "1. Preview before you save",
      body:
        "You've changed a line in notes.txt but haven't committed yet. git diff shows exactly what changed — the old line marked with a -, the new line marked with a +. Running this doesn't change anything; it's purely a preview.",
      code:
        "$ git diff\n--- a/notes.txt\n+++ b/notes.txt\n- My homework is due Friday.\n+ My homework is due Thursday.",
    },
    {
      label: "2. Throw away an uncommitted change",
      body:
        "You decide that edit was wrong and you want to start fresh. git checkout -- notes.txt throws away the uncommitted change and restores the file to how it was in your last save — like clearing a draft before sending it.",
      code: "$ git checkout -- notes.txt\n$ git diff\n(nothing — file matches the last commit)",
    },
    {
      label: "3. Undo a commit, keep the change ready to re-save",
      body:
        "This time the mistake made it into a commit. git reset --soft HEAD~1 rewinds your history back one step but leaves those changes queued up, ready to save again — like unsending a message but keeping a draft copy.",
      code:
        "$ git reset --soft HEAD~1\n$ git status\nChanges to be committed:\n  modified:   notes.txt",
    },
    {
      label: "4. Undo a commit and delete everything",
      body:
        "Sometimes you want the commit and all its changes gone entirely. git reset --hard HEAD~1 rewinds your history and wipes those changes completely — there is no getting them back.",
      code: "$ git reset --hard HEAD~1\n$ git status\nnothing to commit, working tree clean",
    },
  ],
  realWorldIntro:
    "When someone builds an app, they run git diff before every save as a quick review — like proofreading a post before publishing it. If something breaks, they pick the right type of reset depending on how much work they want to keep. It sounds like a lot of options at first, but choosing the right one becomes automatic fast.",
  realWorldCode:
    "$ git diff\n--- a/notes.txt\n+++ b/notes.txt\n- Welcom to the app!\n+ Welcome to the app!",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it undoes, and how much it keeps.",
    stages: [
      {
        label: "git diff",
        body:
          "Shows uncommitted changes line by line — nothing is undone here, it's purely a preview. Run it before every commit as a habit, so you never save something you didn't mean to.",
        code:
          "$ git diff\n--- a/notes.txt\n+++ b/notes.txt\n- My homework is on Friday.\n+ My homework is on Thursday.",
      },
      {
        label: "git checkout -- filename",
        body:
          "Throws away uncommitted changes to a single file and restores it to how it looked at your last save. Use this when you've made edits you don't want and there's nothing worth keeping.",
        code: "$ git checkout -- notes.txt\n$ git status\nnothing to commit, working tree clean",
      },
      {
        label: "git reset HEAD~1",
        body:
          "Undoes the most recent commit and removes its changes from the queue, but keeps them in your files. Use this when you want to look at those edits again before deciding what to save next.",
        code: "$ git reset HEAD~1\n$ git status\nChanges not staged for commit:\n  modified:   notes.txt",
      },
      {
        label: "git reset --soft HEAD~1",
        body:
          "Undoes the most recent commit but keeps all its changes queued up. Use this when you committed too early and want to add a bit more before saving again — without losing any of your work.",
        code: "$ git reset --soft HEAD~1\n$ git status\nChanges to be committed:\n  modified:   notes.txt",
      },
      {
        label: "git reset --hard HEAD~1",
        body:
          "Undoes the most recent commit and permanently deletes its changes — there is no recovering them afterwards. Only use this when you are completely sure you never want that work back.",
        code: "$ git reset --hard HEAD~1\n$ git status\nnothing to commit, working tree clean",
      },
    ],
  },
  quizQuestion:
    "You want to undo your last commit, but keep the changes in your files — not queued up — so you can look at them and decide what to fix. Which command does that?",
  quizOptions: [
    { key: "a", label: "git reset --soft HEAD~1", correct: false },
    { key: "b", label: "git reset HEAD~1", correct: true },
    { key: "c", label: "git reset --hard HEAD~1", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — plain git reset HEAD~1 uses the default mode (called 'mixed'), which undoes the commit and removes the changes from the queue, but leaves them sitting in your files exactly as they were, ready to look at and fix.",
  quizFeedbackIncorrect:
    "Not quite — --soft undoes the commit but leaves changes queued up (not unqueued), and --hard undoes the commit and deletes the changes entirely. Plain git reset HEAD~1 (the default 'mixed' mode) is the middle ground: changes removed from the queue but still in your files.",
  takeaway:
    "git diff lets you preview before you commit. git checkout -- filename throws away uncommitted mistakes. git reset rewinds commits you've already made — with --soft, plain (mixed), and --hard trading off how much of your work survives.",
  explainers: [
    {
      id: "what-is-uncommitted-changes",
      term: "What Are \"Uncommitted Changes\"?",
      emoji: "✏️",
      shortDef: "Uncommitted changes are edits Git has noticed but hasn't saved as a snapshot yet.",
      longDef:
        "The moment you edit a tracked file, Git notices — git status will call it 'modified.' But nothing is actually saved until you queue it with git add and commit it. Until then, it's just sitting there as an uncommitted change: easy to review, easy to throw away, and not yet part of your project's save history.",
      whyMatters:
        "Knowing whether a change is committed or not tells you how safe it is. Uncommitted changes can be thrown away with one command and no trace left behind — committed ones take a deliberate undo instead.",
      realWorldExample:
        "It's like a text message you typed but haven't sent yet — still easy to delete completely, versus one you already sent and would now have to deliberately go back and unsend.",
      relatedTerms: ["what-is-git-diff", "what-is-checkout"],
      expandedByDefault: true,
    },
    {
      id: "what-is-git-diff",
      term: "What Does git diff Show You?",
      emoji: "🔍",
      shortDef: "git diff shows the exact lines you've changed but haven't committed yet — additions and removals, side by side.",
      longDef:
        "Run git diff and Git prints every uncommitted change line by line: lines you removed marked with a minus sign, lines you added marked with a plus sign. Nothing is modified by running it — it's purely a preview, so you can catch a typo or an accidental edit before it becomes a permanent part of your save history.",
      whyMatters:
        "Saving a mistake is much more annoying to undo than catching it before you save. A quick git diff habit before every commit catches most of those mistakes for free.",
      realWorldExample:
        "It's like rereading a text message draft before you hit Send — a quick look at exactly what you wrote, while you can still easily fix it.",
      relatedTerms: ["what-is-uncommitted-changes"],
    },
    {
      id: "what-is-checkout",
      term: "checkout vs. reset — What's the Difference?",
      emoji: "↩️",
      shortDef: "git checkout -- file throws away uncommitted edits to one file. git reset rewinds commits you've already made.",
      longDef:
        "These two solve different problems. git checkout -- filename only works on uncommitted changes — it restores one file to how it looked at your last save, throwing away whatever you typed since. git reset works on commits themselves — it moves your save history backward, undoing one or more commits you already made. If your mistake hasn't been committed yet, reach for checkout. If it already got committed, you need reset.",
      whyMatters:
        "Reaching for the wrong one wastes time — checkout won't touch a commit that already happened, and reset is overkill (and riskier) for a change you haven't even saved yet.",
      realWorldExample:
        "checkout is deleting a draft message before you send it. reset is being able to unsend a message you already sent — with different levels of how completely it disappears.",
      relatedTerms: ["what-is-uncommitted-changes", "what-is-hard-reset"],
    },
    {
      id: "what-is-hard-reset",
      term: "Why Is --hard the Dangerous One?",
      emoji: "⚠️",
      shortDef: "--soft and plain reset keep your changes around after rewinding. --hard deletes them completely, with no undo.",
      longDef:
        "All three reset modes move your history back to an earlier commit — they differ only in what happens to the work in between. --soft keeps it queued up, ready to re-commit. Plain reset (the default, 'mixed') removes it from the queue but leaves it sitting in your files. --hard throws it away entirely, as if it never existed — there's no simple way to bring it back.",
      whyMatters:
        "Of the three, --hard is the one genuinely permanent command in this lesson. It's worth a two-second pause before running it — everything else here is easy to recover from if you get it wrong.",
      realWorldExample:
        "--soft and mixed reset are like unsending a text but keeping a copy in drafts. --hard is deleting the whole message from both sides — completely gone.",
      relatedTerms: ["what-is-checkout"],
    },
  ],
};

export default content;
