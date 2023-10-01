/*
	Surgical Engine: Matrix Named Range Search implementation.
	This implementation uses Google Sheets Named Ranges to search for data in a matrix.
*/

// ███████ ██    ██ ██████   ██████  ██  ██████  █████  ██
// ██      ██    ██ ██   ██ ██       ██ ██      ██   ██ ██
// ███████ ██    ██ ██████  ██   ███ ██ ██      ███████ ██
//      ██ ██    ██ ██   ██ ██    ██ ██ ██      ██   ██ ██
// ███████  ██████  ██   ██  ██████  ██  ██████ ██   ██ ███████

import {
	SupportedLayout,
	SurgicalBackend,
	SurgicalChangeQueue,
	SurgicalChangeset,
	SurgicalObject,
	SurgicalQuery,
	SurgicalTemplate,
} from 'lib/surgical-engine/base/engine';

import { Turnstile } from 'lib/concurrency';

import StorageManager from 'lib/storage-manager';

import { v4 as uuidv4 } from 'uuid';

import { unzip as _unzip, set as _set, get as _get } from 'lodash';

class Names {
	static universal = 'SURGICAL_ENGINE_MATRIX_';
	static object = this.universal + 'OBJECT_';
	static attribute = this.universal + 'ATTRIBUTE_';
	static layout = this.universal + 'LAYOUT';
	static ignore = this.universal + 'IGNORE_';
	static header = this.ignore + 'HEADER_';
	static generalIgnore = this.ignore + 'GENERAL_';
	static changeTracking = 'change-tracking';
	static changeTrackingLookup = this.changeTracking + '-lookup';
	static changeTrackingQueue = this.changeTracking + '-queue';
}

export default class MatrixBackend implements SurgicalBackend<MatrixBackend> {
	spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

	constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		this.spreadsheet = spreadsheet;
		return this;
	}

	initializeEngine(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		StorageManager.document.store(Names.changeTrackingLookup, {
			0: { 0: 0 },
		});
		return this;
	}
	initializeSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		return this;
	}
	loadTemplate(template: SurgicalTemplate) {
		for (const id in template.objects) {
			const range = this.spreadsheet.getRange(template.objects[id]);
			this.spreadsheet.setNamedRange(Names.object + id, range);
		}
		for (const attr in template.attributes) {
			const range = this.spreadsheet.getRange(template.objects[attr]);
			this.spreadsheet.setNamedRange(Names.attribute + attr, range);
		}
		for (const sheetId in Object.keys(template.sheetLayouts)) {
			const sheet = this.getSheetById(sheetId);
			sheet.addDeveloperMetadata(
				Names.layout,
				template.sheetLayouts[sheetId],
			);
		}

		for (const header in template.ignoredAreas.headers) {
			const id = uuidv4();
			const range = this.spreadsheet.getRange(header);
			const sheet = this.spreadsheet;
			sheet.setNamedRange(Names.header + id, range);
		}
		for (const general in template.ignoredAreas.generalAreas) {
			const id = uuidv4();
			const range = this.spreadsheet.getRange(general);
			const sheet = this.spreadsheet;
			sheet.setNamedRange(Names.generalIgnore + id, range);
		}

		return this;
	}

	getSheetById(id: string) {
		const sheets = this.spreadsheet.getSheets();
		const sheet = sheets.find((s) => s.getSheetId().toString() === id);
		return sheet;
	}

	getObject(id: string): SurgicalObject {
		const objectNamedRange = this.spreadsheet.getRangeByName(
			Names.object + id,
		);
		const sheet = objectNamedRange.getSheet();

		// get all attributes for that sheet
		const attributes = [];
		for (const range in sheet.getNamedRanges()) {
			if (range.startsWith(Names.attribute)) {
				attributes.push(range);
			}
		}

		const object: Record<string, any> = {};

		const lastModified = this.getLastModified(id) as Record<string, number>;

		for (const attribute in attributes) {
			const attrRange = this.spreadsheet.getRangeByName(
				attributes[attribute],
			);

			object[attribute] = this.intersectRanges(attrRange, objectNamedRange);
		}

		return {
			attributes: object,
			lastModified,
			id,
		};
	}

	getObjects(...ids: string[]) {
		return ids.map((id) => {
			return this.getObject(id);
		});
	}

	applyChangeset(changeset: SurgicalChangeset) {
		// for each new attribute add a named range at the specified position
		for (const newAttributeId in changeset.create.attributes) {
			const currentAttrCreation =
				changeset.create.attributes[newAttributeId];

			if (currentAttrCreation.position.range) {
				this.ingestNewRangeByNotation(
					currentAttrCreation.position.range,
					'ATTRIBUTE',
					newAttributeId,
				);

				// otherwise add it at the specified offset from the end.
			} else if (currentAttrCreation.sheetId !== undefined) {
				const currentSheet = this.getSheetById(currentAttrCreation.sheetId);

				switch (currentAttrCreation.type) {
					case 'ingest':
						this.ingestNewRangeByOffset(
							currentSheet,
							'ATTRIBUTE',
							currentAttrCreation.position.offset,
							newAttributeId,
						);
						break;
					case 'append':
						this.appendAttribute(currentSheet, newAttributeId);
					case 'hidden':
						this.appendAttribute(currentSheet, newAttributeId);
						this.hideData(newAttributeId, 'attribute');
				}
			}
		}
		SpreadsheetApp.flush();

		for (const newObjectId in changeset.create.objects) {
			const currentObjCreation = changeset.create.objects[newObjectId];
			if (currentObjCreation.sheetId !== undefined) {
				const currentSheet = this.getSheetById(currentObjCreation.sheetId);
				switch (currentObjCreation.type) {
					case 'append':
						this.appendObject(currentSheet, newObjectId);
						break;
					case 'ingest':
						if (currentObjCreation.position.range) {
							this.ingestNewRangeByNotation(
								currentObjCreation.position.range,
								'OBJECT',
								newObjectId,
							);
						} else if (currentObjCreation.position.offset) {
							this.ingestNewRangeByOffset(
								currentSheet,
								'OBJECT',
								currentObjCreation.position.offset,
								newObjectId,
							);
						}
				}
			}
		}
		SpreadsheetApp.flush();

		for (const attributeUpdateId in changeset.update.attributes) {
			const currentAttrUpdate =
				changeset.update.attributes[attributeUpdateId];

			this.moveDataByOffset(
				attributeUpdateId,
				'attribute',
				currentAttrUpdate.position.offset,
			);
		}
		SpreadsheetApp.flush();

		for (const objectUpdateId in changeset.update.attributes) {
			const currentObjUpdate = changeset.update.objects[objectUpdateId];
			const objRange = this.spreadsheet.getRangeByName(
				Names.object + objectUpdateId,
			);

			if (currentObjUpdate.position.offset) {
				this.moveDataByOffset(
					objectUpdateId,
					'object',
					currentObjUpdate.position.offset,
				);
			}

			// if the updated object is definitive
			if (currentObjUpdate.isDefinitive) {
				const attrRanges = objRange
					.getSheet()
					.getNamedRanges()
					.filter((r) => {
						r.getName().startsWith(Names.attribute);
					});

				for (const attrRange in attrRanges) {
					const intersection = this.intersectRanges(
						objRange,
						attrRanges[attrRange].getRange(),
					);
					intersection.setValue('');
				}
			}
			for (const objAttrUpdateId in currentObjUpdate.attributes) {
				// intersect the ranges for the object and attributes
				const range = this.intersectRanges(
					objRange,
					this.spreadsheet.getRangeByName(
						Names.attribute + objAttrUpdateId,
					),
				);
				const objAttrUpdateValue =
					currentObjUpdate.attributes[objAttrUpdateId];

				range.setValue(objAttrUpdateValue);
			}
		}
		SpreadsheetApp.flush();

		for (const attrDeleteId in changeset.delete.attributes) {
			const currentAttrDelete = changeset.delete.attributes[attrDeleteId];
			switch (currentAttrDelete.type) {
				case 'splice':
					this.deleteData(attrDeleteId, 'attribute');
					break;
				case 'ignore':
					// set an ignore attribute on the data and remove the old attr named range
					const attrRange = this.spreadsheet.getRangeByName(
						Names.attribute + attrDeleteId,
					);
					this.spreadsheet.setNamedRange(
						Names.ignore + attrDeleteId,
						attrRange,
					);
					attrRange
						.getSheet()
						.getNamedRanges()
						.find((r) => r.getName() === Names.attribute + attrDeleteId)
						.remove();
					break;
				case 'hide':
					this.hideData(attrDeleteId, 'attribute');
					break;
			}
		}
		SpreadsheetApp.flush();

		for (const objDeleteId in changeset.delete.objects) {
			const currentObjDelete = changeset.delete.objects[objDeleteId];
			switch (currentObjDelete.type) {
				case 'splice':
					this.deleteData(objDeleteId, 'object');
					break;
				case 'ignore':
					// set an ignore attribute on the data and remove the old obj named range
					const objRange = this.spreadsheet.getRangeByName(
						Names.object + objDeleteId,
					);
					this.spreadsheet.setNamedRange(
						Names.generalIgnore + objDeleteId,
						objRange,
					);
					objRange
						.getSheet()
						.getNamedRanges()
						.find((r) => r.getName() === Names.object + objDeleteId)
						.remove();
					break;
				case 'hide':
					this.hideData(objDeleteId, 'object');
					break;
			}
		}
		SpreadsheetApp.flush();
		return this;
	}

	runQuery(
		query: SurgicalQuery,
		input: GoogleAppsScript.Spreadsheet.Sheet | SurgicalObject[],
	) {
		let source: SurgicalObject[] = [];
		if (!(input instanceof Array)) {
			source = this.getObjectsFromSheet(
				input as GoogleAppsScript.Spreadsheet.Sheet,
			);
		} else {
			source = input;
		}

		const queryResults: SurgicalObject[] = [];
		for (const object of source) {
			const groupResults: Array<boolean> = [];
			for (const group of query) {
				const searchResults: Array<boolean> = [];
				for (const search of group) {
					const value = object.attributes[search.attribute];

					switch (search.match.type) {
						case 'equals':
							// if the polarity is true, then check if the value matches. if not, check if it doesn't.
							searchResults.push(
								search.match.polarity
									? value === search.match.value
									: value !== search.match.value,
							);
							break;
						case 'contains':
							// throw if the value is not a string
							if (typeof value !== 'string')
								throw new MatrixError(
									'Attempted to use a contain search on an attribute that is not a string',
								);
							if (typeof search.match.value !== 'string')
								throw new MatrixError(
									'Attempted to search a value using a contain search that is not a string',
								);

							// if the polarity is true, then check if the value is contained. if not, check if it doesn't.
							searchResults.push(
								search.match.polarity
									? value.toString().includes(search.match.value)
									: !value.toString().includes(search.match.value),
							);
							break;
						case 'iscontained':
							// throw if the value is not a string
							if (typeof value !== 'string')
								throw new MatrixError(
									'Attempted to use an iscontained search on an attribute that is not a string',
								);
							if (typeof search.match.value !== 'string')
								throw new MatrixError(
									'Attempted to search a value using an iscontained search that is not a string',
								);
							searchResults.push(
								search.match.polarity
									? search.match.value.toString().includes(value)
									: !search.match.value.toString().includes(value),
							);
							break;

						case 'between':
							// throw if the value is not a number
							if (typeof value !== 'number')
								throw new MatrixError(
									'Attempted to use a between search on an attribute that is not a number',
								);

							// check if the value is between the two search values.
							const doesMatch =
								(value >= search.match.values[0] &&
									value <= search.match.values[1]) ||
								(value <= search.match.values[0] &&
									value >= search.match.values[1]);

							// if the polarity is true, return the result. if not, return the opposite.
							searchResults.push(
								search.match.polarity ? doesMatch : !doesMatch,
							);
							break;
						case 'filled':
							// if the polarity is true, return the truthiness of the result. if not, return the opposite.
							searchResults.push(
								search.match.value ? value !== '' : value === '',
							);
					}
				}
				if (
					searchResults.every((result) => {
						return result === true;
					})
				) {
					groupResults.push(true);
				} else {
					groupResults.push(false);
				}
			}
			if (
				groupResults.some((result) => {
					return result === true;
				})
			) {
				queryResults.push(object);
			}
		}
		return queryResults;
	}

	private appendAttribute(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		id: string,
	) {
		const range = this.findEmptySpace(
			sheet,
			'after-content-end',
			'attribute',
		);
		this.spreadsheet.setNamedRange(Names.attribute + id, range);
		return sheet
			.getNamedRanges()
			.find((r) => r.getName() === Names.attribute + id);
	}

	// append a new named range and return it
	private appendObject(sheet: GoogleAppsScript.Spreadsheet.Sheet, id: string) {
		const range = this.findEmptySpace(sheet, 'after-content-end', 'object');
		this.spreadsheet.setNamedRange(Names.object + id, range);
		return sheet
			.getNamedRanges()
			.find((r) => r.getName() === Names.object + id);
	}

	private ingestNewRangeByNotation(
		rangeStr: string,
		type: 'ATTRIBUTE' | 'OBJECT',
		id: string,
	) {
		const range = this.spreadsheet.getRange(rangeStr);

		this.spreadsheet.setNamedRange(
			(type === 'ATTRIBUTE' ? Names.attribute : Names.object) + id,
			range,
		);
	}

	private ingestNewRangeByOffset(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		type: 'ATTRIBUTE' | 'OBJECT',
		offset: number,
		id: string,
	) {
		const layout = this.getSheetLayout(sheet);
		switch (layout) {
			// if the layout of the sheet uses columns for objects and rows for attributes
			case 'vertical':
				const vRange = this.spreadsheet.getLastColumn() + offset + 1;
				this.spreadsheet.setNamedRange(
					(type === 'ATTRIBUTE' ? Names.attribute : Names.object) + id,
					sheet.getRange(vRange, 1, 1, sheet.getLastColumn()),
				);
				break;

			// if the layout of the sheet uses rows for objects and columns for attributes
			case 'horizontal':
				const hRange = this.spreadsheet.getLastRow() + offset + 1;
				this.spreadsheet.setNamedRange(
					(type === 'ATTRIBUTE' ? Names.attribute : Names.object) + id,
					sheet.getRange(1, hRange, sheet.getLastRow(), 1),
				);
		}
	}

	// ██    ██ ████████ ██ ██      ██ ████████ ██ ███████ ███████
	// ██    ██    ██    ██ ██      ██    ██    ██ ██      ██
	// ██    ██    ██    ██ ██      ██    ██    ██ █████   ███████
	// ██    ██    ██    ██ ██      ██    ██    ██ ██           ██
	//  ██████     ██    ██ ███████ ██    ██    ██ ███████ ███████

	private intersectRanges(
		range1: GoogleAppsScript.Spreadsheet.Range,
		range2: GoogleAppsScript.Spreadsheet.Range,
	) {
		// intersect two ranges, using the smaller dimension of each as one dimension of the intersection point.

		const sheet = range1.getSheet();
		const rowIndex = Math.max(range1.getRow(), range2.getRow());
		const columnIndex = Math.max(range1.getColumn(), range2.getColumn());

		const intersectingRange = sheet.getRange(rowIndex, columnIndex);
		return intersectingRange;
	}

	private moveDataByOffset(
		id: string,
		type: 'attribute' | 'object',
		offset: number,
	) {
		const range = this.spreadsheet.getRangeByName(
			(type === 'attribute' ? Names.attribute : Names.object) + id,
		);
		const sheet = range.getSheet();
		const layout = this.getSheetLayout(sheet);
		switch (true) {
			case (type === 'attribute' && layout === 'vertical') ||
				(type === 'object' && layout === 'horizontal'):
				range.offset(0, offset);
				break;

			case (type === 'attribute' && layout === 'horizontal') ||
				(type === 'object' && layout === 'vertical'):
				range.offset(offset, 0);
		}
	}

	private hideData(id: string, type: 'attribute' | 'object') {
		const range = this.spreadsheet.getRangeByName(
			(type === 'attribute' ? Names.attribute : Names.object) + id,
		);
		const layout = this.getSheetLayout(range.getSheet());

		switch (true) {
			case (layout === 'vertical' && type === 'object') ||
				(layout === 'horizontal' && type === 'attribute'):
				this.spreadsheet.hideColumn(range);
				break;
			case (layout === 'vertical' && type === 'attribute') ||
				(layout === 'horizontal' && type === 'object'):
				this.spreadsheet.hideRow(range);
		}
	}

	private deleteData(id: string, type: 'attribute' | 'object') {
		const range = this.spreadsheet.getRangeByName(
			(type === 'attribute' ? Names.attribute : Names.object) + id,
		);
		const layout = this.getSheetLayout(range.getSheet());

		switch (true) {
			case (layout === 'vertical' && type === 'object') ||
				(layout === 'horizontal' && type === 'attribute'):
				range.getSheet().deleteColumn(range.getColumn());
				break;
			case (layout === 'vertical' && type === 'attribute') ||
				(layout === 'horizontal' && type === 'object'):
				range.getSheet().deleteRow(range.getRow());
		}
	}

	private getSheetLayout(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		const layout = sheet
			.getDeveloperMetadata()
			.find((m) => m.getKey() === Names.layout)
			.getValue();

		if (layout !== 'vertical' && layout !== 'horizontal') {
			throw new MatrixError('Invalid layout');
		} else {
			return layout;
		}
	}

	getObjectsFromSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		const attributeRanges = sheet
			.getNamedRanges()
			.filter((r) => r.getName().startsWith(Names.attribute));
		const objectRanges = sheet
			.getNamedRanges()
			.filter((r) => r.getName().startsWith(Names.object));
		const ignoreRanges = sheet
			.getNamedRanges()
			.filter((r) => r.getName().startsWith(Names.ignore));
		const layout = this.getSheetLayout(sheet);

		const objectArray: SurgicalObject[] = [];

		// create a 'virtual spreadsheet' by getting a 2d array of the whole spreadsheet.

		let everything: any[][] = [];
		const objPositions: Record<string, number> = {};
		const attrPositions: Record<string, number> = {};

		// start[row, column], end[row, column] for tuple type
		// const ignorePositions: Record<string, [[number, number], [number, number]]> = {};

		switch (layout) {
			case 'horizontal':
				// if the sheet is horizontal, nothing needs to be transposed.
				everything = sheet.getDataRange().getValues();
				// add the object's row to the object positions, with the id as the key
				for (const range of objectRanges) {
					objPositions[range.getName().split(Names.object)[1]] =
						range.getRange().getRow() - 1;
				}
				// add the attribute's column to the attribute positions, with the id as the key
				for (const range of attributeRanges) {
					attrPositions[range.getName().split(Names.attribute)[1]] =
						range.getRange().getColumn() - 1;
				}
				// do we need to add ignore functionality? it kinda does this on its own
				// for (const range of ignoreRanges) {
				// 	const row = range.getRange().getRow() - 1;
				// 	const column = range.getRange().getColumn() - 1;
				// 	const endRow = row + range.getRange().getNumRows() - 2;
				// 	const endColumn = column + range.getRange().getNumColumns() - 2;
				// 	ignorePositions[range.getName().split(Names.ignore)[1]] = [[row, column], [endRow, endColumn]];
				// }
				break;
			case 'vertical':
				everything = _unzip(sheet.getDataRange().getValues());
				for (const range of objectRanges) {
					objPositions[range.getName().split(Names.object)[1]] =
						range.getRange().getColumn() - 1;
				}
				for (const range of attributeRanges) {
					attrPositions[range.getName().split(Names.attribute)[1]] =
						range.getRange().getRow() - 1;
				}
			// for (const range of ignoreRanges) {
			// 	const row = range.getRange().getRow() - 1;
			// 	const column = range.getRange().getColumn() - 1;
			// 	const endRow = row + range.getRange().getNumRows() - 2;
			// 	const endColumn = column + range.getRange().getNumColumns() - 2;
			// 	ignorePositions[range.getName().split(Names.ignore)[1]] = [[column, row], [endColumn, endRow]];
			// }
		}

		// for each object, loop through all the attributes and add them to the object.
		for (const objId in objPositions) {
			const attributes: Record<string, any> = {};
			for (const attrId in attrPositions) {
				attributes[attrId] =
					everything[objPositions[objId]][attrPositions[attrId]];
			}
			objectArray.push({
				id: objId,
				attributes,
				lastModified: this.getLastModified(objId) as Record<string, number>,
			});
		}
		return objectArray;
	}

	/**
	 * Finds empty space in a sheet. If there is none, it will create a new row or column.
	 */
	private findEmptySpace(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		tactic: 'first-available' | 'after-content-end',
		type: 'object' | 'attribute',
	) {
		const layout = this.getSheetLayout(sheet);
		switch (true) {
			case (layout === 'vertical' && type === 'object') ||
				(layout === 'horizontal' && type === 'attribute'):
				switch (tactic) {
					case 'first-available':
						// find the first empty column that isn't ignored
						for (let i = 1; i < sheet.getLastColumn(); i++) {
							const range = sheet.getRange(1, i, sheet.getLastRow(), 1);
							if (this.isRangeEmpty(range)) {
								return range;
							} else {
								continue;
							}
						}

					case 'after-content-end':
						// the fallthrough here is intentional, we want to find the first empty row that isn't ignored.

						// if there's an empty column after the last column, return that.
						if (
							sheet.getRange(
								1, // row
								sheet.getLastColumn() + 1, // column
								sheet.getLastRow(), // number of rows
								1, // number of columns
							)
						) {
							return sheet.getRange(
								1,
								sheet.getLastColumn() + 1,
								sheet.getLastRow(),
								1,
							);

							// otherwise, insert a new column and return that.
						} else {
							sheet.insertColumnAfter(sheet.getLastColumn());
							return sheet.getRange(
								1,
								sheet.getLastColumn() + 1,
								sheet.getLastRow(),
								1,
							);
						}
				}
			case (layout === 'vertical' && type === 'attribute') ||
				(layout === 'horizontal' && type === 'object'):
				switch (tactic) {
					case 'first-available':
						// find the first empty column that isn't ignored. if it's not found, fall through and insert a new row.
						for (let i = 1; i < sheet.getLastRow(); i++) {
							const range = sheet.getRange(
								i,
								1,
								1,
								sheet.getLastColumn(),
							);
							if (this.isRangeEmpty(range)) {
								return range;
							} else {
								continue;
							}
						}
					case 'after-content-end':
						// the fallthrough here is intentional, we want to find the first empty row that isn't ignored.

						// if there's an empty column after the last column, return that.
						if (
							sheet.getRange(
								sheet.getLastRow() + 1,
								1,
								1,
								sheet.getLastColumn(),
							)
						) {
							return sheet.getRange(
								sheet.getLastRow() + 1,
								1,
								1,
								sheet.getLastColumn(),
							);

							// otherwise, insert a new column and return that.
						} else {
							sheet.insertRowAfter(sheet.getLastColumn());
							return sheet.getRange(
								sheet.getLastRow() + 1,
								1,
								1,
								sheet.getLastColumn(),
							);
						}
				}
		}
	}

	getSheetForAttribute(attributeId: string) {
		const range = this.spreadsheet.getRangeByName(
			Names.attribute + attributeId,
		);
		return range.getSheet();
	}

	getSheetForObject(objectId: string) {
		const range = this.spreadsheet.getRangeByName(Names.object + objectId);
		return range.getSheet();
	}

	private isRangeEmpty(range: GoogleAppsScript.Spreadsheet.Range) {
		const sheet = range.getSheet();
		if (!this.isRangeIgnored(sheet, range)) {
			const cells = this.getIterableRange(range);
			for (const cell of cells) {
				// if the value is ignored, no matter what the content is it should continue. otherwise, if the value is there, immediately return false, and at the end if all values are ignored or empty, return true
				if (this.isRangeIgnored(sheet, cell)) {
					continue;
				} else if (cell.getValue()) {
					return false;
				}
			}
			return true;
		}
	}

	/**
	 * Creates a one-dimensional set of cell ranges from a full 1D range.
	 */
	private *getIterableRange(range: GoogleAppsScript.Spreadsheet.Range) {
		switch (true) {
			// split a one dimensional range into multiple ranges, one per cell

			// HORIZONTAL
			case range.getHeight() === 1 && range.getWidth() > 1:
				for (let i = 1; i < range.getWidth(); i++) {
					yield range.getCell(1, i);
				}
				break;

			// VERTICAL
			case range.getHeight() > 1 && range.getWidth() === 1:
				for (let i = 1; i < range.getHeight(); i++) {
					yield range.getCell(i, 1);
				}
				break;

			// SQUARE LIL' BUD :)
			case range.getHeight() === 1 && range.getWidth() === 1:
				yield range.getCell(1, 1);
				break;

			// 2D range
			case range.getHeight() > 1 && range.getWidth() > 1:
				for (let i = 1; i < range.getHeight(); i++) {
					for (let j = 1; j < range.getWidth(); j++) {
						yield range.getCell(i, j);
					}
				}

			// idek what happens to get you here... you clearly didn't follow the typescript types, idk how to help you.
			default:
				throw new MatrixError(
					'The input range used for iteration is an in incorrect format. Please use a one-dimensional range, conforming to the TypeScript type GoogleAppsScript.Spreadsheet.Range.',
				);
		}
	}

	private isRangeIgnored(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		range: GoogleAppsScript.Spreadsheet.Range,
	) {
		sheet
			.getNamedRanges()
			.filter(
				// filter out any named ranges that don't start with SURGICAL_ENGINE_MATRIX_IGNORE
				(namedRange: GoogleAppsScript.Spreadsheet.NamedRange) => {
					namedRange.getName().startsWith(Names.ignore);
				},
			)

			// for every named range that starts with SURGICAL_ENGINE_MATRIX_IGNORE_
			.forEach((ignoreZone: GoogleAppsScript.Spreadsheet.NamedRange) => {
				if (this.isRangeContainedIn(range, ignoreZone.getRange())) {
					return true;
				}
			});
		return false;
	}

	private isRangeContainedIn(
		range1: GoogleAppsScript.Spreadsheet.Range,
		range2: GoogleAppsScript.Spreadsheet.Range,
	) {
		if (
			range1.getA1Notation() === range2.getA1Notation() &&
			range1.getSheet().getName() === range2.getSheet().getName()
		) {
			return true;
		}

		// Get the bounds of each range
		const range1StartRow = range1.getRow();
		const range1StartCol = range1.getColumn();
		const range1EndRow = range1StartRow + range1.getHeight() - 1;
		const range1EndCol = range1StartCol + range1.getWidth() - 1;

		const range2StartRow = range2.getRow();
		const range2StartCol = range2.getColumn();
		const range2EndRow = range2StartRow + range2.getHeight() - 1;
		const range2EndCol = range2StartCol + range2.getWidth() - 1;

		if (
			range1StartRow >= range2StartRow &&
			range1EndRow <= range2EndRow &&
			range1StartCol >= range2StartCol &&
			range1EndCol <= range2EndCol
		)
			return true;

		// otherwise,
		return false;
	}

	private doRangesIntersect(
		range1: GoogleAppsScript.Spreadsheet.Range,
		range2: GoogleAppsScript.Spreadsheet.Range,
	) {
		// Get the row and column bounds for each range
		var r1Start = range1.getRow();
		var r1End = r1Start + range1.getNumRows() - 1;
		var c1Start = range1.getColumn();
		var c1End = c1Start + range1.getNumColumns() - 1;

		var r2Start = range2.getRow();
		var r2End = r2Start + range2.getNumRows() - 1;
		var c2Start = range2.getColumn();
		var c2End = c2Start + range2.getNumColumns() - 1;

		// Check if the ranges intersect
		if (
			r1Start <= r2End &&
			r2Start <= r1End &&
			c1Start <= c2End &&
			c2Start <= c1End
		) {
			return true;
		} else {
			return false;
		}
	}

	supportedLayouts = [
		SupportedLayout.headerRows,
		SupportedLayout.headerColumns,
		SupportedLayout.horizontalObjects,
		SupportedLayout.verticalObjects,
	];

	// ████████ ██████   █████   ██████ ██   ██ ██ ███    ██  ██████
	//    ██    ██   ██ ██   ██ ██      ██  ██  ██ ████   ██ ██
	//    ██    ██████  ███████ ██      █████   ██ ██ ██  ██ ██   ███
	//    ██    ██   ██ ██   ██ ██      ██  ██  ██ ██  ██ ██ ██    ██
	//    ██    ██   ██ ██   ██  ██████ ██   ██ ██ ██   ████  ██████

	// Last Modified Date tracking system

	private commitLastModified(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		objectAttributePairings: ObjectAttributePairingSet,
	) {
		// TODO
		const turnstile = new Turnstile(Names.changeTrackingLookup, 'document');
		if (turnstile.enter(1000, true)) {
			const changesLookup = StorageManager.document.getStored(
				Names.changeTracking,
			) as MatrixLastModified;

			const changesQueue = StorageManager.document.getStored(
				Names.changeTrackingQueue,
			) as SurgicalChangeQueue;

			const date = new Date().getTime();

			for (const pairing in objectAttributePairings) {
				const object = objectAttributePairings[pairing].object;
				const attribute = objectAttributePairings[pairing].attribute;
				_set(changesLookup, [object, attribute], date);
				changesQueue.push({ object, attribute, date });
			}

			StorageManager.document.store(
				Names.changeTrackingLookup,
				changesLookup,
			);
			StorageManager.document.store(Names.changeTrackingQueue, changesQueue);

			turnstile.exit();
		}
	}

	getLastModified(objectId: string): Record<string, number> | undefined {
		const changes = StorageManager.document.getStored(
			Names.changeTrackingLookup,
		) as MatrixLastModified;
		if (objectId) {
			return changes[objectId] ?? undefined;
		}
	}

	getChangeQueue() {
		return StorageManager.document.getStored(
			Names.changeTrackingQueue,
		) as SurgicalChangeQueue;
	}

	setChangeQueue(queue: SurgicalChangeQueue | {}) {
		StorageManager.document.store(Names.changeTrackingQueue, queue);
	}

	editCallBack(event: GoogleAppsScript.Events.SheetsOnEdit) {
		const cells = [...this.getIterableRange(event.range)];
		const sheet = event.range.getSheet();
		const allObjects = sheet
			.getNamedRanges()
			.filter((namedRange: GoogleAppsScript.Spreadsheet.NamedRange) => {
				if (namedRange.getName().startsWith(Names.ignore)) {
					return false;
				} else if (namedRange.getName().startsWith(Names.object)) {
					return true;
				} else {
					return false;
				}
			});
		const allAttributes = sheet
			.getNamedRanges()
			.filter((namedRange: GoogleAppsScript.Spreadsheet.NamedRange) => {
				if (namedRange.getName().startsWith(Names.ignore)) {
					return false;
				} else if (namedRange.getName().startsWith(Names.attribute)) {
					return true;
				} else {
					return false;
				}
			});

		// check which cells intersect with which objects and attributes
		const objAttrPairings: ObjectAttributePairingSet = cells.map(
			(cell: GoogleAppsScript.Spreadsheet.Range) => {
				const attribute = allAttributes.find(
					(attribute: GoogleAppsScript.Spreadsheet.NamedRange) =>
						this.isRangeContainedIn(cell, attribute.getRange()),
				);
				const object = allObjects.find(
					(object: GoogleAppsScript.Spreadsheet.NamedRange) =>
						this.isRangeContainedIn(cell, object.getRange()),
				);
				return {
					attribute: attribute.getName().split(Names.attribute)[0],
					object: object.getName().split(Names.object)[0],
				};
			},
		);

		this.commitLastModified(sheet, objAttrPairings);
	}
}

type ObjectAttributePairingSet = Array<{
	attribute: string;
	object: string;
}>;

interface MatrixLastModified {
	[object: string]: {
		[attribute: string]: number;
	};
}

export class MatrixError extends Error {
	retry: boolean;
	constructor(message: string) {
		super(message);
		this.name = 'MatrixError';
	}
}
