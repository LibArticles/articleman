import i18next, { type i18n } from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import i18nextHttpBackend, { type HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const browser = typeof window !== 'undefined';

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
		ns: ['common', 'pages', 'actions'],

		interpolation: {
			escapeValue: false // not needed for svelte as it escapes by default
		},
		backend: {
			loadPath:
				(browser ? new URL(window.location.href).origin : 'http://localhost:5173') +
				'/localization/{{lng}}/{{ns}}.json'
		}
	});

let hasLoaded = false;

function loadresources(): Promise<i18n> {
	return new Promise((resolve) => {
		if (hasLoaded) {
			return resolve(i18nextInstance as i18n);
		}
		hasLoaded = true;
		i18nextInstance.on('initialized', () => {
			hasLoaded = true;
			resolve(i18nextInstance as i18n);
		});
		// i18nextInstance.on('failedLoading', (err) => {
		// 	reject(err);
		// })
	});
}

export default loadresources();

export async function lpn(path: string, contextSettings?: any) {
	const resources = await loadresources();

	let translation = '';

	if (path === '/') {
		translation = resources.t('pages:overview', contextSettings) as string;
	} else translation = resources.t(path.replace('/', ''), contextSettings) as string;

	console.info('lpn', path, translation);

	return translation;
}
