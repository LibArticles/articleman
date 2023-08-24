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
	SurgicalChangeset,
	SurgicalObject,
	SurgicalTemplate,
} from '../base/engine';

import { Turnstile } from 'lib/concurrency';

import StorageManager from '../../../src/parsing/storage-manager';

import { v4 as uuidv4 } from 'uuid';

class Names {
	static universal = 'SURGICAL_ENGINE_MATRIX_';
	static object = this.universal + 'OBJECT_';
	static attribute = this.universal + 'ATTRIBUTE_';
	static layout = this.universal + 'LAYOUT';
	static ignore = this.universal + 'IGNORE_';
	static header = this.ignore + 'HEADER_';
	static generalIgnore = this.ignore + 'GENERAL_';
	static changeTracking = 'change-tracking';
}

export default class MatrixBackend implements SurgicalBackend<MatrixBackend> {
	spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

	initializeEngine(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		StorageManager.set(Names.changeTracking, { 0: { 0: 0 } });
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
		for (const sheetName in Object.keys(template.sheetLayouts)) {
			const sheet = this.spreadsheet.getSheetByName(sheetName);
			sheet.addDeveloperMetadata(
				Names.layout,
				template.sheetLayouts[sheetName],
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

	getObject(id: string) {
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

		const layout = this.getSheetLayout(sheet);

		const object: Record<string, any> = {};

		const lastModified = this.getLastModified(id) as Record<string, number>;

		for (const attribute in attributes) {
			const attrRange = this.spreadsheet.getRangeByName(
				attributes[attribute],
			);

			// intersect the objectNamedRange with each attribute range and get the value, then put it into the object

			switch (layout) {
				case 'horizontal':
					const attrColumn = attrRange.getColumn();
					const objRow = objectNamedRange.getRow();
					object[attribute] = sheet.getRange(objRow, attrColumn);
					break;

				case 'vertical':
					const attrRow = attrRange.getRow();
					const objColumn = objectNamedRange.getColumn();
					object[attribute] = sheet.getRange(attrRow, objColumn);
					break;
			}

			const attrColumn = attrRange.getColumn();
			const objRow = objectNamedRange.getRow();
			object[attribute] = sheet.getRange(objRow, attrColumn);
		}

		return {
			attributes: object,
			lastModified,
			id,
		};
	}

	applyChangeset(changeset: SurgicalChangeset) {
		// for each new attribute add a named range at the specified position
		for (const newAttributeId in changeset.create.attributes) {
			const currentAttrCreation = changeset.create.attributes[newAttributeId];

			if (currentAttrCreation.position.range) {
				this.ingestNewRangeByNotation(
					currentAttrCreation.position.range,
					'ATTRIBUTE',
					newAttributeId,
				);

				// otherwise add it at the specified offset from the end.
			} else if (currentAttrCreation.sheetName !== undefined) {
				const currentSheet = this.spreadsheet.getSheetByName(
					currentAttrCreation.sheetName,
				);

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
						const range = this.appendAttribute(
							currentSheet,
							newAttributeId,
						);
            this.hideData(newAttributeId, 'attribute');
				}
			}
		}

		for (const newObjectId in changeset.create.objects) {
			const currentObjCreation = changeset.create.objects[newObjectId];
			if (currentObjCreation.sheetName !== undefined) {
				const currentSheet = this.spreadsheet.getSheetByName(
					currentObjCreation.sheetName,
				);
				switch (currentObjCreation.type) {
					case 'append':
						this.appendObject(currentSheet, newObjectId);
						break;
					case 'ingest':
						if (currentObjCreation.position.range) {
							this.ingestNewRangeByNotation(currentObjCreation.position.range, 'OBJECT', newObjectId)
						} else if (currentObjCreation.position.offset) {
							this.ingestNewRangeByOffset(currentSheet, 'OBJECT', currentObjCreation.position.offset, newObjectId)
						}
				}
			}
		}

		for (const attributeUpdateId in changeset.update.attributes) {
			const current
		}
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

	private hideData(id: string, type: 'attribute' | 'object') {
		const namedRange = this.spreadsheet.getRangeByName(
			(type === 'attribute' ? Names.attribute : Names.object) + id,
		);
		const layout = this.getSheetLayout(namedRange.getSheet());

		switch (true) {
			case (layout === 'vertical' && type === 'object') ||
				(layout === 'horizontal' && type === 'attribute'):
				this.spreadsheet.hideColumn(namedRange);
				break;
			case (layout === 'vertical' && type === 'attribute') ||
				(layout === 'horizontal' && type === 'object'):
				this.spreadsheet.hideRow(namedRange);
		}
	}

	private getSheetLayout(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		const layout = sheet
			.getDeveloperMetadata()
			.find((m) => m.getKey() === Names.layout)
			.getValue();

		if (layout !== 'vertical' && layout !== 'horizontal') {
			throw new Error('Invalid layout');
		} else {
			return layout;
		}
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
				throw new Error(
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
	// TODO: Implement

	private commitLastModified(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		objectAttributePairings: ObjectAttributePairingSet,
	) {
		// TODO
		const turnstile = new Turnstile(Names.changeTracking, 'document');
		if (turnstile.enter(1000, true)) {
			const changes = StorageManager.get(
				Names.changeTracking,
			) as MatrixLastModified;

			for (const pairing in objectAttributePairings) {
				const object = objectAttributePairings[pairing].object;
				const attribute = objectAttributePairings[pairing].attribute;
				changes[object][attribute] = new Date().getTime();
			}

			StorageManager.set(Names.changeTracking, changes);

			turnstile.exit();
		}
	}

	private getLastModified(objectId?: string) {
		const changes = StorageManager.get(
			Names.changeTracking,
		) as MatrixLastModified;
		if (objectId) {
			return changes[objectId];
		} else {
			return changes;
		}
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
					attribute: attribute
						.getName()
						.match(new RegExp(Names.attribute + '(.*)'))[0],
					object: object
						.getName()
						.match(new RegExp(Names.object + '(.*)'))[0],
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
