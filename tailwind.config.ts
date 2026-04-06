import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        bg: {
          DEFAULT: '#0B0F14', // charcoal / near-black
          light: '#111820',    // slightly lighter charcoal
          50: '#1a2030',
          100: '#151b28',
        },
        accent: {
          blue: '#00A3FF',     // electric blue
          gold: '#D4AF37',     // muted gold
        },
        status: {
          bullish: '#00D26A',  // soft green
          bearish: '#FF4757',  // coral red
        },
        // Semantic
        surface: {
          DEFAULT: '#111820',
          elevated: '#1a2030',
        },
        // Light mode equivalents
        light: {
          bg: '#F5F7FA',
          bgLight: '#FFFFFF',
          surface: '#FFFFFF',
          text: '#0B0F14',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'price-up': 'priceUp 0.3s ease-out',
        'price-down': 'priceDown 0.3s ease-out',
      },
      keyframes: {
        priceUp: {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(0, 210, 106, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        priceDown: {
          '0%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(255, 71, 87, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
}

export default config
