/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FCFAFA",
        secondary: "#4F200D",
        text: "#131010",
        background: "#EBD9D1",
      },
    },
  },
  plugins: [],
}