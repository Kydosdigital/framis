import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 4,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Syncing with the outside world: clone, push, and pull",
  minutes: 20,
  concept:
    "Every commit you've made so far only exists on your computer. Git also works with online copies of a project — stored on a website called GitHub — that you and others can all connect to.\n\nThink of it like shared class notes. Your teacher posts the notes online. You download a copy to work from. When you add something useful, you upload your additions so the whole class can see them too.\n\nThree commands make this work:\n\ngit clone <url> — downloads a full copy of an online project onto your computer, including the entire save history. It also automatically remembers where you got it from and names that location 'origin'.\n\ngit push origin main — uploads your new commits to the online copy so others can see them. 'origin' is the nickname for where the project lives online. 'main' is the name of the main save line.\n\ngit pull origin main — downloads any new commits that other people have pushed while you were working, and adds them to your copy.\n\nOne thing to know: if someone else pushed commits while you were working, Git won't let you push until you pull their changes first — so your saves and theirs don't accidentally overwrite each other.",
  conceptSimpler:
    "Imagine shared notes for a class, posted online. git clone is saving a copy of those notes to your phone. git push is adding your own notes to the shared version so everyone can see them. And git pull is tapping Refresh to see what your classmates added while you were away.",
  vizStages: [
    {
      label: "1. Download a copy of an online project",
      body:
        "Someone has shared a project online with a URL. git clone downloads the entire thing — every file and the full save history — onto your computer, ready to work on. Git automatically remembers where it came from and calls that location 'origin'.",
      code:
        "$ git clone https://github.com/example/my-game.git\nCloning into 'my-game'...\nremote: Enumerating objects: 142, done.",
    },
    {
      label: "2. Save your changes locally, same as always",
      body:
        "You make a change and save it with git add and git commit — exactly the same as before. Cloning doesn't change how saving works; commits still happen the same way.",
      code:
        "$ git add notes.txt\n$ git commit -m \"Add tips for level 3\"\n[main 4d5e6f7] Add tips for level 3",
    },
    {
      label: "3. Upload your commits to share them",
      body:
        "Your commit only exists on your machine until you push it. git push origin main uploads it to the online copy, so anyone else working on the project can now see it — and it's backed up online.",
      code: "$ git push origin main\nTo https://github.com/example/my-game.git\n   a1b2c3d..4d5e6f7  main -> main",
    },
    {
      label: "4. Download your friend's updates",
      body:
        "While you were working, a friend pushed their own commits. git pull origin main downloads their new saves and adds them to your copy, so you're both working from the same up-to-date version.",
      code:
        "$ git pull origin main\nUpdating 4d5e6f7..9a0b1c2\nFast-forward\n notes.txt | 3 +++",
    },
  ],
  realWorldIntro:
    "Apps like games, Instagram, and YouTube all live in shared repositories online. The team pulls at the start of each day to get the latest work, makes their own changes, and pushes when done. Every developer on the planet uses clone, push, and pull — you now know the same workflow they do.",
  realWorldCode:
    "$ git pull origin main\nAlready up to date.\n$ git push origin main\nTo https://github.com/example/my-game.git\n   9a0b1c2..b3c4d5e  main -> main",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command and scenario to see how a project moves between your computer and an online copy.",
    stages: [
      {
        label: "git clone <url>",
        body:
          "Downloads a full copy of an online repository — files, save history, everything — into a new folder on your machine, and sets up that online copy as 'origin' automatically. You run this once, the first time you get a project.",
        code:
          "$ git clone https://github.com/example/my-game.git\nCloning into 'my-game'...\nremote: Enumerating objects: 142, done.\nReceiving objects: 100% (142/142), done.",
      },
      {
        label: "git remote -v",
        body:
          "Lists the online locations your repository knows about and their addresses. Run this if you're ever unsure where 'origin' actually points.",
        code:
          "$ git remote -v\norigin  https://github.com/example/my-game.git (fetch)\norigin  https://github.com/example/my-game.git (push)",
      },
      {
        label: "git push origin main",
        body:
          "Uploads your local commits on the main branch to the online copy called origin. Use this once you've committed work you want your team (or anyone watching the project) to see.",
        code:
          "$ git push origin main\nTo https://github.com/example/my-game.git\n   a1b2c3d..4d5e6f7  main -> main",
      },
      {
        label: "git pull origin main",
        body:
          "Downloads any commits from the online copy that you don't have yet, and adds them to your local main. Run this at the start of a work session, or whenever you think someone else may have pushed something new.",
        code:
          "$ git pull origin main\nUpdating 4d5e6f7..9a0b1c2\nFast-forward\n notes.txt | 8 +++++---",
      },
      {
        label: "A rejected push",
        body:
          "If a friend pushed commits you don't have yet, Git refuses your push to protect their work from being overwritten. The fix is to git pull first — merging their saves into yours — then push again.",
        code:
          "$ git push origin main\n! [rejected]  main -> main (fetch first)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally.",
      },
    ],
  },
  quizQuestion:
    "You run git push and see: \"Updates were rejected because the remote contains work that you do not have locally.\" What should you do?",
  quizCode: "$ git push origin main\n! [rejected]  main -> main (fetch first)",
  quizOptions: [
    { key: "a", label: "Run git push --force to overwrite the online copy with your version", correct: false },
    { key: "b", label: "git pull origin main to bring in the missing commits, then push again", correct: true },
    { key: "c", label: "Delete everything and re-download the project from scratch", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the rejection means someone else's commits exist online that you don't have yet. Pulling first merges their work into yours safely before you push your own commits on top.",
  quizFeedbackIncorrect:
    "Not quite — forcing the push would overwrite and destroy your friend's commits. Re-downloading would lose your own uncommitted local work. Pulling first merges both sets of saves safely — which is exactly what the error is asking you to do.",
  takeaway:
    "git clone gets you a working copy of an online project. git push shares your commits with everyone else. git pull brings their commits to you. Pull before you start working, and pull again before you push, to keep everyone in sync.",
  explainers: [
    {
      id: "what-is-remote",
      term: "What's a Remote?",
      emoji: "☁️",
      shortDef: "A remote is a copy of your repository stored online — usually on a website called GitHub — that you and others can all connect to.",
      longDef:
        "Every repository you've worked with so far has lived only on your own computer. A remote is a copy of that same repository hosted on a server, usually GitHub, that you and anyone you share it with can all connect to. It's what makes Git collaborative — without a remote, your commits never leave your machine.",
      whyMatters:
        "A remote is the shared version that the whole team works from. Understanding it is the difference between 'my work saved on my laptop' and 'work the whole team can see, use, and build on together.'",
      realWorldExample:
        "It's like shared class notes posted online. Instead of one person having the only copy on their computer, everyone can access the same version and add to it.",
      relatedTerms: ["what-is-origin", "what-is-clone"],
      expandedByDefault: true,
    },
    {
      id: "what-is-origin",
      term: "What Does \"origin\" Mean?",
      emoji: "🏷️",
      shortDef: "\"origin\" is just the default nickname Git gives to the online copy you cloned from.",
      longDef:
        "When you run git clone, Git automatically remembers where it came from and labels that location 'origin' so you don't have to type the full web address every time. That's why commands look like git push origin main — 'origin' is shorthand for 'the online copy I originally got this from,' and 'main' is which branch you're pushing.",
      whyMatters:
        "Seeing 'origin' in a command can look like unexplained magic if you don't know it's just a name. Once you know it's a nickname Git assigned automatically, push and pull commands stop looking cryptic.",
      realWorldExample:
        "It's like saving a contact in your phone as 'Class Notes' instead of typing the full URL every time — 'origin' is a saved shortcut to an address Git already knows.",
      relatedTerms: ["what-is-remote"],
    },
    {
      id: "what-is-clone",
      term: "What Does git clone Actually Do?",
      emoji: "⬇️",
      shortDef: "git clone downloads a full copy of an online repository — every file and its entire save history — onto your computer.",
      longDef:
        "Cloning isn't just downloading the current files; it copies the project's full save history along with them, so git log works immediately and you can see every past commit. It also automatically sets up the remote as 'origin,' ready for you to push and pull right away.",
      whyMatters:
        "This is usually the very first command you run on any existing project — it's how you go from 'a project exists somewhere online' to 'I have a fully working copy on my machine.'",
      realWorldExample:
        "It's like downloading the shared class notes to your own phone — not just today's version, but every version the teacher ever posted, saved so you can look back through all of them.",
      relatedTerms: ["what-is-remote"],
    },
    {
      id: "what-is-push-pull",
      term: "push vs. pull — Which Way Is the Data Going?",
      emoji: "🔄",
      shortDef: "git push uploads your local commits to the online copy. git pull downloads commits from the online copy and adds them to yours.",
      longDef:
        "Think of the online copy as sitting in the middle, with you on one side. push sends your new commits up to it, making them visible to everyone. pull does the opposite: it fetches commits others have pushed and adds them to your copy. Push only succeeds if your local history and the online copy agree — if someone pushed first, Git rejects your push until you pull their changes in.",
      whyMatters:
        "Mixing these up — or forgetting to pull before you push — is one of the most common early frustrations with Git. The habit that avoids almost all of it: pull before you start working, and pull again right before you push.",
      realWorldExample:
        "push is adding your notes to the shared class document. pull is tapping Refresh to see what your classmates already added.",
      relatedTerms: ["what-is-remote"],
    },
  ],
};

export default content;
