import Sializer from '@valentech/sializer';
import fastChunkString from '@shelf/fast-chunk-string';

type StorableValue = string | number | boolean | StorableObject | StorableArray | Blob | Date | null | undefined | Set<any> | Map<string, any>;

interface StorableObject extends Record<string, StorableValue> {}
interface StorableArray extends Array<StorableValue> {}

export default class StorageManager {
  static async getKey(key: string) {
    
  }

  static async save(key: string, value: StorableValue) {
    const serializedValue = Sializer.sia(value).toString();

    const airlock: Record<string, string> = {};
    const storage = PropertiesService.getScriptProperties();
    
    // if the serialized value is too large, split it into multiple values
    if (serializedValue.length > 9200) {
      let index = 0;
      fastChunkString(serializedValue, {size: 9200}).forEach((chunk, index) => {
        airlock[`ARTICLEMAN_STORAGE_${key}_${index}`] = chunk;
        index++;
      });
      airlock[`ARTICLEMAN_STORAGE_${key}_LEGEND`] = index.toString();
    } else {
      airlock[`ARTICLEMAN_STORAGE_${key}`] = serializedValue;
    }

    storage.setProperties(airlock);

  }
}