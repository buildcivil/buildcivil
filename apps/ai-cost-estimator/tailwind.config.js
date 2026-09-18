/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        highlight: {
          500: '#E87F24',
          600: '#C96618',
        },
        border: {
          500: '#FFC81E',
        },
        base: {
          DEFAULT: '#FEFDDF',
          50: '#FFFDF3',
          100: '#FEFBD9',
          400: '#FDF85F',
          500: '#FEFDDF',
        },
        header: {
          DEFAULT: '#73A5CA',
          50: '#ECF4FA',
          100: '#D9E8F3',
          500: '#73A5CA',
          600: '#5D8FB2',
          700: '#49728F',
        },
        brand: {
          dark: '#1c1712',
          muted: '#8B7E74',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
