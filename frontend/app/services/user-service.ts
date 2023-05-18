import Service from '@ember/service';

export default class UserServiceService extends Service {}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:user-service')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('user-service') declare altName: UserServiceService;`.
declare module '@ember/service' {
  interface Registry {
    'user-service': UserServiceService;
  }
}
