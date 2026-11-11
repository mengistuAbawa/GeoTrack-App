/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        ink: '#101828',
        muted: '#667085',
        brand: { 50: '#eef5ff', 100: '#dbeafe', 500: '#3978f6', 600: '#2563eb', 700: '#1d4ed8' }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(16, 24, 40, 0.06)',
        panel: '0 2px 10px rgba(16, 24, 40, 0.04)'
      }
    }
  },
  plugins: []
}
