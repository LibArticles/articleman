/*
  Surgical Engine: Matrix Named Range Search implementation.
  This implementation uses Google Sheets Named Ranges to search for data in a matrix.
*/

import {
	SupportedLayout,
	SurgicalBackend,
	SurgicalChangeset,
	SurgicalObject,
	SurgicalTemplate,
} from "../base/engine.js";

import { v4 as uuidv4 } from "uuid";

export default class MatrixBackend implements SurgicalBackend<MatrixBackend> {
	spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

	initializeEngine(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		return this;
	}
	initializeSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		return this;
	}

	getFillableRow(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		return sheet.getLastRow() + 1;
	}

	loadTemplate(template: SurgicalTemplate) {
		for (const id in template.objects) {
			const range = this.spreadsheet.getRange(template.objects[id]);
			this.spreadsheet.setNamedRange(
				`SURGICAL_ENGINE_MATRIX_OBJECT_${id}`,
				range
			);
		}
		for (const attr in template.attributes) {
			const range = this.spreadsheet.getRange(template.objects[attr]);
			this.spreadsheet.setNamedRange(
				`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_${attr}`,
				range
			);
		}
		for (const sheetName in Object.keys(template.sheetLayouts)) {
			const sheet = this.spreadsheet.getSheetByName(sheetName);
			sheet.addDeveloperMetadata(
				"SURGICAL_ENGINE_MATRIX_LAYOUT",
				template.sheetLayouts[sheetName]
			);
		}

		for (const header in template.ignoredAreas.headers) {
			const id = uuidv4();
			const range = this.spreadsheet.getRange(header);
			const sheet = this.spreadsheet;
			sheet.setNamedRange(
				`SURGICAL_ENGINE_MATRIX_IGNORE_HEADER_${id}`,
				range
			);
		}
		for (const general in template.ignoredAreas.generalAreas) {
			const id = uuidv4();
			const range = this.spreadsheet.getRange(general);
			const sheet = this.spreadsheet;
			sheet.setNamedRange(
				`SURGICAL_ENGINE_MATRIX_IGNORE_GENERAL_${id}`,
				range
			);
		}

		return this;
	}

	getObject(id: string) {
		const objectNamedRange = this.spreadsheet.getRangeByName(
			`SURGICAL_ENGINE_MATRIX_OBJECT_${id}`
		);
		const sheet = objectNamedRange.getSheet();

		// get all attributes for that sheet
		const attributes = [];
		for (const range in sheet.getNamedRanges()) {
			if (range.startsWith(`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_`)) {
				attributes.push(range);
			}
		}

		const object: Record<string, any> = {};

		for (const attribute in attributes) {
			const attrRange = this.spreadsheet.getRangeByName(
				attributes[attribute]
			);

			// intersect the objevtNamedRange with each attribute range and get the value, then put it into the object

			const attrColumn = attrRange.getColumn();
			const objRow = objectNamedRange.getRow();
			object[attribute] = sheet.getRange(objRow, attrColumn);
		}

		return {
			attributes: object,
			id,
		};
	}

	applyChangeset(changeset: SurgicalChangeset) {
		// for each new attribute add a named range at the specified position
		for (const newAttribute in changeset.create.attributes) {
			const currentChangeset = changeset.create.attributes[newAttribute];

			if (currentChangeset.position.range) {
				this.ingestNewRangeByNotation(
					currentChangeset.position.range,
					"ATTRIBUTE",
					newAttribute
				);

				// otherwise add it at the specified offset from the end.
			} else if (currentChangeset.sheetName !== undefined) {
				const currentSheet = this.spreadsheet.getSheetByName(
					currentChangeset.sheetName
				);

				const developerMetadata = currentSheet.getDeveloperMetadata();

				// get the layout of the sheet
				const layout = developerMetadata
					.find((m) => m.getKey() === "SURGICAL_ENGINE_MATRIX_LAYOUT")
					.getValue();

				// TODO: throw errors if layout is not found or is incompatible
				if (!(layout === "vertical" || layout === "horizontal")) return;

				switch (currentChangeset.type) {
					case "ingest":
						this.ingestNewRangeByOffset(
							currentSheet,
							"ATTRIBUTE",
							layout,
							currentChangeset.position.offset,
							newAttribute
						);
					case "append":
						switch (layout) {
							case "vertical":
						}
				}
			}
		}

		for (const newObject in changeset.create.objects) {
			const currentChangeset = changeset.create.objects[newObject];
			if (currentChangeset.sheetName !== undefined) {
				const currentSheet = this.spreadsheet.getSheetByName(
					currentChangeset.sheetName
				);
				const developerMetadata = currentSheet.getDeveloperMetadata();
				const layout = developerMetadata
					.find((m) => m.getKey() === "SURGICAL_ENGINE_MATRIX_LAYOUT")
					.getValue();
			}
		}
	}

	// UTILITY FUNCTIONS

	private ingestNewRangeByNotation(
		rangeStr: string,
		type: "ATTRIBUTE" | "OBJECT",
		name: string
	) {
		const range = this.spreadsheet.getRange(rangeStr);

		this.spreadsheet.setNamedRange(
			`SURGICAL_ENGINE_MATRIX_${type}_${name}`,
			range
		);
	}

	private ingestNewRangeByOffset(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		type: "ATTRIBUTE" | "OBJECT",
		layout: "vertical" | "horizontal",
		offset: number,
		name: string
	) {
		switch (layout) {
			// if the layout of the sheet uses columns for objects and rows for attributes
			case "vertical":
				const vRange = this.spreadsheet.getLastColumn() + offset + 1;
				this.spreadsheet.setNamedRange(
					`SURGICAL_ENGINE_MATRIX_${type}_${name}`,
					sheet.getRange(vRange, 1, 1, sheet.getLastColumn())
				);
				break;

			// if the layout of the sheet uses rows for objects and columns for attributes
			case "horizontal":
				const hRange = this.spreadsheet.getLastRow() + offset + 1;
				this.spreadsheet.setNamedRange(
					`SURGICAL_ENGINE_MATRIX_${type}_${name}`,
					sheet.getRange(1, hRange, sheet.getLastRow(), 1)
				);
		}
	}

	getEmptySpace(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		layout: "vertical" | "horizontal",
		tactic: "first-available" | "after-content-end" | "last-available",
		allowAppend: boolean
	) {}

	isRangeIgnored(
		sheet: GoogleAppsScript.Spreadsheet.Sheet,
		range: GoogleAppsScript.Spreadsheet.Range
	) {
		sheet
			.getNamedRanges()
			.filter(
				// filter out any named ranges that don't start with SURGICAL_ENGINE_MATRIX_IGNORE
				(namedRange: GoogleAppsScript.Spreadsheet.NamedRange) => {
					namedRange
						.getName()
						.startsWith(`SURGICAL_ENGINE_MATRIX_IGNORE_`);
				}
			)

			// if the named range and the range are identical
			.forEach((ignoreZone: GoogleAppsScript.Spreadsheet.NamedRange) => {
				if (
					ignoreZone.getRange().getA1Notation() ===
					range.getA1Notation()
				)
					return true;

				// check if the range is contained in an ignore zone.


				// Get the bounds of each range
				const rangeStartRow = range.getRow();
				const rangeStartCol = range.getColumn();
				const rangeEndRow = rangeStartRow + range.getHeight() - 1;
				const rangeEndCol = rangeStartCol + range.getWidth() - 1;

				const ignoreZoneStartRow = ignoreZone.getRange().getRow();
				const ignoreZoneStartCol = ignoreZone.getRange().getColumn();
				const ignoreZoneEndRow =
					ignoreZoneStartRow + ignoreZone.getRange().getHeight() - 1;
				const ignoreZoneEndCol =
					ignoreZoneStartCol + ignoreZone.getRange().getWidth() - 1;

				// Check if range is completely within ignore zone 
				if (
					rangeStartRow >= ignoreZoneStartRow &&
					rangeEndRow <= ignoreZoneEndRow &&
					rangeStartCol >= ignoreZoneStartCol &&
					rangeEndCol <= ignoreZoneEndCol
				) {
					return true;
				} else {
				  return false;
        }
			});

	}

	supportedLayouts = [
		SupportedLayout.headerRows,
		SupportedLayout.headerColumns,
		SupportedLayout.horizontalObjects,
		SupportedLayout.verticalObjects,
	];
}
