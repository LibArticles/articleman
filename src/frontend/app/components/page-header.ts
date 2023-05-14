import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export default class HeaderComponent extends Component {
  @service router!: RouterService;
  title: string = '';

  constructor(owner: unknown, args: {}) {
    super(owner, args);
    this.setTitle();
    this.router.on('routeDidChange', this.setTitle);
  }

  @action
  setTitle() {
    const currentRouteName = this.router.currentRouteName;
    switch (currentRouteName) {
      case 'index':
        this.title = 'Home Page';
        break;
      case 'about':
        this.title = 'About Us';
        break;
      case 'contact':
        this.title = 'Contact Us';
        break;
      default:
        this.title = 'Uhhh...';
        break;
    }
    document.title = this.title;
  }

  willDestroy() {
    super.willDestroy();
    this.router.off('routeDidChange', this.setTitle);
  }
}
