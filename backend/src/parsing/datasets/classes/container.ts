import { v4 as uuidv4 } from "uuid";

import AMGroup from "./group";
import AMObject from "./object";

/*
  # ArticleManContainer
  The AMContainer class is the container for every bit of data contained within Articleman's DataSet managemenet system.

  Links are stored in the AMGroup class, as that makes them nice and global and avoids the need to store them in the AMObject class. The object knows the ID of the link, and that's it.

  Caches are just cached lookups 
*/

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

  // link two or more objects to each other
  async linkObjects(...objects: Array<AMObject>) {
    const linkID = uuidv4();
    if (objects.length < 2) {
      return;
    }
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

  // turn all stored data into a JSON object
  crystallize() {
    const groups: Record<string, any> = {};
    for (const groupID of Object.keys(this.groups)) {
      groups[groupID] = this.groups[groupID].crystallize();
    }
    return groups;
  }
  
  // take a container constructor and return a new container
  constructor(input: containerConstructor) {
    this.caches = input.caches;
    this.spreadsheetID = input.spreadsheetID;
    for (const groupID of Object.keys(input.data)) {
      const groupData = input.data[groupID];

      this.groups[groupID] = new AMGroup({ container: this, id: groupID, mappings: input.mappings[groupID], objects: groupData });
    }
  }
  
}

interface containerConstructor {
  caches: Record<string, Record<string, {group: string, index: number}>>,
  mappings: Record<string, Record<string, string>>, 
  links: Record<string, Array<string>>,
  spreadsheetID: string, 
  data: Record<string, Record<string, any>[]>
}