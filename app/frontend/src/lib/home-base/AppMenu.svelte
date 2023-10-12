<script lang="ts">
	import { localize } from '@nubolab-ffwd/svelte-fluent';

	import NavLink from './NavLink.svelte';
	import type { SvelteComponent } from 'svelte';

	export let items: {
		route: string;
		icon: typeof SvelteComponent<any, any, any>;
		label: string;
	}[] = [];
</script>

<div class="app-menu-container">
	<h1>{$localize('home-base-menu')}</h1>
	<nav class="app-menu">
		{#each items as item}
			<NavLink route={item.route} label={$localize(item.label)} icon={item.icon} />
		{/each}
	</nav>
</div>

<style lang="scss">
	.app-menu-container {
		width: 100%;
	}


	.app-menu {
		box-sizing: border-box;
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		justify-items: center;
		position: relative;
		row-gap: 20px;
	}
</style>
