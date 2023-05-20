import { sia, desia } from 'sializer';

class CacheManager {
  commit(objectArray: Record<string, Record<string, any>[]>) {
    // commit a digest of the entire spreadsheet to the cache, along with all of the data in object array form.
    // if the sheet is too large, split it into multiple cache entries and create an entry with metadata about the split.

    // get the spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // get all values from all sheets
    const values = spreadsheet.getSheets().map((sheet) => sheet.getDataRange().getValues());

    // get the digest of the spreadsheet
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, values.join(''), Utilities.Charset.UTF_8).map((byte) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');

    // get the cache
    const cache = CacheService.getScriptCache();

    // commit the digest to the 'latestDigest' key
    cache.put('latestDigest', digest);

    // commit the object array to the 'latestObjectArray' key, splitting it up if longer than 100,000 characters
    const objectArrayString = sia(objectArray);

    if (objectArrayString.length > 100000) {
      // split the string into an array of chunks
      const chunks = objectArrayString.match(/.{1,100000}/g);

    }
  }
}