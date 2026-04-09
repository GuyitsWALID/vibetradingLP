import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F5F5F5",
        secondary: "#A6A6A6",
        muted: "#69F0AE",
        background: "#000000",
        surface: "#1A2D4E",
        "surface-hover": "#1E3560",
        cyan: "#00FFFF",
        "cyan-muted": "#80E5FF",
        navy: "#1A2D4E",
        white: "#FFFFFF",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A6A6A6",
        "text-muted": "#69F0AE",
        border: "#242424",
        bullish: "#00E676",
        bearish: "#FF1744",
        neutral: "#B0BEC5",
        impact: {
          high: "#FF1744",
          middle: "#FFAB40",
          low: "#69F0AE",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
