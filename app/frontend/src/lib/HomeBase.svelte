<script lang="ts">
	import { localize } from '@nubolab-ffwd/svelte-fluent';
	import Arrow from './icons/arrow.svelte';
	import AppMenu from './home-base/AppMenu.svelte';
	import Settings from './icons/settings.svelte';
	import Datasets from './icons/datasets.svelte';
	import People from './icons/people.svelte';
	import type { SvelteComponent } from 'svelte';

	let state: 'toast' | 'open' | 'closed' | 'hidden' = 'closed';

	function toggleExpand() {
		switch (state) {
			case 'toast':
				state = 'open';
				break;
			case 'open':
				state = 'closed';
				break;
			case 'closed':
				state = 'open';
				break;
			case 'hidden':
				state = 'open';
		}
	}

	let items: { route: string; icon: typeof SvelteComponent<any, any, any>; label: string }[] = [
		{
			route: '/assistant',
			icon: Settings,
			label: $localize('home-base-menu.assistant')
		},
		{
			route: '/settings',
			icon: Settings,
			label: $localize('home-base-menu.settings')
		},
		{
			route: '/people',
			icon: People,
			label: $localize('home-base-menu.people')
		},
		{
			route: '/projects',
			icon: Datasets,
			label: $localize('home-base-menu.projects')
		},
		{
			route: '/pubstatus',
			icon: Datasets,
			label: $localize('home-base-menu.pubstatus', { projectType: $localize('projects.articles') })
		}
	];
</script>

<div class="home-base {state}" aria-expanded={state === 'open'}>
	<button
		class="toggler"
		on:click={() => toggleExpand()}
		aria-label={$localize('home-base.aria-label')}
	>
		<div class="icon">
			<Arrow />
		</div>
	</button>

	<div class="content">
		<AppMenu {items} />
	</div>
</div>

<style lang="scss">
	@use './sass/variables';

	.home-base {
		border-radius: 20px 20px 0 0;
		background: variables.$bg-color-inverted;
		color: variables.$fg-color-inverted;


		&.open {
			.content {
				display: flex;
				width: 100%;
				overflow-y: scroll;
			}
			.toggler {
				height: 40px;
				.icon {
					--rotate: -90deg;
				}
			}
			min-height: 350px;
			max-height: 75vh;
		}
		&.closed {
			.content {
				display: none;
			}
			.toggler {
				.icon {
					--rotate: 90deg;
				}
			}
		}
		.toggler {
			width: 100%;
			background-color: variables.$bg-color-inverted;
			display: flex;
			border-radius: 20px 20px 0 0;
			border: 0;
			color: variables.$fg-color-inverted;
			padding: 0;
			align-items: center;
			padding: 5px;
			.icon {
				overflow: clip;
				margin-left: auto;
				margin-right: auto;
				padding-left: 10px;
				padding-right: 10px;
				height: 20px;
				width: 30px;
				background: variables.$pd-color-inverted;
				border-radius: 20px;
			}
		}
		width: 100%;
		bottom: 0;
		position: sticky;
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
