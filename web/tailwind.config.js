/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf6',
          100: '#d5f7e8',
          500: '#14b873',
          600: '#079462',
          700: '#047550'
        },
        ink: '#17211f'
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 23, 42, 0.08)'
      }
    },
  },
  plugins: [],
};
