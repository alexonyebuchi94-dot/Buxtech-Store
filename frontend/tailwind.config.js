/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surfaceHover: 'rgb(var(--c-surface-hover) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        cyan: 'rgb(var(--c-cyan) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 217, 255, 0.25)',
        glowStrong: '0 0 40px rgba(0, 217, 255, 0.4)',
      },
      backgroundImage: {
        'grad-glow': 'radial-gradient(circle at 50% 0%, rgba(0,217,255,0.15), transparent 60%)',
        'grad-line': 'linear-gradient(90deg, #00D9FF, #3B82F6)',
      },
    },
  },
  plugins: [],
}
