/*
  Surgical Engine APIs for building new SE backends.
  copyright blue linden 2023
  licensed under the GNU AGPL v3.0 license
  all rights reserved
  (custom licensing is available for use in closed-source projects at https://license.bluelinden.art)

*/

export interface SurgicalBackend<ExtenderClass> {
	// setting up the engine for first time use
	initializeEngine: (
		sheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
	) => ExtenderClass;

	// letting the engine set up an individual sheet, like modifying ranges or rows and columns
	initializeSheet: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => ExtenderClass;

	// put data into the engine, in the form of descriptions of what IDs go where.
	loadTemplate: (template: SurgicalTemplate) => ExtenderClass;

	// get all data by an object id
	getObject: (id: string) => SurgicalObject;

	// get multiple objects
	getObjects: (...ids: string[]) => SurgicalObject[];

	runQuery: (query: SurgicalQuery, source: GoogleAppsScript.Spreadsheet.Sheet | SurgicalObject[]) => SurgicalObject[];

	applyChangeset: (changes: SurgicalChangeset) => ExtenderClass;

	editCallBack?: (event: GoogleAppsScript.Events.SheetsOnEdit) => void;

	changeCallback?: (event: GoogleAppsScript.Events.SheetsOnChange) => void;

	// for the constructor, make sure to set this.spreadsheet to the inputted GoogleAppsScript.Spreadsheet.Spreadsheet value!

	supportedLayouts: SupportedLayout[];

	getLastModified: (object: string) => Record<string, number> | undefined;
	getChangeQueue: () => SurgicalChangeQueue;
	setChangeQueue: (queue: SurgicalChangeQueue | []) => void;
	getObjectsFromSheet: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => SurgicalObject[];
	getSheetForObject: (object: string) => GoogleAppsScript.Spreadsheet.Sheet;
	getSheetForAttribute: (attribute: string) => GoogleAppsScript.Spreadsheet.Sheet;


}

export type SurgicalChangeQueue = {
	object: string,
	attribute: string,
	date: number
}[]


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
	};
}

export interface SurgicalChangeset {
	create?: {
		objects?: {
			[id: string]: {
				isDefinitive?: boolean;
				type: 'append' | 'ingest';
				position?: PositionTypeRangeOrOffset;
				sheetId?: string;
				unIgnore?: boolean
			};
		};

		attributes?: {
			[id: string]: {
				type: 'append' | 'ingest' | 'hidden';
				position?: PositionTypeRangeOrOffset;
				sheetId?: string;
				unIgnore?: boolean;
			};
		};
	};
	update?: {
		objects?: {
			[id: string]: {
				attributes?: Record<string, any>;
				isDefinitive?: boolean;
				position?: { offset: number };
			};
		};

		attributes?: {
			[id: string]: {
				position?: { offset: number };
			};
		};
	};

	delete?: {
		objects?: {
			[id: string]: {
				type: 'splice' | 'ignore' | 'hide';
			}
		};
		attributes?: {
			[id: string]: {
				type: 'splice' | 'ignore' | 'hide';
			}
		}
	};
}

export interface PositionTypeRangeOrOffset {
	range?: string;
	offset?: number;
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
	attributes: Record<string, string | number | boolean>;
	id: string;
	lastModified?: Record<string, number>;
}

export interface SurgicalAttribute {
	data: Record<string, any>;
	ordered: string[];
	id: string;
}

/**
 * The query language Articleman uses
 */
export type SurgicalQuery =
	/**
	 * An array for groups of queries, these are essentially separate searches
	 */
	Array<
		/**
		 * A group of queries, each one has the ability to make or break an object's presence in the outputted group results.
		 */
		Array<
			{
				/**
				 * Name of the attribute to look through
				 */
				attribute: string;
				/**
				 * Type of search to execute
				 */
				match: EqualsSearch | ContainsSearch | BetweenSearch | FilledSearch | IsContainedSearch;
			}
		>
	>;

/**
 * Does a value equal the search value exactly?
 */
export type EqualsSearch = {
	type: "equals";
	value: string | number | boolean;
	polarity: boolean;
}

/**
 * Does a value contain the search value?
 */
export type ContainsSearch = {
	type: "contains";
	value: string;
	polarity: boolean;
}

/**
 * Is a value contained in the search value?
 */
export type IsContainedSearch = {
	type: "iscontained";
	value: string;
	polarity: boolean;
}

/**
 * Is a numeric value between the two numeric search values?
 */
export type BetweenSearch = {
	type: "between";
	values: [number, number];
	polarity: boolean;
}

/**
 * Is an attribute filled?
 */
export type FilledSearch = {
	type: "filled";
	value: boolean;
}

// export const EngineError = {
//   SurgicalEngine: {
//     Generic: 'ErrorNotImplementedYet',
//     ModuleLoading: {
//       CouldNotEval: ''
//     }
//   }
// }
