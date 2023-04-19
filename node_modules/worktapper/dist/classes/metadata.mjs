export default class Metadata {
    constructor(type, value) {
        this.type = type;
        this._value = value;
        // id is an eight character random string
        this.id = Math.random().toString(36).substring(2, 10);
    }
    clear() {
        this.type = '';
        this.value = '';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        if (typeof (value) !== this.type) {
            throw new Error(`Trait must be of type ${this.type}`);
        }
        this._value = value;
    }
}
//# sourceMappingURL=metadata.mjs.map