import SurgicalEngine from "lib/surgical-engine";
import StorageManager from "lib/storage-manager";
import AMObject from "./object";
import { v4 as uuidv4 } from 'uuid';

export class LinkManager {
	sharedLinks: Record<string, AMSharedLink>;
	referenceLinks: AMReferenceLink[];
	lookupTable: Record<string, string>;
	engine: SurgicalEngine;

	constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
		const links = StorageManager.get('links');
		if (!links) {
			StorageManager.set('links', {});
			const links = {};
		}

	}

	linkObjects(shareProperties: boolean, ...objects: Array<AMObject>) {
		const ids = objects.map(object => object.id);
		const uuid: string = uuidv4();
		this.sharedLinks[uuid] = {
			objects: ids,
			shareProperties
		}
		for (const object of objects) {
			this.lookupTable[object.id] = uuid;
		}

	}

	// todo: add getLink, deletelink, updateLink, allow one object to be a part of multiple links, and make sure these can be committed to StorageManager somehow. yee-haw.
}

interface AMSharedLink {
	objects: string[];
	shareProperties: boolean;
}

interface AMReferenceLink {

}
