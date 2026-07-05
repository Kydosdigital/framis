export type QuizOption = { key: "a" | "b" | "c"; label: string; correct: boolean };

export type VizStage = { label: string; body: string; code?: string };

export type Explainer = {
  id: string;
  term: string;
  emoji: string;
  shortDef: string;
  longDef: string;
  whyMatters: string;
  realWorldExample: string;
  screenshot?: string;
  relatedTerms?: string[];
  expandedByDefault?: boolean;
};

export type LessonData = {
  num: number;
  orderIndex: number;
  phaseLabel: string;
  title: string;
  minutes: number;
  concept: string;
  conceptSimpler: string;
  vizStages: VizStage[];
  realWorldIntro: string;
  realWorldCode?: string;
  sandbox:
    | { kind: "code"; challenge: string; starterCode: string; language?: "python" | "javascript" | "sql" }
    | { kind: "explore"; instructions: string; stages: VizStage[] };
  quizQuestion: string;
  quizCode?: string;
  quizOptions: QuizOption[];
  quizFeedbackCorrect: string;
  quizFeedbackIncorrect: string;
  takeaway: string;
  /** @deprecated "next up" is now computed centrally in lib/lessons/index.ts; this field is ignored. */
  nextUpLabel?: string;
  /** Optional plain-English glossary sidebar for lessons that lean on jargon a true beginner won't know yet. */
  explainers?: Explainer[];
};
