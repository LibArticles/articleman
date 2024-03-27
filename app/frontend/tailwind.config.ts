import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,svelte}'],
	theme: {
		screens: {
			mob: '450px',
			tab: '700px',
			desktop: '1200px',
			wide: '1600px'
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			caramel: {
				50: '#FDF3D8',
				75: '#FCE5B3',
				100: '#FAD795',
				200: '#F5C77B',
				300: '#EFB767',
				350: '#E6A555',
				400: '#DA9448',
				450: '#CA813C',
				500: '#B56D32',
				600: '#995728',
				700: '#76401F',
				800: '#522A16',
				900: '#2F180D',
				950: '#180C07'
			},
			brand: {
				brown: {
					900: '#402312',
					200: '#fae093',
					100: '#fdf3d8'
				},
				orange: {
					500: '#99582a',
					700: '#e49253'
				},
				green: {
					800: '#285333'
				}
			},
		},
		fontFamily: {
			sans: ['Lexend', 'sans-serif'],
			serif: ['Fraunces', 'serif']
		},
		extend: {
			spacing: {
				'8xl': '96rem',
				'9xl': '128rem'
			},
			borderRadius: {
				'4xl': '2rem'
			}
		}
	}
} as Config;
