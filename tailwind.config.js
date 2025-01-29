/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        sm: {
          css: {
            p: {
              marginTop: '0',
              marginBottom: '0',
            },
            'p:first-child': {
              marginTop: '0',
            },
            'p:last-child': {
              marginBottom: '0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};