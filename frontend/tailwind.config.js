/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        // legacy aliases kept for any remaining usage
        Bodoni: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        oswald: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        hind: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Design token palette
        primary:    '#FBF7F3',   // warm off-white page bg
        secondary:  '#4F200D',   // deep maroon brand colour
        text:       '#2A1506',   // near-black body text
        background: '#EBD9D1',   // warm blush (legacy, kept for compat)
        gold:       '#AF8255',   // warm gold accent
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      // Prevent layout shift on images
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
