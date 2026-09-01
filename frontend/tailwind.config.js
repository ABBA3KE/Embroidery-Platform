/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B5D3B', // primary dark green
          deep: '#0B5D3B',
          forest: '#0E7A4B', // hover / lighter accent
          shade: '#083F28', // pressed / darkest
          mist: '#EAF3EE', // light green secondary surface
          haze: '#F5F9F6', // near-white green tint for backgrounds
        },
        thread: '#C9A24B', // muted gold accent — the embroidery "thread" signature, used sparingly
        ink: '#14211B', // near-black, green-tinted body text
        paper: '#FFFFFF',
        line: '#E3EAE6', // hairline borders
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 93, 59, 0.04), 0 8px 24px -12px rgba(11, 93, 59, 0.18)',
        lift: '0 12px 32px -12px rgba(11, 93, 59, 0.28)',
      },
      backgroundImage: {
        stitch:
          'repeating-linear-gradient(90deg, currentColor 0, currentColor 6px, transparent 6px, transparent 12px)',
      },
      keyframes: {
        'draw-stitch': {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'draw-stitch': 'draw-stitch 1.2s ease forwards',
      },
    },
  },
  plugins: [],
};
