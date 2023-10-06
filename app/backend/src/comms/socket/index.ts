import StorageManager from 'lib/storage-manager';
import type { FrontendCommand } from 'shared/recognized-commands';
import { injectable, inject } from 'inversify';
import Service from 'src/dependencies';

class Names {
	static socketCache = 'socket-cache';
}

@injectable()
export default class Socketeer {
	@inject(Service.Storage)
	private StorageManager: StorageManager;

	check() {
		const queue = this.StorageManager.user.getCached(
			Names.socketCache,
		) as SocketeerMessageQueue;
		this.StorageManager.user.cache(Names.socketCache, {});

		return queue;
	}

	send(payload: SocketeerMessage) {
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
				nextPoll: 0,
				messages: [],
			});
		}
	}
}

export interface SocketeerMessageQueue {
	nextPoll: number;
	messages: SocketeerMessage[];
}

export interface SocketeerMessage {
	type: FrontendCommand | BackendCommand;
	payload: any;
	nextPoll?: number;
}
