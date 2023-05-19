import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import CasementService from 'frontend/services/casement';

export default class IndexRoute extends Route {
  @service('casement') casement!: CasementService;
  init() {
    super.init();
    this.casement.inside.send('Hello, backend!');
  }
}
