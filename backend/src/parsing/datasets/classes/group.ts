import AMObject from "./object";
import AMContainer from "./container";

export default class AMGroup {
  id: string;
  mappings: Record<string, string>;
  objects: Record<string, AMObject>;
  container: AMContainer;
  
  getByID(id: string) {
    return this.objects[id];
  }

  findMatchingObjects(query: Record<string, any>) {
    const matches: AMObject[] = [];
    for (const object of this.iterable) {
      let match = true;
      for (const key of Object.keys(query)) {
        if (object.getAttribute(key) !== query[key]) {
          match = false;
          break;
        }
      }
      if (match) {
        matches.push(object);
      }
    }
    return matches;
  }

  addObject(id: string, attributes: Record<string, any>) {
    this.objects[id] = new AMObject(this, id, attributes);
  }

  get iterable() {
    return Object.values(this.objects);
  }

  constructor(container: AMContainer, id: string, mappings: Record<string, string>, objects: Record<string, any>[]) {
    this.container = container;
    this.id = id;
    this.mappings = mappings;
    for (const object of objects) {
      this.addObject(object.id, object);
    }
  }
}