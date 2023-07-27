import recognizedCommands from '../../../shared/recognized-commands.json';
import DataSetManager from '../parsing/datasets/dataset-manager';

export default class DataManager {
	getItemById(id: string) {
		return DataSetManager.getObjects().then((objects) => {
			return;
		});
	}
}
