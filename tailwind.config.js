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
        accent: '#154EC1',
        // Light mode colors
        'background-light': '#F4F8FA',
        'background-card': '#FFFFFF',
        'text-main': '#262824',
        'text-secondary': '#7F828B',
        'border-soft': '#DEE5F2',
        // Dark mode colors
        'background-dark': '#0f172a',
        'card-dark': '#1e293b',
        'sidebar-dark': '#020617',
        'surface-dark': '#1e293b',
        'accent-dark': '#334155'
      },
      fontFamily: {
        display: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
