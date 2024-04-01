import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import preprocess from 'svelte-preprocess';
import { preprocessMeltUI, sequence } from '@melt-ui/pp'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		vitePreprocess(),
		preprocessMeltUI() // add to the end!
	]),

	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),

		alias: {
			'l10n': './l10n',
		}
	},
};

export default config;
