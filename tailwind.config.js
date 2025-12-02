/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, approachable palette
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E8',
          200: '#FFF3D1',
        },
        warmgray: {
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#E8E4DE',
          300: '#D4CEC4',
          400: '#A39E93',
          500: '#6B6660',
          600: '#4A4743',
          700: '#363330',
          800: '#252321',
          900: '#1A1918',
        },
        terracotta: {
          50: '#FEF6F3',
          100: '#FCEBE4',
          200: '#F9D4C6',
          300: '#F3B49D',
          400: '#E8896A',
          500: '#D4693F',
          600: '#B85431',
          700: '#9A4428',
          800: '#7D3822',
          900: '#67301F',
        },
        sage: {
          50: '#F6F8F5',
          100: '#E9EFE6',
          200: '#D3DFD0',
          300: '#B1C4AC',
          400: '#8BA583',
          500: '#6B8A62',
          600: '#546E4D',
          700: '#44583F',
          800: '#394835',
          900: '#303C2E',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(180, 84, 49, 0.1)',
        'warm-lg': '0 10px 40px 0 rgba(180, 84, 49, 0.15)',
      },
    },
  },
  plugins: [],
}
