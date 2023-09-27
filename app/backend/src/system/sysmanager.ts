import { MatrixError } from "lib/surgical-engine/backends/matrix";

/**
 * Manages and calls various parts of Articleman, makes sure users don't see uncaught exceptions
 */

// TODO: implement conditional error handling and retries
export class SystemManager {
	call(callee: Function, ...args: any[]) {
		try {
			const result = callee(...args);
		} catch (error) {
			switch (true) {
				case (error instanceof TypeError):
					console.error(error);
					throw error;
				case (error instanceof RangeError):
					console.error(error);
					throw error;
				case (error instanceof ReferenceError):
					console.error(error);
					throw error;
				case (error instanceof MatrixError):
					console.error(error);
					throw error;
				default:
					console.error(error);
					throw error;

			}
		}
	}

	
}