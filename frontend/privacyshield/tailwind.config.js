/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],      // This is now your default text font
        display: ['Poppins', 'sans-serif'], // This is now your font for headings
      },
      colors: {
        'primary-blue': '#3B82F6',
        'dark-blue': '#1E3A8A',
        'light-blue': '#EFF6FF',
        'neutral-gray': '#6B7280',
      }
    },
  },
  plugins: [],
}