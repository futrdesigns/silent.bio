/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.14)",
        input: "rgba(255, 255, 255, 0.08)",
        ring: "#A5A5FF",
        background: "#08090B",
        foreground: "#F5F5F5",
        surface: "#101114",
        elevated: "#15171B",
        hover: "#1B1E23",
        muted: {
          DEFAULT: "#92949D",
          foreground: "#92949D",
        },
        subtle: "#5C5E66",
        accent: {
          DEFAULT: "#A5A5FF",
          foreground: "#08090B",
        },
        danger: {
          DEFAULT: "#E06D6D",
          foreground: "#F5F5F5",
        },
        success: {
          DEFAULT: "#6DE09D",
          foreground: "#08090B",
        },
        warning: {
          DEFAULT: "#E0C86D",
          foreground: "#08090B",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      transitionTimingFunction: {
        entrance: "cubic-bezier(0.23, 1, 0.32, 1)",
        screen: "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [],
};
