import { SurgicalObject } from "lib/surgical-engine/base/engine";

export default class AMObject {
	attributes: Record<string, any>;
	lastModified?: Record<string, number>;
	id: string;
	links: Array<string>;

	constructor(object: SurgicalObject) {
		this.lastModified = object.lastModified;
		this.attributes = object.attributes;
		this.id = object.id;

	}
}
