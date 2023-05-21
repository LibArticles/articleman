import { sia, desia } from 'sializer';
import fastChunkString from '@shelf/fast-chunk-string';

class CacheManager {
  static async commit(objectArray: Record<string, Record<string, any>[]>, sheetValues: [][][]) {
    // commit a digest of the entire spreadsheet to the cache, along with all of the data in object array form.
    // if the sheet is too large, split it into multiple cache entries and create an entry with metadata about the split.

    // get the digest of the spreadsheet
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 
      sheetValues.join(''), 
      Utilities.Charset.UTF_8).map((byte) => (
        '0' + (byte & 0xFF).toString(16)
        ).slice(-2)).join('');

    // get the cache
    const cache = CacheService.getScriptCache();

    // commit the digest to the 'latestDigest' key
    cache.put('latestDigest', digest);

    // commit the object array to the 'latestObjectArray' key, splitting it up if longer than 100,000 characters
    const objectArrayString = sia(objectArray);

    // split the string into an array of chunks in a quick way
    const chunks = fastChunkString(objectArrayString, {size:100000, unicodeAware: false});

    
    const cacheChunkObject: Record<string, string> = {};

    chunks.forEach((chunk: string, index: number) => {
      cacheChunkObject[`objectCache${index}`] = chunk;
    });

    cacheChunkObject.objectCacheLength = chunks.length.toString();

    cache.putAll(cacheChunkObject);
  }

  static async check() {
    if(!CacheService.getScriptCache().get('latestDigest')) return false;
    const sheetHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 
      SpreadsheetApp.getActiveSpreadsheet().getSheets()
      .map((sheet) => sheet.getDataRange().getValues()).join(''))
      .map((byte) => (
        '0' + (byte & 0xFF).toString(16)
      ).slice(-2)).join('');

    return sheetHash === CacheService.getScriptCache().get('latestDigest');
  }

  static async getFromCache() {
    // combine all the chunks, make sure they're all there, and return the object in its original form
    const cache = CacheService.getScriptCache();
    const chunks = [];
    const chunkLength = parseInt(cache.get('objectCacheLength'));
    for(let i = 0; i < chunkLength; i++) {
      if (!cache.get(`objectCache${i}`)) return null;
      chunks.push(cache.get(`objectCache${i}`));
    }
    return desia(chunks.join(''));
  }
}