import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-plex)", "sans-serif"],
        mono: ["var(--font-fira)", "monospace"],
      },
      colors: {
        // Framis brand
        navy: {
          DEFAULT: "#0A1428",
          900: "#0A1428",
          800: "#0D1B30",
          700: "#121F35",
          600: "#16233A",
          500: "#1A2A44",
          400: "#24344D",
          300: "#2A3B57",
          200: "#33455F",
        },
        blue: {
          DEFAULT: "#0066CC",
        },
        teal: {
          DEFAULT: "#4B9E8F",
        },
        // muted text on dark
        slateink: {
          200: "#B7C0CE",
          300: "#8FA0B5",
          400: "#5B6B82",
        },
        // theme-aware surfaces (see CSS variables in globals.css)
        surface: {
          DEFAULT: "var(--color-page)",
        },
        card: {
          DEFAULT: "var(--color-card)",
        },
        ink: {
          900: "var(--color-ink-900)",
          700: "var(--color-ink-700)",
          500: "var(--color-ink-500)",
          400: "var(--color-ink-400)",
        },
        line: {
          DEFAULT: "var(--color-border)",
          input: "var(--color-border-input)",
        },
        success: "#059669",
        danger: "#DC2626",
        amber: "#B45309",
      },
      keyframes: {
        framisPulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(75,158,143,.45)" },
          "100%": { boxShadow: "0 0 0 14px rgba(75,158,143,0)" },
        },
        framisWordIn: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "none" },
        },
        framisTicker: {
          to: { transform: "translateX(-50%)" },
        },
        framisCaret: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
      },
      animation: {
        "framis-pulse": "framisPulse 2.4s ease-out infinite",
        "framis-ticker": "framisTicker 36s linear infinite",
        "framis-caret": "framisCaret 1s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
