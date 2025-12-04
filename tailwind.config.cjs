/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Core Shinra system */
        'shinra-bg': '#050509',
        'shinra-surface': '#0B0F18',
        'shinra-surface-light': '#121826',
        'shinra-surface-hover': '#131A2B',
        'shinra-border': '#1C2430',
        'shinra-border-light': '#2A3442',

        /* Text */
        'shinra-text': '#ffffff',
        'shinra-text-soft': '#d1d5db',
        'shinra-text-dim': '#9ca3af',

        /* Accent */
        'shinra-accent': '#F5F5F5',
        'shinra-accent-blue': '#3B82F6',
      },

      /* Shadows */
      boxShadow: {
        'shinra': '0 18px 45px rgba(0, 0, 0, 0.65)',
        'shinra-soft': '0 6px 20px rgba(0, 0, 0, 0.35)',
      },

      /* Border radius */
      borderRadius: {
        'lg': '12px',
        'xl': '1rem',
        '2xl': '1.35rem',
      },

      /* Backdrop blur for glass effect */
      backdropBlur: {
        xs: '2px',
      },

      /* Spacing tweaks */
      spacing: {
        'sm-gap': '0.65rem',
      },

      /* Font spacing */
      letterSpacing: {
        wide: '0.15em',
        wider: '0.18em',
        widest: '0.22em',
      }
    },
  },
  plugins: [],
}
