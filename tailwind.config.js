import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Dark variants follow the logged-in app theme (<html data-sc-theme="dark">,
  // see src/store/theme.js). Only the app's UI kit uses dark: utilities.
  darkMode: ['variant', '&:is([data-sc-theme="dark"] *)'],
  theme: {
    extend: {
      // shadcn/ui tokens. The CSS variables are defined ONLY inside the
      // logged-in app wrapper (.sc-app in src/index.css), so these classes
      // resolve to the SoulConnect light palette there and never restyle
      // the public/marketing pages.
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        // SoulConnect named palette (same values as the --sc-* tokens)
        sc: {
          bg: '#F7F5FB', section: '#EFEBF7', card: '#FFFFFF', ink: '#171642',
          ink2: '#69677D', purple: '#8066D5', soft: '#E5DDF5', warm: '#FAF7F2', line: '#E7E3EF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
    },
  },
  plugins: [animate],
}

