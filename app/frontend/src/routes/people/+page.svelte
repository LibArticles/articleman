<script lang="ts">
	import i18n from '$lib/i18n';
</script>

{#await i18n then i18n}
	<h1 class="text-4xl mt-4 font-bold text-caramel-700 font-serif font-soft-100">
		{i18n.t('pages:people')}
	</h1>
{/await}
