import type { LessonData } from "../types";

const content: LessonData = {
  num: 3,
  orderIndex: 1,
  phaseLabel: "DATA STRUCTURES + CONTROL FLOW",
  title: "The filter: building a new list from an old one",
  minutes: 22,
  concept:
    "You already know the two moves this lesson combines. A for loop walks through a list one item at a time, and an if check makes a decision about each item as it goes by. Put them together and you get one of the most common patterns in all of programming: the filter.\n\n" +
    "Picture a bouncer at a party with a guest list. Everyone in the queue gets looked at, one at a time. The ones who match the rule get waved through into the room; everyone else is simply passed over. Nobody gets thrown out of the queue — they just don't make it into the room.\n\n" +
    "In code, the \"room\" is a brand-new list that starts out empty. You loop over the original list, and inside the loop an if tests each item. When an item passes the test, you .append() it into the new list. When it fails, you do nothing at all — it stays in the original list but never gets copied across.\n\n" +
    "By the time the loop finishes, the new list holds only the items that passed. The original is untouched — you didn't delete anything, you just chose what to copy. That's the whole pattern: for to visit, if to decide, append to keep.",
  conceptSimpler:
    "It's a bouncer with a guest list.\n\n" +
    "Everyone in the queue (the original list) gets checked one at a time (the for loop). The rule (the if) decides who gets in. The ones who pass are waved into the room — a new list you append to. Everyone else is passed over.\n\n" +
    "Nobody is thrown out of the queue; you're just choosing who to let into the room.",
  vizStages: [
    {
      label: "1. Two lists: the queue, and an empty room",
      body:
        "You start with the original list, scores, plus a brand-new empty list, passing, that will hold only the scores that make it through.",
      code: "scores = [55, 82, 91, 40, 76]\npassing = []",
    },
    {
      label: "2. The for loop checks one at a time",
      body:
        "for score in scores runs the block once per item, so score is 55, then 82, then 91, then 40, then 76 — one at a time, like the bouncer working down the queue.",
      code: "for score in scores:\n    if score >= 60:\n        passing.append(score)",
    },
    {
      label: "3. The if decides: wave through, or pass over",
      body:
        "Each score is tested against the same rule. When it passes, it's appended into passing — waved in. When it fails, nothing happens — passed over. Either way, scores itself is never changed.",
      code: "score = 91   # 91 >= 60 is True,  so append 91\nscore = 40   # 40 >= 60 is False, so skip it",
    },
    {
      label: "4. After the loop: only the ones who passed",
      body:
        "Once every score has been checked, passing holds just the ones that made it through — it prints [82, 91, 76], and its length is 3. The original scores list never changed.",
      code: "print(passing)\nprint(len(passing))",
    },
  ],
  realWorldIntro:
    "This exact for + if + append pattern runs behind a \"show only items under £20\" filter, or a \"text just the students who haven't handed in homework\" job — the program starts with one big list and hands back a shorter one holding only the entries that matter.",
  realWorldCode:
    "prices = [12, 40, 8, 95, 60]\ncheap = []\nfor price in prices:\n    if price < 20:\n        cheap.append(price)\nprint(cheap)",
  sandbox: {
    kind: "code",
    challenge:
      "This code builds free_shipping, keeping only orders of 75 and above. Add a second list called big_orders that keeps only orders over 100, using the same for + if + append pattern. Then print big_orders too.",
    starterCode:
      'orders = [42, 88, 15, 75, 120, 60, 8]\nfree_shipping = []\nfor total in orders:\n    if total >= 75:\n        free_shipping.append(total)\nprint("Free shipping orders:", free_shipping)\nprint("Count:", len(free_shipping))',
    language: "python",
  },
  quizQuestion: "What does this code print?",
  quizCode:
    "nums = [3, 8, 15, 4, 9, 20]\nbig = []\nfor n in nums:\n    if n > 8:\n        big.append(n)\nprint(big)",
  quizOptions: [
    { key: "a", label: "[15, 9, 20]", correct: true },
    { key: "b", label: "[3, 8, 15, 4, 9, 20]", correct: false },
    { key: "c", label: "[15, 20]", correct: false },
  ],
  quizFeedbackCorrect:
    "Right — each number is tested with n > 8 and only appended when it's actually greater than 8, so 15, 9, and 20 make it into big in the order they were found. 8 itself fails, since 8 > 8 is False.",
  quizFeedbackIncorrect:
    "Not quite — big only ends up with the numbers where n > 8 is True. Walk through nums one at a time (3, 8, 15, 4, 9, 20) and check each against the rule to see which three actually get appended.",
  takeaway:
    "for + if + append is the filter pattern: walk a list, test each item, and copy only the ones that pass into a new list — like a bouncer waving in only the guests on the list. The original list is never changed; you're just choosing what to keep.",
  explainers: [
    {
      id: "what-is-filtering",
      term: "What's Filtering?",
      emoji: "🚪",
      shortDef: "Filtering means going through a list and keeping only the items that pass a test, collecting them into a new list.",
      longDef:
        "The filter combines three things you already know: a for loop to visit each item, an if to test it, and .append() to keep the ones that pass. It's not a new command — it's a pattern you build from parts you've already met. You'll see it everywhere a big collection needs to become a smaller, more relevant one.",
      whyMatters:
        "Almost every list a real program shows you has been filtered first: search results, in-stock products, unread messages. Recognising the pattern means you can both read that code and write it yourself.",
      realWorldExample:
        "A bouncer at a party works down the queue and only waves in the guests on the list. The people not on the list aren't harmed — they just don't get into the room. Filtering does the same to a list's items.",
      relatedTerms: ["why-empty-list", "original-untouched"],
      expandedByDefault: true,
    },
    {
      id: "why-empty-list",
      term: "Why Start With an Empty List?",
      emoji: "📥",
      shortDef: "You create an empty list ([]) before the loop so there's somewhere to collect the items that pass the test.",
      longDef:
        "The empty list is the \"room\" the bouncer lets people into. It has to exist before the loop starts, so that each time an item passes the if, there's a list ready to .append() it onto. If you forget to create it first, there's nowhere to put the results and the code errors.",
      whyMatters:
        "This start-empty-then-append shape is the backbone of building any new list as a program runs — not just filtering. Getting used to it now makes a lot of later code feel familiar.",
      realWorldExample:
        "Before the party starts, the room is empty. As the bouncer waves guests through, it slowly fills. The empty room came first; the guests arrive one at a time.",
      relatedTerms: ["what-is-filtering"],
    },
    {
      id: "original-untouched",
      term: "The Original List Isn't Changed",
      emoji: "🧾",
      shortDef: "Filtering copies items into a new list; it never removes anything from the list you started with.",
      longDef:
        "When an item fails the if, nothing happens to it — it stays exactly where it was in the original list. Filtering only ever adds to the new list. So after the loop you have two lists: the full original, and the shorter filtered one. That's often useful, because you may still need the whole set later.",
      whyMatters:
        "Beginners often expect a failing item to be \"deleted.\" Knowing the original is left whole prevents confusion — and means you can filter the same list many different ways without destroying it.",
      realWorldExample:
        "The guests the bouncer turns away are still standing outside; they weren't removed from existence, just not let into the room. The original queue is intact.",
      relatedTerms: ["what-is-filtering"],
    },
  ],
};

export default content;
