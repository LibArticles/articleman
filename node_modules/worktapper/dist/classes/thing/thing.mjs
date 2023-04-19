import idGen from '../identifier.mjs';
export default class Thing {
    constructor(name, description = '', tasks = []) {
        this.tasks = [];
        this.name = name;
        this.description = description;
        this.tasks = tasks;
        this.id = idGen('thing');
    }
}
//# sourceMappingURL=thing.mjs.map