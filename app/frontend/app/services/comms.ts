import Service, { service } from '@ember/service';
import ErrorService from './error';
import recognizedCommands from 'shared/recognized-commands.json'

declare const google: any;

export default class CommsService extends Service {
  mode: "webapp" | "jsapi" = "jsapi";

  @service error!: ErrorService;

  // communicate with the backend
  command(action: string, payload: object | number | string | boolean | Array<any>) {
    return new Promise((resolve, reject) => {
      const commands = Object.keys(recognizedCommands);

      if (!commands.includes(action)) {
        reject(new Error(this.error.type.developer.unrecognizedCommand));
        return;
      }

      const transactionID = this.generateTransactionId();

      function handleSuccess(result: any, receivedTransactionID: string) {
        if (result.transactionID === transactionID && 
            receivedTransactionID === transactionID) {
          resolve(result);
        }
      }

      google.script.run.withSuccessHandler(handleSuccess).withFailureHandler(reject).command(action, payload);
    });
  }

  heartbeat() {
    return new Promise((resolve, reject) => {
      const transactionID = this.generateTransactionId();

      function handleSuccess(result: any, receivedTransactionID: string) {
        if (result.transactionID === transactionID && 
            receivedTransactionID === transactionID) {
          resolve(result);
        }
      }

      google.script.run.withSuccessHandler(handleSuccess).withFailureHandler(reject).withUserObject(transactionID).heartbeat(transactionID);

    });
  }

  generateTransactionId() {
    return "transactionID-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  handleError(error: Error) {
    console.error(error);
    function startsWith(str: string) {
      return error.message.indexOf(str) === 0;
    }

    // TODO: handle errors using the error service
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
