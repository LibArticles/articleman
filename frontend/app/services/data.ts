import Service from '@ember/service';
import { service } from '@ember/service';
import CommsService from './comms';
import recognizedCommands from '../../../shared/recognized-commands.json'

export default class DataService extends Service {
  @service comms!: CommsService;

  getItemById(id: string) {
    return this.comms.command(recognizedCommands.getMatchingItem, { query: { id } });
  }

  updateItem(data: object) {
    return this.comms.command(recognizedCommands.updateItem, { data });
  }

  createItem(data: object) {
    return this.comms.command(recognizedCommands.createItem, { data });
  }

  deleteItem(id: string) {
    return this.comms.command(recognizedCommands.deleteItem, { id });
  }

  getOldestMatchingItem(query: object) {
    return this.comms.command(recognizedCommands.getMatchingItem, { query, sort: 'oldest' });
  }

  getNewestMatchingItem(query: object) {
    return this.comms.command(recognizedCommands.getMatchingItem, { query, sort: 'newest' });
  }

  getMatchingItems(query: object) {
    return this.comms.command(recognizedCommands.getMatchingItems, { query });
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:data')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('data') declare altName: DataService;`.
declare module '@ember/service' {
  interface Registry {
    'data': DataService;
  }
}
