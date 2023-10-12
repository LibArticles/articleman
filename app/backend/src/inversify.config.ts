import { Container } from 'inversify';
import SurgicalEngine from 'lib/surgical-engine';
import MatrixBackend from 'lib/surgical-engine/backends/matrix';
import StorageManager from 'lib/storage-manager';
import UserManager from 'src/user-manager';
import SettingsManager from './settings-manager';
import Socketeer, { type SocketeerMessage } from './comms/socket';
import { Turnstile } from 'lib/concurrency';

const container = new Container({ autoBindInjectable: false });
export default container;

import Service from './dependencies';

// known services
container.bind(Service.Surgical).to(SurgicalEngine).inSingletonScope();
container.bind(Service.User).to(UserManager).inSingletonScope();
container.bind(Service.Storage).to(StorageManager).inSingletonScope();
container.bind(Service.Matrix).to(MatrixBackend).inSingletonScope();
container.bind(Service.Settings).to(SettingsManager).inSingletonScope();
container.bind(Service.Socketeer).to(Socketeer).inSingletonScope();
container.bind(Service.Turnstile).toConstructor(Turnstile);

declare namespace globalThis {
	var socketeer: (payload?: SocketeerMessage) => void;
}

const socketeer = container.get<Socketeer>(Service.Socketeer);
globalThis.socketeer = socketeer.checkup.bind(socketeer);
