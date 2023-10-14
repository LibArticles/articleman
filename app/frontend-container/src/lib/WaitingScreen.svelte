<script lang="ts">
	import Logo from "./Logo.svelte";

	export let showHighlight = false;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	const submit = () => {
		dispatch("submit");
	};

	// on keydown, send a message to the parent component
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "d") {
			event.preventDefault();
			document.removeEventListener("keydown", handleKeyDown);
			submit();
		}
	}

	document.addEventListener("keydown", handleKeyDown);
</script>

<div class="waiter-screen" class:show-highlight={showHighlight}>
	<div class="logo">
		<Logo />
	</div>
	<!-- <p>blue linden software</p> -->
</div>

<style lang="scss">
	

	.waiter-screen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		--logo-size: min(70vw, 70vh);
		
		

		.logo {
			width: var(--logo-size);
			height: var(--logo-size);
			transition: color 0.4s, transform 0.4s;
		}
		// p {
		// 	font-size: 2em;
		// 	font-weight: semibold;
		// }

		&:not(.show-highlight) .logo {
			color: #222;
			transform: scale(0.8) rotate(5deg);
		}

		&.show-highlight .logo {
			color: white;
			transform: scale(1) rotate(0deg);
		}
	}

</style>
