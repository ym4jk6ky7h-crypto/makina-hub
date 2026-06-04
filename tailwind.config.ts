import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        makina: {
          pink: "#ff2d6a",
          purple: "#8b5cf6",
          cyan: "#22d3ee",
          gold: "#fbbf24",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,45,106,0.28), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139,92,246,0.18), transparent), radial-gradient(ellipse 50% 30% at 0% 100%, rgba(34,211,238,0.08), transparent)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
        "makina-mesh":
          "radial-gradient(at 40% 20%, rgba(255,45,106,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(34,211,238,0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        "makina-glow": "0 0 40px -10px rgba(255, 45, 106, 0.4)",
        "makina-glow-sm": "0 0 20px -5px rgba(255, 45, 106, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
