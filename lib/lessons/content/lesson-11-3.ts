import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 3,
  phaseLabel: "CLASSICAL MACHINE LEARNING",
  title: "Logistic Regression: A Weighted Sum, Squashed Into a Probability",
  minutes: 24,
  concept:
    "Logistic regression is a classifier built from two ordinary pieces glued together. The first piece is a weighted sum: multiply every feature by its own learned weight, add them all up, and add one more constant (the bias) that shifts the whole thing up or down — exactly the same weighted-sum arithmetic you've already used elsewhere in this curriculum. On its own, that weighted sum (usually called z) can be any number at all, from deeply negative to deeply positive, which isn't a usable probability. The second piece — the \"logistic\" part the model is named after — is the sigmoid function, sigmoid(z) = 1 / (1 + e^-z), which squashes any real number into a value strictly between 0 and 1: very negative z gets squashed toward 0, very positive z gets squashed toward 1, and z = 0 lands exactly on 0.5. Because the output is a genuine probability, classifying is just a threshold check: predict class 1 if that probability is at least 0.5 (equivalently, if z itself is positive), otherwise predict class 0. Our sandbox has no exp() or math module, so — reusing the exact same trick from the Transformers module's softmax lesson — we hand-build exp(x) from its own mathematical definition, the Taylor series 1 + x + x^2/2! + x^3/3! + ..., which converges to the real value of e^x as you sum more terms. Everything else here is real, unsimplified logistic regression math: a real weighted sum, fed into a real (if approximated) sigmoid, classified with a real 0.5 threshold. The one thing we're not doing is training — in a real model, those weights are learned automatically from labeled examples using gradient descent, minimizing how wrong the model's probabilities are across the whole training set; here we hand-pick the weights so you can see clearly what the model does with them once they exist.",
  conceptSimpler:
    "Think of z as a raw \"lean\" score built from clues about someone — the more clues pointing toward yes, the higher it climbs; the more pointing toward no, the lower it drops. Sigmoid is what turns that unbounded lean into an actual percentage between 0% and 100%, and 50% is simply the tipping point where you call it one way or the other.",
  vizStages: [
    {
      label: "1. exp(x), built from its own definition",
      body:
        "There's no exp() or math module in our sandbox, so — exactly like the Transformers module's softmax lesson did — we approximate e^x with its Taylor series: keep adding smaller and smaller terms (x^i / i!) until the sum is a very close match to the real value.",
      code:
        "def exp_approx(x):\n    result = 1\n    term = 1\n    for i in range(1, 20):\n        term = term * x / i\n        result = result + term\n    return result\n\nprint(exp_approx(1))\nprint(exp_approx(2))\n\n2.7182818284590455\n7.3890560989301735",
    },
    {
      label: "2. Sigmoid squashes any number into (0, 1)",
      body:
        "sigmoid(z) = 1 / (1 + e^-z). Notice sigmoid(0) lands exactly on 0.5 — since e^0 = 1, that's 1 / (1 + 1). Big positive z pushes the result toward 1; big negative z pushes it toward 0.",
      code:
        "def sigmoid(z):\n    neg_z = 0 - z\n    denom = 1 + exp_approx(neg_z)\n    return 1 / denom\n\nprint(sigmoid(0))\nprint(sigmoid(2))\nprint(sigmoid(-3))\n\n0.5\n0.8807970779781876\n0.04742587318132297",
    },
    {
      label: "3. z is just a weighted sum plus a bias",
      body:
        "weights[0] is the bias (a constant offset); every other weight multiplies its matching feature. Add them all up and you get z — the same raw \"lean\" that sigmoid then turns into a probability.",
      code:
        "def weighted_sum(features, weights):\n    z = weights[0]\n    for i in range(len(features)):\n        z = z + weights[i + 1] * features[i]\n    return z\n\nweights = [-4, 1, 0.5]\nprint(weighted_sum([5, 2], weights))\n\n2",
    },
    {
      label: "4. Crossing the 0.5 line flips the classification",
      body:
        "Two students just three hours apart in study time land on opposite sides of the 0.5 threshold: hours=3 gives z=-0.5, a 37.8% chance of passing (predict 0); hours=4 gives z=0.5, a 62.2% chance (predict 1). Nothing changed about the model — the input just crossed z=0.",
      code:
        "student_a: hours=3, tests=1 -> z=-0.5, prob=0.378, predicted=0\nstudent_b: hours=4, tests=1 -> z=0.5,  prob=0.622, predicted=1",
    },
  ],
  realWorldIntro:
    "scikit-learn's LogisticRegression fits weights (and a bias) with real floating-point optimization instead of a Taylor series or hand-picked numbers, but the prediction step it runs afterward is exactly this: compute a weighted sum of the input features, pass it through the same sigmoid function, and classify by the same 0.5 probability threshold.",
  realWorldCode:
    "from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)  # learns the weights via gradient descent\nprobabilities = model.predict_proba(X_new)  # same sigmoid(weighted_sum) math\nlabels = model.predict(X_new)  # same >= 0.5 threshold",
  sandbox: {
    kind: "code",
    challenge:
      "Implement exp_approx(x), sigmoid(z), and weighted_sum(features, weights), then use a few hardcoded weights to predict a probability and a 0/1 label for four different students, printing each one's z, probability, and final classification.",
    starterCode:
      "def exp_approx(x):\n    result = 1\n    term = 1\n    for i in range(1, 20):\n        term = term * x / i\n        result = result + term\n    return result\n\ndef sigmoid(z):\n    neg_z = 0 - z\n    denom = 1 + exp_approx(neg_z)\n    return 1 / denom\n\ndef weighted_sum(features, weights):\n    z = weights[0]\n    for i in range(len(features)):\n        z = z + weights[i + 1] * features[i]\n    return z\n\ndef predict(features, weights):\n    z = weighted_sum(features, weights)\n    prob = sigmoid(z)\n    if prob >= 0.5:\n        label = 1\n    else:\n        label = 0\n    result = {\"z\": z, \"prob\": prob, \"label\": label}\n    return result\n\n# weights = [bias, weight_for_hours, weight_for_tests]\nweights = [-4, 1, 0.5]\n\nstudents = []\nstudents.append({\"hours\": 5, \"tests\": 2})\nstudents.append({\"hours\": 1, \"tests\": 0})\nstudents.append({\"hours\": 3, \"tests\": 1})\nstudents.append({\"hours\": 4, \"tests\": 1})\n\nfor s in students:\n    features = [s[\"hours\"], s[\"tests\"]]\n    result = predict(features, weights)\n    print(f\"hours={s['hours']} tests={s['tests']} -> z={result['z']}, prob={result['prob']}, predicted={result['label']}\")",
  },
  quizQuestion:
    "sigmoid(0) always equals exactly 0.5, so z=0 is the tipping point between the two classes. Given z_a = -0.2 and z_b = 0.2, which one gets classified as class 1?",
  quizCode:
    "z_a = -0.2\nz_b = 0.2\nprint(sigmoid(z_a))\nprint(sigmoid(z_b))",
  quizOptions: [
    {
      key: "a",
      label:
        "z_b — sigmoid(0.2) is about 0.5498, just over the 0.5 threshold, while sigmoid(-0.2) is about 0.4502, just under it",
      correct: true,
    },
    {
      key: "b",
      label:
        "Both — any z close enough to 0 rounds up to the same 0.5 probability and gets classified as class 1",
      correct: false,
    },
    {
      key: "c",
      label:
        "Neither — sigmoid only returns exactly 0 or exactly 1, never a probability in between",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — sigmoid(0.2) ≈ 0.5498, which clears the 0.5 threshold and gets classified as 1, while sigmoid(-0.2) ≈ 0.4502 falls just short and gets classified as 0. Sigmoid is a smooth curve, not a step function, so tiny changes in z near 0 can genuinely flip which side of 0.5 the probability lands on.",
  quizFeedbackIncorrect:
    "Not quite — sigmoid outputs a smooth range of real probabilities, not just 0 or 1, and it doesn't round nearby values together. sigmoid(0.2) ≈ 0.5498 (just over 0.5, so class 1) and sigmoid(-0.2) ≈ 0.4502 (just under 0.5, so class 0) — being close to the 0.5 tipping point is exactly what makes these two borderline cases land on opposite sides.",
  takeaway:
    "Logistic regression is a weighted sum of features (plus a bias) run through a sigmoid squashing function, classified by whether the resulting probability clears 0.5 — real math throughout, just with hand-picked weights instead of ones learned by gradient descent, and a hand-built Taylor-series exp() standing in for a real exp() the sandbox doesn't have.",
  explainers: [
    {
      id: "what-is-logistic-regression",
      term: "What's Logistic Regression?",
      emoji: "📈",
      shortDef:
        "Logistic regression is a classifier that turns a weighted sum of features into a probability using the sigmoid function, then classifies by whether that probability crosses 0.5.",
      longDef:
        "Despite the name, logistic regression is used for classification, not the kind of numeric regression that predicts a continuous value. It computes z, a weighted sum of the input features plus a bias, then feeds z through sigmoid to get a number between 0 and 1 that behaves like a genuine probability of belonging to the \"positive\" class.",
      whyMatters:
        "It's one of the simplest, most interpretable classifiers in machine learning — each weight tells you directly how much a feature pushes the prediction toward or away from class 1 — which makes it a common first choice before reaching for more complex models like random forests or neural networks.",
      realWorldExample:
        "A spam filter might weight \"contains the word 'free'\" positively and \"comes from a known contact\" negatively; add those weighted signals up, squash the result into a probability with sigmoid, and flag anything over 50% as spam.",
      relatedTerms: ["what-is-sigmoid", "what-is-weighted-sum"],
      expandedByDefault: true,
    },
    {
      id: "what-is-sigmoid",
      term: "What's the Sigmoid Function?",
      emoji: "🌀",
      shortDef:
        "Sigmoid squashes any real number into a value strictly between 0 and 1, making it usable as a probability.",
      longDef:
        "sigmoid(z) = 1 / (1 + e^-z). As z grows very positive, e^-z shrinks toward 0, pushing sigmoid toward 1. As z grows very negative, e^-z grows huge, pushing sigmoid toward 0. At z = 0, sigmoid always equals exactly 0.5, which is why 0 is the natural tipping point between the two classes.",
      whyMatters:
        "It's the piece that turns an unbounded weighted sum into something you can actually call a probability and threshold — sigmoid also shows up throughout neural networks as one of the classic activation functions.",
      realWorldExample:
        "It's like a dimmer switch with a soft middle: nudging it slightly past the midpoint noticeably brightens the room, but pushing it further toward either end barely changes anything more, because it's already close to fully on or fully off.",
      relatedTerms: ["what-is-logistic-regression"],
    },
    {
      id: "what-is-weighted-sum",
      term: "What's a Weighted Sum (and a Bias)?",
      emoji: "⚖️",
      shortDef:
        "A weighted sum multiplies each feature by its own importance value (its weight) and adds the results together, plus one constant offset called the bias.",
      longDef:
        "If hours studied matters twice as much as practice tests taken to the model, its weight will be roughly twice as large. The bias is a constant added on top of every prediction, regardless of the features — it shifts the whole weighted sum up or down, controlling where the tipping point falls even for an all-zero input.",
      whyMatters:
        "The weighted sum is the arithmetic core not just of logistic regression, but of linear regression and the individual neurons inside a neural network — learning to predict well is largely about learning good weights and a good bias for this exact calculation.",
      realWorldExample:
        "It's like a report card formula that weights exams more heavily than homework: exam_score * 0.7 + homework_score * 0.3 + 2 (the +2 being a bias, a flat curve applied to everyone) — change the weights and you change what the formula rewards most.",
      relatedTerms: ["what-is-logistic-regression"],
    },
  ],
};

export default content;
