/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["customLight", "night", {
      customLight: {
        ...require("daisyui/src/colors/themes")["[data-theme=pastel]"],
        "neutral": "#68afff",
        "primary": "#c3a3cf",
        "secondary": "#d3947d",
      }
    }],
    darkTheme: "night"
  },
}
