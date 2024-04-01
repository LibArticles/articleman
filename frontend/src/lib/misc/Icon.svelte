<script lang="ts">
	import type * as GoogleIconNames from 'google-icon-names';
	import MaterialSymbol from 'svelte-material-symbols/components/MaterialSymbol.svelte';

	export let name: string;
	export let type: 'rounded' | 'outlined' | 'sharp' = 'rounded';
	export let filled = true;
	export let weight = 700;
	export let classes = '';
</script>

<MaterialSymbol {name} {filled} {type} {weight} class={classes} />
