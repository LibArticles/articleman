<script lang="ts">
	import Icon from '$lib/misc/Icon.svelte';
	import MaterialSymbol from 'svelte-material-symbols/components/MaterialSymbol.svelte';

	import type * as GoogleIconNames from 'google-icon-names';

	export let active = false;
	export let title: string;
	export let iconName: string;
	export let href: string;

	console.log(title, active);
</script>

<a {href} class="active:scale-90 transition">
	<li
		class=" flex-col flex justify-center items-center p-2 rounded-lg aspect-square transition delay-0 duration-100 {active
			? 'bg-caramel-100 text-caramel-800 hover:bg-caramel-50'
			: 'bg-caramel-900 text-caramel-50 hover:bg-caramel-800'}"
	>
		<Icon name={iconName} classes="text-1xl" />
		<span class="text-sm font-bold">
			{title}
		</span>
	</li>
</a>
