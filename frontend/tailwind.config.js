/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: 'var(--color-bg)',
          surface: 'var(--color-surface-midnight)',
          card: 'var(--color-surface-card)',
          cardHover: 'var(--color-surface-hover)',
          primary: 'var(--color-primary)',
          primaryDark: 'var(--color-primary-dark)',
          primaryLight: 'var(--color-primary-light)',
          secondary: 'var(--color-secondary)',
          secondaryLight: 'var(--color-secondary-light)',
          accent: 'var(--color-accent)',
          accentLight: 'var(--color-accent-light)',
          warning: 'var(--color-status-warning)',
          critical: 'var(--color-status-danger)',
          border: 'var(--color-border-default)',
          borderSubtle: 'var(--color-border-subtle)',
          inputBg: 'var(--color-input-bg)',
          textPrimary: 'var(--color-text-primary)',
          textSecondary: 'var(--color-text-secondary)',
        }
      },
      screens: {
        'xs': '420px',
      }
    },
  },
  plugins: [],
}
