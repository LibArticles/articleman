import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterHistoryService from 'frontend/services/route-history';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';

export default class BackButtonComponent extends Component {
  @service routerHistory!: RouterHistoryService;
  @service router!: RouterService;

  @action
  back() {
    this.routerHistory.back();
  }

}
