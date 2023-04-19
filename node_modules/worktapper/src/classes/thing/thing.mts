import Task from './task.mjs';
import idGen from '../identifier.mjs';
export default class Thing {
  name: string;
  description: string;
  tasks: string[] = [];
  id: string;

  constructor(name: string, description = '', tasks: string[] = []) {
    this.name = name;
    this.description = description;
    this.tasks = tasks;
    this.id = idGen('thing');
  }

}
