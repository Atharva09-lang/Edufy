/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: { inter: ["Inter", "sans-serif"], "edu-sa": ["Edu SA Beginner", "cursive"], mono: ["Roboto Mono", "monospace"] },
    extend: {
      colors: {
        white: "#ffffff", black: "#0F172A", transparent: "transparent",
        primary: { DEFAULT: "#0EA5E9", 50: "#ECFEFF", 100: "#CFFAFE", 200: "#A5F3FC", 300: "#67E8F9", 400: "#22D3EE", 500: "#0EA5E9", 600: "#0284C7", 700: "#0369A1", 800: "#075985", 900: "#0C4A6E" },
        secondary: { DEFAULT: "#A78BFA", 50: "#F5F3FF", 100: "#EDE9FE", 200: "#DDD6FE", 300: "#C4B5FD", 400: "#A78BFA", 500: "#8B5CF6", 600: "#7C3AED", 700: "#6D28D9", 800: "#5B21B6", 900: "#4C1D95" },
        richblack: { 5: "#0F172A", 25: "#1E293B", 50: "#334155", 100: "#475569", 200: "#64748B", 300: "#64748B", 400: "#94A3B8", 500: "#CBD5E1", 600: "#E2E8F0", 700: "#EEF8FF", 800: "#F4FAFF", 900: "#F8FCFF" },
        edupurple: { 5: "#F5F3FF", 25: "#A78BFA", 50: "#22D3EE", 100: "#0EA5E9", 200: "#0284C7", 300: "#0369A1", 400: "#075985", 500: "#7C3AED", 600: "#6D28D9", 700: "#5B21B6", 800: "#4C1D95", 900: "#F8FCFF" },
        edugreen: { 5: "#ECFDF5", 25: "#A7F3D0", 50: "#10B981", 100: "#059669", 200: "#047857", 300: "#065F46", 400: "#064E3B", 500: "#10B981", 600: "#059669", 700: "#047857", 800: "#065F46", 900: "#022C22" },
        yellow: { 5: "#ECFEFF", 25: "#CFFAFE", 50: "#22D3EE", 100: "#06B6D4", 200: "#0891B2", 300: "#0E7490", 400: "#155E75", 500: "#22D3EE" },
        blue: { 5: "#EFF6FF", 25: "#DBEAFE", 50: "#BFDBFE", 100: "#93C5FD", 200: "#60A5FA", 300: "#3B82F6", 400: "#2563EB", 500: "#1D4ED8", 600: "#1E40AF", 700: "#1D4ED8", 800: "#1E3A8A", 900: "#172554" },
        "pure-greys": { 5: "#F8FCFF", 25: "#F1F5F9", 50: "#E2E8F0", 100: "#CBD5E1", 200: "#94A3B8", 300: "#64748B", 400: "#475569", 500: "#334155", 600: "#1E293B", 700: "#0F172A", 800: "#0F172A", 900: "#0F172A" },
      },
      maxWidth: { maxContent: "1260px", maxContentTab: "650px" },
      keyframes: { float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } }, shimmer: { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } } },
      animation: { float: "float 7s ease-in-out infinite", "float-slow": "float 11s ease-in-out infinite", shimmer: "shimmer 2s linear infinite" },
      boxShadow: { soft: "0 16px 45px -24px rgba(15, 23, 42, .22)", glow: "0 10px 30px -12px rgba(34, 211, 238, .55)" },
    },
  },
  plugins: [],
};
