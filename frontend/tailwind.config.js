/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0E14',
        surface: '#12171F',
        surfaceHover: '#171D27',
        border: '#232B38',
        cyan: '#00D9FF',
        violet: '#3B82F6',
        ink: '#F5F7FA',
        muted: '#8B95A5',
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
