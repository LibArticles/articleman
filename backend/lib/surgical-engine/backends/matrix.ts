/*
  Surgical Engine: Matrix Named Range Search implementation.
  This implementation uses Google Sheets Named Ranges to search for data in a matrix.
*/

import { SupportedLayout, SurgicalBackend, SurgicalChangeset, SurgicalObject, SurgicalTemplate } from "../base/engine";

import { v4 as uuidv4 } from 'uuid';

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
      this.spreadsheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_OBJECT_${id}`, range);
    }
    for (const attr in template.attributes) {
      const range = this.spreadsheet.getRange(template.objects[attr]);
      this.spreadsheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_${attr}`, range);
    }
    for (const sheetName in Object.keys(template.sheetLayouts)) {
      const sheet = this.spreadsheet.getSheetByName(sheetName);
      sheet.addDeveloperMetadata('SURGICAL_ENGINE_MATRIX_LAYOUT', template.sheetLayouts[sheetName]);
    }

    for (const header in template.ignoredAreas.headers) {
      const id = uuidv4();
      const range = this.spreadsheet.getRange(header);
      const sheet = this.spreadsheet;
      sheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_IGNORE_HEADER_${id}`, range);
    }
    for (const general in template.ignoredAreas.generalAreas) {
      const id = uuidv4();
      const range = this.spreadsheet.getRange(general);
      const sheet = this.spreadsheet;
      sheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_IGNORE_GENERAL_${id}`, range);
    }

    return this;
  }

  getObject(id: string) {
    const objectNamedRange = this.spreadsheet.getRangeByName(`SURGICAL_ENGINE_MATRIX_OBJECT_${id}`);
    const sheet = objectNamedRange.getSheet();

    // get all attributes for that sheet
    const attributes = [];
    for (const range in sheet.getNamedRanges()) {
      if (range.startsWith(`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_`)) {
        attributes.push(range);
      }
    }

    const object: Record<string, any> = {}

    for (const attribute in attributes) {
      const attrRange = this.spreadsheet.getRangeByName(attributes[attribute]);
      
      // intersect the objevtNamedRange with each attribute range and get the value, then put it into the object

      const attrColumn = attrRange.getColumn();
      const objRow = objectNamedRange.getRow();
      object[attribute] = sheet.getRange(objRow, attrColumn);
    }
  }

  constructObject(object: Record<string, any>): SurgicalObject {
    
  }

  applyChangeset(changeset: SurgicalChangeset) {
    // for each new attribute add a named range at the specified position
    for (const newAttribute in changeset.create.attributes) {
      const currentChangeset = changeset.create.attributes[newAttribute];
      if (currentChangeset.position.range) {
        const range = this.spreadsheet.getRange(currentChangeset.position.range as string);

        this.spreadsheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_${newAttribute}`, range);

        // otherwise add it at the specified offset from the end.
      } else if (currentChangeset.position.offset
              && currentChangeset.sheetName !== undefined) {
        const developerMetadata = this.spreadsheet.getSheetByName(currentChangeset.sheetName).getDeveloperMetadata();

        // get the layout of the sheet
        const layout = developerMetadata.find(m => m.getKey() === 'SURGICAL_ENGINE_MATRIX_LAYOUT').getValue();

        if (layout === 'vertical') {
          const range = this.spreadsheet.getLastColumn() + currentChangeset.position.offset;
          this.spreadsheet.setNamedRange(`SURGICAL_ENGINE_MATRIX_ATTRIBUTE_${newAttribute}`, range);
        }
      }
    }
  }

  supportedLayouts = [
    SupportedLayout.headerRows,
    SupportedLayout.headerColumns,
    SupportedLayout.horizontalObjects,
    SupportedLayout.verticalObjects
  ]
}