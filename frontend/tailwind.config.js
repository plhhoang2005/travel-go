/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cambria', '"Times New Roman"', '"Noto Serif"', 'serif'],
      },
      colors: {
        ocean: { 50: '#EEF8FB', 100: '#DDF3FA', 200: '#BDE7F2', 300: '#8FD3E8', 400: '#5CB8D1', 500: '#3B9DB9', 600: '#287E9A', 700: '#23677D', 800: '#1F5262', 900: '#17333D' },
        sun: { 50: '#FFF9ED', 100: '#FFF1D2', 200: '#FFE2A9', 300: '#FFC978', 400: '#F5A85B' },
        blue: { 50: '#EEF8FB', 100: '#DDF3FA', 200: '#BDE7F2', 300: '#8FD3E8', 400: '#5CB8D1', 500: '#3B9DB9', 600: '#287E9A', 700: '#23677D', 800: '#1F5262', 900: '#17333D' },
        slate: { 50: '#F7FBFC', 100: '#EFF6F7', 200: '#DDE9EB', 300: '#BED0D4', 400: '#8FA6AA', 500: '#667C81', 600: '#53696E', 700: '#3B5257', 800: '#293F45', 900: '#17333D' },
      },
      boxShadow: { soft: '0 14px 40px rgba(23, 51, 61, 0.08)', raised: '0 22px 55px rgba(23, 51, 61, 0.12)' },
    },
  },
  plugins: [],
};
