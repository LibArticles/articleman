import fastChunkString from '@shelf/fast-chunk-string';
import { Turnstile } from 'lib/concurrency';

class Names {
	static universal = 'ARTICLEMAN_STORAGE_';
	static legend = '_LEGEND';
}

interface Legend {
	length: number;
	type: string;
	note: string;
	digest: string;
}

type StorableValue =
	| string
	| number
	| boolean
	| StorableObject
	| StorableArray
	| null
	| undefined

interface StorableObject extends Record<string, StorableValue> {}
interface StorableArray extends Array<StorableValue> {}

export default class StorageManager {
	static get(key: string, allowBadDigests?: 'UNSAFELY_ALLOW_BAD_DIGESTS' | undefined) {
		const storage = PropertiesService.getDocumentProperties();
		const legend: Legend = JSON.parse(storage.getProperty(Names.universal + key + Names.legend));
		const airlock: Record<string, string> = storage.getProperties();
		// storage.getKeys().filter((k) => k.startsWith(Names.universal + key)).forEach((k) => {
		// 	airlock[k] = JSON.parse(storage.getProperty(k));
		// });

		if (Object.keys(legend).length === 0) {
			return null;
		}

		// TODO: recombine according to legend

		const stringArray: string[] = [];

		for (let i = 0; i < legend.length; i++) {
			stringArray.push(airlock[Names.universal + key + '_' + i]);
		}

		const concatenatedString = stringArray.join('');

		// hash the final object and see if it matches the legend
		const hash = Utilities.computeDigest(
			Utilities.DigestAlgorithm.MD5,
			concatenatedString,
		).map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('')

		if (hash === legend.digest || allowBadDigests === 'UNSAFELY_ALLOW_BAD_DIGESTS') {
			switch (legend.type) {
				case 'STRING':
					return concatenatedString;
				default:
					return JSON.parse(concatenatedString);
			}
		} else if (allowBadDigests !== 'UNSAFELY_ALLOW_BAD_DIGESTS') {
			// TODO: standardize error
			throw new Error(`StorageManager data couldn't be retrieved and/or stored losslessly. The digests don't match. Expected ${legend.digest}, got ${hash}. Use UNSAFELY_ALLOW_BAD_DIGESTS to ignore the digest check.`);

		}
	}

	static save(key: string, value: StorableValue) {
		const turnstile = new Turnstile('storage_manager', 'document');
		console.time('StorageManagerTurnstile');
		if (turnstile.enter(20000)) {
			console.timeEnd('StorageManagerTurnstile');
			console.log(`Went through the turnstile for StorageManager`);

		} else {
			// TODO: standardize error
			throw new Error('Unable to use Turnstile on Storage Manager, Articleman seems dangerously busy.');
		};


		// initialize variables
		let serializedValue: string;
		let dataType = typeof value;

		// serialize the value
		serializedValue = JSON.stringify(value);

		// initialize the airlock and storage
		const airlock: Record<string, string> = {};
		const storage = PropertiesService.getDocumentProperties();

		// compute the hash of the serialized value
		const hash = Utilities.computeDigest(
			Utilities.DigestAlgorithm.MD5,
			serializedValue,
			Utilities.Charset.UTF_8,
		).map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');

		// if the serialized value is too large, split it into multiple values
		let index = 0;
		if (serializedValue.length > 9200) {

			fastChunkString(serializedValue, { size: 9200 }).forEach(
				(chunk) => {
					index++;
					airlock[Names.universal + key + '_' + index] = chunk;

				},
			);

		} else {
			airlock[Names.universal + key] = serializedValue;
		}

		// add the legend
		airlock[Names.universal + key + Names.legend] = JSON.stringify({
			length: index,
			type: dataType,
			note: "!!!!    DO NOT MODIFY THIS ENTRY    !!!!",
			digest: hash,
		});

		storage.setProperties(airlock);
		turnstile.exit();
	}
}
