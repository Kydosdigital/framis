import type { LessonData } from "../types";

const content: LessonData = {
  num: 11,
  orderIndex: 4,
  phaseLabel: "CLASSICAL MACHINE LEARNING",
  title: "K-Means: Finding Groups Nobody Labeled",
  minutes: 24,
  concept:
    "Every algorithm so far in this module learned from labeled examples — each one came with a known right answer to match. K-means clustering is different: it's unsupervised, meaning the points have no labels at all, and the algorithm's whole job is to discover groups in the data on its own. The algorithm is a genuinely simple loop, repeated until it stabilizes. Pick a number of clusters, k, and start with k initial centroids (a centroid is just a point representing the \"center\" of a cluster — here we grab two of the actual data points to start). Then repeat two steps: first, the assignment step — for every point, measure its distance to every centroid and assign it to whichever one is closest; second, the update step — recompute each centroid as the average (the mean) of every point currently assigned to it. Do that a few times and the centroids stop moving (or nearly stop) once every point is already closer to its own cluster's centroid than to the other one — that's convergence. Real k-means measures distance with true Euclidean distance, which needs a square root; our sandbox has no sqrt(), so instead we compare squared distances, and it's mathematically fine to do that, not just a shortcut: square root is a monotonically increasing function, meaning if a^2 < b^2 for two non-negative numbers, then a < b too — so whichever centroid has the smaller squared distance also has the smaller true distance, and comparing squared distances always picks the same nearest centroid a real square root would. The other simplification here is initialization: real k-means implementations usually use a smarter seeding strategy called k-means++ that spreads the initial centroids out on purpose (or run the whole algorithm from several random starting points and keep the best one), while we just grab two actual data points to start — a real, workable choice, just a cruder one than production libraries make.",
  conceptSimpler:
    "Imagine dropping two pins on a map at random and having every nearby town silently attach itself to whichever pin is closer. Then you drag each pin to sit at the average location of the towns now attached to it, and repeat — after a couple of rounds, the pins settle right in the middle of two natural clusters of towns, even though nobody ever told you where those clusters were.",
  vizStages: [
    {
      label: "1. Distance without a square root",
      body:
        "Real distance between two points uses the Pythagorean theorem, which ends in a square root. Our sandbox has no sqrt(), but for comparing \"which centroid is closer,\" the squared distance alone is enough — squaring never flips which of two non-negative distances is smaller.",
      code:
        "def squared_distance(a, b):\n    dx = a[\"x\"] - b[\"x\"]\n    dy = a[\"y\"] - b[\"y\"]\n    return dx * dx + dy * dy\n\npoint = {\"x\": 3, \"y\": 3}\ncentroid_a = {\"x\": 1, \"y\": 1}\ncentroid_b = {\"x\": 8, \"y\": 8}\nprint(squared_distance(point, centroid_a))\nprint(squared_distance(point, centroid_b))\n\n8\n50",
    },
    {
      label: "2. Assignment: every point joins its closest centroid",
      body:
        "Starting centroids are just two of the actual data points: (1, 1) and (8, 8). Every point gets compared to both and joins whichever one it's closer to — including a middling point at (4, 4), which is still noticeably closer to (1, 1) than to (8, 8).",
      code:
        "centroid0 = {\"x\": 1, \"y\": 1}\ncentroid1 = {\"x\": 8, \"y\": 8}\nmiddle_point = {\"x\": 4, \"y\": 4}\nprint(squared_distance(middle_point, centroid0))\nprint(squared_distance(middle_point, centroid1))\n\n18\n32",
    },
    {
      label: "3. Update: recompute each centroid as an average",
      body:
        "Once every point has picked a side, each centroid moves to the average x and average y of everyone now assigned to it — a real centroid recomputation, just in two dimensions.",
      code:
        "def average_points(points):\n    total_x = 0\n    total_y = 0\n    for p in points:\n        total_x = total_x + p[\"x\"]\n        total_y = total_y + p[\"y\"]\n    n = len(points)\n    result = {\"x\": total_x / n, \"y\": total_y / n}\n    return result",
    },
    {
      label: "4. Repeat until the centroids stop moving",
      body:
        "After the first update, centroid0 moves from (1, 1) to (2.125, 2.125) — pulled slightly toward the middle point that joined it — while centroid1 barely moves. Run the loop again with the updated centroids and every point lands in the exact same cluster as before: the centroids stop changing, which is what convergence looks like.",
      code:
        "iteration 1 -> centroid0: (1, 1),     centroid1: (8, 8)\niteration 2 -> centroid0: (2.125, 2.125), centroid1: (8.5, 8.5)\niteration 3 -> centroid0: (2.125, 2.125), centroid1: (8.5, 8.5)  # unchanged: converged",
    },
  ],
  realWorldIntro:
    "scikit-learn's KMeans uses real Euclidean distance (with the square root our sandbox can't compute) and a smarter seeding strategy called k-means++ that spreads the initial centroids apart on purpose, then runs the whole assignment/update loop from several different random starts (n_init) and keeps whichever run ends with the tightest clusters — since a bad set of starting centroids can occasionally get k-means stuck in a worse grouping than another starting point would have found.",
  realWorldCode:
    "from sklearn.cluster import KMeans\n\nkm = KMeans(n_clusters=2, n_init=10)\nkm.fit(X)\n# under the hood: real Euclidean distance, k-means++ seeding,\n# and 10 random restarts — same assign-then-average loop you just built",
  sandbox: {
    kind: "code",
    challenge:
      "Given seven 2D points, write squared_distance(a, b) and average_points(points), then run the assign-and-update loop for 3 iterations, printing the centroids and cluster sizes each time to watch it converge.",
    starterCode:
      "def squared_distance(a, b):\n    dx = a[\"x\"] - b[\"x\"]\n    dy = a[\"y\"] - b[\"y\"]\n    return dx * dx + dy * dy\n\ndef average_points(points):\n    total_x = 0\n    total_y = 0\n    for p in points:\n        total_x = total_x + p[\"x\"]\n        total_y = total_y + p[\"y\"]\n    n = len(points)\n    result = {\"x\": total_x / n, \"y\": total_y / n}\n    return result\n\npoints = []\npoints.append({\"x\": 1, \"y\": 1})\npoints.append({\"x\": 1.5, \"y\": 2})\npoints.append({\"x\": 2, \"y\": 1.5})\npoints.append({\"x\": 8, \"y\": 8})\npoints.append({\"x\": 9, \"y\": 8.5})\npoints.append({\"x\": 8.5, \"y\": 9})\npoints.append({\"x\": 4, \"y\": 4})\n\n# start by picking two of the actual points as initial centroids\ncentroid0 = {\"x\": 1, \"y\": 1}\ncentroid1 = {\"x\": 8, \"y\": 8}\n\nfor iteration in range(3):\n    print(f\"=== iteration {iteration + 1} ===\")\n    print(f\"centroid0: {centroid0}\")\n    print(f\"centroid1: {centroid1}\")\n\n    cluster0 = []\n    cluster1 = []\n\n    for p in points:\n        d0 = squared_distance(p, centroid0)\n        d1 = squared_distance(p, centroid1)\n        if d0 <= d1:\n            cluster0.append(p)\n        else:\n            cluster1.append(p)\n\n    print(f\"cluster0 size: {len(cluster0)}, cluster1 size: {len(cluster1)}\")\n\n    centroid0 = average_points(cluster0)\n    centroid1 = average_points(cluster1)\n\nprint(f\"final centroid0: {centroid0}\")\nprint(f\"final centroid1: {centroid1}\")",
  },
  quizQuestion:
    "point = (3, 3), centroid_a = (1, 1), centroid_b = (8, 8). squared_distance(point, centroid_a) = 8 and squared_distance(point, centroid_b) = 50. Which centroid does k-means assign this point to, and would the answer change if we used real (square-rooted) distance instead?",
  quizCode:
    "point = {\"x\": 3, \"y\": 3}\ncentroid_a = {\"x\": 1, \"y\": 1}\ncentroid_b = {\"x\": 8, \"y\": 8}\nprint(squared_distance(point, centroid_a))\nprint(squared_distance(point, centroid_b))",
  quizOptions: [
    {
      key: "a",
      label:
        "centroid_a in both cases — square root is monotonically increasing, so whichever squared distance is smaller, the real (square-rooted) distance is guaranteed to be smaller too",
      correct: true,
    },
    {
      key: "b",
      label:
        "centroid_b, because a larger squared distance actually means the point is closer once you account for the square",
      correct: false,
    },
    {
      key: "c",
      label:
        "centroid_a with squared distance, but it would flip to centroid_b once you take the real square root, since square-rooting can reorder which distance is smaller",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — 8 < 50, so centroid_a wins on squared distance, and the real distances (√8 ≈ 2.83 and √50 ≈ 7.07) come out in that exact same order. Square root never changes which of two non-negative numbers is smaller, so comparing squared distances always picks the same nearest centroid a real square root would — that's exactly why it's safe to skip the square root entirely when all you need is \"which one is closer.\"",
  quizFeedbackIncorrect:
    "Not quite — a bigger squared distance always means a bigger real distance too, never the reverse, and taking a square root never reorders which of two non-negative numbers was smaller. Since 8 < 50, centroid_a is closer on squared distance, and it's still closer once you take the real square root (√8 ≈ 2.83 versus √50 ≈ 7.07) — the ordering is identical either way.",
  takeaway:
    "K-means alternates between assigning every point to its nearest centroid and recomputing each centroid as the average of its assigned points, repeating until the assignments stop changing. Comparing squared distances instead of true distances is a genuinely valid simplification — square root never changes which of two distances is smaller — and it's the one piece of unsupervised learning in this module: no labels anywhere, just structure the algorithm finds in the raw points themselves.",
  explainers: [
    {
      id: "what-is-unsupervised-learning",
      term: "What's Unsupervised Learning?",
      emoji: "🔍",
      shortDef:
        "Unsupervised learning finds structure in data that has no labels at all — there's no known right answer to check predictions against.",
      longDef:
        "Every other lesson in this module was supervised: each example came with a label (passed or failed, class 0 or 1) that the model was trying to predict. K-means gets no such labels — it's only given raw points, and its job is to discover which ones naturally group together, based purely on how close they sit to one another.",
      whyMatters:
        "Most real-world data isn't labeled — nobody hand-tags millions of customer records with \"these are similar shoppers.\" Unsupervised methods like k-means let you find structure (like customer segments) in exactly that kind of raw, unlabeled data.",
      realWorldExample:
        "A store's customer data might have no \"segment\" column at all — but running k-means on purchase patterns can reveal that customers naturally split into groups like \"weekend bulk shoppers\" and \"weekday small-basket shoppers,\" without anyone ever having labeled a single customer that way.",
      relatedTerms: ["what-is-clustering", "what-is-centroid"],
      expandedByDefault: true,
    },
    {
      id: "what-is-clustering",
      term: "What's Clustering?",
      emoji: "🔵",
      shortDef:
        "Clustering means grouping data points so that points inside the same group are close together, and points in different groups are far apart.",
      longDef:
        "K-means is one specific way to do clustering: pick a number of groups (k), then alternate between assigning each point to its nearest group center and recomputing each center as the average of its group, until the groups stop changing.",
      whyMatters:
        "Clustering shows up constantly in practice — grouping similar customers, similar documents, similar images, or similar sensor readings, all without needing anyone to have labeled the \"correct\" groups in advance.",
      realWorldExample:
        "It's like sorting a mixed pile of photos into stacks by who's in them, with no captions to go on — you group photos by visual similarity, the same way k-means groups points by numeric similarity.",
      relatedTerms: ["what-is-unsupervised-learning", "what-is-centroid"],
    },
    {
      id: "what-is-centroid",
      term: "What's a Centroid?",
      emoji: "📍",
      shortDef:
        "A centroid is the \"center\" of a cluster — literally the average position of every point currently assigned to it.",
      longDef:
        "K-means starts with a few initial centroids (here, just two actual data points), then repeatedly recomputes each one as the average x and average y of whichever points are currently closest to it. As points get reassigned between updates, the centroids drift toward the true middle of their group until they stop moving.",
      whyMatters:
        "The centroid is both the thing k-means is trying to find and the yardstick it uses to decide cluster membership at every step — the whole algorithm is just this one idea (average position) applied over and over.",
      realWorldExample:
        "It's like the center of mass of a group of people standing in a room — if people wander closer to one side, the center of mass shifts toward them; k-means just repeats that recalculation until nobody's shifting sides anymore.",
      relatedTerms: ["what-is-clustering"],
    },
  ],
};

export default content;
