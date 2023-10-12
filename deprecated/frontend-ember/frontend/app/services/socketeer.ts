import Service from '@ember/service';
import type { SocketeerMessage, SocketeerMessageQueue } from 'backend/src/comms/socket';
import { CMD } from 'shared/recognized-commands';
import { google } from 'types/articleman-frontend/google.d';
import { v4 as uuidv4 } from 'uuid';





export default class SocketeerService extends Service {
	private nextCheckup: number = 0;
	private passedChecks: number = 0;
	private failedChecks: number = 0;
	private isInitialized: boolean = false;
	private checkdownCallback: ((queue: SocketeerMessageQueue) => void) | undefined = undefined;
	private checkFailedCallback: ((message: Error, failedChecks: number) => boolean) | undefined = undefined;
	private initCallback: (() => void) | undefined = undefined;

	initialize() {
		this.checkup();
	}

	onCheckdown(callback: (queue: SocketeerMessageQueue) => void) {
		this.checkdownCallback = callback;
	}

	onInit(callback: () => void) {
		this.initCallback = callback;
	}

	onCheckFailed(callback: (message: Error, failedChecks: number) => boolean) {
		this.checkFailedCallback = callback;
	}


	send(payload: SocketeerMessage) {
		if (!payload.id) {
			payload.id = uuidv4();
		}
		google.script.run.withSuccessHandler(this.checkdown).withFailureHandler(this.checkDownError).socketeer(payload);
	}

	checkup() {
		google.script.run.withSuccessHandler(this.checkdown).withFailureHandler(this.checkDownError).socketeer();
	}

	scheduleNextCheckup(milliseconds: number) {
		clearTimeout(this.nextCheckup);
		this.nextCheckup = setTimeout(this.checkup, milliseconds);
	}

	checkdown(queue: SocketeerMessageQueue) {
		this.scheduleNextCheckup(queue.nextPoll ?? 5000);
		this.passedChecks++;
		if (!this.isInitialized) {
			this.isInitialized = true;
			if (this.initCallback) {
				this.initCallback();
			}
		}
		if (this.checkdownCallback) {
			this.checkdownCallback(queue);
		}
	}

	checkDownError(message: Error) {
		this.failedChecks++;

		if (this.checkFailedCallback) {
			const shouldCheckAgain = this.checkFailedCallback(message, this.failedChecks);
			if (shouldCheckAgain) {
				this.checkup();
			}
		}

		if (this.failedChecks > 3) {
			alert(`maximum number of failed checks reached, error code here: ${message}`);
		}

	}


}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:socketeer')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('socketeer') declare altName: SocketeerService;`.
declare module '@ember/service' {
	interface Registry {
		socketeer: SocketeerService;
	}
}
