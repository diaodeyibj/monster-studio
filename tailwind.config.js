/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'film-gold': '#FFD700',
        'film-silver': '#C0C0C0',
        'film-dark': '#1a1a1a',
        'film-gray': '#2d2d2d',
      },
      animation: {
        'film-roll': 'filmRoll 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        filmRoll: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      fontFamily: {
        'cinematic': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 