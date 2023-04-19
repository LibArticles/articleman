import idGen from '../identifier.mjs';
export default class Task {
  name: string;
  description: string;
  data: unknown;
  doers: string[] = [];
  id: string;
  constructor(name: string, description = '') {
    this.name = name;
    this.description = description;
    this.id = idGen('task');
  }
}
