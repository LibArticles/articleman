import { isNumber as _isNumber } from "lodash";

export function traverseObject(
	obj: any,
	callback: (property: any, path: string) => void,
) {
	const traverse = (object: any, parentPath: string) => {
		for (let key in object) {
			const value = object[key];
			const path = parentPath ? `${parentPath}.${key}` : key;

			callback(value, path);

			if (typeof value === 'object') {
				traverse(value, path);
			}
		}
	};

	traverse(obj, '');
}

export function classify(value: any) {
	switch (true) {
		case Array.isArray(value):
			return 'array';
		case typeof value === 'object' && value !== null:
			return 'object';
		case typeof value === 'boolean':
			return 'boolean';
		case _isNumber(value):
			return 'number';
		case typeof value === 'string':
			return 'string';
		case value === null:
			return 'null';
		case value === undefined:
			return 'undefined';
		default:
			return 'unknown';

	}
}


