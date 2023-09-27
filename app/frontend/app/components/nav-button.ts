import Component from '@glimmer/component';

export interface NavButtonSignature {
  Args: {
    route: string;
    icon: string;
    label: string;
  }
}

export default class NavButtonComponent extends Component<NavButtonSignature> {}