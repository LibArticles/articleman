// app/components/back-button.js

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import RouterHistoryService from 'frontend/services/route-history';
import { action } from '@ember/object';

export default class BackButtonComponent extends Component {
  @service routerHistory!: RouterHistoryService;

  // link to the previous route in the history stack

  @computed('routerHistory.previousRoute')
  get previousRoute() {
    return this.routerHistory.previousRoute;
  }

  @action
  back() {
    this.routerHistory.back();
  }

}

<template>
  <button type="button" class="nav-back" {{on 'click' this.back}}>
    
  </button>
</template>