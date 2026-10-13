/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f9eb',
          100: '#e4f1cb',
          200: '#cde49d',
          300: '#afd368',
          400: '#96c53e',
          500: '#84bd2f', // Ramlogics signature green
          600: '#6a9a23',
          700: '#4f751a',
          800: '#3f5c18',
          900: '#344c17',
          950: '#192709',
        },
        accent: {
          500: '#e11d48',
          600: '#be123c',
        }
      }
    },
  },
  plugins: [],
}
