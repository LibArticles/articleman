export default class Metadata {
  type: string;
  id: string;
  private _value: unknown;

  constructor(type: string, value: unknown) {
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
  set value(value: unknown) {
    if (typeof(value) !== this.type){
      throw new Error(`Trait must be of type ${this.type}`);
    }
    this._value = value;
  }
}
