import { sia, desia } from '@valentech/sializer';
import fastChunkString from '@shelf/fast-chunk-string';

export default class CacheManager {
	static async commit(
		objectArray: Record<string, Record<string, any>[]>,
		sheetValues: any[][][],
	) {
		// commit a digest of the entire spreadsheet to the cache, along with all of the data in object array form.
		// if the sheet is too large, split it into multiple cache entries and create an entry with metadata about the split.

		// get the digest of the spreadsheet
		const digest = Utilities.computeDigest(
			Utilities.DigestAlgorithm.SHA_256,
			sheetValues.join(''),
			Utilities.Charset.UTF_8,
		)
			.map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
			.join('');

		// get the cache
		const cache = CacheService.getScriptCache();

		// commit the digest to the 'latestDigest' key
		cache.put('latestDigest', digest);

		// commit the object array to the 'latestObjectArray' key, splitting it up if longer than 100,000 characters
		const objectArrayString = sia(objectArray).toString();

		// split the string into an array of chunks in a quick way
		const chunks = fastChunkString(objectArrayString, {
			size: 100000,
			unicodeAware: false,
		});

		// create an object to store the chunks in
		const cacheChunkObject: Record<string, string> = {};

		// for each chunk, add it to the cache pile
		chunks.forEach((chunk: string, index: number) => {
			cacheChunkObject[`objectCache${index}`] = chunk;
		});

		// add the length of the chunks to the cache pile
		cacheChunkObject.objectCacheLength = chunks.length.toString();

		// commit the cache pile to the cache
		cache.putAll(cacheChunkObject);
	}

	static async checkForChanges() {
		// check if the digest of the spreadsheet has changed since the last time it was committed to the cache

		// if there is no digest in the cache, return false
		if (!CacheService.getScriptCache().get('latestDigest')) return false;

		// get the digest of the spreadsheet
		const sheetHash = Utilities.computeDigest(
			Utilities.DigestAlgorithm.SHA_256,
			SpreadsheetApp.getActiveSpreadsheet()
				.getSheets()
				.map((sheet) => sheet.getDataRange().getValues())
				.join(''),
		)
			.map((byte) => ('0' + (byte & 0xff).toString(16)).slice(-2))
			.join('');

		// return whether or not the sheet hash is the same as the one in the cache, less computationally expensive than comparing the objectified versions to each other
		return sheetHash === CacheService.getScriptCache().get('latestDigest');
	}

	static async getFromCache() {
		// combine all the chunks, make sure they're all there, and return the object in its original form
		const cache = CacheService.getScriptCache();
		const chunks = [];

		// get the chunk length
		const chunkLength = parseInt(cache.get('objectCacheLength'));

		// if one of the chunks is missing, return null, otherwise add it to the chunks array
		for (let i = 0; i < chunkLength; i++) {
			if (!cache.get(`objectCache${i}`)) return null;
			chunks.push(cache.get(`objectCache${i}`));
		}

		// return the objectified version of the chunks, using sializer
		return desia(Buffer.from(chunks.join('')));
	}
}
