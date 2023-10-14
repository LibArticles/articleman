<script lang="ts">
	import Casement from "./lib/Casement.svelte";
	import CustomFrontendPrompt from "./lib/CustomFrontendPrompt.svelte";
	import WaitingScreen from "./lib/WaitingScreen.svelte";

	let showDevModeScreen = false;
	let url = "https://frontend.articleman.org";

	let shouldStart = false;
	const timeout = setTimeout(() => {
		shouldStart = true;
	}, 2000);

	let appReady = false;
</script>

{#if !showDevModeScreen}
	{#if !appReady}
		<WaitingScreen
			showHighlight={shouldStart}
			on:submit={() => {
				showDevModeScreen = true;
				clearTimeout(timeout);
			}}
		/>
	{/if}
	{#if shouldStart}
		<Casement {url} on:submit={() => (appReady = true)} />
	{/if}
{:else}
	<CustomFrontendPrompt
		bind:url
		on:submit={() => {
			showDevModeScreen = false;
			shouldStart = true;
		}}
	/>
{/if}
