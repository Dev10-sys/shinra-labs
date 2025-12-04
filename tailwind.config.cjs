/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'shinra-bg': '#050509',
        'shinra-surface': '#0B0F18',
        'shinra-border': '#1F2933',
        'shinra-accent': '#F5F5F5'
      },
      boxShadow: {
        'shinra': '0 18px 45px rgba(0, 0, 0, 0.65)',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}
