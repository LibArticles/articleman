import type { LayoutLoad } from './$types';
import Layout from './+layout.svelte';

export const ssr = false;

export async function load({ url }: { url: URL}) {
	return {
		url: url.pathname
	};
};