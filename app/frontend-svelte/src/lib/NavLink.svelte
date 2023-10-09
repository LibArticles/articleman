<script lang="ts">
	import { page } from '$app/stores';
	let route: string;
	let icon: string;
	let label: string;

	$: currentRoute = $page.route.id;
</script>

<div class="nav-link" class:active={currentRoute === route}>
	<a href={route}>
		<div class="icon">
			{@html icon}
		</div>
		<span class="label">{label}</span>
	</a>
</div>