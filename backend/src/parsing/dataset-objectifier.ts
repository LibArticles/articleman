import RawDataSetManager from "./named-dataset";

export default class DataSetManager {

  getColumns() {
    const dataSets: Record<string, Record<string, GoogleAppsScript.Spreadsheet.Range>> = {};
    // turn datasets of each category into objects
    RawDataSetManager.getDataSets().forEach((dataSet) => {
      dataSets[dataSet.getRange().getSheet().getName()]
      [dataSet.getName()
        .replace('AMDS_', '')] = dataSet.getRange();
    });
    return dataSets;
  }

  getObjects() {
    const dataSets = this.getColumns();
    const objects: Record<string, Record<string, any>[]> = {};

    // get all sheets, iterate through them
    Object.keys(dataSets).forEach((sheetName) => {
      // initialize the sheet's object
      objects[sheetName] = [];

      // get all columns from the sheet
      const dataSet = dataSets[sheetName];

      // get the column names
      const columns = Object.keys(dataSet);

      // for each column at the row's position, add the value to the object
      columns.forEach((column) => {

        // get the values of the column
        const values = dataSet[column].getValues();

        // for each row, add the value to the object
        values.forEach((row, index) => {
          // initialize the object
          if (!objects[sheetName][index]) {
            objects[sheetName][index] = {};
          }
          // add the value to the object, using the column name as the key
          objects[sheetName][index][column] = row[0];
        });
      });
    });

    return objects;
  }

  getDataSet(name: string) {
    return RawDataSetManager.getDataSet(name).getRange().getValues();
  }

  updateDataSet(name: string, array: any[][]) {
    return RawDataSetManager.getDataSet(name).getRange().setValues(array);
  }
};