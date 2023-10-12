import { sveltekit } from '@sveltejs/kit/vite';

// @ts-expect-error
import svelteFluent from '@nubolab-ffwd/svelte-fluent/rollup-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelteFluent(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: ['https']
	},
});
