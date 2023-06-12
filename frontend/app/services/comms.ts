import Service from '@ember/service';
import RSVP from 'rsvp';

declare const google: any;

interface Payload {
  content: string | object | number | boolean | null;
}

export default class CommsService extends Service {
  // communicate with the backend
  send(action: string, payload: Payload) {
    return new RSVP.Promise((resolve, reject) => {
      google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).send(action, payload);
    });
  }

  heartbeat() {
    return new RSVP.Promise((resolve, reject) => {
      google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).heartbeat();
    });
  }

  generateTransactionId() {
    return "transactionID-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:comms')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('comms') declare altName: CommsService;`.
declare module '@ember/service' {
  interface Registry {
    'comms': CommsService;
  }
}
