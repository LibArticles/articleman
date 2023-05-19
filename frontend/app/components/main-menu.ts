import Component from '@glimmer/component';

export default class MainMenuComponent extends Component {
  isAdmin = false;
  constructor(owner, args) {
    super(owner, args);
    this.args = args;
    this.isAdmin = true;
  }

}
