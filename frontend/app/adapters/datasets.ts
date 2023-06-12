import Adapter from '@ember-data/adapter';
import Store, { Snapshot } from '@ember-data/store';
import Model from '@ember-data/model';
import RSVP from 'rsvp';
import { ModelSchema } from 'ember-data';

export default class DatasetsAdapter extends Adapter {
  findRecord<K extends string | number>(store: Store, type: ModelSchema<K>, id: string, snapshot: Snapshot<K>): RSVP.Promise<any> {
    return new RSVP.Promise((resolve, reject) => {
    });
  }
}