export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3DB3EA', navy: '#243C6A', neon: '#00FFB4',
        fuchsia: '#FF00E3', amber: '#FF740A',
        'bg-main': '#FFFFFF', 'bg-card': '#F8FBFE',
        border: '#E2E8F0', 'text-secondary': '#64748B', disabled: '#F1F5F9',
      },
      fontFamily: { sans: ['League Spartan', 'Inter', 'sans-serif'] },
      borderRadius: { card: '12px', btn: '6px', input: '4px' },
      boxShadow: { card: '0 1px 3px rgba(36,60,106,0.1)', md: '0 4px 12px rgba(36,60,106,0.15)' },
    },
  },
  plugins: [],
}
