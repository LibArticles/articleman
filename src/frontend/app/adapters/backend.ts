import Adapter from '@ember-data/adapter';
import postmate from 'postmate';

export default class CustomAdapter extends Adapter {
  parent: postmate.Parent;
  handshakePromise: Promise<void>;

  constructor() {
    super(...arguments);

    const connection = new postmate.ParentAPI({
      // options
    });

    this.parent = new postmate.Parent({
      child: connection,
      // options
    });

    // Use a Promise to wait for the handshake to complete
    this.handshakePromise = new Promise((resolve, reject) => {
      this.parent.on('handshake', () => {
        // Handshake complete
        resolve();
      });
      this.parent.on('error', (error) => {
        // Error during handshake
        reject(error);
      });
    });
  }

  async findRecord(store, type, id, snapshot) {
    await this.handshakePromise;
    return this._request('findRecord', { type: type.modelName, id });
  }

  async findAll(store, type, sinceToken, snapshotRecordArray) {
    await this.handshakePromise;
    return this._request('findAll', { type: type.modelName });
  }

  async query(store, type, query) {
    await this.handshakePromise;
    return this._request('query', { type: type.modelName, query });
  }

  async createRecord(store, type, snapshot) {
    await this.handshakePromise;
    const { modelName } = type;
    const data = this.serialize(snapshot, { includeId: true });
    return this._request('createRecord', { type: modelName, data });
  }

  async updateRecord(store, type, snapshot) {
    await this.handshakePromise;
    const { modelName } = type;
    const id = snapshot.id;
    const data = this.serialize(snapshot, { includeId: true });
    return this._request('updateRecord', { type: modelName, id, data });
  }

  async deleteRecord(store, type, snapshot) {
    await this.handshakePromise;
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
