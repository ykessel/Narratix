import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cada color usa CSS variables con soporte de opacidad (<alpha-value>).
        // Los valores RGB se definen en globals.css bajo :root y [data-theme="dark"].
        background:    'rgb(var(--color-background)    / <alpha-value>)',
        surface:       'rgb(var(--color-surface)       / <alpha-value>)',
        border:        'rgb(var(--color-border)        / <alpha-value>)',
        text:          'rgb(var(--color-text)          / <alpha-value>)',
        muted:         'rgb(var(--color-muted)         / <alpha-value>)',
        accent:        'rgb(var(--color-accent)        / <alpha-value>)',
        'accent-light':'rgb(var(--color-accent-light)  / <alpha-value>)',
        'accent-dark': 'rgb(var(--color-accent-dark)   / <alpha-value>)',
        'code-bg':     'rgb(var(--color-code-bg)       / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body:    ['var(--font-lora)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'monospace'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            // Usar CSS variables directamente para que prose responda al dark mode
            '--tw-prose-body':          'rgb(var(--color-text))',
            '--tw-prose-headings':      'rgb(var(--color-text))',
            '--tw-prose-links':         'rgb(var(--color-accent))',
            '--tw-prose-bold':          'rgb(var(--color-text))',
            '--tw-prose-code':          'rgb(var(--color-text))',
            '--tw-prose-pre-bg':        'rgb(var(--color-code-bg))',
            '--tw-prose-quotes':        'rgb(var(--color-muted))',
            '--tw-prose-quote-borders': 'rgb(var(--color-accent))',
            '--tw-prose-hr':            'rgb(var(--color-border))',
            '--tw-prose-th-borders':    'rgb(var(--color-border))',
            '--tw-prose-td-borders':    'rgb(var(--color-border))',
            fontFamily:  'var(--font-lora), Georgia, serif',
            fontSize:    '1.125rem',
            lineHeight:  '1.8',
            maxWidth:    'none',
            'h2, h3, h4': {
              fontFamily:      'var(--font-space-grotesk), sans-serif',
              fontWeight:      '700',
              scrollMarginTop: '6rem',
            },
            a: {
              color:                    'rgb(var(--color-accent))',
              textDecorationThickness:  '1px',
            },
            // Inline code — colores adaptativos via CSS variable (definidas en globals.css)
            code: {
              fontFamily:      'var(--font-jetbrains-mono), monospace',
              fontSize:        '0.875em',
              backgroundColor: 'rgb(var(--color-code-inline-bg))',
              color:           'rgb(var(--color-code-inline-text))',
              padding:         '0.15em 0.4em',
              borderRadius:    '0.25rem',
              fontWeight:      '500',
            },
            'code::before': { content: '""' },
            'code::after':  { content: '""' },
            pre:            { padding: '0', backgroundColor: 'transparent' },
            'pre code':     { backgroundColor: 'transparent', padding: '0' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
