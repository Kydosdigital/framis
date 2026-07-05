import type { LessonData } from "../types";

const content: LessonData = {
  num: 22,
  orderIndex: 3,
  phaseLabel: "LINEAR ALGEBRA BASICS",
  title: "Matrices: a grid of numbers that transforms vectors",
  minutes: 18,
  concept:
    "A matrix is just a grid of numbers — rows and columns — and it does one job: it turns any vector you feed it into a new vector. You compute the new vector one entry at a time, and each entry is nothing new at all — it's a dot product between one row of the matrix and the input vector. Multiply the matrix's first row against the vector, and that sum becomes the first entry of the output; multiply the second row against the same vector, and that becomes the second entry. Because every row can contain different numbers, a matrix can stretch a vector, shrink it, flip it, rotate it, or leave it completely alone, depending entirely on what numbers you put in that grid. This is the exact mechanism inside neural networks: every \"layer\" that reshapes an embedding is really just a matrix, built from numbers the model learned during training, applied to the vector coming out of the layer before it.",
  conceptSimpler:
    "Think of a matrix as a machine on a conveyor belt: a vector goes in one side, the machine applies a fixed, repeatable rule (stretch this way, flip that way), and a transformed vector comes out the other side — feed the same matrix any vector, and it always applies the same rule.",
  vizStages: [
    {
      label: "1. A matrix is rows, each one a dot product",
      body:
        "Take the matrix [[1, 0], [0, 1]] — two rows, two numbers each — applied to the vector [5, 3]. Row one, [1, 0], dotted with [5, 3] gives 1×5 + 0×3 = 5. Row two, [0, 1], dotted with [5, 3] gives 0×5 + 1×3 = 3. Nothing changed — this is the \"identity\" matrix, the matrix version of multiplying by 1.",
      code:
        "matrix = [[1, 0],\n          [0, 1]]\nvector = [5, 3]\n\nnew_vector = [\n  1*5 + 0*3,\n  0*5 + 1*3\n]\n# new_vector = [5, 3] -- unchanged",
    },
    {
      label: "2. Scaling: stretch every axis",
      body:
        "Swap the diagonal 1s for 2s: [[2, 0], [0, 2]]. Now row one gives 2×5 + 0×3 = 10, and row two gives 0×5 + 2×3 = 6. Every entry got doubled — the vector points the same direction but reaches twice as far. This is what \"scaling up\" an embedding by a constant looks like.",
      code:
        "matrix = [[2, 0],\n          [0, 2]]\nvector = [5, 3]\n\nnew_vector = [\n  2*5 + 0*3,\n  0*5 + 2*3\n]\n# new_vector = [10, 6] -- same direction, doubled length",
    },
    {
      label: "3. Non-uniform scaling: stretch one axis only",
      body:
        "Matrices don't have to treat every axis the same. [[3, 0], [0, 1]] triples the first coordinate but leaves the second untouched: row one gives 3×5 + 0×3 = 15, row two gives 0×5 + 1×3 = 3. The vector gets pulled long and thin in one direction, like squishing a circle into an ellipse.",
      code:
        "matrix = [[3, 0],\n          [0, 1]]\nvector = [5, 3]\n\nnew_vector = [\n  3*5 + 0*3,\n  0*5 + 1*3\n]\n# new_vector = [15, 3] -- stretched horizontally, vertical axis untouched",
    },
    {
      label: "4. Rotation: same length, new direction",
      body:
        "The matrix [[0, -1], [1, 0]] rotates a vector 90 degrees counterclockwise. On [5, 3]: row one gives 0×5 + (-1)×3 = -3, row two gives 1×5 + 0×3 = 5, so the result is [-3, 5]. Check the magnitude: 5² + 3² = 34, and (-3)² + 5² = 34 too — same length, purely a change of direction.",
      code:
        "matrix = [[0, -1],\n          [1, 0]]\nvector = [5, 3]\n\nnew_vector = [\n  0*5 + (-1)*3,\n  1*5 + 0*3\n]\n# new_vector = [-3, 5] -- rotated 90 degrees, same length as [5, 3]",
    },
    {
      label: "5. Reflection: flip across an axis",
      body:
        "[[1, 0], [0, -1]] leaves the first coordinate alone and flips the sign of the second: row one gives 1×5 + 0×3 = 5, row two gives 0×5 + (-1)×3 = -3, giving [5, -3]. That's a mirror image of the original vector across the horizontal axis.",
      code:
        "matrix = [[1, 0],\n          [0, -1]]\nvector = [5, 3]\n\nnew_vector = [\n  1*5 + 0*3,\n  0*5 + (-1)*3\n]\n# new_vector = [5, -3] -- reflected across the x-axis",
    },
  ],
  realWorldIntro:
    "Every layer of a neural network that reshapes an embedding — including the \"Query,\" \"Key,\" and \"Value\" projections inside attention, which is coming up next in this course — is a matrix multiplication like the ones above, just with far more rows, columns, and numbers learned from data instead of picked by hand.",
  realWorldCode:
    "W_query = learned_matrix   # shape depends on the model, but the operation is identical\ntoken_embedding = embed(\"bank\")\nquery_vector = matrix_multiply(W_query, token_embedding)\n# same row-times-vector dot products as above, just at a much larger scale",
  sandbox: {
    kind: "explore",
    instructions:
      "Step through each matrix below to see how the same input vector gets stretched, rotated, or flipped depending only on the numbers inside the grid.",
    stages: [
      {
        label: "Identity: change nothing",
        body:
          "[[1, 0], [0, 1]] is the \"do nothing\" matrix — every row picks out exactly one coordinate and ignores the other, so whatever vector goes in comes out unchanged. It's the matrix equivalent of multiplying a number by 1.",
        code: "matrix = [[1, 0], [0, 1]]\nvector = [5, 3]\n# result: [5, 3]",
      },
      {
        label: "Uniform scaling: grow or shrink evenly",
        body:
          "[[2, 0], [0, 2]] doubles both coordinates equally, so the output vector points in the same direction as the input but reaches twice as far from the origin.",
        code: "matrix = [[2, 0], [0, 2]]\nvector = [5, 3]\n# result: [10, 6] -- same direction, doubled length",
      },
      {
        label: "Non-uniform scaling: stretch one axis",
        body:
          "[[3, 0], [0, 1]] only stretches the first coordinate, leaving the second alone. The output vector no longer points in the same direction as the input — it's been pulled toward the horizontal axis.",
        code: "matrix = [[3, 0], [0, 1]]\nvector = [5, 3]\n# result: [15, 3] -- pulled toward the horizontal axis",
      },
      {
        label: "Rotation: same length, new angle",
        body:
          "[[0, -1], [1, 0]] rotates any vector 90 degrees counterclockwise around the origin. The magnitude (length) of the vector never changes — only the direction it points does.",
        code: "matrix = [[0, -1], [1, 0]]\nvector = [5, 3]\n# result: [-3, 5] -- same length as [5, 3], rotated 90 degrees",
      },
      {
        label: "Reflection: a mirror image",
        body:
          "[[1, 0], [0, -1]] leaves the horizontal coordinate untouched but flips the sign of the vertical one, producing a mirror image of the vector across the horizontal axis.",
        code: "matrix = [[1, 0], [0, -1]]\nvector = [5, 3]\n# result: [5, -3] -- mirrored across the x-axis",
      },
    ],
  },
  quizQuestion:
    "matrix = [[1, 0], [0, -1]] is applied to vector = [5, 3]. What's the result, and what transformation does this matrix represent?",
  quizCode:
    "matrix = [[1, 0], [0, -1]]\nvector = [5, 3]\n# row 0: 1*5 + 0*3\n# row 1: 0*5 + (-1)*3",
  quizOptions: [
    {
      key: "a",
      label:
        "[5, -3] — the first row leaves the x-coordinate unchanged, and the second row flips the sign of the y-coordinate, reflecting the vector across the x-axis",
      correct: true,
    },
    {
      key: "b",
      label: "[-5, 3] — the matrix flips the x-coordinate instead, reflecting the vector across the y-axis",
      correct: false,
    },
    {
      key: "c",
      label: "[5, 3] — since one row is mostly zeros, the vector passes through the matrix unchanged",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — row [1, 0] dotted with [5, 3] keeps the x-coordinate exactly as it was, while row [0, -1] dotted with [5, 3] negates the y-coordinate, which is precisely a reflection across the horizontal axis.",
  quizFeedbackIncorrect:
    "Not quite — the first row has no negative sign, so the x-coordinate stays at 5 unchanged; it's the second row's -1 that flips the y-coordinate's sign, which mirrors the vector across the x-axis (not the y-axis), and that lone -1 absolutely still changes the result.",
  takeaway:
    "A matrix is nothing more than one dot product per row — stack a few of those together and you can stretch, shrink, rotate, or flip any vector, which is the entire mechanism neural networks use to reshape embeddings layer by layer.",
};

export default content;
