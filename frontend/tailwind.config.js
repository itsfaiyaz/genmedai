/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1A8CEB',
          teal: '#00C4A7',
          green: '#31C776',
          navy: '#0F172A',
          slate: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #1A8CEB, #00C4A7, #31C776)',
      }
    },
  },
  plugins: [],
}
