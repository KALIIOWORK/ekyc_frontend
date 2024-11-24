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
      aspectRatio: {
        '9/16': 9 / 16, // Portrait orientation
        '16/9': 16 / 9, // Landscape orientation (optional)
      },
      animation: {
        ripple: 'ripple 1s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': {
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(0.01)',
          },
          '100%': {
            top: '50%',
            left: '50%',
            width: '20rem',
            height: '20rem',
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

