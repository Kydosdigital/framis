import type { LessonData } from "../types";

const content: LessonData = {
  num: 21,
  orderIndex: 5,
  phaseLabel: "PROBABILITY + STATISTICS",
  title: "The test came back positive — now what? Conditional probability + Bayes' theorem",
  minutes: 22,
  concept:
    "P(A) is the plain probability of some event A — the odds of it before you know anything else. P(A | B), read \"the probability of A given B,\" is a completely different number: the probability of A once you already know B happened. Learning that B happened can shrink the space of possibilities down to just the outcomes where B is true, and A's share of that smaller space is often nowhere near its share of the original, full space. The formula is P(A | B) = P(A and B) / P(B) — out of all the times B happens, what fraction of those also have A happening. This single idea is the reason a scary-sounding statistic like \"this test is 99% accurate\" can be dramatically misleading: 99% accurate describes P(positive test | you actually have the condition), but the number you actually care about after getting a positive result is the reverse conditional, P(you actually have the condition | positive test) — and those two numbers can be worlds apart, especially when the condition is rare. Bayes' theorem is exactly the formula that lets you flip a conditional probability around: P(A | B) = P(B | A) * P(A) / P(B). It converts the conditional you're given (how likely the evidence is, assuming the hypothesis) into the conditional you actually want (how likely the hypothesis is, given the evidence) — which is the core computation behind spam filters, medical screening, and any machine learning model whose job is to reason under uncertainty from noisy evidence.",
  conceptSimpler:
    "It's like being told \"90% of people who win the lottery bought a ticket at this specific store\" and mistakenly concluding you have a 90% chance of winning if you buy a ticket there — the real question you care about (chance of winning, given you bought a ticket there) is the reverse of the one you were told (chance of buying there, given you won), and those two numbers are almost never close to each other.",
  vizStages: [
    {
      label: "1. P(A) vs. P(A | B): learning something changes the odds",
      body:
        "Roll a fair die. P(the roll is a 6) is 1/6 — one favorable outcome out of six equally likely ones. Now suppose someone tells you the roll came up even. That new information shrinks the space of possibilities down to just {2, 4, 6} — three outcomes instead of six — so P(6 | even) is 1 out of 3, not 1 out of 6. Learning \"it's even\" didn't change the die, but it changed what you know, and that changed the probability.",
      code:
        "outcomes = [1, 2, 3, 4, 5, 6]\neven_outcomes = [2, 4, 6]\n\np_six = 1 / len(outcomes)\np_six_given_even = 1 / len(even_outcomes)\n\nprint(f\"P(six): {p_six}\")\nprint(f\"P(six | even): {p_six_given_even}\")\n\n# P(six): 0.1667\n# P(six | even): 0.3333 - double, because conditioning shrank the sample space",
    },
    {
      label: "2. The formula: P(A | B) = P(A and B) / P(B)",
      body:
        "That halving-and-tripling trick above is really just counting: out of all the outcomes where B is true, what fraction also have A true? Written as code, count how often each condition holds across every outcome, then divide the joint count by B's count.",
      code:
        "outcomes = [1, 2, 3, 4, 5, 6]\n\neven_count = 0\nfor o in outcomes:\n    if o % 2 == 0:\n        even_count = even_count + 1\n\nsix_and_even_count = 0\nfor o in outcomes:\n    if o % 2 == 0:\n        if o == 6:\n            six_and_even_count = six_and_even_count + 1\n\np_even = even_count / len(outcomes)\np_six_and_even = six_and_even_count / len(outcomes)\np_six_given_even = p_six_and_even / p_even\n\nprint(f\"P(even): {p_even}\")\nprint(f\"P(six and even): {p_six_and_even}\")\nprint(f\"P(six | even): {p_six_given_even}\")\n\n# P(even): 0.5\n# P(six and even): 0.1667\n# P(six | even): 0.3333 - matches stage 1, just derived from the general formula",
    },
    {
      label: "3. The classic trap: a \"99% accurate\" medical test",
      body:
        "A disease affects 1% of the population. A test for it is 99% accurate for people who actually have the disease (it correctly flags 99 out of 100 true cases) and has a 5% false-positive rate for people who don't have it (it wrongly flags 5 out of 100 healthy people anyway). You take the test and it comes back positive. Most people's gut instinct is \"the test is 99% accurate, so I'm probably 99% likely to have it.\" That instinct is quietly conflating two very different conditionals: P(positive | disease) = 99% is not the same number as P(disease | positive) — and the disease being rare changes everything, because with a million people tested, the small slice who are actually sick (1%) produces far fewer true positives than the enormous, mostly-healthy remainder (99%) produces false positives, even at just a 5% false-positive rate.",
      code:
        "p_disease = 0.01\np_no_disease = 1 - p_disease\np_pos_given_disease = 0.99\np_pos_given_no_disease = 0.05\n\n# instinct says: \"positive test -> ~99% likely to have the disease\"\n# but 0.99 above is P(positive | disease), the reverse of what we actually want",
    },
    {
      label: "4. Bayes' theorem flips it: P(disease | positive)",
      body:
        "Bayes' theorem is P(A | B) = P(B | A) * P(A) / P(B). Here A is \"has the disease\" and B is \"tested positive.\" P(B | A) and P(A) are both given directly (99% and 1%); the only missing piece is P(B) — the overall chance of testing positive at all, from any cause. That comes from the law of total probability: add up the positive results from sick people and the positive results from healthy people. Once you have that denominator, Bayes' theorem gives the real answer — and it's nowhere near 99%.",
      code:
        "p_disease = 0.01\np_no_disease = 1 - p_disease\np_pos_given_disease = 0.99\np_pos_given_no_disease = 0.05\n\np_pos_and_disease = p_pos_given_disease * p_disease\np_pos_and_no_disease = p_pos_given_no_disease * p_no_disease\np_positive = p_pos_and_disease + p_pos_and_no_disease\n\np_disease_given_positive = p_pos_and_disease / p_positive\n\nprint(f\"P(positive test): {p_positive}\")\nprint(f\"P(disease and positive): {p_pos_and_disease}\")\nprint(f\"P(disease | positive): {p_disease_given_positive}\")\n\n# P(positive test): 0.0594\n# P(disease and positive): 0.0099\n# P(disease | positive): 0.1667 - about 1 in 6, not 99 in 100",
    },
  ],
  realWorldIntro:
    "This is exactly the math behind a spam filter and, more broadly, Naive Bayes classifiers: instead of a disease and a positive test, swap in \"this email is spam\" and \"this email contains the word 'free.'\" The filter knows P(word | spam) from training data and wants the reverse, P(spam | word) — and Bayes' theorem is the only correct way to get there. The same flip-the-conditional move shows up anywhere a model has to reason backward from noisy evidence to a hidden cause, from calibrating a classifier's confidence scores to updating beliefs as new data arrives.",
  realWorldCode:
    'p_spam = 0.2\np_ham = 1 - p_spam\np_free_given_spam = 0.4\np_free_given_ham = 0.05\n\np_free_and_spam = p_free_given_spam * p_spam\np_free_and_ham = p_free_given_ham * p_ham\np_free = p_free_and_spam + p_free_and_ham\n\np_spam_given_free = p_free_and_spam / p_free\n\nprint(f"P(email contains \'free\'): {p_free}")\nprint(f"P(spam | contains \'free\'): {p_spam_given_free}")\n\n# P(spam | contains \'free\'): 0.6667 - seeing "free" makes spam about 3.3x more likely than the 20% base rate',
  sandbox: {
    kind: "code",
    challenge:
      "This Bayes' theorem calculator for the medical test example has a bug: the denominator (the total probability of testing positive) only counts positive results from people who actually have the disease and forgets the false positives from healthy people — so it claims a positive test means 100% certainty of disease. Fix p_positive so it adds both the true-positive and the false-positive contributions, then rerun to see the real, much lower posterior probability.",
    starterCode:
      'p_disease = 0.01\np_no_disease = 1 - p_disease\np_pos_given_disease = 0.99\np_pos_given_no_disease = 0.05\n\np_pos_and_disease = p_pos_given_disease * p_disease\np_pos_and_no_disease = p_pos_given_no_disease * p_no_disease\n\np_positive = p_pos_and_disease\n\np_disease_given_positive = p_pos_and_disease / p_positive\n\nprint(f"P(positive test): {p_positive}")\nprint(f"P(disease | positive): {p_disease_given_positive}")',
  },
  quizQuestion:
    "A disease affects 1% of people. The test is 99% accurate for sick people (P(positive | disease) = 0.99) and has a 5% false-positive rate for healthy people (P(positive | no disease) = 0.05). Someone tests positive. What's the correct way to think about P(disease | positive)?",
  quizCode:
    "p_disease = 0.01\np_pos_given_disease = 0.99\np_pos_given_no_disease = 0.05\n# P(disease | positive) = ?",
  quizOptions: [
    {
      key: "a",
      label:
        "It's not 99% — Bayes' theorem weighs P(positive | disease) * P(disease) against the far larger pool of false positives from the 99% who are healthy, and works out to only about 16.7%",
      correct: true,
    },
    {
      key: "b",
      label:
        "It's 99%, since the test's accuracy directly tells you how likely a positive result is to be correct",
      correct: false,
    },
    {
      key: "c",
      label:
        "It's 95%, since that's 100% minus the 5% false-positive rate",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — because the disease is rare, the enormous healthy population still produces plenty of false positives (5% of 99% of people) even though each healthy person individually has only a small chance of a false alarm. Bayes' theorem accounts for that base rate and lands around 16.7%, not 99%.",
  quizFeedbackIncorrect:
    "Not quite — P(positive | disease) = 0.99 describes the test's behavior on people who are already sick; it says nothing directly about P(disease | positive). Because the disease is rare, most positive results actually come from the large healthy population's false positives, and Bayes' theorem shows the real answer is only about 16.7%.",
  takeaway:
    "P(A) and P(A | B) are different numbers, and mixing them up — treating a test's accuracy as if it were the answer to \"do I actually have this?\" — is one of the most common reasoning mistakes people make with statistics. Bayes' theorem, P(A | B) = P(B | A) * P(A) / P(B), is the formula that correctly flips a conditional probability around, and it's the same move a spam filter or any probabilistic classifier makes every time it turns \"how likely is this evidence, given the hypothesis\" into \"how likely is the hypothesis, given this evidence.\"",
};

export default content;
