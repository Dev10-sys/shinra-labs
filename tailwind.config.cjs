/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shinra-bg': '#050509',
        'shinra-surface': '#0B0C11',
        'shinra-border': '#2a2d3a',
      },
      boxShadow: {
        'shinra': '0 4px 16px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
