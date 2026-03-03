import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        // Brand palette — used for theme tokens
        brand: {
          dewalt:    '#FFBE00',
          milwaukee: '#CC0000',
          ryobi:     '#6AB023',
          makita:    '#00AEC7',
          bosch:     '#006EAF',
          ridgid:    '#F05500',
          kobalt:    '#0066CC',
          other:     '#888899',
        },
      },
      // CSS variable-driven semantic tokens
      // These are set per-theme in index.css and read here
      backgroundColor: {
        skin: {
          base:   'var(--bg)',
          card:   'var(--white)',
          accent: 'var(--accent-bg)',
        },
      },
      textColor: {
        skin: {
          base:   'var(--ink)',
          muted:  'var(--ink2)',
          faint:  'var(--ink3)',
          accent: 'var(--accent)',
        },
      },
      borderColor: {
        skin: {
          base:  'var(--border)',
          light: 'var(--border2)',
        },
      },
    },
  },
  plugins: [],
}

export default config
