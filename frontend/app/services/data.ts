import Service from '@ember/service';

export default class DataService extends Service {}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:data')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('data') declare altName: DataService;`.
declare module '@ember/service' {
  interface Registry {
    'data': DataService;
  }
}
