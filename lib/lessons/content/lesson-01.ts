import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 1,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Finding your way around the terminal",
  minutes: 18,
  concept:
    "A terminal is an app where you type instructions to your computer and it types back. That's it. Instead of clicking folders with a mouse, you're texting your computer — and it texts you back.\n\nEvery time you open a terminal, it's automatically sitting inside one folder on your computer. That folder is called your working directory — your current location. Everything you type happens relative to that spot.\n\nThree commands are all you need to get around:\n\npwd — stands for \"print working directory\". Type it and press Enter; your computer texts you back the full path of the folder you're currently in. Run it whenever you feel lost.\n\nls — lists the files and folders sitting inside your current location. Like asking \"what's in here?\"\n\ncd foldername — changes your location to a different folder. Like switching which folder you've opened.",
  conceptSimpler:
    "Think of it like texting. When you use the terminal, you send short text instructions to your computer and it texts you back the results. You're always 'in' one folder at a time — a bit like having one conversation open. pwd asks 'which conversation am I in right now?', ls asks 'what's in here?', and cd switches you to a different one.",
  vizStages: [
    {
      label: "1. Open the terminal — you're already somewhere",
      body:
        "The moment you open a terminal, it puts you in a starting folder on your computer. Before typing anything else, you check where you landed with pwd.",
      code: "$ pwd\n/Users/yourname",
    },
    {
      label: "2. See what's here",
      body:
        "You know you're in /Users/yourname. Run ls to see what folders and files are inside. Your computer texts them back.",
      code: "$ ls\nDesktop  Documents  Downloads  projects",
    },
    {
      label: "3. Move into a folder",
      body:
        "There's a folder called projects. You type cd projects to step into it. No response means success — silence in the terminal means the command worked fine.",
      code: "$ cd projects\n$",
    },
    {
      label: "4. Check your new location",
      body:
        "Run pwd again to confirm you've moved, then ls to see what's inside. This pwd → ls → cd loop is the pattern you'll run dozens of times a day.",
      code: "$ pwd\n/Users/yourname/projects\n$ ls\nmy-game  old-notes",
    },
  ],
  realWorldIntro:
    "Every developer runs this loop constantly — checking where they are, looking around, stepping into the right folder before running commands. Get comfortable with pwd, ls, and cd and you'll never feel lost in a terminal again.",
  realWorldCode: "$ pwd\n/Users/yourname/projects\n$ cd my-game\n$ ls\nREADME.md  package.json  src",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command to see what it does and when you'd reach for it.",
    stages: [
      {
        label: "pwd",
        body:
          "Prints the full path of the folder you're currently in. Run it any time you feel unsure about where you are — before a command that touches files, after jumping between folders, or just when you're getting started.",
        code: "$ pwd\n/Users/yourname/projects/my-game",
      },
      {
        label: "ls",
        body:
          "Lists the files and folders inside your current location. Run it after moving somewhere new so you know what's there to work with.",
        code: "$ ls\nREADME.md  package.json  src",
      },
      {
        label: "ls -a",
        body:
          "Same as ls, but also shows hidden files — ones whose names start with a dot, like .git or .env. Plain ls skips these. You'll need them once you start working with Git.",
        code: "$ ls -a\n.  ..  .git  .env  README.md  package.json  src",
      },
      {
        label: "cd foldername",
        body:
          "Moves you into a folder inside your current location. If the folder doesn't exist where you are, you'll get a 'no such file or directory' error — run ls first to check what's actually there.",
        code: "$ cd src\n$ pwd\n/Users/yourname/projects/my-game/src",
      },
      {
        label: "cd ..",
        body:
          "Moves you up one level, into the parent folder. Two dots always mean 'the folder that contains this one.' You can chain them: cd ../.. goes up two levels at once.",
        code: "$ cd ..\n$ pwd\n/Users/yourname/projects/my-game",
      },
    ],
  },
  quizQuestion:
    "You run pwd and see /Users/yourname/projects. You then run cd my-game. What will pwd show next?",
  quizCode: "$ pwd\n/Users/yourname/projects\n$ cd my-game\n$ pwd\n?",
  quizOptions: [
    { key: "a", label: "/Users/yourname/projects/my-game", correct: true },
    { key: "b", label: "/Users/yourname/my-game", correct: false },
    { key: "c", label: "/Users/yourname/projects", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — cd moves you into a folder that lives inside your current location, so your new path is your old path with /my-game added on the end.",
  quizFeedbackIncorrect:
    "Not quite — cd foldername moves you into a subfolder of where you already are. Your new path is built by adding /my-game onto the end of /Users/yourname/projects.",
  takeaway:
    "The terminal is a text conversation with your computer — you type instructions, it types back results. pwd tells you which folder you're in, ls shows what's inside it, and cd moves you somewhere else. Run pwd any time you feel lost.",
  nextUpLabel: "Python Syntax, Variables, Functions",
  explainers: [
    {
      id: "where-is-terminal",
      term: "Where Do I Find the Terminal?",
      emoji: "🔍",
      shortDef: "The terminal is a built-in app on every Mac, Windows PC, and Linux computer.",
      longDef:
        "On a Mac: open Spotlight (Cmd + Space), type Terminal, and press Enter. Or find it in Applications → Utilities → Terminal.\n\nOn Windows: press the Windows key, type PowerShell or Windows Terminal, and press Enter. Alternatively, right-click the Start button and choose Windows PowerShell or Terminal.\n\nOn Linux: most setups let you press Ctrl + Alt + T to open one straight away.",
      whyMatters:
        "You'll open the terminal constantly once you start coding — for running your code, using Git, and installing tools. It's worth finding it now and pinning it to your taskbar or dock.",
      realWorldExample:
        "Every developer has a terminal open in the corner of their screen pretty much all day. Once you've used it for a week, clicking through Finder or File Explorer to do the same things will feel oddly slow.",
      relatedTerms: ["what-is-terminal"],
      expandedByDefault: true,
    },
    {
      id: "what-is-terminal",
      term: "What Is a Terminal?",
      emoji: "⌨️",
      shortDef:
        "A terminal is a text-based way to talk to your computer. Instead of clicking folders with your mouse, you type commands.",
      longDef:
        "A terminal (also called 'command line' or 'shell') is a program that lets you control your computer by typing text instructions instead of clicking buttons. Every modern computer — Mac, Windows, Linux — has one built in. It's faster and more powerful than clicking around for a lot of common tasks, which is why developers use it all day.",
      whyMatters:
        "Almost all real coding work involves the terminal at some point — running your code, installing tools, using Git. Learning the basics now means none of that will surprise you later.",
      realWorldExample:
        "It's a bit like texting your computer: you send a short instruction ('ls' = 'show me what's in this folder'), and your computer texts you back the result. No clicking, no opening windows — just a direct line.",
      relatedTerms: ["where-is-terminal", "what-is-folder", "what-is-command"],
    },
    {
      id: "what-is-folder",
      term: "What's a Folder (Directory)?",
      emoji: "📁",
      shortDef: "A folder is a container for files and other folders — exactly what you see in Finder or File Explorer.",
      longDef:
        "In the terminal, folders are usually called 'directories' — that's the older, more technical name for the same thing. A directory holds files, and it can hold other directories inside it, nested as deep as you like. Nothing about your files changes when you switch from clicking through Finder to typing in a terminal — they're the same folders, just a different way of looking at them.",
      whyMatters:
        "Every command you type happens inside whatever folder you're currently in. Knowing which one that is — and being able to move between them — is the most important basic skill in the terminal.",
      realWorldExample:
        "If you're in your Downloads folder and you say 'delete that file,' you mean a file in Downloads, not one on your Desktop. Same instruction, different folder, completely different result.",
      relatedTerms: ["what-is-working-directory"],
    },
    {
      id: "what-is-command",
      term: "What's a Command?",
      emoji: "🎯",
      shortDef: "A command is an instruction you type to make your computer do something specific.",
      longDef:
        "When you type pwd or ls in the terminal, you're typing a command. Each command is a small program that does one job. pwd stands for 'print working directory' — it shows you which folder you're in. ls stands for 'list' — it shows what's inside that folder. cd stands for 'change directory' — it moves you to a different folder.",
      whyMatters:
        "Commands are how you operate a computer without a mouse. A small set of them — pwd, ls, cd to start — are enough to navigate and inspect anything on your machine.",
      realWorldExample:
        "A command is like one text message to your computer. You send 'pwd' and it texts back the folder name. You send 'ls' and it texts back a list of what's inside. Short message, instant reply.",
      relatedTerms: ["what-is-terminal"],
    },
    {
      id: "what-is-working-directory",
      term: "What's a Working Directory?",
      emoji: "📍",
      shortDef:
        "The working directory is the one folder your terminal is currently focused on — your current location.",
      longDef:
        "At any moment, your terminal is focused on exactly one folder. Every command you type acts on that folder. If you list files, you're listing files in that folder. If you create a file, it appears in that folder. Switch to a different folder with cd, and every subsequent command acts there instead — even if you typed the exact same thing.",
      whyMatters:
        "This is the most common cause of beginner confusion. If a command doesn't behave the way you expected, the first thing to check is: am I even in the folder I think I'm in? Run pwd and find out.",
      realWorldExample:
        "Think of it like being in a specific group chat. Everything you type goes into that chat, and everything you 'ls' (look at) shows that chat's contents. cd is switching chats — once you do, your next messages land somewhere completely different.",
      relatedTerms: ["what-is-folder"],
    },
  ],
};

export default content;
