import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service router!: RouterService;

  @tracked title: string = 'Articleman';
  @tracked page: string = 'Home';

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.router.on('routeDidChange', () => {
      this.setPage();
    }
    );
    this.setPage();
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
      case 'people': 
        this.page = 'People';
        break;
      case 'work':
        this.page = 'Work';
        break;
      default:
        this.page = 'Uhhh...';
        break;
    }
    document.title = this.title + ' - ' + this.page;
  }

  @action
  didInsert() {
    this.setPage();
  }

  @action
  willDestroy() {
    super.willDestroy();

  }
}