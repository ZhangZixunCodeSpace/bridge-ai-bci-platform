/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        bridge: {
          dark: '#0c1445',
          blue: '#1e3a8a',
          amber: '#fbbf24',
          orange: '#f59e0b',
          emerald: '#047857',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'neural-pulse': 'neuralPulse 2s ease-in-out infinite',
        'bci-signal': 'bciSignal 3s linear infinite',
        'star-twinkle': 'starTwinkle 6s infinite ease-in-out',
      },
      keyframes: {
        neuralPulse: {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
        bciSignal: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}