import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import IntlService from 'ember-intl/services/intl';

export default class HeaderComponent extends Component {
  @service router!: RouterService;
  @service intl!: IntlService;

  @tracked title: string = this.intl.t('chrome.header.product');
  @tracked page: string = this.intl.t('chrome.header.index');

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.router.on('routeDidChange', () => {
      this.setPage();
    }
    );
    this.setPage();
  }

  @action setPage() {
    const currentRouteName = this.router.currentRouteName;
    this.page = this.intl.t(`chrome.header.${currentRouteName}`);
    document.title = this.title + ' - ' + this.page;
  }
}