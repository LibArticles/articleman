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
  @tracked needsBackButton = false;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.router.on('routeDidChange', () => {
      this.setPage();
      this.checkForBackButton();
    }
    );
    this.setPage();
  }

  @action checkForBackButton() {
    const name = this.router.currentRoute.name
    this.needsBackButton = !isTopLevelOrIndexRoute(name);
  }
  /**
   * Set the page based on the current route name.
   */
  @action setPage() {
    const currentRouteName = this.router.currentRouteName;
    this.page = this.intl.t(`chrome.header.${currentRouteName}`);
    document.title = this.title + ' - ' + this.page;
  }
}

function isTopLevelOrIndexRoute(routeName: string) {
  // Split route name by dots
  const routeParts = routeName.split('.');

  // Check if route name ends with '.index'
  if (routeName.endsWith('.index')) {
    // Get the parent route name by removing '.index' from the end
    const parentRouteName = routeName.slice(0, -6);

    // Check if the parent route name has more than one part
    if (parentRouteName.includes('.')) {
      return false;
    }
  } else if (routeParts.length > 1) {
    return false;
  }


  
  
  return true;
}
