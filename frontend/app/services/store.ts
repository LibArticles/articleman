import Store from '@ember-data/store';

import RequestManager from '@ember-data/request';

export default class extends Store {
  requestManager = new RequestManager();

  constructor(args: object) {
    super(args);
    this.requestManager.use([]);
  }
}