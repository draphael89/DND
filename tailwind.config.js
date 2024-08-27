/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Cinzel Decorative', 'cursive'],
        'sans': ['Spectral', 'serif'],
      },
      colors: {
        primary: {
          800: '#000080', // Navy blue
          900: '#000066', // Darker navy blue
        },
        accent: {
          500: '#FFA500', // Orange
          600: '#FF8C00', // Dark orange
          400: '#fbbf24',
          500: '#f59e0b',
        },
        text: {
          primary: '#ffffff', // White
        },
      },
      gradientColorStops: theme => ({
        'gray': {
          800: theme('colors.gray.800'),
          900: theme('colors.gray.900'),
        },
      }),
    },
  },
  variants: {},
  plugins: [],
}