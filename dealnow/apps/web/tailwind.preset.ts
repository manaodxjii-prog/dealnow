import type { Config } from 'tailwindcss';
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: { 100: 'var(--dn-brand-100)', 500: 'var(--dn-brand-500)', 600: 'var(--dn-brand-600)' },
        ink: { 50: 'var(--dn-ink-50)', 200: 'var(--dn-ink-200)', 500: 'var(--dn-ink-500)', 700: 'var(--dn-ink-700)', 900: 'var(--dn-ink-900)' },
        ok: 'var(--dn-success)', warn: 'var(--dn-warning)', bad: 'var(--dn-danger)', info: 'var(--dn-info)',
      },
      fontFamily: { display: ['var(--dn-font-display)'], body: ['var(--dn-font-body)'] },
      borderRadius: { sm: 'var(--dn-radius-sm)', md: 'var(--dn-radius-md)', lg: 'var(--dn-radius-lg)' },
      minHeight: { tap: 'var(--dn-tap)' },
    },
  },
};
export default preset;
