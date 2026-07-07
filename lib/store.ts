import { create } from "zustand";
import { runPython, STARTER_CODE, type OutputLine } from "./python";
import { createClient } from "./supabase/client";
import { withTimeout } from "./timeout";
import { fetchLearnerStats, type LearnerStats } from "./learnerStats";

/** Prototype-level config (was the Claude Design tweak panel). */
export const CONFIG = {
  learnerName: "Alex",
  showStreaks: true,
};

function applyTheme(theme: "light" | "dark") {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

export type Screen = "landing" | "onboarding" | "app" | "mentorship" | "mentor-apply";
export type AppTab = "dashboard" | "lesson" | "capstone" | "review" | "portfolio" | "roadmap" | "faq" | "dictionary";
export type QuizKey = "a" | "b" | "c";
export type Theme = "light" | "dark";
// null = browsing the full lesson list; "variables"/"rag" = a built lesson;
// a number = a module picked from the browser that has no lesson content yet
export type LessonSelection = { module: number; lessonIndex: number } | null;

type ObAnswers = { q1: string | null; q2: string | null; q3: string | null };
type Setup = { py: boolean; vsc: boolean; git: boolean };
export const OB_STEP_COUNT = 9;
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

  // auth
  userId: string | null;
  userEmail: string | null;
  profileName: string | null;
  authLoading: boolean;
  authBusy: boolean;
  authError: string | null;
  authNotice: string | null;
  theme: Theme;

  // learner stats (real, computed from the DB — never fabricated)
  stats: LearnerStats | null;
  statsLoading: boolean;

  // mobile sidebar drawer
  sidebarOpen: boolean;

  // which lesson is showing on the Lesson tab — null means "browse all lessons"
  activeLessonKey: LessonSelection;

  // onboarding
  obStep: number;
  obMode: "signup" | "login";
  obName: string;
  obEmail: string;
  obPw: string;
  obAnswers: ObAnswers;
  setup: Setup;
  obLearningGoal: string;
  obSaving: boolean;

  // lesson
  simpler: boolean;
  code: string;
  output: OutputLine[];
  quizPick: QuizKey | null;
  lessonDone: boolean;

  // capstone — keyed by project slug, since a learner can have several in flight
  activeCapstoneSlug: string;
  criteria: Record<string, boolean[]>;
  hintsOpen: Record<string, boolean[]>;
  ghUrl: Record<string, string>;
  depUrl: Record<string, string>;
  capstoneSubmitted: Record<string, boolean>;
  capstoneTemplateChoice: Record<string, string>;

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

  bootstrap: () => Promise<void>;
  setObMode: (mode: "signup" | "login") => void;
  submitAccount: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  setTheme: (theme: Theme) => void;
  loadStats: () => Promise<void>;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setActiveLessonKey: (key: LessonSelection) => void;
  goToLesson: (module: number, lessonIndex?: number) => void;

  setOb: (patch: Partial<Pick<State, "obName" | "obEmail" | "obPw" | "obLearningGoal">>) => void;
  answer: (key: keyof ObAnswers, value: string) => void;
  obNext: () => void;
  obBack: () => void;
  toggleSetup: (key: keyof Setup) => void;
  completeOnboarding: () => Promise<void>;

  toggleSimpler: () => void;
  setCode: (code: string) => void;
  runCode: () => void;
  resetCode: () => void;
  pickQuiz: (key: QuizKey) => void;
  completeLesson: () => void;

  goToCapstone: (slug: string) => void;
  toggleCriterion: (slug: string, i: number) => void;
  revealHint: (slug: string, i: number) => void;
  setGhUrl: (slug: string, v: string) => void;
  setDepUrl: (slug: string, v: string) => void;
  submitCapstone: (slug: string, totalCriteria: number) => void;
  chooseCapstoneTemplate: (capstoneSlug: string, templateSlug: string) => void;

  setScore: (key: keyof Scores, n: number) => void;
  setFeedback: (key: keyof Feedback, v: string) => void;
  submitReview: () => void;
};

export const useFramis = create<State & Actions>((set, get) => ({
  screen: "landing",
  appTab: "dashboard",

  userId: null,
  userEmail: null,
  profileName: null,
  authLoading: true,
  authBusy: false,
  authError: null,
  authNotice: null,
  theme: "light",

  stats: null,
  statsLoading: false,

  sidebarOpen: false,
  activeLessonKey: null,

  obStep: 1,
  obMode: "signup",
  obName: "",
  obEmail: "",
  obPw: "",
  obAnswers: { q1: null, q2: null, q3: null },
  setup: { py: false, vsc: false, git: false },
  obLearningGoal: "",
  obSaving: false,

  simpler: false,
  code: STARTER_CODE,
  output: [],
  quizPick: null,
  lessonDone: false,

  activeCapstoneSlug: "notes-app-with-login",
  criteria: {},
  hintsOpen: {},
  ghUrl: {},
  depUrl: {},
  capstoneSubmitted: {},
  capstoneTemplateChoice: {},

  scores: { crit: 0, read: 0, tests: 0, deploy: 0, readme: 0 },
  feedback: { well: "", improve: "", question: "", learned: "" },
  reviewSent: false,

  weekDone: [true, false, false, false],

  goScreen: (screen) => set({ screen }),
  goTab: (appTab) => set({ appTab }),
  startOnboarding: () => set({ screen: "onboarding", obStep: 1 }),
  finishOnboarding: () => set({ screen: "app", appTab: "dashboard" }),

  bootstrap: async () => {
    const supabase = createClient();
    try {
      const {
        data: { session },
      } = await withTimeout(supabase.auth.getSession(), 8000);
      if (session?.user) {
        const { data: profile } = await withTimeout(
          supabase.from("profiles").select("username, full_name, theme").eq("id", session.user.id).maybeSingle(),
          8000,
        );
        const theme = (profile?.theme as Theme) || "light";
        applyTheme(theme);
        set({
          userId: session.user.id,
          userEmail: session.user.email ?? null,
          profileName: profile?.full_name || profile?.username || null,
          screen: "app",
          appTab: "dashboard",
          theme,
        });
        get().loadStats();
      }
    } catch {
      // Network hiccup during silent session restore — fall through to the
      // landing page instead of leaving the app stuck on the loading screen.
    } finally {
      set({ authLoading: false });
    }
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        set({ userId: null, userEmail: null, profileName: null, screen: "landing" });
      }
    });
  },

  setObMode: (obMode) => set({ obMode, authError: null, authNotice: null }),

  submitAccount: async () => {
    const s = get();
    const email = s.obEmail.trim();
    const password = s.obPw;
    if (!email || !password) {
      set({ authError: "Enter an email and password." });
      return;
    }
    set({ authBusy: true, authError: null, authNotice: null });
    const supabase = createClient();

    try {
      if (s.obMode === "signup") {
        const { data, error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: s.obName.trim() || undefined } },
          }),
          15000,
        );
        if (error) {
          set({ authBusy: false, authError: error.message });
          return;
        }
        if (data.session) {
          set({
            userId: data.user?.id ?? null,
            userEmail: data.user?.email ?? null,
            profileName: s.obName.trim() || null,
            authBusy: false,
            obStep: 2,
          });
          get().loadStats();
        } else {
          set({
            authBusy: false,
            authNotice: `Check your inbox at ${email} to confirm your account, then log in below.`,
            obMode: "login",
          });
        }
        return;
      }

      const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }), 15000);
      if (error || !data.user) {
        set({ authBusy: false, authError: error?.message ?? "Couldn't log in." });
        return;
      }
      const { data: profile } = await withTimeout(
        supabase.from("profiles").select("username, full_name, theme").eq("id", data.user.id).maybeSingle(),
        8000,
      );
      const theme = (profile?.theme as Theme) || "light";
      applyTheme(theme);
      set({
        userId: data.user.id,
        userEmail: data.user.email ?? null,
        profileName: profile?.full_name || profile?.username || null,
        authBusy: false,
        screen: "app",
        appTab: "dashboard",
        theme,
      });
      get().loadStats();
    } catch {
      set({ authBusy: false, authError: "Network error — please try again." });
    }
  },

  signInWithGithub: async () => {
    set({ authBusy: true, authError: null, authNotice: null });
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (error) set({ authBusy: false, authError: error.message });
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    applyTheme("light");
    set({
      userId: null,
      userEmail: null,
      profileName: null,
      screen: "landing",
      appTab: "dashboard",
      obStep: 1,
      obMode: "signup",
      obName: "",
      obEmail: "",
      obPw: "",
      obAnswers: { q1: null, q2: null, q3: null },
      obLearningGoal: "",
      theme: "light",
      stats: null,
    });
  },

  loadStats: async () => {
    const { userId } = get();
    if (!userId) return;
    set({ statsLoading: true });
    const stats = await fetchLearnerStats(userId);
    set({ stats, statsLoading: false });
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setActiveLessonKey: (activeLessonKey) => set({ activeLessonKey }),
  goToLesson: (module, lessonIndex = 1) =>
    set({ activeLessonKey: { module, lessonIndex }, appTab: "lesson", sidebarOpen: false }),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
    const { userId } = get();
    if (userId) {
      const supabase = createClient();
      supabase.from("profiles").update({ theme }).eq("id", userId).then(() => {}, () => {});
    }
  },

  setOb: (patch) => set(patch),
  answer: (key, value) =>
    set((s) => ({ obAnswers: { ...s.obAnswers, [key]: value } })),
  obNext: () => {
    const s = get();
    const allAnswered = s.obAnswers.q1 && s.obAnswers.q2 && s.obAnswers.q3;
    if (s.obStep === 8 && !allAnswered) return;
    set({ obStep: Math.min(OB_STEP_COUNT, s.obStep + 1) });
  },
  obBack: () => set((s) => ({ obStep: Math.max(2, s.obStep - 1) })),
  toggleSetup: (key) => set((s) => ({ setup: { ...s.setup, [key]: !s.setup[key] } })),

  completeOnboarding: async () => {
    const s = get();
    if (!s.userId) return;
    set({ obSaving: true });
    const supabase = createClient();
    const beginner = s.obAnswers.q1 === "Never used it";
    try {
      await supabase
        .from("profiles")
        .update({
          learning_goal: s.obLearningGoal.trim() || null,
          placement_answers: s.obAnswers,
          setup_checklist: s.setup,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", s.userId);
      // Fire-and-forget: the route re-checks welcome_email_day itself before
      // sending, so a dropped network call here just means Day 1 arrives via
      // the next day's cron catch-up instead of instantly — not a retry risk.
      fetch("/api/send-onboarding-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: s.userId }),
      }).catch(() => {});
    } finally {
      set({ obSaving: false });
    }
    set({ screen: "app" });
    get().goToLesson(beginner ? 1 : 2, 1);
  },

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

  goToCapstone: (slug) => set({ activeCapstoneSlug: slug, appTab: "capstone", sidebarOpen: false }),
  toggleCriterion: (slug, i) =>
    set((s) => {
      const c = [...(s.criteria[slug] ?? [])];
      c[i] = !c[i];
      return { criteria: { ...s.criteria, [slug]: c } };
    }),
  revealHint: (slug, i) =>
    set((s) => {
      const h = [...(s.hintsOpen[slug] ?? [])];
      h[i] = true;
      return { hintsOpen: { ...s.hintsOpen, [slug]: h } };
    }),
  setGhUrl: (slug, v) => set((s) => ({ ghUrl: { ...s.ghUrl, [slug]: v } })),
  setDepUrl: (slug, v) => set((s) => ({ depUrl: { ...s.depUrl, [slug]: v } })),
  submitCapstone: (slug, totalCriteria) => {
    const s = get();
    const criteriaCount = (s.criteria[slug] ?? []).filter(Boolean).length;
    const ready = criteriaCount === totalCriteria && (s.ghUrl[slug] ?? "").trim() && (s.depUrl[slug] ?? "").trim();
    if (ready) set({ capstoneSubmitted: { ...s.capstoneSubmitted, [slug]: true } });
  },
  chooseCapstoneTemplate: (capstoneSlug, templateSlug) =>
    set((s) => ({ capstoneTemplateChoice: { ...s.capstoneTemplateChoice, [capstoneSlug]: templateSlug } })),

  setScore: (key, n) => set((s) => ({ scores: { ...s.scores, [key]: n } })),
  setFeedback: (key, v) => set((s) => ({ feedback: { ...s.feedback, [key]: v } })),
  submitReview: () => {
    const s = get();
    const scoresDone = Object.values(s.scores).every((v) => v > 0);
    const ready = scoresDone && s.feedback.well.trim() && s.feedback.improve.trim();
    if (ready) set({ reviewSent: true });
  },
}));

/** First name: real profile once authenticated, else the onboarding draft, else config. */
export function useDisplayName() {
  const profileName = useFramis((s) => s.profileName);
  const obName = useFramis((s) => s.obName);
  return (profileName || obName.trim() || CONFIG.learnerName).split(" ")[0];
}
