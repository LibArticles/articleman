export namespace CMD {
	/**
	 * Commands to send to the frontend via Socketeer
	 */
	namespace Frontend {
		enum Onboarding {
			/**
			 * Trigger an onboarding prompt
			 */
			trigger = "triggerOnboarding",
		}
		enum Limit {
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
		}
		enum Remote {
			/**
			 * Force close the frontend's container
			 */
			forceQuit = "forceQuit",
			/**
			 * Navigate to a specific page
			 */
			navigate = "navigate",
			/**
			 * Trigger a prompt to the user with specified actions
			 */
			prompt = "prompt",
		}
		enum Request {
			/**
			 * Check to see if the user is active (like an Are You Still Watching notification)
			 */
			isUserActive = "isUserActive",
		}
		enum Status {
			/**
			 * Trigger a status message or a toast
			 */
			triggerStatusMessage = "triggerStatusMessage",

			/**
			 * Trigger an error message
			 */
			triggerError = "triggerError",
		}
		enum Security {
			/**
			 * Destroy the session and prevent Articleman from being accessed until the client is reopened
			 */
			destroySession = "destroySession",

			/**
			 * Trigger a warning message warning that the backend may have been tampered with
			 */
			triggerTamperWarning = "tamperWarning",
		}
	}

	/**
	 * Commands to send to the backend via Socketeer or the Comms service
	 */
	namespace Backend {
		
	}
}


type Values<T> = T[keyof T];

type UnionEnumType<T> = T extends (infer U)
  ? U extends any
    ? Values<U>
    : never
  : never;


export type FrontendCommand = UnionEnumType<typeof CMD.Frontend[keyof typeof CMD.Frontend]>;


