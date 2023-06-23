import AMGroup from "./group";
import { v4 as uuidv4 } from "uuid";

export default class AMObject {
  attributes: Record<string, any>;
  links: Record<string, Array<string>> = {};
  group: AMGroup;
  id: string;

  constructor(group: AMGroup, id: string, attributes: Record<string, any>) {
    this.group = group;
    this.id = id;
    this.attributes = attributes;
  }

  linkObjects(...objects: Array<AMObject>) {
    const linkID = uuidv4();
    this.links[linkID] = [];
    this.group.container.linkObjects(this, ...objects);
  }

  getAttribute(attribute: string) {
    return this.attributes[this.group.mappings[attribute]];
  }
}