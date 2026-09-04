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
        pastel: {
          bg: '#FAF7F5',
          card: '#FFFFFF',
          primary: '#EC4899', // Rose pink
          secondary: '#A78BFA', // Soft lavender
          accent: '#FBBF24', // Soft warm amber
          text: '#374151',
          subtext: '#6B7280',
          border: '#F3E8FF'
        },
        galaxy: {
          bg: '#0F172A',
          card: '#1E293B',
          primary: '#818CF8', // Nebula indigo
          secondary: '#C084FC', // Cosmic purple
          accent: '#38BDF8', // Cyan glow
          text: '#F8FAFC',
          subtext: '#94A3B8',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
