/*
  The Surgical Engine
  copyright blue linden 2023

  A better, more reliable way to manipulate spreadsheet data logically, only updating and fetching data as needed.
*/

import { injectable, inject } from 'inversify';
import type MatrixBackend from './backends/matrix';
import Service from 'src/dependencies';
import type {
	SurgicalChangeset,
	SurgicalChangeQueue,
	PositionTypeRangeOrOffset,
	SurgicalQuery,
	EqualsSearch,
	ContainsSearch,
	BetweenSearch,
	FilledSearch,
	SurgicalTemplate,
	SurgicalObject,
	IsContainedSearch,
} from './base/engine';

@injectable()
export default class SurgicalEngine {
	autoCommit: boolean;
	changeset: SurgicalChangeset;

	@inject(Service.Matrix)
	backend: MatrixBackend;

	newQuery(source: GoogleAppsScript.Spreadsheet.Sheet | SurgicalObject[]) {
		return new QueryGenerator(source, this);
	}

	newObject(input: ObjectCreation) {
		this.changeset.create.objects[input.id] = {
			position: input.position,
			type: input.type,
			sheetId: input.sheetId ?? undefined,
		};
		this.changeset.update.objects[input.id] = {
			attributes: input.attributes ?? {},
			isDefinitive: input.isDefinitive ?? false,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	newAttribute(input: AttributeCreation) {
		this.changeset.create.attributes[input.id] = {
			position: input.position,
			type: input.type,
			sheetId: input.sheetId,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	updateObject(input: ObjectUpdate) {
		this.changeset.update.objects[input.id] = {
			position: input.position,
			attributes: input.attributes ?? {},
			isDefinitive: input.isDefinitive ?? false,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	updateAttribute(input: AttributeUpdate) {
		this.changeset.update.attributes[input.id] = {
			position: input.position,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	deleteObject(input: DataDelete) {
		this.changeset.delete.objects[input.id] = {
			type: input.type,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	deleteAttribute(input: DataDelete) {
		this.changeset.delete.attributes[input.id] = {
			type: input.type,
		};
		if (this.autoCommit) {
			this.commit();
		}
	}

	commit() {
		if (!this.autoCommit) {
			this.backend.applyChangeset(this.changeset);
		} else if (
			!!Object.keys(this.changeset.create).length ||
			!!Object.keys(this.changeset.update).length ||
			!!Object.keys(this.changeset.delete).length
		) {
			this.backend.applyChangeset(this.changeset);
			this.changeset = {
				create: {},
				update: {},
				delete: {},
			};
		} else {
			console.info('No changes to commit.');
		}
	}

	getAllObjectsForSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		return this.backend.getObjectsFromSheet(sheet);
	}

	getObject(id: string) {
		return this.backend.getObject(id);
	}

	getObjects(...ids: string[]) {
		return this.backend.getObjects(...ids);
	}

	firstRun() {
		this.backend.initializeEngine(this.backend.spreadsheet);
	}

	initializeSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		this.backend.initializeSheet(sheet);
	}

	loadTemplate(template: SurgicalTemplate) {
		this.backend.loadTemplate(template);
	}

	editCallback(event: GoogleAppsScript.Events.SheetsOnEdit) {
		if (this.backend.editCallBack) {
			this.backend.editCallBack(event);
		}
	}

	changeCallBack(event: GoogleAppsScript.Events.SheetsOnChange) {
		// if (this.backend.changeCallBack) {
		// 	this.backend.changeCallBack(event);
		// }
	}

	getLastModifiedForObject(object: string) {
		return this.backend.getLastModified(object);
	}

	getChangeQueue() {
		return this.backend.getChangeQueue();
	}

	setChangeQueue(queue: SurgicalChangeQueue) {
		this.backend.setChangeQueue(queue);
	}

	getSheetForObject(object: string) {
		return this.backend.getSheetForObject(object);
	}

	getSheetForAttribute(attribute: string) {
		return this.backend.getSheetForAttribute(attribute);
	}

	getSheetById(id: string) {
		const sheets = this.backend.spreadsheet.getSheets();
		const sheet = sheets.find((s) => s.getSheetId().toString() === id);
		return sheet;
	}
}

class QueryGenerator {
	groups: SearchGroup[];
	engine: SurgicalEngine;
	query: SurgicalQuery = [];
	source: GoogleAppsScript.Spreadsheet.Sheet | SurgicalObject[];

	addGroup() {
		const group = new SearchGroup();
		this.groups.push(group);
		return group;
	}
	run() {
		for (const group of this.groups) {
			this.query.push(group.searchGroup);
		}
		this.groups = [];
		return this.engine.backend.runQuery(this.query, this.source);
	}

	constructor(
		source: GoogleAppsScript.Spreadsheet.Sheet | SurgicalObject[],
		engine: SurgicalEngine,
	) {
		this.source = source;
		this.groups = [];
		this.engine = engine;
	}
}

class SearchGroup {
	searchGroup: /**
	 * A group of queries, each query has the ability to make or break an object's presence in the outputted group results.
	 */
	Array<{
		/**
		 * Name of the attribute to look through
		 */
		attribute: string;
		/**
		 * Type of search to execute
		 */
		match:
			| EqualsSearch
			| ContainsSearch
			| BetweenSearch
			| FilledSearch
			| IsContainedSearch;
	}>;

	addEqualsSearch(
		attribute: string,
		value: string | number | boolean,
		polarity: boolean = true,
	) {
		this.searchGroup.push({
			attribute,
			match: {
				type: 'equals',
				value,
				polarity,
			},
		});
	}

	addContainsSearch(
		attribute: string,
		value: string,
		polarity: boolean = true,
	) {
		this.searchGroup.push({
			attribute,
			match: {
				type: 'contains',
				value,
				polarity,
			},
		});
	}

	addIsContainedSearch(
		attribute: string,
		value: string,
		polarity: boolean = true,
	) {
		this.searchGroup.push({
			attribute,
			match: {
				type: 'iscontained',
				value,
				polarity,
			},
		});
	}

	addBetweenSearch(
		attribute: string,
		values: [number, number],
		polarity: boolean = true,
	) {
		this.searchGroup.push({
			attribute,
			match: {
				type: 'between',
				values,
				polarity,
			},
		});
	}

	addFilledSearch(attribute: string, value: boolean) {
		this.searchGroup.push({
			attribute,
			match: {
				type: 'filled',
				value,
			},
		});
	}
}

interface ObjectCreation {
	id: string;
	position: PositionTypeRangeOrOffset;
	attributes?: Record<string, any>;
	isDefinitive?: boolean;
	type: 'append' | 'ingest';
	sheetId?: string;
}

interface AttributeCreation {
	type: 'append' | 'ingest' | 'hidden';
	position?: PositionTypeRangeOrOffset;
	sheetId?: string;
	id: string;
}

interface ObjectUpdate {
	id: string;
	attributes?: Record<string, any>;
	isDefinitive?: boolean;
	position?: { offset: number };
}

interface AttributeUpdate {
	id: string;
	position: { offset: number };
}

interface DataDelete {
	id: string;
	type: 'splice' | 'ignore' | 'hide';
}
