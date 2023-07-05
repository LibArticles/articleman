import AMObject from "./object";
import AMContainer from "./container";

/*
  # ArticleManGroup
  The AMGroup class is a container of AMObject instances. A container is a group of objects. They are two different things and I don't know how to explain that in a way that makes any sense.

  Internally, all objects are stored using their ID as an object key, not in an array. This allows for O(1) lookups, and O(n) otherwise. Lookups are more important in this case, so that's what's being prioritized.

  The data can also be accessed by the 'iterable' getter, in case a user wants to iterate over all objects in the group, for a query or something. I try to avoid looping whenever possible, because that quickly turns into an O(n^2) problem. AKA a big O no. 

  I will see myself out.


*/

export default class AMGroup {
  // the ID of a group, representing a sheet in a spreadsheet
  id: string;

  // the property name to attribute ID mappings of the group
  mappings: Record<string, string>;

  // the order of each item in the group
  positions: Array<string>;

  // the objects in the group
  objects: Record<string, AMObject>;

  // the container of the group
  container: AMContainer;
  

  // gets an object by ID
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

  // turn all stored data into a JSON object
  crystallize() {
    const objects = [];
    for (const object of this.iterable) {
      objects.push(object.crystallize());
    }
    return objects;
  }

  addObject({ id, position, attributes }: { id: string; position: number | 'first' | 'last'; attributes: Record<string, any>; }) {
    this.objects[id] = new AMObject({ group: this, id, attributes });
    if (position === 'first') {
      this.positions.unshift(id);
    } else if (position === 'last') {
      this.positions.push(id);
    } else if (typeof position === 'number') {
      this.positions.splice(position, 0, id);
    }
  }

  get iterable() {
    const objects = [];
    for (const id of this.positions) {
      objects.push(this.getByID(id));
    }
    return objects;
  }

  constructor({ container, id, mappings, objects }: { container: AMContainer; id: string; mappings: Record<string, string>; objects: Record<string, any>[]; }) {
    this.container = container;
    this.id = id;
    this.mappings = mappings;
    for (const object of objects) {
      const id = object.id;
      delete object.id;
      this.addObject({ id, position: 'last', attributes: object });
    }
  }
}