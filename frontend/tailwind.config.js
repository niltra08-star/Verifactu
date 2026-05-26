/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#060E1A',
        'bg-primary': '#0A1628',
        'bg-secondary': '#0E1D34',
        'bg-card': '#132540',
        'bg-card-hover': '#1A3052',
        'bg-input': '#0C1A2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8899B4',
        'text-tertiary': '#556580',
        'accent-gold': '#C8943E',
        'accent-gold-light': '#DEB356',
        'accent-blue': '#3B82F6',
        'accent-green': '#10B981',
      },
    },
  },
  plugins: [],
};
