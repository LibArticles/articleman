import AMGroup from "./group";
import { v4 as uuidv4 } from "uuid";

/*
  # ArticleManObject
  The AMObject class is the one-size-fits-all class for all items managed by Articleman. Article? AMObject. Interview? AMObject. User? AMObject.

  The magic of this class is that it's insanely flexible. No longer do objects themselves have to be changed when a bored editor changes a name, the property name is just a UUID so it just gets remapped at the group level! 

  Yes, it makes programming harder. Maybe it's premature optmization. But I think it'll save me from a pain in the butt later when I inevitably decide to implement a new class field or something. Plus, this allows for the cool data syncing feature to work.
  
  See ./group.ts and ./container.ts for more info.
*/

export default class AMObject {
  attributes: Record<string, any>;
  links: Record<string, Array<string>> = {};
  group: AMGroup;
  id: string;

  constructor({ group, id, attributes }: { group: AMGroup; id: string; attributes: Record<string, any>; }) {
    this.group = group;
    this.id = id;
    this.attributes = attributes;
  }

  linkObjects(...objects: Array<AMObject>) {
    const linkID = uuidv4();
    this.links[linkID] = [];
    this.group.container.linkObjects(this, ...objects);
  }

  // turn all stored data into a JSON object
  crystallize() {
    const data: Record<string, any> = {};
    for (const attribute of Object.keys(this.attributes)) {
      // the links are already stored in the container, it's just extra bloat to have them here. therefore we toss 'em when we crystallize. YOLO.
      data[attribute] = this.attributes[attribute];
      data.id = this.id;
    }
    return data;
  }

  getAttribute(attribute: string) {
    return this.attributes[this.group.mappings[attribute]];
  }
}