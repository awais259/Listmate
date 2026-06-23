import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#7c3aed',
        surface: '#0f0a1e',
        panel: '#181128',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(124, 58, 237, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
