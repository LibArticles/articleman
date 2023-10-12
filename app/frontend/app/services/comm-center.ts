import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { service } from '@ember/service';
import { type FrontendCommand, CMD } from 'shared/recognized-commands';
import { google } from 'types/articleman-frontend/google.d';
import SocketeerService from 'frontend/services/socketeer';
import { Omnibus } from '@hypersphere/omnibus';


export default class CommCenterService extends Service {
	@service router!: RouterService;
	@service socketeer!: SocketeerService;

	constructor(...args: any[]) {
		super(...args);
		this.socketeer.onCheckdown((queue) => {
			for (const message of queue.messages) {
				this.handle(message.type as FrontendCommand, message.payload);
			}
		})
	}

	dispatch(message: FrontendCommand, payload: any) {

	}

	handle(message: FrontendCommand, payload: any) {
		switch (message) {
			case CMD.Frontend.Remote.forceQuit:
				google.script.host.close();
			case CMD.Frontend.Remote.navigate:
				this.router.transitionTo(message, payload);
			case CMD.Frontend.Status.triggerStatusMessage:

		}
	}
}



// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:comm-center')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('comm-center') declare altName: CommCenterService;`.
declare module '@ember/service' {
	interface Registry {
		'comm-center': CommCenterService;
	}
}
