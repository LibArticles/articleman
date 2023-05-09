import Service from '@ember/service';
import { Inside } from 'casement'

export default class CasementService extends Service {
  public inside: Inside;
  constructor() {
    super(...arguments);
    this.inside = new Inside({
      name: 'ember-app',
      allowedDomain: 'https://articleman.bluelinden.art',
    });
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:casement')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('casement') declare altName: CasementService;`.
declare module '@ember/service' {
  interface Registry {
    'casement': CasementService;
  }
}
