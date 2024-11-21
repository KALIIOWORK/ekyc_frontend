/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '112': '28rem', // Custom width
      },
      height: {
        '84': '21rem', // Custom height
      },
      colors: {
        'primary-color': 'var(--primary-color)',
        'hover-color': 'var(--hover-color)',
        'text-color': 'var(--text-color)',
      },
    },
  },
  plugins: [],
}

