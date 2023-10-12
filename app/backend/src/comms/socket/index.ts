import StorageManager from 'lib/storage-manager';
import type {
	FrontendCommand,
	BackendCommand,
} from 'shared/recognized-commands';
import { injectable, inject } from 'inversify';
import Service from 'src/dependencies';

class Names {
	static socketCache = 'socket-cache';
}

@injectable()
export default class Socketeer {
	@inject(Service.Storage)
	private StorageManager: StorageManager;

	private checkupCallback: ((message?: SocketeerMessage) => void) | undefined = undefined;

	checkup(payload: SocketeerMessage) {
		const queue = this.StorageManager.user.getCached(
			Names.socketCache,
		) as SocketeerMessageQueue;
		this.StorageManager.user.cache(Names.socketCache, {});

		return queue;
	}

	sendDown(payload: SocketeerMessage) {
		const queue = this.StorageManager.user.getCached(
			Names.socketCache,
		) as SocketeerMessageQueue;
		if (queue) {
			queue.messages.push(payload);
			const pollDates = queue.messages.map((message) => message.nextPoll);
			queue.nextPoll = Math.min(...pollDates);
			this.StorageManager.user.cache(Names.socketCache, queue);
		} else {
			this.StorageManager.user.cache(Names.socketCache, {
				nextPoll: payload.nextPoll ?? 5000,
				messages: [payload],
			});
		}
	}

	onCheckup(callback: (message?: SocketeerMessage) => void) {
		this.checkupCallback = callback;
	}
}

export interface SocketeerMessageQueue {
	nextPoll: number;
	messages: SocketeerMessage[];
}

export interface SocketeerMessage {
	type: FrontendCommand | BackendCommand;
	payload: any;
	id: string;
	nextPoll?: number;
}
