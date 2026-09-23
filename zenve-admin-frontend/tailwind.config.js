/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12151C',
          soft: '#5B6472',
          faint: '#949CA8',
        },
        paper: '#F7F8FA',
        surface: '#FFFFFF',
        surface2: '#F1F2F5',
        line: '#E5E7EB',
        // Primary UI color — buttons, active nav, links, focus states
        admin: {
          DEFAULT: '#4338CA',
          dark: '#362CA0',
          light: 'rgba(67,56,202,0.08)',
        },
        // Approved / success semantics
        brand: {
          DEFAULT: '#0E9166',
          dark: '#0B7550',
          light: 'rgba(14,145,102,0.08)',
        },
        // Pending semantics
        amber: {
          DEFAULT: '#B45309',
          light: 'rgba(180,83,9,0.08)',
        },
        // Rejected / error semantics
        danger: {
          DEFAULT: '#DC2626',
          light: 'rgba(220,38,38,0.08)',
        },
        species: {
          dog: '#6C5CE7',
          dogLight: 'rgba(108,92,231,0.12)',
          cat: '#D6437E',
          catLight: 'rgba(214,67,126,0.12)',
          cattle: '#B4791E',
          cattleLight: 'rgba(180,121,30,0.12)',
          rabbit: '#1D8FC4',
          rabbitLight: 'rgba(29,143,196,0.12)',
          parrot: '#159A5B',
          parrotLight: 'rgba(21,154,91,0.12)',
        },
        zenve: {
          sidebarFrom: '#1F255E',
          sidebarTo: '#141842',
          activeNav: '#414DE5',
          cyan: '#00DFD8',
          bg: '#F5F7FC',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        script: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16,24,40,0.04)',
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.05)',
        pop: '0 12px 24px -8px rgba(16,24,40,0.16), 0 4px 10px -6px rgba(16,24,40,0.08)',
        glow: '0 0 0 4px rgba(67,56,202,0.10)',
      },
      borderRadius: {
        xl2: '12px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'modal-in': 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
