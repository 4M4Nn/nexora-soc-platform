/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: '#00d4ff' },
        danger: '#ff2d55',
        warning: '#ffb800',
        success: '#00e896',
        surface: '#0a1220',
        bg: '#020509',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
