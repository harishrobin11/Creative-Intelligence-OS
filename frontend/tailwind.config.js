/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#090d16",
          card: "#111827",
          border: "#1e293b",
          accent: "#6366f1",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
