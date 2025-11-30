/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                // Using Outfit as a local replacement for Product Sans/Google Sans
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    container: 'var(--color-primary-container)',
                    onContainer: 'var(--color-on-primary-container)',
                    foreground: 'var(--color-primary-foreground)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    container: 'var(--color-secondary-container)',
                    onContainer: 'var(--color-on-secondary-container)',
                },
                tertiary: {
                    DEFAULT: 'var(--color-tertiary)',
                    container: 'var(--color-tertiary-container)',
                    onContainer: 'var(--color-on-tertiary-container)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                    container: 'var(--color-error-container)',
                    onContainer: 'var(--color-on-error-container)',
                },
                success: {
                    DEFAULT: 'var(--color-success)',
                    container: 'var(--color-success-container)',
                    onContainer: 'var(--color-success-on-container)',
                },
                warning: {
                    DEFAULT: 'var(--color-warning)',
                    container: 'var(--color-warning-container)',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    dim: 'var(--color-surface-dim)',
                    bright: 'var(--color-surface-bright)',
                    container: {
                        lowest: 'var(--color-surface-container-lowest)',
                        low: 'var(--color-surface-container-low)',
                        DEFAULT: 'var(--color-surface-container)',
                        high: 'var(--color-surface-container-high)',
                        highest: 'var(--color-surface-container-highest)',
                    },
                    on: 'var(--color-surface-on)',
                    variant: 'var(--color-surface-variant)',
                    onVariant: 'var(--color-surface-on-variant)',
                },
                outline: {
                    DEFAULT: 'var(--color-outline)',
                    variant: 'var(--color-outline-variant)',
                },
                background: 'var(--color-background)',
                google: {
                    blue: '#4285f4',
                    red: '#ea4335',
                    yellow: '#fbbc04',
                    green: '#34a853',
                }
            },
            borderRadius: {
                'm3-sm': '8px',
                'm3': '12px',
                'm3-md': '16px',
                'm3-lg': '20px',
                'm3-xl': '28px',
                'm3-full': '9999px',
            },
            boxShadow: {
                'm3-1': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
                'm3-2': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)',
                'm3-3': '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
                'm3-4': '0 2px 3px 0 rgba(60, 64, 67, 0.3), 0 6px 10px 4px rgba(60, 64, 67, 0.15)',
            },
            animation: {
                'fade-in': 'm3-fade-in 0.4s cubic-bezier(0.2, 0.0, 0, 1.0) forwards',
                'slide-up': 'm3-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'scale-in': 'm3-scale-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'pop': 'm3-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        }
    }
}