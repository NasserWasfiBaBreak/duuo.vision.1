/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ford: {
          blue: '#003478',
          lightblue: '#2D96CD',
          darkblue: '#00095B',
          gray: '#6B7280',
          lightgray: '#F3F4F6',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
