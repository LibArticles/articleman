import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking'
import type RouteHistoryService from 'frontend/services/route-history';
import { action } from '@ember/object';
import { EmptyObject } from '@glimmer/component/-private/component';


export default class BackButtonComponent extends Component {
  @service routeHistory!: RouteHistoryService;

  constructor(owner: unknown, args: EmptyObject) {
    super(owner, args);
  }



  @action back() {
    this.routeHistory.back();
  }

}
