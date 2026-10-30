/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A', // Sovereign Navy
          800: '#1E293B',
          700: '#334155',
        },
        royal: {
          900: '#1E3A8A', // Sovereign Royal Blue
          800: '#1E40AF',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          50: '#EFF6FF',
        },
        emerald: {
          500: '#10B981', // Trust Emerald
          600: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
        },
        rose: {
          500: '#EF4444', // Forensic Rose / Tamper Red
          600: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
