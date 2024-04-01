<script lang="ts">
	import i18n from '$lib/i18n';
	import SummaryBarChart from '$lib/vis/SummaryBarChart.svelte';

	const data = {
		editStages: [
			{
				name: 'Drafted',
				percentage: 90,
				count: 9
			},
			{
				name: 'Written',
				percentage: 80,
				count: 8
			},
			{
				name: 'Edited',
				percentage: 50,
				count: 5
			},
			{
				name: 'Proofread',
				percentage: 20,
				count: 2
			}
		]
	};
</script>

{#await i18n then i18n}
	<article class="w-[500px] h-40 mt-4">
		<SummaryBarChart {data} />
	</article>
{/await}
