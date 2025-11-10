/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0B',
        'bg-secondary': '#1A1A1D',
        'bg-tertiary': '#27272A',
        'accent-primary': '#8B5CF6',
        'accent-secondary': '#06B6D4',
        'accent-success': '#10B981',
        'accent-warning': '#F59E0B',
        'accent-error': '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        'text-tertiary': '#71717A',
        dark: {
          bg: '#0F1419',
          card: '#1A1F2E',
          text: '#FFFFFF',
        },
        primary: {
          cyan: '#00D9FF',
          blue: '#0A66C2',
          green: '#10B981',
          error: '#FF006E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
