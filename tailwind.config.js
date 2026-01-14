/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ee8c2b',
        'background-light': '#f8f7f6',
        'background-dark': '#0f172a',
        'card-dark': '#1e293b',
        'sidebar-dark': '#020617',
        'surface-dark': '#1e293b',
        'accent-dark': '#334155'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
