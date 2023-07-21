/*
  # The Surgical Engine
  Metadata backend

  Why use named ranges when you can use the DeveloperMetadata feature built right into Google Sheets?

  This should be way faster and much less computationally expensive.


*/

export default class MetadataBackend {
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

  newColumn(input: MDataDefinition) {
    const range = this.spreadsheet.getRange(input.range);
    range.getCell(1,1).setValue(input.identifier);
    range.addDeveloperMetadata('SURGICAL_ENGINE_COLUMN_ID', input.identifier);
  }

  newRow(input: MDataDefinition) {
    const range = this.spreadsheet.getRange(input.range);
    range.getCell(1,1).setValue(input.identifier);
    range.addDeveloperMetadata('SURGICAL_ENGINE_ROW_ID', input.identifier);
  }

  refresh() {
    for (const sheet in this.spreadsheet.getSheets()) {
      
    }
  }

  initialize(sheetId: number) {
    const sheet = this.getSheetById(sheetId);
    if (sheet.getRange('A1').getValue() !== 'ARTICLEMAN_SURGICAL_ENGINE') {
      sheet.insertRowBefore(1);
      sheet.insertColumnBefore(1);
      sheet.getRange('A1').setValue('ARTICLEMAN_SURGICAL_ENGINE');
    }
  }

  private getSheetById(id: number) {
    return this.spreadsheet.getSheets().filter(
      function(s) {return s.getSheetId() === id;}
    )[0];
  }
}

type MDataDefinition = {
  identifier: string;
  range: string;
}