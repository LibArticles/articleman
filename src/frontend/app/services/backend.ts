import Service from '@ember/service';

export default class BackendService extends Service {}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:backend')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('backend') declare altName: BackendService;`.
declare module '@ember/service' {
  interface Registry {
    'backend': BackendService;
  }
}
