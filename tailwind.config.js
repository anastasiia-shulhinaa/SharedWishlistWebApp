/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#f472b6',
        'primary-teal': '#2dd4bf',
        'primary-lemon': '#facc15',
        'soft-white': '#f5f5f5',
        'light-gray': '#d1d5db',
      },
    },
  },
  plugins: [],
};
