import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';

export default class ApplicationRoute extends Route {
  @service intl!: IntlService;
  @service 

  beforeModel() {
    this.intl.setLocale('en-us');
  }
}
