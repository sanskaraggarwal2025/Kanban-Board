/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-purple': '#635fc7',
        'dark-grey': '#2b2c37',
        'medium-grey': '#828FA3',
        'very-dark-grey': '#20212C',
        'light-grey': '#F4F7FD',
        'red': '#EA5555',
        'lines-dark': '#3E3F4E',
        'primary': '#a8a4ff',
        'light-red': '#ff9898',
        'light-hovered': "#e4ebfa",
      },
    },
  },
  plugins: [],
}