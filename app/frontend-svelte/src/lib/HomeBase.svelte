<script lang="ts">
	function toggleExpand() {
		
	}

	let state: 'toast' | 'open' | 'closed' | 'hidden' = 'closed';
</script>

<div class="home-base {state}">
	<button class="home-base-toggler" on:click={toggleExpand} >
		<div class="icon">
			
		</div>
	</button>
</div>