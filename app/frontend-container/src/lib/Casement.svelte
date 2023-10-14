<script lang="ts" context="module">
	interface GoogleAppsScriptClient {
		run: ScriptRunner;

		host: {
			close(): void;

			editor: {
				focus(): void;
			};

			setHeight(height: number): void;

			setWidth(width: number): void;
		};
	}

	// Return type for chaining calls
	type ScriptRunner = {
		withFailureHandler(
			handler: (error: Error, userObject?: any) => void
		): ScriptRunner;
		withSuccessHandler<T>(
			handler: (returnValue: T, userObject?: any) => void
		): ScriptRunner;
		withUserObject(userObject: any): ScriptRunner;
		socketeer(type: string, message?: any): void;
	};
	declare const google: {
		script: GoogleAppsScriptClient;
	};

	interface SocketeerMessageObjectified {
		type: string;
		data: any;
	}
</script>

<script lang="ts">
	import { Outside } from "casement";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const submit = () => {
		dispatch("submit");
	};

	export let url = "https://frontend.articleman.org";

	function handleOutgoing(message?: SocketeerMessageObjectified) {
		return new Promise((resolve, reject) => {
			google.script.run
				.withSuccessHandler(resolve)
				.withFailureHandler(reject)
				.withUserObject(message?.data ?? {})
				.socketeer(message?.type ?? "checkup", message?.data ?? {});
		});
	}

	let container: HTMLDivElement | undefined = undefined;

	const outside = new Outside({
		container,
		pageUrl: url,
		name: "socketeer",
		handlers: [],
		debug: true,
		onReady: () => {
			submit();
		},
	});

	outside.on("socketeerMessage", handleOutgoing);
</script>

<div bind:this={container} id="casement-container" />
