export namespace CMD {
	/**
	 * Commands to send to the frontend via Socketeer
	 */
	export namespace Frontend {
		export const enum Onboarding {
			/**
			 * Trigger an onboarding prompt
			 */
			trigger = "triggerOnboarding",
		}
		export const enum Limit {
			/**
			 * Trigger a rate limit notification on the frontend
			 */
			startRateLimit = "triggerRateLimit",
			/**
			 * End the rate limit notification
			 */
			endRateLimit = "endRateLimit",
			/**
			 * Freeze the frontend and grey it out
			 */
			freeze = "freeze",
			/**
			 * Unfreeze the frontend
			 */
			unfreeze = "unfreeze",
		}
		export const enum Remote {
			/**
			 * Force close the frontend's container
			 */
			forceQuit = "forceQuit",
			/**
			 * Navigate to a specific page
			 */
			navigate = "navigate",
			/**
			 * Trigger a prompt to the user with an input field
			 */
			promptInput = "inputPrompt",
			/**
			 * Trigger a prompt to the user with specific, localized buttons
			 */
			buttonPrompt = "buttonPrompt",
			/**
			 * Trigger a prompt to the user with specific, localized options
			 */
			optionPrompt = "optionPrompt",
		}
		export const enum Request {
			/**
			 * Check to see if the user is active (like an Are You Still Watching notification)
			 */
			isUserActive = "isUserActive",
		}
		export const enum Status {
			/**
			 * Trigger a status message or a toast
			 */
			triggerStatusMessage = "triggerStatusMessage",

			/**
			 * Trigger an error message
			 */
			triggerError = "triggerError",
		}
		export const enum Security {
			/**
			 * Destroy the session and prevent Articleman from being accessed until the client is reopened
			 */
			destroySession = "destroySession",

			/**
			 * Trigger a warning message warning that the backend may have been tampered with
			 */
			triggerTamperWarning = "tamperWarning",
		}
		export const enum Testing {}
	}

	/**
	 * Commands to send to the backend via Socketeer or the Comms service
	 */
	export namespace Backend {
		export const enum Socketeer {
			status = "checkSocketeer",
		}
	}
}

export interface FrontendCommandFormats {
	[CMD.Frontend.Onboarding.trigger]: [];
	[CMD.Frontend.Limit.startRateLimit]: [];
	[CMD.Frontend.Limit.endRateLimit]: [];
	[CMD.Frontend.Limit.freeze]: [];
	[CMD.Frontend.Limit.unfreeze]: [];
	[CMD.Frontend.Remote.forceQuit]: [warnTime?: number];
	[CMD.Frontend.Remote.navigate]: [page: string];
	[CMD.Frontend.Remote.promptInput]: [prompt: {
		promptId: string,
		type: 'number' | 'string',
	}];
	[CMD.Frontend.Remote.buttonPrompt]: [prompt: {
		promptId: string,
		primaryButtons: string[],
		secondaryButtons: string[],
		showAs: 'notification' | 'modal',
		allowCancel: boolean,
		/**
		 * localized cancel message
		 */
		cancelMessage?: string,
	}]
	[CMD.Frontend.Request.isUserActive]: [];
	[CMD.Frontend.Status.triggerStatusMessage]: [message: string];
	[CMD.Frontend.Security.destroySession]: [];
	[CMD.Frontend.Security.triggerTamperWarning]: [];
}



type Values<T> = T[keyof T];

type UnionEnumType<T> = T extends infer U
	? U extends any
		? Values<U>
		: never
	: never;

export type FrontendCommand = UnionEnumType<
	(typeof CMD.Frontend)[keyof typeof CMD.Frontend]
>;

export type BackendCommand = UnionEnumType<
	(typeof CMD.Backend)[keyof typeof CMD.Backend]
>;
