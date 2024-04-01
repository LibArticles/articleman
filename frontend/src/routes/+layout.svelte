<script lang="ts">
	import '../app.css';
	import NavMenu from '../lib/NavMenu/NavMenu.svelte';
	import { setContext } from 'svelte';
	import i18n, { lpn } from '$lib/i18n';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';


	$: isInProfileSwitchMode = $page.url.pathname === '/switch';

	setContext('i18n', i18n);
</script>

<div class="bg-caramel-50 text-caramel-950 h-full max-w-full desktop:flex-row flex">
	<NavMenu {isInProfileSwitchMode} />
	<div
		class="w-full h-full transition-colors {!isInProfileSwitchMode
			? 'bg-caramel-50'
			: 'bg-caramel-950'}"
	>
		<header class="bg-transparent">
			<h1
				class="text-4xl pt-4 pl-4 font-bold {!isInProfileSwitchMode
					? 'text-caramel-700'
					: 'text-caramel-50'} font-serif font-soft-100 transition-colors"
			>
				{#await lpn($page.url.pathname) then locPathNm}
					{locPathNm}
				{/await}
			</h1>
		</header>
		<main class="max-h-full m-0 transition-colors rounded-none p-4">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
</style>
