import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CasementService from 'articleman-frontend/services/casement';

export default class IndexRoute extends Route {
  @service('casement') declare casement: CasementService;
  init() {
    super.init();
    this.casement.inside.send('Hello, backend!');
  }
}
