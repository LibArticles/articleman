import type { SocketeerMessage, SocketeerMessageQueue } from 'backend/src/comms/socket';
import { v4 as uuidv4 } from 'uuid';
import casementManager, { CasementManager } from './casement';

export class SocketeerClient {
	private casement: CasementManager;
	private nextCheckup: ReturnType<typeof setTimeout> | undefined = undefined;
	private passedChecks: number = 0;
	private failedChecks: number = 0;
	private isInitialized: boolean = false;
	private checkdownCallback: ((queue: SocketeerMessageQueue) => void) | undefined = undefined;
	private checkFailedCallback: ((message: Error, failedChecks: number) => boolean) | undefined = undefined;
	private initCallback: (() => void) | undefined = undefined;

	constructor() {
		this.casement = casementManager;
	}

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
		this.casement.request(payload)?.catch(this.checkDownError).then((response: unknown) => {
			const queue = response as SocketeerMessageQueue;
			if (queue.messages && typeof queue.nextPoll === 'number') {
				this.checkdown(queue);
			}
		});
	}

	checkup() {
		this.casement.request({})?.catch(this.checkDownError).then((response: unknown) => {
			const queue = response as SocketeerMessageQueue;
			if (queue.messages && typeof queue.nextPoll === 'number') {
				this.checkdown(queue);
			}
		});
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