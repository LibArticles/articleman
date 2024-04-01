<script lang="ts">
	export let data: {
		editStages: {
			name: string;
			percentage: number;
			count: number;
		}[];
	};
</script>

<div class="flex flex-row gap-4 w-full h-full rounded-2xl overflow-clip">
	{#each data.editStages as stage}
		<div class="flex flex-col w-full">
			<div
				class="w-full h-full bg-gradient-to-br from-caramel-75 to-caramel-100 flex flex-col-reverse overflow-clip rounded-md"
			>
				<div
					class="w-full bg-gradient-to-br from-caramel-700 to-caramel-800 rounded-t-md"
					style="height: {stage.percentage}%;"
				/>
			</div>
			<span class="text-caramel-700 font-bold text-sm font-soft-100 text-center">{stage.name}</span>
		</div>
	{/each}
</div>
