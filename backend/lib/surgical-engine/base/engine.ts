/*
  Surgical Engine APIs for building new SE backends.
  copyright blue linden 2023
  licensed under the GNU AGPL v3.0 license
  all rights reserved
  (custom licensing is available for use in closed-source projects at https://license.bluelinden.art)

*/

export interface SurgicalBackend<ExtenderClass> {
  // setting up the engine for first time use
  initializeEngine: (sheet: GoogleAppsScript.Spreadsheet.Spreadsheet) => ExtenderClass;

  // letting the engine set up an individual sheet, like modifying ranges or rows and columns
  initializeSheet: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => ExtenderClass;

  // put data into the engine, in the form of descriptions of what IDs go where.
  loadTemplate: (template: SurgicalTemplate) => ExtenderClass;

  // get all data by an object id
  getObject: (id: string) => SurgicalObject;

  runQuery: (query: SurgicalQuery | SurgicalObject[]) => SurgicalObject[];

  applyChangeset: (changes: SurgicalChangeset) => ExtenderClass;

  supportedLayouts: (SupportedLayout)[];
}

export interface SurgicalTemplate {
  // the key is the ID and the value is the range.
  objects: Record<string, string>;
  attributes: Record<string, string>;

  // is this template supposed to override all other data?
  isDefinitive: boolean;

  sheetLayouts: Record<string, 'vertical' | 'horizontal'>;

  ignoredAreas: {
    headers: string[];
    generalAreas: string[];
  }
}

export interface SurgicalChangeset {
  create?: {
    objects?: {

      [id: string]: {
        attributes?: Record<string, any>;
        isDefinitive?: boolean;
        type: 'append' | 'ingest';
        position?: {offset: number} | {range: string};
        sheetName?: number;
      }
    },

    attributes?: {
      [id: string]: {
        type: 'append' | 'ingest' | 'hidden';
        position?: {offset: number} | {range: string};
        sheetName?: string;
      }
    },
  }
  update?: {
    objects?: {
      [id: string]: {
        attributes?: Record<string, any>;
        isDefinitive?: boolean;
        position?: {offset?: number,
                    range?: string};
      }; 
    },

    attributes?: {
      [id: string]: {
        position?: Record<'offset' | 'position', number | string>;
      };
      
    }
  }

  delete?: {
    objects?: Array<{
      id: string;
      type: 'splice' | 'ignore' | 'hide' | 'mask';
    }>;
    attributes?: Array<{
      id: string;
      type: 'splice' | 'ignore' | 'hide' | 'mask';
    }>;
  }
}


// used to check for compatibility when switching backends
export enum SupportedLayout {
  // can objects be stored as rows?
  horizontalObjects = 'horizontal-objects',

  // can objects be stored as columns?
  verticalObjects = 'vertical-objects',

  // can rows be marked as headers and be permanently ignored?
  headerRows = 'header-rows',

  // can columns be marked as headers and be permanently ignored?
  headerColumns = 'header-columns',

  // multisheet support
  multisheet = 'multisheet',

  // side-by-side object support (can multiple object groups be stored in a single sheet?)
  sideBySide = 'side-by-side',
}

export interface SurgicalObject {
  attributes: Record<string, any>;
  id: string;
  modify: (attributes: Record<string, any>) => SurgicalObject;
  remove: () => void;
}

export interface SurgicalAttribute {
  data: Record<string, any>;
  ordered: string[];
  id: string;
  modify: (attributes: Record<string, any>) => SurgicalAttribute;
  remove: () => void;
}

export type SurgicalQuery = 
  Array<{
    filters: Array<{
      searchType: 'contains' | 'equals',
      mandatory: boolean,
      polarity: boolean,
      query: {
        [attributeId: string]: string | number | boolean;
      }
    }>;
  }>;