/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFCE1A',
        'secondary': '#0D0842',
        'blackBack': '#F3F3F3',
        'Favourite': '#FF5841'
      },
      fontFamily: {
        'primary': ["Montserrat", "sans-serif"],
        'secondary': ["Nunito Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}


