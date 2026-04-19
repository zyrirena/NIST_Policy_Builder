/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#B8D4E3',
          'blue-dark': '#7BA7C2',
          'blue-deep': '#5B6ABF',
          green: '#A8D8B9',
          'green-dark': '#7BC49C',
          purple: '#C4B5D4',
          'purple-dark': '#9B8BB8',
          pink: '#E8C5D0',
          yellow: '#F4E4A6',
          'yellow-dark': '#F4C57A',
          orange: '#F4C9A0',
          red: '#E8A0A0',
          gray: '#E8E6EF',
          'gray-dark': '#B0ADC0',
          cream: '#FAF8F5',
          slate: '#F0EFF4',
        },
        brand: {
          50: '#EEF0FA',
          100: '#D4DAF0',
          200: '#A8B4E0',
          300: '#7C8FD4',
          400: '#5B6ABF',
          500: '#4A5899',
          600: '#3A4578',
          700: '#2D3560',
          800: '#1F2544',
          900: '#141830',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
