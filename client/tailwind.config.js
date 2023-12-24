/** @type {import('index').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}', './public/index.html'],
    theme: {
        fontFamily: {
            main: ['Poppins', 'sans-serif'],
        },
        extend: {
            width: {
                main: '1220px',
            },
            gridRow: {
                'span-7': 'span 7 / span 7',
            },
            gridTemplateRows: {
                '10': 'repeat(10, minmax(0, 1fr))',
            },
            backgroundColor: {
                main: '#ee3131',
            },
            color: {
                main: '#ee3131',
            },
            textColor: {
                main: '#ee3131',
            },
            borderColor: {
                main: '#ee3131',
            },
            keyframes: {
                'slide-top': {
                    '0%': {
                        '-webkit-transform': 'translateY(40px)',
                        transform: 'translateY(20px);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateY(0px)',
                        transform: 'translateY(0px);'
                    }
                },
                'slide-len': {
                    '0%': {
                        '-webkit-transform': 'translateY(0px)',
                        transform: 'translateY(0px);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateY(-5px)',
                        transform: 'translateY(-3px);'
                    }
                },
                'slide-right': {
                    '0%': {
                        '-webkit-transform': 'translateX(-100px)',
                        transform: 'translateX(-100px);',
                    },
                    '100%': {
                        '-webkit-transform': 'translateX(0px)',
                        transform: 'translateX(0px);'
                    }
                },
                'scale-up': {
                    '0%': {
                        '-webkit-transform': 'scale(0.5)',
                        transform: 'scale(0.5);',
                    },
                    '100%': {
                        '-webkit-transform': 'scale(1)',
                        transform: 'scale(1);'
                    }
                },
            }
        },
        flex: {
            '1': '1 1 0%',
            '2': '2 2 0%',
            '3': '3 3 0%',
            '4': '4 4 0%',
            '5': '5 5 0%',
            '6': '6 6 0%',
            '7': '7 7 0%',
            '8': '8 8 0%',
        },
        animation: {
            'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            'slide-len': 'slide-len 0.3s linear both',
            'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            'scale-up': 'scale-up 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',

        }
    },
    plugins: [
        "@tailwindcss/line-clamp",
        require("@tailwindcss/forms")({
            strategy: 'class'
        })
    ]
}

