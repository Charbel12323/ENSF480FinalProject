/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in',
        slideUp: 'slideUp 1s ease-in-out',
        pulse: 'pulse 2s infinite',
        scale: 'scale 1s infinite ease-in-out',
        continuousLoop: 'continuousLoop 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        continuousLoop: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: `translateX(-900px)` }, // Moves the full carousel
        },
      },
    },
  },
  plugins: [],
};
