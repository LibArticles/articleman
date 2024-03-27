<script>
	import '../app.css';
	import NavMenu from '../lib/NavMenu/NavMenu.svelte';
	import { setContext } from 'svelte';
	import i18n from '$lib/i18n';

	setContext('i18n', i18n);
</script>

<div class="bg-caramel-50 text-caramel-950 h-full max-w-full desktop:flex-row flex">
	<NavMenu />
	<div class="max-w-full h-full bg-caramel-950">
		<main class="bg-caramel-50 h-full m-0 w-full rounded-none p-4">
			<slot />
		</main>
	</div>
</div>

<style lang="scss">
</style>
