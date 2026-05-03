import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    '~/components/**/*.{vue,ts}',
    '~/layouts/**/*.vue',
    '~/pages/**/*.vue',
    '~/composables/**/*.ts',
    '~/app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
          950: '#010309',
        },
      },
    },
  },
  plugins: [],
}
