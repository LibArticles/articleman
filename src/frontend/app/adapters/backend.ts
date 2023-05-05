import Adapter from '@ember-data/adapter';
import postmate from 'postmate';
import config from '../../config.json'

export default class BackendAdapter extends Adapter {
  constructor() {
    super(...arguments);

    const connection = new postmate.Model({
      // Provide required handshakeOrigin.
      // This is used for security purposes to prevent
      // other domains from using the connection.
      handshakeOrigin: config.frontendUrl,

      // The parent origin. The parent will gain access to
      // the child model instance and be able to interact with it.
      parentOrigin: config.containerUrl,
    });

    this.parent = new postmate.Parent({
      child: connection,
      // options
    });

    this.parent.on('request', (data) => {
      this.handleRequest(data);
    });
  }

  findRecord(store, type, id, snapshot) {
    return this._request('findRecord', { type: type.modelName, id });
  }

  findAll(store, type, sinceToken, snapshotRecordArray) {
    return this._request('findAll', { type: type.modelName });
  }

  query(store, type, query) {
    return this._request('query', { type: type.modelName, query });
  }

  createRecord(store, type, snapshot) {
    const { modelName } = type;
    const data = this.serialize(snapshot, { includeId: true });
    return this._request('createRecord', { type: modelName, data });
  }

  updateRecord(store, type, snapshot) {
    const { modelName } = type;
    const id = snapshot.id;
    const data = this.serialize(snapshot, { includeId: true });
    return this._request('updateRecord', { type: modelName, id, data });
  }

  deleteRecord(store, type, snapshot) {
    const { modelName } = type;
    const id = snapshot.id;
    return this._request('deleteRecord', { type: modelName, id });
  }

  handleRequest(data) {
    // handle incoming requests from the parent frame
  }

  _request(method, data) {
    return this.parent.send({ method, data });
  }
}