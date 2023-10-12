<script lang="ts">
	import { page } from '$app/stores';
	import type { SvelteComponent } from 'svelte';

	export let route: string;
	export let icon: typeof SvelteComponent;
	export let label: string;

	$: currentRoute = $page.route.id;
</script>

<div class="nav-link" class:active={currentRoute === route}>
	<a href={route}>
		<div class="icon">
			<svelte:component this={icon} />
		</div>
		<span class="label">{label}</span>
	</a>
</div>

<style lang="scss">
	@use '../sass/variables';

	.nav-link {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		justify-self: center;
		margin-left: auto;
		margin-right: auto;
	}

	.nav-link a {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: variables.$fg-color-inverted;
		text-decoration: none;
		

		.icon {
			width: 40px;
			height: 40px;
			padding: 8px;
			background-color: variables.$pd-color-inverted;
			border-radius: 15px;
		}

	}
</style>
