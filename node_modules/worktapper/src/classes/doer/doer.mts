import idGen from '../identifier.mjs';
export default class Doer {
  id: string;
  tasks: string[] = [];

  constructor() {
    this.id = idGen('doer');
  }
}
