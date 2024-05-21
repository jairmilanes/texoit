const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
    `./src/layouts/**/*.{js,jsx,ts,tsx}`,
    `./src/modules/**/*.{js,jsx,ts,tsx}`,
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(primary|accent|neutral|faded)(-\d*)?/,
    },
  ],
  theme: {
    extend: {
      container: { center: true },
      colors: {
        primary: {
          light: '#0ab463',
          dark: '#089954',
          ...colors.blue,
        },
        accent: colors.rose,
        neutral: colors.gray,
        faded: '#383838',
        nulled: '#6e6e6e',
        sep: '#c4c4c4',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        title: '18px',
        lead: '16px',
        base: '14px',
      },
      fontWeight: {
        bold: '700',
        semi: '600',
        normal: '400',
      },
    },
  },
  plugins: [],
};
