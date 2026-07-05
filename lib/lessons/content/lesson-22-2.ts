import type { LessonData } from "../types";

const content: LessonData = {
  num: 22,
  orderIndex: 2,
  phaseLabel: "LINEAR ALGEBRA BASICS",
  title: "Vector magnitude: how \"long\" is a vector",
  minutes: 15,
  concept:
    "Every vector has a magnitude — a single number for how long it is, ignoring direction entirely. Picture a vector as an arrow drawn from the origin: its magnitude is just the straight-line distance from the tip of that arrow back to (0, 0), the same distance you'd get from the Pythagorean theorem. You compute it by squaring every entry, adding those squares together, and then taking the square root of that sum — squaring first because it turns negative entries positive (a vector pointing \"backwards\" is still just as long), and the sum-of-squares step is exactly the same loop you'd use to take a vector's dot product with itself. The square root is the part that turns \"sum of squares\" into an actual length, undoing the squaring so the units make sense again. Magnitude matters because it measures intensity or scale — a longer embedding vector isn't necessarily \"more similar\" to anything, it might just represent a longer document or a more emphatic signal, which is exactly the wrinkle the next lesson deals with.",
  conceptSimpler:
    "It's the same math as figuring out how far a hiker ended up from camp after walking 3 miles east and 4 miles north — you don't add 3 and 4, you square them, add the squares, and find the straight-line distance, which turns out to be a clean 5 miles.",
  vizStages: [
    {
      label: "1. A vector as a straight-line distance",
      body:
        "The vector [3, 4] can be drawn as an arrow: 3 units right, 4 units up. Its magnitude is the length of the straight line from the origin to that point — not 3 + 4 = 7, but the diagonal distance, which the Pythagorean theorem says is the square root of 3² + 4².",
      code: "vec = [3, 4]\n# straight-line distance from (0,0) to (3,4)\n# = square root of (3*3 + 4*4)",
    },
    {
      label: "2. Square every entry, then add",
      body:
        "The first half of the job is a for-loop nearly identical to the dot product's: square each entry and accumulate a running total. This sum-of-squares is the number that lives \"under\" the square root.",
      code:
        "def sum_of_squares(vec):\n    total = 0\n    for i in range(len(vec)):\n        total = total + vec[i] * vec[i]\n    return total\n\nprint(sum_of_squares([3, 4]))  # 9 + 16 = 25",
    },
    {
      label: "3. The square root undoes the squaring",
      body:
        "Magnitude is technically the square root of that sum — but our mini-language has no sqrt(). When the numbers are chosen so the sum of squares is a perfect square, we can find that root by brute force: just test small whole numbers until one, squared, matches.",
      code:
        "def magnitude(vec):\n    target = sum_of_squares(vec)\n    for guess in range(0, target + 1):\n        if guess * guess == target:\n            return guess\n    return -1\n\nprint(magnitude([3, 4]))  # 25 -> guess 5, since 5*5 == 25",
    },
    {
      label: "4. Scaling a vector scales its magnitude",
      body:
        "[6, 8] is just [3, 4] with every entry doubled. Its sum of squares is 36 + 64 = 100, and the whole number whose square is 100 is 10 — exactly double the original magnitude of 5. Stretching a vector's entries stretches its length by the same factor.",
      code:
        "print(magnitude([3, 4]))  # 5\nprint(magnitude([6, 8]))  # 10 -- same direction, double the length",
    },
  ],
  realWorldIntro:
    "In embedding search, magnitude quietly represents \"how much\" — a long, keyword-stuffed document or a very confident signal often produces a vector with a bigger magnitude, even if it isn't actually the best match in meaning. Knowing how to measure magnitude is the missing piece needed to stop a dot product from being fooled by size alone, which the next lesson tackles head-on with cosine similarity.",
  realWorldCode:
    "doc_vec = embed(long_document)   # naturally larger magnitude, just from length\nquery_vec = embed(short_query)   # smaller magnitude\n# comparing raw dot products would unfairly favor doc_vec for its size, not its relevance",
  sandbox: {
    kind: "code",
    challenge:
      "Write sum_of_squares(vec) and magnitude(vec) (using the brute-force guess loop), then print the magnitude of [3, 4] and [6, 8].",
    starterCode:
      "def sum_of_squares(vec):\n    total = 0\n    for i in range(len(vec)):\n        total = total + vec[i] * vec[i]\n    return total\n\ndef magnitude(vec):\n    target = sum_of_squares(vec)\n    for guess in range(0, target + 1):\n        if guess * guess == target:\n            return guess\n    return -1\n\na = [3, 4]\nb = [6, 8]\n\nprint(f\"sum of squares of {a}: {sum_of_squares(a)}\")\nprint(f\"magnitude of {a}: {magnitude(a)}\")\nprint(f\"sum of squares of {b}: {sum_of_squares(b)}\")\nprint(f\"magnitude of {b}: {magnitude(b)}\")",
  },
  quizQuestion:
    "vec_y is exactly vec_x with every entry multiplied by 3. If magnitude(vec_x) is 5, what should magnitude(vec_y) be?",
  quizCode:
    "vec_x = [3, 4]\nvec_y = [9, 12]\nprint(sum_of_squares(vec_x))\nprint(sum_of_squares(vec_y))",
  quizOptions: [
    {
      key: "a",
      label:
        "15 — multiplying every entry by 3 multiplies each squared term by 9, so the sum of squares grows by 9, and the square root undoes that back down to a factor of 3",
      correct: true,
    },
    {
      key: "b",
      label: "5 — magnitude doesn't change just because the entries got bigger",
      correct: false,
    },
    {
      key: "c",
      label: "45 — since the entries were scaled by 3, the magnitude should scale by 3 squared (9) as well",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — scaling a vector's entries by k multiplies its sum of squares by k² (225 = 9 × 25), and the square root exactly cancels that squaring, so the magnitude itself only scales by k (5 × 3 = 15).",
  quizFeedbackIncorrect:
    "Not quite — magnitude is directly tied to the size of the entries (bigger entries mean a longer vector), but it doesn't grow by the same k² factor the sum of squares does; the square root brings that squared growth back down to a plain factor of k.",
  takeaway:
    "Magnitude is \"square, sum, then undo the squaring\" — it tells you how long a vector is, completely separate from which direction it points, and that distinction is exactly what the next lesson needs.",
};

export default content;
