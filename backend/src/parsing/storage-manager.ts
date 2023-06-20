import fastChunkString from '@shelf/fast-chunk-string';

type StorableValue = string | number | boolean | StorableObject | StorableArray | Blob | Date | null | undefined | Set<any> | Map<string, any>;

interface StorableObject extends Record<string, StorableValue> {}
interface StorableArray extends Array<StorableValue> {}

export default class StorageManager {
  static async getKey(key: string) {
    
  }

  static async save(key: string, value: StorableValue) {

    // initialize variables
    let serializedValue: string;
    let dataType: string;

    // serialize the value depending on its type
    switch (typeof value) {
      case "string":
        serializedValue = value as string;
        dataType = "string";
      case "number":
        serializedValue = (value as number).toString();
        dataType = "number";
      case "boolean":
        serializedValue = (value as boolean).toString();
        dataType = "boolean";
      case "object" || "array":
        serializedValue = JSON.stringify(value as StorableObject | StorableArray);
        dataType = "object";
    }

    // initialize the airlock and storage
    const airlock: Record<string, string> = {};
    const storage = PropertiesService.getScriptProperties();

    // compute the hash of the serialized value
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, serializedValue, Utilities.Charset.UTF_8);
    
    // if the serialized value is too large, split it into multiple values
    if (serializedValue.length > 9200) {
      let index = 0;
      fastChunkString(serializedValue, {size: 9200}).forEach((chunk, index) => {
        airlock[`ARTICLEMAN_STORAGE_${key}_${index}`] = chunk;
        index++;
      });
      airlock[`ARTICLEMAN_STORAGE_${key}_LEGEND`] = JSON.stringify({
        length: index,
        type: dataType,
        note: "DO NOT MODIFY THIS VALUE UNLESS YOU REEEEALLLY KNOW WHAT YOU'RE DOING! CHANGING THIS VALUE COULD COMPLETELY BREAK ARTICLEMAN AND REQUIRE A RESET OF ALL DATA!",
        digest: hash,
      });
    } else {
      airlock[`ARTICLEMAN_STORAGE_${key}`] = serializedValue;
    }

    storage.setProperties(airlock);

  }
}