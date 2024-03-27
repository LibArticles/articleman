<script lang="ts">
	export let pubName: string = 'Oxide app demo';
	export let productName: string = 'Articleman';
	import { msHome, msPeople, msNewspaper, msBook } from 'google-icon-names';
	import AppTile from './AppTile.svelte';
	import i18next from '$lib/i18n';

	import { page } from '$app/stores';

	async function load() {
		const i18n = await i18next;
		let menuItems: Array<{ title: string; href: string; icon: string }> = [
			{
				title: i18n.t('pages:home'),
				href: '/',
				icon: msHome
			},
			{
				title: i18n.t('pages:people'),
				href: '/people',
				icon: msPeople
			},
			{
				title: i18n.t('pages:issue'),
				href: '/issue',
				icon: msNewspaper
			}
		];
		console.log('init', i18n.isInitialized)
		return menuItems;
	}

	$: currentPath = window.location.pathname;
</script>

<nav class="bg-caramel-950 text-caramel-50 w-70 p-4">
	<h1 class="text-xl font-black mt-2 text-wrap">{productName}</h1>
	<h2 class="text-base text-caramel-350 font-bold">{pubName}</h2>
	<ul class="grid grid-flow-row grid-cols-3 gap-4 mt-6">
		{#await load() then localized}
			{#each localized as item}
				<AppTile
					title={item.title}
					iconName={item.icon}
					href={item.href}
					active={$page.url.pathname == item.href}
				/>
			{/each}
		{/await}
	</ul>
</nav>
