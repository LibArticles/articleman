import Component from '@glimmer/component';

export default class MainMenuComponent extends Component {
  isAdmin = false;
  init() {
    this.isAdmin = true;
  }

}
