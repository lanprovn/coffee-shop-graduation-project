/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      // Highland Coffee Color Palette
      primary: {
        DEFAULT: '#C41E3A', // Highland Red
        50: '#fdf2f2',
        100: '#fce7e7',
        200: '#f9d1d1',
        300: '#f4a8a8',
        400: '#ed7171',
        500: '#C41E3A', // Main Highland Red
        600: '#b91c37',
        700: '#9c1a32',
        800: '#821a2d',
        900: '#6e1a29',
        950: '#3b0a14',
      },
      secondary: {
        DEFAULT: '#8B4513', // Coffee Brown
        50: '#fdf8f6',
        100: '#f2e8e5',
        200: '#eaddd7',
        300: '#e0cec7',
        400: '#d2bab0',
        500: '#8B4513', // Coffee Brown
        600: '#7c3a0f',
        700: '#6b2f0b',
        800: '#5a2509',
        900: '#4a1e07',
        950: '#2d1204',
      },
      accent: {
        DEFAULT: '#D4AF37', // Gold
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#D4AF37', // Gold
        500: '#ca8a04',
        600: '#a16207',
        700: '#854d0e',
        800: '#713f12',
        900: '#633c14',
        950: '#3d2408',
      },
      cream: {
        DEFAULT: '#F5F5DC', // Cream
        50: '#fefefe',
        100: '#fdfdfd',
        200: '#fafafa',
        300: '#f7f7f7',
        400: '#F5F5DC', // Cream
        500: '#e5e5e5',
        600: '#d4d4d4',
        700: '#a3a3a3',
        800: '#737373',
        900: '#525252',
        950: '#404040',
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    extend: {},
  },
  plugins: [],
};
