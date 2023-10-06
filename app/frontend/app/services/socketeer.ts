import Service from '@ember/service';
import type { SocketeerMessage } from 'backend/src/comms/socket';
import { CMD } from 'shared/recognized-commands';





export default class SocketeerService extends Service {
	private nextCheckup: number = 0;

	constructor() {
		super(...arguments);
	}

	initialize() {

	}

	checkup() {

	}

	scheduleNextCheckup(milliseconds: number) {
		clearTimeout(this.nextCheckup);
		this.nextCheckup = setTimeout(this.checkup, milliseconds);
	}

	checkdown(message: SocketeerMessage) {


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
