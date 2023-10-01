import StorageManager from 'lib/storage-manager';
import type { CMD, FrontendCommand } from 'shared/recognized-commands';

class Names {
	static socketCache = 'socket-cache';
}

export default class Socketeer {
	static check() {
		const queue = StorageManager.user.getCached(
			Names.socketCache,
		) as SocketeerMessageQueue;
		StorageManager.user.cache(Names.socketCache, {});

		return;
	}

	static send(payload: SocketeerMessage) {
		const queue = StorageManager.user.getCached(
			Names.socketCache,
		) as SocketeerMessageQueue;
		if (queue) {
			queue.messages.push(payload);
			const pollDates = queue.messages.map((message) => message.nextPoll);
			queue.nextPoll = Math.min(...pollDates);
			StorageManager.user.cache(Names.socketCache, queue);
		} else {
			StorageManager.user.cache(Names.socketCache, {
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
	type: FrontendCommand;
	payload: any;
	nextPoll: number;
}
