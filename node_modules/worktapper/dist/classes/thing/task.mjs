import idGen from '../identifier.mjs';
export default class Task {
    constructor(name, description = '') {
        this.doers = [];
        this.name = name;
        this.description = description;
        this.id = idGen('task');
    }
}
//# sourceMappingURL=task.mjs.map