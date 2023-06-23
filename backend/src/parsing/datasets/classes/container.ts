import { v4 as uuidv4 } from "uuid";

import AMGroup from "./group";
import AMObject from "./object";

export default class AMContainer {
  spreadsheetID: string;

  groups: Record<string, AMGroup>;

  links: Record<string, Array<string>>;

  caches: Record<string, Record<string, {group: string, index: number}>> = {};

  async getByID(id: string) {
    for (const group of Object.values(this.groups)) {
      const object = group.getByID(id);
      if (object) {
        return object;
      }
    }
  }

  async linkObjects(...objects: Array<AMObject>) {
    const linkID = uuidv4();
    if (!this.links) {
      this.links[linkID] = [];
    }
    for (const object of objects) {
      this.links[linkID].push(object.id);
      for (const p2pObject of objects) {
        if (p2pObject.id !== object.id) {
          p2pObject.links[linkID].push(object.id);
        }
      }

    }
    return linkID;
  }
  

  constructor(input: containerConstructor) {
    this.caches = input.caches;
    this.spreadsheetID = input.spreadsheetID;
    for (const groupID of Object.keys(data)) {
      const groupData = input.data[groupID];

      this.groups[groupID] = new AMGroup(this, groupID, mappings[groupID], groupData);
    }
  }
  
}

interface containerConstructor {
  caches: Record<string, Record<string, {group: string, index: number}>>,
  mappings: Record<string, Record<string, string>>, 
  spreadsheetID: string, 
  data: Record<string, Record<string, any>[]>
}