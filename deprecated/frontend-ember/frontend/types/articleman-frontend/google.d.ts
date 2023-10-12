import type { SocketeerMessage } from "backend/src/comms/socket";

export declare const google: {
	script: GoogleAppsScriptClient;
};

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
	withFailureHandler(handler: (error: Error, userObject?: any) => void): ScriptRunner;
	withSuccessHandler<T>(
		handler: (returnValue: T, userObject?: any) => void
	): ScriptRunner;
	withUserObject(userObject: any): ScriptRunner;
	socketeer(message?: SocketeerMessage): void;
}
