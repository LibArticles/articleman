export default class RawDataSetManager {
	static async getDataSets() {
		// get all named ranges
		return SpreadsheetApp.getActiveSpreadsheet()
			.getNamedRanges()
			.filter((set) => {
				return (
					// if the named range has the AMDS_ prefix
					set.getName().startsWith('AMDS_') &&
					// if the named range has the articlemanManagedDataset metadata
					set
						.getRange()
						.getDeveloperMetadata()
						.filter(
							(metadata) =>
								metadata.getKey() === 'articlemanManagedDataset' &&
								metadata.getValue() === 'true',
						).length > 0
				);
			});
	}
	static async getDataSet(id: string) {
		return SpreadsheetApp.getActiveSpreadsheet()
			.getNamedRanges()
			.filter((set) => {
				return (
					// if the named range has the same name
					set.getName() === `AMDS_${id}` &&
					// if the named range has the articlemanManagedDataset metadata
					set
						.getRange()
						.getDeveloperMetadata()
						.filter(
							(metadata) =>
								metadata.getKey() === 'articlemanManagedDataset' &&
								metadata.getValue() === 'true',
						).length > 0
				);
			})[0];
	}

	static async createDataSet(id: string, range: string) {
		const sheet = SpreadsheetApp.getActiveSpreadsheet();
		const dataSet = sheet
			.getRange(range)
			.addDeveloperMetadata('articlemanManagedDataset', 'true');

		sheet.setNamedRange(`AMDS_${id}`, dataSet);
		return dataSet;
	}

	static deleteDataSet(id: string) {
		SpreadsheetApp.getActiveSpreadsheet().removeNamedRange(`AMDS_${id}`);
	}

	static updateDataSetRange(id: string, range: string) {
		const sheet = SpreadsheetApp.getActiveSpreadsheet();
		const dataSet = sheet
			.getNamedRanges()
			.filter((set) => set.getName() === `AMDS_${id}`)[0];

		// remove the old range's dev metadata
		dataSet
			.getRange()
			.getDeveloperMetadata()
			.filter(
				(metadata) =>
					metadata.getKey() === 'articlemanManagedDataset' &&
					metadata.getValue() === 'true',
			)[0]
			.remove();

		// set the new range and add the dev metadata
		dataSet.setRange(sheet.getRange(range));
		dataSet.getRange().addDeveloperMetadata('articlemanManagedDataset', 'true');
		return dataSet;
	}
}
