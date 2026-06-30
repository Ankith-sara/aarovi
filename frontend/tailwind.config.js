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
        Bodoni: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        oswald: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        hind: ['Montserrat', 'sans-serif'],
        polysans: ['"Space Grotesk"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        text: 'hsl(var(--text))',
        gold: 'hsl(var(--gold))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
