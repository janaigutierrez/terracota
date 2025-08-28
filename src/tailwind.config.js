/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                terracotta: {
                    50: '#FDF5F3',
                    100: '#FCE8E3',
                    200: '#F9D3CC',
                    300: '#F4B5AA',
                    400: '#EC8B7A',
                    500: '#E4A373', // Color principal
                    600: '#D4855A',
                    700: '#B8673D',
                    800: '#974F2F',
                    900: '#7C4228',
                },
                cream: {
                    50: '#FFFDF7',
                    100: '#FEF9E7',
                    200: '#FDF2CC',
                    300: '#FBE8A3',
                    400: '#F7D978',
                    500: '#F2CC5F',
                    600: '#E6B547',
                    700: '#D1993D',
                    800: '#B07B37',
                    900: '#926532',
                },
                clay: {
                    50: '#F7F3F0',
                    100: '#EDE3DC',
                    200: '#DBC5B7',
                    300: '#C8A18C',
                    400: '#B17D63',
                    500: '#8B5A3C', // Terracota fosc
                    600: '#7A4A2F',
                    700: '#663D26',
                    800: '#4F2F1E',
                    900: '#3D2318',
                }
            },
            fontFamily: {
                'display': ['Inter', 'system-ui', 'sans-serif'],
                'body': ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(60px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            }
        },
    },
    plugins: [],
}