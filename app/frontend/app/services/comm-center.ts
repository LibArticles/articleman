import RouterService from '@ember/routing/router-service';
import Service from '@ember/service';
import { service } from '@ember/service';
import { type FrontendCommand, CMD } from 'shared/recognized-commands';


export default class CommCenterService extends Service {
	@service router!: RouterService;

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
