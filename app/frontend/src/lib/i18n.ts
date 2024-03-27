import i18next, { type i18n } from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import i18nextHttpBackend, { type HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18nextInstance = i18next.createInstance();

i18nextInstance
	.use(LanguageDetector)
	.use(i18nextHttpBackend)
	.init<HttpBackendOptions>({
		load: 'languageOnly',
		debug: true,

		fallbackLng: 'en',
		lng: 'en',
		supportedLngs: ['en'],

		defaultNS: 'pages',
		ns: ['common', 'pages'],

		interpolation: {
			escapeValue: false // not needed for svelte as it escapes by default
		},
		backend: {
			loadPath: '/localization/{{lng}}/{{ns}}.json'
		}
	});

function loadresources(): Promise<i18n> {
	return new Promise((resolve) => {
		i18nextInstance.on('initialized', () => {
			resolve(i18nextInstance as i18n);
		});
		// i18nextInstance.on('failedLoading', (err) => {
		// 	reject(err);
		// })
	});
}

export default loadresources();
