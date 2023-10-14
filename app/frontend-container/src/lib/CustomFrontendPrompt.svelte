<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let url = "https://frontend.articleman.org";

	const dispatch = createEventDispatcher();

	const submit = () => {
		dispatch("submit");
	};

	const checkKeydown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault();
			submit();
		}
	}
</script>

<div id="url-input-container">
	<h1>Development Mode</h1>
	<p>
		Welcome to the Articleman developer mode! This mode allows you to run a custom frontend in the Articleman container, granting full access to backend APIs. Only run code that you trust here!</p>
	<label for="url-input">Frontend URL</label>
	<input type="text" bind:value={url} placeholder="https://frontend.articleman.org" on:keydown={checkKeydown}/>
	<button on:click={submit}>Load</button>
</div>

<style lang="scss">


	#url-input-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: black;
		input, button {
			background: #222;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px;
			margin: 10px;
			font-size: 1.2em;
			height: 2em;
		}

		button {
			cursor: pointer;
		}

		label {
			margin-left: 15px;
			margin-right: 15px;
		}

		h1, p {
			text-align: center;
			margin: 10px;
		}
	}
</style>
