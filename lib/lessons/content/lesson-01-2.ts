import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 2,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Save points for your code: git init, add, and commit",
  minutes: 20,
  concept:
    "Imagine you're writing an essay in a notebook. If you never save your work, and you make a mistake, your old version is just... gone.\n\nGit fixes that. Git is a save system for your work — like a video game that lets you save your progress and go back to an old save if you need to.\n\nA file is just anything you create and save — a document, an essay, a drawing. Right now, imagine you're working on a file called essay.txt.\n\nHere's how saving works in Git, using three commands:\n\ngit init — turns saving ON for a folder.\nYou only do this once. It's like inserting a game cartridge before you can start saving progress.\n\ngit add — chooses what you want to save.\nThis doesn't save yet — it just picks what goes into your next save. Like choosing which items go into your inventory before you save your game.\n\ngit commit — actually saves it, with a name.\nThis is like pressing Save and naming the save slot — \"Finished Level 3\", or in our case, \"Finished my essay intro\".\n\nThat's it. Three steps: turn saving on, choose what to save, then save.",
  conceptSimpler:
    "Git is like a video game save system for your work.\n\n- git init = put the game cartridge in\n- git add = choose what to save\n- git commit = press Save, and give it a name",
  vizStages: [
    {
      label: "1. Turn saving on",
      body:
        "Start inside the folder where your work lives. When you type git init, Git switches its save system on for that folder. You only do this once.",
      code: "$ git init\nInitialized empty Git repository in /Users/yourname/homework/.git/",
    },
    {
      label: "2. Choose the file for the next save",
      body:
        "Now you pick what should go into the next save. git add essay.txt means 'include this file when I save next.' Nothing prints on screen here — that's normal.",
      code: "$ git add essay.txt",
    },
    {
      label: "3. Save it with a name",
      body:
        "git commit -m \"...\" is the actual save. The message is the name of this save point, so future-you knows what was finished here.",
      code:
        "$ git commit -m \"Finished my essay intro\"\n[main a1b2c3d] Finished my essay intro\n 1 file changed",
    },
  ],
  realWorldIntro:
    "When someone builds an app — like a game or a streaming service — they keep making small save points as they work. Each commit is a checkpoint they can come back to if something breaks.",
  realWorldCode:
    "$ git add login-screen.txt\n$ git commit -m \"Finish login screen layout\"",
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
        label: "git add",
        body:
          "Chooses a file to include in your next save. It doesn't save anything yet — it just marks that file as part of the next commit.",
        code: "$ git add essay.txt",
      },
      {
        label: "git commit -m \"message\"",
        body:
          "Saves everything you've chosen with git add as a permanent snapshot, with your message attached. Only chosen files get included — anything you didn't git add is left out.",
        code:
          "$ git commit -m \"Add chapter 2 notes\"\n[main 7f8e9d0] Add chapter 2 notes\n 1 file changed, 12 insertions(+)",
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
    "git init turns on Git's save system for a folder — run it once. git add chooses what you want to save next. git commit takes the snapshot with a message.",
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
        "Editing a file doesn't save anything in Git yet. Running git add moves a specific change into the staging area, which is Git's way of saying 'yes, put this in the next snapshot.' You can edit ten files and only stage three of them, and only those three end up in the next commit.",
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
        "Running git commit -m \"message\" takes whatever is in the staging area and locks it in as a numbered, timestamped snapshot with your label on it. That snapshot stays in the history forever, and you can restore your whole folder to that exact state later on.",
      whyMatters:
        "A commit is the undo history for your whole project, not just your last keypress. The habit of committing often — after every small, working change — is what makes Git actually useful when something breaks.",
      realWorldExample:
        "It's exactly like pressing Save in a video game after you clear a level. If something goes wrong later, you reload that checkpoint instead of starting the whole thing over.",
      relatedTerms: ["what-is-staging-area", "what-is-repository"],
    },
  ],
};

export default content;
