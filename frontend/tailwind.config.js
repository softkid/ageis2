/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aegis: {
          bg: "#0a0e1a",
          panel: "#0f1526",
          border: "#1e2740",
          violet: "#7c5cff",
          blue: "#3b82f6",
          cyan: "#22d3ee",
          text: "#e6e9f5",
          muted: "#8b93ab",
        },
      },
      fontFamily: {
        sans: ["Inter", "Pretendard", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aegis-gradient": "linear-gradient(90deg, #7c5cff 0%, #3b82f6 55%, #22d3ee 100%)",
      },
    },
  },
  plugins: [],
};
