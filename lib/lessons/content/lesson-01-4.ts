import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 4,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Syncing with the outside world: clone, push, and pull",
  minutes: 20,
  concept:
    "So far, every commit has lived only on your own computer. A remote is a copy of a repository stored somewhere else — almost always on a service like GitHub — that you and your teammates can all connect to. git clone downloads a full copy of a remote repository, history and all, onto your machine, and automatically remembers that remote under the name origin. Once you have local commits, git push origin main uploads them to the remote, making them visible to everyone else with access. Going the other direction, git pull origin main downloads any commits your teammates have pushed and merges them into your local branch. Because push only works if your local history and the remote's history agree, you'll often need to pull before you can push — if someone else pushed while you were working, Git makes you fetch and merge their commits first so nothing gets silently overwritten.",
  conceptSimpler:
    "A remote is like a shared folder in the cloud — clone is downloading your own copy of everything in it, push is uploading your new files to share with everyone else, and pull is downloading the files your teammates already added.",
  vizStages: [
    {
      label: "1. Clone a project",
      body:
        "Someone shares a repository's URL with you. git clone downloads the entire project — every file and every commit in its history — onto your computer, ready to work on.",
      code:
        "$ git clone https://github.com/framis/framis-app.git\nCloning into 'framis-app'...\nremote: Enumerating objects: 142, done.",
    },
    {
      label: "2. Commit locally, same as always",
      body:
        "You make changes and commit them exactly like before — cloning doesn't change how git add and git commit work, it just means those commits happen on a copy connected to a remote.",
      code:
        "$ git add index.html\n$ git commit -m \"Update footer copyright year\"\n[main 4d5e6f7] Update footer copyright year",
    },
    {
      label: "3. Push your commits",
      body:
        "Your commit only exists on your machine until you push it. git push origin main uploads it to the remote named origin, onto the main branch, so teammates can now see and pull it.",
      code: "$ git push origin main\nTo https://github.com/framis/framis-app.git\n   a1b2c3d..4d5e6f7  main -> main",
    },
    {
      label: "4. Pull your teammates' commits",
      body:
        "While you were working, a teammate pushed their own commit. git pull origin main downloads it and merges it into your local branch, bringing you up to date before you keep going.",
      code:
        "$ git pull origin main\nremote: Enumerating objects: 5, done.\nUpdating 4d5e6f7..9a0b1c2\nFast-forward\n styles.css | 3 +++",
    },
  ],
  realWorldIntro:
    "On a real team, developers pull first thing when they sit down to work so they're never coding on stale files, and push once a feature or fix is committed and ready for teammates — or a deployment pipeline — to pick up.",
  realWorldCode:
    "$ git pull origin main\nAlready up to date.\n$ git push origin main\nTo https://github.com/framis/framis-app.git\n   9a0b1c2..b3c4d5e  main -> main",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command and scenario to see how projects move between your computer and a remote.",
    stages: [
      {
        label: "git clone <url>",
        body:
          "Downloads a full copy of a remote repository — files, history, everything — into a new folder on your machine, and sets up that remote as origin automatically. You typically run this once, the first time you get a project.",
        code:
          "$ git clone https://github.com/framis/framis-app.git\nCloning into 'framis-app'...\nremote: Enumerating objects: 142, done.\nReceiving objects: 100% (142/142), done.",
      },
      {
        label: "git remote -v",
        body:
          "Lists the remotes your local repository knows about and their URLs. Run this if you're ever unsure where \"origin\" actually points, especially in an older project you didn't clone yourself.",
        code:
          "$ git remote -v\norigin  https://github.com/framis/framis-app.git (fetch)\norigin  https://github.com/framis/framis-app.git (push)",
      },
      {
        label: "git push origin main",
        body:
          "Uploads your local commits on the main branch to the remote called origin. Use this once you've committed work you want your team (or a deploy pipeline watching the remote) to see.",
        code:
          "$ git push origin main\nTo https://github.com/framis/framis-app.git\n   a1b2c3d..4d5e6f7  main -> main",
      },
      {
        label: "git pull origin main",
        body:
          "Downloads any commits from the remote's main branch that you don't have yet, and merges them into your local main. Run this at the start of a work session, or whenever you suspect teammates have pushed changes.",
        code:
          "$ git pull origin main\nUpdating 4d5e6f7..9a0b1c2\nFast-forward\n api.js | 8 +++++---",
      },
      {
        label: "A rejected push",
        body:
          "If a teammate pushed commits you don't have yet, Git refuses your push to protect their work from being overwritten. The fix is to git pull first — merging their commits into yours — then push again.",
        code:
          "$ git push origin main\n! [rejected]  main -> main (fetch first)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally.",
      },
    ],
  },
  quizQuestion:
    "You run git push and see: \"Updates were rejected because the remote contains work that you do not have locally.\" What should you do?",
  quizCode: "$ git push origin main\n! [rejected]  main -> main (fetch first)",
  quizOptions: [
    { key: "a", label: "Run git push --force to overwrite the remote with your version", correct: false },
    { key: "b", label: "git pull origin main to merge in the missing commits, then push again", correct: true },
    { key: "c", label: "Delete the remote and re-clone the repository from scratch", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — the rejection means someone else's commits exist on the remote that you don't have yet, so pulling first merges their work into yours safely before you push your own commits on top.",
  quizFeedbackIncorrect:
    "Not quite — forcing the push would overwrite and potentially destroy your teammate's commits, and re-cloning would lose your own uncommitted local work. Pulling first merges both histories safely, which is exactly what the error is asking you to do.",
  takeaway:
    "git clone gets you a working copy of a shared project, git push shares your commits with everyone else, and git pull brings their commits to you — pull often, and pull before you push, to keep everyone in sync.",
};

export default content;
