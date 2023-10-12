import Component from '@glimmer/component';

export default class MainMenuComponent extends Component {
  isAdmin = false;
  isWorker = false;
  isCustomer = false;
  isDebug = false;
  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.isAdmin = true;
  }

}
