import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export default class HeaderComponent extends Component { // @ts-ignore
  @service('router') router;
  title = '';

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.setTitle();
  }

  @action
  setTitle() {
    const currentRouteName = this.router.currentRouteName;
    switch (currentRouteName) {
      case 'index':
        this.title = 'Home';
        break;
      case 'settings':
        this.title = 'Settings';
        break;
      case 'system':
        this.title = 'System';
        break;
      case 'license':
        this.title = 'License';
        break;
      default:
        this.title = 'My Website';
        break;
    }
    document.title = this.title;
  }
}
