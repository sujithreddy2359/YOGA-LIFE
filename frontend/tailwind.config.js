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
        zen: {
          50: '#f6f9f7',
          100: '#eaf2ee',
          200: '#d5e5dc',
          300: '#b4d1c2',
          400: '#8bb5a1',
          500: '#679882',
          600: '#4f7b68',
          700: '#416354',
          800: '#375045',
          900: '#2f433b',
          950: '#182520',
        },
        amberGold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        earth: {
          100: '#f7f4ed',
          200: '#ede6d6',
          700: '#6e5d4a',
          800: '#544636',
          900: '#3b3126',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'breathe': 'breathe 16s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' }, // Inhale
          '50%': { transform: 'scale(1.3)' }, // Hold
          '75%': { transform: 'scale(1)' },   // Exhale
        }
      }
    },
  },
  plugins: [],
}
