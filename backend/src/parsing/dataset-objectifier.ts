import RawDataSetManager from "./named-dataset";

export default class DataSetManager {

  static async getColumns() {
    const columns: Record<string, Record<string, GoogleAppsScript.Spreadsheet.Range>> = {};
    // turn datasets of each category into objects

    const dataSets = await RawDataSetManager.getDataSets();
    dataSets.forEach((dataSet) => {
      columns[dataSet.getRange().getSheet().getName()]
      [dataSet.getName()
        .replace('AMDS_', '')] = dataSet.getRange();
    });
    return columns;
  }

  static async getObjects() {
    const dataSets = await this.getColumns();
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

  static async updateObject(sheetName: string, object: Record<string, any>, position: number) {
    // get all sheets
    this.getColumns().then((dataSets) => {

      // all we need is this sheet's columns
      const dataSet = dataSets[sheetName];

      // use the object provided to update the data at the position provided
      Object.keys(object).forEach((column) => {
        // get the column's values
        const values = dataSet[column].getValues();

        // update the value at the position provided
        values[position][0] = object[column];

        // update the column's values
        dataSet[column].setValues(values);
      });
    });
  }

  static async getObject(sheetName: string, position: number) {
    // get all sheets
    this.getColumns().then((dataSets) => {

      // all we need is this sheet's columns
      const dataSet = dataSets[sheetName];

      // initialize the object
      const object: Record<string, any> = {};

      // use the object provided to update the data at the position provided
      Object.keys(dataSet).forEach((column) => {
        // get the column's values
        const values = dataSet[column].getValues();

        // update the value at the position provided
        object[column] = values[position][0];
      });

      return object;
    });
  }

  async getDataSet(name: string) {
    return RawDataSetManager.getDataSet(name).then((set) => set.getRange().getValues());
  }

  async updateDataSet(name: string, array: any[][]) {
    return RawDataSetManager.getDataSet(name).then((set) => set.getRange().setValues(array));
  }
};