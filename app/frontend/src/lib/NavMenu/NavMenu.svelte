<script lang="ts">
	export let pubName: string = 'Oxide app demo';
	export let productName: string = 'Articleman';
	import { msHome, msPeople, msNewspaper, msChecklist } from 'google-icon-names';
	import { createAvatar, melt } from '@melt-ui/svelte';
	import AppTile from './AppTile.svelte';
	import i18n from '$lib/i18n';

	import GoBackHome from './GoBackHome.svelte';

	import { fade } from 'svelte/transition';

	export let isInProfileSwitchMode = false;

	import { page } from '$app/stores';
	import Logo from '$lib/images/Logo.svelte';

	let menuItems: Array<{ title: string; href: string; icon: string }> = [
		{
			title: 'pages:home',
			href: '/',
			icon: msHome
		},
		{
			title: 'pages:people',
			href: '/people',
			icon: msPeople
		},
		{
			title: 'pages:issue',
			href: '/issue',
			icon: msNewspaper
		},
		{
			title: 'pages:work',
			href: '/work',
			icon: msChecklist
		}
	];

	const {
		elements: { image: userImage, fallback: userFallback }
	} = createAvatar({
		src: 'https://bluelinden.art/favicon.ico'
	});
</script>

{#await i18n then i18n}
	<nav class="bg-caramel-950 w-[24rem] text-caramel-50 {isInProfileSwitchMode ? '' : ''}">
		<a
			class="flex flex-col items-start gap-4 justify-between transition-all active:scale-90 active:rounded-lg hover:bg-caramel-900 w-auto p-4"
			href={!isInProfileSwitchMode ? '/switch' : '/'}
		>
			<div
				class="flex flex-row items-center gap-4 justify-between transition-all h-16 hover:bg-caramel-900 w-full"
			>
				<div class="flex flex-col text-left">
					<h1 class="text-xl font-black text-wrap">{productName}</h1>
					<h2 transition:fade={{ duration: 100 }} class="text-base text-caramel-350 font-bold">
						{!isInProfileSwitchMode ? pubName : i18n.t('common:credit_short')}
					</h2>
				</div>
				<div class="h-12 w-12 overflow-clip">
					{#if !isInProfileSwitchMode}
						<img use:melt={$userImage} alt="user Blue Linden" class="rounded-full" />
						<span use:melt={$userFallback} class="text-xs font-bold rounded-full">bl</span>
					{:else}
						<div class="text-caramel-50 h-12 w-12">
							<Logo classes="w-12 h-12 active:animate-spin" />
						</div>
					{/if}
				</div>
			</div>
			{#if isInProfileSwitchMode}
				<GoBackHome />
			{/if}
		</a>

		{#if !isInProfileSwitchMode}
			<ul
				transition:fade={{ duration: 100 }}
				class="grid grid-flow-row grid-cols-3 gap-4 transition-all p-4"
			>
				{#each menuItems as item}
					<AppTile
						title={i18n.t(item.title)}
						iconName={item.icon}
						href={item.href}
						active={$page.url.pathname == item.href}
					/>
				{/each}
			</ul>
		{/if}
	</nav>
{/await}
