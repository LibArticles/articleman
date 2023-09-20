import SurgicalEngine from 'lib/surgical-engine';
import StorageManager from 'lib/storage-manager';
import AMObject from './object';
import refTokenizerRules from 'locale/ref-link-tokenizer.json';
import { v4 as uuidv4 } from 'uuid';
import { set as _set, get as _get, has as _has } from 'lodash';

export class LinkManager {
	sharedLinks: Record<string, AMSharedLink>;
	referenceLinks: Record<string, AMReferenceLink>;
	sharedLookupTable: Record<string, string[]>;
	referenceLookupTable: {
		initiators: Record<string, string[]>;
		targets: Record<string, string[]>;
	};
	engine: SurgicalEngine;

	constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		const sharedLinks = StorageManager.get('shared-links');
		const referenceLinks = StorageManager.get('reference-links');

		this.sharedLinks = sharedLinks;
		this.referenceLinks = referenceLinks;

		if (!this.sharedLinks) {
			this.sharedLinks = {};
		}
		if (!this.referenceLinks) {
			this.referenceLinks = {};
		}
	}

	/**
	 * Creates a shared link between two or more objects
	 */
	createSharedLink(linkedAttributes: string[][], ...objects: Array<AMObject>) {
		const ids = objects.map((object) => object.id);
		const uuid: string = uuidv4();

		if (this.sharedLinks[uuid]) {
		}
		this.sharedLinks[uuid] = {
			objects: ids,
			linkedAttributes,
		};
		for (const id of ids) {
			if (!this.sharedLookupTable[id]) {
				this.sharedLookupTable[id] = [];
			}
			this.sharedLookupTable[id].push(uuid);
		}
	}

	getSharedLink(linkID: string) {
		return this.sharedLinks[linkID];
	}

	deleteSharedLink(linkID: string) {
		const link = this.sharedLinks[linkID];
		for (const id of link.objects) {
			this.sharedLookupTable[id].splice(
				this.sharedLookupTable[id].indexOf(linkID),
				1,
			);
		}
		delete this.sharedLinks[linkID];
	}

	updateSharedLink(
		linkID: string,
		{ objects, linkedAttributes }: AMSharedLink,
	) {
		const sharedLink = this.sharedLinks[linkID];
		const lookupTableEntries: Record<string, string[]> = {};
		for (const id of objects) {
			lookupTableEntries[id] = this.sharedLookupTable[id];
		}

		// if the new set of objects is empty, ignore this, but otherwise remove the current link id from the lookup table entries for all objects not included in the new set
		if (objects.length > 0) {
			for (const id of objects) {
				const entry = lookupTableEntries[id];
				if (!entry) {
					entry.splice(entry.indexOf(id), 1);
				}
			}
		}

		this.sharedLinks[linkID] = {
			objects,
			linkedAttributes,
		};
	}

	applyLinksToSheet() {
		const canonical = this.getCanonicalState();

		for (const linkId in canonical) {
			const mainLink = this.sharedLinks[linkId];
			const currentLink = canonical[linkId];

			for (const attributeId in currentLink) {
				const currentAttribute = currentLink[attributeId];
				const objects = mainLink.objects.filter(
					(id) => canonical[linkId][attributeId].object !== id,
				);

				for (const id of objects) {
					this.engine.updateObject({
						id,
						attributes: {
							[attributeId]: currentAttribute,
						},
					});
				}
			}
		}

		this.engine.commit();
	}

	getCanonicalState() {
		// parse change queues to get a list of objects and attributes that need to be updated to match the shared link lists
		const changes = this.engine.getChangeQueue();
		const canonical: {
			[linkId: string]: {
				// the object id that has the most up-to-date change is the value of the attributeId key
				[attributeId: string]: {
					object: string;
					date: number;
				};
			};
		} = {};

		// get the state of each link and point each attribute to the most up-to-date object's version of it
		for (const change of changes) {
			const links = this.sharedLookupTable[change.object];
			// get the attribute id
			for (const linkId of links) {
				const link = this.sharedLinks[linkId];
				for (const attrGroup in link.linkedAttributes) {
					if (attrGroup.includes(change.attribute)) {
						_set(canonical, [linkId, change.attribute], {
							object: change.object,
							date: change.date,
						});
					}
				}
			}
		}

		return canonical;
	}

	resolveSharedLink(object: string | AMObject) {
		const id = typeof object === 'string' ? object : object.id;
		return this.sharedLookupTable[id].map(
			(linkID) => this.sharedLinks[linkID],
		);
	}

	createReferenceLink(initiator: string, target: string) {
		const linkID = uuidv4();
		this.referenceLinks[linkID] = {
			initiator,
			target,
		};
		pushIfPresent(
			this.referenceLookupTable,
			['initiators', initiator],
			linkID,
		);
		pushIfPresent(this.referenceLookupTable, ['targets', target], linkID);
	}

	updateReferenceLink(id: string, { initiator, target }: AMReferenceLink) {
		const old = {
			initiator: this.referenceLinks[id].initiator,
			target: this.referenceLinks[id].target,
		};
		this.referenceLinks[id] = {
			initiator,
			target,
		};
		const initiatorLookup = this.referenceLookupTable.initiators[id];
		const targetLookup = this.referenceLookupTable.targets[id];

		initiatorLookup.splice(initiatorLookup.indexOf(old.initiator), 1);
		targetLookup.splice(targetLookup.indexOf(old.target), 1);

		initiatorLookup.push(initiator);
		targetLookup.push(target);
	}

	deleteReferenceLink(id: string) {
		const old = {
			initiator: this.referenceLinks[id].initiator,
			target: this.referenceLinks[id].target,
		};
		delete this.referenceLinks[id];
		this.referenceLookupTable.initiators[old.initiator].splice(
			this.referenceLookupTable.initiators[old.initiator].indexOf(
				old.initiator,
			),
		);
		this.referenceLookupTable.targets[old.target].splice(
			this.referenceLookupTable.targets[old.target].indexOf(old.target),
		);
	}

	getReferenceLink(id: string) {
		return this.referenceLinks[id];
	}

	resolveReferenceLink(attribute: string, value: string) {}

	private tokenizeInitiatorString(initiator: string) {
		let locale: 'en' | 'es';
		switch (this.engine.backend.spreadsheet.getSpreadsheetLocale()) {
			case 'en':
				locale = 'en';
				break;
			case 'es':
				locale = 'es';
				break;
			default:
				locale = 'en';
		}
		const localizedRules = refTokenizerRules.langs[locale];

		const terms = splitOnTerms(initiator, localizedRules.alwaysSeparateOn);

		// todo: figure out how to trim surrounding whitespace, and make sure that names like "Simon & Schuster" don't get split, or "Simon and Schuster". If it's something like "Yohannan, Tess, Marco and blue", do split on "and", but otherwise don't. Maybe if there's more than one "and", only split on the last one? Like "Simon and Schuster, Yohannan and blue" gets split into ["Simon and Schuster", "Yohannan", "blue"]? same with "&"
	}

	// todo: allow committing of links to storagemanager, finish both reference links and reference backlinks. almost done!!
}

interface AMSharedLink {
	// the objects that are linked
	objects: string[];

	// the attributes that should be synced between them
	// a list of lists of attributes that should always match
	linkedAttributes?: string[][];
}

interface AMReferenceLink {
	// the attribute that should link to one of the objects in the target attribute
	initiator: string;

	// the attribute that should be linked to
	target: string;
}

function pushIfPresent(obj: any, path: string[], item: any) {
	if (_has(obj, path)) {
		let arr = _get(obj, path);
		arr.push(item);
	} else {
		_set(obj, path, [item]);
	}
}

function splitOnTerms(str: string, terms: string[]): string[] {
	let result: string[] = [];
	let startIndex = 0;

	terms.forEach((term) => {
		let index = str.indexOf(term, startIndex);
		if (index !== -1) {
			result.push(str.substring(startIndex, index));
			startIndex = index + term.length;
		}
	});

	result.push(str.substring(startIndex));

	return result;
}
