import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Avenir Next"', '"Segoe UI"', 'sans-serif'],
        body: ['"Manrope"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 22px 90px rgba(78, 116, 255, 0.28)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(125, 148, 255, 0.24), transparent 30%), radial-gradient(circle at bottom right, rgba(89, 208, 197, 0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
