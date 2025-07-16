/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f4f4f",       // blue grey (modern)
        accent: "#0b9444",        // Asklepios-Grün
        light: "#b7ffd0",         // hellgrün
        background: "#1f2f2f",    // dunkler Hintergrund
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
