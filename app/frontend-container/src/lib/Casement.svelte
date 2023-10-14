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
	import { createEventDispatcher, onMount } from "svelte";

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

	onMount(() => {
		let iFrame: HTMLIFrameElement = document.createElement("iframe");
		let container: HTMLElement =
			document.getElementById("casement-container")!;
		iFrame.style.display = "none";
		iFrame.src = url;
		container.appendChild(iFrame);

		const outside = new Outside({
			iFrame,
			pageUrl: url,
			name: "socketeer",
			handlers: [],
			debug: true,
			onReady: () => {
				submit();
				iFrame.style.display = "block";
			},
		});

		outside.on("socketeerMessage", handleOutgoing);
	});
</script>

<div id="casement-container" />
