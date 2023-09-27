import { SurgicalObject } from 'lib/surgical-engine/base/engine';
import AMObject from './object';

export default class MapManager {
	private map: AMMap;

	addTag(className: string) {
		if (!this.map.tags.includes(className)) {
			this.map.tags.push(className);
		}
	}

	removeTag(className: string) {
		const index = this.map.tags.indexOf(className);
		if (index > -1) {
			this.map.tags.splice(index, 1);
		}
	}

	getTags() {
		return this.map.tags;
	}

	tagAttribute(attributeId: string, tagName: string) {
		this.map.maps[attributeId] = tagName;
	}

	untagAttribute(attributeId: string) {
		delete this.map.maps[attributeId];
	}

	getMapForObject(object: AMObject) {
		const mapArray: Record<string, >[] = [];
		for (const attr in object.attributes) {
			if (attr in this.map.maps) {
				mapArray.push(this.map.maps[attr]);
			}
		}
		return mapArray;
	}
}

interface AMMap {
	tags: string[];
	maps: {
		[attribute: string]: string;
	};
}
