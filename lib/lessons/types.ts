export type QuizOption = { key: "a" | "b" | "c"; label: string; correct: boolean };

export type VizStage = { label: string; body: string; code?: string };

export type LessonData = {
  num: number;
  phaseLabel: string;
  title: string;
  minutes: number;
  concept: string;
  conceptSimpler: string;
  vizStages: VizStage[];
  realWorldIntro: string;
  realWorldCode?: string;
  sandbox:
    | { kind: "code"; challenge: string; starterCode: string }
    | { kind: "explore"; instructions: string; stages: VizStage[] };
  quizQuestion: string;
  quizCode?: string;
  quizOptions: QuizOption[];
  quizFeedbackCorrect: string;
  quizFeedbackIncorrect: string;
  takeaway: string;
  nextUpLabel: string;
};
