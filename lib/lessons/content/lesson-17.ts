import type { LessonData } from "../types";

const content: LessonData = {
  num: 17,
  orderIndex: 1,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "One roll lies, ten thousand rolls tell the truth",
  minutes: 20,
  concept:
    "A fair six-sided die has an equal 1-in-6 chance of landing on each face, but that doesn't mean six rolls will give you exactly one of each — small samples are noisy and can look wildly uneven. The way you actually see the true 1-in-6 pattern emerge is to roll the die many times and tally each outcome into a dictionary that maps a face value to how often it came up. Early on, with only a handful of rolls, one face might show up three times as often as another purely by chance. But as the roll count grows into the hundreds and thousands, each face's share of the total creeps closer and closer to about 16.7% — this steady convergence toward the true probability as sample size grows is called the law of large numbers. A for-loop and a dict are the whole mechanism: loop over every recorded roll, and for each one, read that face's counter out of the dict, add one, and write it back in.",
  conceptSimpler:
    "It's like judging whether a coin is fair — flip it twice and you might get two heads and think it's rigged, but flip it two thousand times and the near-even split reveals the truth.",
  vizStages: [
    {
      label: "1. Six rolls, one lucky streak",
      body:
        "You roll a die six times and log each result. Just by chance, face 4 shows up three times while 1 and 5 don't show up at all — nothing is wrong with the die, six rolls is simply too small a sample to reveal the true odds.",
      code:
        'rolls = [4, 2, 4, 6, 4, 3]\ncounts = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}\nfor r in rolls:\n    counts[r] = counts[r] + 1\nprint(counts)\n\n# {\'1\': 0, \'2\': 1, \'3\': 1, \'4\': 3, \'5\': 0, \'6\': 1}',
    },
    {
      label: "2. The dict is doing the counting",
      body:
        "Each pass through the loop reads the current tally for that face out of the dict, adds one, and writes it back in — the same read-increment-write pattern you'd use to count anything: votes, page views, word frequencies.",
      code: 'counts["4"] = counts["4"] + 1\n# read 2, add 1, store 3 back under key "4"',
    },
    {
      label: "3. A hundred rolls",
      body:
        "Extend the same loop to a hundred recorded rolls instead of six, and the gaps shrink dramatically — every face lands somewhere around 15 to 18 times instead of some faces at zero and others tripled.",
      code:
        "# 100 rolls tallied by the same loop\n# {'1': 15, '2': 18, '3': 16, '4': 17, '5': 16, '6': 18}",
    },
    {
      label: "4. Ten thousand rolls: the law of large numbers",
      body:
        "Push the roll count into the thousands and each face's share locks in tight around 16.7%. Individual rolls stay completely random, but the average behavior of a huge pile of them becomes almost perfectly predictable — that's the law of large numbers.",
      code:
        "# 10,000 rolls tallied by the same loop\n# {'1': 1668, '2': 1655, '3': 1682, '4': 1671, '5': 1649, '6': 1675}\n# each face lands between 16.4% and 16.8% - right around the true 1/6",
    },
  ],
  realWorldIntro:
    "This is exactly why ML teams never trust a single eval run or one user's reaction to a new feature: one sample is as noisy as one die roll, so they average scores across thousands of test cases or thousands of users before believing a model or feature actually performs better.",
  realWorldCode:
    'scores = [0.81, 0.77, 0.85, 0.79, 0.83, 0.80]\ntotal = 0\nfor s in scores:\n    total = total + s\naverage = total / len(scores)\nprint(f"average eval score across {len(scores)} runs: {average}")',
  sandbox: {
    kind: "code",
    challenge:
      "This frequency counter crashes partway through the loop — fix the counts dictionary so every face from 1 to 6 is initialized to 0 before the loop runs, then rerun it to see all six tallies print cleanly.",
    starterCode:
      'rolls = [3, 1, 4, 6, 2, 5, 3, 3, 6, 1, 2, 4, 5, 6, 3, 2, 1, 4, 6, 3]\n\ncounts = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}\n\nfor r in rolls:\n    counts[r] = counts[r] + 1\n\ntotal = len(rolls)\n\nfor face in range(1, 7):\n    key = str(face)\n    count = counts[key]\n    pct = count * 100 / total\n    print(f"Face {face}: {count} rolls ({pct}%)")',
  },
  quizQuestion:
    "You roll a die 6 times and one face comes up 4 times. After rolling it 6,000 times, that same face's share settles right around 16.7%. What does this demonstrate?",
  quizCode:
    "small = {\"4\": 4, \"1\": 1, \"2\": 1}\n# from 6 rolls\n\nlarge = {\"4\": 1013, \"1\": 987, \"2\": 998}\n# from 6,000 rolls",
  quizOptions: [
    {
      key: "a",
      label:
        "The law of large numbers: small samples are noisy, but as the number of trials grows, the observed frequencies converge toward the true underlying probability",
      correct: true,
    },
    {
      key: "b",
      label: "The die must have been slightly broken for the first six rolls and only started working correctly afterward",
      correct: false,
    },
    {
      key: "c",
      label: "Dictionaries automatically become more accurate the more times you read a value out of them",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — six rolls is a tiny, noisy sample where one face can easily land four times by chance, but six thousand rolls average that randomness out, pulling each face's share close to its true 1-in-6 probability.",
  quizFeedbackIncorrect:
    "Not quite — nothing changed about the die itself; a sample of six rolls is simply too small to reflect the true 1-in-6 odds, while thousands of rolls average that noise away until the real probability shows through.",
  takeaway:
    "A for-loop and a dict turn raw rolls into a frequency count, and the law of large numbers says the more rolls you tally, the closer those counts settle toward the true underlying probability — small samples are noisy, big ones are not.",
  nextUpLabel: "Linear Algebra Basics",
};

export default content;
