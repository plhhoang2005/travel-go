/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', '"Noto Serif"', 'serif'],
      },
      colors: {
        ocean: { 50: '#EEF7F7', 100: '#DEEFEF', 200: '#C0DFE2', 300: '#95C6CC', 400: '#63A5AF', 500: '#3E8FA0', 600: '#2F7F8F', 700: '#276775', 800: '#214F59', 900: '#183238' },
        sun: { 50: '#FFF9F0', 100: '#F7ECDD', 200: '#EED8B6', 300: '#E8B56B' },
        blue: { 50: '#EEF7F7', 100: '#DEEFEF', 200: '#C0DFE2', 300: '#95C6CC', 400: '#63A5AF', 500: '#3E8FA0', 600: '#2F7F8F', 700: '#276775', 800: '#214F59', 900: '#183238' },
        slate: { 50: '#F7FAF9', 100: '#EFF4F3', 200: '#DCE6E4', 300: '#BDCFCC', 400: '#8CA29F', 500: '#667A7E', 600: '#52666A', 700: '#3B5054', 800: '#293F43', 900: '#183238' },
      },
      boxShadow: { soft: '0 12px 34px rgba(24, 50, 56, 0.08)', raised: '0 14px 30px rgba(24, 50, 56, 0.10)' },
    },
  },
  plugins: [],
};
