/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a202c', // Dark blue/charcoal for main backgrounds
        secondary: '#2d3748', // Slightly lighter dark for cards/sections
        accent: '#4f46e5', // Indigo/Royal Blue for accents, buttons, highlights
        neutral: '#e2e8f0', // Light gray for subtle backgrounds
        text_primary: '#f8fafc', // Off-white for main text on dark backgrounds
        text_secondary: '#cbd5e1', // Lighter gray for secondary text
        success: '#10b981', // Green for positive feedback
        warning: '#f59e0b', // Amber for warnings
        danger: '#ef4444', // Red for errors
      },
    },
  },
  plugins: [],
};
