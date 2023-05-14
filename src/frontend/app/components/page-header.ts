import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @service router!: RouterService;
  title: string = 'Articleman';
  page: string = 'Home';

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.setPage();
    this.router.on('routeDidChange', this.setPage);
  }

  @action
  setPage() {
    const currentRouteName = this.router.currentRouteName;
    switch (currentRouteName) {
      case 'index':
        this.page = 'Home';
        break;
      case 'settings':
        this.page = 'Settings';
        break;
      case 'system':
        this.page = 'System';
        break;
      case 'license':
        this.page = 'License';
        break;
      default:
        this.page = 'Uhhh...';
        break;
    }
    document.title = this.title + ' - ' + this.page;
  }

  willDestroy() {
    super.willDestroy();
    this.router.off('routeDidChange', this.setPage);
  }
}
