/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kibana-inspired dark theme colors
        kibana: {
          bg: '#000000',
          card: '#1a1a1a',
          border: '#2d2d2d',
          text: '#d4d4d4',
          textSecondary: '#8c8c8c',
          accent: '#0064ff',
          accentHover: '#0052cc',
          success: '#00a69c',
          warning: '#f0c440',
          danger: '#ff6b6b',
        }
      }
    },
  },
  plugins: [],
}
