import Adapter from '@ember-data/adapter';
import Store, { Snapshot } from '@ember-data/store';
import Model from '@ember-data/model';
import { service } from '@ember/service';
import CommsService from 'frontend/services/comms';
import RSVP from 'rsvp';
import DS, { ModelSchema } from 'ember-data';
import commands from '../../../shared/recognized-commands.json'

export default class DatasetsAdapter extends Adapter {
  @service comms!: CommsService;
  findRecord<K extends string | number>(store: Store, type: ModelSchema<K>, id: string, snapshot: Snapshot<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.comms.command(commands.getItem, { id: id }).then((result) => {
        resolve(result);
      });
    })
  }

  findAll<K extends string | number>(store: Store, type: ModelSchema<K>, sinceToken: string | number | null, snapshotRecordArray: DS.SnapshotRecordArray<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.comms.command(commands.getItems, {}).then((result) => {
        resolve(result);
      });
    })
  }

  createRecord<K extends string | number>(store: Store, type: ModelSchema<K>, snapshot: Snapshot<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.comms.command(commands.createItem, { item: snapshot.record }).then((result) => {
        resolve(result);
      });
    })
  }

  updateRecord<K extends string | number>(store: Store, type: ModelSchema<K>, snapshot: Snapshot<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.comms.command(commands.updateItem, { item: snapshot.record }).then((result) => {
        resolve(result);
      });
    })
  }

  deleteRecord<K extends string | number>(store: Store, type: ModelSchema<K>, snapshot: Snapshot<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
      this.comms.command(commands.deleteItem, { id: snapshot.id }).then((result) => {
        resolve(result);
      });
    })
  }

  shouldReloadRecord<K extends string | number>(store: Store, snapshot: Snapshot<K>): boolean {
    return true;
  }
  shouldReloadAll<K extends string | number>(store: Store, snapshotRecordArray: DS.SnapshotRecordArray<K>): boolean {
    return true;
  }
}