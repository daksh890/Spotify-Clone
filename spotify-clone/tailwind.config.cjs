/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        green: "#1db954",
        "dark-base": "#121212",
        "dark-primary": "#191414",
        "dark-secondary": "#171818",
        "light-dark": "#282828",
        primary: "#FFFFFF",
        secondary: "#b3b3b3",
        gray: "#535353",
      },
      gridTemplateColumns: {
        "auto-fill-cards": "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
