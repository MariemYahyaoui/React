export default class Product {
  constructor({ id, name, reference }) {
    this.id = String(id);
    this.name = name;
    this.reference = reference || "";
  }
}
