import type { LessonData } from "../types";

const content: LessonData = {
  num: 20,
  orderIndex: 3,
  phaseLabel: "FINE-TUNING + DATASET QUALITY",
  title: "100% training accuracy is a warning sign, not a victory",
  minutes: 20,
  concept:
    "Overfitting happens when a fine-tuned model stops learning the underlying pattern in your data and starts memorizing the specific training examples instead, including their quirks, phrasing, and even their exact wording. A model that's genuinely learning the task gets better at examples it has never seen; a model that's overfitting gets better and better at the training set while quietly getting worse at everything else, because it's spending its capacity storing lookup answers instead of a generalizable rule. The classic tell is a training score that keeps climbing toward 100% while a held-out validation score — scored on examples the model never trained on — stalls or drops; that gap is the model telling you it has started reciting instead of reasoning. This tends to happen when a dataset is small, trained over too many epochs, or full of repeated near-identical examples, because the model has enough exposure to each one to just remember it outright rather than needing to generalize. The fix is never \"train longer on the same data\" — it's more diverse examples, fewer epochs, or an early stop at the point where validation performance peaks, even if the training score still has room to climb.",
  conceptSimpler:
    "It's a student who memorizes the answer key for last year's exact test instead of learning the subject — they'll ace that exact test again, but a new test on the same material will expose that they never actually learned anything.",
  vizStages: [
    {
      label: "1. Two curves during training",
      body:
        "Every training run tracks two scores across epochs: how well the model does on the data it's training on, and how well it does on a held-out validation set it never sees during training.",
      code: "epoch 1:  train_acc = 0.62   val_acc = 0.60\nepoch 5:  train_acc = 0.81   val_acc = 0.79\nepoch 10: train_acc = 0.94   val_acc = 0.86",
    },
    {
      label: "2. The point where they split apart",
      body:
        "Early on, both curves rise together — that's real generalization. At some epoch, training accuracy keeps rising while validation accuracy flattens or falls; everything past that point is the model memorizing training rows rather than learning the task.",
      code: "epoch 15: train_acc = 0.98   val_acc = 0.83   // val dropped\nepoch 20: train_acc = 1.00   val_acc = 0.78   // train perfect, val worse",
    },
    {
      label: "3. What memorized output looks like",
      body:
        "An overfit model doesn't just get validation examples wrong — it often reproduces oddly specific phrasing from training rows, even when it doesn't fit the new input, because it's pattern-matching to the nearest memorized example instead of reasoning about the actual request.",
      code: "// training row: { prompt: \"refund for order #4471\", completion: \"Refund issued for order #4471.\" }\n// new input:    \"refund for order #9932\"\n// overfit output: \"Refund issued for order #4471.\"  <- wrong order number, memorized text",
    },
    {
      label: "4. The fix is not more training",
      body:
        "Stopping at the epoch where validation accuracy peaked (epoch 10 here) keeps the general rule and discards the memorization that came after it. More diverse training rows, not more epochs on the same rows, is what actually raises the ceiling.",
      code: "// use the checkpoint saved at epoch 10 (val_acc = 0.86), not epoch 20 (val_acc = 0.78)\n// next run: same epoch budget, but 3x more varied examples",
    },
  ],
  realWorldIntro:
    "Fine-tuning platforms like OpenAI's report training loss and validation loss side by side for exactly this reason, and practitioners are told to pick the checkpoint where validation loss is lowest rather than automatically using the final epoch, which is often already overfit.",
  realWorldCode:
    "// checkpoints saved per epoch, each with a validation score\nbest_checkpoint = pick_lowest_val_loss(checkpoints)\ndeploy(best_checkpoint)  // not deploy(checkpoints[-1])",
  sandbox: {
    kind: "explore",
    instructions:
      "Click through each training run and decide whether it shows healthy learning or overfitting before reading the diagnosis.",
    stages: [
      {
        label: "Run 1: curves rising together",
        body:
          "Training accuracy goes 65% -> 78% -> 89% across three checkpoints, and validation accuracy goes 63% -> 76% -> 87% right alongside it. Diagnosis: healthy. The model is generalizing — improvement on unseen data is tracking improvement on seen data.",
        code: "checkpoint 1: train=0.65 val=0.63\ncheckpoint 2: train=0.78 val=0.76\ncheckpoint 3: train=0.89 val=0.87",
      },
      {
        label: "Run 2: the gap opens up",
        body:
          "Training accuracy keeps rising to 99%, but validation accuracy peaked at checkpoint 2 and has been sliding backward since. Diagnosis: overfitting. Everything trained past checkpoint 2 made the model worse on real, unseen inputs while looking better on paper.",
        code: "checkpoint 1: train=0.70 val=0.68\ncheckpoint 2: train=0.85 val=0.84\ncheckpoint 3: train=0.93 val=0.79\ncheckpoint 4: train=0.99 val=0.71",
      },
      {
        label: "Run 3: tiny dataset, huge epoch count",
        body:
          "A dataset of only 40 examples trained for 30 epochs hits 100% training accuracy by epoch 8 and stays there. Diagnosis: overfitting risk from dataset size, not just epoch count. With only 40 rows and enough passes over them, memorizing every row outright is easier for the model than finding a general rule, especially once training accuracy plateaus at a perfect score this early.",
        code: "dataset_size = 40\nepoch 8:  train_acc = 1.00\nepoch 30: train_acc = 1.00   // stuck at perfect for 22 more epochs",
      },
      {
        label: "Run 4: validation score that never moves",
        body:
          "Training accuracy climbs normally from 60% to 95%, but validation accuracy stays flat at 61% the entire time instead of dropping. Diagnosis: overfitting, but a subtler kind — a flat (not falling) validation score alongside a rising training score still means the model isn't transferring what it's learning to new examples, it's simply logging the training rows.",
        code: "epoch 1:  train=0.60 val=0.61\nepoch 10: train=0.80 val=0.60\nepoch 20: train=0.95 val=0.61",
      },
      {
        label: "Run 5: a dip that recovers",
        body:
          "Validation accuracy briefly drops at checkpoint 3 then recovers and exceeds its prior peak at checkpoint 4, while training accuracy rises steadily throughout. Diagnosis: healthy, with normal noise. A single validation dip isn't automatically overfitting — the real signal is a validation score that keeps falling as training accuracy keeps climbing, not one noisy checkpoint.",
        code: "checkpoint 1: train=0.72 val=0.70\ncheckpoint 2: train=0.83 val=0.81\ncheckpoint 3: train=0.88 val=0.77\ncheckpoint 4: train=0.92 val=0.85",
      },
    ],
  },
  quizQuestion:
    "A fine-tuning run reaches 100% accuracy on its training set. What does that number alone tell you about how the model will perform in production?",
  quizOptions: [
    {
      key: "a",
      label: "Almost nothing on its own — it could mean the model learned the task well, or that it just memorized the training examples, and only a held-out validation score can tell them apart",
      correct: true,
    },
    {
      key: "b",
      label: "It guarantees strong production performance, since 100% is the maximum possible score",
      correct: false,
    },
    {
      key: "c",
      label: "It guarantees the model has overfit, since no real task can be learned perfectly",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — 100% training accuracy is consistent with both great generalization and total memorization, and training accuracy alone can't distinguish them; you need a validation score on examples the model never trained on to know which one actually happened.",
  quizFeedbackIncorrect:
    "Not quite — training accuracy only measures performance on examples the model has already seen during training, so a perfect score there is equally consistent with genuine learning or pure memorization; it takes a held-out validation score to tell which one occurred.",
  takeaway:
    "Training accuracy tells you what the model has memorized; validation accuracy on data it never trained on tells you what it actually learned — watch for the point where they diverge, and stop there.",
};

export default content;
