declare const google: {
	script: GoogleAppsScriptClient;
};

interface GoogleAppsScriptClient {
	run: {
		// Set failure handler
		withFailureHandler(
			handler: (error: Error, userObject?: any) => void
		): ScriptRunner;

		// Set success handler
		withSuccessHandler<T>(
			handler: (returnValue: T, userObject?: any) => void
		): ScriptRunner;

		// Set user object
		withUserObject(userObject: any): ScriptRunner;
	};

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
}
