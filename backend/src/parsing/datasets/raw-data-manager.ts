export default class RawDataSetManager {
  static async getDataSets() {
    // get all named ranges
    return SpreadsheetApp.getActiveSpreadsheet().getNamedRanges().filter((set) => {
      return (
        // if the named range has the AMDS_ prefix
        set.getName().startsWith('AMDS_') && (
          // if the named range has the articlemanManagedDataset metadata
          set.getRange().getDeveloperMetadata().filter((metadata) => 
            metadata.getKey() === 'articlemanManagedDataset' &&
            metadata.getValue() === 'true'
          ).length > 0
        )
      );
    })
  }
  static async getDataSet(name: string) {
    return SpreadsheetApp.getActiveSpreadsheet().getNamedRanges().filter((set) => {
      return (
        // if the named range has the same name
        set.getName() === `AMDS_${name}` && (
          // if the named range has the articlemanManagedDataset metadata
          set.getRange().getDeveloperMetadata().filter((metadata) => 
            metadata.getKey() === 'articlemanManagedDataset' &&
            metadata.getValue() === 'true'
          ).length > 0
        )
      );
    })[0];
  }



  static async createDataSet(name: string, range: string) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const dataSet = sheet.getRange(range).addDeveloperMetadata('articlemanManagedDataset', 'true');
    
    sheet.setNamedRange(`AMDS_${name}`, dataSet);
    return dataSet;
  }

  static deleteDataSet(name: string) {
    SpreadsheetApp.getActiveSpreadsheet().removeNamedRange(`AMDS_${name}`);
  }

  static renameDataSet(name: string, newName: string) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const dataSet = sheet.getNamedRanges().filter((set) => set.getName() === `AMDS_${name}`)[0];
    dataSet.setName(`AMDS_${newName}`);
    return dataSet;
  }

  static updateDataSetRange(name: string, range: string) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const dataSet = sheet.getNamedRanges().filter((set) => set.getName() === `AMDS_${name}`)[0];

    // remove the old range's dev metadata
    dataSet.getRange().getDeveloperMetadata().filter((metadata) =>
      metadata.getKey() === 'articlemanManagedDataset' &&
      metadata.getValue() === 'true'
    )[0].remove();

    // set the new range and add the dev metadata
    dataSet.setRange(sheet.getRange(range));
    dataSet.getRange().addDeveloperMetadata('articlemanManagedDataset', 'true');
    return dataSet;
  }
}