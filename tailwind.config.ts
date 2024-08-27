import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#E6E6FF',
          200: '#CCCCFF',
          300: '#9999FF',
          400: '#6666FF',
          500: '#3333FF',
          600: '#0000FF',
          700: '#0000CC',
          800: '#000099',
          900: '#000066',
        },
        'secondary': {
          100: '#FFF5E6',
          200: '#FFE6CC',
          300: '#FFD699',
          400: '#FFC266',
          500: '#FFAD33',
          600: '#FF9900',
          700: '#CC7A00',
          800: '#995C00',
          900: '#663D00',
        },
        'accent': {
          100: '#FFE6E6',
          200: '#FFCCCC',
          300: '#FF9999',
          400: '#FF6666',
          500: '#FF3333',
          600: '#FF0000',
          700: '#CC0000',
          800: '#990000',
          900: '#660000',
        },
        'background': '#0A0A1B',
        'surface': '#1E1E3F',
        'text': {
          primary: '#FFFFFF',
          secondary: '#B8B8D0',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Spectral', 'serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      cursor: {
        'fantasy': 'url("/cursors/fantasy-cursor.png"), auto',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
};

export default config;
