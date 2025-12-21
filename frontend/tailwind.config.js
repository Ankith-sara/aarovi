/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Bodoni: ['Bodoni Moda', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        hind: ['Hind Mysuru', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
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