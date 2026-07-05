import type { LessonData } from "../types";

const content: LessonData = {
  num: 1,
  orderIndex: 1,
  phaseLabel: "SETUP + TERMINAL + GIT",
  title: "Finding your way around the terminal",
  minutes: 18,
  concept:
    "Your terminal is always \"standing\" in exactly one folder at a time, called the working directory. Every command you type runs relative to that spot, so the same command can do different things depending on where you are. Three commands are how you stay oriented: pwd tells you where you are right now, ls shows you what's around you, and cd moves you somewhere else. Think of it like exploring a building blindfolded — pwd is asking \"what room am I in?\", ls is feeling around for doors and furniture, and cd is walking through one of those doors.",
  conceptSimpler:
    "The terminal is like a person standing in a dark house holding a flashlight — pwd says which room they're in, ls shines the light around to show what's there, and cd walks them through a door into another room.",
  vizStages: [
    {
      label: "1. Ask where you are",
      body:
        "You open a fresh terminal. Before doing anything else, you check your current location with pwd (\"print working directory\").",
      code: "$ pwd\n/Users/jordan",
    },
    {
      label: "2. Look around",
      body:
        "Now that you know you're in /Users/jordan, you run ls to list what's inside this folder — other folders and files you could move into or open.",
      code: "$ ls\nDesktop  Documents  Downloads  projects",
    },
    {
      label: "3. Move into a folder",
      body:
        "You see a \"projects\" folder and decide to step into it with cd (\"change directory\"). Nothing prints out — silence means success.",
      code: "$ cd projects\n$",
    },
    {
      label: "4. Confirm the move",
      body:
        "You check pwd again to confirm you actually moved, then ls again to see what's inside this new folder. This pwd-ls-cd loop is something you'll repeat constantly.",
      code: "$ pwd\n/Users/jordan/projects\n$ ls\nframis-app  old-notes",
    },
  ],
  realWorldIntro:
    "Developers run this exact loop dozens of times a day — landing in a new folder after cloning a project, jumping between a frontend and backend folder, or double-checking they're not about to run a command in the wrong place.",
  realWorldCode: "$ pwd\n/Users/jordan/projects\n$ cd framis-app\n$ ls\nREADME.md  package.json  src",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each command below to see what it does and when you'd reach for it.",
    stages: [
      {
        label: "pwd",
        body:
          "Prints the full path of the folder you're currently standing in. Use it whenever you feel lost or before running a command that affects files, so you know exactly where it will act.",
        code: "$ pwd\n/Users/jordan/projects/framis-app",
      },
      {
        label: "ls",
        body:
          "Lists the files and folders inside your current location. Run it right after moving somewhere new so you know what you're working with.",
        code: "$ ls\nREADME.md  package.json  src",
      },
      {
        label: "ls -a",
        body:
          "Same as ls, but also reveals \"hidden\" files and folders — ones whose names start with a dot, like .git or .env, which plain ls skips over.",
        code: "$ ls -a\n.  ..  .git  .env  README.md  package.json  src",
      },
      {
        label: "cd foldername",
        body:
          "Moves you into a folder that's inside your current one. It only works if that folder actually exists where you are — otherwise you'll get a \"no such file or directory\" error.",
        code: "$ cd src\n$ pwd\n/Users/jordan/projects/framis-app/src",
      },
      {
        label: "cd ..",
        body:
          "Moves you up one level, into the parent of your current folder. Two dots always mean \"the folder that contains this one,\" no matter where you are.",
        code: "$ cd ..\n$ pwd\n/Users/jordan/projects/framis-app",
      },
    ],
  },
  quizQuestion:
    "You run pwd and see /Users/jordan/projects. You then run cd framis-app. What will pwd print next?",
  quizCode: "$ pwd\n/Users/jordan/projects\n$ cd framis-app\n$ pwd\n?",
  quizOptions: [
    { key: "a", label: "/Users/jordan/projects/framis-app", correct: true },
    { key: "b", label: "/Users/jordan/framis-app", correct: false },
    { key: "c", label: "/Users/jordan/projects", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — cd framis-app moves you into a subfolder named framis-app inside your current location, so the new path is your old path with /framis-app added on the end.",
  quizFeedbackIncorrect:
    "Not quite — cd foldername moves you into a folder that lives inside your current directory, so the new path is built by adding /framis-app onto the end of /Users/jordan/projects.",
  takeaway:
    "pwd, ls, and cd are the three moves you'll use constantly: pwd tells you where you are, ls shows you what's there, and cd takes you somewhere else. Master this loop and you'll never feel lost in a terminal again.",
  nextUpLabel: "Python Syntax, Variables, Functions",
  explainers: [
    {
      id: "what-is-terminal",
      term: "What is a Terminal?",
      emoji: "⌨️",
      shortDef:
        "A terminal is a text-based way to talk to your computer. Instead of clicking folders with your mouse, you type commands.",
      longDef:
        "A terminal (also called \"command line\" or \"shell\") is a program that lets you control your computer by typing text commands instead of clicking buttons. Every modern computer — Mac, Windows, Linux — has one built in. It's faster and more powerful than using a mouse for a lot of tasks, which is why developers live in it all day.",
      whyMatters:
        "Almost all real coding work happens in the terminal — running your code, installing tools, using Git. Learning it is like learning to drive: it feels awkward for the first week, then it opens up everything else.",
      realWorldExample:
        "Imagine your computer's files are a building. Clicking through Finder or File Explorer is like walking the halls looking in every room. The terminal is like having a walkie-talkie — you can ask for something to happen instantly without walking there yourself.",
      relatedTerms: ["what-is-folder", "what-is-command"],
      expandedByDefault: true,
    },
    {
      id: "what-is-folder",
      term: "What's a Folder (Directory)?",
      emoji: "📁",
      shortDef: "A folder is a container for files and other folders — the exact same thing you see in Finder or File Explorer.",
      longDef:
        "In the terminal, folders are usually called \"directories\" — that's just the old, more technical name for the same idea. A directory can hold files, and it can hold other directories inside it, nested as deep as you like. Nothing about the underlying files changes when you switch from clicking through Finder to typing in a terminal — it's the same folders, just a different way of looking at them.",
      whyMatters:
        "Every command you run happens \"inside\" whatever folder you're currently in. If you don't know which folder that is, a command can affect files you didn't mean to touch.",
      realWorldExample:
        "If you're standing in your Downloads folder and you say \"move that file,\" you mean a file in Downloads — not one sitting on your Desktop. Same instruction, different folder, different result.",
      relatedTerms: ["what-is-working-directory"],
    },
    {
      id: "what-is-command",
      term: "What's a Command?",
      emoji: "🎯",
      shortDef: "A command is an instruction you type to make your computer do something specific.",
      longDef:
        "When you type pwd or ls in the terminal, you're typing a command. Each command is a small, focused program that does one job. pwd literally stands for \"print working directory\" — it means \"show me which folder I'm in right now.\" ls stands for \"list\" — it shows you what's inside that folder.",
      whyMatters:
        "Commands are how you control a computer without a mouse. Learning a small set of them (pwd, ls, cd to start) lets you navigate and inspect anything on your machine.",
      realWorldExample:
        "A command is like one line of a recipe. pwd is like asking \"what room am I standing in?\" ls is like asking \"what's in this room?\" cd is like walking through a specific door into another room.",
      relatedTerms: ["what-is-terminal"],
    },
    {
      id: "what-is-working-directory",
      term: "What's a Working Directory?",
      emoji: "📍",
      shortDef:
        "The working directory is the one folder your terminal is currently \"standing in\" — like your current location.",
      longDef:
        "At any given moment, your terminal is focused on exactly one folder, and that's your working directory. Every command you run happens relative to that folder. If you list files, you're listing files in this folder. If you move something, you're moving it from this folder. Change your working directory (with cd) and every one of those commands now acts somewhere else, even though you typed the exact same thing.",
      whyMatters:
        "This is the single biggest source of beginner confusion. If a command doesn't work the way you expected, the very first thing to check is: am I even in the folder I think I'm in? Get in the habit of running pwd whenever you're unsure.",
      realWorldExample:
        "It's like your current location inside a building. If you're standing in the lobby and someone says \"check the door on the left,\" they mean the lobby's left door. Stand in Room 5 instead, and \"the door on the left\" means something completely different — same instruction, different current location.",
      relatedTerms: ["what-is-folder"],
    },
  ],
};

export default content;
