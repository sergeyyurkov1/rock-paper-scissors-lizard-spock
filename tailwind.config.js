/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "375px",
      md: "1366px",
    },
    container: {
      center: true,
    },
    colors: {
      white: "#fff",
      "dark-text": "hsl(229, 25%, 31%)",
      "score-text": "hsl(229, 64%, 46%)",
      "header-outline": "hsl(217, 16%, 45%)",
      "background-1": "hsl(214, 47%, 23%)",
      "background-2": "hsl(237, 49%, 15%)",
      "scissors-1": "hsl(39, 89%, 49%)",
      "scissors-2": "hsl(40, 84%, 53%)",
      "paper-1": "hsl(230, 89%, 62%)",
      "paper-2": "hsl(230, 89%, 65%)",
      "rock-1": "hsl(349, 71%, 52%)",
      "rock-2": "hsl(349, 70%, 56%)",
      "lizard-1": "hsl(261, 73%, 60%)",
      "lizard-2": "hsl(261, 72%, 63%)",
      "spock-1": "hsl(189, 59%, 53%)",
      "spock-2": "hsl(189, 58%, 57%)",
    },
    fontFamily: {
      sans: ["Barlow Semi Condensed", "sans-serif"],
    },
    fontWeight: {
      normal: 600,
      bold: 700,
    },
    extend: {},
  },
  plugins: [],
};
