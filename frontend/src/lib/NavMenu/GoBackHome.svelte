<script lang="ts">
	import Icon from '$lib/misc/Icon.svelte';
	import { msArrowBack, msHome } from 'google-icon-names';
	import { fade } from 'svelte/transition';

	import i18n from '$lib/i18n';
</script>

{#await i18n then i18n}
	<a transition:fade={{ duration: 100, delay: 101 }} href="/" class="flex items-center gap-2 mt-4">
		<Icon name={msArrowBack} />
		<Icon name={msHome} />
		<span class="text-md font-bold">{i18n.t('actions:go_back_home')}</span>
	</a>
{/await}
