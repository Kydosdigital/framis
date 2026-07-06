import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 2,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "The billionaire walks in: mean vs. median",
  minutes: 18,
  concept:
    "The mean (what people usually call \"the average\") is the sum of every value divided by how many values there are — a for-loop that adds each number to a running total, then one division at the end, gives you the mean directly. The median is a completely different idea: it's the value that sits exactly in the middle once every number is arranged from smallest to largest, so it's found by position, not by arithmetic on the values themselves. Because the mean adds up every value, one extreme number can drag it far from where most of the data actually sits; the median barely moves in that same situation, since one huge value just becomes the new largest item at the end of the line without disturbing the middle. This is exactly what \"outliers\" are — data points far outside where the rest of the data clusters — and mean vs. median is really a story about how differently two ordinary-sounding statistics react to them. Neither one is \"more correct\"; they answer different questions, and a good analyst reports both so a single freak value can't quietly distort the story.",
  conceptSimpler:
    "It's like reporting the \"average\" wealth in a coffee shop — swap in one billionaire customer and the average shoots into the millions, but the median customer, the one literally in the middle of the line, is exactly as un-rich as before.",
  vizStages: [
    {
      label: "1. Five response times, no drama",
      body:
        "Sum every value in a loop, then divide by the count — that's the mean. Here all five API response times are close together, so the mean lands right in the middle of the pack.",
      code:
        'times = [8, 9, 10, 11, 12]\n\ntotal = 0\nfor t in times:\n    total = total + t\nmean = total / len(times)\nprint(mean)\n\n# 10',
    },
    {
      label: "2. The median: found by position, not addition",
      body:
        "Because the list is already sorted smallest to largest, the median is just the item sitting at the halfway point — index len(times) // 2. No sum, no division by every value, just a lookup.",
      code:
        'middle_index = len(times) // 2\nmedian = times[middle_index]\nprint(median)\n\n# 10 - same as the mean, since this data has no outliers',
    },
    {
      label: "3. One outlier slips into the data",
      body:
        "Swap the last, largest value for something way bigger — say a request that hung and took 212ms instead of 12ms. Rerun the exact same mean calculation.",
      code:
        'times = [8, 9, 10, 11, 212]\n\ntotal = 0\nfor t in times:\n    total = total + t\nmean = total / len(times)\nprint(mean)\n\n# 50 - even though four of the five requests were still fast',
    },
    {
      label: "4. The median barely notices",
      body:
        "Run the median calculation on the same outlier-containing list. The huge value just becomes the new last item in sorted order — the middle position, and the value sitting there, doesn't change at all.",
      code:
        'middle_index = len(times) // 2\nmedian = times[middle_index]\nprint(median)\n\n# 10 - unchanged, because the outlier didn\'t move what\'s in the middle',
    },
  ],
  realWorldIntro:
    "This is exactly why production dashboards show median latency (often called p50) right next to average latency: a handful of slow, timed-out requests can drag the mean far above what a typical user actually experiences, while the median stays anchored to what most requests really look like.",
  realWorldCode:
    'latencies = [42, 45, 48, 50, 415]\n\ntotal = 0\nfor t in latencies:\n    total = total + t\nmean = total / len(latencies)\n\nmiddle_index = len(latencies) // 2\nmedian = latencies[middle_index]\n\nprint(f"mean latency: {mean}ms")\nprint(f"median latency: {median}ms")',
  sandbox: {
    kind: "code",
    challenge:
      "This script crashes trying to print the median — fix the middle-index calculation so it lands on a whole number instead of a fraction, then rerun it to see both stats print cleanly.",
    starterCode:
      'times = [4, 7, 9, 20, 40]\n\ntotal = 0\nfor t in times:\n    total = total + t\n\nmean = total / len(times)\n\nmiddle_index = len(times) / 2\nmedian = times[middle_index]\n\nprint(f"mean response time: {mean}")\nprint(f"median response time: {median}")',
  },
  quizQuestion:
    "Five response times are recorded: 8, 9, 10, 11, and 212 milliseconds. The mean comes out to 50ms and the median comes out to 10ms. Which number better describes a \"typical\" request?",
  quizCode:
    'times = [8, 9, 10, 11, 212]\n# mean: 50\n# median: 10',
  quizOptions: [
    {
      key: "a",
      label:
        "The median (10ms), because it depends only on the position of values once sorted, so the one extreme outlier barely affects it",
      correct: true,
    },
    {
      key: "b",
      label:
        "The mean (50ms), because it factors in every single value, so it's always the more complete and accurate summary",
      correct: false,
    },
    {
      key: "c",
      label:
        "Neither is meaningful once a dataset contains an outlier — both statistics become unusable at that point",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — four of the five requests were fast, and the median reflects that because it only cares about the middle position in sorted order; the mean gets pulled way up because it adds the outlier's full value into the total.",
  quizFeedbackIncorrect:
    "Not quite — \"uses every value\" is exactly the mean's weakness here, since it means one 212ms straggler can drag the average to 50ms even though four out of five requests were fast; the median (10ms) reflects the typical request much better.",
  takeaway:
    "Mean is sum divided by count and factors in every value, so a single extreme outlier can drag it far from where the data actually clusters. Median is the middle value once sorted, found by position rather than arithmetic, which makes it far more resistant to outliers — report both when an outlier is possible.",
};

export default content;
