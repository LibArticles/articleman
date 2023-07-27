// Surgical Engine: NamedRange backend

type ColumnDefinition = {
	identifier: string;
	range: GoogleAppsScript.Spreadsheet.Range;
	dataType: 'id' | 'any';
};

export default class ColumnBackend {
	spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
	data: Record<
		number,
		Record<
			string,
			{
				range: GoogleAppsScript.Spreadsheet.Range;
				dataType: 'id' | 'any';
				identifier: string;
			}
		>
	>;

	newColumn(input: ColumnDefinition) {}

	private findById(id: string) {
		// find the ID in the spreadsheet
		for (const sheet of Object.values(this.data)) {
			for (const column of Object.values(sheet)) {
				// skip the column if it isn't an id column
				if (column.dataType !== 'id') continue;

				// find the ID within the range
				const matches = column.range
					.createTextFinder(id)
					.matchCase(true)
					.matchEntireCell(true)
					.findAll();

				// if there is a bad number of matches, throw an error
				if (matches.length > 1) {
					throw new Error('More than one match found.');
				} else if (matches.length === 0) {
					throw new Error('No matches found.');
				} else {
					// otherwise we're cool, return the first match in the 1-long array.
					return matches[0];
				}
			}
		}
	}

	private matchIdToRow(id: string) {
		const idRange = this.findById(id);
		const rowNum = idRange.getRow();
		return rowNum;
	}

	private getSheetById(id: number) {
		return this.spreadsheet.getSheets().filter(function (s) {
			return s.getSheetId() === id;
		})[0];
	}

	private getColumnOffsetForId(id: string) {
		// get the value in each column for the row/offset that contains the ID
		// what is the offset? it's the row number of the first cell in a column. it's there so we can use the getCell method and allow for people to have things like header rows.
		const idRange = this.findById(id);
		const idRow = idRange.getRow();

		const idOffset = idRange.getRow();

		const offsetIdRow = idRow - idOffset;
		return offsetIdRow;
	}

	async getObjectForId(id: string) {
		// get the value in each column for the row/offset that contains the ID

		const idRange = this.findById(id);

		const offset = this.getColumnOffsetForId(id);

		const values: Record<string, any> = {};

		for (const column of Object.values(
			this.data[idRange.getSheet().getSheetId()],
		)) {
			values[column.identifier] = column.range.getCell(offset, 1);
		}
	}

	async getAllObjectsForSheet(sheetId: number) {
		// initialize stuff
		const sheet = this.data[sheetId];
		const columns: Record<string, any[]> = {};

		// get all columns from the sheet
		for (const column of Object.values(sheet)) {
			columns[column.identifier] = column.range.getValues();
		}

		// initialize the objects
		const objects: Record<string, any>[] = [];

		// create the actual objects themselves
		// for each column,
		for (const column of Object.keys(columns)) {
			// for each row in said column,
			columns[column].forEach((row, index) => {
				// make the object.
				objects[index][column] = row[0];
			});
		}
		return objects;
	}

	async getAllObjects() {
		const objects: Record<string, Record<string, any>[]> = {};
		for (const sheetId of Object.keys(this.data)) {
			objects[sheetId] = await this.getAllObjectsForSheet(parseInt(sheetId));
		}
	}
}
