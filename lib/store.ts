import { create } from "zustand";
import { runPython, STARTER_CODE, type OutputLine } from "./python";

/** Prototype-level config (was the Claude Design tweak panel). */
export const CONFIG = {
  learnerName: "Alex",
  showStreaks: true,
};

export type Screen = "landing" | "onboarding" | "app";
export type AppTab = "dashboard" | "lesson" | "capstone" | "review";
export type QuizKey = "a" | "b" | "c";

type ObAnswers = { q1: string | null; q2: string | null; q3: string | null };
type Setup = { py: boolean; vsc: boolean; git: boolean };
type Scores = {
  crit: number;
  read: number;
  tests: number;
  deploy: number;
  readme: number;
};
type Feedback = { well: string; improve: string; question: string; learned: string };

type State = {
  screen: Screen;
  appTab: AppTab;

  // onboarding
  obStep: number;
  obName: string;
  obEmail: string;
  obPw: string;
  obAnswers: ObAnswers;
  setup: Setup;

  // lesson
  simpler: boolean;
  code: string;
  output: OutputLine[];
  quizPick: QuizKey | null;
  lessonDone: boolean;

  // capstone
  criteria: boolean[];
  hintsOpen: boolean[];
  ghUrl: string;
  depUrl: string;
  capstoneSubmitted: boolean;

  // peer review
  scores: Scores;
  feedback: Feedback;
  reviewSent: boolean;

  // dashboard
  weekDone: boolean[];
};

type Actions = {
  goScreen: (screen: Screen) => void;
  goTab: (tab: AppTab) => void;
  startOnboarding: () => void;
  finishOnboarding: () => void;

  setOb: (patch: Partial<Pick<State, "obName" | "obEmail" | "obPw">>) => void;
  answer: (key: keyof ObAnswers, value: string) => void;
  obNext: () => void;
  toggleSetup: (key: keyof Setup) => void;

  toggleSimpler: () => void;
  setCode: (code: string) => void;
  runCode: () => void;
  resetCode: () => void;
  pickQuiz: (key: QuizKey) => void;
  completeLesson: () => void;

  toggleCriterion: (i: number) => void;
  revealHint: (i: number) => void;
  setGhUrl: (v: string) => void;
  setDepUrl: (v: string) => void;
  submitCapstone: () => void;

  setScore: (key: keyof Scores, n: number) => void;
  setFeedback: (key: keyof Feedback, v: string) => void;
  submitReview: () => void;
};

export const useFramis = create<State & Actions>((set, get) => ({
  screen: "landing",
  appTab: "dashboard",

  obStep: 1,
  obName: "",
  obEmail: "",
  obPw: "",
  obAnswers: { q1: null, q2: null, q3: null },
  setup: { py: false, vsc: false, git: false },

  simpler: false,
  code: STARTER_CODE,
  output: [],
  quizPick: null,
  lessonDone: false,

  criteria: [false, false, false, false, false, false, false],
  hintsOpen: [false, false, false],
  ghUrl: "",
  depUrl: "",
  capstoneSubmitted: false,

  scores: { crit: 0, read: 0, tests: 0, deploy: 0, readme: 0 },
  feedback: { well: "", improve: "", question: "", learned: "" },
  reviewSent: false,

  weekDone: [true, false, false, false],

  goScreen: (screen) => set({ screen }),
  goTab: (appTab) => set({ appTab }),
  startOnboarding: () => set({ screen: "onboarding", obStep: 1 }),
  finishOnboarding: () => set({ screen: "app", appTab: "dashboard" }),

  setOb: (patch) => set(patch),
  answer: (key, value) =>
    set((s) => ({ obAnswers: { ...s.obAnswers, [key]: value } })),
  obNext: () => {
    const s = get();
    const allAnswered = s.obAnswers.q1 && s.obAnswers.q2 && s.obAnswers.q3;
    if (s.obStep === 2 && !allAnswered) return;
    set({ obStep: Math.min(3, s.obStep + 1) });
  },
  toggleSetup: (key) => set((s) => ({ setup: { ...s.setup, [key]: !s.setup[key] } })),

  toggleSimpler: () => set((s) => ({ simpler: !s.simpler })),
  setCode: (code) => set({ code }),
  runCode: () => set((s) => ({ output: runPython(s.code) })),
  resetCode: () => set({ code: STARTER_CODE, output: [] }),
  pickQuiz: (quizPick) => set({ quizPick }),
  completeLesson: () =>
    set((s) => {
      const w = [...s.weekDone];
      w[0] = true;
      return { lessonDone: true, weekDone: w };
    }),

  toggleCriterion: (i) =>
    set((s) => {
      const c = [...s.criteria];
      c[i] = !c[i];
      return { criteria: c };
    }),
  revealHint: (i) =>
    set((s) => {
      const h = [...s.hintsOpen];
      h[i] = true;
      return { hintsOpen: h };
    }),
  setGhUrl: (ghUrl) => set({ ghUrl }),
  setDepUrl: (depUrl) => set({ depUrl }),
  submitCapstone: () => {
    const s = get();
    const ready =
      s.criteria.filter(Boolean).length === 7 && s.ghUrl.trim() && s.depUrl.trim();
    if (ready) set({ capstoneSubmitted: true });
  },

  setScore: (key, n) => set((s) => ({ scores: { ...s.scores, [key]: n } })),
  setFeedback: (key, v) => set((s) => ({ feedback: { ...s.feedback, [key]: v } })),
  submitReview: () => {
    const s = get();
    const scoresDone = Object.values(s.scores).every((v) => v > 0);
    const ready = scoresDone && s.feedback.well.trim() && s.feedback.improve.trim();
    if (ready) set({ reviewSent: true });
  },
}));

/** First name derived from onboarding input, falling back to config. */
export function useDisplayName() {
  const obName = useFramis((s) => s.obName);
  return (obName.trim() || CONFIG.learnerName).split(" ")[0];
}
