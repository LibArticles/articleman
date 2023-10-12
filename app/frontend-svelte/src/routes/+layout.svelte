<script>
	import { FluentBundle, FluentResource } from '@fluent/bundle';
	import { FluentProvider, Localized } from '@nubolab-ffwd/svelte-fluent';
	import translationsEn from 'l10n/en.ftl?raw';
	import HomeBase from '$lib/HomeBase.svelte';

	const resource = new FluentResource(translationsEn);
	const bundle = new FluentBundle('en');
	bundle.addResource(resource);
	const outputBundle = [bundle];
</script>

<div class="main-container">
	<FluentProvider bundles={outputBundle}>
		<main>
			<slot />
		</main>
		<HomeBase />
	</FluentProvider>
</div>

<style lang="scss">
	@use '../lib/sass/variables';
	:global(body) {
		position: relative;
		margin: 0;
		padding: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: variables.$bg-color;
		color: variables.$fg-color;
		scrollbar-gutter: stable;
		bottom: 0;
	}

	main {
		flex-grow: 1;
		position: relative;
	}
	.main-container {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: left;
		width: 100%;
		height: 100%;
	}
</style>
