/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: process.env.DARK_MODE ?? 'class',

    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './screens/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
        './*.{js,jsx,ts,tsx}',
    ],

    presets: [require('nativewind/preset')],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#d70040',
                    light: '#ff1a5e',
                    dark: '#9e002e',
                    muted: '#fce4ec',
                },

                secondary: {
                    DEFAULT: '#272727',
                    muted: 'rgba(39,39,39,0.5)',
                },

                success: { DEFAULT: '#16a34a', light: '#dcfce7' },
                warning: { DEFAULT: '#d97706', light: '#fef3c7' },
                error: { DEFAULT: '#dc2626', light: '#fee2e2' },
                info: { DEFAULT: '#0284c7', light: '#e0f2fe' },

                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f4f4f4',
                    dark: '#181719',
                },

                text: {
                    DEFAULT: '#272727',
                    muted: 'rgba(39,39,39,0.5)',
                    inverse: '#ffffff',
                    primary: '#d70040',
                },

                border: {
                    DEFAULT: '#e5e7eb',
                    muted: '#f0f0f0',
                },
            },

            fontFamily: {
                heading: ['Fredoka-Bold'],
                body: ['Fredoka-Regular'],
                mono: ['Fredoka-Regular'],
                fredoka: ['Fredoka-Regular'],
                'fredoka-medium': ['Fredoka-Medium'],
                'fredoka-semibold': ['Fredoka-SemiBold'],
                'fredoka-bold': ['Fredoka-Bold'],
                oughter: ['Oughter'],
            },

            fontWeight: {
                extrablack: '950',
            },

            fontSize: {
                '2xs': ['10px', { lineHeight: '14px' }],
            },

            borderRadius: {
                '4xl': '32px',
            },

            boxShadow: {
                'hard-1': '-2px 2px 8px 0px rgba(38,38,38,0.20)',
                'hard-2': '0px 3px 10px 0px rgba(38,38,38,0.20)',
                'hard-3': '2px 2px 8px 0px rgba(38,38,38,0.20)',
                'hard-4': '0px -3px 10px 0px rgba(38,38,38,0.20)',
                'hard-5': '0px 2px 10px 0px rgba(38,38,38,0.10)',
                'soft-1': '0px 0px 10px rgba(38,38,38,0.10)',
                'soft-2': '0px 0px 20px rgba(38,38,38,0.20)',
                'soft-3': '0px 0px 30px rgba(38,38,38,0.10)',
                'soft-4': '0px 0px 40px rgba(38,38,38,0.10)',
            },
        },
    },

    safelist: [
        {
            pattern:
                /(bg|border|text|stroke|fill)-(primary|secondary|success|warning|error|info|surface|text|border)(-DEFAULT|-light|-dark|-muted|-inverse)?/,
        },
    ],

    plugins: [],
};
