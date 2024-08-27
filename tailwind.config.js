/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          800: '#000080', // Navy blue
          900: '#000066', // Darker navy blue
        },
        accent: {
          500: '#FFA500', // Orange
          600: '#FF8C00', // Dark orange
        },
        text: {
          primary: '#ffffff', // White
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}