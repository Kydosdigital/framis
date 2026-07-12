import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 2,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Save points for your code: git init, add, and commit",
  minutes: 20,
  concept:
    "Imagine you're writing an essay in a notebook. If you never save your work, and you make a mistake, your old version is just... gone.\n\n" +
    "Git fixes that. Git is a save system for your work — like a video game that lets you save your progress and go back to an old save if you need to.\n\n" +
    "A \"file\" is just anything you create and save — a document, an essay, a drawing. Right now, imagine you're working on a file called essay.txt.\n\n" +
    "Here's how saving works in Git, using three commands.\n\n" +
    "git init turns saving on for a folder. You only do this once — it's like inserting a game cartridge before you can start saving progress.\n\n" +
    "git add chooses what you want to save. It doesn't save yet — it just picks what goes into your next save, like choosing which items go into your inventory before you save your game.\n\n" +
    "git commit actually saves it, with a name. This is like pressing Save and naming the save slot — \"Finished my essay intro\".\n\n" +
    "That's it. Three steps: turn saving on, choose what to save, then save.",
  conceptSimpler:
    "Git is like a video game save system for your work.\n\n" +
    "git init = put the game cartridge in\n" +
    "git add = choose what to save\n" +
    "git commit = press Save, and give it a name",
  vizStages: [
    {
      label: "1. Turn saving on",
      body:
        "You're in the folder with your essay in it. Type git init once to switch Git's save system on for that folder. Your computer confirms it's ready — from now on, Git can save your progress here.",
      code: "$ git init\nInitialized empty Git repository",
    },
    {
      label: "2. Choose what to save",
      body:
        "Type git add essay.txt to pick that file for your next save. Nothing shows up on screen — that's normal. You've just chosen essay.txt to be included in your next save.",
      code: "$ git add essay.txt",
    },
    {
      label: "3. Save it, with a name",
      body:
        "Type git commit with a short message describing what you did. Your computer confirms one file was saved. That message is the name on this save slot — it's how you'll find this exact version later.",
      code: "$ git commit -m \"Finished my essay intro\"\n1 file changed",
    },
  ],
  realWorldIntro:
    "When someone builds an app — like a game or a streaming service — they use git add and git commit all day long, exactly like this. Each commit is a save point they can go back to if something breaks. A big project has thousands of these save points, one for every change the team ever made.",
  realWorldCode:
    "Save points, newest first:\n\nFinished my essay intro\nAdd animated loading screen\nFirst working version",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it does and when you'd reach for it.",
    stages: [
      {
        label: "git init",
        body:
          "Turns the current folder into a place Git can save. It creates a hidden .git folder inside that quietly stores all your future saves. Run this exactly once — the first time you want Git to start saving a folder.",
        code: "$ git init\nInitialized empty Git repository",
      },
      {
        label: "git add",
        body:
          "Chooses a file to include in your next save. You can add one file at a time (git add essay.txt) or everything at once (git add .). Nothing is saved yet — you're just picking what goes in.",
        code: "$ git add essay.txt",
      },
      {
        label: "git commit -m \"message\"",
        body:
          "Saves everything you've chosen as a permanent save point, with your message as its name. Only the files you added get included — anything you didn't add is left out.",
        code: "$ git commit -m \"Finished my essay intro\"\n1 file changed",
      },
    ],
  },
  quizQuestion:
    "You edit two files, essay.txt and notes.txt, but only run git add essay.txt before saving. What happens to notes.txt?",
  quizCode: "$ git add essay.txt\n$ git commit -m \"Finish essay intro\"",
  quizOptions: [
    { key: "a", label: "It gets saved too, since it was also changed", correct: false },
    { key: "b", label: "It stays changed but not saved — it isn't part of this save", correct: true },
    { key: "c", label: "Git refuses to save until every changed file is added", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — only the files you choose with git add are included in a save. You added essay.txt but not notes.txt, so notes.txt stays changed but unsaved, waiting for you to add it next time.",
  quizFeedbackIncorrect:
    "Not quite — git commit only saves the files you chose with git add. Since notes.txt was never added, its changes stay there, unsaved — waiting for you to pick it next time.",
  takeaway:
    "Three steps, every time: git init turns saving on for a folder (just once), git add chooses what to save, and git commit saves it with a name you'll recognise later.",
  explainers: [
    {
      id: "what-is-repository",
      term: "What's a Repository (\"repo\")?",
      emoji: "🗂️",
      shortDef:
        "A repository is a folder that Git has been set up to save — it keeps a full history of every save you've ever made.",
      longDef:
        "Running git init in a folder creates a hidden .git folder inside it. That's what turns an ordinary folder into a repository. Git uses it to store every save you've ever made, so you can look back at or restore any of them later. Your actual files look and work exactly the same — Git just quietly keeps a history alongside them.",
      whyMatters:
        "Without a repository, every change you make is permanent with no way back. With one, every save stays in the history, so you can always return to a version that worked.",
      realWorldExample:
        "It's like a video game save file that keeps every checkpoint you've ever reached, not just the last one. You can reload any of them at any point.",
      relatedTerms: ["what-is-staging-area", "what-is-commit"],
      expandedByDefault: true,
    },
    {
      id: "what-is-staging-area",
      term: "What Does git add Actually Do?",
      emoji: "🗃️",
      shortDef:
        "git add chooses which changes go into your next save — nothing is included automatically.",
      longDef:
        "Editing a file doesn't save anything in Git; it just becomes a change Git has noticed. Running git add on a file marks it to be included in your next save. You can edit ten files and only add three of them, and only those three end up in the next commit. It's the step that lets you decide exactly what a save contains.",
      whyMatters:
        "This gives you control over exactly what gets saved together. You can make a small, focused save instead of accidentally bundling unrelated changes all at once.",
      realWorldExample:
        "It's like choosing which items to lock in before pressing Save in a video game. Only the items you pick get stored in the save slot — the rest stay where they are, waiting.",
      relatedTerms: ["what-is-commit"],
    },
    {
      id: "what-is-commit",
      term: "What's a Commit?",
      emoji: "💾",
      shortDef:
        "A commit is a permanent save of everything you've chosen, stored with a short name describing what changed.",
      longDef:
        "Running git commit -m \"message\" takes whatever you added and locks it in as a save point with your label on it. That save point stays in your history — you can look back through your history later, and even restore your whole folder to that exact state.",
      whyMatters:
        "A commit is the undo history for your whole project, not just your last keypress. The habit of committing often — after every small, working change — is what makes Git useful when something breaks.",
      realWorldExample:
        "It's exactly like pressing Save in a video game after you clear a level. If something goes wrong later, you reload that checkpoint instead of starting over.",
      relatedTerms: ["what-is-staging-area", "what-is-repository"],
    },
  ],
};

export default content;
